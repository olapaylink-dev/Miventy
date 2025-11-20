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
                    <h1 className={css.header}>Notification updated</h1>
                    <p>
                        Notification preferences updated successfully. Remember, you can always adjust these settings again later
                    </p>
                    <button onClick={handleCloseNotificationUpdated} className={css.done_btn}>Done</button>
                    
                </div>
    )
}

export default NotificationUpdate;