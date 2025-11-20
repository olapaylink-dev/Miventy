import React from "react";
import listing1 from '../../../assets/images/listing1.png';
import css from './SimpleCard.module.css';
const SimpleCard = props=>{
    const {catalogDetails,handleEditCatalog,ownEntities} = props;
    const {description,ItemPrice,itemName,images,catalogImages} = catalogDetails;
    const firstImageId = images !== undefined && images.length > 0 && images[0] !== undefined?images[0]:"";

    let firstImageUrl = "";
    if(catalogImages !== undefined && catalogImages.length > 0){
        firstImageUrl = catalogImages[0]?.imgUrl;
    }
    
    return (
        <div className={css.container} onClick={e=>{handleEditCatalog(catalogDetails)}}>
            <img className={css.resize} src={firstImageUrl} />
            <div className={css.flex_row}>
                <span className={css.card_title}>{itemName}</span>
                <div className={css.per_item}><span className={css.price}>€{ItemPrice} per item</span></div>
            </div>
            <p className={css.description}>{description}</p>
        </div>
    )
}

export default SimpleCard;