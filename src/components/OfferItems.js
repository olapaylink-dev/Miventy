import React, { useState } from "react";
import css from './CatalogItems.module.css';

const OfferItems = props =>{
    const {imgUrl,message,quantity,total} = props;
    
    return (
            <div className={css.container}>
                
                        <div className={css.items}>
                            <img  src={imgUrl} className={css.card_img}/>
                            <p>{message}</p>
                            <p>Quantity: {quantity}</p>
                            <p className={css.price}>€{total}</p>
                        </div>
                   
            </div>
    )
}
export default OfferItems;