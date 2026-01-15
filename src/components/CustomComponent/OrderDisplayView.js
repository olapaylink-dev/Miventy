import React, { useEffect, useState } from "react";
import css from './OrderDisplayView.module.css';
import itm_img from '../../assets/itm_img.jpg';
import classNames from "classnames";
import { FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import CartOptions_2 from "../../containers/ListingPage/CartOptions_2";
import CatalogItems from "../CatalogItems";
import NamedLink from "../NamedLink/NamedLink";

import { types as sdkTypes } from '../../util/sdkLoader';
const { Money } = sdkTypes;


const REQUEST_QUOTE_TABS = [
  "service_type",
  "guest_count_and_duration",
  "location_and_time"
]

const OrderDisplayView = props =>{
    const {
        currentListing,
        setCurrentRequestQuoteTab,
        setShowOrder,
        showOrder={showOrder},
        currentTransaction,
        handleCreateProposal,
        setShowQuotationForm,
        onCreateProposal,
        currentUser,
        isProvider,
        onAcceptOfferFromCustomer,
        onDeclineOfferFromCustomer,
        acceptOfferInProgress,
        acceptOfferError,
        acceptOfferSuccess,
        declineOfferInProgress,
        declineOfferError,
        declineOfferSuccess,
        setShowQuoteAccepted,
        onChangeListingPrice,
        setShowSuccessView,
        setSuccessMessage
    }=props;

    const {protectedData={}} = currentTransaction !== undefined && JSON.stringify(currentTransaction) !== "{}"?currentTransaction?.attributes:{};
    const {provider,listing} = currentTransaction;
    const cartDat = protectedData?.cartData !== undefined?protectedData?.cartData:{};
    const transactionState = currentTransaction?.attributes?.state;
    const {cartData,duration,eventDate,eventLocation,guestCount,message,selectedServiceType,eventTime} = cartDat !== undefined?cartDat:{};
    const {items=[]} = cartData  ||  {};
    const {ItemPrice,durationPrice} = items[0] || {};
    const perHourPrice = durationPrice[0]?.price;
    const isOwn = provider.id.uuid === currentUser.id.uuid;
    const listingType = listing?.attributes?.publicData?.listingType;
    const listingId = currentTransaction?.listing?.id?.uuid;
    const slug = currentTransaction?.listing?.attributes?.title;
    const priceToChangeTo = perHourPrice || ItemPrice;
    localStorage.setItem("Transaction",JSON.stringify(currentTransaction));
    console.log("eventLocation  =======PPPPPPPPPPPPP==========",eventLocation);


    //Change the price of the listing
    useEffect(()=>{
        console.log("changing price eeeeee  ",priceToChangeTo);
        onChangeListingPrice(listingId, new Money(priceToChangeTo*100,"EUR"));
        //console.log("changing price")
    },[])

    useEffect(()=>{
        if(acceptOfferSuccess){
            //console.log("Offer accepted")
            //console.log(currentTransaction)
            if(showOrder){
                setShowOrder(false);
                setSuccessMessage("You have accepted this order!");
                setShowSuccessView(true);
            }
           
        }
    },[acceptOfferSuccess])

    useEffect(()=>{
        if(declineOfferSuccess){
           // console.log("Offer declined  =====")
           if(showOrder){
                setShowOrder(false);
                setSuccessMessage("You have declined this order!");
                setShowSuccessView(true);
           }
            
        }
    },[declineOfferSuccess])

    const handleBack = e =>{
        setCurrentRequestQuoteTab(REQUEST_QUOTE_TABS[0]);
    }

    const checkIfPaid = (trx)=>{
        let paid = false;
        trx.attributes.transitions.map((i,k)=>{
            if(i.transition === "transition/confirm-payment"){
                paid = true;
            }
        })
        return paid;
    }

    const isPaid = checkIfPaid(currentTransaction);

    return (
            <div className={css.modal}>
                <div className={css.container_header}>
                    <h2>Order details</h2>
                    <svg onClick={e=>setShowOrder(false)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M7.05086 5.63616C6.66033 5.24563 6.02717 5.24563 5.63664 5.63616C5.24612 6.02668 5.24612 6.65984 5.63664 7.05037L10.5864 12.0001L5.63664 16.9499C5.24612 17.3404 5.24612 17.9736 5.63664 18.3641C6.02717 18.7546 6.66033 18.7546 7.05086 18.3641L12.0006 13.4143L16.9504 18.3641C17.3409 18.7546 17.974 18.7546 18.3646 18.3641C18.7551 17.9736 18.7551 17.3404 18.3646 16.9499L13.4148 12.0001L18.3646 7.05037C18.7551 6.65984 18.7551 6.02668 18.3646 5.63616C17.974 5.24563 17.3409 5.24563 16.9504 5.63616L12.0006 10.5859L7.05086 5.63616Z" fill="black"/>
                    </svg>
                </div>

                <h3 className={css.sub_header}>{listingType} service</h3>
                
                <div className={css.container}>
                    
                        <>
                            <div className={css.flex_col}> 
                                
                                <h3 className={css.sub_header_2}>Catalog order</h3>
                                {cartData !== undefined && cartData.hasOwnProperty("items") && cartData.items.length > 0?
                                    <CatalogItems cartData={cartData}/>
                                :""}
                                
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
                                        <p>{eventLocation[0]?.result?.place_name}</p>
                                    </div>
                                    <div>
                                        <div className={css.flex_row_2}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0002 5C9.79108 5 8.00022 6.79086 8.00022 9C8.00022 11.2091 9.79108 13 12.0002 13C14.2094 13 16.0002 11.2091 16.0002 9C16.0002 6.79086 14.2094 5 12.0002 5ZM10.0002 9C10.0002 7.89543 10.8957 7 12.0002 7C13.1048 7 14.0002 7.89543 14.0002 9C14.0002 10.1046 13.1048 11 12.0002 11C10.8957 11 10.0002 10.1046 10.0002 9Z" fill="black"/>
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0002 22C10.8633 22 9.22409 21.7313 7.98006 21.1596C7.36982 20.8792 6.71504 20.4632 6.32882 19.8409C6.12493 19.5124 5.99611 19.1251 6.00032 18.6941C6.0045 18.2672 6.13838 17.8623 6.35761 17.4913C7.36008 15.7947 9.43977 14 12.0002 14C14.5607 14 16.6404 15.7947 17.6428 17.4913C17.8621 17.8623 17.9959 18.2672 18.0001 18.6941C18.0043 19.1251 17.8755 19.5124 17.6716 19.8409C17.2854 20.4632 16.6306 20.8792 16.0204 21.1596C14.7763 21.7313 13.1371 22 12.0002 22ZM8.07948 18.5087C8.00289 18.6383 8.00033 18.7027 8.00023 18.7136C8.00014 18.7209 7.99989 18.7407 8.02814 18.7862C8.10753 18.9142 8.33812 19.1231 8.8152 19.3423C9.74582 19.77 11.0891 20 12.0002 20C12.9114 20 14.2546 19.77 15.1852 19.3423C15.6623 19.1231 15.8929 18.9142 15.9723 18.7862C16.0005 18.7407 16.0003 18.7214 16.0002 18.7141C16.0001 18.7032 15.9976 18.6383 15.921 18.5087C15.1438 17.1934 13.6237 16 12.0002 16C10.3767 16 8.85669 17.1934 8.07948 18.5087Z" fill="black"/>
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M2.50022 12C2.50022 10.3431 3.84337 9 5.50022 9C7.15708 9 8.50022 10.3431 8.50022 12C8.50022 13.6569 7.15708 15 5.50022 15C3.84337 15 2.50022 13.6569 2.50022 12ZM5.50022 11C4.94794 11 4.50022 11.4477 4.50022 12C4.50022 12.5523 4.94794 13 5.50022 13C6.05251 13 6.50022 12.5523 6.50022 12C6.50022 11.4477 6.05251 11 5.50022 11Z" fill="black"/>
                                                <path d="M2.89595 19.4446C2.65041 19.9393 2.05033 20.1413 1.55563 19.8957C1.06093 19.6502 0.858947 19.0501 1.10449 18.5554C1.47187 17.8152 2.02795 17.0721 2.72747 16.5034C3.42726 15.9346 4.32399 15.5 5.34739 15.5C5.89968 15.5 6.34739 15.9477 6.34739 16.5C6.34739 17.0523 5.89968 17.5 5.34739 17.5C4.90641 17.5 4.441 17.688 3.98902 18.0554C3.53678 18.423 3.15146 18.9298 2.89595 19.4446Z" fill="black"/>
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M15.8103 12C15.8103 10.3431 17.1534 9 18.8103 9C20.4671 9 21.8103 10.3431 21.8103 12C21.8103 13.6569 20.4671 15 18.8103 15C17.1534 15 15.8103 13.6569 15.8103 12ZM18.8103 11C18.258 11 17.8103 11.4477 17.8103 12C17.8103 12.5523 18.258 13 18.8103 13C19.3626 13 19.8103 12.5523 19.8103 12C19.8103 11.4477 19.3626 11 18.8103 11Z" fill="black"/>
                                                <path d="M22.9004 18.5554C23.1459 19.0501 22.9439 19.6502 22.4492 19.8957C21.9545 20.1413 21.3544 19.9393 21.1089 19.4446C20.8534 18.9298 20.4681 18.423 20.0158 18.0554C19.5638 17.688 19.0984 17.5 18.6574 17.5C18.1052 17.5 17.6574 17.0523 17.6574 16.5C17.6574 15.9477 18.1052 15.5 18.6574 15.5C19.6809 15.5 20.5776 15.9346 21.2774 16.5034C21.9769 17.0721 22.533 17.8152 22.9004 18.5554Z" fill="black"/>
                                            </svg>

                                            Guests
                                        </div>
                                        <p>{guestCount}</p>
                                    </div>
                                </div>
                                <div>
                                    <div className={css.flex_row_2}>
                                        Menu type
                                    </div>
                                    <p>{selectedServiceType}</p>
                                </div>
                            </div>
                            
                            {isProvider && isOwn?
                                <>
                                    {cartData !== undefined && cartData.hasOwnProperty("items") && cartData.items.length > 0?
                                    (
                                        transactionState === "state/accepted" || transactionState === "state/accept"?
                                            "You have accepted this offer"
                                        :transactionState === "state/declined" || transactionState === "state/decline"?
                                            <span className={css.declined_txt}>You have declined this order</span>
                                        :
                                        <div className={css.flex_row}>
                                            <button className={css.btn_outline} onClick={e=>onDeclineOfferFromCustomer(currentTransaction.id.uuid,currentTransaction.providerId.id.uuid,currentTransaction.customer.id.uuid)}>
                                                Decline
                                            </button>
                                            <button className={css.btn_fill} onClick={e=>{onAcceptOfferFromCustomer(currentTransaction.id);}}>
                                                Accept
                                            </button>
                                        </div>
                                    )
                                        
                                        :
                                        <div className={css.flex_row}>
                                            <button className={css.btn_outline} onClick={e=>{onDeclineOfferFromCustomer(currentTransaction.id.uuid,currentTransaction.providerId.id.uuid,currentTransaction.customer.id.uuid)}}>
                                                Decline
                                            </button>
                                            <button className={css.btn_fill} onClick={e=>{setShowQuotationForm(true); setShowOrder(false)}}>
                                                Create a quote
                                            </button>
                                        </div>
                                    }
                                </>
                                
                            :
                                (
                                    isPaid?
                                        <div className={css.flex_row}>
                                            Payment Completed
                                        </div>
                                    :transactionState === "state/accepted" || transactionState === "state/accept"?
                                    <div className={css.flex_row}>
                                        <NamedLink className={css.btn_fill} onClick={e=>{setShowQuoteAccepted(false)}} name="CheckoutPage" params={{id:listingId,slug:slug}}>
                                            Proceed to payment
                                        </NamedLink>
                                    </div>
                                    :
                                    <p>Waiting for Provider to accept your Order, before you can proceed to payment.</p>
                                )
                            
                            }
                        </>
                        
                       
                    
                    
                    
                   
                </div>
            </div>

    )
}
export default OrderDisplayView;