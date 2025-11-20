import css from './BookingsList.module.css';
import BookingsCard from "./BookingsCard";

const BookingsList = props =>{
    const {transactions,setShowCancelBooking,setShowMarkOrder} = props;
    return (
        <div className={css.container}>
            {transactions.length > 0 && transactions.map((itm,key)=>{
                console.log(itm,"    ccccccccccccccccccccccccccccccccc")
                return(
                    <BookingsCard data={itm} setShowCancelBooking={setShowCancelBooking} setShowMarkOrder={setShowMarkOrder}/>
                )
            })}
        </div>
    )
}

export default BookingsList;