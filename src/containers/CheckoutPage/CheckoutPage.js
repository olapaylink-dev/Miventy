import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';

// Import contexts and util modules
import { useConfiguration } from '../../context/configurationContext';
import { useRouteConfiguration } from '../../context/routeConfigurationContext';
import { userDisplayNameAsString } from '../../util/data';
import {
  NO_ACCESS_PAGE_INITIATE_TRANSACTIONS,
  NO_ACCESS_PAGE_USER_PENDING_APPROVAL,
} from '../../util/urlHelpers';
import { hasPermissionToInitiateTransactions, isUserAuthorized } from '../../util/userHelpers';
import { isErrorNoPermissionForInitiateTransactions } from '../../util/errors';
import { INQUIRY_PROCESS_NAME, resolveLatestProcessName } from '../../transactions/transaction';

// Import global thunk functions
import { isScrollingDisabled } from '../../ducks/ui.duck';
import { confirmCardPayment, retrievePaymentIntent } from '../../ducks/stripe.duck';
import { savePaymentMethod } from '../../ducks/paymentMethods.duck';

// Import shared components
import { ExternalLink, NamedRedirect, Page } from '../../components';

// Session helpers file needs to be imported before CheckoutPageWithPayment and CheckoutPageWithInquiryProcess
import { storeData, clearData, handlePageData } from './CheckoutPageSessionHelpers';
import css from './CheckoutPage.module.css';
const stripe = Stripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// Import modules from this directory
import {
  initiateOrder,
  setInitialValues,
  speculateTransaction,
  stripeCustomer,
  confirmPayment,
  sendMessage,
  initiateInquiryWithoutPayment,
  initiateTransaction,
  loadOtherPaymentMethodUrl,
} from './CheckoutPage.duck';

import CustomTopbar from './CustomTopbar';
import CheckoutPageWithPayment, {
  loadInitialDataForStripePayments,
} from './CheckoutPageWithPayment';
import CheckoutPageWithInquiryProcess from './CheckoutPageWithInquiryProcess';
import FooterComponent from '../FooterContainer/FooterContainer';
import TopbarContainer from '../TopbarContainer/TopbarContainer';

const STORAGE_KEY = 'CheckoutPage';

const onSubmitCallback = () => {
  clearData(STORAGE_KEY);
};

const getProcessName = pageData => {
  const { transaction, listing } = pageData || {};
  const processName = transaction?.id
    ? transaction?.attributes?.processName
    : listing?.id
    ? listing?.attributes?.publicData?.transactionProcessAlias?.split('/')[0]
    : null;
  return resolveLatestProcessName(processName);
};

