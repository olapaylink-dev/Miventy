import React from "react";
import placeholder from '../../../assets/placeholder.png';
import css from './SimpleItemCard.module.css';
import { FormattedMessage, useIntl } from '../../../util/reactIntl';

const SimpleItemCard = props=>{
    const intl = useIntl();
    const {catalogDetails,handleEditCatalog,handleDeletePriceDuration,handleDeleteCatalogItem} = props;
    const {itemName,ItemPrice,description,durationPrice=[],catalogImages=[]} = catalogDetails;

    const imgUrl = catalogImages.length > 0 && catalogImages[0]?.imgUrl !== undefined?catalogImages[0]?.imgUrl:"";
    const isDurationPrice = durationPrice !== undefined && durationPrice.length > 0 && durationPrice[0].price != 0;
    let price = 0;
    let format = "";
    let duration = "";
    if(isDurationPrice){
        price = durationPrice[0].price;
        format = durationPrice[0].format;
        duration = durationPrice[0].duration;
    }else{
        price = ItemPrice;
    }
    console.log(catalogDetails,"    ------------------------dddddddffffff")
    return (
        <div className={css.container} onClick={e=>{handleEditCatalog(catalogDetails)}}>
            {imgUrl === undefined || imgUrl === null || imgUrl === ""?
                <img className={css.resize} src={placeholder} />
            :
                <img className={css.resize} src={imgUrl} />
            }
            
            <div className={css.flex_row}>
                <span className={css.card_title}>{itemName}</span>
                
            </div>
            <div className={css.flex_row}>
                <p>{description}</p>
            </div>
            <div className={css.flex_row}>
                <span className={css.price}>€{ItemPrice} - {duration} {format}</span><div className={css.view_all}>{intl.formatMessage({ id: 'Catalog.viewAll' })}</div>
            </div>

            {durationPrice !== undefined && durationPrice.length > 0 && durationPrice[0].price !== undefined && durationPrice[0].price !== undefined && durationPrice.map((itm,key)=>{
                
                const {duration,price,format} = itm;
                
                return (
                    <div className={css.duration_price}>
                        <span className={css.price_range}>{duration} {format} - €{price} </span>
                        <div className={css.flex_row_btw}>
                            <button className={css.edit_btn}>Edit</button>
                            <button className={css.delete_btn_2} onClick={e=>{handleDeletePriceDuration(durationPrice,itm,catalogDetails); e.preventDefault();e.stopPropagation();}}>Delete</button>
                        </div>
                    </div>
                )
            })}
            
            <div onClick={e=>{handleDeleteCatalogItem(catalogDetails); e.preventDefault(); e.stopPropagation();}} className={css.delete_btn}>
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                <path d="M8.41708 1.45898C8.07069 1.45898 7.76043 1.67326 7.63775 1.99719L7.44643 2.50243C7.03628 2.46144 6.65838 2.42054 6.35247 2.38619C6.1238 2.36052 5.93582 2.33856 5.80524 2.32305L5.65462 2.30497L5.60346 2.29871C5.14672 2.24216 4.72996 2.56649 4.6734 3.02324C4.61683 3.47999 4.94125 3.89611 5.398 3.95267L5.45366 3.95947L5.60864 3.97808C5.74226 3.99395 5.93382 4.01632 6.16651 4.04245C6.63148 4.09466 7.26256 4.16206 7.92467 4.22248C8.81782 4.30399 9.79685 4.37565 10.5004 4.37565C11.204 4.37565 12.183 4.30399 13.0761 4.22248C13.7383 4.16206 14.3694 4.09466 14.8343 4.04245C15.067 4.01632 15.2586 3.99395 15.3922 3.97808L15.5472 3.95947L15.6027 3.95268C16.0595 3.89612 16.384 3.47999 16.3274 3.02324C16.2709 2.56649 15.8548 2.24208 15.398 2.29863L15.3462 2.30497L15.1956 2.32305C15.065 2.33856 14.877 2.36052 14.6484 2.38619C14.3424 2.42054 13.9645 2.46144 13.5544 2.50243L13.3631 1.99719C13.2404 1.67326 12.9301 1.45898 12.5837 1.45898H8.41708Z" fill="#667185"/>
                <path d="M9.66708 9.79232C9.66708 9.33208 9.29398 8.95898 8.83375 8.95898C8.37351 8.95898 8.00041 9.33208 8.00041 9.79232V13.959C8.00041 14.4192 8.37351 14.7923 8.83375 14.7923C9.29398 14.7923 9.66708 14.4192 9.66708 13.959V9.79232Z" fill="#667185"/>
                <path d="M12.1671 8.95898C12.6273 8.95898 13.0004 9.33208 13.0004 9.79232V13.959C13.0004 14.4192 12.6273 14.7923 12.1671 14.7923C11.7068 14.7923 11.3337 14.4192 11.3337 13.959V9.79232C11.3337 9.33208 11.7068 8.95898 12.1671 8.95898Z" fill="#667185"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M16.2585 6.70945C16.334 5.65214 15.4224 4.80451 14.3865 4.92423C13.3265 5.04674 11.6907 5.20898 10.5004 5.20898C9.31013 5.20898 7.67436 5.04674 6.61433 4.92423C5.57839 4.80451 4.66685 5.65214 4.74237 6.70945L5.45631 16.7047C5.51043 17.4624 6.0748 18.103 6.84928 18.2194C7.67979 18.3443 9.2037 18.5438 10.5014 18.5423C11.7831 18.5408 13.3132 18.3422 14.1474 18.2184C14.9232 18.1034 15.4904 17.4623 15.5447 16.7024L16.2585 6.70945ZM14.5778 6.57988C14.5807 6.57955 14.5829 6.57974 14.5829 6.57974L14.5851 6.58025C14.587 6.58089 14.5899 6.58241 14.5928 6.58513C14.5947 6.58693 14.5961 6.58913 14.5961 6.58913L14.596 6.5907L13.883 16.5728C13.0574 16.6948 11.6425 16.8743 10.4994 16.8757C9.34399 16.877 7.9378 16.6972 7.11792 16.5744L6.4048 6.5907L6.40474 6.58913C6.40474 6.58913 6.40616 6.58693 6.40806 6.58513C6.41093 6.58241 6.41384 6.58089 6.41569 6.58025L6.41789 6.57974C6.41789 6.57974 6.42011 6.57955 6.423 6.57988C7.4849 6.7026 9.20495 6.87565 10.5004 6.87565C11.7959 6.87565 13.5159 6.7026 14.5778 6.57988Z" fill="#667185"/>
                </svg>
                <span className={css.delete_txt}>{intl.formatMessage({ id: 'Dashboard.deleteItem' })}</span>
            </div>
        </div>
    )
}

export default SimpleItemCard;