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
                    <h1 className={css.header}>Are you sure you want to remove this account?</h1>
                    <p>
                        You can always edit your payment information or add a new account.
                    </p>
                    <div className={css.flex_row_btw}>
                        <button onClick={handleClose} className={css.cancel_btn}>No, Cancel</button>
                        <button onClick={handleClose} className={css.yes_btn}>Yes, I want to</button>
                    </div>
                    
                    
                </div>
    )
}

export default RemoveAccountDialogue;