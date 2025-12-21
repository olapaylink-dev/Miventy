import React, { useEffect, useRef, useState } from 'react';
import { Form as FinalForm } from 'react-final-form';
import classNames from 'classnames';

import { FormattedMessage, useIntl } from '../../../util/reactIntl';
import * as validators from '../../../util/validators';

import { Form, PrimaryButton, FieldTextInput, Button } from '../../../components';

import css from './PasswordResetFormDashboard.module.css';
import { values } from 'lodash';
import { isChangePasswordWrongPassword } from '../../../util/errors';

/**
 * The reset-password form.
 *
 * @param {Object} props
 * @param {string} [props.formId] - The form ID
 * @param {string} [props.rootClassName] - Custom class that overrides the default class for the root element
 * @param {string} [props.className] - Custom class that extends the default class for the root element
 * @param {boolean} [props.inProgress] - Whether the form is in progress
 * @returns {JSX.Element} Reset-password form component
 */
const PasswordResetFormDashboard = props => (
  <FinalForm
    {...props}
    render={fieldRenderProps => {
      const {
        rootClassName,
        className,
        formId,
        handleSubmit,
        inProgress = false,
        invalid,
        values,
        changePasswordError
      } = fieldRenderProps;

      const [submittedValues,setSubmittedValues] = useState({});
      const [pw2,setPw2] = useState("");

      const intl = useIntl();
      // password
      const passwordLabel = intl.formatMessage({
        id: 'PasswordResetForm.passwordLabel',
      });
       const confirmPasswordLabel = intl.formatMessage({
        id: 'PasswordChangeForm.confirmPasswordLabel',
      });
      const passwordPlaceholder = intl.formatMessage({
        id: 'PasswordResetForm.passwordPlaceholder',
      });
      const passwordRequiredMessage = intl.formatMessage({
        id: 'PasswordResetForm.passwordRequired',
      });
      const passwordMinLengthMessage = intl.formatMessage(
        {
          id: 'PasswordResetForm.passwordTooShort',
        },
        {
          minLength: validators.PASSWORD_MIN_LENGTH,
        }
      );
      const passwordMaxLengthMessage = intl.formatMessage(
        {
          id: 'PasswordResetForm.passwordTooLong',
        },
        {
          maxLength: validators.PASSWORD_MAX_LENGTH,
        }
      );

                // New password
      const newPasswordLabel = intl.formatMessage({
        id: 'PasswordChangeForm.newPasswordLabel',
      });

      const newPasswordPlaceholder = intl.formatMessage({
            id: 'PasswordChangeForm.newPasswordPlaceholder',
          });
      const newPasswordRequiredMessage = intl.formatMessage({
        id: 'PasswordChangeForm.newPasswordRequired',
      });
      const newPasswordRequired = validators.requiredStringNoTrim(newPasswordRequiredMessage);



      const passwordRequired = validators.requiredStringNoTrim(passwordRequiredMessage);
      const passwordMinLength = validators.minLength(
        passwordMinLengthMessage,
        validators.PASSWORD_MIN_LENGTH
      );
      const passwordMaxLength = validators.maxLength(
        passwordMaxLengthMessage,
        validators.PASSWORD_MAX_LENGTH
      );

      useEffect(()=>{

      },[pw2]);

      const classes = classNames(rootClassName || css.root, className);

      const submitInProgress = inProgress;
      const submitDisabled = invalid || submitInProgress;

       const handlePassChanged = e =>{
        setPw1(e.target.value);
        console.log(e.target.value);
        console.log(pw1);
      }

      const handlePass2Changed = e =>{
        setPw2(e.target.value);
        console.log(e.target.value);
        console.log(pw1);
      }

      const passwordTouched = values.currentPassword && values.newPassword === values.currentPassword;

      const passwordErrorText = "Password must match";

      const handleCheckPasswordMatch = e=>{
        console.log(e.target.value);
      }


      return (
        <Form className={classes} onSubmit={e=>{
          setSubmittedValues(values);
          handleSubmit(e);
        }
          }>
            <h1 className={css.header}>Password settings</h1>
            <span>Change your password</span>

            <FieldTextInput
                className={css.password}
                type="password"
                id="currentPassword"
                name="currentPassword"
                autoComplete="current-password"
                label={"Current password"}
                placeholder={passwordPlaceholder}
                validate={validators.composeValidators(
                  passwordRequired,
                  passwordMinLength,
                  passwordMaxLength
                )}
                customErrorText={passwordTouched ? null : passwordErrorText}
              />

            <FieldTextInput
              className={css.password}
              type="password"
              id={formId ? `${formId}.newPassword` : 'newPassword'}
              name="newPassword"
              autoComplete="new-password"
              label={newPasswordLabel}
              placeholder={newPasswordPlaceholder}
              validate={validators.composeValidators(
                newPasswordRequired,
                passwordMinLength,
                passwordMaxLength
              )}
            />

            {/* <FieldTextInput
                className={css.password}
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                autoComplete="confirm-password"
                label={"Confirm password"}
                placeholder={passwordPlaceholder}
                validate={validators.composeValidators(
                  passwordRequired,
                  passwordMinLength,
                  passwordMaxLength
                )}
                customErrorText={passwordTouched ? null : passwordErrorText}
              /> */}

          <button className={css.submit_btn} type="submit" inProgress={submitInProgress} disabled={submitDisabled}>
            Save
          </button>
        </Form>
      );
    }}
  />
);

export default PasswordResetFormDashboard;