const EnhancedCheckoutPage = props => {
  const [pageData, setPageData] = useState({});
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const config = useConfiguration();
  const routeConfiguration = useRouteConfiguration();
  const intl = useIntl();
  const history = useHistory();

  const {
        currentUser,
        orderData,
        // listing,
        // transaction,
        fetchSpeculatedTransaction,
        fetchStripeCustomer,
        onInitiateTransaction,
        speculateTransactionInProgress,
        speculateTransactionError,
        speculatedTransaction,
        onLoadOtherPaymentMethodUrl,
        paymentMethodUrlInProgress,
        paymentMethodUrlError,
        paymentMethodUrl,
      } = props;

      const trx = JSON.parse(localStorage.getItem("Transaction"));
      console.log(trx,"=================================");
      const {offer={}} = trx?.attributes?.protectedData;
      const {description,duration,eventDate,price} = offer;
      const {listing={}} = trx;
      const {listingType=""} = listing?.attributes?.publicData;
      const [subTotal,setSubTotal] = useState(0);
      const [serviceFee,setServiceFee] = useState(0);
      const [processingFee,setProcessingFee] = useState(0);
      const [quantity,setQuantity] = useState(0);
      const [itemPrice,setPrice] = useState(0);

      const {protectedData={}} = trx?.attributes;
      const cartDat = protectedData?.cartData !== undefined?protectedData?.cartData:{};
      const {cartData} = cartDat !== undefined?cartDat:{};
      const {items=[]} = cartData;
      const {ItemPrice=""} = items.length > 0 ? items[0] : {};

      const getPrice = lineItem =>{
        let val = 0;
        lineItem.map((itm,key)=>{
          if(itm.code === "line-item/item"){
            val = itm.unitPrice.amount;
          }
        })
        return val;
      }

      const getQuantity = lineItem =>{
        let val = 0;
        lineItem.map((itm,key)=>{
          if(itm.code === "line-item/item"){
            val = itm.quantity.d[0];
          }
        })
        return val;
      }

      const getProcessingFee = lineItem =>{
        let val = 0;
        lineItem.map((itm,key)=>{
          if(itm.code === "line-item/processing-fee"){
            val = itm.lineTotal.amount;
          }
        })
        return val;
      }


  useEffect(() => {
    
    onInitiateTransaction(trx);

    // console.log("55555555555555555555555555")
    // const initialData = { orderData, listing, transaction };
    // const data = handlePageData(initialData, STORAGE_KEY, history);
    // setPageData(data || {});
    // setIsDataLoaded(true);

    // // Do not fetch extra data if user is not active (E.g. they are in pending-approval state.)
    // if (isUserAuthorized(currentUser)) {
    //   // This is for processes using payments with Stripe integration
    //   if (getProcessName(data) !== INQUIRY_PROCESS_NAME) {
    //     // Fetch StripeCustomer and speculateTransition for transactions that include Stripe payments
    //     loadInitialDataForStripePayments({
    //       pageData: data || {},
    //       fetchSpeculatedTransaction,
    //       fetchStripeCustomer,
    //       config,
    //     });
    //   }
    // }
    setPageData({listing,orderData:{deliveryMethod:"none",quantity:1},transaction:null});

    // if(price !== undefined && price !== null){
    //     console.log("vvvvvvvvvvvvvvvvvvvvvvvvvvvvv")
    //     const data = {};
    //     data.price = price;
    //     data.title = listing?.attributes?.title;
    //     data.txId = currentUser.id.uuid;
    //     console.log(data);
    //     //localStorage.setItem("pageData",JSON.stringify(pageData));
    //     console.log(price)
    //     onLoadOtherPaymentMethodUrl(data);
    // }else if(ItemPrice !== undefined && ItemPrice !== null){
    //     console.log("vvvvvvvvvvvv2222222222222vvvvvvvvvvvvvvvvv")
    //     const data = {};
    //     data.price = ItemPrice;
    //     data.title = listing?.attributes?.title;
    //     data.txId = currentUser.id.uuid;
    //     console.log(data);
    //     //localStorage.setItem("pageData",JSON.stringify(pageData));
    //     console.log(ItemPrice)
    //     onLoadOtherPaymentMethodUrl(data);
    // }
  }, []);

  useEffect(()=>{
    const getCommission = lineItems =>{
      let val = 0;
      lineItems.map((itm,key)=>{
        if(itm.code === "line-item/provider-commission"){
          val = itm.percentage.d[0];
        } 
      });
      return val;
    }

    if(speculatedTransaction !== null){
      
      localStorage.setItem("SpeculatedTransaction",JSON.stringify(speculatedTransaction));// used on PaymentMethodResponsePage
      console.log("speculatedTransaction",speculatedTransaction);

      const {attributes} = speculatedTransaction;
      const {lineItems} = attributes;
      console.log(lineItems,"   bbboooppp")
      const feePercent = getCommission(lineItems);
      
      const total = lineItems[1].unitPrice.amount;
      const fee = parseInt(feePercent) * parseInt(total) * 0.01;
      setServiceFee(fee);
      const processingFee = getProcessingFee(lineItems);
      setProcessingFee(processingFee);
      setPrice(getPrice(lineItems));
      setQuantity(getQuantity(lineItems));

      const totalAmount = total + fee + processingFee;
      
      setSubTotal((parseInt(totalAmount).toFixed(2)));
      //create OfferListing
      //Pass as pageData listing
      setPageData({listing,orderData:{deliveryMethod:"none",quantity:1},transaction:null});

      if(price !== undefined && price !== null){
          console.log("vvvvvvvvvvvvvvvvvvvvvvvvvvvvv")
          const data = {};
          data.price = totalAmount*100;
          data.title = listing?.attributes?.title;
          data.txId = currentUser.id.uuid;
          console.log(data);
          //localStorage.setItem("pageData",JSON.stringify(pageData));
          console.log(price)
          onLoadOtherPaymentMethodUrl(data);
      }else if(ItemPrice !== undefined && ItemPrice !== null){
          console.log("vvvvvvvvvvvv2222222222222vvvvvvvvvvvvvvvvv")
          const data = {};
          data.price = totalAmount*100;
          data.title = listing?.attributes?.title;
          data.txId = currentUser.id.uuid;
          console.log(data);
          //localStorage.setItem("pageData",JSON.stringify(pageData));
          console.log(ItemPrice)
          onLoadOtherPaymentMethodUrl(data);
      }
    }
    
  },[speculatedTransaction])

  const {
    //currentUser,
    params,
    scrollingDisabled,
    //speculateTransactionInProgress,
    onInquiryWithoutPayment,
    initiateOrderError,
  } = props;

  const processName = "default-purchase";
  const isInquiryProcess = processName === INQUIRY_PROCESS_NAME;

  const listingTitle = listing?.attributes?.title;
  const authorDisplayName = userDisplayNameAsString(listing?.author, '');
  const title = processName
    ? intl.formatMessage(
        { id: `CheckoutPage.£{processName}.title` },
        { listingTitle, authorDisplayName }
      )
    : 'Checkout page is loading data';


  return processName && !isInquiryProcess && !speculateTransactionInProgress ? (
     <Page title={"Checkout"}>
      <TopbarContainer
        mobileRootClassName={css.mobileTopbar}
        desktopClassName={css.desktopTopbar}
      />
    

      <div className={css.container}>
        <div className={css.flex_row}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M11.9137 1.98733C10.766 1.18391 9.23837 1.18391 8.09063 1.98733L2.35932 5.99925C1.39381 6.67511 0.856954 7.81058 0.947345 8.98567L1.53486 16.6234C1.64567 18.0638 2.95084 19.1108 4.38105 18.9065L7.0224 18.5292C8.25402 18.3532 9.16884 17.2984 9.16884 16.0543V14.9998C9.16884 14.5396 9.54194 14.1665 10.0022 14.1665C10.4624 14.1665 10.8355 14.5396 10.8355 14.9998V16.0543C10.8355 17.2984 11.7503 18.3532 12.982 18.5292L15.6233 18.9065C17.0535 19.1108 18.3587 18.0639 18.4695 16.6234L19.057 8.98568C19.1474 7.81059 18.6105 6.67511 17.645 5.99925L11.9137 1.98733ZM9.0464 3.35271C9.62027 2.95101 10.3841 2.95101 10.9579 3.35271L16.6893 7.36463C17.172 7.70256 17.4404 8.2703 17.3952 8.85785L16.8077 16.4955C16.7708 16.9757 16.3357 17.3247 15.859 17.2566L13.2177 16.8793C12.8071 16.8206 12.5022 16.469 12.5022 16.0543V14.9998C12.5022 13.6191 11.3829 12.4998 10.0022 12.4998C8.62146 12.4998 7.50218 13.6191 7.50218 14.9998V16.0543C7.50218 16.469 7.19723 16.8206 6.7867 16.8793L4.14535 17.2566C3.66861 17.3247 3.23355 16.9757 3.19662 16.4955L2.6091 8.85785C2.56391 8.2703 2.83233 7.70256 3.31509 7.36463L9.0464 3.35271Z" fill="#EB5017"/>
          </svg>
          <span className={css.catering}><span className={css.item_list}>Home</span> /<span>Payment options</span></span>
        </div>
        <div className={css.main_section}>
          <div className={css.total}>


            <div className={css.top_con}>
                <h6 className={css.amt_header}>Total amount</h6>
                <h2 className={css.amount}>£{subTotal}</h2>
                <div className={css.flex_row_center}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.5 7.5C6.5 7.22386 6.27614 7 6 7C5.72386 7 5.5 7.22386 5.5 7.5V8.5C5.5 8.77614 5.72386 9 6 9C6.27614 9 6.5 8.77614 6.5 8.5V7.5Z" fill="#008000"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M9 3.5C9 1.84315 7.65685 0.5 6 0.5C4.34315 0.5 3 1.84315 3 3.5V4.5C1.89543 4.5 1 5.39543 1 6.5V9.5C1 10.6046 1.89543 11.5 3 11.5H9C10.1046 11.5 11 10.6046 11 9.5V6.5C11 5.39543 10.1046 4.5 9 4.5V3.5ZM4 3.5C4 2.39543 4.89543 1.5 6 1.5C7.10457 1.5 8 2.39543 8 3.5V4.5H4V3.5ZM2 6.5C2 5.94772 2.44772 5.5 3 5.5H9C9.55229 5.5 10 5.94772 10 6.5V9.5C10 10.0523 9.55228 10.5 9 10.5H3C2.44772 10.5 2 10.0523 2 9.5V6.5Z" fill="#008000"/>
                  </svg>
                  <span>Secure payment</span>
                </div>
            </div>
            <div className={css.details_con}>
              <h2 className={css.order_sum}>Order Summary</h2>
              <div className={css.flex_row_btw}>
                <span className={css.thead}>Service type</span>
                <span className={css.tvalue}>{listingType} service</span>
              </div>
              <div className={css.flex_row_btw}>
                <span className={css.thead}>Date</span>
                <span className={css.tvalue}>{eventDate}</span>
              </div>
              <div className={css.flex_row_btw}>
                <span className={css.thead}>Price</span>
                <span className={css.tvalue}>£{itemPrice}</span>
              </div>
              <div className={css.flex_row_btw}>
                <span className={css.thead}>Quantity</span>
                <span className={css.tvalue}>{quantity}</span>
              </div>
              <div className={css.rule}></div>
              <div className={css.flex_row_btw}>
                <span className={css.thead}>Platform fee (30%)</span>
                <span className={css.tvalue}>£{serviceFee}</span>
              </div>
              <div className={css.flex_row_btw}>
                <span className={css.thead}>Processing fee</span>
                <span className={css.tvalue}>£{processingFee}</span>
              </div>
              <div className={css.flex_row_btw}>
                <span className={css.thead}>Sub total</span>
                <span className={css.tvalue}>£{subTotal}</span>
              </div>
              
              <div className={css.rule}></div>
              <div className={css.flex_row_btw}>
                <span className={css.total_label}>Total</span>
                <span className={css.total_val}>£{subTotal}</span>
              </div>
            </div>
            {paymentMethodUrl !== undefined && paymentMethodUrl !== null?
                <ExternalLink href={paymentMethodUrl}>
                    <div className={css.btn_fill}>
                        Confirm payment
                    </div>
                  </ExternalLink>
                :
                
                  <ExternalLink href={"paymentMethodUrl"}>
                    <div className={css.btn_fill}>
                        Confirm payment
                    </div>
                  </ExternalLink>
                
            }
            
          </div>
          
        </div>
      </div>
     
     {/* <FooterComponent/> */}
    </Page>
  ):
    ""
  ;

};

