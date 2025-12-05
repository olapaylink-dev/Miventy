import React, { useEffect, useState } from "react";
import css from './CateringForm.module.css';
import ProgressTopbar from "../../ProgressTopBar/ProgressTopbar";
import classNames from "classnames";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import TopTab from "../../TopTab";
import InputIncrementDecrement from "../../../../../components/CustomComponent/InputIncrementDecrement";
const { types } = require('sharetribe-flex-sdk');
const { Money } = types;

const CateringForm = props =>{

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
    const [serviceMenuType,setServiceMenuType] = useState(publicData.hasOwnProperty("serviceMenuType")?publicData.serviceMenuType:[]);
    const [serviceType,setServiceType] = useState(publicData.hasOwnProperty("serviceType")?publicData.serviceType:[]);
    const [serviceStandards,setServiceStandards] = useState(publicData.hasOwnProperty("serviceStandards")?publicData.serviceStandards:[]);
    const [pricee,setPrice] = useState(price?.amount!==undefined?price.amount:"");
    const [workExperience,setWorkExperience] = useState(publicData.workExperience);
    
    const [extras,setExtras] = useState(publicData.hasOwnProperty("extras")?publicData.extras:[]);
    const [addonsPrice,setAddonsPrice] = useState(publicData?.addonsPrice);
    const [chairsPrice,setChairsPrice] = useState(publicData?.chairsPrice);
    const [tablesPrice,setTablesPrice] = useState(publicData?.tablesPrice);
    const [customOrdersPrice,setCustomOrdersPrice] = useState(publicData?.customOrdersPrice);
    const [serviceTypeBasicPrice,setServiceTypeBasicPrice] = useState(publicData?.serviceTypeBasicPrice);
    const [serviceTypeMediumPrice,setServiceTypeMediumPrice] = useState(publicData?.serviceTypeMediumPrice);
    const [serviceTypeProPrice,setServiceTypeProPrice] = useState(publicData?.serviceTypeProPrice);
    const [serviceTypeExtraPrice,setServiceTypeExtraPrice] = useState(publicData?.serviceTypeExtraPrice);
    const [maxAmountOfGuest,setMaxAmountOfGuest] = useState(publicData?.serviceTypeExtraPrice);

    const priceAdonsIsOk = addonsPrice || chairsPrice || tablesPrice || customOrdersPrice;
    const priceServiceIsOk = serviceTypeBasicPrice || serviceTypeMediumPrice || serviceTypeProPrice;
    const isReady = !serviceMenuType || !serviceType || !serviceStandards || !pricee ;
    const [description, setDescription] = useState(attributes !== undefined?attributes.description:"");

     useEffect(()=>{
              if(updatedListing !== undefined && JSON.stringify(updatedListing) !== "{}" ){
                setCurrentListing(updatedListing.data);
              }
            },[updatedListing]);
    

    const serviceMenuTypeLabel = [
        "A La Carte Menu:",
        "Fixed Menu:",
        "Both: A la carte and Fix menu",
    ];
    const serviceMenuTypeDescription = [
        "A La Carte MenuA menu where clients can select individual dishes from a list of menu. That allows clients to choose individual dishes from a list",
        "A pre-set menu that offers a specific selection of dishes at a set price. Clients can choose from various fixed menu options, which typically include a combination of appetizers, main courses, and desserts",
        "A menu that includes elements of both a la carte and fixed menus, offering clients the flexibility to select from a range of fixed dishes along with additional a la carte options."
    ];
    
    const serviceTypes = [
      "Basic:",
      "Medium:",
      "Pro:",
      "Extra:"
    ];

    const serviceTypesDescription = [
      "Food delivery only",
      "Food + table setting items",
      "Everything in Medium + food serving + cleanup",
      "Optional add-ons like chairs, tables or special requests."
    ];

    const ServiceStandards = [
      "Service provider will provide all equipment needed",
      "Service provider  will organize personalized consultation to understand client’s vision, theme, and budget",
      "Service provider  will be on-time for setup and dismantling",
      "Service provider  will backup plans in case of weather",
    ];

    const Extras = [
      "Add-ons",
      "Chairs",
      "Tables",
      "Custom orders"
    ];
    const ExtrasPair = [
      "Add-ons",
      "Chairs",
      "Tables",
      "Custom orders"
    ];
    
const handleSubmit = e=>{
  ////console.log("submiting");
   if(JSON.stringify(currentListing) !== "{}"){
      const data = {
          id:currentListing.id,
          price: new Money(parseInt(pricee),"EUR"),
           title:description,
           description,
          publicData:{
            description,
            serviceMenuType,
            serviceType,
            serviceTypeBasicPrice,
            serviceTypeMediumPrice,
            serviceTypeProPrice,
            serviceTypeExtraPrice,
            serviceStandards,
            extras,
            addonsPrice,
            chairsPrice,
            tablesPrice,
            customOrdersPrice,
            workExperience,
            maxAmountOfGuest
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
                  <h1 className={css.header_2}>Service menu type</h1>
                  <div className={css.check_con}>

                    <FormGroup>

                      {serviceMenuTypeLabel.map((itm,key)=>{
                        return (
                            <>
                                <FormControlLabel name={itm} className={css.form_check} control={
                                  <Checkbox 
                                    className={css.no_padding}
                                    onChange={e=>{
                                        if(e.target.checked){
                                          setServiceMenuType([...serviceMenuType,itm]);
                                        }else{
                                          const remaining = serviceMenuType.filter((i)=>i!==itm);
                                          setServiceMenuType([...remaining]);
                                        }
                                    }}
                                    checked={serviceMenuType?.includes(itm)}
                                    sx={{
                                      color: "#e7e7e7",
                                      '&.Mui-checked': {
                                        color: "#F56630",
                                      },
                                      '& .MuiSvgIcon-root': { fontSize: 24 },
                                    }}
                                />} 
                                label={itm}
                                /><br/>
                                <p className={css.padding_left}>{serviceMenuTypeDescription[key]}</p>
                            </>
                                
                              )
                      })}
                    </FormGroup>

                  </div>
                </div>
                
                <div>
                  <h1 className={css.header_2}>Service types</h1>
                  <div className={css.check_con}>

                    <FormGroup>

                      {serviceTypes.map((itm,key)=>{


// "Food delivery only",
//       "Food + table setting items",
//       "Everything in Medium + food serving + cleanup"

                                                let value = "";
                                                let label = "";
                                                if(itm === "Basic:"){
                                                  value = serviceTypeBasicPrice;
                                                  label = "Basic: Food delivery only"
                                                }else if(itm === "Medium:"){
                                                  value = serviceTypeMediumPrice;
                                                  label = "Medium: Food + table setting items"
                                                }else if(itm === "Pro:"){
                                                  value = serviceTypeProPrice;
                                                  label = "Pro: Everything in Medium + food serving + cleanup"
                                                }else if(itm === "Extra:"){
                                                  value = serviceTypeExtraPrice;
                                                  label = "Optional add-ons like chairs, tables or special requests"
                                                }

                                                
                        return (
                            <>
                                <FormControlLabel name={itm} className={css.form_check} control={
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
                                />
                            } 
                                label={label}
                                /><br/>
                                <input
                                  className={classNames(css.textInput,css.margin_left)}
                                  type="number"
                                  min={1}
                                  placeholder="€ Set min price"
                                  onChange={e=>{
                                                if(itm === "Basic:"){
                                                  setServiceTypeBasicPrice(e.target.value)
                                                }else if(itm === "Medium:"){
                                                  setServiceTypeMediumPrice(e.target.value)
                                                }else if(itm === "Pro:"){
                                                  setServiceTypeProPrice(e.target.value)
                                                }else if(itm === "Extra:"){
                                                  setServiceTypeExtraPrice(e.target.value)
                                                }
                                            }}
                                  value={value}
                                />

                            </>
                               
                              )
                      })}
                    </FormGroup>

                  </div>
                </div>
                <div>
                  <h1 className={css.header_2}>Maximum amount of guests</h1>
                  <p className={classNames(css.no_spacing,"pb-2")}>Set the maximum amount of guests you can offer your service for.</p>
                  <div>
                      <label className={css.label_header}>Maximum guests</label>
                      <input className={classNames(css.textInput)} type="number" min={1} onChange={e=>{setMaxAmountOfGuest(e.target.value)}} value={maxAmountOfGuest} placeholder="Max guests" />
                  </div>
                </div>
                <div>
                  <h1 className={css.header_2}>Service standards</h1>
                  <div className={css.check_con}>
                    <FormGroup>
                      {ServiceStandards.map((itm,key)=>{
                        return (
                                <FormControlLabel name={itm} className={css.form_check} control={
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
               
                <div>
                  <h1 className={css.header_2}>Price</h1>
                  <p className={classNames(css.no_spacing,"pb-2")}>Set the minimum price for your service.</p>
                  <div className={css.flex_row}>
                    <div className={css.width_50}>
                      <label>Min order price</label>
                       <div className={css.money_con}>
                                              <span>€</span>
                                              <input type="number" min={1} onChange={e=>{setPrice(e.target.value)}}  value={pricee} placeholder="€ Set min price" />
                                            </div>
                    </div>
                  </div>
                </div>

                {/* <div>
                  <h1 className={css.header_2}>Extras</h1>
                  <div className={css.check_con}>
                    <FormGroup>
                      {Extras.map((itm,key)=>{
                                                let value = "";
                                                if(itm === "Add-ons"){
                                                  value = addonsPrice;
                                                }else if(itm === "Chairs"){
                                                  value = chairsPrice;
                                                }else if(itm === "Tables"){
                                                  value = tablesPrice;
                                                }else if(itm === "Custom orders"){
                                                  value = customOrdersPrice;
                                                }

                        return (
                          <div className={css.flex_row_2}>
                                <FormControlLabel name={itm} className={css.form_check} control={
                                        <Checkbox 
                                            className={css.no_padding}
                                            onChange={e=>{
                                                 if(e.target.checked){
                                                      setExtras([...extras,itm]);
                                                    }else{
                                                      const remaining = extras.filter((i)=>i!==itm);
                                                      setExtras([...remaining]);
                                                    }
                                            }}
                                            checked={extras.includes(itm)}
                                            sx={{
                                              color: "#e7e7e7",
                                              '&.Mui-checked': {
                                                color: "#F56630",
                                              },
                                              '& .MuiSvgIcon-root': { fontSize: 24 },
                                            }}
                                        />
                                  } 
                                label={itm}
                                />
                                <input 
                                  className={classNames(css.textInput,css.margin_left,"my-1")} 
                                  onChange={e=>{
                                                if(itm === "Add-ons"){
                                                  setAddonsPrice(e.target.value)
                                                }else if(itm === "Chairs"){
                                                  setChairsPrice(e.target.value)
                                                }else if(itm === "Tables"){
                                                  setTablesPrice(e.target.value)
                                                }else if(itm === "Custom orders"){
                                                  setCustomOrdersPrice(e.target.value)
                                                }
                                            }}
                                  value={value} 
                                  type="number" 
                                  placeholder="€ Set price"/>
                                </div>
                              )
                      })}
                    </FormGroup>
                  </div>
                </div> */}
                
                
               
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

export default CateringForm;