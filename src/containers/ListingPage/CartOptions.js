import React, { useState } from "react";
import css from './CartOptions.module.css';
import CardForm from "./CardFrom";
import { v4 as uuidv4 } from 'uuid';
import { FormattedMessage, useIntl } from '../../util/reactIntl';

const CartOptions = props =>{
    const intl = useIntl();
    const {
        selectedCatalogFolderName,
        catalog,
        images,
        getImageUrl,
        setShowCartOptions,
        handleEditCartItemDetails,
        currentUser,listingId,
        onUpdateProfile,
        setShowSuccessView,
        setSuccessMessage,
        setShowSuccessBadge
    } = props;
    const [selectedValue, setSelectedValue] = useState("");
    const isSelected = selectedValue !== "";

    //console.log("here =====================")

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };
    
    const handleContinue  = e=>{
        setShowCartOptions(false);
    }

     const getCartWithListingId = (currentUser,listingId) =>{
        let cart = {};
        const cartData = currentUser?.attributes?.profile?.publicData?.cartData;
        if(cartData !== undefined && JSON.stringify(cartData) !== "{}"){
            cartData.map((itm,key)=>{
                if(itm.id === listingId.uuid){
                    cart = itm;
                }
            })
        }
        return cart;
    }

    const handleAddDurationPriceToCart = (e,selectedDurationPrice,currentSeletedCatalog,imageUrl)=>{

        //Check if there is a cart with cartId === listingId
        //Get cart with cartId === listingId
        let cartData = [];
        const dat = currentUser?.attributes?.profile?.publicData?.cartData;
        if(dat !== undefined && dat.length > 0){
            cartData = dat;
        }
        let existingCart = getCartWithListingId(currentUser,listingId);
        const priceData = JSON.parse(selectedDurationPrice);
        const selectedPrice = priceData.price;

        let selectedDurationPriceObj = JSON.parse(selectedDurationPrice);
        selectedDurationPriceObj.selected = true;

        const currentDurationPrices = currentSeletedCatalog.durationPrice;
        let remainingCurrentDurationPrice = [];
        let notSelectedItems = currentDurationPrices.filter(itm=>itm.id !== selectedDurationPriceObj.id);
        
        notSelectedItems.map((itm,key)=>{
            itm.selected = false;
            remainingCurrentDurationPrice.push(itm);
        })

        console.log("oooooooooooooooooooooooooooooo")

        if(existingCart !== undefined && JSON.stringify(existingCart) !== "{}"){
            //Cart exist
            //Insert this catalog details into the existing cart
             //Edit the selected catalog to reflect the selected durationPrice;
            let currentCatalog = currentSeletedCatalog;
            currentCatalog.cartItemId = uuidv4();
            currentCatalog.ItemPrice = selectedPrice;
            currentCatalog.durationPrice = [...remainingCurrentDurationPrice,selectedDurationPriceObj];
            currentCatalog.total = selectedDurationPriceObj.price;
            currentCatalog.quantity = 1;

            //Remove existing current catalog
            const otherCartItems = existingCart.items.filter(itm=>itm.itemName !== currentCatalog.itemName);
            
            //Add this edited catalog detail to the list of items in the cart
            existingCart.items = [...otherCartItems,currentCatalog];

            //Remove the existing cart from cartData
            const remainingCarts = cartData.filter(itm=>itm.id !== listingId.uuid);

            //Save cart in user profile data
            const data = {
                    publicData: {
                    cartData:[...remainingCarts,existingCart]
                }};
            onUpdateProfile(data);
        }else{
            //Cart does not exist
            //Create a new cart with the listingId
            //And insert the catalog item
            
            //Create a new cart
            const cart = {};
            cart.id = listingId.uuid;
            cart.created = new Date().toDateString();
            cart.state = "pending";
            
            //Edit the selected catalog to reflect the selected durationPrice;
            let currentCatalog = currentSeletedCatalog;
            currentCatalog.cartItemId = uuidv4();
            currentCatalog.ItemPrice = selectedPrice;
            currentCatalog.durationPrice = [...remainingCurrentDurationPrice,selectedDurationPriceObj];
            currentCatalog.total = selectedDurationPriceObj.price;
            currentCatalog.quantity = 1;
            cart.items = [];
            
            //Add this edited catalog detail to the list of items in the cart
            cart.items.push(currentCatalog);

             //Save cart in user profile dataj
            const data = 
            {publicData: {
                cartData:[...cartData,cart]
                }}
            onUpdateProfile(data);
        }
        setSuccessMessage(intl.formatMessage({ id: 'CartOption.itemWasSuccessful' }));
        setShowSuccessView(true);
        //setShowSuccessBadge(true);
    }

    return (

        <div className={css.modal}>
            <div className={css.flex_row_btw}>
                <h1 className={css.header_left}>
                    {selectedCatalogFolderName}
                </h1>
                <button className={css.close_btn}>
                    <svg  onClick={e=>{setShowCartOptions(false)}} xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                        <path d="M7.55086 5.63616C7.16033 5.24563 6.52717 5.24563 6.13664 5.63616C5.74612 6.02668 5.74612 6.65984 6.13664 7.05037L11.0864 12.0001L6.13664 16.9499C5.74612 17.3404 5.74612 17.9736 6.13664 18.3641C6.52717 18.7546 7.16033 18.7546 7.55086 18.3641L12.5006 13.4143L17.4504 18.3641C17.8409 18.7546 18.474 18.7546 18.8646 18.3641C19.2551 17.9736 19.2551 17.3404 18.8646 16.9499L13.9148 12.0001L18.8646 7.05037C19.2551 6.65984 19.2551 6.02668 18.8646 5.63616C18.474 5.24563 17.8409 5.24563 17.4504 5.63616L12.5006 10.5859L7.55086 5.63616Z" fill="black"/>
                    </svg>
                </button>
            </div>
            
            <div className={css.flex_grid}>
                {catalog.map((itm,key)=>{
                   
                    const imageUrl = itm.hasOwnProperty("catalogImages") && itm.catalogImages.length > 0 && itm.catalogImages[0]?.imgUrl;
                    if(itm.folder !== selectedCatalogFolderName){return ""};

                    

                    if(itm.folder === selectedCatalogFolderName && itm.hasOwnProperty("durationPrice") && itm.durationPrice.length > 0 && itm.durationPrice[0].price !== undefined && itm.durationPrice[0].price != 0){
                            return(
                            
                                    <div className={css.card_container}>
                                        <div className={css.flex_col_2}>
                                            <div className={css.img_con_2}>
                                                <img className={css.resize_2} src={imageUrl}/>
                                            </div>
                                            <div>
                                                <span className={css.short_txt}>{itm.itemName}</span>
                                            </div>
                                            
                                            <div>
                                                <p className={css.itm_desc}>{itm.description}</p>
                                            </div>
                                            
                                            <CardForm itm={itm} imageUrl={imageUrl} handleAddDurationPriceToCart={handleAddDurationPriceToCart} />
                                        </div>
                                    </div>
                                )
                    }else{
                        return(
                            
                                    <div className={css.card_container} onClick={e=>{handleEditCartItemDetails(e,itm);}}>
                                        <div className={css.flex_row}>
                                            <div className={css.img_con}>
                                                <img className={css.resize} src={imageUrl}/>
                                            </div>
                                            
                                            <div className={css.flex_col}>
                                                <h4 className={css.short_txt}>{itm.itemName}</h4>
                                                <p>€ {itm.ItemPrice}</p>
                                                <p className={css.itm_desc}> {itm.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                    }
                })}
            </div>
            <div className={css.btn_con}>
                <button className={css.btn_outline_2}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M17.5 2C15.2909 2 13.5 3.79086 13.5 6C13.5 6.17082 13.5107 6.33914 13.5315 6.50432C13.3869 6.62045 13.1985 6.76747 12.9788 6.92902C12.4429 7.32314 11.7538 7.77943 11.0787 8.09309C10.4987 8.36254 9.80204 8.59639 9.23147 8.76609C8.95014 8.84976 8.70735 8.91553 8.53572 8.96018C8.45002 8.98247 8.3824 8.99941 8.33697 9.01059L8.28608 9.02298L8.27415 9.02583L8.27175 9.0264C8.24671 9.03227 8.22194 9.03908 8.19782 9.0467C7.48653 8.39658 6.53958 8 5.5 8C3.29086 8 1.5 9.79086 1.5 12C1.5 14.2091 3.29086 16 5.5 16C6.53956 16 7.48649 15.6034 8.19778 14.9533C8.23402 14.9648 8.27128 14.9743 8.30948 14.9817L8.31057 14.9819L8.32053 14.9839L8.36628 14.9934C8.40782 15.0021 8.47066 15.0158 8.55117 15.0344C8.71245 15.0717 8.94304 15.1286 9.21409 15.2056C9.76329 15.3617 10.4474 15.5917 11.0528 15.8944C11.665 16.2005 12.3643 16.6641 12.9305 17.0694C13.165 17.2373 13.3705 17.3907 13.5295 17.5118C13.51 17.6718 13.5 17.8347 13.5 18C13.5 20.2091 15.2909 22 17.5 22C19.7091 22 21.5 20.2091 21.5 18C21.5 15.7909 19.7091 14 17.5 14C16.1938 14 15.0339 14.6261 14.3039 15.5945C14.237 15.5456 14.1671 15.495 14.0946 15.4431C13.5026 15.0193 12.7019 14.4829 11.9472 14.1056C11.1858 13.7249 10.3699 13.4549 9.76078 13.2818C9.6033 13.2371 9.45757 13.1982 9.32766 13.1651C9.43973 12.7965 9.5 12.4053 9.5 12C9.5 11.5892 9.43808 11.1929 9.32307 10.8199C9.46473 10.781 9.62635 10.7352 9.80163 10.6831C10.4088 10.5025 11.2121 10.2364 11.9213 9.90691C12.7695 9.51287 13.5805 8.96917 14.1637 8.54021C14.217 8.501 14.2687 8.46254 14.3187 8.42502C15.0495 9.38233 16.2026 10 17.5 10C19.7091 10 21.5 8.20914 21.5 6C21.5 3.79086 19.7091 2 17.5 2ZM15.5 6C15.5 4.89543 16.3954 4 17.5 4C18.6046 4 19.5 4.89543 19.5 6C19.5 7.10457 18.6046 8 17.5 8C16.3954 8 15.5 7.10457 15.5 6ZM3.5 12C3.5 10.8954 4.39543 10 5.5 10C6.60457 10 7.5 10.8954 7.5 12C7.5 13.1046 6.60457 14 5.5 14C4.39543 14 3.5 13.1046 3.5 12ZM15.5 18C15.5 16.8954 16.3954 16 17.5 16C18.6046 16 19.5 16.8954 19.5 18C19.5 19.1046 18.6046 20 17.5 20C16.3954 20 15.5 19.1046 15.5 18Z" fill="#CC400C"/>
                    </svg>
                    {intl.formatMessage({id: 'Dashboard.share',})}
                </button>
                <button onClick={handleContinue} className={css.btn_fill}>
                    {intl.formatMessage({id: 'Dashboard.continue',})}
                </button>
            </div>
        </div>
    )
}
export default CartOptions;