const mapStateToProps = state => {
  const {
    listing,
    orderData,
    stripeCustomerFetched,
    speculateTransactionInProgress,
    speculateTransactionError,
    speculatedTransaction,
    isClockInSync,
    transaction,
    initiateInquiryError,
    initiateOrderError,
    confirmPaymentError,
    paymentMethodUrlInProgress,
    paymentMethodUrlError,
    paymentMethodUrl,
  } = state.CheckoutPage;
  const { currentUser } = state.user;
  const { confirmCardPaymentError, paymentIntent, retrievePaymentIntentError } = state.stripe;
  return {
    scrollingDisabled: isScrollingDisabled(state),
    currentUser,
    stripeCustomerFetched,
    orderData,
    speculateTransactionInProgress,
    speculateTransactionError,
    speculatedTransaction,
    isClockInSync,
    transaction,
    listing,
    initiateInquiryError,
    initiateOrderError,
    confirmCardPaymentError,
    confirmPaymentError,
    paymentIntent,
    retrievePaymentIntentError,
    paymentMethodUrlInProgress,
    paymentMethodUrlError,
    paymentMethodUrl,
  };
};

const mapDispatchToProps = dispatch => ({
  dispatch,
  fetchSpeculatedTransaction: (params, processAlias, txId, transitionName, isPrivileged) =>
    dispatch(speculateTransaction(params, processAlias, txId, transitionName, isPrivileged)),
  fetchStripeCustomer: () => dispatch(stripeCustomer()),
  onInquiryWithoutPayment: (params, processAlias, transitionName) =>
    dispatch(initiateInquiryWithoutPayment(params, processAlias, transitionName)),
  onInitiateOrder: (params, processAlias, transactionId, transitionName, isPrivileged) =>
    dispatch(initiateOrder(params, processAlias, transactionId, transitionName, isPrivileged)),
  onRetrievePaymentIntent: params => dispatch(retrievePaymentIntent(params)),
  onConfirmCardPayment: params => dispatch(confirmCardPayment(params)),
  onConfirmPayment: (transactionId, transitionName, transitionParams) =>
    dispatch(confirmPayment(transactionId, transitionName, transitionParams)),
  onSendMessage: params => dispatch(sendMessage(params)),
  onSavePaymentMethod: (stripeCustomer, stripePaymentMethodId) =>
    dispatch(savePaymentMethod(stripeCustomer, stripePaymentMethodId)),
  onInitiateTransaction:tx=>(dispatch(initiateTransaction(tx))),
  onLoadOtherPaymentMethodUrl: (data)=> dispatch(loadOtherPaymentMethodUrl(data)),
});

const CheckoutPage = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(EnhancedCheckoutPage);

CheckoutPage.setInitialValues = (initialValues, saveToSessionStorage = false) => {
  if (saveToSessionStorage) {
    const { listing, orderData } = initialValues;
    storeData(orderData, listing, null, STORAGE_KEY);
  }

  return setInitialValues(initialValues);
};

CheckoutPage.displayName = 'CheckoutPage';

export default CheckoutPage;
