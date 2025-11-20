import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { useConfiguration } from '../../context/configurationContext';

import { FormattedMessage, intlShape, useIntl } from '../../util/reactIntl';
import {
  propTypes,
  DATE_TYPE_DATE,
  DATE_TYPE_DATETIME,
  LINE_ITEM_NIGHT,
  LINE_ITEM_HOUR,
  LISTING_UNIT_TYPES,
  STOCK_MULTIPLE_ITEMS,
  AVAILABILITY_MULTIPLE_SEATS,
} from '../../util/types';
import { subtractTime } from '../../util/dates';
import {
  TX_TRANSITION_ACTOR_CUSTOMER,
  TX_TRANSITION_ACTOR_PROVIDER,
  resolveLatestProcessName,
  getProcess,
  isBookingProcess,
} from '../../transactions/transaction';

import { getMarketplaceEntities } from '../../ducks/marketplaceData.duck';
import { isScrollingDisabled } from '../../ducks/ui.duck';
import {
  H2,
  Avatar,
  NamedLink,
  NotificationBadge,
  Page,
  PaginationLinks,
  TabNav,
  IconSpinner,
  TimeRange,
  UserDisplayName,
  LayoutSideNavigation,
} from '../../components';

import TopbarContainer from '../../containers/TopbarContainer/TopbarContainer';
import FooterContainer from '../../containers/FooterContainer/FooterContainer';
import NotFoundPage from '../../containers/NotFoundPage/NotFoundPage';

import { stateDataShape, getStateData } from './InboxPage.stateData';
import css from './InboxPage.module.css';
import InboxView from '../../components/InboxView';
import CreateQuoteForm from '../../components/CustomComponent/CreateQuoteForm';
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min';
import { createProposal, fetchTrxMessages, sendTxMessage } from '../TransactionPage/TransactionPage.duck';
import OrderView from '../../components/CustomComponent/OrderView';
import OrderDisplayView from '../../components/CustomComponent/OrderDisplayView';
import OfferDisplayView from '../../components/CustomComponent/OfferDisplayView';
import QuoteAcceptedView from '../../components/CustomComponent/QuoteAcceptedView';
import BookingsPage from '../../components/CustomComponent/BookingsPage';
import CancelBooking from '../../components/CustomComponent/CancelBooking';

// Check if the transaction line-items use booking-related units
const getUnitLineItem = lineItems => {
  const unitLineItem = lineItems?.find(
    item => LISTING_UNIT_TYPES.includes(item.code) && !item.reversal
  );
  return unitLineItem;
};

// Booking data (start & end) are bit different depending on display times and
// if "end" refers to last day booked or the first exclusive day
const bookingData = (tx, lineItemUnitType, timeZone) => {
  // Attributes: displayStart and displayEnd can be used to differentiate shown time range
  // from actual start and end times used for availability reservation. It can help in situations
  // where there are preparation time needed between bookings.
  // Read more: https://www.sharetribe.com/api-reference/marketplace.html#bookings
  const { start, end, displayStart, displayEnd } = tx.booking.attributes;
  const bookingStart = displayStart || start;
  const bookingEndRaw = displayEnd || end;

  // When unit type is night, we can assume booking end to be inclusive.
  const isNight = lineItemUnitType === LINE_ITEM_NIGHT;
  const isHour = lineItemUnitType === LINE_ITEM_HOUR;
  const bookingEnd =
    isNight || isHour ? bookingEndRaw : subtractTime(bookingEndRaw, 1, 'days', timeZone);

  return { bookingStart, bookingEnd };
};

const BookingTimeInfoMaybe = props => {
  const { transaction, ...rest } = props;
  const processName = resolveLatestProcessName(transaction?.attributes?.processName);
  const process = getProcess(processName);
  const isInquiry = process.getState(transaction) === process.states.INQUIRY;

  if (isInquiry) {
    return null;
  }

  const hasLineItems = transaction?.attributes?.lineItems?.length > 0;
  const unitLineItem = hasLineItems
    ? transaction.attributes?.lineItems?.find(
        item => LISTING_UNIT_TYPES.includes(item.code) && !item.reversal
      )
    : null;

  const lineItemUnitType = unitLineItem ? unitLineItem.code : null;
  const dateType = lineItemUnitType === LINE_ITEM_HOUR ? DATE_TYPE_DATETIME : DATE_TYPE_DATE;

  const timeZone = transaction?.listing?.attributes?.availabilityPlan?.timezone || 'Etc/UTC';
  const { bookingStart, bookingEnd } = bookingData(transaction, lineItemUnitType, timeZone);

  return (
    <TimeRange
      startDate={bookingStart}
      endDate={bookingEnd}
      dateType={dateType}
      timeZone={timeZone}
      {...rest}
    />
  );
};

