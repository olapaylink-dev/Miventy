import React, { useState } from "react";
import css from './NotificationUpdate.module.css';

const NotificationUpdate = props=>{
    const {handleCloseNotificationUpdated} = props;
    const [showPasswordUpdated, setShowPasswordUpdated] = useState(false);
    const handleVerify = e=>{
        setShowPasswordUpdated(true);
    }

    return (
       
                <div className={css.container_2}>
                    <h1 className={css.header}>{intl.formatMessage({ id: 'Dashboard.notiUpdate' })}</h1>
                    <p>
                        {intl.formatMessage({ id: 'Dashboard.notificationPref' })}
                    </p>
                    <button onClick={handleCloseNotificationUpdated} className={css.done_btn}>{intl.formatMessage({ id: 'Dashboard.done' })}</button>
                    
                </div>
    )
}

export default NotificationUpdate;