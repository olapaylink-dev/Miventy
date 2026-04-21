import React, { useEffect, useState } from "react";
import css from './ListingForm.module.css';
import css2 from './ServiceDescription.module.css';
import icon1 from '../../../assets/icons/icon1.png';
import icon2 from '../../../assets/icons/icon2.png';
import icon3 from '../../../assets/icons/icon3.png';
import icon4 from '../../../assets/icons/icon4.png';
import icon5 from '../../../assets/icons/icon5.png';
import icon6 from '../../../assets/icons/icon6.png';
import icon7 from '../../../assets/icons/icon7.png';
import ServiceDescription from "./ServiceDescription";
import AboutListing from "./AboutListing/AboutListing";
import Catalog from "./Catalog";
import Publish from "./Publish";
import classNames from "classnames";
import { FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { types as sdkTypes } from '../../../util/sdkLoader';
const { UUID,Money } = sdkTypes;
import { FormattedMessage, useIntl } from '../../../util/reactIntl';

const ListingMainForm = props =>{
    const intl = useIntl();
    const {setShowCreateListing,
        selectedCategory,
        setSelectedCategory,
        selectedSubCategory,
        setSelectedSubCategory,
        availabilitySettingIsOn,
        onCreateListingDraft,
        currentListing,
        onUpdateListing,
        onImageUpload,
        image,
        uploadImageError,
        uploadInProgress,
        ownEntities,
        onPublishListingDraft,
        listings,
        setCurrentListing,
        history,
        showCatalogs,
        currentUser,
        lastAction,
        isUpdateItem,
        updatedListing,
        updateInProgress,
        setIsDraft,
        listingDraft,
        forceUpdate,
        updateListingSuccess,
        onfetchCurrentData,
        getOwnListing,
        onFetchCurrentListing,
        updateListingInProgress,
        selectedFolderName,
        setSelectedFolderName,
        path,
        catalogName,
        setShowPublishSuccess
      } = props;

    const [currentTab,setCurrentTab] = useState("start");
    const [selectedFile, onSetSelectedFile] = useState({});
    const [currentCatalogdata,setCurrentCatalogData] = useState({});
    const publicData = currentListing?.attributes?.publicData;
    const [currRadioBtnCategory, setCurrRadioBtnCategory] = useState(publicData !== undefined?publicData.category:"");
    
    useEffect(()=>{

        if(path==="/profile-settings/catalog/new/:id" || path==="/profile-settings/catalog/edit/:id" || path==="/profile-settings/catalog/start"){
            setCurrentTab("catalog");
        }

        if(path==="/profile-settings/about"){
            setCurrentTab("about");
        }

        if(path==="/profile-settings/publish"){
            setCurrentTab("publish");
        }
           
        },[currentTab]);


    //Important for setting the selected category when the tabs change
     useEffect(()=>{
            if(JSON.stringify(currentListing) !== "{}" && currentListing !== undefined && currentListing.hasOwnProperty("attributes")){
                const {listingType,category} = currentListing?.attributes?.publicData;
                setSelectedCategory(listingType);
                setSelectedSubCategory(category)
            }
        },[currentTab]
    );

    useEffect(()=>{
            //console.log("lastaction",lastAction,"      99999999999999999999999999")
            //console.log(selectedCategory + "    ccccccccccccccccccccccccccccccccc   "+currentTab);
            if((lastAction === "createDraft" || lastAction === "updateDraft") && (JSON.stringify(currentListing) !== "{}" || JSON.stringify(listingDraft) !== "{}")){
                setCurrentListing(listingDraft);
                const listingId = JSON.stringify(currentListing) !== "{}"?currentListing.id.uuid:listingDraft.id.uuid;
                localStorage.setItem("currentListing",listingId);
                setCurrentTab("about");
            }
            
        },[lastAction,listingDraft]
    );


useEffect(()=>{
      const currentListingId = localStorage.getItem("currentListing");
      if(currentListingId !== null){
        onFetchCurrentListing(new UUID(currentListingId),"");
      }
      
  },[]);

const handleMoveToStart = (e,currListing)=>{
    //console.log(currentListing);
    //console.log(currListing);
  setCurrentTab("start");
  
}

const handleMoveToServiceDescription = (e)=>{
  setIsDraft(true);
  
  setCurrentTab("service_description");
}
const handleMoveToAboutService = (e,currListing)=>{
  forceUpdate();
  setIsDraft(true);
  //console.log(currentListing);
  //console.log(currListing);
  //console.log("dddddddddddddddddddddddddddddddddddddddddd");
  setCurrentTab("about");
}
const handleMoveToCatalog = e=>{
  setCurrentTab("catalog");
}
const handleMoveToPublish = e=>{
  setCurrentTab("publish");
}

const handleMoveToDone = e=>{
    setCurrentTab("done");
    setShowCreateListing(false);
}

const handleHideForm = e=>{
    
    setShowCreateListing(false);
    
}

const handleClick = (e,val)=>{
    console.log("oooooooooooooooooo")
    setSelectedCategory(val);

}

const handleChangeTab = (e,tab)=>{
    console.log("ooooooooo111ooooooooo")
    setCurrentTab(tab);
}

 const handleChange = (event) => {
    console.log("oooooooooo22oooooooo")
      setCurrRadioBtnCategory(event.target.value);
      setSelectedSubCategory(event.target.value);
    };

 const categories = [
        {key: intl.formatMessage({id: 'LandingPage.entertaining',}),
            item:[
                {key:'animation',value:"Animation"},
                {key:'magic',value:"Magic"},
                {key:'facePaint',value:"Face Paint"}
            ],css:css.menu1,icon:icon1},
        // {key:intl.formatMessage({id: 'LandingPage.catering',}),
        //         item:[
        //             {key:intl.formatMessage({id: 'LandingPage.catering',}),value:"Catering"}
        //         ],
        //         css:css.menu2,icon:icon2,value:"Catering"},
        // {key: intl.formatMessage({id: 'LandingPage.bdCakesAndSweets',}),
        //     item:[
        //         {key:intl.formatMessage({id: 'LandingPage.bdCake',}),value:"BD Cake"},
        //         {key:intl.formatMessage({id: 'LandingPage.sweets',}),value:"Sweets"},
        //     ],css:css.menu3,icon:icon3},
        // {key: intl.formatMessage({id: 'LandingPage.photoVideo',}),
        //     item:[
        //         {key:intl.formatMessage({id: 'LandingPage.photos',}),value:"Photos"},
        //         {key:intl.formatMessage({id: 'LandingPage.videos',}),value:"Videos"},
        //     ],css:css.menu4,icon:icon4},
        // {key: intl.formatMessage({id: 'LandingPage.musicEvents',}),
        //     item:[
        //         {key:intl.formatMessage({id: 'LandingPage.classicMusic',}),value:"Classical Music"},
        //         {key:intl.formatMessage({id: 'LandingPage.partyMusic',}),value:"Party music/DJs"},
        //     ],css:css.menu5,icon:icon5},
        // {key: intl.formatMessage({id: 'LandingPage.decoration',}),
        //     item:[
        //         {key:intl.formatMessage({id: 'LandingPage.balloonDecorations',}),value:"Balloon Decorations"},
        //         {key:intl.formatMessage({id: 'LandingPage.flowerArragement',}),value:"Flower arrangements"},
        //         {key:intl.formatMessage({id: 'LandingPage.themedDecoration',}),value:"Themed Decoration"},
        //     ],css:css.menu6,icon:icon6},
        // {key: intl.formatMessage({id: 'LandingPage.rentals',}),
        //                     item:[
        //                         {key:intl.formatMessage({id: 'LandingPage.rentalsShadeAndRain',}),value:"Rental shade and rain equipment"},
        //                         {key:intl.formatMessage({id: 'LandingPage.rentalSpace',}),value:"Rental Space"},
        //                         {key:intl.formatMessage({id: 'LandingPage.rentalBouncer',}),icon:icon6,value:"Rental Bouncer"},
        //                     ],css:css.menu7,icon:icon7},
       ];

    const handleCreateDraftOrUpdateExisting = e =>{
      let data;
      if(lastAction === "updateDraft"){
            handleMoveToAboutService();
      }
      
      const processingFee =  { amount: 10, currency: "EUR" };

      setIsDraft(true);
      if(JSON.stringify(currentListing) !== "{}"){
        handleMoveToAboutService();
      }else{
         data = {
          title:"Not yet set",
          publicData:{
            category:currRadioBtnCategory,
            listingType:selectedCategory,
            transactionProcessAlias:"default-purchase/release-1",
            unitType:"item",
            processingFee
          },
        }
        onCreateListingDraft(data, "createDraft")
      }

      console.log(data,"  xxxxxxxxxxxxxxxxxxxxxxxx   ",currentListing)
    }


    return (

        <>
        
        {currentTab==="start"?
            <div className={css.formContent}>
                <div className={css.container}>
                    <div className={css.close_btn} onClick={e=>setShowCreateListing(false)}>
                        <svg className={css.close_icon} xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
                            <path d="M2.05086 1.13616C1.66033 0.745631 1.02717 0.74563 0.636643 1.13616C0.246119 1.52668 0.246119 2.15984 0.636643 2.55037L5.58639 7.50012L0.636643 12.4499C0.246119 12.8404 0.246119 13.4736 0.636643 13.8641C1.02717 14.2546 1.66033 14.2546 2.05086 13.8641L7.0006 8.91433L11.9504 13.8641C12.3409 14.2546 12.974 14.2546 13.3646 13.8641C13.7551 13.4736 13.7551 12.8404 13.3646 12.4499L8.41482 7.50012L13.3646 2.55037C13.7551 2.15984 13.7551 1.52668 13.3646 1.13616C12.974 0.745631 12.3409 0.745631 11.9504 1.13616L7.0006 6.0859L2.05086 1.13616Z" fill="black"/>
                        </svg>
                    </div>
                    <h1 className={css.header}>{intl.formatMessage({ id: 'Dashboard.craeteYourListing' })}</h1>
                    <p className={css.sub_header}>{intl.formatMessage({ id: 'Dashboard.selectTheCategory' })}</p>


                    {categories.map((itmm,key)=>{
                        return(
                            <div className={classNames(css.items, (selectedCategory === itmm.key?css.item_active:""))} onClick={e=>{handleClick(e,itmm.key)}}>
                                <div className={css.flex_row}>
                                    <img className={css.icons} src={itmm.icon} />
                                    <span>{itmm.key}</span>
                                </div>
                                
                                {selectedCategory === itmm.key?
                                    <div className={css2.full_w}>
                                        <FormControl>
                                            <RadioGroup

                                            aria-labelledby="demo-radio-buttons-group-label"
                                            defaultValue={selectedSubCategory}
                                            name="radio-buttons-group"
                                            value={currRadioBtnCategory}
                                            onChange={handleChange}
                                            >

                                            {itmm.item.map((category,key)=>{
                                                return(
                                                <FormControlLabel key={`radio ${category.value} ${key}`} className={css2.no_spacing} value={category.value} control={
                                                    <Radio
                                                    sx={{
                                                        color: "#F56630",
                                                        '&.Mui-checked': {
                                                            color: "#F56630",
                                                        },
                                                        }}
                                                    className={classNames(css2.no_spacing,css2.radio)}/>} 
                                                    label={
                                                        intl.formatMessage({ id: `LandingPage.${category.key}` })
                                                    } />
                                                )

                                            })}
                                            </RadioGroup>
                                        </FormControl>
                                    </div>
                                :""}
                                
                            </div>
                        )
                        
                    })}

                    <div className={css.base_btns}>
                        <button onClick={handleHideForm} className={css.btn_1}>{intl.formatMessage({id: 'CategoriesForm.close'})}</button>
                        <div>
                            <button className={css.btn_prev} disabled>{intl.formatMessage({id: 'CategoriesForm.previous'})}</button>
                            <button onClick={handleCreateDraftOrUpdateExisting} className={css.btn_next}
                             disabled={selectedCategory === undefined || selectedCategory === null || selectedCategory === ""?true:false}
                            >{intl.formatMessage({ id: 'Dashboard.next' })}</button>
                        </div>
                    </div>
                </div>
            </div>
            
        :currentTab==="about"?
            <AboutListing 
                handleMoveToServiceDescription={handleMoveToStart} 
                handleMoveToCatalog={handleMoveToCatalog}    
                setShowCreateListing={setShowCreateListing}
                selectedSubCategory={selectedSubCategory}
                onCreateListingDraft={onCreateListingDraft}
                currentListing={currentListing}
                onUpdateListing={onUpdateListing}
                handleChangeTab={handleChangeTab}
                updatedListing={updatedListing}
                forceUpdate={forceUpdate}
                setCurrentListing={setCurrentListing}
                updateListingSuccess={updateListingSuccess}
            />
        :currentTab==="catalog"?
            <Catalog
                handleMoveToAboutService={handleMoveToAboutService}
                handleMoveToPublish={handleMoveToPublish}
                onSetSelectedFile={onSetSelectedFile}
                setShowCreateListing={setShowCreateListing}
                onCreateListingDraft={onCreateListingDraft}
                currentListing={currentListing}
                onUpdateListing={onUpdateListing}
                onImageUpload={onImageUpload}
                image={image}
                uploadImageError={uploadImageError}
                uploadInProgress={uploadInProgress}
                ownEntities={ownEntities}
                listings={listings}
                setCurrentListing={setCurrentListing}
                history={history}
                showCatalogs={showCatalogs}
                setCurrentCatalogData={setCurrentCatalogData}
                currentCatalogdata={currentCatalogdata}
                currentUser={currentUser}
                lastAction={lastAction}
                isUpdateItem={isUpdateItem}
                updatedListing={updatedListing}
                handleChangeTab={handleChangeTab}
                forceUpdate={forceUpdate}
                onfetchCurrentData={onfetchCurrentData}
                getOwnListing={getOwnListing}
                onFetchCurrentListing={onFetchCurrentListing}
                updateListingInProgress={updateListingInProgress}
                selectedFolderName={selectedFolderName}
                setSelectedFolderName={setSelectedFolderName}
                path={path}
                catalogName={catalogName}
                updateInProgress={updateInProgress}
                />
        :currentTab==="publish"?
            <Publish 
                handleMoveToCatalog={handleMoveToCatalog}
                setShowCreateListing={setShowCreateListing}
                availabilitySettingIsOn={availabilitySettingIsOn} 
                handleMoveToServiceDescription={handleMoveToServiceDescription}
                handleMoveToDone={handleMoveToDone}
                currentListing={currentListing}
                onUpdateListing={onUpdateListing}
                onImageUpload={onImageUpload}
                image={image}
                uploadImageError={uploadImageError}
                uploadInProgress={uploadInProgress}
                ownEntities={ownEntities}
                onPublishListingDraft={onPublishListingDraft}
                setCurrentCatalogData={setCurrentCatalogData}
                currentCatalogdata={currentCatalogdata}
                currentUser={currentUser}
                updatedListing={updatedListing}
                updateInProgress={updateInProgress}
                lastAction={lastAction}
                isUpdateItem={isUpdateItem}
                handleChangeTab={handleChangeTab}
                setShowPublishSuccess={setShowPublishSuccess}
            />
        :
        ""
        }
       
         </>
    )
}
export default ListingMainForm;