/**
 * The InboxItem component.
 *
 * @component
 * @param {Object} props
 * @param {TX_TRANSITION_ACTOR_CUSTOMER | TX_TRANSITION_ACTOR_PROVIDER} props.transactionRole - The transaction role
 * @param {propTypes.transaction} props.tx - The transaction
 * @param {intlShape} props.intl - The intl object
 * @param {stateDataShape} props.stateData - The state data
 * @returns {JSX.Element} inbox item component
 */
export const InboxItem = props => {
  const {
    transactionRole,
    tx,
    intl,
    stateData,
    isBooking,
    availabilityType,
    stockType = STOCK_MULTIPLE_ITEMS,
    history={history}
  } = props;
  console.log(tx);
  const { customer, provider, listing } = tx;
  const { processName, processState, actionNeeded, isSaleNotification, isFinal } = stateData;
  const isCustomer = transactionRole === TX_TRANSITION_ACTOR_CUSTOMER;

  const lineItems = tx.attributes?.lineItems;
  const hasPricingData = lineItems.length > 0;
  const unitLineItem = getUnitLineItem(lineItems);
  const quantity = hasPricingData && !isBooking ? unitLineItem.quantity.toString() : null;
  const showStock = stockType === STOCK_MULTIPLE_ITEMS || (quantity && unitLineItem.quantity > 1);
  const otherUser = isCustomer ? provider : customer;
  const otherUserDisplayName = <UserDisplayName user={otherUser} intl={intl} />;
  const isOtherUserBanned = otherUser.attributes.banned;

  const rowNotificationDot = isSaleNotification ? <div className={css.notificationDot} /> : null;

  const linkClasses = classNames(css.itemLink, {
    [css.bannedUserLink]: isOtherUserBanned,
  });
  const stateClasses = classNames(css.stateName, {
    [css.stateConcluded]: isFinal,
    [css.stateActionNeeded]: actionNeeded,
    [css.stateNoActionNeeded]: !actionNeeded,
  });

  return (
    <div className={css.item}>
      <div className={css.itemAvatar}>
        <Avatar user={otherUser} />
      </div>
      <NamedLink
        className={linkClasses}
        name={isCustomer ? 'OrderDetailsPage' : 'SaleDetailsPage'}
        params={{ id: tx.id.uuid }}
      >
        <div className={css.rowNotificationDot}>{rowNotificationDot}</div>
        <div className={css.itemUsername}>{otherUserDisplayName}</div>
        <div className={css.itemTitle}>{listing?.attributes?.title}</div>
        <div className={css.itemDetails}>
          {isBooking ? (
            <BookingTimeInfoMaybe transaction={tx} />
          ) : hasPricingData && showStock ? (
            <FormattedMessage id="InboxPage.quantity" values={{ quantity }} />
          ) : null}
        </div>
        {availabilityType == AVAILABILITY_MULTIPLE_SEATS && unitLineItem?.seats ? (
          <div className={css.itemSeats}>
            <FormattedMessage id="InboxPage.seats" values={{ seats: unitLineItem.seats }} />
          </div>
        ) : null}
        <div className={css.itemState}>
          <div className={stateClasses}>
            <FormattedMessage
              id={`InboxPage.${processName}.${processState}.status`}
              values={{ transactionRole }}
            />
          </div>
        </div>
      </NamedLink>
    </div>
  );
};

/**
 * The InboxPage component.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.currentUser - The current user
 * @param {boolean} props.fetchInProgress - Whether the fetch is in progress
 * @param {propTypes.error} props.fetchOrdersOrSalesError - The fetch orders or sales error
 * @param {propTypes.pagination} props.pagination - The pagination object
 * @param {Object} props.params - The params object
 * @param {string} props.params.tab - The tab
 * @param {number} props.providerNotificationCount - The provider notification count
 * @param {boolean} props.scrollingDisabled - Whether scrolling is disabled
 * @param {Array<propTypes.transaction>} props.transactions - The transactions array
 * @param {Object} props.intl - The intl object
 * @returns {JSX.Element} inbox page component
 */
