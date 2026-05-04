import React, { useState } from "react";
import css from './RequestLocationTime.module.css';
import itm_img from '../../assets/itm_img.jpg';
import classNames from "classnames";
import { FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import CartOptions_2 from "../../containers/ListingPage/CartOptions_2";
import SearchMapNew from "../../containers/DashboardPage/SearchMapNew";
import MyDatePicker from "../MyDatePicker";
import { FormattedMessage, useIntl } from '../../util/reactIntl';


const REQUEST_QUOTE_TABS = [
  "service_type",
  "guest_count_and_duration",
  "location_and_time"
]

const RequestLocationTime = props =>{
    const intl = useIntl();

    const {
        setShowRequestLocationTime,
        setCurrentRequestQuoteTab,
        setEventDate,
        eventDate,
        setEventLocation,
        eventLocation,

        listingType,
        setShowConfirmOrderForm,
        onSendOrderMessage,
        currentListing,
        setShowSuccessView,
        setSuccessMessage,
        setShowSuccessBadge,
        handleSendOrderMessage,
        showDatePicker,
        setShowDatePicker
    }=props;
    //const {publicData} = currentListing.attributes;
    //const [eventLocation,setEventLocation] = useState([]);
    const [showMap,setShowMap] = useState(false);
    //const [showDatePicker,setShowDatePicker] = useState();
    const [dateOfBirth, setDateOfBirth] = useState("");

const handleSendQuote = ()=>{
   setShowRequestLocationTime(false);
   handleSendOrderMessage();
}

const handleBack = e =>{
    setCurrentRequestQuoteTab(REQUEST_QUOTE_TABS[1]);
}

const handleSaveLocation = val =>{
    //console.log(val);
    setEventLocation([val]);
}

const handleDateChange = value=>{
    const date = new Date(value).toLocaleDateString();
    const dateArr = date.split("/");
    const year = dateArr[2];
    const month = dateArr[0];
    const day = dateArr[1];
    setEventDate(`${year}-${month}-${day}`);//YYYY-MM-DD
  }

    return (
            <div className={css.modal} onClick={e=>{setShowDatePicker(false);}}>
                <div className={css.container_header}>
                    <svg onClick={e=>setShowRequestLocationTime(false)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M7.05086 5.63616C6.66033 5.24563 6.02717 5.24563 5.63664 5.63616C5.24612 6.02668 5.24612 6.65984 5.63664 7.05037L10.5864 12.0001L5.63664 16.9499C5.24612 17.3404 5.24612 17.9736 5.63664 18.3641C6.02717 18.7546 6.66033 18.7546 7.05086 18.3641L12.0006 13.4143L16.9504 18.3641C17.3409 18.7546 17.974 18.7546 18.3646 18.3641C18.7551 17.9736 18.7551 17.3404 18.3646 16.9499L13.4148 12.0001L18.3646 7.05037C18.7551 6.65984 18.7551 6.02668 18.3646 5.63616C17.974 5.24563 17.3409 5.24563 16.9504 5.63616L12.0006 10.5859L7.05086 5.63616Z" fill="black"/>
                    </svg>
                </div>
                
                <div className={css.container}>
                    <div className={css.flex_col}>
                        <h2 className={css.form_header}>{intl.formatMessage({id:'CreateQuoteForm.whereIsTheLocation'})}</h2>
                        <div className={css.area_con} onClick={e=>setShowMap(true)}>
                            <label>{intl.formatMessage({id:'CreateQuoteForm.selectLocation'})}</label>
                            <div className={css.flex_row_area}>
                            
                                {eventLocation != null && eventLocation.length > 0?
                                    <div className={css.location_selected_2}>
                                    {eventLocation != null && eventLocation.map((itm,k)=>{
                                        return (
                                            <div className={css.loca_con}>
                                                <span>{itm?.result?.place_name}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                                :
                                <>
                                    <span className={css.placeholder}>{intl.formatMessage({id:'StripePayoutPage.selectYourService'})}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0002 5.49914C9.51487 5.49914 7.50015 7.51385 7.50015 9.99914C7.50015 12.4844 9.51487 14.4991 12.0002 14.4991C14.4854 14.4991 16.5002 12.4844 16.5002 9.99914C16.5002 7.51385 14.4854 5.49914 12.0002 5.49914ZM9.50015 9.99914C9.50015 8.61842 10.6194 7.49914 12.0002 7.49914C13.3809 7.49914 14.5002 8.61842 14.5002 9.99914C14.5002 11.3798 13.3809 12.4991 12.0002 12.4991C10.6194 12.4991 9.50015 11.3798 9.50015 9.99914Z" fill="#475367"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M7.80939 3.59112C10.3471 1.89931 13.6532 1.89931 16.1909 3.59112C19.6218 5.87839 20.585 10.4941 18.3553 13.9627L14.5237 19.9229C13.3428 21.7599 10.6575 21.7599 9.47662 19.9229L5.64505 13.9627C3.41528 10.4941 4.3785 5.87839 7.80939 3.59112ZM8.9188 5.25523C10.7847 4.01128 13.2156 4.01128 15.0815 5.25523C17.6042 6.93699 18.3124 10.3308 16.6729 12.8812L12.8413 18.8414C12.4477 19.4537 11.5526 19.4537 11.159 18.8414L7.32741 12.8812C5.68792 10.3308 6.39615 6.93699 8.9188 5.25523Z" fill="#475367"/>
                                    </svg>
                                </>
                                }
                            
                            </div>
                            
                        </div>
                    </div>
                    
                    <div className={css.flex_col}>
                        <h2 className={css.form_header}>{intl.formatMessage({id:'CreateQuoteForm.whenIsYourEvent'})}</h2>
                        <div className={css.area_con}>
                            <label>{intl.formatMessage({id:'CreateQuoteForm.selectDateOfYour'})}</label>
                            <MyDatePicker currentDate={eventDate} onChange={handleDateChange} showDatePicker={showDatePicker} setShowDatePicker={setShowDatePicker}/>
                        </div>
                    </div>
                    
                    
                    <div className={css.flex_row}>
                        <button className={css.btn_outline} onClick={handleBack}>
                             {intl.formatMessage({id:'CreateQuoteForm.previous'})}
                        </button>
                        <button className={css.btn_fill} onClick={handleSendQuote}>
                            {intl.formatMessage({id:'CreateQuoteForm.sendQuote'})}
                        </button>
                    </div>


                    {showMap?
                            <div className={css.map_overlay}>
                            <div className={css.map_con} >
                                <SearchMapNew eventLocation={eventLocation} setServiceAreas={handleSaveLocation} />
                                <div className={css.close_con} onClick={e=>setShowMap(false)}>
                                    <div className={css.close_map}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <path d="M2.05086 0.636643C1.66033 0.246119 1.02717 0.246119 0.636643 0.636643C0.246119 1.02717 0.246119 1.66033 0.636643 2.05086L5.58639 7.0006L0.636643 11.9504C0.246119 12.3409 0.246119 12.974 0.636643 13.3646C1.02717 13.7551 1.66033 13.7551 2.05086 13.3646L7.0006 8.41482L11.9504 13.3646C12.3409 13.7551 12.974 13.7551 13.3646 13.3646C13.7551 12.974 13.7551 12.3409 13.3646 11.9504L8.41482 7.0006L13.3646 2.05086C13.7551 1.66033 13.7551 1.02717 13.3646 0.636643C12.974 0.246119 12.3409 0.246119 11.9504 0.636643L7.0006 5.58639L2.05086 0.636643Z" fill="black"/>
                                    </svg>
                                    </div>
                                </div>
                            </div>

                        
                            <div className={css.location_selected}>
                            {eventLocation != null && eventLocation.map((itm,k)=>{
                                    return (
                                    <div className={css.loca_con}>
                                        <span>{itm?.result?.place_name}</span>
                                    </div>
                                    )
                                })}
                            </div>
                        </div>
                  :""}
                    
                   
                </div>

                
            </div>

    )
}

export default RequestLocationTime;