import css from './BookingsCard.module.css';
import icon1 from '../../assets/images/AlexJohnson.png';

const BookingsCard = props=>{
    const {data,setShowCancelBooking,setShowMarkOrder} = props;
    const {provider,listing,attributes} = data;
    const displayName = provider?.attributes?.profile?.displayName;
    const displayImg = provider?.profileImage?.attributes?.variants["square-small"]?.url;
    const {protectedData} = attributes;
    const item = protectedData?.cartData?.cartData.items[0];
    const {eventDate,eventLocation} = protectedData?.cartData;
    const location = eventLocation[0]?.result?.place_name;
    const {ItemPrice,durationPrice} = item;
    const price = ItemPrice?ItemPrice:durationPrice[0]?.price;

    const listingType = listing?.attributes?.publicData?.listingType;
    
    return(
        <div className={css.container}>
            <div className={css.flex_btw}>
                <h3 className={css.header}>{listingType} Service </h3>
                <h3 className={css.header}>${price}</h3>
            </div>
            <div className={css.flex_col}>
                <div className={css.flex_row}>
                    <span className={css.label}>Service provider:</span>
                    <img className={css.img_circle} src={displayImg} />
                    <span>{displayName}</span>
                </div>
                <div className={css.flex_row}>
                    <span className={css.label}>Date:</span>
                    <span>{eventDate}</span>
                </div>
                <div className={css.flex_row}>
                    <span className={css.label}>Location:</span>
                    <span>{location}</span>
                </div>
            </div>
            
            <div className={css.flex_btw}>
                <button onClick={e=>{setShowCancelBooking(true)}} className={css.outline_btn}>Cancel booking</button>
                <button onClick={e=>setShowMarkOrder(true)} className={css.fill_btn}>Mark as completed</button>
            </div>
        </div>
    )
}

export default BookingsCard;