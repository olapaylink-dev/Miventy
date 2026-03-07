import React, { useEffect, useRef, useState } from "react";
import css from './SearchBar.module.css';
import classNames from "classnames";
import magnifyGlass from '../../assets/icons/magnify_glass.png';
import icon1 from '../../assets/icons/icon1.png';
import list1 from '../../assets/listicon/list1.PNG';
import list2 from '../../assets/listicon/list2.PNG';
import list3 from '../../assets/listicon/list3.PNG';
import list4 from '../../assets/listicon/list4.PNG';
//import { AddressAutofill} from '@mapbox/search-js-react';
import icon2 from '../../assets/icons/icon2.png';
import icon3 from '../../assets/icons/icon3.png';
import icon4 from '../../assets/icons/icon4.png';
import icon5 from '../../assets/icons/icon5.png';
import icon6 from '../../assets/icons/icon6.png';
import icon7 from '../../assets/icons/icon7.png';

import icon1sm from '../../assets/icons/icon1.png';
import icon2sm from '../../assets/icons/icon2.png';
import icon3sm from '../../assets/icons/icon3.png';
import icon4sm from '../../assets/icons/icon4.png';
import icon5sm from '../../assets/icons/icon5.png';
import icon6sm from '../../assets/icons/icon6.png';
import icon7sm from '../../assets/icons/icon7.png';
import icon8sm from '../../assets/icons/icon1.png';
import icon9sm from '../../assets/icons/icon2.png';
import icon10sm from '../../assets/icons/icon3.png';
import icon11sm from '../../assets/icons/icon4.png';
import icon12sm from '../../assets/icons/icon5.png';
import icon13sm from '../../assets/icons/icon6.png';
import icon14sm from '../../assets/icons/icon7.png';
import rain from '../../assets/icons/rainn.png';
import space from '../../assets/icons/space.png';
import SearchMapNew from "../../containers/DashboardPage/SearchMapNew";

