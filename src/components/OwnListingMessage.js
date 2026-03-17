import { useState } from "react";
import css from './OwnListingMessage.module.css';
import classNames from "classnames";
import { FormattedMessage, useIntl } from '../util/reactIntl';

const OwnListingMessage = props=>{
  const intl = useIntl();
  const {setShowOwnListingMessage} = props;

  const handleClose = e=>{
    setShowOwnListingMessage(false);
  }

  return (
                <div className={css.modal_complete_profile_busi}>
                  <div className={classNames(css.flex_col)}>
                    <span className={css.completed_header}>Not Allowed</span>
                    <div className={css.mark_con}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="46" height="46" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                      </svg>
                    </div>
                     <p className={css.complete_content}>
                     You cannot book your own listing.
                    </p>
                    <button className={css.back_btn} onClick={handleClose}>{intl.formatMessage({id:'StripePayoutPage.close'})}</button>
                  </div>
                 
                </div>
                
  )
}

export default OwnListingMessage;