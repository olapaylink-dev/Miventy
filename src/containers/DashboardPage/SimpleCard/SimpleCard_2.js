import React from "react";
import listing1 from '../../../assets/images/listing1.png';
import css from './SimpleCard_2.module.css';
const SimpleCard_2 = props=>{
    const {description,folder,image="",catalog={},handleShowSelectedCatalog} = props;

    const getItemCount = (catalog)=>{
       return (catalog.filter(itm=>itm.folder === folder)).length;
    }

    const getLeastPrice = (catalog)=>{
        let result = 0;
        catalog.map((itm,key)=>{
            if(itm.folder === folder){
                if(parseInt(result) < parseInt(itm.ItemPrice)){
                    result = parseInt(itm.ItemPrice);
                }
            }
        });
        return result;
    }

    //console.log("===================");

    const count = getItemCount(catalog);
    const price = getLeastPrice(catalog);
    
    return (
        <div className={css.container} onClick={e=>{handleShowSelectedCatalog(e,folder)}}>
            <div className={css.folder}>
                {folder}
            </div>
            <img className={css.resize} src={image} />
            <div className={css.flex_row}>
                <span className={css.card_title}>{count} items</span>
                <div className={css.per_item}><span className={css.price}>Starting from €{price}</span></div>
            </div>
            <p className={css.description}>{description}</p>
        </div>
    )
}
export default SimpleCard_2;