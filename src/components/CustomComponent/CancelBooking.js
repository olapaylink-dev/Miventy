import React, { useState } from "react";
import css from './CancelBooking.module.css';
import itm_img from '../../assets/itm_img.jpg';
import classNames from "classnames";
import { FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import CartOptions_2 from "../../containers/ListingPage/CartOptions_2";
import CatalogItems from "../CatalogItems";
import NamedLink from "../NamedLink/NamedLink";
import { WithProfileImageAndBioCurrentUser } from "../../containers/ListingPage/UserCard/UserCard.example";


const CancelBooking = props =>{
    const {
       setShowCancelBooking,
       isProvider=false,
       isOwn=false,
    }=props;

    const [currOption,setCurrOption] = useState("");
    const [selectedSortOption,setSelectedSortOption] = useState("");
    const [show,setShow] = useState(false);

    const reason = [
        "Provider is not responding",
        "Provider is unavailable on the event date",
        "I found another provider",
        "Change in event plans",
        "Others"
    ]
    
    const handleChange = (e,val)=>{
        e.preventDefault();
        e.stopPropagation();
        setCurrOption(val);
        setShow(false);
        
        setSelectedPrice(val);

    }

    return (
            <div className={css.modal}>
                <div className={css.container_header}>
                    <h2>Cancel booking.</h2>
                    <svg onClick={e=>setShowCancelBooking(false)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M7.05086 5.63616C6.66033 5.24563 6.02717 5.24563 5.63664 5.63616C5.24612 6.02668 5.24612 6.65984 5.63664 7.05037L10.5864 12.0001L5.63664 16.9499C5.24612 17.3404 5.24612 17.9736 5.63664 18.3641C6.02717 18.7546 6.66033 18.7546 7.05086 18.3641L12.0006 13.4143L16.9504 18.3641C17.3409 18.7546 17.974 18.7546 18.3646 18.3641C18.7551 17.9736 18.7551 17.3404 18.3646 16.9499L13.4148 12.0001L18.3646 7.05037C18.7551 6.65984 18.7551 6.02668 18.3646 5.63616C17.974 5.24563 17.3409 5.24563 16.9504 5.63616L12.0006 10.5859L7.05086 5.63616Z" fill="black"/>
                    </svg>
                </div>

                <p>
                    Are you sure you want to cancel this booking?
                    Your payment is currently held securely in escrow and will be refunded according to our cancellation policy.
                </p>
                <p>
                    To help us improve our service and support providers, please let us know why you're cancelling this order.
                </p>

                 <FormControl className={css.full_w}>
                    <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue={selectedSortOption}
                        name="radio-buttons-group"
                        value={currOption}
                    >

                        {reason.map((option,key)=>{

                        return(
                            <FormControlLabel key={`radio ${option} ${key}`} className={css.no_spacing} onClick={e=>handleChange(e,option)} value={option} control={
                            <Radio
                                sx={{
                                    color: "#D0D5DD",
                                    '&.Mui-checked': {
                                    color: "#F56630",
                                    },
                                }}
                            className={classNames(css.no_spacing,css.radio)}/>} label={option} />
                            )

                        })}
                    </RadioGroup>
                </FormControl>

                <div className={css.hint}>
                    Eg. wedding event photographer
                </div>
                    
                <div className={css.note_con}>
                    <h6>Note:</h6>
                    <p>
                        If the provider has not yet started the service or incurred any costs, you’ll receive a full refund. Refunds may take 3–7 business days to process depending on your payment method.
                    </p>
                    <p>
                        If there is a dispute regarding the cancellation, our support team will reach out to both parties.
                    </p>
                </div>
                
                
                <div className={css.container}>
                    
                    {!isProvider && !isOwn?
                        <div className={css.flex_row}>
                            <button className={css.btn_outline} onClick={e=>setShowCancelBooking(false)}>
                                Keep booking
                            </button>
                            <button className={css.btn_fill} onClick={e=>{setShowQuoteAccepted(false)}} >
                                Cancel booking
                            </button>
                        </div>
                    :""}
                    
                    
                   
                </div>
            </div>

    )
}
export default CancelBooking;