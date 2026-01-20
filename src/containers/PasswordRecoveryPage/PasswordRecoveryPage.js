import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { useConfiguration } from '../../context/configurationContext';
import { FormattedMessage, useIntl } from '../../util/reactIntl';
import { propTypes } from '../../util/types';
import { isPasswordRecoveryEmailNotFoundError } from '../../util/errors';
import { isScrollingDisabled } from '../../ducks/ui.duck';

import {
  Heading,
  Page,
  InlineTextButton,
  IconKeys,
  ResponsiveBackgroundImageContainer,
  LayoutSingleColumn,
  NamedLink,
} from '../../components';

import TopbarContainer from '../../containers/TopbarContainer/TopbarContainer';
import FooterContainer from '../../containers/FooterContainer/FooterContainer';

import PasswordRecoveryForm from './PasswordRecoveryForm/PasswordRecoveryForm';

import {
  recoverPassword,
  retypePasswordRecoveryEmail,
  clearPasswordRecoveryError,
  resetPassword,
  sendRecoverPasswordSms,
} from './PasswordRecoveryPage.duck';
import css from './PasswordRecoveryPage.module.css';
import VerificationCodeForm from '../DashboardPage/VerificationCodeForm';

const PasswordRecovery = props => {
  const { initialEmail, onChange, onSubmitEmail,onSendRecoverySms, recoveryInProgress, recoveryError ,
    phoneNumber,
    sendSmsInProgress,
    sendSmsSuccess,
    onResetPassword,
  } = props;

  //console.log("ooooooooooooooooooooooooooooooooooooooo")

  const [showOtpForm,setShowOtpForm] = useState(false);
  const [phoneNo,setPhoneNo] = useState("");
  const [email,setEmail] = useState("");

  useEffect(()=>{
    if(phoneNumber !== null && phoneNumber !== undefined){
      //console.log(phoneNumber);
      const phone = phoneNumber;
      const last4 = `xxxxxxxxxx${phone.substr(-4)}`;
      setPhoneNo(last4)
      setShowOtpForm(true);
    }
  },[phoneNumber])

  useEffect(()=>{
    if(sendSmsSuccess){
      //console.log("SMS sent =======================")
    }
  },[sendSmsSuccess])


  return (
        <>
        {phoneNumber?
            <VerificationCodeForm phoneNumber={phoneNo} onResetPassword={onResetPassword} email={email} onSubmitEmail={onSubmitEmail} />
            :
            <div className={css.submitEmailContent}>
          
          <Heading as="h1" rootClassName={css.modalTitle} className={css.form_title}>
            <FormattedMessage id="PasswordRecoveryPage.forgotPasswordTitle" />
          </Heading>
          <p className={css.modalMessage}>
            <FormattedMessage id="PasswordRecoveryPage.forgotPasswordMessage" />
          </p>
            <PasswordRecoveryForm
              inProgress={recoveryInProgress}
              onChange={onChange}
              //onSubmit={values => {onSubmitEmail(values.email); setEmail(values.email);}}
              onSubmit={values => {onSendRecoverySms(values.email); setEmail(values.email);}}
              initialValues={{ email: initialEmail }}
              recoveryError={recoveryError}
              phoneNumber={phoneNumber}
              sendSmsInProgress={sendSmsInProgress}
            />
          
          
          <div className={css.flex_row}>
            <p>
              Already have an account? <NamedLink name="LoginPage" className={css.login_here} style={{textDecoration:"underline"}}>Login here</NamedLink>
            </p>
          </div>
        </div>
          }
        </>
    
  );
};

const GenericError = () => {
  return (
    <div className={css.genericErrorContent}>
      
      <Heading as="h1" rootClassName={css.modalTitle} className={css.form_title}>
        <FormattedMessage id="PasswordRecoveryPage.actionFailedTitle" />
      </Heading>
      <p className={css.modalMessage}>
        <FormattedMessage id="PasswordRecoveryPage.actionFailedMessage" />
      </p>
    </div>
  );
};

const EmailSubmittedContent = props => {
  const {
    passwordRequested,
    initialEmail,
    submittedEmail,
    onRetypeEmail,
    onSubmitEmail,
    recoveryInProgress,
  } = props;

  const submittedEmailText = (
    <span className={css.email}>{passwordRequested ? initialEmail : submittedEmail}</span>
  );

  const resendEmailLink = (
    <InlineTextButton rootClassName={css.helperLink} onClick={() => onSubmitEmail(submittedEmail)}>
      <FormattedMessage id="PasswordRecoveryPage.resendEmailLinkText" />
    </InlineTextButton>
  );

  const fixEmailLink = (
    <InlineTextButton rootClassName={css.helperLink} onClick={onRetypeEmail}>
      <FormattedMessage id="PasswordRecoveryPage.fixEmailLinkText" />
    </InlineTextButton>
  );

  return (
    <div className={css.emailSubmittedContent}>
      
      <Heading as="h1" rootClassName={css.modalTitle} className={css.form_title}>
        <FormattedMessage id="PasswordRecoveryPage.emailSubmittedTitle" />
      </Heading>
      <p className={css.modalMessage}>
        <FormattedMessage
          id="PasswordRecoveryPage.emailSubmittedMessage"
          values={{ submittedEmailText }}
        />
      </p>
      <div className={css.bottomWrapper}>
        <p className={css.helperText}>
          {recoveryInProgress ? (
            <FormattedMessage id="PasswordRecoveryPage.resendingEmailInfo" />
          ) : (
            <FormattedMessage
              id="PasswordRecoveryPage.resendEmailInfo"
              values={{ resendEmailLink }}
            />
          )}
        </p>
        <p className={css.helperText}>
          <FormattedMessage id="PasswordRecoveryPage.fixEmailInfo" values={{ fixEmailLink }} />
        </p>
      </div>
    </div>
  );
};

