import React, { useState } from "react";
import css from './CreateQuoteForm.module.css';
import MyDatePicker from "../MyDatePicker";
import { v4 as uuidv4 } from 'uuid';
import { FormattedMessage, useIntl } from '../../util/reactIntl';

const CreateQuoteForm = props =>{
    const intl = useIntl();
    const {
        forceUpdate,
        onUpdateProfile,
        currentUser,
        cartData,
        setCartData,
        listingType,
        setShowConfirmOrderForm,
        onSendOrderMessage,
        currentListing,
        setShowSuccessView,
        setSuccessMessage,
        setShowSuccessBadge,
        setShowQuotationForm,
        showQuotationForm,
        onCreateProposal,
        currentTransaction,
        onSendMessage,
        showDatePicker,
        setShowDatePicker
    }=props;

    const [offerTitle, setOfferTitle] = useState("");
    const [description, setDescription] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [duration, setDuration] = useState("");
    const [price, setPrice] = useState("");

const handleSendOrderMessage = ()=>{
    //{/* Create a new transaction and add order details to it, them send the order message to provider */}
    //console.log("   ==========================")
    const offer = {
        id: uuidv4(),
        offerTitle,
        description,
        eventDate,
        duration,
        price
    }

    //console.log(offer,"   ============1111111111111111111==============")
    
    //onCreateProposal(currentTransaction.id.uuid,offer);
    onSendMessage(currentTransaction,JSON.stringify(offer),"Title",currentUser.id.uuid)
    // setShowConfirmOrderForm(false);
    // setSuccessMessage("Your message was sent successfully!");
    // setShowSuccessView(true);
    // setShowSuccessBadge(true);
    setShowQuotationForm(false);
}

const getListingCart = (cartData)=>{
    //console.log("==========++++++=============")
    let res = [];
    cartData !== undefined && cartData.length > 0 && cartData.map((itm,key)=>{
        const listingId = currentListing?.id?.uuid;
        if(itm.id === listingId){
            res = itm.items;
        }
    });
    return res;
}

const handleDateChange = value=>{
    const date = new Date(value).toLocaleDateString();
    const dateArr = date.split("/");
    const year = dateArr[2];
    const month = dateArr[0];
    const day = dateArr[1];
    setEventDate(`${year}-${month}-${day}`);//YYYY-MM-DD
  }

const listingCart = getListingCart(cartData);

    return (
            <div className={css.modal} onClick={e=>setShowDatePicker(false)}>
                <div className={css.container_header}>
                    <h3 className={css.header}>Create quote</h3>
                    <svg onClick={e=>setShowQuotationForm(false)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M7.05086 5.63616C6.66033 5.24563 6.02717 5.24563 5.63664 5.63616C5.24612 6.02668 5.24612 6.65984 5.63664 7.05037L10.5864 12.0001L5.63664 16.9499C5.24612 17.3404 5.24612 17.9736 5.63664 18.3641C6.02717 18.7546 6.66033 18.7546 7.05086 18.3641L12.0006 13.4143L16.9504 18.3641C17.3409 18.7546 17.974 18.7546 18.3646 18.3641C18.7551 17.9736 18.7551 17.3404 18.3646 16.9499L13.4148 12.0001L18.3646 7.05037C18.7551 6.65984 18.7551 6.02668 18.3646 5.63616C17.974 5.24563 17.3409 5.24563 16.9504 5.63616L12.0006 10.5859L7.05086 5.63616Z" fill="black"/>
                    </svg>
                </div>
                <p className={css.desc}>Craft a personalized proposal based on your conversation with the client.</p>
                <div className={css.container}>

                    <div className={css.form_input}>
                        <label className={css.labels}>Offer title</label>
                        <input className={css.calendar} value={offerTitle} type='text' name='offerTitle' placeholder="Eg. wedding event photographer" onChange={
                            event=>{
                                setOfferTitle(event.target.value);
                            }
                        }/>
                    </div>
                    
                    <div className={css.form_input}>
                        <label className={css.labels}>Description</label>
                        <textarea className={css.calendar} value={description} type='text' name='description' onChange={
                            event=>{
                                setDescription(event.target.value);
                            }
                        }/>
                    </div>
                    
                    <div className={css.form_input}>
                        <label className={css.labels}>Price</label>
                        <div className={css.flex_input}>
                            <svg width="13" height="15" viewBox="0 0 13 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.49197 0C5.67518 0 3.35965 2.20263 3.2043 5H0.833333C0.373096 5 0 5.3731 0 5.83333C0 6.29357 0.373096 6.66667 0.833333 6.66667H3.15064L3.11157 7.91667H0.833333C0.373096 7.91667 0 8.28976 0 8.75C0 9.21024 0.373096 9.58333 0.833333 9.58333H3.05949L2.99764 11.5625C2.93886 13.4434 4.4476 15 6.32935 15H12.0833C12.5436 15 12.9167 14.6269 12.9167 14.1667C12.9167 13.7064 12.5436 13.3333 12.0833 13.3333H6.32935C5.38847 13.3333 4.6341 12.555 4.66349 11.6146L4.72697 9.58333H8.33333C8.79357 9.58333 9.16667 9.21024 9.16667 8.75C9.16667 8.28976 8.79357 7.91667 8.33333 7.91667H4.77905L4.81812 6.66667H8.33333C8.79357 6.66667 9.16667 6.29357 9.16667 5.83333C9.16667 5.3731 8.79357 5 8.33333 5H4.87473C5.02649 3.12746 6.59302 1.66667 8.49197 1.66667H9.38661C10.213 1.66667 10.9684 2.13355 11.338 2.87268C11.5438 3.28433 12.0444 3.45118 12.456 3.24536C12.8677 3.03953 13.0345 2.53897 12.8287 2.12732C12.1768 0.823558 10.8443 0 9.38661 0H8.49197Z" fill="#667185"/>
                            </svg>

                            <input value={price} type='text' name='ptice' placeholder="0.00" onChange={
                                event=>{
                                    setPrice(event.target.value);
                                }
                            }/>
                        </div>
                        
                    </div>

                    <div className={css.flex_row_btw}>
                         <div className={css.form_input}>
                            <label className={css.labels}>Duration</label>
                            <div className={css.flex_input}>
                                <input value={duration} type='text' name='duration' placeholder="1 hour" onChange={
                                    event=>{
                                        setDuration(event.target.value);
                                    }
                                }/>
                            </div>
                        </div>
                        <div className={css.form_input}>
                            <label className={css.labels}>Event date</label>
                            <div className={css.flex_input}>
                                <MyDatePicker currentDate={eventDate} onChange={handleDateChange} showDatePicker={showDatePicker} setShowDatePicker={setShowDatePicker}/>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button className={css.btn_fill} onClick={handleSendOrderMessage}>
                            {intl.formatMessage({id:'CreateQuoteForm.sendQuote'})}
                        </button>
                    </div>
                    
                   
                </div>
            </div>

    )
}
export default CreateQuoteForm;