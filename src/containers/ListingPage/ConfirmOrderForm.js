import React, { useState } from "react";
import css from './ConfirmOrderForm.module.css';
import itm_img from '../../assets/itm_img.jpg';
import CartOptions_2 from "./CartOptions_2";
import classNames from "classnames";
import { FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import MyDatePicker from "../../components/MyDatePicker";

const ConfirmOrderForm = props =>{

    const {
        cartData,
        listingType,
        setShowConfirmOrderForm,
        onSendOrderMessage,
        currentListing,
        setShowSuccessView,
        setSuccessMessage,
        setShowSuccessBadge,
        showDatePicker,
        setShowDatePicker
    }=props;

    const [eventDate, setEventDate] = useState("");
    const [location, setLocation] = useState("");
    const [message, setMessage] = useState("");

    const handleChange = e =>{
    }

    const categories = {
                        "Entertainers":
                                    [
                                    "0-2 years",
                                    "2-4 years",
                                    "4-6 years",
                                    "6-8 years",
                                    "All ages",
                                    ]
                        ,
                         "Catering":
                                    [
                                        "Basic:",
                                        "Medium:",
                                        "Pro:"
                                    ]
                        ,
                        "BD Cake and Sweets":
                                    [
                                    "Single-Tier Cake (One level only)",
                                    "Multi-Tier Cake (Two or more stacked layers)",
                                    "Themed cakes (custom shapes: cars, animals, handbags, letters, numbers)",
                                    "Piñata Cake (Surprise Inside)",
                                    "Lactose-free cakes",
                                    "Gluten-free cakes",
                                    "Sugar-free cakes",
                                    ]
                        ,
                        "Photos Or Videos":
                                    [
                                    "Photo booth",
                                    "Portrait photography",
                                    "Wedding photography",
                                    "Event photography  (birthdays, corporate events, etc.)",
                                    "Commercial photography (advertising, branding)",
                                    "Product photography (for online stores)",
                                    "Family photography",
                                    "Newborn and child photography",
                                    "Fashion photography",
                                    "Studio photography",
                                    "Outdoor photography",
                                    "Real estate photography",
                                    "Model portfolio photography"
                                    ]
                        ,
                        "Music For Events":
                                    [
                                     "Vocalist",
                                    "Instrumental",
                                    "Both of them"
                                    ]
                        ,
                         "Decorations":
                                    [
                                    "Flower decoration",
                                    "Balloon decoration",
                                    "Themed decoration"
                                    ]
                        ,
                        "Rentals":
                                    [
                                    "Rental shade and rain equipment",
                                    "Rental space",
                                    "Rental bouncer"
                                    ]
                        ,
                    };

console.log("==========++++++=============")
const getListingCart = (cartData)=>{
    
    let res = [];
    cartData !== undefined && cartData.length > 0 && cartData.map((itm,key)=>{
        const listingId = currentListing?.id?.uuid;
        if(itm.id === listingId){
            res = itm.items;
        }
    });
    return res;
}
const listingCart = getListingCart(cartData);

const handleSendOrderMessage = ()=>{
    //{/* Create a new transaction and add order details to it, them send the order message to provider */}
    console.log("==========++++++=============")
    const orderData = {
        cartData,
        message,
        eventDate,
        location
    }
    onSendOrderMessage(currentListing,orderData);
    setShowConfirmOrderForm(false);
    setSuccessMessage("Your message was sent successfully!");
    setShowSuccessView(true);
    setShowSuccessBadge(true);
}

const handleDateChange = value=>{
    const date = new Date(value).toLocaleDateString();
    const dateArr = date.split("/");
    const year = dateArr[2];
    const month = dateArr[0];
    const day = dateArr[1];
    setEventDate(`${year}-${month}-${day}`);//YYYY-MM-DD
  }

    return (
            <div className={css.modal}>
                <div className={css.container_header}>
                    <h3 className={css.header}>Confirm Order</h3>
                    <svg onClick={e=>setShowConfirmOrderForm(false)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M7.05086 5.63616C6.66033 5.24563 6.02717 5.24563 5.63664 5.63616C5.24612 6.02668 5.24612 6.65984 5.63664 7.05037L10.5864 12.0001L5.63664 16.9499C5.24612 17.3404 5.24612 17.9736 5.63664 18.3641C6.02717 18.7546 6.66033 18.7546 7.05086 18.3641L12.0006 13.4143L16.9504 18.3641C17.3409 18.7546 17.974 18.7546 18.3646 18.3641C18.7551 17.9736 18.7551 17.3404 18.3646 16.9499L13.4148 12.0001L18.3646 7.05037C18.7551 6.65984 18.7551 6.02668 18.3646 5.63616C17.974 5.24563 17.3409 5.24563 16.9504 5.63616L12.0006 10.5859L7.05086 5.63616Z" fill="black"/>
                    </svg>
                </div>
                <div className={css.container}>
                    <div className={css.container_item}>
                         <CartOptions_2 cartData={listingCart}/>
                    </div>
                    <div className={css.flex_row_btw}>
                        <div>
                            {listingType?
                                <div className={css.full_w}>
                                    <FormControl>
                                        <RadioGroup

                                        aria-labelledby="demo-radio-buttons-group-label"
                                        defaultValue={listingType}
                                        name="radio-buttons-group"
                                        onChange={handleChange}
                                        >

                                        {categories[listingType].map((category,key)=>{

                                            if(listingType !== "Catering"){
                                                return "";
                                            }

                                            return(
                                            <FormControlLabel key={`radio ${category} ${key}`} className={css.no_spacing} value={category} control={
                                                <Radio
                                                sx={{
                                                    color: "#F56630",
                                                    '&.Mui-checked': {
                                                        color: "#F56630",
                                                    },
                                                    }}
                                                className={classNames(css.no_spacing,css.radio)}/>} label={category} />
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

                    <div className={css.form_input}>
                        <label className={css.labels}>Event date</label>
                        
                        <MyDatePicker currentDate={eventDate} onChange={handleDateChange} showDatePicker={showDatePicker} setShowDatePicker={setShowDatePicker}/>
                    </div>
                    
                    <div className={css.form_input}>
                        <label className={css.labels}>Location</label>
                        <input className={css.calendar} value={location} type='text' name='location' placeholder="Select event location" onChange={
                            event=>{
                                setLocation(event.target.value);
                            }
                        }/>
                    </div>

                     <div className={css.form_input}>
                        <label className={css.labels}>Add notes and requests</label>
                        <textarea className={css.calendar} value={message} type='text' name='message' placeholder="e.g. Filling of your choice:raspberry,cherry. Sponge cake of your choice:vanilla, crema}" onChange={
                            event=>{
                                setMessage(event.target.value);
                            }
                        }/>
                        <p>Include special request to be added to your order. </p>
                    </div>
                    <div>
                        <button className={css.btn_fill} onClick={handleSendOrderMessage}>
                            Send your order
                        </button>
                    </div>
                    
                   
                </div>
            </div>

    )
}
export default ConfirmOrderForm;