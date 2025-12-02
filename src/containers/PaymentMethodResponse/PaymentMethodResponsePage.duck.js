import { uniqueId } from "lodash";
import { initiatePrivileged, transitionPrivileged } from "../../util/api";
import { types as sdkTypes } from '../../util/sdkLoader';
import { storableError } from "../../util/errors";
const { UUID } = sdkTypes;


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

const removeCartData = (currentUser,cartId,dispatch)=>{
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
              console.log("Remove cart data +++++++++++++++++++++++++++++++++++++++")

}


export const confirmPaymment = (speculatedTx,listingId,currentUser)=>async(dispatch,getState,sdk)=>{

  console.log("speculatedTxxxxxxxxxxxxxxxxxxxxxx",speculatedTx)
  
  dispatch(confirmPaymentRequest(speculatedTx));

  const speculatedTrx = speculatedTx;
  speculatedTrx.isSpeculative = false;

  const {
    listing,attributes
  }=speculatedTrx;
  const {protectedData} = attributes;
  const {offer,cartData} = protectedData;

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
                            stockReservationQuantity: 2,
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



          console.log("Confirming payment========================= speculatedTrx.id   ",speculatedTrx.id)


            // transitionPrivileged(
            //   {
            //                         isSpeculative: false,
            //                         bodyParams: {
            //                           id:speculatedTrx.id,
            //                           params:{},
            //                           transition: "transition/confirm-payment",
                                     
            //                         },
            //                         queryParams: {
            //                           "include": [
            //                             "booking",
            //                             "provider"
            //                           ],
            //                           "expand": true
            //                         }
            //                       }
            // )
            //       .then(res=>{
            //         console.log(res)
            //         dispatch(confirmPaymentSuccess(response.data));
            //         console.log("Confirmed payment ooooooooooooooooo")
            //       })
            //       .catch(e=>{
            //         console.log(e)
            //         dispatch(confirmPaymentError(storableError(e)));
            //       });



        const bodyParams = {
            id: speculatedTrx.id,
            transition: "transition/confirm-payment",
            params: {},
          };
          const queryParams = {
            include: ['booking', 'provider'],
            expand: true,
          };

          console.log(bodyParams, queryParams," cccccccccccccccc11111111111111cccccccccccccccc");

          return sdk.transactions
            .transition(bodyParams, queryParams)
            .then(response => {
              const order = response.data.data;
              dispatch(confirmPaymentSuccess(order.id));
              localStorage.removeItem("Transaction");

              removeCartData(currentUser,listingId,dispatch);
              return order;
            })
            .catch(e => {
              console.log(e)
              // dispatch(confirmPaymentError(storableError(e)));
              // const transactionIdMaybe = transactionId ? { transactionId: transactionId.uuid } : {};
              // log.error(e, 'initiate-order-failed', {
              //   ...transactionIdMaybe,
              // });
              // throw e;
            });











      })
      .catch(e=>{
        console.log(e)
        dispatch(confirmPaymentError(storableError(e)));
      });

}
 


