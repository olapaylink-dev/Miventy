import React, { useEffect, useState } from "react";
import css from './OfferDisplayView.module.css';
import itm_img from '../../assets/itm_img.jpg';
import classNames from "classnames";
import { FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import CartOptions_2 from "../../containers/ListingPage/CartOptions_2";
import CatalogItems from "../CatalogItems";


const REQUEST_QUOTE_TABS = [
  "service_type",
  "guest_count_and_duration",
  "location_and_time"
]

const OfferDisplayView = props =>{
    const {
        currentListing,
        setCurrentRequestQuoteTab,
        setShowOffer,
        showOffer,
        currentTransaction,
        handleCreateProposal,
        setShowQuotationForm,
        onCreateProposal,
        currentUser,
        isProvider,
        setShowQuoteAccepted,
        currentOfferInView,
        setTotal,
        onUpdateProfile,
        onDeclineOfferFromCustomer,
        setShowSuccessView,
        setSuccessMessage,
        declineOfferSuccess
    }=props;

    //console.log("Here ======")

    const{id,offerTitle,description,eventDate,duration,price} = JSON.parse(currentOfferInView);

    const {protectedData={}} = currentTransaction !== undefined && JSON.stringify(currentTransaction) !== "{}"?currentTransaction?.attributes:{};
    const {provider={},listing={}} = currentTransaction;
    const cartDat = protectedData?.cartData !== undefined?protectedData?.cartData:{};
    const declinedTrx = currentUser?.attributes?.profile?.protectedData?.declinedTransaction || [];
    const isOrderDeclined = declinedTrx.includes(id);
    const {cartData,eventLocation,guestCount,message,selectedServiceType,eventTime} = cartDat !== undefined?cartDat:{};
    const isOwn = provider?.id?.uuid === currentUser?.id?.uuid;
    const listingType = listing?.attributes?.publicData?.listingType;

    const platformFee = price * 0.3;
    const processingFee = 10;
    //const total = parseFloat(price) + processingFee + platformFee;
    const total = parseFloat(price);

    useEffect(()=>{
        setTotal(total);
    },[])

    //console.log("Here ===2222===")

    useEffect(()=>{
            if(declineOfferSuccess){
               // console.log("Offer declined  =====")
               if(showOffer){
                    setShowOffer(false);
                    setSuccessMessage("You have declined this order!");
                    setShowSuccessView(true);
               }
                
            }
        },[declineOfferSuccess])

const handleDeclineOffer = async e =>{
     const data = 
    {protectedData: {
          declinedTransaction:[...declinedTrx,id]
        }}
   await onUpdateProfile(data);
   onDeclineOfferFromCustomer();
}

    return (
            <div className={css.modal}>
                <div className={css.container_header}>
                    <h2>Proposal details</h2>
                    <svg onClick={e=>setShowOffer(false)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M7.05086 5.63616C6.66033 5.24563 6.02717 5.24563 5.63664 5.63616C5.24612 6.02668 5.24612 6.65984 5.63664 7.05037L10.5864 12.0001L5.63664 16.9499C5.24612 17.3404 5.24612 17.9736 5.63664 18.3641C6.02717 18.7546 6.66033 18.7546 7.05086 18.3641L12.0006 13.4143L16.9504 18.3641C17.3409 18.7546 17.974 18.7546 18.3646 18.3641C18.7551 17.9736 18.7551 17.3404 18.3646 16.9499L13.4148 12.0001L18.3646 7.05037C18.7551 6.65984 18.7551 6.02668 18.3646 5.63616C17.974 5.24563 17.3409 5.24563 16.9504 5.63616L12.0006 10.5859L7.05086 5.63616Z" fill="black"/>
                    </svg>
                </div>

                <h3 className={css.sub_header}>{listingType} Service</h3>
                
                
                <div className={css.container}>

                      <div className={css.flex_col}>
                        <div>
                            <h4 className={css.description}>Title</h4>
                            <p className={css.desc_text}>{offerTitle}</p>
                        </div>
                        <div>
                            <h4 className={css.description}>Description</h4>
                            <p className={css.desc_text}>{description}</p>
                        </div>
                        <div className={css.grid_con}>
                            <div>
                                <div className={css.flex_row_2}>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M6.66797 0.833008C7.12821 0.833008 7.5013 1.2061 7.5013 1.66634V2.49967H12.5013V1.66634C12.5013 1.2061 12.8744 0.833008 13.3346 0.833008C13.7949 0.833008 14.168 1.2061 14.168 1.66634V2.49967H15.0013C16.8423 2.49967 18.3346 3.99206 18.3346 5.83301V14.9997C18.3346 16.8406 16.8423 18.333 15.0013 18.333H5.0013C3.16035 18.333 1.66797 16.8406 1.66797 14.9997V5.83301C1.66797 3.99206 3.16035 2.49967 5.0013 2.49967H5.83464V1.66634C5.83464 1.2061 6.20773 0.833008 6.66797 0.833008ZM12.5013 4.16634C12.5013 4.62658 12.8744 4.99967 13.3346 4.99967C13.7949 4.99967 14.168 4.62658 14.168 4.16634H15.0013C15.9218 4.16634 16.668 4.91253 16.668 5.83301V6.24967H3.33464V5.83301C3.33464 4.91253 4.08083 4.16634 5.0013 4.16634H5.83464C5.83464 4.62658 6.20773 4.99967 6.66797 4.99967C7.12821 4.99967 7.5013 4.62658 7.5013 4.16634H12.5013ZM16.668 7.91634H3.33464V14.9997C3.33464 15.9201 4.08083 16.6663 5.0013 16.6663H15.0013C15.9218 16.6663 16.668 15.9201 16.668 14.9997V7.91634Z" fill="black"/>
                                    </svg>
                                    Date
                                </div>
                                <p>{eventDate}</p>
                            </div>
                            <div>
                                <div className={css.flex_row_2}>
                                   <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10.0013 7.08366C10.0013 6.62342 9.62821 6.25033 9.16797 6.25033C8.70773 6.25033 8.33464 6.62342 8.33464 7.08366V11.2503C8.33464 11.7106 8.70773 12.0837 9.16797 12.0837H11.668C12.1282 12.0837 12.5013 11.7106 12.5013 11.2503C12.5013 10.7901 12.1282 10.417 11.668 10.417H10.0013V7.08366Z" fill="black"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.0013 1.66699C5.39893 1.66699 1.66797 5.39795 1.66797 10.0003C1.66797 14.6027 5.39893 18.3337 10.0013 18.3337C14.6037 18.3337 18.3346 14.6027 18.3346 10.0003C18.3346 5.39795 14.6037 1.66699 10.0013 1.66699ZM3.33464 10.0003C3.33464 6.31843 6.3194 3.33366 10.0013 3.33366C13.6832 3.33366 16.668 6.31843 16.668 10.0003C16.668 13.6822 13.6832 16.667 10.0013 16.667C6.3194 16.667 3.33464 13.6822 3.33464 10.0003Z" fill="black"/>
                                    </svg>
                                    Time
                                </div>
                                <p>{duration}</p>
                            </div>
                             <div>
                                <div className={css.flex_row_2}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.0011 5.5C9.51585 5.5 7.50113 7.51472 7.50113 10C7.50113 12.4853 9.51585 14.5 12.0011 14.5C14.4864 14.5 16.5011 12.4853 16.5011 10C16.5011 7.51472 14.4864 5.5 12.0011 5.5ZM9.50113 10C9.50113 8.61929 10.6204 7.5 12.0011 7.5C13.3818 7.5 14.5011 8.61929 14.5011 10C14.5011 11.3807 13.3818 12.5 12.0011 12.5C10.6204 12.5 9.50113 11.3807 9.50113 10Z" fill="#475367"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M7.81037 3.59199C10.3481 1.90017 13.6542 1.90017 16.1919 3.59199C19.6228 5.87925 20.586 10.495 18.3562 13.9635L14.5247 19.9238C13.3438 21.7607 10.6585 21.7607 9.47759 19.9238L5.64603 13.9635C3.41626 10.495 4.37948 5.87925 7.81037 3.59199ZM8.91977 5.25609C10.7857 4.01214 13.2166 4.01214 15.0825 5.25609C17.6051 6.93785 18.3134 10.3317 16.6739 12.882L12.8423 18.8422C12.4487 19.4546 11.5536 19.4546 11.16 18.8422L7.32839 12.882C5.68889 10.3317 6.39712 6.93785 8.91977 5.25609Z" fill="#475367"></path></svg>
                                    Location
                                </div>
                                <p>{eventLocation !== undefined? eventLocation[0]?.result?.place_name:""}</p>
                            </div>
                          
                        </div>
                        <div className={css.flex_col_2}>
                            <div className={css.flex_row_btw}>
                                <span className={css.val}>Pricing details</span>
                                <span className={css.val}>Amount (€)</span>
                            </div>
                            <div className={css.flex_row_btw}>
                                <span className={css.label}>Service Fee (Fixed)</span>
                                <span className={css.val}>€{price}</span>
                            </div>
                            {/* <div className={css.flex_row_btw}>
                                <span className={css.label}>Platform Fee (30%)</span>
                                <span className={css.val}>€{platformFee}</span>
                            </div>
                            <div className={css.flex_row_btw}>
                                <span className={css.label}>Processing Fee</span>
                                <span className={css.val}>€{processingFee}</span>
                            </div> */}
                            <div className={css.flex_row_btw}>
                                <span className={css.label}>Total</span>
                                <span className={css.val}>€{total}</span>
                            </div>
                        </div>
                        <div>
                            <div className={css.flex_row_2}>
                                Status
                            </div>
                            <p>{"Pending"}</p>
                        </div>
                    </div>
                    
                    
                    {!isProvider && !isOwn?
                        <>
                        {isOrderDeclined?
                            <span className={css.declined_txt}>You have declined this Offer</span>
                        :
                            <div className={css.flex_row}>
                                <button className={css.btn_outline} onClick={handleDeclineOffer}>
                                    Decline
                                </button>
                                <button className={css.btn_fill} onClick={e=>{setShowQuoteAccepted(true); setShowOffer(false)}}>
                                    Accept
                                </button>
                            </div>
                        }
                        
                        </>
                        
                    :""}
                    
                    
                   
                </div>
            </div>

    )
}
export default OfferDisplayView;