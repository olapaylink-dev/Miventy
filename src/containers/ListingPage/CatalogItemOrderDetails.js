import React, { useEffect, useState } from "react";
import css from './CatalogItemOrderDetails.module.css';
import imgUrl from '../../assets/itm_img.jpg';
import { formatMoney } from "../../util/currency";
import { types as sdkTypes } from '../../util/sdkLoader';
import { v4 as uuidv4 } from 'uuid';
import Carousel from "../../components/Carousel/Carousel";
import Incrementer from "../../components/CustomComponent/Incrementer";
import { FormattedMessage, useIntl } from '../../util/reactIntl';

const CatalogItemOrderDetails = props =>{
    const intl = useIntl();
    const {currentCartItmToEdit,
        images,
        setCurrentCartItmToEdit,
        setShowCartCatalogOrderDetails,
        forceUpdate,
        onUpdateProfile,
        currentUser,
        cartData=[],
        setCartData,
        setShowSuccessView,
        setSuccessMessage,
        setShowSuccessBadge,
        currentListing
    } = props;

    const {catalogImages=[]} = currentCartItmToEdit;

    
    const {minQuantity=1} = currentCartItmToEdit;
    const [currentCount,setCurrrentCount] = useState(parseInt(minQuantity===""?1:minQuantity));
    //const [currentTotal,setCurrentTotal] = useState(0);
    const [defaultTotal, setDefaultTotal] = useState(0); 
    const price = parseInt(currentCartItmToEdit?.ItemPrice);
    const currentTotal = currentCount * price;
    const {category} = currentListing?.attributes?.publicData;
    console.log(currentCartItmToEdit,"      ooooooooo222222222222   ",category);
    
  const imageBtns = [imgUrl, imgUrl, imgUrl];
  const slideImages = [imgUrl, imgUrl, imgUrl];

    useEffect(()=>{
        const {minQuantity=1} = currentCartItmToEdit;
        const price = parseInt(currentCartItmToEdit.ItemPrice);
        const currTotal = (parseInt(minQuantity) * price).toFixed(2);
        setDefaultTotal(new Intl.NumberFormat().format(currTotal));
    },[]);


    useEffect(()=>{
        console.log(currentUser);
        if(JSON.stringify(currentUser) !== "{}"){
           
        }
        
    },[currentUser])

    console.log(currentCartItmToEdit);

    const handleSetMessage = msg =>{
        const data = currentCartItmToEdit;
        data.message = msg;
        setCurrentCartItmToEdit(data);
    }

    const handleIncrement = ()=>{
        setCurrrentCount(parseInt(currentCount) + 1);
        setCurrentTotal(parseInt(currentCount) * parseInt(currentCartItmToEdit.ItemPrice));
        forceUpdate();
    }

    const handleDerement = ()=>{
        let minQ = document.getElementById('minQuantity').innerHTML;
        let {minQuantity=1} = currentCartItmToEdit;
        if(minQuantity === ""){
            minQuantity = 1;
        }
         if(parseInt(currentCount) > parseInt(minQuantity)){
            setCurrrentCount(parseInt(currentCount) - 1);
            setCurrentTotal(parseInt(currentCount) * parseInt(currentCartItmToEdit.ItemPrice));
            forceUpdate();
        }
        
    }

    const getCartWithListingId = (currentUser,listingId) =>{
        let cart = {};
        const cartData = currentUser?.attributes?.profile?.publicData?.cartData;
        if(cartData !== undefined && JSON.stringify(cartData) !== "{}"){
            cartData.map((itm,key)=>{
                if(itm.id === listingId){
                    cart = itm;
                }
            })
        }
        return cart;
    }
    

    const handleAddItemToCart = ()=>{

        //Check if there is a cart with cartId === listingId
        //Get cart with cartId === listingId
        let cartData = [];
        const dat = currentUser?.attributes?.profile?.publicData?.cartData;
        if(dat !== undefined && dat.length > 0){
            cartData = dat;
        }
        const listingId = currentCartItmToEdit.listingId;
        let existingCart = getCartWithListingId(currentUser,listingId);
        //console.log("vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv")
        if(existingCart !== undefined && JSON.stringify(existingCart) !== "{}"){
            //Cart exist
            //Insert this catalog details into the existing cart
             //Edit the selected catalog to reflect the selected durationPrice;
            const cartItem = currentCartItmToEdit;
            cartItem.total = currentTotal;
            cartItem.created = new Date().toDateString();
            cartItem.quantity = currentCount;
            cartItem.state = "pending";

            //Remove existing current catalog
            const otherCartItems = existingCart.items.filter(itm=>itm.itemName !== cartItem.itemName);
            
            //Add this edited catalog detail to the list of items in the cart
            existingCart.items = [...otherCartItems,cartItem];

            //Remove the existing cart from cartData
            const remainingCarts = cartData.filter(itm=>itm.id !== listingId);

            //Save cart in user profile data
            const data = {
                    publicData: {
                    cartData:[...remainingCarts,existingCart]
                }};
            onUpdateProfile(data);
            setShowCartCatalogOrderDetails(false);
            console.log("Item added to existing cart")
        }else{
            //Cart does not exist
            //Create a new cart with the listingId
            //And insert the catalog item
            
            //Create a new cart
            const cart = {};
            cart.id = listingId;
            cart.created = new Date().toDateString();
            cart.state = "pending";

            const cartItem = currentCartItmToEdit;
            cartItem.cartItemId = uuidv4();
            cartItem.id = listingId;
            cartItem.total = currentTotal;
            cartItem.created = new Date().toDateString();
            cartItem.quantity = currentCount;
            cartItem.state = "pending";

            cart.items = [];
            cart.items.push(cartItem);

            setCurrentCartItmToEdit(cartItem);
            setCartData([...cartData,cart]);
             //Save cart in user profile data
            const data = 
            {publicData: {
                cartData:[...cartData,cart]
                }}
            onUpdateProfile(data);
            setShowCartCatalogOrderDetails(false);
            console.log("New Item added to new cart");

        }

        setSuccessMessage(intl.formatMessage({ id: 'ListingPage.itemWasSuccessfull' }));
        setShowSuccessView(true);
        //setShowSuccessBadge(true);
    }

    return (
            <div className={css.modal}>
                <div className={css.container_header}>
                    <h3 className={css.header}>{intl.formatMessage({ id: 'ListingPage.itemDetails' })}</h3>
                    <svg onClick={e=>setShowCartCatalogOrderDetails(false)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M7.05086 5.63616C6.66033 5.24563 6.02717 5.24563 5.63664 5.63616C5.24612 6.02668 5.24612 6.65984 5.63664 7.05037L10.5864 12.0001L5.63664 16.9499C5.24612 17.3404 5.24612 17.9736 5.63664 18.3641C6.02717 18.7546 6.66033 18.7546 7.05086 18.3641L12.0006 13.4143L16.9504 18.3641C17.3409 18.7546 17.974 18.7546 18.3646 18.3641C18.7551 17.9736 18.7551 17.3404 18.3646 16.9499L13.4148 12.0001L18.3646 7.05037C18.7551 6.65984 18.7551 6.02668 18.3646 5.63616C17.974 5.24563 17.3409 5.24563 16.9504 5.63616L12.0006 10.5859L7.05086 5.63616Z" fill="black"/>
                    </svg>
                </div>
                <div className={css.container}>
                    <div className={css.flex_1}>
                        <div className={css.slide_con}>
                            <Carousel data={currentCartItmToEdit?.catalogImages}/>
                        </div>
                        
                        <div className={css.header_con}>
                            <h3 className={css.header_2}>{currentCartItmToEdit.itemName}</h3>
                            <p>
                                {currentCartItmToEdit.description}
                            </p>
                        </div>
                        <div className={css.input_con}>
                            <h4 className={css.text_label}>{intl.formatMessage({ id: 'ListingPage.addNotesAndRequest' })}</h4>
                            <textarea onChange={e=>handleSetMessage(e.target.value)} className={css.textarea} placeholder={intl.formatMessage({ id: 'ListingPage.egFillingOfYourChoice' })}/>
                            <p className="mt-1">{intl.formatMessage({ id: 'ListingPage.inCludeSpecialRequest' })}</p>
                        </div>
                    </div>
                    <div className={css.flex_2}>
                        {category === "BD Cake" || category === "Sweets" || category === "catering"?
                                 <div className={css.flex_ful}>
                                    <div className={css.flex_row_btw}>
                                        <span className={css.label_1} >{intl.formatMessage({ id: 'ListingPage.minQuantity' })}</span>
                                        <span className={css.label_2} id="minQuantity">{currentCount}</span>
                                    </div>
                                    <div className={css.flex_row_btw}>
                                        <span className={css.label_1}>{intl.formatMessage({ id: 'ListingPage.unitQuantity' })}</span>
                                        <span className={css.label_2}>1 {intl.formatMessage({ id: 'ListingPage.plate' })}</span>
                                    </div>
                                    <div className={css.flex_row_btw}>
                                        <span className={css.label_1}>{intl.formatMessage({ id: 'ListingPage.priceItem' })}</span>
                                        <span className={css.label_2}>€{currentCartItmToEdit.ItemPrice}</span>
                                    </div>
                                    <div className={css.flex_row_btw_sm}>
                                        <span className={css.total_label}>Total</span>
                                        <span className={css.total}>€{currentTotal === 0?defaultTotal:currentTotal}</span>
                                    </div>
                                </div>
                            :
                                <div className={css.flex_ful}>
                                    {/* <div className={css.flex_row_btw}>
                                        <span className={css.label_1} >Min quantity</span>
                                        <span className={css.label_2} id="minQuantity">{currentCount}</span>
                                    </div>
                                    <div className={css.flex_row_btw}>
                                        <span className={css.label_1}>Unit quantity</span>
                                        <span className={css.label_2}>1 plate</span>
                                    </div> */}
                                    <div className={css.flex_row_btw}>
                                        <span className={css.label_1}>{intl.formatMessage({ id: 'ListingPage.price' })}</span>
                                        <span className={css.label_2}>€{currentCartItmToEdit.ItemPrice}</span>
                                    </div>
                                    <div className={css.flex_row_btw_sm}>
                                        <span className={css.total_label}>Total</span>
                                        <span className={css.total}>€{currentTotal === 0?defaultTotal:currentTotal}</span>
                                    </div>
                                </div>
                        }
                       
                        

                        <div className={css.control_con}>
                            {category === "BD Cake" || category === "Sweets" || category === "catering"?
                                <Incrementer setQuantity={setCurrrentCount}/>
                            :""}
                            
                            <button onClick={handleAddItemToCart} className={css.btn_fill}>
                                {intl.formatMessage({ id: 'ListingPage.addToCart' })}
                            </button>
                        </div>
                    </div>
                </div>
            </div>


       
    )
}
export default CatalogItemOrderDetails;