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

                      {/* <div className={css.password_con}>
                          <label>Password</label>
                          <div className={css.field_con}>
                            
                            {reveal?
                              <input 
                                type="password"
                                id={formId ? `${formId}.password` : 'password'}
                                name="password"
                                autoComplete="current-password"
                                label={passwordLabel}
                                placeholder={passwordPlaceholder}
                                validate={passwordRequired}
                                onChange={e=>setPassword(e.target.value)}
                              />
                              :
                              <input 
                                type="text"
                                id={formId ? `${formId}.password` : 'password'}
                                name="password"
                                autoComplete="current-password"
                                label={passwordLabel}
                                placeholder={passwordPlaceholder}
                                validate={passwordRequired}
                                onChange={e=>setPassword(e.target.value)}
                              />
                            }

                            {reveal?
                              <svg onClick={e=>{setReveal(!reveal)}} xmlns="http://www.w3.org/2000/svg" width="18" height="15" viewBox="0 0 18 15" fill="none">
                                <path d="M15.9341 0.244078C16.2595 0.569515 16.2595 1.09715 15.9341 1.42259L2.60077 14.7559C2.27533 15.0814 1.7477 15.0814 1.42226 14.7559C1.09682 14.4305 1.09682 13.9028 1.42226 13.5774L14.7556 0.244078C15.081 -0.0813592 15.6087 -0.0813592 15.9341 0.244078Z" fill="#667185"/>
                                <path d="M11.8444 1.9767C10.9059 1.53469 9.84758 1.25 8.67817 1.25C6.22475 1.25 4.26049 2.50308 2.86451 3.83307C1.46532 5.16611 0.557434 6.64973 0.198047 7.2915C-0.0374703 7.71207 -0.0655207 8.21426 0.127803 8.66031C0.262814 8.97181 0.492418 9.45437 0.830832 10.0143C1.06888 10.4082 1.58116 10.5346 1.97506 10.2965C2.36895 10.0585 2.4953 9.54621 2.25725 9.15232C1.98507 8.70192 1.79619 8.31241 1.68163 8.05369C2.01975 7.45778 2.82055 6.17693 4.01415 5.03975C5.24705 3.86513 6.81987 2.91667 8.67817 2.91667C9.34655 2.91667 9.978 3.03937 10.57 3.25116L11.8444 1.9767Z" fill="#667185"/>
                                <path d="M13.4203 5.11491C14.5707 6.23288 15.344 7.47087 15.6747 8.05369C15.5601 8.31241 15.3713 8.70192 15.0991 9.15232C14.861 9.54621 14.9874 10.0585 15.3813 10.2965C15.7752 10.5346 16.2875 10.4082 16.5255 10.0143C16.8639 9.45437 17.0935 8.97181 17.2285 8.6603C17.4219 8.21426 17.3938 7.71207 17.1583 7.2915C16.8082 6.66625 15.9374 5.24193 14.5989 3.93629L13.4203 5.11491Z" fill="#667185"/>
                                <path d="M8.67818 4.16667C8.98103 4.16667 9.27633 4.19898 9.56082 4.26034L7.84597 5.97519C7.13472 6.2262 6.57105 6.78987 6.32004 7.50112L4.60519 9.21597C4.54382 8.93148 4.51152 8.63618 4.51152 8.33333C4.51152 6.03215 6.377 4.16667 8.67818 4.16667Z" fill="#667185"/>
                                <path d="M8.67818 10.8333C8.38579 10.8333 8.10511 10.7831 7.84431 10.6909L6.59344 11.9418C7.20662 12.2968 7.91867 12.5 8.67818 12.5C10.9794 12.5 12.8448 10.6345 12.8448 8.33333C12.8448 7.57382 12.6416 6.86177 12.2866 6.24859L11.0357 7.49947C11.128 7.76027 11.1782 8.04094 11.1782 8.33333C11.1782 9.71405 10.0589 10.8333 8.67818 10.8333Z" fill="#667185"/>
                              </svg>
                            :
                              <svg onClick={e=>{setReveal(!reveal)}} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                                  <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                                  <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                              </svg>

                            }
                          </div>
                      </div> */}
                    



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
