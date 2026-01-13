import React, { useEffect, useState } from "react";
import css from './VerificationCodeForm.module.css';
import CountDown from "../../components/CustomComponent/CountDown";
import OTPInput from "react-otp-input";
import PasswordResetForm from "../AuthenticationPage/LoginForm/PasswordResetForm";
import { NamedLink } from "../../components";

const VerificationCodeForm = props=>{
    const {handleClosePasswordUpdated,phoneNumber,onResetPassword,email,token,onSubmitEmail} = props;
    const [showPasswordUpdated, setShowPasswordUpdated] = useState(false);
    const [showEmailConfirmedDialog, setShowEmailConfirmedDialog] = useState(false);
    const [showPasswordResetForm, setShowPasswordResetForm] = useState(false);
    const [reveal,setReveal] = useState(false);
    const [password,setPassword] = useState("");

    const [value1, setValue1] = useState(0);
    const [value2, setValue2] = useState(0);
    const [value3, setValue3] = useState(0);
    const [value4, setValue4] = useState(0);
    const [value5, setValue5] = useState(0);
    const [value6, setValue6] = useState(0);
    const [otp, setOtp] = useState('');
    


    const handleVerify = e=>{
        const savedOtp = localStorage.getItem("otp");
        if(savedOtp === otp){
            console.log("  Otp is correct ooooo  ",otp)
            onSubmitEmail(email);
        }
        console.log(savedOtp,"uuuuuuuooooooooooo")
        setShowEmailConfirmedDialog(true);
    }

    const handleValue1 = e =>{
        let val = parseInt(e.target.value);
        
        if(parseInt(val) > 9){
            val = val % 10;
        }

        setValue1(val);
        
    }

    const onOtpChange = val=>{
        setOtp(val);
    }

    const submitLoginData = data =>{
        console.log(email , " vvvvvvvvv ",password)
        onResetPassword(email,password,token);
    }

    return (
        <>
            {showPasswordResetForm?
                    <PasswordResetForm
                        onSubmit={submitLoginData}
                        reveal={reveal}
                        setReveal={setReveal}
                        setPassword={setPassword}
                    />
                :showEmailConfirmedDialog?
                <div className={css.container_2}>
                    <div className={css.flex_row_btw}>
                        <div className={css.flex_row}>
                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22Z" stroke="#0F9F1D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M9 12L11 14L15 10" stroke="#0F9F1D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <span>Email Verified Successfully</span>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M7.05086 5.63664C6.66033 5.24612 6.02717 5.24612 5.63664 5.63664C5.24612 6.02717 5.24612 6.66033 5.63664 7.05086L10.5864 12.0006L5.63664 16.9504C5.24612 17.3409 5.24612 17.974 5.63664 18.3646C6.02717 18.7551 6.66033 18.7551 7.05086 18.3646L12.0006 13.4148L16.9504 18.3646C17.3409 18.7551 17.974 18.7551 18.3646 18.3646C18.7551 17.974 18.7551 17.3409 18.3646 16.9504L13.4148 12.0006L18.3646 7.05086C18.7551 6.66033 18.7551 6.02717 18.3646 5.63664C17.974 5.24612 17.3409 5.24612 16.9504 5.63664L12.0006 10.5864L7.05086 5.63664Z" fill="black"/>
                        </svg>
                    </div>
                    <div>
                        <h1 className={css.header}>Verification Successful</h1>
                        
                        <p className={css.txt_center}>
                            Your verification was successful, you can now proceed to reset your password
                        </p>
                    </div>
                    <button onClick={e=>{setShowPasswordResetForm(true)}} className={css.verify_btn}>Reset password</button>
                    
                </div>
                
                :
                showPasswordUpdated?
                <div className={css.container_2}>
                    <div className={css.flex_row_btw}>
                        <div className={css.flex_row}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22Z" stroke="#0F9F1D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M9 12L11 14L15 10" stroke="#0F9F1D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <span>Password Updated Successfully!</span>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M7.05086 5.63664C6.66033 5.24612 6.02717 5.24612 5.63664 5.63664C5.24612 6.02717 5.24612 6.66033 5.63664 7.05086L10.5864 12.0006L5.63664 16.9504C5.24612 17.3409 5.24612 17.974 5.63664 18.3646C6.02717 18.7551 6.66033 18.7551 7.05086 18.3646L12.0006 13.4148L16.9504 18.3646C17.3409 18.7551 17.974 18.7551 18.3646 18.3646C18.7551 17.974 18.7551 17.3409 18.3646 16.9504L13.4148 12.0006L18.3646 7.05086C18.7551 6.66033 18.7551 6.02717 18.3646 5.63664C17.974 5.24612 17.3409 5.24612 16.9504 5.63664L12.0006 10.5864L7.05086 5.63664Z" fill="black"/>
                        </svg>
                    </div>
                    <div>
                        <h1 className={css.header}>PASSWORD UPDATED</h1>
                        <svg xmlns="http://www.w3.org/2000/svg" width="121" height="120" viewBox="0 0 121 120" fill="none">
                            <path fillRule="evenodd" clip-rule="evenodd" d="M0.5 60C0.5 44.087 6.82141 28.8258 18.0736 17.5736C29.3258 6.32141 44.587 0 60.5 0C76.413 0 91.6742 6.32141 102.926 17.5736C114.179 28.8258 120.5 44.087 120.5 60C120.5 75.913 114.179 91.1742 102.926 102.426C91.6742 113.679 76.413 120 60.5 120C44.587 120 29.3258 113.679 18.0736 102.426C6.82141 91.1742 0.5 75.913 0.5 60ZM57.076 85.68L91.62 42.496L85.38 37.504L55.924 74.312L35.06 56.928L29.94 63.072L57.076 85.68Z" fill="#6DC347"/>
                        </svg>
                        <p className={css.txt_center}>
                            Your password has been updated
                        </p>
                    </div>
                    <button onClick={handleClosePasswordUpdated} className={css.close_btn}>Close</button>
                    
                </div>
                
                :
                
                <div className={css.container}>
                    <div>
                        <h1 className={css.header}>Verification code</h1>
                        <p>
                            Confirm the OTP sent to {phoneNumber} and enter the verification code that was sent. Code expires in <CountDown/>
                        </p>
                    </div>
                    
                    <div className={css.flex_col}>
                        <OTPInput
                            value={otp}
                            onChange={onOtpChange}
                            numInputs={6}
                            renderSeparator={<span>-</span>}
                            renderInput={(props) => <input {...props} />}
                            inputStyle={{color:"black",width:"100%"}}
                        />
                        <button onClick={handleVerify} className={css.verify_btn}>Verify</button>
                        <p className={css.txt_center}>
                            Didnt receive any code? Resend
                        </p>
                    </div>
                    
                </div>
            }
           
            
        </>
       
    )
}

export default VerificationCodeForm;