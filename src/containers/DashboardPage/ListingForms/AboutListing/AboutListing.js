import React, { useEffect, useState } from "react";
import css from './AboutListing.module.css';
import ProgressTopbar from "../ProgressTopBar/ProgressTopbar";
import classNames from "classnames";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import TopTab from "../TopTab";
import EntertainersForm from "./CategoriesForms/EntertainersForm";
import CakesForm from "./CategoriesForms/CakesForm";
import PhotographyForm from "./CategoriesForms/PhotographyForm";
import VideographyForm from "./CategoriesForms/VideographyForm";
import ClassicalMusicForm from "./CategoriesForms/ClassicalMusicForm";
import PartyDjForm from "./CategoriesForms/PartyDjForm";
import RentalSpaceForm from "./CategoriesForms/RentalSpaceForm";
import RentalShadeForm from "./CategoriesForms/RentalShadeForm";
import CateringForm from "./CategoriesForms/CateringForm";
import DecorationsForm from "./CategoriesForms/DecorationsForm";
import SweetsForm from "./CategoriesForms/SweetsForm";
import RentalBouncerForm from "./CategoriesForms/RentalBouncerForm";
const { types } = require('sharetribe-flex-sdk');
const { Money } = types;

const AboutListing = props =>{

    const {handleMoveToServiceDescription,handleMoveToCatalog,setShowCreateListing,selectedSubCategory,
            onCreateListingDraft,
            currentListing,
            onUpdateListing,
            updatedListing,
            handleChangeTab,
            forceUpdate,
            setCurrentListing,
            updateListingSuccess
    } = props;

    console.log(selectedSubCategory);

    const [currentTab,setCurrentTab] = useState("start");
    const serviceTypes = [
      "Photo booth",
      "Portrait photography",
      "Wedding photography",
      "Event photography  (birthdays, corporate events, etc.)",
      "Commercial photography (advertising, branding)",
      "Product photography (for online stores)",
      "Family photography",
      "Newborn and child photography",
      "Fashion photography",
      "Studio photography",
      "Outdoor photography",
      "Real estate photography",
      "Model portfolio photography"
    ];

    const ServiceStandards = [
      "Service provider will provide all equipment needed",
      "Service provider  will organize personalized consultation to understand client’s vision, theme, and budget",
      "Service provider  will be on-time for setup and dismantling",
      "Service provider  will backup plans in case of weather",
    ];

    const EquipmentProvided = [
      "Camera",
      "Phone",
      "Drone",
    ];

    const PhotoVideo = [
      "USB",
      "DVD",
      "Online link",
      "Hardcopy(paper)"
    ];
    

const handleMoveToStart = e=>{
  setCurrentTab("start");
}

const handleMoveToAboutService = e=>{
  setCurrentTab("about");
}

const handleMoveToPublish = e=>{
  setCurrentTab("publish");
}


const handleHideForm = e=>{
  
  setShowCreateListing(false);
 
}

    return (

      <>
        {selectedSubCategory === "Animation" || selectedSubCategory === "Magic" || selectedSubCategory === "Face Paint" ?
          <EntertainersForm handleMoveToServiceDescription={handleMoveToServiceDescription} handleMoveToCatalog={handleMoveToCatalog}
            onCreateListingDraft={onCreateListingDraft}
            currentListing={currentListing}
            onUpdateListing={onUpdateListing}
            handleChangeTab={handleChangeTab}
            updatedListing={updatedListing}
            setCurrentListing={setCurrentListing}
            updateListingSuccess={updateListingSuccess}
            forceUpdate={forceUpdate}
            handleHideForm={handleHideForm}
            setShowCreateListing={setShowCreateListing}
          />
        :selectedSubCategory === "BD Cake"?
          <CakesForm 
           handleMoveToServiceDescription={handleMoveToServiceDescription} 
           handleMoveToCatalog={handleMoveToCatalog}
           currentListing={currentListing}
           onUpdateListing={onUpdateListing}
           handleChangeTab={handleChangeTab}
           updatedListing={updatedListing}
           setCurrentListing={setCurrentListing}
           updateListingSuccess={updateListingSuccess}
           handleHideForm={handleHideForm}
           setShowCreateListing={setShowCreateListing}
           />
        :selectedSubCategory === "Sweets"?
          <SweetsForm 
           handleMoveToServiceDescription={handleMoveToServiceDescription} 
           handleMoveToCatalog={handleMoveToCatalog}
           currentListing={currentListing}
           onUpdateListing={onUpdateListing}
           handleChangeTab={handleChangeTab}
           updatedListing={updatedListing}
           setCurrentListing={setCurrentListing}
           updateListingSuccess={updateListingSuccess}
           handleHideForm={handleHideForm}
           setShowCreateListing={setShowCreateListing}
           />
        :selectedSubCategory === "Photographer"?
          <PhotographyForm
            handleMoveToServiceDescription={handleMoveToServiceDescription}
            handleMoveToCatalog={handleMoveToCatalog} 
            currentListing={currentListing}
            onUpdateListing={onUpdateListing}
            handleChangeTab={handleChangeTab}
            updatedListing={updatedListing}
            setCurrentListing={setCurrentListing}
            updateListingSuccess={updateListingSuccess}
            handleHideForm={handleHideForm}
            setShowCreateListing={setShowCreateListing}
            />
        :selectedSubCategory === "Videographer"?
          <VideographyForm 
            handleMoveToServiceDescription={handleMoveToServiceDescription} 
            handleMoveToCatalog={handleMoveToCatalog}
            currentListing={currentListing}
            onUpdateListing={onUpdateListing}
            handleChangeTab={handleChangeTab}
            updatedListing={updatedListing}
            setCurrentListing={setCurrentListing}
            updateListingSuccess={updateListingSuccess}
            handleHideForm={handleHideForm}
            setShowCreateListing={setShowCreateListing}
            />
        :selectedSubCategory === "Classical music"?
          <ClassicalMusicForm
            handleMoveToServiceDescription={handleMoveToServiceDescription}
            handleMoveToCatalog={handleMoveToCatalog}
            currentListing={currentListing}
            onUpdateListing={onUpdateListing}
            handleChangeTab={handleChangeTab}
            updatedListing={updatedListing}
            setCurrentListing={setCurrentListing}
            updateListingSuccess={updateListingSuccess}
            handleHideForm={handleHideForm}
            setShowCreateListing={setShowCreateListing}
            />
        :selectedSubCategory === "Party Music/DJs"?
          <PartyDjForm
            handleMoveToServiceDescription={handleMoveToServiceDescription}
            handleMoveToCatalog={handleMoveToCatalog}
            currentListing={currentListing}
            onUpdateListing={onUpdateListing}
            handleChangeTab={handleChangeTab}
            updatedListing={updatedListing}
            setCurrentListing={setCurrentListing}
            updateListingSuccess={updateListingSuccess}
            handleHideForm={handleHideForm}
            setShowCreateListing={setShowCreateListing}
            />
        :selectedSubCategory === "Rental shade and rain equipment"?
          <RentalShadeForm
            handleMoveToServiceDescription={handleMoveToServiceDescription}
            handleMoveToCatalog={handleMoveToCatalog}
            currentListing={currentListing}
            onUpdateListing={onUpdateListing}
            handleChangeTab={handleChangeTab}
            updatedListing={updatedListing}
            setCurrentListing={setCurrentListing}
            updateListingSuccess={updateListingSuccess}
            handleHideForm={handleHideForm}
            setShowCreateListing={setShowCreateListing}
            />
        :selectedSubCategory === "Rental space"?
          <RentalSpaceForm 
            handleMoveToServiceDescription={handleMoveToServiceDescription}
            handleMoveToCatalog={handleMoveToCatalog}
            currentListing={currentListing}
            onUpdateListing={onUpdateListing}
            handleChangeTab={handleChangeTab}
            updatedListing={updatedListing}
            setCurrentListing={setCurrentListing}
            updateListingSuccess={updateListingSuccess}
            handleHideForm={handleHideForm}
            setShowCreateListing={setShowCreateListing}
            />
        :selectedSubCategory === "Rental bouncer"?
          <RentalBouncerForm
            handleMoveToServiceDescription={handleMoveToServiceDescription}
            handleMoveToCatalog={handleMoveToCatalog}
            currentListing={currentListing}
            onUpdateListing={onUpdateListing}
            handleChangeTab={handleChangeTab}
            updatedListing={updatedListing}
            setCurrentListing={setCurrentListing}
            updateListingSuccess={updateListingSuccess}
            handleHideForm={handleHideForm}
            setShowCreateListing={setShowCreateListing}
            />
        :selectedSubCategory === "Balloon decoration" || selectedSubCategory === "Flower arrangements" || selectedSubCategory === "Themed decoration"?
          <DecorationsForm 
            handleMoveToServiceDescription={handleMoveToServiceDescription}
            handleMoveToCatalog={handleMoveToCatalog}
            currentListing={currentListing}
            onUpdateListing={onUpdateListing}
            handleChangeTab={handleChangeTab}
            updatedListing={updatedListing}
            setCurrentListing={setCurrentListing}
            updateListingSuccess={updateListingSuccess}
            handleHideForm={handleHideForm}
            setShowCreateListing={setShowCreateListing}
            />
        :selectedSubCategory === "Catering"?
          <CateringForm 
            handleMoveToServiceDescription={handleMoveToServiceDescription}
            handleMoveToCatalog={handleMoveToCatalog}
            currentListing={currentListing}
            onUpdateListing={onUpdateListing}
            handleChangeTab={handleChangeTab}
            updatedListing={updatedListing}
            setCurrentListing={setCurrentListing}
            updateListingSuccess={updateListingSuccess}
            handleHideForm={handleHideForm}
            setShowCreateListing={setShowCreateListing}
            />
        :
        ""}
      </>
      
    )
}

export default AboutListing;