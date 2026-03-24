import { uniqueId } from "lodash";
import { initiatePrivileged, sendNotification, stripeTransfer, transitionPrivileged } from "../../util/api";
import { types as sdkTypes } from '../../util/sdkLoader';
import { storableError } from "../../util/errors";
const { UUID } = sdkTypes;
import { updateProfile } from '../ProfileSettingsPage/ProfileSettingsPage.duck';
import { changeListingPrice } from "../TransactionPage/TransactionPage.duck";
import { stripeTransferToConnectedAccountBalance } from "../StripePayoutPage/StripePayoutPage.duck";


export const ONBOARD_REQUEST =
  'app/Checkout/ONBOARD_REQUEST';
export const ONBOARD_SUCCESS =
  'app/Checkout/ONBOARD_SUCCESS';
export const ONBOARD_ERROR =
  'app/Checkout/ONBOARD_ERROR';

export const CONFIRM_PAYMENT_REQUEST ='app/Checkout/CONFIRM_PAYMENT_REQUEST';
export const CONFIRM_PAYMENT_SUCCESS ='app/Checkout/CONFIRM_PAYMENT_SUCCESS';
export const CONFIRM_PAYMENT_ERROR ='app/Checkout/CONFIRM_PAYMENT_ERROR';


  const initialState = {
    onboardError: null,
    onboardInProgress: false,
    confirmPaymentInProgress:false,
    confirmPaymmentError:null,
    transactionRes:[]
  };


  //Reducers
  export default function reducer(state = initialState, action = {}) {
    const { type, payload } = action;
    switch (type) {
      case CONFIRM_PAYMENT_REQUEST:
        return {
          ...state,
          confirmPaymentInProgress: true,
          confirmPaymmentError: null,
          
        };
      case CONFIRM_PAYMENT_SUCCESS:
        return { ...state ,
          confirmPaymentInProgress: false,
          
        };
      case CONFIRM_PAYMENT_ERROR:
        console.error(payload); // eslint-disable-line no-console
        return {
          ...state,
          confirmPaymentInProgress: false,
          confirmPaymmentError: payload,
        };


        case ONBOARD_REQUEST:
          return {
            ...state,
            onboardInProgress: true,
            onboardError: null,
            
          };
        case ONBOARD_SUCCESS:
          return { ...state ,
              onboardInProgress: false,
              transactionRes:payload,
          };
        case ONBOARD_ERROR:
          console.error(payload); // eslint-disable-line no-console
          return {
            ...state,
            onboardInProgress: false,
            onboardError: payload,
          };


  
      default:
        return state;
    }
  }


  //------------------Action creators
  export const onboardRequest = ()=>({type:ONBOARD_REQUEST});
  export const onboardSuccess = (response)=>({
    type:ONBOARD_SUCCESS,
    payload:response,
});
  export const onboardError = (error)=>({ 
    type:ONBOARD_ERROR,
    payload:error,
    error:true,
});

export const confirmPaymentRequest = ()=>({type:ONBOARD_REQUEST});
export const confirmPaymentSuccess = (response)=>({
  type:ONBOARD_SUCCESS,
  payload:response,
});
export const confirmPaymentError = (error)=>({ 
  type:ONBOARD_ERROR,
  payload:error,
  error:true,
});

export const removeCartData = (currentUser,cartId)=>(dispatch, getState, sdk) =>{
  const {attributes={}} = currentUser;
  const {profile={}} = attributes;
  const {publicData={}} = profile;
  const {cartData=[]} = publicData;

  const remainingCart = cartData.filter(itm=>itm.id !== cartId);
  const data = 
                  {publicData: {
                    cartData:remainingCart
                  }}

              //Remove cartData
              dispatch(updateProfile(data))
              console.log(cartData,"  Remove cart data +++++++++++++++++++++++++++++++++++++++", remainingCart)

}


export const confirmPaymment = (speculatedTx,listing,currentUser)=>async(dispatch,getState,sdk)=>{

  console.log("speculatedTxxxxxxxxxxxxxxxxxxxxxx",speculatedTx)
  
  dispatch(confirmPaymentRequest(speculatedTx));

  const speculatedTrx = speculatedTx;
  speculatedTrx.isSpeculative = false;

  const {
    attributes,
    relationships,
    id
  }=speculatedTrx;
  const listingId = listing?.id?.uuid;
  const {publicData={}} = listing?.attributes;
  const {originalPrice} = publicData;
  const {protectedData} = attributes;
  const {offer,cartData} = protectedData;

  //Data for notification sending
  const customerId = currentUser?.id?.uuid;
  const providerId = relationships?.provider?.data?.id?.uuid;
  const trxId = id.uuid;
  const title = "Payment Confirmed";
  const pageToGo = "InboxPage";
  const senderId = currentUser.id.uuid;

  // sendNotification(
  //               {
  //                 customerId,providerId,trxId,title,pageToGo
  //               }
  //             )

  return transitionPrivileged(
   {
                        isSpeculative: false,
                        orderData: {
                          "deliveryMethod": "none"
                        },
                        bodyParams: {
                          //processAlias: "default-purchase/release-1",
                          id:speculatedTrx.id,
                          transition: "transition/request-payment-after-inquiry",
                          params: {
                            stockReservationQuantity: JSON.stringify(offer) !== "{}"? 1 : (quantity || 1),
                            listingId: {
                              "_sdkType": "UUID",
                              "uuid": listingId
                            },
                            protectedData: {
                              unitType: "item",
                              deliveryMethod: "none",
                              offer
                            },
                            //cardToken: "CheckoutPage_speculative_card_token"
                          }
                        },
                        queryParams: {
                          "include": [
                            "booking",
                            "provider"
                          ],
                          "expand": true
                        }
                      }
      )
      .then(response=>{
        const bodyParams = {
            id: speculatedTrx.id,
            transition: "transition/confirm-payment",
            params: {},
          };
          const queryParams = {
            include: ['booking', 'provider'],
            expand: true,
          };

          return sdk.transactions
            .transition(bodyParams, queryParams)
            .then(response => {

              //send notification
              const notiRes =  sendNotification(
                {
                  customerId,providerId,trxId,title,pageToGo,senderId
                }
              )
              .then((res)=>{


                const order = response.data.data;
                dispatch(confirmPaymentSuccess(order.id));
                localStorage.removeItem("Transaction");

                //removeCartData(currentUser,listingId,dispatch);

                //Reset listing price back to original price
                dispatch(changeListingPrice(listingId,originalPrice));

                console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")

                return order;

              })
              
            })
            .catch(e => {
              console.log(e)
            });

      })
      .catch(e=>{
        console.log(e)
        dispatch(confirmPaymentError(storableError(e)));
      });

}
 