const SearchBar2 = props =>{
    const {
        showPopups,
        seShowPopups,
        showTopBoxMenu,
        setShowTopBoxMenu,
        history,
        parentClicked,
        selectedLocation,
        setSelectedLocation,
        selectedService,
        setSelectedService,
    } = props;
    const [isService, setIsService] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [showList1, setShowList1] = useState(false);
    const [showList2, setShowList2] = useState(false);
    const [addr1, setAddr1] = useState("");
    const [addr2, setAddr2] = useState("");
    const [addr3, setAddr3] = useState("");
    const [addr4, setAddr4] = useState("");
    const [addr5, setAddr5] = useState("");
    const [autoValues,setAutoValues] = useState([]);
    const [showMap,setShowMap] = useState(true);

    const inputDisplay = useRef(null);
    const display = useRef(null);
    const [showValue,setShowValue] = useState(false);
    const [eventLocation, setEventLocation] = useState([]);

    const serviceList = [
            {key:"Animation",icon:icon1sm},
            {key:"Magic",icon:icon2sm},
            {key:"Face Paint",icon:icon3sm},
            {key:"Catering",icon:icon2},
            {key:"BD Cake",icon:icon4sm},
            {key:"Sweets",icon:icon5sm},
            {key:"Photos",icon:icon6sm},
            {key:"Videos",icon:icon7sm},
            {key:"Classical Music",icon:icon8sm},
            {key:"Party music/DJs",icon:icon9sm},
            {key:"Balloon Decorations",icon:icon10sm},
            {key:"Flower arrangements",icon:icon11sm},
            {key:"Themed Decoration",icon:icon12sm},
            {key:"Rental shade and rain equipment",icon:rain},
            {key:"Rental Space",icon:space},
            {key:"Rental Bouncer",icon:icon6},
           ];

    useEffect(()=>{
        setShowList1(false);
        setShowList2(false);
    },[parentClicked])

    const handleServiceClicked = e =>{
        e.preventDefault();
        e.stopPropagation();
        seShowPopups(true);
        setIsService(true);
        setIsActive(true);
        setShowList1(true);
        setShowList2(false);
    }

    const handleLocationClicked = e =>{
        e.preventDefault();
        e.stopPropagation();
        seShowPopups(true);
        setIsService(false);
        setIsActive(true);
        setShowList1(false);
        setShowList2(true);
        setShowMap(true);
    }

    const handleMouseLeave = e =>{
        //setIsActive(false);
        //handleShowPopUps();
    }

    //console.log(showPopups);

    const handleSearch = e=>{

        //minLon,minLat,maxLon,maxLat
        //console.log("cccccccxxxxggggggggg")
        const longitudeVal = eventLocation[0].result.center[0];
        const latitudeVal = eventLocation[0].result.center[1];

        let longitude = longitudeVal;//longitude
        let latitude =  latitudeVal;//latitude

        let minlat=0;
        let maxlat=0;
        let minlon=0;
        let maxlon=0;

        //LATITUDE AND LONGITUDE IN DECIMAL
        let minlatt=0;
        let maxlatt=0;
        let minlonn=0;
        let maxlonn=0;


        //Radius in meter
        let meters = 500;///100
        let coef = meters * 0.0000089;

        minlatt= latitude - coef;
        minlat = minlatt.toFixed(10);

        maxlatt = latitude + coef;
        maxlat = maxlatt.toFixed(10);

        minlonn = longitude - coef / Math.cos(latitude * 0.018);
        minlon = minlonn.toFixed(10);

        maxlonn = longitude + coef / Math.cos(latitude * 0.018);
        maxlon = maxlonn.toFixed(10);

        //const bounds = get_bounds(origin.lat,origin.lng);

        // const minlon = eventLocation[0].result.bbox[0];
        // const minlat = eventLocation[0].result.bbox[1];
        
        // const maxlon = eventLocation[0].result.bbox[2];
        // const maxlat = eventLocation[0].result.bbox[3];

        history.push(`/s?bounds=${maxlon}%2C${maxlat}%2C${minlon}%2C${minlat}&mapSearch=true&keywords=${selectedService}`);
    }

    const handleCloseList1 = e =>{
        //console.log("close 1");
        e.preventDefault();
        e.stopPropagation();
        setShowList1(false);
    }

    const handleCloseList2 = e =>{
        //console.log("Close 2");
        e.preventDefault();
        e.stopPropagation();
        setShowList2(false);
    }

    const addressChange1 = val=>{
        //console.log(val.target.value);
        setAddr1(val.target.value);
    }

    const addressChange2 = val=>{
        //console.log(val.target.value);
        setAddr2(val.target.value);
    }

    const addressChange3 = val=>{
        //console.log(val.target.value);
        setAddr3(val.target.value);
    }

    const addressChange4 = val=>{
        //console.log(val.target.value);
        setAddr4(val.target.value);
    }

    const addressChange5 = val=>{
        //console.log(val.target.value);
        setAddr5(val.target.value);
    }

    const handleServiceChange = val =>{
        setAutoValues(serviceList.filter(itm=>itm.key.toLowerCase().includes(val.target.value.toLowerCase())));
    }

    const handleSetSelectedService = val =>{
        //console.log(val);
        setSelectedService(val);
        setShowValue(!showValue);
    }

    const handleClick = e =>{
        inputDisplay.current.focus();
    }

    
const handleSendQuote = ()=>{
   //setShowRequestLocationTime(false);
   //handleSendOrderMessage();
}

const handleBack = e =>{
    //setCurrentRequestQuoteTab(REQUEST_QUOTE_TABS[1]);
}

const handleSaveLocation = val =>{
    //console.log(val);
    setEventLocation([val]);
}


    return (
        <div className={css.main_con}>
            
            <div className={css.search_con} onClick={handleMouseLeave}>
                <div className={classNames(css.flex_row_s,(isActive?css.location_active_bg:""))}>
                    <div className={css.search_item_con}>
                        <div className={classNames(css.search_item_a,(isService?css.location_active_btn:""))} onClick={handleServiceClicked}>
                            <div className={css.text_bold}>Service</div>
                            <div className={css.flex_row_2}>
                                    {showValue?
                                        <div className={css.text_sm} onClick={e=>{setShowValue(!showValue); handleClick() }}>
                                            {selectedService}
                                        </div>
                                    :
                                        <input ref={inputDisplay} className={css.text_sm} onChange={handleServiceChange} placeholder="What service do you want to hire?"/>
                                    }
                                <div>
                                    <svg onClick={handleCloseList1} width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6.55733 5.11438C6.29698 4.85403 5.87487 4.85403 5.61452 5.11438C5.35417 5.37473 5.35417 5.79684 5.61452 6.05719L6.55733 7L5.61452 7.94281C5.35417 8.20316 5.35417 8.62527 5.61452 8.88562C5.87487 9.14597 6.29698 9.14597 6.55733 8.88562L7.50014 7.94281L8.44295 8.88562C8.7033 9.14597 9.12541 9.14597 9.38576 8.88562C9.64611 8.62527 9.64611 8.20316 9.38576 7.94281L8.44295 7L9.38576 6.05719C9.64611 5.79684 9.64611 5.37473 9.38576 5.11438C9.12541 4.85403 8.7033 4.85403 8.44295 5.11438L7.50014 6.05719L6.55733 5.11438Z" fill="#666666"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M7.50016 0.333334C3.81826 0.333334 0.833496 3.3181 0.833496 7C0.833496 10.6819 3.81826 13.6667 7.50016 13.6667C11.1821 13.6667 14.1668 10.6819 14.1668 7C14.1668 3.3181 11.1821 0.333334 7.50016 0.333334ZM2.16683 7C2.16683 4.05448 4.55464 1.66667 7.50016 1.66667C10.4457 1.66667 12.8335 4.05448 12.8335 7C12.8335 9.94552 10.4457 12.3333 7.50016 12.3333C4.55464 12.3333 2.16683 9.94552 2.16683 7Z" fill="#666666"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        {showList1?
                         <div className={css.drd_itm}>
                            {autoValues.length > 0?
                                <>
                                    {autoValues.length > 0 && autoValues.map((itm,key)=>{
                                        return (
                                            <div className={css.flex_row_3} onClick={e=>{setShowList1(false); handleSetSelectedService(itm.key)}}>
                                                <img className={css.small_icon} src={itm.icon}/>
                                                <span>{itm.key}</span>
                                            </div>
                                        )
                                    })}
                                </>
                            :
                                <div className={css.flex_row_3}>
                                    <span>No result found</span>
                                </div>
                            }
                        </div>
                        :""
                        }
                    </div>
                    <div className={css.rule}></div>
                    <div className={classNames(css.search_item_con)}>
                        <div className={classNames(css.search_item_a,(isService?"":css.location_active_btn))} onClick={handleLocationClicked}>
                            <div className={css.text_bold}>Location</div>
                            <div className={css.flex_row_2}>
                                <span className={css.text_sm}>
                                   {eventLocation.length > 0 && eventLocation[0].result?.place_name !== ""?eventLocation[0].result?.place_name:"Where do you need the services?"}  
                                </span>
                                
                                <svg onClick={handleCloseList2} width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.55733 5.11438C6.29698 4.85403 5.87487 4.85403 5.61452 5.11438C5.35417 5.37473 5.35417 5.79684 5.61452 6.05719L6.55733 7L5.61452 7.94281C5.35417 8.20316 5.35417 8.62527 5.61452 8.88562C5.87487 9.14597 6.29698 9.14597 6.55733 8.88562L7.50014 7.94281L8.44295 8.88562C8.7033 9.14597 9.12541 9.14597 9.38576 8.88562C9.64611 8.62527 9.64611 8.20316 9.38576 7.94281L8.44295 7L9.38576 6.05719C9.64611 5.79684 9.64611 5.37473 9.38576 5.11438C9.12541 4.85403 8.7033 4.85403 8.44295 5.11438L7.50014 6.05719L6.55733 5.11438Z" fill="#666666"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M7.50016 0.333334C3.81826 0.333334 0.833496 3.3181 0.833496 7C0.833496 10.6819 3.81826 13.6667 7.50016 13.6667C11.1821 13.6667 14.1668 10.6819 14.1668 7C14.1668 3.3181 11.1821 0.333334 7.50016 0.333334ZM2.16683 7C2.16683 4.05448 4.55464 1.66667 7.50016 1.66667C10.4457 1.66667 12.8335 4.05448 12.8335 7C12.8335 9.94552 10.4457 12.3333 7.50016 12.3333C4.55464 12.3333 2.16683 9.94552 2.16683 7Z" fill="#666666"/>
                                </svg>
                                
                                
                            </div>
                        
                        </div>
                       
                           
                           {showList2?
                                <>
                                 <div className={css.drd_itm_2}>
                                    {/* <div className={classNames(css.flex_row_3,css.no_bg)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-geo-alt" viewBox="0 0 16 16">
                                            <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10"/>
                                            <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                                        </svg>
                                        <span>Use current location</span>
                                    </div> */}
                                   
                                    {/* <form 
                                        className={css.location_input}
                                    >
                                        <AddressAutofill
                                            accessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
                                        >
                                            <input onChange={addressChange1} type="text" name="address-1" autocomplete="address-line1" placeholder="Type your location here" value={addr1}/>
                                            <input onChange={addressChange2} type="text" name="address-2" autocomplete="address-line2" value={addr2} />
                                            <input onChange={addressChange3} type="text" name="city" autocomplete="address-level2" value={addr3}/>
                                            <input onChange={addressChange4} type="text" name="state" autocomplete="address-level1" value={addr4}/>
                                            <input onChange={addressChange5} type="text" name="zip" autocomplete="postal-code" value={addr5}/>
                                        </AddressAutofill>
                                    </form> */}

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
                                           
                                        </div>
                                    :""}
                       
                                  </div>

                                </>
                           
                           :""}
                           
                          
                       
                    </div>
                    
                </div>
                <div className={css.btn_border}>
                    <button className={css.search_btn} onClick={handleSearch}>
                            <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.91 2.06245C5.76787 2.06245 2.41 5.42031 2.41 9.56245C2.41 13.7046 5.76787 17.0624 9.91 17.0624C11.6808 17.0624 13.3084 16.4487 14.5914 15.4224L17.6541 18.485C17.9795 18.8105 18.5072 18.8105 18.8326 18.485C19.158 18.1596 19.158 17.632 18.8326 17.3065L15.7699 14.2439C16.7963 12.9608 17.41 11.3333 17.41 9.56245C17.41 5.42031 14.0521 2.06245 9.91 2.06245ZM4.07667 9.56245C4.07667 6.34079 6.68834 3.72911 9.91 3.72911C13.1317 3.72911 15.7433 6.34079 15.7433 9.56245C15.7433 12.7841 13.1317 15.3958 9.91 15.3958C6.68834 15.3958 4.07667 12.7841 4.07667 9.56245Z" fill="#CC400C"/>
                            </svg>
                        {intl.formatMessage({id:'Dashboard.search'})}
                    </button>
                </div>
            </div>

        </div>
    )
}

export default SearchBar2;