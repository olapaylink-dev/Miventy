import React, { useState } from "react";
import css from './CatalogItems.module.css';
import { useIntl, FormattedMessage } from '../util/reactIntl';

const OfferItems = props =>{
    const intl = useIntl();
    const {imgUrl,message,quantity,total} = props;
    
    return (
            <div className={css.container}>
                
                        <div className={css.items}>
                            <img  src={imgUrl} className={css.card_img}/>
                            <p>{message}</p>
                            <p>{intl.formatMessage({ id: `OrderDisplayView.quantity` })}: {quantity}</p>
                            <p className={css.price}>€{total}</p>
                        </div>
                   
            </div>
    )
}
export default OfferItems;