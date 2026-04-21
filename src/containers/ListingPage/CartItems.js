import React from "react";
import css from './CartItems.module.css';
import cart from '../../assets/cart1.png';
import search_icon1 from '../../assets/Search/search_icon1.png';
import search_star from '../../assets/Search/search_star1.png';
import classNames from "classnames";

const CartItems = props =>{

    const {currentUser={},listingId={},onUpdateProfile,setSuccessMessage,setShowSuccessView} = props;
    const {attributes={}} = currentUser;
    const {profile={}} = attributes;
    const {publicData={}} = profile;
    const {cartData=[]} = publicData;

    //console.log("oooooooooo1111111111111pppppppppp")
    const getCartItem = (cartData,listingId)=>{
        let result = [];
        if(listingId === undefined){
            return [];
        }
        cartData.map((itm,key)=>{
            if(itm.id === listingId.uuid){
                result = itm.items;
            }
        })
        return result;
    }

    const cartItems = getCartItem(cartData,listingId);

    

    const getTotalAmount = (cartData) =>{
        let result = 0;
        cartData.map((itm,key)=>{
        
                const {ItemPrice,durationPrice,total} = itm;
                const {price} = durationPrice[0];
                if(ItemPrice !== ""){
                    result += parseFloat(total);
                }else{
                    result += parseFloat(price);
                }
            
        })
        return result;
    }
    const grandTotalVal = getTotalAmount(cartItems);

    let grandTotal = grandTotalVal.toFixed(2);
    grandTotal = new Intl.NumberFormat().format(grandTotal);

    //console.log("=========+++++++++++=============")

    
    const handleRemoveItemFromCart = (listingId,cartItemId)=>{
        //Get the cart for the current list
        const currentListingCartToEdit = (cartData.filter(itm=>itm.id === listingId))[0];
        const remainingListingCart = cartData.filter(itm=>itm.id !== listingId);
        //Get existing cart items
        let existingCartItems = currentListingCartToEdit?.items;
        //Remove this item fron the cartItems in this listing cart
    

        if(existingCartItems !== undefined && existingCartItems.length > 0 && cartItemId !== undefined){
           
            // const otherCartItems = cartItems.filter(itm=>itm.itemName !== itemName);
            
            // //Add this edited catalog detail to the list of items in the cart
            // cartItems.items = [...otherCartItems];

            const remainingCartItems = existingCartItems.filter(itm=>itm.cartItemId !== cartItemId);
            //Put back the remaining cartItems into items in currentListingCartToEdit
            currentListingCartToEdit.items = remainingCartItems;
            //Put back the items in currentListingCartToEdit

            //Save cart in user profile data
            const data = {
                    publicData: {
                    cartData:[...remainingListingCart,currentListingCartToEdit]
                }};
            onUpdateProfile(data);
            console.log("Item removed from cart")
            setSuccessMessage("Item was successfully removed from cart.");
            setShowSuccessView(true);
        }

        
    }
    
    return (
        <div className={css.flex_full}>
            {JSON.stringify(cartItems) !== "{}" && cartItems.length > 0 && cartItems.map((itm,key)=>{
                 const {itemName = "",quantity,total,durationPrice=[],ItemPrice,cartItemId} = itm;
                 let price = 0;
                 if(durationPrice[0].hasOwnProperty("price")){
                    price = durationPrice[0]?.price;
                 }
                 
                 const formatedDesc = itemName.toLowerCase();

                 if(itm.listingId !== listingId.uuid){
                    return "";
                 }
                 
                return(
                    <div className={css.container}>
                        <div className={css.flex_row}>
                            <div className={css.count}>{quantity !== undefined?quantity:1}</div>
                            <span className={css.description}>{formatedDesc}</span>
                        </div>
                        <div className={css.flex_row_gap}>
                            <span className={css.amount}>€{price !== 0?price:ItemPrice}</span>
                            <svg className={css.remove} onClick={e=>handleRemoveItemFromCart(listingId.uuid,cartItemId)} xmlns="http://www.w3.org/2000/svg" width="10" height="14" viewBox="0 0 10 14" fill="none">
                                <path d="M3.00007 0C2.72296 0 2.47475 0.171419 2.37661 0.430568L2.22355 0.834753C1.89543 0.801968 1.59311 0.769244 1.34839 0.741766C1.16545 0.721225 1.01506 0.703658 0.9106 0.691249L0.790103 0.676787L0.749178 0.671783C0.383783 0.626541 0.0503715 0.886008 0.00512287 1.2514C-0.0401262 1.6168 0.219406 1.9497 0.584805 1.99495L0.629333 2.00039L0.753318 2.01527C0.860215 2.02797 1.01346 2.04587 1.19961 2.06677C1.57159 2.10854 2.07645 2.16246 2.60615 2.2108C3.32067 2.27601 4.10388 2.33333 4.66674 2.33333C5.22959 2.33333 6.01281 2.27601 6.72733 2.2108C7.25702 2.16246 7.76189 2.10854 8.13386 2.06677C8.32001 2.04587 8.47326 2.02797 8.58015 2.01527L8.70414 2.00039L8.74858 1.99496C9.11398 1.94971 9.3736 1.6168 9.32835 1.2514C9.2831 0.886008 8.95021 0.626477 8.58482 0.671719L8.54337 0.676787L8.42287 0.691249C8.31841 0.703658 8.16803 0.721225 7.98509 0.741766C7.74036 0.769244 7.43805 0.801968 7.10992 0.834753L6.95686 0.430568C6.85872 0.171419 6.61051 0 6.3334 0H3.00007Z" fill="#475367"/>
                                <path d="M4.00007 6.66667C4.00007 6.29848 3.70159 6 3.3334 6C2.96521 6 2.66674 6.29848 2.66674 6.66667V10C2.66674 10.3682 2.96521 10.6667 3.3334 10.6667C3.70159 10.6667 4.00007 10.3682 4.00007 10V6.66667Z" fill="#475367"/>
                                <path d="M6.00007 6C6.36826 6 6.66674 6.29848 6.66674 6.66667V10C6.66674 10.3682 6.36826 10.6667 6.00007 10.6667C5.63188 10.6667 5.3334 10.3682 5.3334 10V6.66667C5.3334 6.29848 5.63188 6 6.00007 6Z" fill="#475367"/>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.27317 4.20037C9.33359 3.35453 8.60435 2.67642 7.7756 2.7722C6.92758 2.8702 5.61896 3 4.66674 3C3.71451 3 2.4059 2.8702 1.55787 2.7722C0.729122 2.67642 -0.000115544 3.35453 0.060302 4.20037L0.631458 12.1965C0.674754 12.8027 1.12624 13.3152 1.74583 13.4084C2.41023 13.5083 3.62936 13.6679 4.66751 13.6667C5.69289 13.6655 6.91698 13.5066 7.58431 13.4076C8.20496 13.3155 8.65872 12.8027 8.70214 12.1947L9.27317 4.20037ZM7.92867 4.09672C7.93098 4.09645 7.93275 4.09661 7.93275 4.09661L7.93452 4.09701C7.936 4.09752 7.93832 4.09874 7.94062 4.10092C7.94214 4.10236 7.94328 4.10412 7.94328 4.10412L7.94322 4.10538L7.37282 12.091C6.71236 12.1886 5.58042 12.3323 4.66597 12.3333C3.7416 12.3344 2.61665 12.1906 1.96075 12.0924L1.39025 4.10538L1.3902 4.10412C1.3902 4.10412 1.39133 4.10236 1.39285 4.10092C1.39515 4.09874 1.39747 4.09752 1.39896 4.09701L1.40072 4.09661C1.40072 4.09661 1.40249 4.09645 1.4048 4.09672C2.25433 4.19489 3.63037 4.33333 4.66674 4.33333C5.70311 4.33333 7.07915 4.19489 7.92867 4.09672Z" fill="#475367"/>
                            </svg>
                        </div>
                        
                    </div>
                    )
                })}
        <p className={css.total}>Total: <span className={css.amount}>€{grandTotal?grandTotal:"--"}</span></p>
        </div>
    )
}
export default CartItems;