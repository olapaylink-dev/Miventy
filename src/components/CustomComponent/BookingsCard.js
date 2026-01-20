import css from './BookingsCard.module.css';
import icon1 from '../../assets/images/AlexJohnson.png';
import { useEffect } from 'react';


const BookingsCard = props=>{
    const {data,setShowCancelBooking,setShowMarkOrder,setCurrentTransaction,currentUser,setShowRatingForm} = props;
    const {provider,listing,attributes,customer} = data;
    const displayName = provider?.attributes?.profile?.displayName;
    const customerDisplayName = customer?.attributes?.profile?.displayName;
    const displayImg = provider?.profileImage?.attributes?.variants["square-small"]?.url;
    const customerDisplayImg = customer?.profileImage?.attributes?.variants["square-small"]?.url;
    const {protectedData,lineItems} = attributes;
    const {offer} = protectedData;
    const offerEventDate = offer?.eventDate;
    const transactionState = data?.attributes?.state;
    const {items=[]} = protectedData?.cartData && protectedData?.cartData?.cartData? protectedData?.cartData?.cartData:[];
    const {eventDate="",eventLocation=[]} = protectedData?.cartData;
    const location = eventLocation[0]?.result?.place_name;
    const {ItemPrice=0,durationPrice=[],quantity} = items.length > 0? items[0]:{};
    const unitPrice = lineItems[0]?.unitPrice?.amount || 0;
    const listItemPrice = ItemPrice?ItemPrice:durationPrice[0]?.price;
    const price = listItemPrice || unitPrice/100;
    const totalPrice = parseInt(price) * (parseInt(quantity) || 1);

    //console.log(transactionState,"    nnnnnotransactionStateoooppp")

    const listingType = listing?.attributes?.publicData?.listingType;
    const isProvider = provider.id.uuid === currentUser.id.uuid;

    const checkIfCustomerAsReviewed = trx =>{
        let result = false;
        //console.log("++++++++++++++++++")
        if(trx.attributes.payinTotal !== null){
            trx.attributes.transitions.map((itm,key)=>{
                if(itm.transition === "transition/review-1-by-customer"){
                    result = true;
                }
            });
        }
        
        return result;
    }

    const isReviewedByCustomer = checkIfCustomerAsReviewed(data);

    const checkIfConfirmedPayment = trx =>{
        //console.log("++++++++++++++++++")
        let result = false;
        if(trx.attributes.payinTotal !== null){
             trx.attributes.transitions.map((itm,key)=>{
                if(itm.transition === "transition/confirm-payment"){
                    result = true;
                }
            });
        }
       
        return result;
    }

    const isPaymentConfirmed = checkIfConfirmedPayment(data);
    
    return(

        <>
                {isPaymentConfirmed?
                    <div className={css.container}>
                            <div className={css.flex_btw}>
                                <h3 className={css.header}>{listingType} Service </h3>
                                <h3 className={css.header}>€{totalPrice}</h3>
                            </div>
                            {isProvider?
                                <div className={css.flex_col}>
                                    <div className={css.flex_row}>
                                        <span className={css.label}>Customer:</span>
                                        <img className={css.img_circle} src={customerDisplayImg} />
                                        <span>{customerDisplayName}</span>
                                    </div>
                                    <div className={css.flex_row}>
                                        <span className={css.label}>Price:</span>
                                        <span>€{price}</span>
                                    </div>
                                    <div className={css.flex_row}>
                                        <span className={css.label}>Quantity:</span>
                                        <span>{quantity || 1}</span>
                                    </div>
                                    <div className={css.flex_row}>
                                        <span className={css.label}>Date:</span>
                                        <span>{eventDate || offerEventDate}</span>
                                    </div>
                                    <div className={css.flex_row}>
                                        <span className={css.label}>Location:</span>
                                        <span>{location}</span>
                                    </div>
                                </div>
                            :
                                <div className={css.flex_col}>
                                    <div className={css.flex_row}>
                                        <span className={css.label}>Service provider:</span>
                                        <img className={css.img_circle} src={displayImg} />
                                        <span>{displayName}</span>
                                    </div>
                                    <div className={css.flex_row}>
                                        <span className={css.label}>Price:</span>
                                        <span>€{price}</span>
                                    </div>
                                    <div className={css.flex_row}>
                                        <span className={css.label}>Quantity:</span>
                                        <span>{quantity || 1}</span>
                                    </div>
                                    <div className={css.flex_row}>
                                        <span className={css.label}>Date:</span>
                                        <span>{eventDate || offerEventDate}</span>
                                    </div>
                                    <div className={css.flex_row}>
                                        <span className={css.label}>Location:</span>
                                        <span>{location}</span>
                                    </div>
                                </div>
                            }
                            
                            
                            {isProvider?
                                (transactionState === "state/reviewed"?
                                        <div className={css.flex_btw}>
                                            <button onClick={e=>{setShowRatingForm(true); setCurrentTransaction(data)}} className={css.fill_btn} disabled>Completed</button>
                                        </div>
                                    :
                                    !isReviewedByCustomer?
                                        <div className={css.flex_btw}>
                                            <button onClick={e=>{setShowRatingForm(true); setCurrentTransaction(data)}} className={css.fill_btn} disabled>Waiting for customer review</button>
                                        </div>
                                    :
                                        <div className={css.flex_btw}>
                                            <button onClick={e=>{setShowRatingForm(true); setCurrentTransaction(data)}} className={css.fill_btn} >Add a review</button>
                                        </div>
                                )
                            :
                            (   transactionState === "state/reviewed"?
                                    <div className={css.flex_btw}>
                                        <button onClick={e=>{setShowRatingForm(true); setCurrentTransaction(data)}} className={css.fill_btn} disabled>Completed</button>
                                    </div>
                                :
                                isReviewedByCustomer?
                                        <div className={css.flex_btw}>
                                            <button onClick={e=>{setShowRatingForm(true); setCurrentTransaction(data)}} className={css.fill_btn} disabled>Waiting for provider to respond to your review</button>
                                        </div>
                                :
                               
                                    <div className={css.flex_btw}>
                                        <button onClick={e=>{setShowCancelBooking(true)}} className={css.outline_btn}>Cancel booking</button>
                                        <button onClick={e=>{setShowMarkOrder(true); setCurrentTransaction(data)}} className={css.fill_btn}>Mark as completed</button>
                                    </div>
                            )
                                
                            }
                            
                    </div>
                :
                    // <div className={css.flex_btw}>
                    //     <button onClick={e=>{setShowRatingForm(true); setCurrentTransaction(data)}} className={css.fill_btn} disabled >No payment yet</button>
                    // </div>
                    ""
                }
                
        </>
       
    )
}

export default BookingsCard;