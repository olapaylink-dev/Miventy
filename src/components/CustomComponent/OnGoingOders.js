import React, { useEffect, useState } from "react";
import css from './OnGoingOders.module.css';
import itm_img from '../../assets/itm_img.jpg';
import classNames from "classnames";
import { FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import CartOptions_2 from "../../containers/ListingPage/CartOptions_2";
import CatalogItems from "../CatalogItems";
import NamedLink from "../NamedLink/NamedLink";

import { types as sdkTypes } from '../../util/sdkLoader';
const { Money } = sdkTypes;

const OnGoingOrders = props =>{
    const {
        orders=[]
    }=props;

    // const {protectedData={}} = currentTransaction !== undefined && JSON.stringify(currentTransaction) !== "{}"?currentTransaction?.attributes:{};
    // const {provider,listing} = currentTransaction;
    // const cartDat = protectedData?.cartData !== undefined?protectedData?.cartData:{};
    // const transactionState = itm?.attributes?.state;
    // const {cartData,duration,eventDate,eventLocation,guestCount,message,selectedServiceType,eventTime} = cartDat !== undefined?cartDat:{};
    // const {items=[]} = cartData  ||  {};
    // const {ItemPrice} = items[0] || {};
    // const isOwn = provider.id.uuid === currentUser.id.uuid;
    // const listingType = listing?.attributes?.publicData?.listingType;
    // const listingId = currentTransaction?.listing?.id?.uuid;
    // const slug = currentTransaction?.listing?.attributes?.title;
    // localStorage.setItem("Transaction",JSON.stringify(currentTransaction));

    // //Change the price of the listing
    // useEffect(()=>{
    //     //console.log("changing price eeeeee  ",ItemPrice)
    //     onChangeListingPrice(listingId, new Money(ItemPrice*100,"EUR"));
    //     //console.log("changing price")
    // },[])

    // useEffect(()=>{
    //     if(acceptOfferSuccess){
    //         //console.log("Offer accepted")
    //         //console.log(currentTransaction)
    //         setShowOrder(false);
    //         setSuccessMessage("You have accepted this order!");
    //         setShowSuccessView(true);
    //     }
    // },[acceptOfferSuccess])

    // useEffect(()=>{
    //     if(declineOfferSuccess){
    //         console.log("Offer declined  =====")
    //         setShowOrder(false);
    //         setSuccessMessage("You have declined this order!");
    //         setShowSuccessView(true);
    //     }
    // },[declineOfferSuccess])

    // const checkIfPaid = (trx)=>{
    //     let paid = false;
    //     trx.attributes.transitions.map((i,k)=>{
    //         if(i.transition === "transition/confirm-payment"){
    //             paid = true;
    //         }
    //     })
    //     return paid;
    // }

    // const isPaid = checkIfPaid(currentTransaction);

    return (
            <>
               {orders.length > 0? orders.map((itm,key)=>{
                console.log(itm,"     aaaaaaaaaaaaa");
                const {protectedData={}} = itm !== undefined && JSON.stringify(itm) !== "{}"?itm?.attributes:{};
                const payinTotal = itm?.attributes?.payinTotal?.amount;
                const lastTransitionedAt = itm?.attributes?.lastTransitionedAt;
               
                const date = lastTransitionedAt.toDateString();
                const total = payinTotal?payinTotal:0;
                const {provider,listing,customer} = itm;
                const {attributes} = customer;
                const {profile} = attributes;
                const {displayName,abbreviatedName} = profile;
                const cartDat = protectedData?.cartData !== undefined?protectedData?.cartData:{};
                const transactionState = itm?.attributes?.state;
                const {cartData,duration,eventDate,eventLocation,guestCount,message,selectedServiceType,eventTime} = cartDat !== undefined?cartDat:{};
                const {items=[]} = cartData  ||  {};
                const {ItemPrice} = items[0] || {};
                //const isOwn = provider.id.uuid === currentUser.id.uuid;
                const listingType = listing?.attributes?.publicData?.listingType;
                const listingId = itm?.listing?.id?.uuid;
                const slug = itm?.listing?.attributes?.title;
                console.log(transactionState,"  ssddffgg")
                return(
                     <div className={css.container}>
                        <div className={css.flex_col}>
                            <div className={css.flex_row_1}>
                                <div className={css.profile_txt}>{abbreviatedName}</div>
                                <div className={css.flex_col_2}>
                                    <h3 className={css.title}>{displayName}</h3>
                                    <div className={css.services}>{listingType}</div>
                                    {/* {transactionState === "reviewed"?
                                        <div className={classNames(css.badge,css.mobile)}>completed</div>
                                    :
                                        <div className={classNames(css.badge,css.badge_ongoing)}>Ongonig</div>
                                    } */}
                                </div>
                            </div>
                            
                        </div>
                        <div className={css.flex_row_1}>
                            {transactionState === "state/reviewed"?
                                <div className={classNames(css.badge)}>Completed</div>
                            :
                                <div className={classNames(css.badge_ongoing)}>Ongonig</div>
                            }
                            <div className={css.flex_col_2}>
                                <h3 className={css.title}>€{total.toFixed(2)}</h3>
                                <p>{date}</p>
                            </div>
                        </div>
                    </div>
                )

            }):
            <p>Nothing to show</p>
        }
    </>

    )
}
export default OnGoingOrders;