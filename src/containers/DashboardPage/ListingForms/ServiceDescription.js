import React, { useState } from "react";
import css from './ServiceDescription.module.css';
import classNames from "classnames";
import { FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";

const ServiceDescription = props=>{

     const {
      handleMoveToAboutService,
      handleMoveToStart,
      setShowCreateListing,
      selectedCategory,
      allCategories,
      selectedSubCategory,
      setSelectedSubCategory,
      onCreateListingDraft,
      currentListing,
      onUpdateListing,
      handleChangeTab,
    } = props;
     const attributes = currentListing?.attributes;
     const publicData = currentListing?.attributes?.publicData;
     const [currentTab,setCurrentTab] = useState("start");
     const [currRadioBtnCategory, setCurrRadioBtnCategory] = useState(publicData !== undefined?publicData.category:"");
     const [description, setDescription] = useState(attributes !== undefined?attributes.description:"");


     const isReady =  currRadioBtnCategory !== "" && description !== "";

     const handleChange = (event) => {
      setCurrRadioBtnCategory(event.target.value);
      setSelectedSubCategory(event.target.value);
    };

    const handleHideForm = e =>{
      setShowCreateListing(false);
      e.preventDefault();
    }

    const handleCreateDraftOrUpdateExisting = e =>{
      if(JSON.stringify(currentListing) !== "{}"){

        const data = {
          id:currentListing.id,
          title:description,
          description,
          publicData:{
            category:currRadioBtnCategory,
            listingType:selectedCategory,
          },
        }
        onUpdateListing(data);

      }else{
        const data = {
          title:description,
          description,
          publicData:{
            category:currRadioBtnCategory,
            listingType:selectedCategory,
            transactionProcessAlias:"default-booking/release-1",
            unitType:"hour"
          },
        }
        onCreateListingDraft(data, {})
      }
      console.log("switching");
      handleMoveToAboutService();
    }

    const subCategories = allCategories[selectedCategory];
    console.log(subCategories);

    return (
      <div className={css.formContent}>
            <div className={css.container}>
                  <div className={css.close_btn} onClick={e=>setShowCreateListing(false)}>
                      <svg className={css.close_icon} xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
                          <path d="M2.05086 1.13616C1.66033 0.745631 1.02717 0.74563 0.636643 1.13616C0.246119 1.52668 0.246119 2.15984 0.636643 2.55037L5.58639 7.50012L0.636643 12.4499C0.246119 12.8404 0.246119 13.4736 0.636643 13.8641C1.02717 14.2546 1.66033 14.2546 2.05086 13.8641L7.0006 8.91433L11.9504 13.8641C12.3409 14.2546 12.974 14.2546 13.3646 13.8641C13.7551 13.4736 13.7551 12.8404 13.3646 12.4499L8.41482 7.50012L13.3646 2.55037C13.7551 2.15984 13.7551 1.52668 13.3646 1.13616C12.974 0.745631 12.3409 0.745631 11.9504 1.13616L7.0006 6.0859L2.05086 1.13616Z" fill="black"/>
                      </svg>
                  </div>
                  <h1 className={css.header}>Create your listing</h1>
                  <div className={css.main_slider_con}>
                      <span>Step 1 of 4</span>
                      <div className={css.slider_con}>
                      <div className={css.slide}></div>
                      </div>
                      <div className={css.percent_con}>
                      <span className={css.percent}>25%</span>
                      </div>
                  </div>

                  <div className={css.form_body}>
                      <div className={css.tabs_con}>
                          
                          <span className={css.tab_item} onClick={e=>handleChangeTab(e,"about")}>About service</span>
                          <span className={css.tab_item} onClick={e=>handleChangeTab(e,"catalog")}>Catalog</span>
                          <span className={css.tab_item} onClick={e=>handleChangeTab(e,"publish")}>Publish</span>
                      </div>

                      <div className={css.sub_con}>
                          <h2 className={css.sub_header}>Listing creation guide:</h2>
                          <ul className={css.list}>
                              <li>This service listing should be focused on one specific sub category</li>
                              <li>Add detailed description</li>
                          </ul>
                      </div>
                      <div>
                          <h1 className={css.header_2}>Sub-category</h1>
                          <FormControl className={css.full_w}>
                            <RadioGroup

                              aria-labelledby="demo-radio-buttons-group-label"
                              defaultValue={selectedSubCategory}
                              name="radio-buttons-group"
                              value={currRadioBtnCategory}
                              onChange={handleChange}
                            >

                              {subCategories && subCategories.map((category,key)=>{

                                return(
                                  <FormControlLabel key={`radio ${category} ${key}`} className={css.no_spacing} value={category} control={
                                    <Radio
                                      sx={{
                                          color: "#F56630",
                                          '&.Mui-checked': {
                                            color: "#F56630",
                                          },
                                        }}
                                    className={classNames(css.no_spacing,css.radio)}/>} label={category} />
                                  )

                              })}
                            </RadioGroup>
                          </FormControl>
                      </div>

                      <div>
                          <h1 className={classNames(css.header_2,"mb-2")}>Service description</h1>
                          <p className={css.marg_btm_1}>Write a short description about yourself and the service you offer</p>
                          <textarea className={css.text_area} type="text" name="description" onChange={e=>{setDescription(e.target.value)}} value={description} placeholder="Write here"/>
                      </div>

                      <div className={css.base_btns}>
                          <button onClick={handleHideForm} className={css.btn_1}>Close</button>
                          <div>
                              <button onClick={handleMoveToStart} className={css.btn_prev} >Previous</button>
                              <button onClick={handleCreateDraftOrUpdateExisting} className={css.btn_next}
                                disabled={isReady?false:true}
                              >Save and continue</button>
                          </div>
                      </div>
                  </div>

                
              </div>
      </div>
        
    )

}

export default ServiceDescription;