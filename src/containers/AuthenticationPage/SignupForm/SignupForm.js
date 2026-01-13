import React, { useEffect, useRef } from 'react';
import { Form as FinalForm } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import classNames from 'classnames';

import { FormattedMessage, useIntl } from '../../../util/reactIntl';
import { propTypes } from '../../../util/types';
import * as validators from '../../../util/validators';
import { getPropsForCustomUserFieldInputs } from '../../../util/userHelpers';

import { Form, PrimaryButton, FieldTextInput, CustomExtendedDataField, FieldPhoneNumberInput, NamedLink } from '../../../components';

import FieldSelectUserType from '../FieldSelectUserType';
import UserFieldDisplayName from '../UserFieldDisplayName';
import UserFieldPhoneNumber from '../UserFieldPhoneNumber';

import css from './SignupForm.module.css';

const getSoleUserTypeMaybe = userTypes =>
  Array.isArray(userTypes) && userTypes.length === 1 ? userTypes[0].userType : null;

const SignupFormComponent = props => (
  <FinalForm
    {...props}
    mutators={{ ...arrayMutators }}
    initialValues={{ userType: props.preselectedUserType || getSoleUserTypeMaybe(props.userTypes) }}
    render={formRenderProps => {
      const {
        rootClassName,
        className,
        formId,
        handleSubmit,
        inProgress,
        invalid,
        intl,
        termsAndConditions,
        preselectedUserType,
        userTypes,
        userFields,
        values,
        socialBtns,
        socialGoogleBtns,
        errorMsg,
        history,
        reveal,
        setReveal,
        setPassword,
        setCountryCode
      } = formRenderProps;

      const error = useRef(null);

      const { userType } = values || {};

      // email
      const emailRequired = validators.required(
        intl.formatMessage({
          id: 'SignupForm.emailRequired',
        })
      );
      const emailValid = validators.emailFormatValid(
        intl.formatMessage({
          id: 'SignupForm.emailInvalid',
        })
      );

      // password
      const passwordRequiredMessage = intl.formatMessage({
        id: 'SignupForm.passwordRequired',
      });
      const passwordMinLengthMessage = intl.formatMessage(
        {
          id: 'SignupForm.passwordTooShort',
        },
        {
          minLength: validators.PASSWORD_MIN_LENGTH,
        }
      );
      const passwordMaxLengthMessage = intl.formatMessage(
        {
          id: 'SignupForm.passwordTooLong',
        },
        {
          maxLength: validators.PASSWORD_MAX_LENGTH,
        }
      );
      const passwordMinLength = validators.minLength(
        passwordMinLengthMessage,
        validators.PASSWORD_MIN_LENGTH
      );
      const passwordMaxLength = validators.maxLength(
        passwordMaxLengthMessage,
        validators.PASSWORD_MAX_LENGTH
      );
      const passwordRequired = validators.requiredStringNoTrim(passwordRequiredMessage);
      const passwordValidators = validators.composeValidators(
        passwordRequired,
        passwordMinLength,
        passwordMaxLength
      );

      // Custom user fields. Since user types are not supported here,
      // only fields with no user type id limitation are selected.
      const userFieldProps = getPropsForCustomUserFieldInputs(userFields, intl, userType);

      const noUserTypes = !userType && !(userTypes?.length > 0);
      const userTypeConfig = userTypes.find(config => config.userType === userType);
      const showDefaultUserFields = userType || noUserTypes;
      const showCustomUserFields = (userType || noUserTypes) && userFieldProps?.length > 0;

      const classes = classNames(rootClassName || css.root, className);
      const submitInProgress = inProgress;
      const submitDisabled = invalid || submitInProgress;
      const required = validators.required('This field is required');

      console.log("ccccccccc")

      useEffect(()=>{
        if(errorMsg){
          
          error.current.scrollIntoView();
        }
      },[errorMsg])

      return (
            <div  className={css.main_con}>
              <div ref={error} className={css.form_header_con}>
                <span className={css.form_header}>Get started on Miventy</span>
                <p>Create an account or login to connect with entertainers and clients</p>
                
              </div>

              <div className={css.flex_row_btn}>
                
                {socialGoogleBtns}
                {/* <button className={css.social_btn}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="apple-color-svgrepo-com 1">
                    <g id="Icons">
                    <g id="Color-">
                    <path id="Apple" fillRule="evenodd" clip-rule="evenodd" d="M15.3374 3.89624C16.1201 2.88584 16.7134 1.45774 16.4988 0C15.2195 0.088904 13.7242 0.907396 12.8517 1.97424C12.0564 2.9409 11.4027 4.37889 11.658 5.77454C13.0565 5.81828 14.4999 4.98002 15.3374 3.89624ZM22.25 17.6086C21.6903 18.8561 21.421 19.4135 20.7 20.5185C19.6942 22.0609 18.2761 23.9815 16.5171 23.9956C14.9558 24.0125 14.5532 22.9725 12.4337 22.9852C10.3142 22.9965 9.87235 24.0153 8.30831 23.9998C6.5507 23.9843 5.20688 22.2514 4.20113 20.709C1.38726 16.3992 1.09128 11.3402 2.82646 8.64908C4.06086 6.73835 6.00784 5.6207 7.83699 5.6207C9.69841 5.6207 10.8697 6.64804 12.4113 6.64804C13.9066 6.64804 14.817 5.61789 16.9701 5.61789C18.6001 5.61789 20.3269 6.51115 21.5557 8.05215C17.527 10.2733 18.1793 16.0606 22.25 17.6086Z" fill="#0B0B0A"/>
                    </g>
                    </g>
                    </g>
                  </svg>

                  <span className={css.show_labe}>Sign in with Apple</span>
                </button> */}
                {socialBtns}
                
              </div>

              <div className={css.error}>{errorMsg}</div>
              
              <Form className={classes} onSubmit={handleSubmit}>
               
                
                  <div className={css.defaultUserFields}>

                      <FieldTextInput
                       
                        type="text"
                        id={formId ? `${formId}.firstName` : 'firstName'}
                        name="firstName"
                        autoComplete="given-name"
                        label={intl.formatMessage({
                          id: 'SignupForm.firstNameLabel',
                        })}
                        placeholder={intl.formatMessage({
                          id: 'SignupForm.firstNamePlaceholder',
                        })}
                        validate={validators.required(
                          intl.formatMessage({
                            id: 'SignupForm.firstNameRequired',
                          })
                        )}
                      />
                      <FieldTextInput
                        
                        type="text"
                        id={formId ? `${formId}.lastName` : 'lastName'}
                        name="lastName"
                        autoComplete="family-name"
                        label={intl.formatMessage({
                          id: 'SignupForm.lastNameLabel',
                        })}
                        placeholder={intl.formatMessage({
                          id: 'SignupForm.lastNamePlaceholder',
                        })}
                        validate={validators.required(
                          intl.formatMessage({
                            id: 'SignupForm.lastNameRequired',
                          })
                        )}
                      />


                    <FieldTextInput
                      type="email"
                      id={formId ? `${formId}.email` : 'email'}
                      name="email"
                      autoComplete="email"
                      label={intl.formatMessage({
                        id: 'SignupForm.emailLabel',
                      })}
                      placeholder={intl.formatMessage({
                        id: 'SignupForm.emailPlaceholder',
                      })}
                      validate={validators.composeValidators(emailRequired, emailValid)}
                    />
                    
                     <div className={css.password_con}>
                          <label>Password</label>
                          <div className={css.field_con}>
                            
                            {reveal?
                              <input 
                                type="password"
                                id={formId ? `${formId}.password` : 'password'}
                                name="password"
                                autoComplete="current-password"
                                placeholder={intl.formatMessage({
                                  id: 'SignupForm.passwordPlaceholder',
                                })}
                                // validate={passwordValidators}
                                onChange={e=>setPassword(e.target.value)}
                              />
                              :
                              <input 
                                type="text"
                                id={formId ? `${formId}.password` : 'password'}
                                name="password"
                                autoComplete="current-password"
                                placeholder={intl.formatMessage({
                                  id: 'SignupForm.passwordPlaceholder',
                                })}
                                // validate={passwordValidators}
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
                      </div>
                    {/* <FieldTextInput
                     
                      type="password"
                      id={formId ? `${formId}.password` : 'password'}
                      name="password"
                      autoComplete="new-password"
                      label={intl.formatMessage({
                        id: 'SignupForm.passwordLabel',
                      })}
                      placeholder={intl.formatMessage({
                        id: 'SignupForm.passwordPlaceholder',
                      })}
                      validate={passwordValidators}
                    /> */}

                    <div className={css.flex_col}>
                      <span className={css.phone_label}>Phone number</span>
                      <div className={css.phone_con}>
                        <div className={css.select_country}>
                            <select  name="countryCode" id="" onChange={e=>setCountryCode(e.target.value)}>
                            <option data-countryCode="GB" value="+44" Selected><span className={css.bg_green}>UK (+44)</span></option>
                            <option data-countryCode="US" value="+1">USA (+1)</option>
                            <optgroup label="Other countries">
                              <option data-countryCode="DZ" value="+213">Algeria (+213)</option>
                              <option data-countryCode="AD" value="+376">Andorra (+376)</option>
                              <option data-countryCode="AO" value="+244">Angola (+244)</option>
                              <option data-countryCode="AI" value="+1264">Anguilla (+1264)</option>
                              <option data-countryCode="AG" value="+1268">Antigua &amp; Barbuda (+1268)</option>
                              <option data-countryCode="AR" value="+54">Argentina (+54)</option>
                              <option data-countryCode="AM" value="+374">Armenia (+374)</option>
                              <option data-countryCode="AW" value="+297">Aruba (+297)</option>
                              <option data-countryCode="AU" value="+61">Australia (+61)</option>
                              <option data-countryCode="AT" value="+43">Austria (+43)</option>
                              <option data-countryCode="AZ" value="+994">Azerbaijan (+994)</option>
                              <option data-countryCode="BS" value="+1242">Bahamas (+1242)</option>
                              <option data-countryCode="BH" value="+973">Bahrain (+973)</option>
                              <option data-countryCode="BD" value="+880">Bangladesh (+880)</option>
                              <option data-countryCode="BB" value="+1246">Barbados (+1246)</option>
                              <option data-countryCode="BY" value="+375">Belarus (+375)</option>
                              <option data-countryCode="BE" value="+32">Belgium (+32)</option>
                              <option data-countryCode="BZ" value="+501">Belize (+501)</option>
                              <option data-countryCode="BJ" value="+229">Benin (+229)</option>
                              <option data-countryCode="BM" value="+1441">Bermuda (+1441)</option>
                              <option data-countryCode="BT" value="+975">Bhutan (+975)</option>
                              <option data-countryCode="BO" value="+591">Bolivia (+591)</option>
                              <option data-countryCode="BA" value="+387">Bosnia Herzegovina (+387)</option>
                              <option data-countryCode="BW" value="+267">Botswana (+267)</option>
                              <option data-countryCode="BR" value="+55">Brazil (+55)</option>
                              <option data-countryCode="BN" value="+673">Brunei (+673)</option>
                              <option data-countryCode="BG" value="+359">Bulgaria (+359)</option>
                              <option data-countryCode="BF" value="+226">Burkina Faso (+226)</option>
                              <option data-countryCode="BI" value="+257">Burundi (+257)</option>
                              <option data-countryCode="KH" value="+855">Cambodia (+855)</option>
                              <option data-countryCode="CM" value="+237">Cameroon (+237)</option>
                              <option data-countryCode="CA" value="+1">Canada (+1)</option>
                              <option data-countryCode="CV" value="+238">Cape Verde Islands (+238)</option>
                              <option data-countryCode="KY" value="+1345">Cayman Islands (+1345)</option>
                              <option data-countryCode="CF" value="+236">Central African Republic (+236)</option>
                              <option data-countryCode="CL" value="+56">Chile (+56)</option>
                              <option data-countryCode="CN" value="+86">China (+86)</option>
                              <option data-countryCode="CO" value="+57">Colombia (+57)</option>
                              <option data-countryCode="KM" value="+269">Comoros (+269)</option>
                              <option data-countryCode="CG" value="+242">Congo (+242)</option>
                              <option data-countryCode="CK" value="+682">Cook Islands (+682)</option>
                              <option data-countryCode="CR" value="+506">Costa Rica (+506)</option>
                              <option data-countryCode="HR" value="+385">Croatia (+385)</option>
                              <option data-countryCode="CU" value="+53">Cuba (+53)</option>
                              <option data-countryCode="CY" value="+90392">Cyprus North (+90392)</option>
                              <option data-countryCode="CY" value="+357">Cyprus South (+357)</option>
                              <option data-countryCode="CZ" value="+42">Czech Republic (+42)</option>
                              <option data-countryCode="DK" value="+45">Denmark (+45)</option>
                              <option data-countryCode="DJ" value="+253">Djibouti (+253)</option>
                              <option data-countryCode="DM" value="+1809">Dominica (+1809)</option>
                              <option data-countryCode="DO" value="+1809">Dominican Republic (+1809)</option>
                              <option data-countryCode="EC" value="+593">Ecuador (+593)</option>
                              <option data-countryCode="EG" value="+20">Egypt (+20)</option>
                              <option data-countryCode="SV" value="+503">El Salvador (+503)</option>
                              <option data-countryCode="GQ" value="+240">Equatorial Guinea (+240)</option>
                              <option data-countryCode="ER" value="+291">Eritrea (+291)</option>
                              <option data-countryCode="EE" value="+372">Estonia (+372)</option>
                              <option data-countryCode="ET" value="+251">Ethiopia (+251)</option>
                              <option data-countryCode="FK" value="+500">Falkland Islands (+500)</option>
                              <option data-countryCode="FO" value="+298">Faroe Islands (+298)</option>
                              <option data-countryCode="FJ" value="+679">Fiji (+679)</option>
                              <option data-countryCode="FI" value="+358">Finland (+358)</option>
                              <option data-countryCode="FR" value="+33">France (+33)</option>
                              <option data-countryCode="GF" value="+594">French Guiana (+594)</option>
                              <option data-countryCode="PF" value="+689">French Polynesia (+689)</option>
                              <option data-countryCode="GA" value="+241">Gabon (+241)</option>
                              <option data-countryCode="GM" value="+220">Gambia (+220)</option>
                              <option data-countryCode="GE" value="+7880">Georgia (+7880)</option>
                              <option data-countryCode="DE" value="+49">Germany (+49)</option>
                              <option data-countryCode="GH" value="+233">Ghana (+233)</option>
                              <option data-countryCode="GI" value="+350">Gibraltar (+350)</option>
                              <option data-countryCode="GR" value="+30">Greece (+30)</option>
                              <option data-countryCode="GL" value="+299">Greenland (+299)</option>
                              <option data-countryCode="GD" value="+1473">Grenada (+1473)</option>
                              <option data-countryCode="GP" value="+590">Guadeloupe (+590)</option>
                              <option data-countryCode="GU" value="+671">Guam (+671)</option>
                              <option data-countryCode="GT" value="+502">Guatemala (+502)</option>
                              <option data-countryCode="GN" value="+224">Guinea (+224)</option>
                              <option data-countryCode="GW" value="+245">Guinea - Bissau (+245)</option>
                              <option data-countryCode="GY" value="+592">Guyana (+592)</option>
                              <option data-countryCode="HT" value="+509">Haiti (+509)</option>
                              <option data-countryCode="HN" value="+504">Honduras (+504)</option>
                              <option data-countryCode="HK" value="+852">Hong Kong (+852)</option>
                              <option data-countryCode="HU" value="+36">Hungary (+36)</option>
                              <option data-countryCode="IS" value="+354">Iceland (+354)</option>
                              <option data-countryCode="IN" value="+91">India (+91)</option>
                              <option data-countryCode="ID" value="+62">Indonesia (+62)</option>
                              <option data-countryCode="IR" value="+98">Iran (+98)</option>
                              <option data-countryCode="IQ" value="+964">Iraq (+964)</option>
                              <option data-countryCode="IE" value="+353">Ireland (+353)</option>
                              <option data-countryCode="IL" value="+972">Israel (+972)</option>
                              <option data-countryCode="IT" value="+39">Italy (+39)</option>
                              <option data-countryCode="JM" value="+1876">Jamaica (+1876)</option>
                              <option data-countryCode="JP" value="+81">Japan (+81)</option>
                              <option data-countryCode="JO" value="+962">Jordan (+962)</option>
                              <option data-countryCode="KZ" value="+7">Kazakhstan (+7)</option>
                              <option data-countryCode="KE" value="+254">Kenya (+254)</option>
                              <option data-countryCode="KI" value="+686">Kiribati (+686)</option>
                              <option data-countryCode="KP" value="+850">Korea North (+850)</option>
                              <option data-countryCode="KR" value="+82">Korea South (+82)</option>
                              <option data-countryCode="KW" value="+965">Kuwait (+965)</option>
                              <option data-countryCode="KG" value="+996">Kyrgyzstan (+996)</option>
                              <option data-countryCode="LA" value="+856">Laos (+856)</option>
                              <option data-countryCode="LV" value="+371">Latvia (+371)</option>
                              <option data-countryCode="LB" value="+961">Lebanon (+961)</option>
                              <option data-countryCode="LS" value="+266">Lesotho (+266)</option>
                              <option data-countryCode="LR" value="+231">Liberia (+231)</option>
                              <option data-countryCode="LY" value="+218">Libya (+218)</option>
                              <option data-countryCode="LI" value="+417">Liechtenstein (+417)</option>
                              <option data-countryCode="LT" value="+370">Lithuania (+370)</option>
                              <option data-countryCode="LU" value="+352">Luxembourg (+352)</option>
                              <option data-countryCode="MO" value="+853">Macao (+853)</option>
                              <option data-countryCode="MK" value="+389">Macedonia (+389)</option>
                              <option data-countryCode="MG" value="+261">Madagascar (+261)</option>
                              <option data-countryCode="MW" value="+265">Malawi (+265)</option>
                              <option data-countryCode="MY" value="+60">Malaysia (+60)</option>
                              <option data-countryCode="MV" value="+960">Maldives (+960)</option>
                              <option data-countryCode="ML" value="+223">Mali (+223)</option>
                              <option data-countryCode="MT" value="+356">Malta (+356)</option>
                              <option data-countryCode="MH" value="+692">Marshall Islands (+692)</option>
                              <option data-countryCode="MQ" value="+596">Martinique (+596)</option>
                              <option data-countryCode="MR" value="+222">Mauritania (+222)</option>
                              <option data-countryCode="YT" value="+269">Mayotte (+269)</option>
                              <option data-countryCode="MX" value="+52">Mexico (+52)</option>
                              <option data-countryCode="FM" value="+691">Micronesia (+691)</option>
                              <option data-countryCode="MD" value="+373">Moldova (+373)</option>
                              <option data-countryCode="MC" value="+377">Monaco (+377)</option>
                              <option data-countryCode="MN" value="+976">Mongolia (+976)</option>
                              <option data-countryCode="MS" value="+1664">Montserrat (+1664)</option>
                              <option data-countryCode="MA" value="+212">Morocco (+212)</option>
                              <option data-countryCode="MZ" value="+258">Mozambique (+258)</option>
                              <option data-countryCode="MN" value="+95">Myanmar (+95)</option>
                              <option data-countryCode="NA" value="+264">Namibia (+264)</option>
                              <option data-countryCode="NR" value="+674">Nauru (+674)</option>
                              <option data-countryCode="NP" value="+977">Nepal (+977)</option>
                              <option data-countryCode="NL" value="+31">Netherlands (+31)</option>
                              <option data-countryCode="NC" value="+687">New Caledonia (+687)</option>
                              <option data-countryCode="NZ" value="+64">New Zealand (+64)</option>
                              <option data-countryCode="NI" value="+505">Nicaragua (+505)</option>
                              <option data-countryCode="NE" value="+227">Niger (+227)</option>
                              <option data-countryCode="NG" value="+234">Nigeria (+234)</option>
                              <option data-countryCode="NU" value="+683">Niue (+683)</option>
                              <option data-countryCode="NF" value="+672">Norfolk Islands (+672)</option>
                              <option data-countryCode="NP" value="+670">Northern Marianas (+670)</option>
                              <option data-countryCode="NO" value="+47">Norway (+47)</option>
                              <option data-countryCode="OM" value="+968">Oman (+968)</option>
                              <option data-countryCode="PW" value="+680">Palau (+680)</option>
                              <option data-countryCode="PA" value="+507">Panama (+507)</option>
                              <option data-countryCode="PG" value="+675">Papua New Guinea (+675)</option>
                              <option data-countryCode="PY" value="+595">Paraguay (+595)</option>
                              <option data-countryCode="PE" value="+51">Peru (+51)</option>
                              <option data-countryCode="PH" value="+63">Philippines (+63)</option>
                              <option data-countryCode="PL" value="+48">Poland (+48)</option>
                              <option data-countryCode="PT" value="+351">Portugal (+351)</option>
                              <option data-countryCode="PR" value="+1787">Puerto Rico (+1787)</option>
                              <option data-countryCode="QA" value="+974">Qatar (+974)</option>
                              <option data-countryCode="RE" value="+262">Reunion (+262)</option>
                              <option data-countryCode="RO" value="+40">Romania (+40)</option>
                              <option data-countryCode="RU" value="+7">Russia (+7)</option>
                              <option data-countryCode="RW" value="+250">Rwanda (+250)</option>
                              <option data-countryCode="SM" value="+378">San Marino (+378)</option>
                              <option data-countryCode="ST" value="+239">Sao Tome &amp; Principe (+239)</option>
                              <option data-countryCode="SA" value="+966">Saudi Arabia (+966)</option>
                              <option data-countryCode="SN" value="+221">Senegal (+221)</option>
                              <option data-countryCode="CS" value="+381">Serbia (+381)</option>
                              <option data-countryCode="SC" value="+248">Seychelles (+248)</option>
                              <option data-countryCode="SL" value="+232">Sierra Leone (+232)</option>
                              <option data-countryCode="SG" value="+65">Singapore (+65)</option>
                              <option data-countryCode="SK" value="+421">Slovak Republic (+421)</option>
                              <option data-countryCode="SI" value="+386">Slovenia (+386)</option>
                              <option data-countryCode="SB" value="+677">Solomon Islands (+677)</option>
                              <option data-countryCode="SO" value="+252">Somalia (+252)</option>
                              <option data-countryCode="ZA" value="+27">South Africa (+27)</option>
                              <option data-countryCode="ES" value="+34">Spain (+34)</option>
                              <option data-countryCode="LK" value="+94">Sri Lanka (+94)</option>
                              <option data-countryCode="SH" value="+290">St. Helena (+290)</option>
                              <option data-countryCode="KN" value="+1869">St. Kitts (+1869)</option>
                              <option data-countryCode="SC" value="+1758">St. Lucia (+1758)</option>
                              <option data-countryCode="SD" value="+249">Sudan (+249)</option>
                              <option data-countryCode="SR" value="+597">Suriname (+597)</option>
                              <option data-countryCode="SZ" value="+268">Swaziland (+268)</option>
                              <option data-countryCode="SE" value="+46">Sweden (+46)</option>
                              <option data-countryCode="CH" value="+41">Switzerland (+41)</option>
                              <option data-countryCode="SI" value="+963">Syria (+963)</option>
                              <option data-countryCode="TW" value="+886">Taiwan (+886)</option>
                              <option data-countryCode="TJ" value="+7">Tajikstan (+7)</option>
                              <option data-countryCode="TH" value="+66">Thailand (+66)</option>
                              <option data-countryCode="TG" value="+228">Togo (+228)</option>
                              <option data-countryCode="TO" value="+676">Tonga (+676)</option>
                              <option data-countryCode="TT" value="+1868">Trinidad &amp; Tobago (+1868)</option>
                              <option data-countryCode="TN" value="+216">Tunisia (+216)</option>
                              <option data-countryCode="TR" value="+90">Turkey (+90)</option>
                              <option data-countryCode="TM" value="+7">Turkmenistan (+7)</option>
                              <option data-countryCode="TM" value="+993">Turkmenistan (+993)</option>
                              <option data-countryCode="TC" value="+1649">Turks &amp; Caicos Islands (+1649)</option>
                              <option data-countryCode="TV" value="+688">Tuvalu (+688)</option>
                              <option data-countryCode="UG" value="+256">Uganda (+256)</option>
                              {/* <!-- <option data-countryCode="GB" value="+44">UK (+44)</option> --> */}
                              <option data-countryCode="UA" value="+380">Ukraine (+380)</option>
                              <option data-countryCode="AE" value="+971">United Arab Emirates (+971)</option>
                              <option data-countryCode="UY" value="+598">Uruguay (+598)</option>
                              {/* <!-- <option data-countryCode="US" value="+1">USA (+1)</option> --> */}
                              <option data-countryCode="UZ" value="+7">Uzbekistan (+7)</option>
                              <option data-countryCode="VU" value="+678">Vanuatu (+678)</option>
                              <option data-countryCode="VA" value="+379">Vatican City (+379)</option>
                              <option data-countryCode="VE" value="+58">Venezuela (+58)</option>
                              <option data-countryCode="VN" value="+84">Vietnam (+84)</option>
                              <option data-countryCode="VG" value="+84">Virgin Islands - British (+1284)</option>
                              <option data-countryCode="VI" value="+84">Virgin Islands - US (+1340)</option>
                              <option data-countryCode="WF" value="+681">Wallis &amp; Futuna (+681)</option>
                              <option data-countryCode="YE" value="+969">Yemen (North)(+969)</option>
                              <option data-countryCode="YE" value="+967">Yemen (South)(+967)</option>
                              <option data-countryCode="ZM" value="+260">Zambia (+260)</option>
                              <option data-countryCode="ZW" value="+263">Zimbabwe (+263)</option>
                            </optgroup>
                          </select>
                        </div>
                      
                        <FieldPhoneNumberInput
                          id={`${formId}.phoneNumber`}
                          name="phoneNumber"
                          placeholder="Phone number"
                          validate={required}
                          className={css.phoneInput}
                        />
                      </div>
                    </div>
                    
                    

                  </div>
                
                <div className={css.flex_center}>
                  {termsAndConditions}
                </div>
                <div className={css.bottomWrapper}>
                  
                  <PrimaryButton type="submit" inProgress={submitInProgress} disabled={submitDisabled}>
                    <FormattedMessage id="SignupForm.signUp" />
                  </PrimaryButton>
                </div>

                <div className={css.flex_row}>
                  <p>
                    Already have an account? <NamedLink name="LoginPage" className={css.login_here} style={{textDecoration:"underline"}}>Login here</NamedLink>
                  </p>
                </div>
              </Form>
            </div>
       
      );
    }}
  />
);

/**
 * A component that renders the signup form.
 *
 * @component
 * @param {Object} props
 * @param {string} props.rootClassName - The root class name that overrides the default class css.root
 * @param {string} props.className - The class that extends the root class
 * @param {string} props.formId - The form id
 * @param {boolean} props.inProgress - Whether the form is in progress
 * @param {ReactNode} props.termsAndConditions - The terms and conditions
 * @param {string} props.preselectedUserType - The preselected user type
 * @param {propTypes.userTypes} props.userTypes - The user types
 * @param {propTypes.listingFields} props.userFields - The user fields
 * @returns {JSX.Element}
 */
const SignupForm = props => {
  const intl = useIntl();
  return <SignupFormComponent {...props} intl={intl} />;
};

export default SignupForm;
