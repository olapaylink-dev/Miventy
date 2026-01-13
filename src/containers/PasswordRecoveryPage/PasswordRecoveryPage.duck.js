

import { resetPw, sendSms } from '../../util/api';
import { storableError } from '../../util/errors';
//import { Resend } from 'resend';

// ================ Action types ================ //

export const RECOVERY_REQUEST = 'app/PasswordRecoveryPage/RECOVERY_REQUEST';
export const RECOVERY_SUCCESS = 'app/PasswordRecoveryPage/RECOVERY_SUCCESS';
export const RECOVERY_ERROR = 'app/PasswordRecoveryPage/RECOVERY_ERROR';

export const SEND_SMS_REQUEST = 'app/PasswordRecoveryPage/SEND_SMS_REQUEST';
export const SEND_SMS_SUCCESS = 'app/PasswordRecoveryPage/SEND_SMS_SUCCESS';
export const SEND_SMS_ERROR = 'app/PasswordRecoveryPage/SEND_SMS_ERROR';

export const RETYPE_EMAIL = 'app/PasswordRecoveryPage/RETYPE_EMAIL';
export const CLEAR_RECOVERY_ERROR = 'app/PasswordRecoveryPage/CLEAR_RECOVERY_ERROR';

// ================ Reducer ================ //

const initialState = {
  initialEmail: null,
  submittedEmail: null,
  recoveryError: null,
  recoveryInProgress: false,
  passwordRequested: false,
  sendSmsError:null,
  sendSmsInProgress:false,
  phoneNumber:null,
  token:null,
  sendSmsSuccess:false
};

export default function reducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case RECOVERY_REQUEST:
      return {
        ...state,
        submittedEmail: null,
        recoveryInProgress: true,
        recoveryError: null,
      };
    case RECOVERY_SUCCESS:
      return {
        ...state,
        submittedEmail: payload.email,
        initialEmail: payload.email,
        recoveryInProgress: false,
        passwordRequested: true,
      };
    case RECOVERY_ERROR:
      return {
        ...state,
        recoveryInProgress: false,
        recoveryError: payload.error,
        initialEmail: payload.email,
      };
    case RETYPE_EMAIL:
      return {
        ...state,
        initialEmail: state.submittedEmail,
        submittedEmail: null,
        passwordRequested: false,
      };
    case CLEAR_RECOVERY_ERROR:
      return { ...state, recoveryError: null };

    case SEND_SMS_REQUEST:
      return { ...state, sendSmsError: null, sendSmsInProgress:true,sendSmsSuccess:false };
    case SEND_SMS_SUCCESS:
      return { ...state, phoneNumber: payload.data.phoneNumber,token:payload.data.token, sendSmsInProgress:false,sendSmsSuccess:true };
    case SEND_SMS_ERROR:
      return { ...state, phoneNumber: null, sendSmsError: payload,sendSmsInProgress:false ,sendSmsSuccess:false};

    default:
      return state;
  }
}

// ================ Action creators ================ //

export const passwordRecoveryRequest = () => ({ type: RECOVERY_REQUEST });
export const passwordRecoverySuccess = email => ({ type: RECOVERY_SUCCESS, payload: { email } });
export const passwordRecoveryError = (error, email) => ({
  type: RECOVERY_ERROR,
  payload: { error, email },
  error: true,
});
export const sendSmsRequest = () => ({ type: SEND_SMS_REQUEST });
export const sendSmsSuccess = data => ({ type: SEND_SMS_SUCCESS, payload: { data } });
export const sendSmsError = (error, data) => ({
  type: SEND_SMS_ERROR,
  payload: { error, data },
  error: true,
});
export const retypePasswordRecoveryEmail = () => ({ type: RETYPE_EMAIL });
export const clearPasswordRecoveryError = () => ({ type: CLEAR_RECOVERY_ERROR });

// ================ Thunks ================ //

export const recoverPassword = email => (dispatch, getState, sdk) => {
  dispatch(passwordRecoveryRequest());

  return sdk.passwordReset
    .request({ email })
    .then(() => dispatch(passwordRecoverySuccess(email)))
    .catch(e => dispatch(passwordRecoveryError(storableError(e), email)));
};

export const sendRecoverPasswordSms = email => (dispatch, getState, sdk) => {
  dispatch(sendSmsRequest());
  const otp = generateOTP(6);
  console.log("Calling sms");
  localStorage.setItem("otp",otp);
  sendSms({email,otp})
  .then(response => {
      console.log(response)

        sdk.passwordReset.request({
          email: email
        }, {expand:true}).then(res => {
          // res.data
          const tokenId = res.data.data.id.uuid;

          dispatch(passwordRecoveryRequest());
          dispatch(sendSmsSuccess({phoneNumber:response.data.data,token:tokenId}));

        })
       
      })
      .catch(e => {
        dispatch(sendSmsError(storableError(e)));
      });
};

export const resetPassword = (email,token,pw) => (dispatch, getState, sdk) => {
  console.log("Passwprd was reset starting")
  //dispatch(passwordRecoveryRequest());
      // sdk.passwordReset.reset({
      //   email: email,
      //   passwordResetToken: tokenId,
      //   newPassword: pw
      // },{expand:true}).then(res => {
      //   // res.data
      //   console.log("Passwprd was reset successfully")
      //   dispatch(passwordRecoverySuccess());

      // });

      resetPw({email:email,token:token,pw:pw})
};

const generateOTP = (length) => {
    let otp = '';
    const characters = '0123456789';
    for (let i = 0; i < length; i++) {
      otp += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return otp;
  };