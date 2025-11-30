import React, { useState } from "react";
import css from './CatalogItems.module.css';

const CatalogItems = props =>{
    const {cartData} = props;
    const {items=[]} = cartData;
    
    return (
            <div className={css.container}>
                {items !== undefined && items.map((itm,key)=>{
                    const {quantity,message,catalogImages,ItemPrice} = itm;
                    const {imgUrl} = catalogImages[0];
                    return (
                        <div className={css.items}>
                            <img  src={imgUrl} className={css.card_img}/>
                            <p>{message}</p>
                            <p>Quantity: {quantity}</p>
                            <p className={css.price}>€{ItemPrice}</p>
                        </div>
                    )
                })}
                
            </div>

    )
}
export default CatalogItems;