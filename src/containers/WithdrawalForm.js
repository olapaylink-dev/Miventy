import React, { useState } from "react";
import css from './WithdrawalForm.module.css';
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import CurrencyInput from "react-currency-input-field";

const WithdrawalForm = props =>{
    const {handleCloseListing,
        setShowWithdrawalForm,
        onStripeInstantPayout,
        stripeAccountId,
        instantPayoutInProgress,
    } = props;
    const amountAvailable = props.amount;

    const [amount,setAmount] = useState(0);

    const handleWithdraw = e =>{
        console.log("Sending")
        const val = parseInt(amount) * 100;
        onStripeInstantPayout(
            {
                sid:stripeAccountId,
                amount:val
            }
        );
        setShowWithdrawalForm(false);

    }

    return (

        <div className={css.container} onClick={e=>{e.preventDefault();e.stopPropagation()}}>
            <div className={css.tb_con}>
                <div className={css.flex_col}>
                    <h1 className={css.header}>Withdrawal Form</h1>
                    <div>
                        <p className={css.description}>Account balance available for withdrawal.</p>
                        <CurrencyInput
                            className="mt-2"
                            id="amountAvailable"
                            name="amountAvailable"
                            defaultValue={amountAvailable}
                            decimalsLimit={2}
                            prefix="€"
                            disabled
                        />
                    </div>
                    
                    <div>
                        <p className={css.description}>Please fill the form below correctly to issue a withdrawal.</p>
                        {/* <input onChange={e=>setAmount(e.target.value)} type="number" placeholder="Please enter amount to withdraw" className="mt-2" /> */}
                        <CurrencyInput
                            id="amount"
                            name="amount"
                            placeholder="Please enter amount to withdraw"
                            defaultValue={0}
                            decimalsLimit={2}
                            onValueChange={(value, name, values) => setAmount(value)}
                            prefix="€"
                        />
                    </div>
                    
                    <div className={css.btn_con}>
                         <button onClick={handleWithdraw} className={css.normal_btn}>Withdraw</button>
                    </div>
                </div>
            </div>
        </div>
          
    )
}

export default WithdrawalForm;