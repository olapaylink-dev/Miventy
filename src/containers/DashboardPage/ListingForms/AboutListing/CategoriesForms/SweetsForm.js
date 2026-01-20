import React, { useEffect, useState } from "react";
import css from './EntertainersForm.module.css';
import ProgressTopbar from "../../ProgressTopBar/ProgressTopbar";
import classNames from "classnames";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import TopTab from "../../TopTab";
import InputIncrementDecrement from "../../../../../components/CustomComponent/InputIncrementDecrement";
const { types } = require('sharetribe-flex-sdk');
const { Money } = types;

const SweetsForm = props =>{

    const {handleMoveToServiceDescription,
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
    
    const [description, setDescription] = useState(attributes !== undefined?attributes.description:"");
    const [minWeight,setMinWeight] = useState(publicData.minWeight?publicData.minWeight:"");
    const [maxWeight,setMaxWeight] = useState(publicData.maxWeight?publicData.maxWeight:"");
    const [weightUnitMin,setWeighUnitMin] = useState(publicData?.weightUnitMin?publicData?.weightUnitMin:"");
    const [weightUnitMax, setWeighUnitMax] = useState(publicData?.weightUnitMax?publicData?.weightUnitMax:"");
    
    const isReady = !serviceType || !serviceStandards || !pricee  ;
    
    useEffect(()=>{
                  if(updatedListing !== undefined && JSON.stringify(updatedListing) !== "{}" ){
                    setCurrentListing(updatedListing.data);
                  }
                },[updatedListing]);
    
    const serviceTypes = [
      "Themed sweets (custom shapes: cars, animals, handbags, letters, numbers)",
      "Lactose-free sweets",
      "Gluten-free sweets",
      "Sugar-free sweets",
    ];

    const ServiceStandards = [
      "Service provider will provide all equipment needed",
      "Service provider  will organize personalized consultation to understand client’s vision, theme, and budget",
      "Service provider  will be on-time for setup and dismantling",
      "Service provider  will backup plans in case of weather",
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
            workExperience,
            
            // minWeight,
            // maxWeight,
            // weightUnitMin,
            // weightUnitMax
          },
        }
        onUpdateListing(data);
        //console.log("Form submitted");
    }
  handleMoveToCatalog();
}


const subHeader = "Add more details about the service for the clients to know";
const instruction = "The Q&A section will be visible to clients. This will help answer any questions, clients may have, before proceeding with a booking. Please, answer all the questions below.";

    return (

        <div className={css.formContent}>
           <div className={css.close_btn} onClick={e=>setShowCreateListing(false)}>
                                    <svg className={css.close_icon} xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
                                        <path d="M2.05086 1.13616C1.66033 0.745631 1.02717 0.74563 0.636643 1.13616C0.246119 1.52668 0.246119 2.15984 0.636643 2.55037L5.58639 7.50012L0.636643 12.4499C0.246119 12.8404 0.246119 13.4736 0.636643 13.8641C1.02717 14.2546 1.66033 14.2546 2.05086 13.8641L7.0006 8.91433L11.9504 13.8641C12.3409 14.2546 12.974 14.2546 13.3646 13.8641C13.7551 13.4736 13.7551 12.8404 13.3646 12.4499L8.41482 7.50012L13.3646 2.55037C13.7551 2.15984 13.7551 1.52668 13.3646 1.13616C12.974 0.745631 12.3409 0.745631 11.9504 1.13616L7.0006 6.0859L2.05086 1.13616Z" fill="black"/>
                                    </svg>
                                </div>
          <form className={css.container} onSubmit={handleSubmit}>
           
                <ProgressTopbar step={"Step 2 of 3"} percentage={"30%"}/>
                <TopTab activeTab={"about"} subHeader={subHeader} instruction={instruction} handleChangeTab={handleChangeTab}/>
                <div>
                    <h1 className={classNames(css.header_2,"mb-2")}>Service description</h1>
                    <p className={css.marg_btm_1}>Write a short description about yourself and the service you offer</p>
                    <textarea className={css.text_area} type="text" name="description" onChange={e=>{setDescription(e.target.value)}} value={description} placeholder="Write here"/>
                </div>
                <div>
                  <h1 className={css.header_2}>Service types</h1>
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
                                    }}
                                />} 
                                label={itm}
                                />
                              )
                      })}
                    </FormGroup>

                  </div>
                </div>
                <div>
                  <h1 className={css.header_2}>Service standards</h1>
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
                                    }}
                                />} 
                                label={itm}
                                />
                              )
                      })}
                    </FormGroup>

                  </div>
                </div>
{/*                
                <div>
                      <h1 className={css.header_2}>Weight</h1>
                      <p className={classNames(css.no_spacing,"pb-2")}>Set the minimum and maximum weight.</p>
                      <div className={css.flex_row}>
                        <div className={css.width_50}>
                          <label>Min order</label>
    
    
                          <div className={css.flex_row_select}>
                            <input type="number" min={1} onChange={e=>{setMaxWeight(e.target.value)}} value={maxWeight} placeholder="Set min order"  />
                            <select className={css.select} value={weightUnitMin} onChange={e=>setWeighUnitMin(e.target.value)}>
                              <option value="Kg">Kg</option>
                              <option value="Grams">Grams</option>
                              <option value="Pieces">Pieces</option>
                            </select>
                          </div>
    
    
    
                          
                        </div>
                        <div className={css.width_50}>
                          <label>Max order</label>
                          
                          <div className={css.flex_row_select}>
                            <input type="number" min={1} onChange={e=>{setMinWeight(e.target.value)}} value={minWeight} placeholder="Max order" />
                            <select className={css.select} value={weightUnitMax} onChange={e=>setWeighUnitMax(e.target.value)}>
                              <option value="Kg">Kg</option>
                              <option value="Grams">Grams</option>
                              <option value="Pieces">Pieces</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div> */}
               
                 <div>
                  <h1 className={css.header_2}>Price</h1>
                  <p className={classNames(css.no_spacing,"pb-2")}>Set the minimum price for your service.</p>
                  <div className={css.flex_row}>
                    <div className={css.width_50}>
                      <label>Min order price</label>
                       <div className={css.money_con}>
                                              <span>€</span>
                                              <input type="number" min={1} onChange={handleChangePrice}  value={pricee} placeholder="€ Set min price" />
                                            </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label labelFor="work_experience" className={classNames(css.header_2,"mb-1")}>Work experience</label>
                  <InputIncrementDecrement setWorkExperience={setWorkExperience} workExperience={workExperience} />
                </div>
                <div className={css.base_btns}>
                    <button onClick={handleHideForm} className={css.btn_1}>Close</button>
                    <div>
                        <button onClick={handleMoveToServiceDescription} className={css.btn_prev}>Previous</button>
                        <button type="submit" className={css.btn_next} disabled={isReady}>Save and continue</button>
                    </div>
                </div>
                  
            </form>
        </div>
        
    )
}

export default SweetsForm;