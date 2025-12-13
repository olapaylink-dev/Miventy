import React, { useEffect, useState } from "react";
import css from './QuoteAcceptedView.module.css';
import itm_img from '../../assets/itm_img.jpg';
import classNames from "classnames";
import { FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import CartOptions_2 from "../../containers/ListingPage/CartOptions_2";
import CatalogItems from "../CatalogItems";
import NamedLink from "../NamedLink/NamedLink";
import { WithProfileImageAndBioCurrentUser } from "../../containers/ListingPage/UserCard/UserCard.example";

import { types as sdkTypes } from '../../util/sdkLoader';
const { Money } = sdkTypes;


const REQUEST_QUOTE_TABS = [
  "service_type",
  "guest_count_and_duration",
  "location_and_time"
]


const QuoteAcceptedView = props =>{
    const {
        setCurrentRequestQuoteTab,
        setShowQuoteAccepted,
        currentTransaction,
        handleCreateProposal,
        setShowQuotationForm,
        onCreateProposal,
        currentUser,
        isProvider,
        history,
        currentOfferInView,
        onChangeListingPrice,
        total
    }=props;

    
    const {protectedData={}} = currentTransaction !== undefined && JSON.stringify(currentTransaction) !== "{}"?currentTransaction?.attributes:{};
    const {provider={}} = currentTransaction;
    const cartDat = protectedData?.cartData !== undefined?protectedData?.cartData:{};
    const {cartData,duration,eventDate,eventLocation,guestCount,message,selectedServiceType,eventTime} = cartDat !== undefined?cartDat:{};
    const isOwn = provider?.id?.uuid === currentUser?.id?.uuid;
    const listingId = currentTransaction?.listing?.id?.uuid;
    const slug = currentTransaction?.listing?.attributes?.title;
    let trxToBeSaved = currentTransaction;
    //console.log("oooooooooooooooooooooooooooooooo")
    trxToBeSaved.attributes.protectedData.offer = JSON.parse(currentOfferInView);
    localStorage.setItem("Transaction",JSON.stringify(trxToBeSaved));
    
    const handleBack = e =>{
        setCurrentRequestQuoteTab(REQUEST_QUOTE_TABS[0]);
    }

    useEffect(()=>{
        console.log(total,"    aaaaaaaaaaaaaaaaaaaaaaaaaa");
        onChangeListingPrice(listingId, new Money(total*100,"EUR"));
        
    },[])

    return (
            <div className={css.modal}>
                <div className={css.container_header}>
                    <h2>Quote accepted, ready to secure your booking.</h2>
                    {/* <svg onClick={e=>setShowOffer(false)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M7.05086 5.63616C6.66033 5.24563 6.02717 5.24563 5.63664 5.63616C5.24612 6.02668 5.24612 6.65984 5.63664 7.05037L10.5864 12.0001L5.63664 16.9499C5.24612 17.3404 5.24612 17.9736 5.63664 18.3641C6.02717 18.7546 6.66033 18.7546 7.05086 18.3641L12.0006 13.4143L16.9504 18.3641C17.3409 18.7546 17.974 18.7546 18.3646 18.3641C18.7551 17.9736 18.7551 17.3404 18.3646 16.9499L13.4148 12.0001L18.3646 7.05037C18.7551 6.65984 18.7551 6.02668 18.3646 5.63616C17.974 5.24563 17.3409 5.24563 16.9504 5.63616L12.0006 10.5859L7.05086 5.63616Z" fill="black"/>
                    </svg> */}
                </div>

                <p className={css.sub_header}>
                    You’ve accepted the service provider’s quote. To confirm your booking, please proceed to make payment. Your payment will be held securely in escrow and released only when the service is successfully completed.
                </p>
            
                
                <div className={css.container}>
                    
                    {!isProvider && !isOwn?
                        <div className={css.flex_row}>
                            <button className={css.btn_outline} onClick={e=>setShowQuoteAccepted(false)}>
                                Cancel
                            </button>
                            <NamedLink className={css.btn_fill} onClick={e=>{setShowQuoteAccepted(false)}} name="CheckoutPage" params={{id:listingId,slug:slug}}>
                                Continue to payment
                            </NamedLink>
                        </div>
                    :""}
                    
                    
                   
                </div>
            </div>

    )
}
export default QuoteAcceptedView;