import React, { useState } from "react";
import css from './CatalogItems.module.css';
import { useIntl, FormattedMessage } from '../util/reactIntl';

const CatalogItems = props =>{
    const intl = useIntl();
    const {cartData} = props;
    const {items=[]} = cartData;
    
    return (
            <div className={css.container}>
                {items !== undefined && items.map((itm,key)=>{
                    const {quantity,message,catalogImages,ItemPrice,total} = itm;
                    const {imgUrl} = catalogImages[0];
                    return (
                        <div className={css.items}>
                            <img  src={imgUrl} className={css.card_img}/>
                            <p>{message}</p>
                            <p>{intl.formatMessage({ id: `OrderDisplayView.quantity` })}: {quantity}</p>
                            <p className={css.price}>€{total}</p>
                        </div>
                    )
                })}
                
            </div>

    )
}
export default CatalogItems;