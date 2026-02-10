import pick from 'lodash/pick';
import {
  createStripeAccount,
  updateStripeAccount,
  fetchStripeAccount,
} from '../../ducks/stripeConnectAccount.duck';
import { fetchCurrentUser } from '../../ducks/user.duck';
import { loadDataDash } from '../DashboardPage/DashboardPage.duck';
import { queryUserReviews } from '../ProfilePage/ProfilePage.duck';
import { getStripeBalance, instantPayout, setDailyPayout, stripeTransfer } from '../../util/api';

// ================ Action types ================ //

export const SET_INITIAL_VALUES = 'app/StripePayoutPage/SET_INITIAL_VALUES';
export const SAVE_PAYOUT_DETAILS_REQUEST = 'app/StripePayoutPage/SAVE_PAYOUT_DETAILS_REQUEST';
export const SAVE_PAYOUT_DETAILS_SUCCESS = 'app/StripePayoutPage/SAVE_PAYOUT_DETAILS_SUCCESS';
export const SAVE_PAYOUT_DETAILS_ERROR = 'app/StripePayoutPage/SAVE_PAYOUT_DETAILS_ERROR';

export const GET_BALANCE_REQUEST = 'app/StripePayoutPage/GET_BALANCE_REQUEST';
export const GET_BALANCE_SUCCESS = 'app/StripePayoutPage/GET_BALANCE_SUCCESS';

export const INSTANT_PAYOUT_REQUEST = 'app/StripePayoutPage/INSTANT_PAYOUT_REQUEST';
export const INSTANT_PAYOUT_SUCCESS = 'app/StripePayoutPage/INSTANT_PAYOUT_SUCCESS';
export const INSTANT_PAYOUT_ERROR = 'app/StripePayoutPage/INSTANT_PAYOUT_ERROR';

export const RESET_REQUEST = 'app/StripePayoutPage/RESET_REQUEST';

// ================ Reducer ================ //

const initialState = {
  payoutDetailsSaveInProgress: false,
  payoutDetailsSaved: false,
  fromReturnURL: false,
  accountBalance:{},
  getAccountBalanceInProgress:false,
  getAccountBalanceInError:null,
  instantPayoutInProgress:false,
  instantPayoutSuccess:false,
  instantPayoutError:false
};

export default function reducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case SET_INITIAL_VALUES:
      return { ...initialState, ...payload };

    case SAVE_PAYOUT_DETAILS_REQUEST:
      return { ...state, payoutDetailsSaveInProgress: true };
    case SAVE_PAYOUT_DETAILS_ERROR:
      return { ...state, payoutDetailsSaveInProgress: false };
    case SAVE_PAYOUT_DETAILS_SUCCESS:
      return { ...state, payoutDetailsSaveInProgress: false, payoutDetailsSaved: true };

    case GET_BALANCE_REQUEST:
      return { ...state, getAccountBalanceInProgress: true } ;

    case GET_BALANCE_SUCCESS:
      return { ...state, getAccountBalanceInProgress:false, accountBalance: payload };

    case INSTANT_PAYOUT_REQUEST:
      return { ...state, instantPayoutInProgress: true,instantPayoutSuccess:false } ;

    case INSTANT_PAYOUT_SUCCESS:
      return { ...state, instantPayoutInProgress:false, instantPayoutSuccess: true };

    case INSTANT_PAYOUT_ERROR:
      return { ...state, instantPayoutInProgress: false,instantPayoutSuccess:false, instantPayoutError:true };

    case RESET_REQUEST:
      return { ...state,instantPayoutSuccess:false, instantPayoutInProgress:false };

    default:
      return state;
  }
}

// ================ Action creators ================ //

export const setInitialValues = initialValues => ({
  type: SET_INITIAL_VALUES,
  payload: pick(initialValues, Object.keys(initialState)),
});

export const savePayoutDetailsRequest = () => ({
  type: SAVE_PAYOUT_DETAILS_REQUEST,
});
export const savePayoutDetailsError = () => ({
  type: SAVE_PAYOUT_DETAILS_ERROR,
});
export const savePayoutDetailsSuccess = () => ({
  type: SAVE_PAYOUT_DETAILS_SUCCESS,
});

export const getAccountBalanceRequest = () => ({
  type: SAVE_PAYOUT_DETAILS_REQUEST,
});

export const getAccountBalanceSuccess = (res) => ({
  type: GET_BALANCE_SUCCESS,
  payload: res ,
});

export const instantPayoutRequest = () => ({
  type: INSTANT_PAYOUT_REQUEST,
});

export const instantPayoutSuccess = (res) => ({
  type: INSTANT_PAYOUT_SUCCESS,
  payload: res ,
});

export const instantPayoutError = () => ({
  type: INSTANT_PAYOUT_ERROR,
});

export const resetRequest = () => ({
  type: RESET_REQUEST,
});

// ================ Thunks ================ //

export const savePayoutDetails = (values, isUpdateCall) => (dispatch, getState, sdk) => {

  //Check this value on return from stripe onboarding to be able to set daily payout.
  localStorage.setItem("PayoutOnboardingInProgress",true);
  const upsertThunk = isUpdateCall ? updateStripeAccount : createStripeAccount;
  dispatch(savePayoutDetailsRequest());

  return dispatch(upsertThunk(values, { expand: true }))
    .then(response => {
      dispatch(savePayoutDetailsSuccess());
      return response;
    })
    .catch(() => dispatch(savePayoutDetailsError()));
};

export const loadData = () => (dispatch, getState, sdk) => {
  // Clear state so that previously loaded data is not visible
  // in case this page load fails.
  dispatch(setInitialValues());
  const fetchCurrentUserOptions = {
    updateHasListings: false,
    updateNotifications: false,
  };

  return dispatch(fetchCurrentUser(fetchCurrentUserOptions)).then(response => {
    const currentUser = getState().user.currentUser;
    if (currentUser && currentUser.stripeAccount) {
      dispatch(fetchStripeAccount());
    }
    dispatch(queryUserReviews(currentUser.id.uuid));
    return response;
  });
};

export const setDailyPayoutCall = (sid) => (dispatch, getState, sdk) => {
  setDailyPayout(sid);
};

export const getAccountBalance = (sid) => (dispatch, getState, sdk) => {
  dispatch(getAccountBalanceRequest());
  getStripeBalance(sid)
  .then((res)=>{
    console.log(res,"   dddddddddddd");
    dispatch(getAccountBalanceSuccess(res));
  })
};

export const stripeInstantPayout = (data) => (dispatch, getState, sdk) => {
  dispatch(instantPayoutRequest());
  console.log("Sending payout =====================");
  instantPayout(data)
  .then((res)=>{
    console.log(res,"   dddddddddddd");
    dispatch(instantPayoutSuccess(res));
  })
  .catch((e)=>{
    console.log(e,"      eeeeeeeeeeeeeeeeeeeeeeeeeeeee")
  })
};


export const stripeTransferToConnectedAccountBalance = (data) => (dispatch, getState, sdk) => {
  dispatch(getAccountBalanceRequest());
  stripeTransfer(data)
  .then((res)=>{
    console.log(res,"   dddddddddddd");
    dispatch(getAccountBalanceSuccess(res));
  })
  .catch((e)=>{
    console.log(e,"      eeeeeeeeeeeeeeeeeeeeeeeeeeeee")
  })
};

export const reset = () => (dispatch, getState, sdk) => {
  dispatch(resetRequest());
 
};
