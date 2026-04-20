import React, { useEffect, useState } from "react";
import css from './EntertainersForm.module.css';
import ProgressTopbar from "../../ProgressTopBar/ProgressTopbar";
import classNames from "classnames";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import TopTab from "../../TopTab";
import InputIncrementDecrement from "../../../../../components/CustomComponent/InputIncrementDecrement";
import SelectComponent from "../../../../../components/CustomComponent/SelectComponent";
import { FormattedMessage, useIntl } from '../../../../../util/reactIntl';
const { types } = require('sharetribe-flex-sdk');
const { Money } = types;

const RentalShadeForm = props =>{
     const intl = useIntl();
    const {
      handleMoveToServiceDescription,
      handleMoveToCatalog,
      setShowCreateListing,
      selectedSubCategory,
      onUpdateListing,
      currentListing,
      handleChangeTab,
      updatedListing,
      setCurrentListing,
      handleHideForm
    } = props;
    const attributes = currentListing?.attributes;
    const {publicData={},price}= currentListing.hasOwnProperty("attributes")?currentListing?.attributes:{};
    const [serviceType,setServiceType] = useState(publicData.hasOwnProperty("serviceType")?publicData.serviceType:[]);
    const [serviceStandards,setServiceStandards] = useState(publicData.hasOwnProperty("serviceStandards")?publicData.serviceStandards:[]);
    const [pricee,setPrice] = useState(price?.amount!==undefined?price.amount/100:"");
    const [priceChange,setPriceChange] = useState(false);
    const [workExperience,setWorkExperience] = useState(publicData.workExperience);
    const [maxAmountOfGuest,setMaxAmountOfGuest] = useState(publicData.maxAmountOfGuest);
    
    const [minDuration,setMinDuration] = useState(publicData.minDuration);
    const [maxDuration,setMaxDuration] = useState(publicData.maxDuration);
    const [description, setDescription] = useState(attributes !== undefined?attributes.description:"");

    const [timeFormatMin, setTimeFormatMin] = useState(publicData?.timeFormatMin?publicData?.timeFormatMin:"Hour");
    const [timeFormatMax, setTimeFormatMax] = useState(publicData?.timeFormatMax?publicData?.timeFormatMax:"Hour");

    const isReady = !serviceType || !serviceStandards || !pricee   || !minDuration || !maxDuration;

    useEffect(()=>{
              if(updatedListing !== undefined && JSON.stringify(updatedListing) !== "{}" ){
                setCurrentListing(updatedListing.data);
              }
            },[updatedListing]);
    
    const serviceTypes = [
      intl.formatMessage({id: 'CategoriesForm.tents',}),
      intl.formatMessage({id: 'CategoriesForm.canopies',}),
      intl.formatMessage({id: 'CategoriesForm.umbrellas',}),
      intl.formatMessage({id: 'CategoriesForm.rainCovers',})
    ];

   const ServiceStandards = [
      'willProvide',
      'willOrganize',
      'willBeOnTime',
      'willBackup'
    ];

const handleChangePrice = e =>{
  setPrice(e.target.value);
  setPriceChange(true);
}

const handleSubmit = e=>{
  //console.log("submiting");
   if(JSON.stringify(currentListing) !== "{}"){
      const priceVal = {amount:parseInt(pricee)*100,currency:"EUR"};
      const data = {
          id:currentListing.id,
          price: priceVal,
          title:description,
          description,
          publicData:{
            originalPrice: priceVal,
            description,
            serviceType,
            serviceStandards,
            minDuration,
            maxDuration,
            //maxAmountOfGuest,
            timeFormatMin,
            timeFormatMax,
            workExperience
          },
        }
        onUpdateListing(data,"");
        //console.log("Form submitted");
    }
  handleMoveToCatalog();
}


const subHeader = intl.formatMessage({id: 'CategoriesForm.addMoreDetails',});
const instruction = intl.formatMessage({id: 'CategoriesForm.qaSection',});
    return (

       <div className={css.formContent}>
          <div className={css.close_btn} onClick={e=>setShowCreateListing(false)}>
                                    <svg className={css.close_icon} xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
                                        <path d="M2.05086 1.13616C1.66033 0.745631 1.02717 0.74563 0.636643 1.13616C0.246119 1.52668 0.246119 2.15984 0.636643 2.55037L5.58639 7.50012L0.636643 12.4499C0.246119 12.8404 0.246119 13.4736 0.636643 13.8641C1.02717 14.2546 1.66033 14.2546 2.05086 13.8641L7.0006 8.91433L11.9504 13.8641C12.3409 14.2546 12.974 14.2546 13.3646 13.8641C13.7551 13.4736 13.7551 12.8404 13.3646 12.4499L8.41482 7.50012L13.3646 2.55037C13.7551 2.15984 13.7551 1.52668 13.3646 1.13616C12.974 0.745631 12.3409 0.745631 11.9504 1.13616L7.0006 6.0859L2.05086 1.13616Z" fill="black"/>
                                    </svg>
                                </div>
          <form className={css.container} onSubmit={handleSubmit}>
            
                <ProgressTopbar step={intl.formatMessage({ id: 'Dashboard.step2of3' })} percentage={"30%"}/>
                <TopTab activeTab={"about"} subHeader={subHeader} instruction={instruction} handleChangeTab={handleChangeTab}/>
                <div>
                    <h1 className={classNames(css.header_2,"mb-2")}> {intl.formatMessage({id: 'CategoriesForm.serviceDescription',})}</h1>
                    <p className={css.marg_btm_1}> {intl.formatMessage({id: 'CategoriesForm.shortDescription',})}</p>
                    <textarea className={css.text_area} type="text" name="description" onChange={e=>{setDescription(e.target.value)}} value={description} placeholder={intl.formatMessage({id: 'CategoriesForm.writeHere',})}/>
                </div>
                <div>
                  <h1 className={css.header_2}>{intl.formatMessage({id: 'CategoriesForm.serviceType',})}</h1>
                  <div className={css.check_con}>

                    <FormGroup>

                      {serviceTypes.map((itm,key)=>{
                        return (
                                <FormControlLabel className={css.form_check} control={
                                  <Checkbox 
                                    className={css.no_padding}
                                     onChange={e=>{
                                        if(e.target.checked){
                                          setServiceType([...serviceType,itm]);
                                        }else{
                                          const remaining = serviceType.filter((i)=>i!==itm);
                                          setServiceType([...remaining]);
                                        }
                                    }}
                                    checked={serviceType?.includes(itm)}
                                    sx={{
                                      color: "#e7e7e7",
                                      '&.Mui-checked': {
                                        color: "#F56630",
                                      },
                                      '& .MuiSvgIcon-root': { fontSize: 24 },
                                      display:"flex",
                                      flexDirection:"column",
                                      justifyContent:"flex-start",
                                      alignItems:"flex-start",
                                      alignSelf:"flex-start",
                                      padding:0,
                                      paddingLeft:1,
                                      gap:20

                                    }}
                                />} 
                                label={
                                  <div className={css.space_btm}>
                                    {itm}
                                  </div>
                                 
                                }
                                />
                              )
                      })}
                    </FormGroup>

                  </div>
                </div>
               
               
                 <div>
                  <h1 className={css.header_2}>{intl.formatMessage({id: 'CategoriesForm.durationOfService',})}</h1>
                  <p className={classNames(css.no_spacing,"pb-2")}>{intl.formatMessage({id: 'CategoriesForm.setMinAndMaxDuration',})}</p>
                  <div className={css.flex_row}>
                    <div className={css.width_50}>
                      <label>{intl.formatMessage({id: 'CategoriesForm.minDuration',})}</label>
                       <div className={css.flex_row_select}>
                          <input className={classNames(css.textInput)} type="number" min={1} onChange={e=>{setMinDuration(e.target.value)}} value={minDuration} 
                          placeholder={intl.formatMessage({id: 'CategoriesForm.setMinDuration',})}
                        />
                           <SelectComponent options={[
                          intl.formatMessage({id: 'CategoriesForm.hour',}),
                          intl.formatMessage({id: 'CategoriesForm.minutes',}),
                          intl.formatMessage({id: 'CategoriesForm.days',})
                        ]} 
                          value={timeFormatMin} handleSelectChange={e=>setTimeFormatMin(e)}/>
                        </div>
                    </div>
                    <div className={css.width_50}>
                      <label>{intl.formatMessage({id: 'CategoriesForm.maxDuration',})}</label>
                      <div className={css.flex_row_select}>
                          <input className={classNames(css.textInput)} type="number" min={1} onChange={e=>{setMaxDuration(e.target.value)}} value={maxDuration} 
                            placeholder={intl.formatMessage({id: 'CategoriesForm.maxDuration',})}
                          />
                            <SelectComponent options={[
                          intl.formatMessage({id: 'CategoriesForm.hour',}),
                          intl.formatMessage({id: 'CategoriesForm.minutes',}),
                          intl.formatMessage({id: 'CategoriesForm.days',})
                        ]} 
                          value={timeFormatMax} handleSelectChange={e=>setTimeFormatMax(e)}/>
                        </div>
                    
                    </div>
                  </div>
                </div>
                 <div>
                  <h1 className={css.header_2}>{intl.formatMessage({id: 'CategoriesForm.serviceStandard',})}</h1>
                  <div className={css.check_con}>
                    <FormGroup>
                      {ServiceStandards.map((itm,key)=>{
                        return (
                                <FormControlLabel className={css.form_check} control={
                                  <Checkbox 
                                    className={css.no_padding}
                                    onChange={e=>{
                                        if(e.target.checked){
                                          setServiceStandards([...serviceStandards,itm]);
                                        }else{
                                          const remaining = serviceStandards.filter((i)=>i!==itm);
                                          setServiceStandards([...remaining]);
                                        }
                                    }}
                                    checked={serviceStandards?.includes(itm)}
                                    sx={{
                                      color: "#e7e7e7",
                                      '&.Mui-checked': {
                                        color: "#F56630",
                                      },
                                      '& .MuiSvgIcon-root': { fontSize: 24 },
                                      display:"flex",
                                      flexDirection:"column",
                                      justifyContent:"flex-start",
                                      alignItems:"flex-start",
                                      alignSelf:"flex-start",
                                      padding:0,
                                      paddingLeft:1,
                                      gap:20

                                    }}
                                />} 
                                label={
                                  <div className={css.space_btm}>
                                    {intl.formatMessage({ id: `CategoriesForm.${itm}` })}
                                  </div>
                                 
                                }
                                />
                              )
                      })}
                    </FormGroup>

                  </div>
                </div>
                  <div>
                    <h1 className={css.header_2}>{intl.formatMessage({id: 'CategoriesForm.price'})}</h1>
                    <p className={classNames(css.no_spacing,"pb-2")}>{intl.formatMessage({id: 'CategoriesForm.setTheMinPrice'})}</p>
                    <div className={css.flex_row}>
                      <div className={css.width_50}>
                        <label>Min price order</label>
                         <div className={css.money_con}>
                                                <span>€</span>
                                                <input type="number" min={1} onChange={handleChangePrice}  value={pricee} placeholder={intl.formatMessage({id: 'CategoriesForm.setMinPrice'})} />
                                              </div>
                      </div>
                    </div>
                  </div>

                {/* <div>
                    <label className={css.label_header}>Maximum amount of guests</label>
                    <input className={classNames(css.textInput)} type="number" min={1} onChange={e=>{setMaxAmountOfGuest(e.target.value)}} value={maxAmountOfGuest} placeholder="Add the maximum amount of guests" />
                </div> */}
               <div>
                  <label labelFor="work_experience" className={classNames(css.header_2,"mb-1")}>{intl.formatMessage({id: 'CategoriesForm.workExperience'})}</label>
                  <InputIncrementDecrement setWorkExperience={setWorkExperience} workExperience={workExperience} />
                </div>


                <div className={classNames(css.base_btns,css.desktop)}>
                    <button onClick={handleHideForm} className={css.btn_1}>{intl.formatMessage({id: 'CategoriesForm.close'})}</button>
                    <div>
                        <button onClick={e=>{handleMoveToServiceDescription(e,currentListing)}} className={css.btn_prev}>{intl.formatMessage({id: 'CategoriesForm.previous'})}</button>
                        <button onClick={handleSubmitValues} className={css.btn_next} disabled={isReady}>{intl.formatMessage({id: 'CategoriesForm.saveAndContinue'})}</button>
                    </div>
                </div>
                <div className={classNames(css.base_btns,css.mobile)}>
                    <button onClick={e=>{handleMoveToServiceDescription(e,currentListing)}} className={css.btn_prev}>{intl.formatMessage({id: 'CategoriesForm.previous'})}</button>
                    <button onClick={handleSubmitValues} className={css.btn_next} disabled={isReady}>{intl.formatMessage({id: 'CategoriesForm.saveAndContinue'})}</button>
                </div>
                  
            </form>
        </div>
        
    )
}

export default RentalShadeForm;