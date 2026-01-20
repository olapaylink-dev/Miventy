import React, { useState } from "react";
import css from './NotificationSettings.module.css';
import { Switch } from "@mui/material";

const NotificationSetting = props=>{
    const {setShowNotificationUpdated,saveNotificationSettings,currentUser}= props;
    const {enableEmailNotification,enablePushNotification} = currentUser?.attributes?.profile?.publicData || {};

    const [emailNotificationEnabled,setEmailNotificationEnabled] = useState(enableEmailNotification);
    const [pushNotificationEnabled,setPushNotificationEnabled] = useState(enablePushNotification);
    const handleSaveChanges = values =>{
        saveNotificationSettings(emailNotificationEnabled,pushNotificationEnabled)
        setShowNotificationUpdated(true);
    }
    //console.log("aaaaaaaaaa")
    const handleEnablePushNotification = e =>{
        //console.log(e.target.checked)
        setPushNotificationEnabled(e.target.checked);
    }
    return (
        <div className={css.main_con}>
            <div className={css.flex_col}>
                <h1 className={css.header}>
                    Manage your notifications
                </h1>
                <div className={css.flex_row}>

                    <h2 className={css.sub_header}>Email notifications</h2>

                    <Switch color="warning" 
                        onChange={e=>{setEmailNotificationEnabled(e.target.checked)}}
                        checked={enableEmailNotification}
                    />
                </div>
                 <div className={css.flex_row}>

                    <h2 className={css.sub_header}>Mobile push notifications</h2>
                    <Switch color="warning" 
                        onChange={e=>setPushNotificationEnabled(e.target.checked)} 
                        checked={enablePushNotification}
                    />
                </div>
                <div className={css.save_changes_con}>
                    <button onClick={handleSaveChanges} className={css.save_changes}>Save changes</button>
                </div>
                
            </div>
            
        </div>
    )
}

export default NotificationSetting;