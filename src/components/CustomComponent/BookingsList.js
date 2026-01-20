import css from './BookingsList.module.css';
import BookingsCard from "./BookingsCard";
import { useEffect, useState } from 'react';

const BookingsList = props =>{
    const {transactions,setShowCancelBooking,setShowMarkOrder,setCurrentTransaction,currentUser,setShowRatingForm} = props;

    const [trxs,setTrxs] = useState(transactions);
     useEffect(()=>{
        //console.log("Data updated sssssssssssssssssssssssssssssss")
        setTrxs(transactions);
    },[transactions])

    return (
        <div className={css.container}>
            {trxs !== undefined && trxs.length > 0 && trxs.map((itm,key)=>{
                //console.log(itm,"    ccccccccccccccccccccccccccccccccc")
                return(
                    <BookingsCard 
                        data={itm} 
                        setShowCancelBooking={setShowCancelBooking} 
                        setShowMarkOrder={setShowMarkOrder}
                        setCurrentTransaction={setCurrentTransaction}
                        currentUser={currentUser}
                        setShowRatingForm={setShowRatingForm}
                    />
                )
            })}
        </div>
    )
}

export default BookingsList;