import React, { useState } from "react";
import css from './Settings.module.css';
import PasswordResetFormDashboard from '../PasswordResetPage/PasswordResetForm/PasswordResetFormDashboard';
import PasswordChangePage from "../PasswordChangePage/PasswordChangePage";

const Settings = props=>{
    const {setShowVerifyCodeSettings}= props;

    const [showSecretForm,setShowSecretForm] = useState(false);
    const [showPhoneNumberForm,setShowPhoneNumberForm] = useState(false);

    const handleSubmit = values =>{
        setShowVerifyCodeSettings(true);
    }

    const handleSubmitPhone = (e)=>{
        e.preventDefault();
        e.stopPropagation();
        setShowPhoneNumberForm(false);
        console.log("Submiting---------")
    }

    const handleSubmitSecret = (e)=>{
        e.preventDefault();
        e.stopPropagation();
        console.log("Submiting")
        setShowSecretForm(false);
    }

    
    return (
        <div className={css.main_con}>
            <PasswordChangePage/>
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
                    {!showPhoneNumberForm?
                        <button className={css.edit_btn} onClick={e=>setShowPhoneNumberForm(true)} >Edit</button>
                    :""}
                    
                </div>
                {showPhoneNumberForm?
                    <form className={css.form} onSubmit={handleSubmitPhone}>
                        <div>
                            <label>Phone number</label>
                            <input type="text" placeholder="Enter your new phone number" />
                        </div>
                        <div>
                           
                            <button className={css.edit_btn} type="submit" >Save</button>
                            
                        </div>
                    </form>
                :""}
                
                 <div className={css.flex_row}>
                    <div>
                        <h2 className={css.sub_header}>Security question</h2>
                        <p className={css.detail}>
                            By creating a security question, you will add an additional layer of protection for your revenue withdrawals and for changing your password.
                        </p>
                    </div>
                    {!showSecretForm?
                            <button className={css.edit_btn} onClick={e=>setShowSecretForm(true)}>Edit</button>
                    :""}
                   
                </div>
                {showSecretForm?
                    <form className={css.form} onSubmit={handleSubmitSecret}>
                        <div>
                            <label>Set your security question</label>
                            <select>
                                <option>What is your favorite color?</option>
                                <option>What is your favorite food?</option>
                                <option>What is your dream vacation destination?</option>
                                <option>What is your favorite hobby?</option>
                                <option>What is your favorite book?</option>
                                <option>What is your favorite movie?</option>
                            </select>
                        </div>
                        <div>
                            <label>Set your security question</label>
                            <input type="text" placeholder="Enter your new phone number" />
                        </div>
                        <div>
                             
                            <button className={css.edit_btn} type="submit" >Save</button>
                        
                        </div>
                    </form>
                :""}
                 
            </div>
            
        </div>
    )
}

export default Settings;