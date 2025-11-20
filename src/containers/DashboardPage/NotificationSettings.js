import React from "react";
import css from './NotificationSettings.module.css';
import { Switch } from "@mui/material";

const NotificationSetting = props=>{
    const {setShowNotificationUpdated}= props;
    const handleSaveChanges = values =>{
        setShowNotificationUpdated(true);
    }
    return (
        <div className={css.main_con}>
            <div className={css.flex_col}>
                <h1 className={css.header}>
                    Manage your notifications
                </h1>
                <div className={css.flex_row}>
                    <h2 className={css.sub_header}>Email notifications</h2>
                    <Switch color="warning"/>
                </div>
                 <div className={css.flex_row}>
                    <h2 className={css.sub_header}>Mobile push notifications</h2>
                    <Switch color="warning"/>
                </div>
                <div className={css.save_changes_con}>
                    <button onClick={handleSaveChanges} className={css.save_changes}>Save changes</button>
                </div>
                
            </div>
            
        </div>
    )
}

export default NotificationSetting;