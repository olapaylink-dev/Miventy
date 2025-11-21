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
const { UUID } = sdkTypes;

const ListingMainForm = props =>{

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
            console.log("lastaction",lastAction,"      99999999999999999999999999")
            console.log(selectedCategory + "    ccccccccccccccccccccccccccccccccc   "+currentTab);
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
    console.log(currentListing);
    console.log(currListing);
  setCurrentTab("start");
  
}

const handleMoveToServiceDescription = (e)=>{
  setIsDraft(true);
  
  setCurrentTab("service_description");
}
const handleMoveToAboutService = (e,currListing)=>{
  forceUpdate();
  setIsDraft(true);
  console.log(currentListing);
  console.log(currListing);
  console.log("dddddddddddddddddddddddddddddddddddddddddd");
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
    setSelectedCategory(val);
}

const handleChangeTab = (e,tab)=>{
    setCurrentTab(tab);
}

 const handleChange = (event) => {
      setCurrRadioBtnCategory(event.target.value);
      setSelectedSubCategory(event.target.value);
    };

const categories = {
                        "Entertainers":
                                    [
                                    "Magic",
                                    "Face Paint",
                                    "Animation",
                                    ]
                        ,
                         "Catering":
                                    [
                                        "Catering"
                                    ]
                        ,
                        "BD Cake and Sweets":
                                    [
                                    "BD Cake",
                                    "Sweets"
                                    ]
                        ,
                        "Photos Or Videos":
                                    [
                                    "Photographer",
                                    "Videographer"
                                    ]
                        ,
                        "Music For Events":
                                    [
                                    "Classical music",
                                    "Party Music/DJs"
                                    ]
                        ,
                         "Decorations":
                                    [
                                    "Balloon decoration",
                                    "Flower arrangements",
                                    "Themed decoration"
                                    ]
                        ,
                        "Rentals":
                                    [
                                    "Rental shade and rain equipment",
                                    "Rental space",
                                    "Rental bouncer"
                                    ]
                        ,
                       
                       
    
                    };


    const handleCreateDraftOrUpdateExisting = e =>{
      console.log("ccccccccccccccccccc");
      if(lastAction === "updateDraft"){
            handleMoveToAboutService();
      }

      setIsDraft(true);
      if(JSON.stringify(currentListing) !== "{}"){
        handleMoveToAboutService();
        // localStorage.setItem("currentListing",currentListing.id.uuid);
        // const data = {
        //   id:currentListing.id,
        //   title:currentListing?.attributes?.title,
        //   description:currentListing?.attributes?.description,
        //   publicData:{
        //     category:currRadioBtnCategory,
        //     listingType:selectedCategory,
        //   },
        // }
        // onUpdateListing(data,"updateDraft");

      }else{
        const data = {
          title:"Title",
          publicData:{
            category:currRadioBtnCategory,
            listingType:selectedCategory,
            transactionProcessAlias:"default-purchase/release-1",
            unitType:"item"
          },
        }
        onCreateListingDraft(data, "createDraft")
      }
      
      
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
                    <h1 className={css.header}>Create your listing</h1>
                    <p className={css.sub_header}>Select the category you are creating your listing</p>


                    {Object.keys(categories).map((itmm,key)=>{

                        let icon = "";
                        if(key === 0){
                            icon = icon1;
                        }else if(key === 1){
                            icon = icon2;
                        }else if(key === 2){
                            icon = icon3;
                        }else if(key === 3){
                            icon = icon4;
                        }else if(key === 4){
                            icon = icon5;
                        }else if(key === 5){
                            icon = icon6;
                        }else if(key === 6){
                            icon = icon7;
                        }

                        return(
                            <div className={classNames(css.items, (selectedCategory === itmm?css.item_active:""))} onClick={e=>{handleClick(e,itmm)}}>
                                <div className={css.flex_row}>
                                    <img className={css.icons} src={icon} />
                                    <span>{itmm}</span>
                                </div>
                                
                                {selectedCategory === itmm?
                                    <div className={css2.full_w}>
                                        <FormControl>
                                            <RadioGroup

                                            aria-labelledby="demo-radio-buttons-group-label"
                                            defaultValue={selectedSubCategory}
                                            name="radio-buttons-group"
                                            value={currRadioBtnCategory}
                                            onChange={handleChange}
                                            >

                                            {categories[itmm].map((category,key)=>{

                                                return(
                                                <FormControlLabel key={`radio ${category} ${key}`} className={css2.no_spacing} value={category} control={
                                                    <Radio
                                                    sx={{
                                                        color: "#F56630",
                                                        '&.Mui-checked': {
                                                            color: "#F56630",
                                                        },
                                                        }}
                                                    className={classNames(css2.no_spacing,css2.radio)}/>} label={category} />
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
                        <button onClick={handleHideForm} className={css.btn_1}>Close</button>
                        <div>
                            <button className={css.btn_prev} disabled>Previous</button>
                            <button onClick={handleCreateDraftOrUpdateExisting} className={css.btn_next}
                             disabled={selectedCategory === undefined || selectedCategory === null || selectedCategory === ""?true:false}
                            >Next</button>
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
            />
        :
        ""
        }
       
         </>
    )
}
export default ListingMainForm;