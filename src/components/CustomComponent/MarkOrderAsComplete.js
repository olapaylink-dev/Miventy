import React, { useState } from "react";
import css from './MarkOrderAsComplete.module.css';
import itm_img from '../../assets/itm_img.jpg';
import classNames from "classnames";
import { FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import CartOptions_2 from "../../containers/ListingPage/CartOptions_2";
import CatalogItems from "../CatalogItems";
import NamedLink from "../NamedLink/NamedLink";
import { WithProfileImageAndBioCurrentUser } from "../../containers/ListingPage/UserCard/UserCard.example";


const MarkOrderAsComplete = props =>{
    const {
        setShowMarkOrder,
        isProvider=false,
        isOwn=false,
        setShowCompleteOrder,
        transaction,
        onHandleOrderDelivered,
        onHandleOrderReceived
    }=props;

    console.log(transaction)
    
    return (
            <div className={css.modal}>
                <div className={css.container_header}>
                    <h2>Mark Order as Completed.</h2>
                    <svg onClick={e=>setShowMarkOrder(false)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M7.05086 5.63616C6.66033 5.24563 6.02717 5.24563 5.63664 5.63616C5.24612 6.02668 5.24612 6.65984 5.63664 7.05037L10.5864 12.0001L5.63664 16.9499C5.24612 17.3404 5.24612 17.9736 5.63664 18.3641C6.02717 18.7546 6.66033 18.7546 7.05086 18.3641L12.0006 13.4143L16.9504 18.3641C17.3409 18.7546 17.974 18.7546 18.3646 18.3641C18.7551 17.9736 18.7551 17.3404 18.3646 16.9499L13.4148 12.0001L18.3646 7.05037C18.7551 6.65984 18.7551 6.02668 18.3646 5.63616C17.974 5.24563 17.3409 5.24563 16.9504 5.63616L12.0006 10.5859L7.05086 5.63616Z" fill="black"/>
                    </svg>
                </div>

                <p className={css.sub_header}>
                    Are you happy with the service you received?
                </p>
                <p>
                Marking this order as completed will release your payment to the service provider and allow you to leave a review.
                </p>
                
                <div className={css.container}>
                    
                    {!isProvider && !isOwn?
                        <div className={css.flex_row}>
                            <button className={css.btn_outline} onClick={e=>setShowMarkOrder(false)}>
                                Cancel
                            </button>
                            <button className={css.btn_fill} onClick={e=>{setShowCompleteOrder(true); setShowMarkOrder(false); onHandleOrderReceived(transaction.id)}}>
                                Yes, Complete Order
                            </button>
                        </div>
                    :""}
                    
                </div>
            </div>

    )
}
export default MarkOrderAsComplete;