/**
 * The password recovery page.
 *
 * @param {Object} props
 * @param {boolean} props.scrollingDisabled - Whether the scrolling is disabled
 * @param {string} props.initialEmail - The initial email
 * @param {string} props.submittedEmail - The submitted email
 * @param {propTypes.error} props.recoveryError - The recovery error
 * @param {boolean} props.recoveryInProgress - Whether the recovery is in progress
 * @param {boolean} props.passwordRequested - Whether the password is requested
 * @param {function} props.onChange - The function to change the email
 * @param {function} props.onSubmitEmail - The function to submit the email
 * @param {function} props.onRetypeEmail - The function to retype the email
 * @returns {JSX.Element} Password recovery page component
 */
export const PasswordRecoveryPageComponent = props => {
  const config = useConfiguration();
  const intl = useIntl();
  const {
    scrollingDisabled,
    initialEmail,
    submittedEmail,
    recoveryError,
    recoveryInProgress,
    passwordRequested,
    onChange,
    onSubmitEmail,
    onRetypeEmail,
    sendSmsError,
    sendSmsInProgress,
    sendSmsSuccess,
    phoneNumber,
    onResetPassword,
    onSendRecoverySms,
    params
  } = props;

  
  const alreadyrequested = submittedEmail || passwordRequested;
  const showPasswordRecoveryForm = (
    <PasswordRecovery
      initialEmail={initialEmail}
      onChange={onChange}
      onSubmitEmail={onSubmitEmail}
      recoveryInProgress={recoveryInProgress}
      recoveryError={recoveryError}
      phoneNumber={phoneNumber}
      //token={token}
      sendSmsInProgress={sendSmsInProgress}
      sendSmsSuccess={sendSmsSuccess}
      onResetPassword={onResetPassword}
      onSendRecoverySms={onSendRecoverySms}
    />
  );

  return (
    <Page
      title={intl.formatMessage({
        id: 'PasswordRecoveryPage.title',
      })}
      scrollingDisabled={scrollingDisabled}
    >
      <LayoutSingleColumn
        mainColumnClassName={css.layoutWrapperMain}
        topbar={<TopbarContainer />}
        footer={<FooterContainer />}
      >
        <div className={css.form_con}>
          {isPasswordRecoveryEmailNotFoundError(recoveryError) ? (
            showPasswordRecoveryForm
          ) : recoveryError ? (
            <GenericError />
          ) : alreadyrequested ? (
            <EmailSubmittedContent
              passwordRequested={passwordRequested}
              initialEmail={initialEmail}
              submittedEmail={submittedEmail}
              onRetypeEmail={onRetypeEmail}
              onSubmitEmail={onSubmitEmail}
              recoveryInProgress={recoveryInProgress}
            />
          ) : (
            showPasswordRecoveryForm
          )}
        </div>
      </LayoutSingleColumn>
    </Page>
  );
};

const mapStateToProps = state => {
  const {
    initialEmail,
    submittedEmail,
    recoveryError,
    recoveryInProgress,
    passwordRequested,
    sendSmsError,
    sendSmsInProgress,
    sendSmsSuccess,
    phoneNumber
  } = state.PasswordRecoveryPage;
  return {
    scrollingDisabled: isScrollingDisabled(state),
    initialEmail,
    submittedEmail,
    recoveryError,
    recoveryInProgress,
    passwordRequested,
    sendSmsError,
    sendSmsInProgress,
    sendSmsSuccess,
    phoneNumber,
  };
};

const mapDispatchToProps = dispatch => ({
  onChange: () => dispatch(clearPasswordRecoveryError()),
  onSubmitEmail: email => dispatch(recoverPassword(email)),
  onSendRecoverySms: email => dispatch(sendRecoverPasswordSms(email)),
  onRetypeEmail: () => dispatch(retypePasswordRecoveryEmail()),
  onResetPassword: (email,pw,token)=> dispatch(resetPassword(email,token,pw))
});

const PasswordRecoveryPage = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(PasswordRecoveryPageComponent);

export default PasswordRecoveryPage;
