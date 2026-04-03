import React, { useState } from 'react';
import { Form as FinalForm } from 'react-final-form';
import classNames from 'classnames';

import { FormattedMessage, useIntl } from '../../../util/reactIntl';
import * as validators from '../../../util/validators';
import { Form, PrimaryButton, FieldTextInput, NamedLink, FieldCheckbox } from '../../../components';

import css from './LoginForm.module.css';
import FieldPasswordInput from '../../../components/FieldTextInput/FieldPasswordInput';

const LoginFormComponent = props => (
  
  <FinalForm
    {...props}
    render={fieldRenderProps => {
      const {
        rootClassName,
        className,
        formId,
        handleSubmit,
        inProgress,
        intl,
        invalid,
        socialBtns,
        socialGoogleBtns,
        errorMsg,
        reveal,
        setReveal,
        setPassword
      } = fieldRenderProps;

      // email
      const emailLabel = intl.formatMessage({
        id: 'LoginForm.emailLabel',
      });
      const emailPlaceholder = intl.formatMessage({
        id: 'LoginForm.emailPlaceholder',
      });
      const emailRequiredMessage = intl.formatMessage({
        id: 'LoginForm.emailRequired',
      });
      const emailRequired = validators.required(emailRequiredMessage);
      const emailInvalidMessage = intl.formatMessage({
        id: 'LoginForm.emailInvalid',
      });
      const emailValid = validators.emailFormatValid(emailInvalidMessage);

      // password
      const passwordLabel = intl.formatMessage({
        id: 'LoginForm.passwordLabel',
      });
      const passwordPlaceholder = intl.formatMessage({
        id: 'LoginForm.passwordPlaceholder',
      });
      const passwordRequiredMessage = intl.formatMessage({
        id: 'LoginForm.passwordRequired',
      });
      const passwordRequired = validators.requiredStringNoTrim(passwordRequiredMessage);

      const classes = classNames(rootClassName || css.root, className);
      const submitInProgress = inProgress;
      const submitDisabled = invalid || submitInProgress;

      const passwordRecoveryLink = (
        <NamedLink name="PasswordRecoveryPage" className={css.recoveryLink}>
          <FormattedMessage id="LoginForm.forgotPassword" />
        </NamedLink>
      );

      

      return (

          <div className={css.main_con}>
              <div className={css.form_header_con}>
                <span className={css.form_header}><FormattedMessage id="LoginForm.welcomeBack" /></span>
                <p><FormattedMessage id="LoginForm.loginToConnect" /></p>
                <div className={css.error}>{errorMsg}</div>
              </div>

              <div className={css.flex_row_btn}>
                {socialGoogleBtns}
                {/* <button className={css.social_btn}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="apple-color-svgrepo-com 1">
                    <g id="Icons">
                    <g id="Color-">
                    <path id="Apple" fill-rule="evenodd" clip-rule="evenodd" d="M15.3374 3.89624C16.1201 2.88584 16.7134 1.45774 16.4988 0C15.2195 0.088904 13.7242 0.907396 12.8517 1.97424C12.0564 2.9409 11.4027 4.37889 11.658 5.77454C13.0565 5.81828 14.4999 4.98002 15.3374 3.89624ZM22.25 17.6086C21.6903 18.8561 21.421 19.4135 20.7 20.5185C19.6942 22.0609 18.2761 23.9815 16.5171 23.9956C14.9558 24.0125 14.5532 22.9725 12.4337 22.9852C10.3142 22.9965 9.87235 24.0153 8.30831 23.9998C6.5507 23.9843 5.20688 22.2514 4.20113 20.709C1.38726 16.3992 1.09128 11.3402 2.82646 8.64908C4.06086 6.73835 6.00784 5.6207 7.83699 5.6207C9.69841 5.6207 10.8697 6.64804 12.4113 6.64804C13.9066 6.64804 14.817 5.61789 16.9701 5.61789C18.6001 5.61789 20.3269 6.51115 21.5557 8.05215C17.527 10.2733 18.1793 16.0606 22.25 17.6086Z" fill="#0B0B0A"/>
                    </g>
                    </g>
                    </g>
                  </svg>

                  <span className={css.show_labe}>Sign in with Apple</span>
                </button> */}
                {socialBtns}
                
              </div>
               <div className={css.or_con}>
                <div className={css.hr}></div><FormattedMessage id="LoginForm.orr" /><div className={css.hr}></div>
              </div>
              <Form className={classes} onSubmit={handleSubmit}>
               
                  <div className={css.defaultUserFields}>

                      <FieldTextInput
                        className={css.input_f}
                        type="email"
                        id={formId ? `${formId}.email` : 'email'}
                        name="email"
                        autoComplete="email"
                        label={emailLabel}
                        placeholder={emailPlaceholder}
                        validate={validators.composeValidators(emailRequired, emailValid)}
                      />

                      <FieldPasswordInput
                        setPassword={setPassword}
                      />


                  </div>

                  <div className={css.rem_me}>
                    <FieldCheckbox 
                      id="checkbox-id1" 
                      name="checkbox-group" 
                      label={intl.formatMessage({
                                  id: 'LoginForm.rememberMe',
                                })}
                      value="RememberMe" 
                    />
                    <NamedLink name="PasswordRecoveryPage">
                      <FormattedMessage id="LoginForm.forgotPasswordQuestion" />
                    </NamedLink>
                  </div>
                
               
                <div className={css.bottomWrapper}>
                  
                  <PrimaryButton type="submit" inProgress={submitInProgress} disabled={submitDisabled}>
                    <FormattedMessage id="LoginForm.logIn" />
                  </PrimaryButton>
                </div>
                 
                <div className={css.dontHaveAc}>
                   <span>
                    <FormattedMessage id="LoginForm.dontHaveAccount" /> <NamedLink name="SignupPage"><FormattedMessage id="LoginForm.signupHere" /></NamedLink>
                  </span>
                </div>
                <div className={css.simple_con}>
                   <span>
                     <FormattedMessage id="LoginForm.byLoggingIn" /> 
                  </span>
                </div>

               
              </Form>
            </div>




        // <Form className={classes} onSubmit={handleSubmit}>
        //   <div>
        //     <FieldTextInput
        //       type="email"
        //       id={formId ? `${formId}.email` : 'email'}
        //       name="email"
        //       autoComplete="email"
        //       label={emailLabel}
        //       placeholder={emailPlaceholder}
        //       validate={validators.composeValidators(emailRequired, emailValid)}
        //     />
        //     <FieldTextInput
        //       className={css.password}
        //       type="password"
        //       id={formId ? `${formId}.password` : 'password'}
        //       name="password"
        //       autoComplete="current-password"
        //       label={passwordLabel}
        //       placeholder={passwordPlaceholder}
        //       validate={passwordRequired}
        //     />
        //   </div>
        //   <div className={css.bottomWrapper}>
        //     <p className={css.bottomWrapperText}>
        //       <span className={css.recoveryLinkInfo}>
        //         <FormattedMessage
        //           id="LoginForm.forgotPasswordInfo"
        //           values={{ passwordRecoveryLink }}
        //         />
        //       </span>
        //     </p>
        //     <PrimaryButton type="submit" inProgress={submitInProgress} disabled={submitDisabled}>
        //       <FormattedMessage id="LoginForm.logIn" />
        //     </PrimaryButton>
        //   </div>
        // </Form>
      );
    }}
  />
);

/**
 * A component that renders the login form.
 *
 * @component
 * @param {Object} props
 * @param {string} props.rootClassName - The root class name that overrides the default class css.root
 * @param {string} props.className - The class that extends the root class
 * @param {string} props.formId - The form id
 * @param {boolean} props.inProgress - Whether the form is in progress
 * @returns {JSX.Element}
 */
const LoginForm = props => {
  const intl = useIntl();
  return <LoginFormComponent {...props} intl={intl} />;
};

export default LoginForm;
