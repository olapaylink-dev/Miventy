import React, { useEffect } from 'react';

import { FormattedMessage } from '../../util/reactIntl';

import { Heading, NamedLink, IconEmailSent, InlineTextButton, IconClose } from '../../components';

import css from './AuthenticationPage.module.css';
import classNames from 'classnames';

const EmailVerificationInfo = props => {
  const {
    name,
    email,
    onResendVerificationEmail,
    resendErrorMessage,
    sendVerificationEmailInProgress,
    history
  } = props;

  const resendEmailLink = (
    <InlineTextButton rootClassName={css.modalHelperLink} onClick={onResendVerificationEmail}>
      <FormattedMessage id="AuthenticationPage.resendEmailLinkText" />
    </InlineTextButton>
  );

  const fixEmailLink = (
    <NamedLink className={css.modalHelperLink} name="ContactDetailsPage">
      <FormattedMessage id="AuthenticationPage.fixEmailLinkText" />
    </NamedLink>
  );

  useEffect(()=>{
    history.push("/account/payments");
  },[])

  return (
    ""
    // <div className={classNames(css.content,css.verify_con)}>
    //   <NamedLink className={css.verifyClose} name="StripePayoutPage">
    //     <span className={css.closeText}>
    //       <FormattedMessage id="AuthenticationPage.verifyEmailClose" />
    //     </span>
    //     <IconClose rootClassName={css.closeIcon} />
    //   </NamedLink>
    //   <IconEmailSent className={css.modalIcon} />
    //   <Heading as="h1" rootClassName={css.modalTitle} className={css.header_title}>
    //     <FormattedMessage id="AuthenticationPage.verifyEmailTitle" values={{ name }} />
    //   </Heading>
    //   <p className={classNames(css.modalMessage,css.header_msg)}>
    //     <FormattedMessage id="AuthenticationPage.verifyEmailText" values={{ email }} />
    //   </p>
    //   {resendErrorMessage}

    //   <div className={css.bottomWrapper}>
    //     <p className={css.modalHelperText}>
    //       {sendVerificationEmailInProgress ? (
    //         <FormattedMessage id="AuthenticationPage.sendingEmail" />
    //       ) : (
    //         <FormattedMessage id="AuthenticationPage.resendEmail" values={{ resendEmailLink }} />
    //       )}
    //     </p>
    //     <p className={css.modalHelperText}>
    //       <FormattedMessage id="AuthenticationPage.fixEmail" values={{ fixEmailLink }} />
    //     </p>
    //   </div>
    // </div>
  );
};

export default EmailVerificationInfo;