export const InboxPageComponent = props => {
  const config = useConfiguration();
  const intl = useIntl();
  const {
    currentUser,
    fetchInProgress,
    fetchOrdersOrSalesError,
    pagination,
    params,
    providerNotificationCount = 0,
    scrollingDisabled,
    transactions,
    history,
    onSendMessage,
    messages,
    totalMessages,
    onfetchMessage,
    onCreateProposal,
    location
  } = props;
  const { tab } = params;
  const validTab = tab === 'orders' || tab === 'sales';
  if (!validTab) {
    return <NotFoundPage staticContext={props.staticContext} />;
  }

  console.log(transactions);

  const path = location.pathname;
  const isShowBookings = path.includes("bookings");

  const isOrders = tab === 'orders';
  const hasNoResults = !fetchInProgress && transactions.length === 0 && !fetchOrdersOrSalesError;
  const ordersTitle = intl.formatMessage({ id: 'InboxPage.ordersTitle' });
  const salesTitle = intl.formatMessage({ id: 'InboxPage.salesTitle' });
  const title = isOrders ? ordersTitle : salesTitle;
  const [showQuotationForm,setShowQuotationForm] = useState(false);
  const [showOrder,setShowOrder] = useState(false);
  const [currentTransaction,setCurrentTransaction] = useState({});
  const [isProvider,setIsProvider] = useState(false);
  const [showOffer,setShowOffer] = useState(false);
  const [showQuoteAccepted,setShowQuoteAccepted] = useState(false);
  const [currentOfferInView,setCurrentOfferInView] = useState("");
  const [showCancelBooking,setShowCancelBooking] = useState(false);

  const pickType = lt => conf => conf.listingType === lt;
  const findListingTypeConfig = publicData => {
    const listingTypeConfigs = config.listing?.listingTypes;
    const { listingType } = publicData || {};
    const foundConfig = listingTypeConfigs?.find(pickType(listingType));
    return foundConfig;
  };
  const toTxItem = tx => {
    const transactionRole = isOrders ? TX_TRANSITION_ACTOR_CUSTOMER : TX_TRANSITION_ACTOR_PROVIDER;
    let stateData = null;
    try {
      stateData = getStateData({ transaction: tx, transactionRole, intl });
    } catch (error) {
      // If stateData is missing, omit the transaction from InboxItem list.
    }

    const publicData = tx?.listing?.attributes?.publicData || {};
    const foundListingTypeConfig = findListingTypeConfig(publicData);
    const { transactionType, stockType, availabilityType } = foundListingTypeConfig || {};
    const process = tx?.attributes?.processName || transactionType?.transactionType;
    const transactionProcess = resolveLatestProcessName(process);
    const isBooking = isBookingProcess(transactionProcess);

    // Render InboxItem only if the latest transition of the transaction is handled in the `txState` function.
    return stateData ? (
      <li key={tx.id.uuid} className={css.listItem}>
        <InboxItem
          transactionRole={transactionRole}
          tx={tx}
          intl={intl}
          stateData={stateData}
          stockType={stockType}
          availabilityType={availabilityType}
          isBooking={isBooking}
          history={history}
        />
      </li>
    ) : null;
  };

  const hasOrderOrSaleTransactions = (tx, isOrdersTab, user) => {
    return isOrdersTab
      ? user?.id && tx && tx.length > 0 && tx[0].customer.id.uuid === user?.id?.uuid
      : user?.id && tx && tx.length > 0 && tx[0].provider.id.uuid === user?.id?.uuid;
  };
  const hasTransactions =
    !fetchInProgress && hasOrderOrSaleTransactions(transactions, isOrders, currentUser);

  const tabs = [
    {
      text: (
        <span>
          <FormattedMessage id="InboxPage.ordersTabTitle" />
        </span>
      ),
      selected: isOrders,
      linkProps: {
        name: 'InboxPage',
        params: { tab: 'orders' },
      },
    },
    {
      text: (
        <span>
          <FormattedMessage id="InboxPage.salesTabTitle" />
          {providerNotificationCount > 0 ? (
            <NotificationBadge count={providerNotificationCount} />
          ) : null}
        </span>
      ),
      selected: !isOrders,
      linkProps: {
        name: 'InboxPage',
        params: { tab: 'sales' },
      },
    },
  ];

  return (
    <Page title={title} scrollingDisabled={scrollingDisabled}>
      <TopbarContainer
        mobileRootClassName={css.mobileTopbar}
        desktopClassName={css.desktopTopbar}
      />

      {isShowBookings?
       <BookingsPage
        transactions={transactions}
        setShowCancelBooking={setShowCancelBooking}
       />
      :
      <InboxView 
        transactions={transactions} 
        currentUser={currentUser} 
        setShowQuotationForm={setShowQuotationForm} 
        history={history}
        onSendMessage={onSendMessage}
        messages={messages}
        totalMessages={totalMessages}
        onfetchMessage={onfetchMessage}
        setShowOrder={setShowOrder}
        setShowOffer={setShowOffer}
        currentOfferInView={currentOfferInView}
        setCurrentOfferInView={setCurrentOfferInView}
        currentTransaction={currentTransaction}
        setCurrentTransaction={setCurrentTransaction}
        isProvider={isProvider}
        setIsProvider={setIsProvider}
        setShowQuoteAccepted={setShowQuoteAccepted}
      />
      }
      
      {showQuotationForm?
        <div  className={css.overlay}>
            <CreateQuoteForm 
              setShowQuotationForm={setShowQuotationForm}
              onCreateProposal={onCreateProposal}
              currentTransaction={currentTransaction}
              onSendMessage={onSendMessage}
            />
        </div>
      :""}

      {showOrder?
        <div  className={css.overlay}>
            <OrderDisplayView 
              setShowOrder={setShowOrder} 
              currentTransaction={currentTransaction}
              setShowQuotationForm={setShowQuotationForm}
              onCreateProposal={onCreateProposal}
              currentUser={currentUser} 
              isProvider={isProvider}
            />
        </div>
      :""}

      {showOffer?
        <div  className={css.overlay}>
            <OfferDisplayView
              setShowOffer={setShowOffer} 
              currentTransaction={currentTransaction}
              setShowQuotationForm={setShowQuotationForm}
              onCreateProposal={onCreateProposal}
              currentUser={currentUser} 
              isProvider={isProvider}
              setShowQuoteAccepted={setShowQuoteAccepted}
              currentOfferInView={currentOfferInView}
            />
        </div>
      :""}

        {showQuoteAccepted?
        <div  className={css.overlay}>
            <QuoteAcceptedView
              setShowQuoteAccepted={setShowQuoteAccepted} 
              currentTransaction={currentTransaction}
              setShowQuotationForm={setShowQuotationForm}
              onCreateProposal={onCreateProposal}
              currentUser={currentUser} 
              isProvider={isProvider}
              history={history}
              currentOfferInView={currentOfferInView}
            />
        </div>
      :""}

      {showCancelBooking?
        <div  className={css.overlay}>
            <CancelBooking
              setShowCancelBooking={setShowCancelBooking}
            />
        </div>
      :""}

    </Page>
  );
};


const mapStateToProps = state => {
  const { fetchInProgress, fetchOrdersOrSalesError, pagination, transactionRefs } = state.InboxPage;
  const { currentUser, currentUserNotificationCount: providerNotificationCount } = state.user;
  const {messages,totalMessages} = state.TransactionPage;
  console.log(totalMessages,"   bbbbbbbbbb1111111111111bnnnnnnnnnn");
  return {
    currentUser,
    fetchInProgress,
    fetchOrdersOrSalesError,
    pagination,
    providerNotificationCount,
    scrollingDisabled: isScrollingDisabled(state),
    transactions: getMarketplaceEntities(state, transactionRefs),
    messages,
    totalMessages
  };
};


const mapDispatchToProps = dispatch => ({
  onSendMessage:(txId,msg) => dispatch(sendTxMessage(txId,msg)),
  onfetchMessage:(txId) => dispatch(fetchTrxMessages(txId,1)),
  onCreateProposal:(txId,offer) =>dispatch(createProposal(txId,offer))
});


const InboxPage = compose(withRouter, connect(mapStateToProps,mapDispatchToProps))(InboxPageComponent);

export default InboxPage;
