import React, { useState } from "react";
import css from './NotificationSettings.module.css';
import { Switch } from "@mui/material";
import { FormattedMessage, useIntl } from '../../util/reactIntl';

const NotificationSetting = props=>{
    const intl = useIntl();
    const {setShowNotificationUpdated,saveNotificationSettings,currentUser,setshowSideNav}= props;
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
            <div className={css.open_con} onClick={e=>setshowSideNav(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M3 4H21" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M3 12H12" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M3 20H12" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <div className={css.flex_col}>
                <h1 className={css.header}>
                     {intl.formatMessage({ id: 'Dashboard.manageYour' })}
                </h1>
                <div className={css.flex_row}>

                    <h2 className={css.sub_header}>{intl.formatMessage({ id: 'Dashboard.emailNoti' })}</h2>

                    <Switch color="warning" 
                        onChange={e=>{setEmailNotificationEnabled(e.target.checked)}}
                        checked={enableEmailNotification}
                    />
                </div>
                 <div className={css.flex_row}>

                    <h2 className={css.sub_header}>{intl.formatMessage({ id: 'Dashboard.mobilePush' })}</h2>
                    <Switch color="warning" 
                        onChange={e=>setPushNotificationEnabled(e.target.checked)} 
                        checked={enablePushNotification}
                    />
                </div>
                <div className={css.save_changes_con}>
                    <button onClick={handleSaveChanges} className={css.save_changes}>{intl.formatMessage({ id: 'Dashboard.saveChanges' })}</button>
                </div>
                
            </div>
            
        </div>
    )
}

export default NotificationSetting;