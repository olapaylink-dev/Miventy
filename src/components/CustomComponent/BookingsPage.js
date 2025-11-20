import css from './BookingsPage.module.css';
import classNames from "classnames";
import {
  NamedLink
} from '../../components';
import BookingsList from './BookingsList';

const BookingsPage = props =>{
  const {transactions,
    setShowCancelBooking,
    setShowMarkOrder
  } = props;
  console.log(transactions,"    ssssdddddmmmm")
    return (
        <div className={css.main_con}>
            <div className={css.container_m} >
                  <div className={classNames(css.flex_row,css.full_w)}>
                    <NamedLink name="LandingPage">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M11.9137 1.98752C10.766 1.18411 9.23837 1.18411 8.09063 1.98752L2.35932 5.99944C1.39381 6.6753 0.856954 7.81078 0.947345 8.98587L1.53486 16.6236C1.64567 18.064 2.95084 19.111 4.38105 18.9067L7.0224 18.5294C8.25402 18.3534 9.16884 17.2986 9.16884 16.0545V15C9.16884 14.5398 9.54194 14.1667 10.0022 14.1667C10.4624 14.1667 10.8355 14.5398 10.8355 15V16.0545C10.8355 17.2986 11.7503 18.3534 12.982 18.5294L15.6233 18.9067C17.0535 19.111 18.3587 18.064 18.4695 16.6236L19.057 8.98587C19.1474 7.81078 18.6105 6.67531 17.645 5.99944L11.9137 1.98752ZM9.0464 3.35291C9.62027 2.9512 10.3841 2.9512 10.9579 3.35291L16.6893 7.36483C17.172 7.70276 17.4404 8.2705 17.3952 8.85805L16.8077 16.4957C16.7708 16.9759 16.3357 17.3249 15.859 17.2568L13.2177 16.8795C12.8071 16.8208 12.5022 16.4692 12.5022 16.0545V15C12.5022 13.6193 11.3829 12.5 10.0022 12.5C8.62146 12.5 7.50218 13.6193 7.50218 15V16.0545C7.50218 16.4692 7.19723 16.8208 6.7867 16.8795L4.14535 17.2568C3.66861 17.3249 3.23355 16.9759 3.19662 16.4957L2.6091 8.85804C2.56391 8.2705 2.83233 7.70276 3.31509 7.36483L9.0464 3.35291Z" fill="#EB5017"/>
                      </svg>
                    </NamedLink>
                    
                    <span className={css.catering}>
                      <NamedLink name="SearchPage">
                        <span className={css.item_list}>Item List</span>
                      </NamedLink> 
                      &nbsp; / <span className={css.item_list}>My Bookings</span></span>
                  </div>
            </div>
            <BookingsList transactions={transactions} setShowCancelBooking={setShowCancelBooking} setShowMarkOrder={setShowMarkOrder} />
        </div>
         
    )
}

export default BookingsPage;