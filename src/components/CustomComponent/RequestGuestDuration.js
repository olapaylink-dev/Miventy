import React, { useState } from "react";
import css from './RequestGuestDuration.module.css';
import itm_img from '../../assets/itm_img.jpg';
import classNames from "classnames";
import { FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import CartOptions_2 from "../../containers/ListingPage/CartOptions_2";


const REQUEST_QUOTE_TABS = [
  "service_type",
  "guest_count_and_duration",
  "location_and_time"
]

const RequestGuestDuration = props =>{

    const {
        forceUpdate,
        onUpdateProfile,
        currentUser,
        cartData,
        setCartData,
        setRequestQuoteView,
        onSendOrderMessage,
        currentListing,
        setShowSuccessView,
        setSuccessMessage,
        setShowSuccessBadge,
        setShowRequestGuestDurationView,
        setCurrentRequestQuoteTab,
        setDuration,
        setGuestCount
    }=props;
    const {publicData} = currentListing.attributes;
    const {listingType} = publicData;
   
    console.log(currentListing);

    const handleChange = e =>{
    }

    const guestCount = [
        "Less than 10",
        "20 - 30",
        "30 - 40",
        "40 - 50",
        "More than 100"
    ];

    const duration = [
        "Up to 1 hour",
        "Up to 2 hour",
        "Up to 3 hour",
        "Up to 4 hour",
        "5 hours or more"
    ];

const handleSaveMessage = ()=>{
    // //{/* Create a new transaction and add order details to it, them send the order message to provider */}
    // const orderData = {
    //     cartData,
    //     message,
    //     eventDate,
    //     location
    // }
    // onSendOrderMessage(currentListing,orderData);
    // setRequestQuoteView(false);
    // setSuccessMessage("Your message was sent successfully!");
    // setShowSuccessView(true);
    // setShowSuccessBadge(true);
    setCurrentRequestQuoteTab(REQUEST_QUOTE_TABS[2]);
}

const handleBack = e =>{
    setCurrentRequestQuoteTab(REQUEST_QUOTE_TABS[0]);
}

    return (
            <div className={css.modal}>
                <div className={css.container_header}>
                    <svg onClick={e=>setShowRequestGuestDurationView(false)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M7.05086 5.63616C6.66033 5.24563 6.02717 5.24563 5.63664 5.63616C5.24612 6.02668 5.24612 6.65984 5.63664 7.05037L10.5864 12.0001L5.63664 16.9499C5.24612 17.3404 5.24612 17.9736 5.63664 18.3641C6.02717 18.7546 6.66033 18.7546 7.05086 18.3641L12.0006 13.4143L16.9504 18.3641C17.3409 18.7546 17.974 18.7546 18.3646 18.3641C18.7551 17.9736 18.7551 17.3404 18.3646 16.9499L13.4148 12.0001L18.3646 7.05037C18.7551 6.65984 18.7551 6.02668 18.3646 5.63616C17.974 5.24563 17.3409 5.24563 16.9504 5.63616L12.0006 10.5859L7.05086 5.63616Z" fill="black"/>
                    </svg>
                </div>
                
                <div className={css.container}>
                    <h2 className={css.form_header}>How many guests are you expecting?</h2>
                    <div className={css.flex_row_btw}>
                        <div>
                            {guestCount !== undefined && guestCount.length > 0?
                                <div className={css.full_w}>
                                    <FormControl>
                                        <RadioGroup
                                            aria-labelledby="demo-radio-buttons-group-label"
                                            name="radio-buttons-group"
                                            onChange={e=>setGuestCount(e.target.value)}
                                        >

                                        {guestCount.map((category,key)=>{
                                            return(
                                            <FormControlLabel key={`radio ${category} ${key}`} className={css.no_spacing} value={category} control={
                                                <Radio
                                                sx={{
                                                    color: "#F56630",
                                                    '&.Mui-checked': {
                                                        color: "#F56630",
                                                    },
                                                    }}
                                                className={classNames(css.no_spacing,css.radio)}/>} 
                                                label={
                                                    <div className={css.flex_col}>
                                                        <span className={css.label_txt}>{category}</span> 
                                                       
                                                    </div>
                                                    
                                                } />
                                            )

                                        })}
                                        </RadioGroup>
                                    </FormControl>
                                </div>
                            :""}
                            
                        </div>
                        {listingType === "catering"?
                            <div className={css.price}>
                                    <span>€217</span>
                                    <span>€217</span>
                                    <span>€217</span>
                            </div>
                        :""}
                        
                    </div>
                    <h2 className={css.form_header}>How long is the service required</h2>
                     <div className={css.flex_row_btw}>
                        <div>
                            {duration !== undefined && duration.length > 0?
                                <div className={css.full_w}>
                                    <FormControl>
                                        <RadioGroup
                                            aria-labelledby="demo-radio-buttons-group-label"
                                            name="radio-buttons-group"
                                            onChange={e=>setDuration(e.target.value)}
                                        >

                                        {duration.map((category,key)=>{
                                            
                                            return(
                                            <FormControlLabel key={`radio ${category} ${key}`} className={css.no_spacing} value={category} control={
                                                <Radio
                                                sx={{
                                                    color: "#F56630",
                                                    '&.Mui-checked': {
                                                        color: "#F56630",
                                                    },
                                                    }}
                                                className={classNames(css.no_spacing,css.radio)}/>} 
                                                label={
                                                    <div className={css.flex_col}>
                                                        <span className={css.label_txt}>{category}</span> 
                                                        
                                                    </div>
                                                    
                                                } />
                                            )

                                        })}
                                        </RadioGroup>
                                    </FormControl>
                                </div>
                            :""}
                            
                        </div>
                    </div>

                    
                    <div className={css.flex_row}>
                        <button className={css.btn_outline} onClick={handleBack}>
                            Previous
                        </button>
                        <button className={css.btn_fill} onClick={handleSaveMessage}>
                            Continue
                        </button>
                    </div>
                    
                   
                </div>
            </div>

    )
}
export default RequestGuestDuration;