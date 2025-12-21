import React from "react";
import css from './Settings.module.css';
import PasswordResetFormDashboard from "../PasswordResetPage/PasswordResetForm/PasswordResetFormDashboard";

const Settings = props=>{
    const {setShowVerifyCodeSettings}= props;
    const handleSubmit = values =>{
        console.log(values,"    99999999999999999999999999999999");
        setShowVerifyCodeSettings(true);
    }
    return (
        <div className={css.main_con}>
            <PasswordResetFormDashboard onSubmit={handleSubmit} />
            <div className={css.flex_col}>
                <h1 className={css.header}>
                    Verifications
                </h1>
                <div className={css.flex_row}>
                    <div>
                        <h2 className={css.sub_header}>Phone verification</h2>
                        <p className={css.detail}>
                            Your phone is verified with Miventy. Click Edit to change your phone number
                        </p>
                    </div>
                    <button className={css.edit_btn}>Edit</button>
                </div>
                 <div className={css.flex_row}>
                    <div>
                        <h2 className={css.sub_header}>Security question</h2>
                        <p className={css.detail}>
                            By creating a security question, you will add an additional layer of protection for your revenue withdrawals and for changing your password.
                        </p>
                    </div>
                    <button className={css.edit_btn}>Edit</button>
                </div>
            </div>
            
        </div>
    )
}

export default Settings;