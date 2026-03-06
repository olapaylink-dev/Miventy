import React, { useState } from "react";
import css from './RemoveAccountDialogue.module.css';

const RemoveAccountDialogue = props=>{
    const {handleCloseNotificationUpdated,setShowRemoveAccount} = props;
    const [showPasswordUpdated, setShowPasswordUpdated] = useState(false);
    const handleClose = e=>{
        setShowRemoveAccount(false);
    }

    return (
       
                <div className={css.container_2}>
                    <h1 className={css.header}>{intl.formatMessage({ id: 'Dashboard.areYouSureAccount' })}</h1>
                    <p>
                        {intl.formatMessage({ id: 'Dashboard.youCanAlwaysEdit' })}
                    </p>
                    <div className={css.flex_row_btw}>
                        <button onClick={handleClose} className={css.cancel_btn}>{intl.formatMessage({ id: 'Dashboard.noCancel' })}</button>
                        <button onClick={handleClose} className={css.yes_btn}>{intl.formatMessage({ id: 'Dashboard.yesIWant' })}</button>
                    </div>
                    
                    
                </div>
    )
}

export default RemoveAccountDialogue;