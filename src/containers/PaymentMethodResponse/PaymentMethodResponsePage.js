import React from 'react';
import { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { injectIntl, useIntl } from 'react-intl';
import { callPayPalOnboardingApi, confirmPaymment, initiateOrder } from './PaymentMethodResponsePage.duck.js';

import {
    INQUIRY_PROCESS_NAME,
    TX_TRANSITION_ACTOR_CUSTOMER as CUSTOMER,
    TX_TRANSITION_ACTOR_PROVIDER as PROVIDER,
    resolveLatestProcessName,
    getProcess,
    isBookingProcess,
  } from '../../transactions/transaction.js';
import { getMarketplaceEntities } from '../../ducks/marketplaceData.duck.js';
import { isScrollingDisabled, manageDisableScrolling } from '../../ducks/ui.duck.js';
import { initializeCardPaymentData } from '../../ducks/stripe.duck.js';
import { useConfiguration } from '../../context/configurationContext.js';
import { pathByRouteName } from '../../util/routes.js';
import routeConfiguration from '../../routing/routeConfiguration.js';
import { useRouteConfiguration } from '../../context/routeConfigurationContext.js';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.js';
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min.js';
import { Page } from '../../components/index.js';
import TopbarContainer from '../TopbarContainer/TopbarContainer.js';
import FooterComponent from '../FooterContainer/FooterContainer.js';
import SuccessView from '../../components/SuccessView/SuccessView.js';

import css from './PaymentMethodResponsePage.module.css';
import SuccessViewPayment from '../../components/SuccessView/SuccessViewPayment.js';


const sharetribeSdk = require('sharetribe-flex-sdk');
// To obtain a client ID, see Applications in Flex Console
const sdk = sharetribeSdk.createInstance({
  clientId: process.env.REACT_APP_SHARETRIBE_SDK_CLIENT_ID
});

const PaymentMethodResponsePageCom = (props) => {
    
    //const [pageData, setPageData] = useState({});
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const config = useConfiguration();
    const routeConfiguration = useRouteConfiguration();
    const intl = useIntl();
    const history = useHistory();
    const {
     
      params,
      onConfirmPayment,
      confirmPaymentInProgress,
      confirmPaymmentError,
      transactionRes,
      currentUser
    } = props;
  

    console.log(params)
   

  useEffect(() => {
    const trx = JSON.parse(localStorage.getItem("Transaction"));
    const speculatedTrxId = JSON.parse(localStorage.getItem("SpeculatedTransaction"));
    if(speculatedTrxId !== null && speculatedTrxId !== undefined){
      onConfirmPayment(speculatedTrxId,trx.listing,currentUser);
    }
  },[]);

   
  useEffect(() => {
    
    if (transactionRes.hasOwnProperty("data")) {
      console.log(JSON.stringify(transactionRes));
      //history.push("/inbox/"+transactionRes.data.id.uuid);
    }
  },[transactionRes]);


    return (
      
          <Page title={"Success"}>
                <TopbarContainer
                  mobileRootClassName={css.mobileTopbar}
                  desktopClassName={css.desktopTopbar}
                />
              
                <div className={css.container}>
                   <SuccessViewPayment
                       message={"Your Payment was successful!"}
                    />
                </div>
              
                <FooterComponent/>
          </Page>





































    );
}

const mapStateToProps = state => {
    const {
        fetchTransactionError,
        transitionInProgress,
        transitionError,
        transactionRef,
        fetchMessagesInProgress,
        fetchMessagesError,
        totalMessagePages,
        oldestMessagePageFetched,
        messages,
        initialMessageFailedToTransaction,
        savePaymentMethodFailed,
        sendMessageInProgress,
        sendMessageError,
        sendReviewInProgress,
        sendReviewError,
        monthlyTimeSlots,
        processTransitions,
        lineItems,
        fetchLineItemsInProgress,
        fetchLineItemsError,
      } = state.TransactionPage;

      const {
        confirmPaymentInProgress,
        confirmPaymmentError,
        transactionRes
      } = state.PaymentMethodResponsePage;
    
    const { currentUser } = state.user;
    const transactions = getMarketplaceEntities(state, transactionRef ? [transactionRef] : []);
    const transaction = transactions.length > 0 ? transactions[0] : null;
  
    return {
      currentUser,
      fetchTransactionError,
      transitionInProgress,
      transitionError,
      scrollingDisabled: isScrollingDisabled(state),
      transaction,
      fetchMessagesInProgress,
      fetchMessagesError,
      totalMessagePages,
      oldestMessagePageFetched,
      messages,
      initialMessageFailedToTransaction,
      savePaymentMethodFailed,
      sendMessageInProgress,
      sendMessageError,
      sendReviewInProgress,
      sendReviewError,
      monthlyTimeSlots,
      nextTransitions: processTransitions,
      lineItems,
      fetchLineItemsInProgress,
      fetchLineItemsError,
      confirmPaymentInProgress,
      confirmPaymmentError,
      transactionRes
    };
  };


  const mapDispatchToProps = dispatch => ({
    onSendReview: (tx, transitionOptions, params, config) =>
      dispatch(sendReviewNew(tx, transitionOptions, params, config)),
    //onInitiateOrder:(data)=>dispatch(initiateOrder(data)),
    onConfirmPayment:(specTrx,listingId,currentUser)=>dispatch(confirmPaymment(specTrx,listingId,currentUser)),
  });
  
  const PaymentMethodResponsePage = compose(
    withRouter,
    connect(
      mapStateToProps,
      mapDispatchToProps
    ),
    injectIntl
  )(PaymentMethodResponsePageCom);
  




export default PaymentMethodResponsePage