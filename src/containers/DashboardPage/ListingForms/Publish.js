import React, { useEffect, useRef, useState } from "react";
import css from './Publish.module.css';
import classNames from "classnames";
import ProgressTopbar from "./ProgressTopBar/ProgressTopbar";
import TopTab from "./TopTab";
import { types as sdkTypes } from '../../../util/sdkLoader';
const { LatLng } = sdkTypes;
import Button from '@mui/material/Button';
import { CircularProgress } from "@mui/material";
import { FormattedMessage, useIntl } from '../../../util/reactIntl';


const Publish = props =>{
  const intl = useIntl();
  const {
    handleMoveToDone,
    handleMoveToCatalog,
    setShowCreateListing,
    availabilitySettingIsOn,
    handleMoveToServiceDescription,
    currentListing,
    onUpdateListing,
    onImageUpload,
    image,
    uploadImageError,
    uploadInProgress,
    ownEntities,
    onPublishListingDraft,
    setCurrentCatalogData,
    currentCatalogdata,
    currentUser,
    updatedListing,
    updateInProgress,
    lastAction,
    isUpdateItem,
    handleChangeTab
  } = props;

  //console.log(uploadInProgress,"    oooooo");

const [currentTab,setCurrentTab] = useState("start");
const fileInput = useRef(null);

let img = "";
 if(JSON.stringify(currentListing) !== "{}" && JSON.stringify(ownEntities) !== "{}"){
    const {coverPhoto="",catalog=[]} = currentListing?.attributes?.publicData?currentListing?.attributes?.publicData:{};

    let imageUrl = "";
    if(coverPhoto !== undefined && coverPhoto !== "" && ownEntities.hasOwnProperty("image")){
      imageUrl = coverPhoto;
    }

    img = imageUrl;
 }

const [imageSrc,setImageSrc] = useState(img);


useEffect(()=>{
  //console.log(lastAction+"  ============== " + updatedListing);
  if(updatedListing !== undefined && JSON.stringify(updatedListing) !== "{}" && lastAction === "done" && updatedListing?.data?.attributes?.state === "published"){
   // handleMoveToDone();
   alert(JSON.stringify(updatedListing.data.attributes.state," ===="));
   //window.location.reload();
   window.document.body.style.zoom = "100%";
  }else if(lastAction === "remove_image"){
    //Image was remove
    //Clear the image src to reflectt changes
    setImageSrc("");
  }

},[updatedListing])


const handleHideForm = e=>{

  setShowCreateListing(false);
  
}

const handlePublish = async e=> {
  const {attributes={}} = currentUser;
  const {profile={}} = attributes;
  const state = currentListing?.attributes?.state;
  if(image !== undefined){
    const {publicData={}} = profile;
    const {serviceAreas=[]} = publicData;
    const address = serviceAreas[0]?.result?.place_name;
    const center = serviceAreas[0]?.result?.center;
    const geolocation = center !== undefined && center.length > 0? new LatLng(center[1],center[0]):{};
    
    // const address = { 
    //                 city: "New York", 
    //                 country: "USA",
    //                 state: "NY",
    //                 street: "230 Hamilton Ave"
    //               };

    if(JSON.stringify(geolocation) !== "{}"){
        const data = {
            id:currentListing.id,
            geolocation: geolocation,
            publicData:{
              location:{address:address,building:"test"}
            },
          };
     await onUpdateListing(data,"done");
    }else{

      const data = {
            id:currentListing.id,
            publicData:{
              location:{address:"Not yet set",building:"test"}
              },
            };
      await onUpdateListing(data,"done");

    }
    
  }

  console.log(state,"   state---------------------------")

  //if(state && state !== undefined && state !== "published"){
   await onPublishListingDraft(currentListing.id);
  //}
}

const handleFileClick = (e)=>{
    fileInput.current.click();
    //console.log("5 clicked");
}

const handleChange = (event)=>{
  if(event.target.files && event.target.files[0]){
    let reader = new FileReader();
    reader.onload = (e) =>{
      setImageSrc(e.target.result);
    }
     const file = event.target.files[0];
    //onSetSelectedFile(event.target.files[0]);
    reader.readAsDataURL(event.target.files[0]);

    if (file != null) {
      const tempId = `${file.name}_${Date.now()}`;
      onImageUpload({ id: tempId, file ,listingId:currentListing.id, isCoverPhoto:true});
    }
    
  }
}

const handleRemoveImage = ()=>{

 let data = {};
        data = {
                  id:currentListing.id,
                  publicData:{
                                coverPhoto:""
                              },                              
                  };
    onUpdateListing(data,"remove_image");
}

const subHeader = intl.formatMessage({id: 'Catalog.createCatalog'});
const instruction = intl.formatMessage({ id: 'Dashboard.createACatalog' });

    return (
    
        <>
        {true?
            <div className={css.formContent}>
                    <div className={css.close_btn} onClick={e=>setShowCreateListing(false)}>
                        <svg className={css.close_icon} xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
                            <path d="M2.05086 1.13616C1.66033 0.745631 1.02717 0.74563 0.636643 1.13616C0.246119 1.52668 0.246119 2.15984 0.636643 2.55037L5.58639 7.50012L0.636643 12.4499C0.246119 12.8404 0.246119 13.4736 0.636643 13.8641C1.02717 14.2546 1.66033 14.2546 2.05086 13.8641L7.0006 8.91433L11.9504 13.8641C12.3409 14.2546 12.974 14.2546 13.3646 13.8641C13.7551 13.4736 13.7551 12.8404 13.3646 12.4499L8.41482 7.50012L13.3646 2.55037C13.7551 2.15984 13.7551 1.52668 13.3646 1.13616C12.974 0.745631 12.3409 0.745631 11.9504 1.13616L7.0006 6.0859L2.05086 1.13616Z" fill="black"/>
                        </svg>
                    </div>
                    <ProgressTopbar step={"Step 3 of 4"} percentage={"60%"}/>
                    <TopTab activeTab={"publish"} subHeader={subHeader} instruction={instruction} handleChangeTab={handleChangeTab}/>

                   
                    <div className={css.photo_con}>

                      <h2 className={css.cover_header}>{intl.formatMessage({id: 'Dashboard.coverImageRequired'})}</h2>

                       <div >
                          {imageSrc===""?
                            <div onClick={handleFileClick} className={css.pic_item}>
                              <div className={css.upload_icon_con}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                                  <path d="M6.1076 9.81082C6.1076 6.82772 8.52588 4.40945 11.509 4.40945C14.1514 4.40945 16.3525 6.30796 16.819 8.81567C16.8845 9.16732 17.1359 9.4556 17.4754 9.5682C19.4305 10.2166 20.8386 12.0602 20.8386 14.2301C20.8386 16.942 18.6402 19.1405 15.9283 19.1405C15.3859 19.1405 14.9462 19.5801 14.9462 20.1225C14.9462 20.6649 15.3859 21.1046 15.9283 21.1046C19.7249 21.1046 22.8028 18.0268 22.8028 14.2301C22.8028 11.3895 21.0804 8.95345 18.6253 7.90519C17.7852 4.76103 14.9185 2.44531 11.509 2.44531C7.44112 2.44531 4.14347 5.74296 4.14347 9.81082C4.14347 9.9093 4.14541 10.0074 4.14925 10.105C2.38604 11.1223 1.19727 13.0275 1.19727 15.2122C1.19727 18.4665 3.83539 21.1046 7.08967 21.1046C7.63205 21.1046 8.07174 20.6649 8.07174 20.1225C8.07174 19.5801 7.63205 19.1405 7.08967 19.1405C4.92015 19.1405 3.1614 17.3817 3.1614 15.2122C3.1614 13.5846 4.1515 12.1859 5.56614 11.59C5.9755 11.4176 6.21815 10.9918 6.15788 10.5517C6.12477 10.31 6.1076 10.0627 6.1076 9.81082Z" fill="#475367"/>
                                  <path d="M11.3476 14.4782C11.7197 14.1474 12.2804 14.1474 12.6525 14.4782L14.1256 15.7876C14.5309 16.1479 14.5675 16.7687 14.2071 17.1741C13.8919 17.5287 13.3774 17.601 12.9821 17.3723V22.0867C12.9821 22.629 12.5424 23.0687 12 23.0687C11.4576 23.0687 11.0179 22.629 11.0179 22.0867V17.3723C10.6227 17.601 10.1081 17.5287 9.7929 17.1741C9.43256 16.7687 9.46908 16.1479 9.87446 15.7876L11.3476 14.4782Z" fill="#475367"/>
                                </svg>
                              </div>
                              <span className={css.pic_label}>{intl.formatMessage({id: 'Dashboard.clickToUpload'})}</span>
                            </div>
                            :
                            <div className={css.cover_con}>
                              <div onClick={handleFileClick} className={css.img_con}>
                                <img className={css.resize} src={imageSrc !== ""?imageSrc:img}/>
                              </div>
                              
                              <div onClick={handleRemoveImage} className={css.remove_con}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                  <path d="M7.91708 1.45898C7.57069 1.45898 7.26043 1.67326 7.13775 1.99719L6.94643 2.50243C6.53628 2.46144 6.15838 2.42054 5.85247 2.38619C5.6238 2.36052 5.43582 2.33856 5.30524 2.32305L5.15462 2.30497L5.10346 2.29871C4.64672 2.24216 4.22996 2.56649 4.1734 3.02324C4.11683 3.47999 4.44125 3.89611 4.898 3.95267L4.95366 3.95947L5.10864 3.97808C5.24226 3.99395 5.43382 4.01632 5.66651 4.04245C6.13148 4.09466 6.76256 4.16206 7.42467 4.22248C8.31782 4.30399 9.29685 4.37565 10.0004 4.37565C10.704 4.37565 11.683 4.30399 12.5761 4.22248C13.2383 4.16206 13.8694 4.09466 14.3343 4.04245C14.567 4.01632 14.7586 3.99395 14.8922 3.97808L15.0472 3.95947L15.1027 3.95268C15.5595 3.89612 15.884 3.47999 15.8274 3.02324C15.7709 2.56649 15.3548 2.24208 14.898 2.29863L14.8462 2.30497L14.6956 2.32305C14.565 2.33856 14.377 2.36052 14.1484 2.38619C13.8424 2.42054 13.4645 2.46144 13.0544 2.50243L12.8631 1.99719C12.7404 1.67326 12.4301 1.45898 12.0837 1.45898H7.91708Z" fill="#475367"/>
                                  <path d="M9.16708 9.79232C9.16708 9.33208 8.79398 8.95898 8.33375 8.95898C7.87351 8.95898 7.50041 9.33208 7.50041 9.79232V13.959C7.50041 14.4192 7.87351 14.7923 8.33375 14.7923C8.79398 14.7923 9.16708 14.4192 9.16708 13.959V9.79232Z" fill="#475367"/>
                                  <path d="M11.6671 8.95898C12.1273 8.95898 12.5004 9.33208 12.5004 9.79232V13.959C12.5004 14.4192 12.1273 14.7923 11.6671 14.7923C11.2068 14.7923 10.8337 14.4192 10.8337 13.959V9.79232C10.8337 9.33208 11.2068 8.95898 11.6671 8.95898Z" fill="#475367"/>
                                  <path fill-rule="evenodd" clip-rule="evenodd" d="M15.7585 6.70945C15.834 5.65214 14.9224 4.80451 13.8865 4.92423C12.8265 5.04674 11.1907 5.20898 10.0004 5.20898C8.81013 5.20898 7.17436 5.04674 6.11433 4.92423C5.07839 4.80451 4.16685 5.65214 4.24237 6.70945L4.95631 16.7047C5.01043 17.4624 5.5748 18.103 6.34928 18.2194C7.17979 18.3443 8.7037 18.5438 10.0014 18.5423C11.2831 18.5408 12.8132 18.3422 13.6474 18.2184C14.4232 18.1034 14.9904 17.4623 15.0447 16.7024L15.7585 6.70945ZM14.0778 6.57988C14.0807 6.57955 14.0829 6.57974 14.0829 6.57974L14.0851 6.58025C14.087 6.58089 14.0899 6.58241 14.0928 6.58513C14.0947 6.58693 14.0961 6.58913 14.0961 6.58913L14.096 6.5907L13.383 16.5728C12.5574 16.6948 11.1425 16.8743 9.99945 16.8757C8.84399 16.877 7.4378 16.6972 6.61792 16.5744L5.9048 6.5907L5.90474 6.58913C5.90474 6.58913 5.90616 6.58693 5.90806 6.58513C5.91093 6.58241 5.91384 6.58089 5.91569 6.58025L5.91789 6.57974C5.91789 6.57974 5.92011 6.57955 5.923 6.57988C6.9849 6.7026 8.70495 6.87565 10.0004 6.87565C11.2959 6.87565 13.0159 6.7026 14.0778 6.57988Z" fill="#475367"/>
                                </svg>
                                <span className={css.remove}>{intl.formatMessage({id: 'Dashboard.removeImage'})}</span>
                              </div>
                            </div>
                          }
                      </div>
                      <p className={css.cover_desc}>{intl.formatMessage({id: 'Dashboard.theCoverImage'})}</p>
                      <input 
                            id='file' 
                            name='file' 
                            type='file' 
                            hidden
                            ref={fileInput}
                            onChange={handleChange}
                        />


                    </div>

                    <div className={css.what_happen}>
                      <h1 className={css.header}>{intl.formatMessage({id: 'Dashboard.whatHappenNext'})}</h1>
                      <ol>
                        <li>
                          <span>{intl.formatMessage({id: 'Dashboard.youMustUpdate'})}</span>
                          <p>
                            {intl.formatMessage({id: 'Dashboard.makeSureTo'})}
                          </p>
                        </li>
                        <li>
                          <span>{intl.formatMessage({id: 'Dashboard.review'})}</span>
                          <p>
                            {intl.formatMessage({id: 'Dashboard.ourTeamWill'})}
                          </p>
                        </li>
                      </ol>
                    </div>
                  
                    <div className={classNames(css.base_btns)}>
                        <button onClick={handleHideForm} className={css.btn_1}>{intl.formatMessage({id: 'CategoriesForm.close'})}</button>
                        <div>
                            <button onClick={handleMoveToCatalog} className={css.btn_prev}>{intl.formatMessage({id: 'CategoriesForm.previous'})}</button>
                            <button onClick={handlePublish} className={css.btn_next_publish} disabled={uploadInProgress}> 
                              {uploadInProgress?
                                <CircularProgress size={20} sx={{ color: 'white'}}/>
                              :""}
                                {intl.formatMessage({id: 'Dashboard.publish'})}
                              </button>
                        </div>
                    </div>
                </div>

            :
            <div className={css.formContent}>
                    <ProgressTopbar step={intl.formatMessage({id: 'Dashboard.step1Of4'})} percentage={"60%"}/>
                    <TopTab activeTab={"publish"} subHeader={subHeader} instruction={instruction} handleChangeTab={handleChangeTab}/>

                    <div className={css.profile_completion}>
                        <div className={css.flex_row_start}>
                          <div className={css.alert_con}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                              <path fill-rule="evenodd" clip-rule="evenodd" d="M2.20545 11.2851L6.41289 3.43637C7.08216 2.18788 8.91784 2.18788 9.58711 3.43637L13.7946 11.2851C14.4164 12.4451 13.5517 13.8333 12.2074 13.8333H3.79256C2.44828 13.8333 1.58363 12.4451 2.20545 11.2851ZM8 4.5C8.36819 4.5 8.66667 4.79848 8.66667 5.16667V9.83333C8.66667 10.2015 8.36819 10.5 8 10.5C7.63181 10.5 7.33333 10.2015 7.33333 9.83333V5.16667C7.33333 4.79848 7.63181 4.5 8 4.5ZM7.16667 11.6667C7.16667 12.1269 7.53976 12.5 8 12.5C8.46024 12.5 8.83333 12.1269 8.83333 11.6667C8.83333 11.2064 8.46024 10.8333 8 10.8333C7.53976 10.8333 7.16667 11.2064 7.16667 11.6667Z" fill="#DD900D"/>
                            </svg>
                          </div>
                            
                            <div className={css.flex_col}>
                                <span className={css.header}>{intl.formatMessage({id:'Dashboard.pleaseFillAll'})}</span>
                                <p>{intl.formatMessage({id:'Dashboard.weAreUnable'})}</p>
                            </div>
                        </div>
                      
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.87571 4.6972C5.55028 4.37177 5.02264 4.37177 4.6972 4.6972C4.37177 5.02264 4.37177 5.55028 4.6972 5.87571L8.82199 10.0005L4.6972 14.1253C4.37177 14.4507 4.37177 14.9784 4.6972 15.3038C5.02264 15.6292 5.55028 15.6292 5.87571 15.3038L10.0005 11.179L14.1253 15.3038C14.4507 15.6292 14.9784 15.6292 15.3038 15.3038C15.6292 14.9784 15.6292 14.4507 15.3038 14.1253L11.179 10.0005L15.3038 5.87571C15.6292 5.55028 15.6292 5.02264 15.3038 4.6972C14.9784 4.37177 14.4507 4.37177 14.1253 4.6972L10.0005 8.82199L5.87571 4.6972Z" fill="black"/>
                        </svg>

                    </div>

                    <div className={css.what_happen}>
                      <h1 className={css.header}>{intl.formatMessage({id:'Dashboard.whatHappenedNext'})}</h1>
                      <ol>
                        <li>
                          <span>{intl.formatMessage({id:'Dashboard.youMustUpdateYour'})}</span>
                          <p>
                            {intl.formatMessage({id:'Dashboard.makeSureTo'})}
                          </p>
                        </li>
                        <li>
                          <span>{intl.formatMessage({id:'Dashboard.review'})}</span>
                          <p>
                            {intl.formatMessage({id:'Dashboard.ourTeamWill'})}
                          </p>
                        </li>
                      </ol>
                    </div>
                  
                    <div className={classNames(css.base_btns)}>
                        <button onClick={handleHideForm} className={css.btn_1}>{intl.formatMessage({id: 'CategoriesForm.close'})}</button>
                        <div>
                            <button onClick={e=>{handleMoveToServiceDescription(e,currentListing)}} className={css.btn_prev}>{intl.formatMessage({id: 'CategoriesForm.previous'})}</button>
                            <button onClick={handleMoveToCatalog} className={css.btn_next} disabled>{intl.formatMessage({id: 'CategoriesForm.saveAndContinue'})}</button>

                        </div>
                    </div>
                </div>
          }
    
    </>
          
         
    )
}

export default Publish;