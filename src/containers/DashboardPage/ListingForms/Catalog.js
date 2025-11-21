import React, { useEffect, useRef, useState } from "react";
import css from './Catalog.module.css';
import TopTab from "./TopTab";
import ProgressTopbar from "./ProgressTopBar/ProgressTopbar";
import classNames from "classnames";
import { Checkbox, FormControl, FormControlLabel } from "@mui/material";
import EditableSelectInput from "./EditableSelectInput";
import SimpleCard from "../SimpleCard/SimpleCard";
import { types as sdkTypes } from '../../../util/sdkLoader';
const { UUID } = sdkTypes;
import { v4 as uuidv4 } from 'uuid';
import SimpleFormCard from "../SimpleCard/SimpleFolderCard";
import SimpleItemCard from "../SimpleCard/SimpleItemCard";
import CatalogEdit from "./CatalogEdit";
import { NamedLink } from "../../../components";

const Catalog = props =>{

  const ACTIONS = [
    "edit_catalog_details",
    "create_catalog_details",
    "edit_catalog_add_items",
    "create_catalog_add_items"
  ];

  let {
          onSetSelectedFile,
          setShowCreateListing,
          handleMoveToAboutService,
          handleMoveToPublish,
          onUpdateListing,
          currentListing,
          onImageUpload,
          image,
          uploadImageError,
          uploadInProgress,
          ownEntities,
          listings,
          setCurrentListing,
          history,
          showCatalogs,
          setCurrentCatalogData,
          currentCatalogdata,
          currentUser,
          lastAction,
          isUpdateItem,
          updatedListing,
          handleChangeTab,
          forceUpdate,
          onfetchCurrentData,
          getOwnListing,
          onFetchCurrentListing,
          updateListingInProgress,
          selectedFolderName, 
          setSelectedFolderName,
          path,
          updateInProgress,
          catalogName,
      } = props;

     const folderName = localStorage.getItem("folderName");

useEffect(()=>{
  
          if(path==="/profile-settings/catalog/new/:id"){
              setShowCreateCat(true);
          }else{
              setShowCreateCat(false);
          }
  
          if(path==="/profile-settings/catalog/edit/:id"){
             setShowEditCat(true);
          }else{
              setShowEditCat(false);
          }
  
          if(path==="/profile-settings/catalog/view/:id"){
              setCurrentTab("publish");
          }

          if(path==="/profile-settings/catalog/all/:id"){
              setShowExistingCat(true);
          }else{
            setShowExistingCat(false);
          }
             
},[path]);

  const imagesSaved = ownEntities!== undefined? ownEntities?.image:[];
  let img1 = "";
  let img2 = "";
  let img3 = "";
  let img4 = "";
  let img5 = "";
  const ownListing = ownEntities!== undefined? ownEntities?.ownListing:[];
  const [currentTab,setCurrentTab] = useState("start");
  // const [img1,setImg1] = useState("start");
  // const [img2,setImg2] = useState("start");
  // const [img3,setImg3] = useState("start");
  // const [img4,setImg4] = useState("start");
  // const [img5,setImg5] = useState("start");


const getFolder = data=>{
  let result = [];
  if(data === undefined || data.length === 0){
    return [];
  }
  data.map((itm,key)=>{
    if(!result.includes(itm.folder)){
      result.push(itm.folder);
    }
    
  });
  return result;
}
    
  const {publicData={},price}= updatedListing !== undefined && JSON.stringify(updatedListing) !== "{}"? updatedListing.data.attributes:currentListing?.hasOwnProperty("attributes")?currentListing?.attributes:{};
  const [catalog,setCatalog] = useState(publicData?.catalog);
  const [folders,setFolders] = useState(catalog !== undefined?getFolder(catalog):[]);
  const [listingType,setListingType] = useState(publicData?.listingType);

  //Set setCurrentCatalogData when a catalog is clicked
  const [currentCatDropdownOption,setCurrentCatDropdownOption] = useState(currentCatalogdata?.folder);
  const [itemName,setItemName] = useState(currentCatalogdata?.itemName);
  const [minQuantity,setMinQuantity] = useState(currentCatalogdata?.minQuantity?currentCatalogdata?.minQuantity:"");
  const [pricee,setPrice] = useState(currentCatalogdata?.price);
  const [description,setDescription] = useState(currentCatalogdata?.description);
  const [unitQuantity,setUnitQuantity] = useState(currentCatalogdata?.unitQuantity?currentCatalogdata?.unitQuantity:"");
  const [metric,setMetric] = useState(currentCatalogdata?.metric?currentCatalogdata?.metric:"");
  const [showEditCat,setShowEditCat] = useState(false);
  const [showCreateCat,setShowCreateCat] = useState(false);
  const [showExistingCat,setShowExistingCat] = useState(false);
  const [showStartCat,setShowStartCat] = useState(true);
  const [newCatalogId,setNewCatalogId] = useState("");
  const [categoryId,setCategoryId] = useState("");
  const lstingId = localStorage.getItem("currentListing");
  const [showItemDetailsForm,setShowItemDetailsForm] = useState(false);
  const [enableCatalogName,setEnableCatalogName] = useState(true);
  

    let img1Id = "";
    let img2Id = "";
    let img3Id = "";
    let img4Id = "";
    let img5Id = "";

  const getImageUrl = (data,imgNum) =>{
    let url = "";
    if(data !== undefined){
       data.map((itm,key)=>{
        if(itm.imgNum === imgNum){
          url = itm.imgUrl;
        }
      });
    }
    return url;
  }

  if(JSON.stringify(currentCatalogdata) !== "{}"){
      const catalogImages = currentCatalogdata?.catalogImages;
      img1 = getImageUrl(catalogImages,"1");
      img2 = getImageUrl(catalogImages,"2");
      img3 = getImageUrl(catalogImages,"3");
      img4 = getImageUrl(catalogImages,"4");
      img5 = getImageUrl(catalogImages,"5");
    }

   //const [selectedFolderName, setSelectedFolderName] = useState("");

  const [currentCatalog,setCurrentCatalog] = useState( catalog !== undefined && catalog.hasOwnProperty("length") && catalog.length > 0?"show_existing_catalog":"start_catalog");
  const [imageSrc1,setImageSrc1] = useState(img1);
  const [imageSrc2,setImageSrc2] = useState(img2);
  const [imageSrc3,setImageSrc3] = useState(img3);
  const [imageSrc4,setImageSrc4] = useState(img4);
  const [imageSrc5,setImageSrc5] = useState(img5);
  const fileInput = useRef(null);
  const fileInput1 = useRef(null);
  const fileInput2 = useRef(null);
  const fileInput3 = useRef(null);
  const fileInput4 = useRef(null);
  const fileInput5 = useRef(null);
  const [images,setUploadedImages] = useState([]);
  const [timeFormatMin,setTimeFormatMin] = useState("");
  const [durationPrice, setDurationPrice] = useState([{}]);
  const [usePriceByDuration,setUsePriceByDuration] = useState(false);
  const [catalogImages, setCatalogImages] = useState(currentCatalogdata.catalogImages);

  const getCurrentCatalogCoverPhoto = (imgArr,folderName)=>{
      let cover = "";
      imgArr !== undefined && imgArr.map((itm,key)=>{
        if(itm.folderName === folderName){
          cover = itm.imgUrl;
        }
      })
      return cover;
  }

let img = "";
 if(JSON.stringify(currentListing) !== "{}" && JSON.stringify(ownEntities) !== "{}"){
    const {coverPhoto="",catalog=[],coverImages=[]} = currentListing?.attributes?.publicData?currentListing?.attributes?.publicData:{};
    const folderName = localStorage.getItem("folderName");
    img = getCurrentCatalogCoverPhoto(coverImages,folderName);
 }

  const [imageSrc,setImageSrc] = useState(img);
  
  const durationPriceIsReady = durationPrice.length > 0 && durationPrice[0].price !== 0;
  const isReady = !(itemName && (!pricee || !durationPriceIsReady) && description && (imageSrc1 || imageSrc2 || imageSrc3 || imageSrc4 || imageSrc5));
 
  useEffect(()=>{
    if(currentCatDropdownOption !== undefined){
      console.log("Changing dropdownlist");
      //setSelectedFolderName(currentCatDropdownOption);
    }

    if(image !== null && image.hasOwnProperty("imageId") && image.imageId !== undefined){
      setUploadedImages([...images,image]);
    }

    // if(currentListing !== undefined){
    //   const {publicData={},price}= currentListing.hasOwnProperty("attributes")?currentListing?.attributes:{};
    //   setCatalog(publicData?.catalog);
    //   setFolders(publicData?.folders);
    // }
    //forceUpdate();
  },[image,uploadInProgress,currentListing,currentCatalogdata,lastAction,isUpdateItem]);

  useEffect(()=>{
    console.log(lastAction);
    if(lastAction === "update_and_goto_existing_listing_1" || lastAction === "update_and_goto_existing_listing_2"){

      if(updatedListing){
        setCurrentListing(updatedListing.data);
      }
      console.log(currentListing);
      let catalog = updatedListing?.data?.attributes?.publicData?.catalog;
      let listingTyp = updatedListing?.data?.attributes?.publicData?.listingType;
      const folder = getFolder(catalog);
      ownEntities.image = getImagesIncluded(updatedListing.included);
      if(catalog !== undefined && folder !== undefined){
        setCatalog(catalog);
        setFolders(folder);
        setListingType(listingTyp);
        console.log(ownEntities);
        console.log(updatedListing);
        setShowItemDetailsForm(false);
        console.log(showEditCat,"    lllllllllllllllllllllllllll")
        //setCurrentCatalog("create_new_catalog");
      }

     }else if(lastAction === "update_and_goto_existing_listing_3"){

      if(updatedListing){
        setCurrentListing(updatedListing.data);
      }
      console.log(currentListing);
      let catalog = updatedListing?.data?.attributes?.publicData?.catalog;
      let listingTyp = updatedListing?.data?.attributes?.publicData?.listingType;
      const folder = getFolder(catalog);
      ownEntities.image = getImagesIncluded(updatedListing.included);
      if(catalog !== undefined && folder !== undefined){
        setCatalog(catalog);
        setFolders(folder);
        setListingType(listingTyp);
        console.log(ownEntities);
        console.log(updatedListing);
        setShowItemDetailsForm(false);
         console.log(showEditCat,"    lllll2222222222lllll")
        //setCurrentCatalog("create_new_catalog");
      }

     }

    //  if(lastAction === "update_and_goto_existing_listing"){
    //   setCurrentCatalog("show_existing_catalog");
    //  }
   
  },[lastAction]);


  useEffect(()=>{
    if(currentCatalog === "edit_catalog"){
      setShowEditCat(true);
    }else{
      setShowEditCat(false);
    }

    if(currentCatalog === "create_new_catalog"){
      setNewCatalogId(uuidv4());
      setItemName("");
      setMinQuantity("");
      setPrice("");
      setDescription("");
      setUnitQuantity("");
      setMetric("");

      setImageSrc1("");
      setImageSrc2("");
      setImageSrc3("");
      setImageSrc4("");
      setImageSrc5("");

      //setCurrentCatalogData({});
      setShowCreateCat(true);
    }else{
      setShowCreateCat(false);
    }

    if(currentCatalog === "show_existing_catalog"){
      setShowExistingCat(true);
    }else{
      setShowExistingCat(false);
    }

    if(currentCatalog === "start_catalog"){
      setShowStartCat(true);
    }else{
      setShowStartCat(false);
    }

  },[currentCatalog])


  useEffect(()=>{
      const currentListingId = localStorage.getItem("currentListing");
      onFetchCurrentListing(new UUID(currentListingId),"");
  },[currentCatalog]);

  useEffect(()=>{
    console.log("Listing updated  " , lastAction);
  },[updatedListing]);

  const getImagesIncluded = included=>{
    let result = [];
    if(included !== undefined){
      included.map((itm,k)=>{
        if(itm.type === "image"){
          result[itm.id.uuid] = itm;
        }
      })
    }
    return result;
  };

  const getUpdatedCurrentListing = (listings,id)=>{
    let result = {};
    if(listings !== undefined){
       listings.map((itm,key)=>{
        if(itm.id.uuid === id){
          result = itm;
        }
      })
    }
    return result;
  }

  // useEffect(()=>{
  //   console.log("Changes detected");
  //   if(currentListing !== undefined){
  //     const temp = currentListing;
  //     let {publicData={},price}= currentListing?.hasOwnProperty("attributes")?currentListing?.attributes:{};
  //     const updated = getUpdatedCurrentListing(listings,currentListing.id.uuid);
  //     publicData.catalog = updated.attributes.publicData.catalog;
  //     temp.publicData = publicData;
  //     setCurrentListing(temp);
  //   }
   
  // },[listings])
    
const handleMoveToStart = e=>{
  setCurrentTab("start");
}
const handleMoveToServiceDescription = e=>{
  setCurrentTab("service_description");
}

const handleMoveToCatalog = e=>{
  setCurrentTab("catalog");
}

const handleHideForm = e=>{

  setShowCreateListing(false);
  
}

const handleAddItem = e=>{
  localStorage.removeItem("folderName");
  localStorage.setItem("action",ACTIONS[1]);//"create_catalog_details",
  console.log("clicked");
  setCurrentCatalog("create_new_catalog");
}

const handleAddNewItem = ()=>{
  setItemName("");
  setMinQuantity("");
  setPrice("");
  setDescription("");
  
  setCurrentCatDropdownOption("");

  setImageSrc1("");
  setImageSrc2("");
  setImageSrc3("");
  setImageSrc4("");
  setImageSrc5("");
  setDurationPrice([{}]);
  setUsePriceByDuration(false);
  setShowItemDetailsForm(true);
}

const handleCreateNewItem = folderName=>{
  //forceUpdate();
  setShowItemDetailsForm(false);
  setCurrentCatalog("create_new_catalog");
  localStorage.setItem("action",ACTIONS[1]);
  localStorage.removeItem("folderName");
}

const subHeader = "Create a catalog";
const instruction = "Create a catalog to showcase the different service options you offer, making it easier for customers to explore and choose what suits them best. You can add multiple service packages, pricing tiers, and special offers.";

const handleSelectChange = e=>{
  console.log(e.target.value);
}

const getNewCatalogData = ()=>{
  const {attributes} = updatedListing === undefined || JSON.stringify(updatedListing) === "{}"?currentListing:updatedListing.data;
  const {publicData} = attributes;
   let catalogSaved = publicData?.catalog === undefined?[]:publicData?.catalog;
    let existingCatalog = catalogSaved.filter(itm=>itm.itemName === itemName);
    catalogSaved = catalogSaved.filter(itm=>itm.itemName !== itemName);

    const catalogImages =  existingCatalog.length > 0 && existingCatalog[0].hasOwnProperty("catalogImages")?existingCatalog[0].catalogImages:[];
    const folderName = localStorage.getItem("folderName");

      return (
        {
              id:lstingId,
              publicData:{
                            catalog:[
                                      ...catalogSaved,
                                      {
                                        listingId:lstingId,
                                        categoryId:newCatalogId,
                                        folder:folderName,
                                        itemName,
                                        minQuantity,
                                        ItemPrice:pricee,
                                        durationPrice:durationPrice,
                                        description,
                                        unitQuantity,
                                        metric,
                                        catalogImages
                                      }
                                    ]
                          },
        }
  )
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
      const folderName = localStorage.getItem("folderName");
      onImageUpload({ id: tempId, file ,listingId:currentListing.id, isCoverPhoto:true,folderName:folderName});
    }
    
  }
}

const handleChange1 = (event)=>{
  if(event.target.files && event.target.files[0]){
    let reader = new FileReader();
    reader.onload = (e) =>{
      setImageSrc1(e.target.result);
    }
    const file = event.target.files[0];
    //onSetSelectedFile(event.target.files[0]);
    reader.readAsDataURL(event.target.files[0]);

    if (file != null) {
      const tempId = `${file.name}_${Date.now()}`;
      const newCatData = getNewCatalogData();
      let itemNam = currentCatalogdata.hasOwnProperty("itemName")?currentCatalogdata.itemName:itemName;
      // if(itemNam === undefined || itemNam === ""){
      //   itemNam = document.getElementById("itemName")?.value;
      // }

      onImageUpload({ id: tempId, file,listingId:lstingId,imgNum:"1",catalogId:"",catalog,newCatData,itemName:itemName});
    }
    onSetSelectedFile(event.target.files[0]);
  }
}
const handleChange2 = (event)=>{
  if(event.target.files && event.target.files[0]){
    let reader = new FileReader();
    reader.onload = (e) =>{
      setImageSrc2(e.target.result);
    }
     const file = event.target.files[0];
    //onSetSelectedFile(event.target.files[0]);
    reader.readAsDataURL(event.target.files[0]);

    if (file != null) {
      const tempId = `${file.name}_${Date.now()}`;
      const newCatData = getNewCatalogData();
       let itemNam = currentCatalogdata.hasOwnProperty("itemName")?currentCatalogdata.itemName:itemName;
      // if(itemNam === undefined || itemNam === ""){
      //  itemNam = document.getElementById("itemName")?.value;
      // }

      onImageUpload({ id: tempId, file,listingId:lstingId,imgNum:"2",catalogId:"",catalog,newCatData,itemName:itemName});
    }
    onSetSelectedFile(event.target.files[0]);
  }
}
const handleChange3 = (event)=>{
  if(event.target.files && event.target.files[0]){
    let reader = new FileReader();
    reader.onload = (e) =>{
      setImageSrc3(e.target.result);
    }
    const file = event.target.files[0];
    //onSetSelectedFile(event.target.files[0]);
    reader.readAsDataURL(event.target.files[0]);

    if (file != null) {
      const tempId = `${file.name}_${Date.now()}`;
      const newCatData = getNewCatalogData();
       let itemNam = currentCatalogdata.hasOwnProperty("itemName")?currentCatalogdata.itemName:itemName;
      // if(itemNam === undefined || itemNam === ""){
      //   itemNam = document.getElementById("itemName")?.value;
      // }
   
      onImageUpload({ id: tempId, file,listingId:lstingId,imgNum:"3",catalogId:"",catalog,newCatData,itemName:itemName});
    }
    onSetSelectedFile(event.target.files[0]);
  }
}
const handleChange4 = (event)=>{
  if(event.target.files && event.target.files[0]){
    let reader = new FileReader();
    reader.onload = (e) =>{
      setImageSrc4(e.target.result);
    }
     const file = event.target.files[0];
    //onSetSelectedFile(event.target.files[0]);
    reader.readAsDataURL(event.target.files[0]);

    if (file != null) {
      const tempId = `${file.name}_${Date.now()}`;
      const newCatData = getNewCatalogData();
      let itemNam = currentCatalogdata.hasOwnProperty("itemName")?currentCatalogdata.itemName:itemName;
      // if(itemNam === undefined || itemNam === ""){
      //   itemNam = document.getElementById("itemName")?.value;
      // }
     
      onImageUpload({ id: tempId, file,listingId:lstingId,imgNum:"1",catalogId:"",catalog,newCatData,itemName:itemName});
    }
    onSetSelectedFile(event.target.files[0]);
  }
}
const handleChange5 = (event)=>{
  if(event.target.files && event.target.files[0]){
    let reader = new FileReader();
    reader.onload = (e) =>{
      setImageSrc5(e.target.result);
    }
     const file = event.target.files[0];
    //onSetSelectedFile(event.target.files[0]);
    reader.readAsDataURL(event.target.files[0]);

    if (file != null) {
      const tempId = `${file.name}_${Date.now()}`;
      const newCatData = getNewCatalogData();
      let itemNam = currentCatalogdata.hasOwnProperty("itemName")?currentCatalogdata.itemName:itemName;
      // if(itemNam === undefined || itemNam === ""){
      //   itemNam = document.getElementById("itemName")?.value;
      // }
      
      onImageUpload({ id: tempId, file,listingId:lstingId,imgNum:"1",catalogId:"",catalog,newCatData,itemName:itemName});
    }
    onSetSelectedFile(event.target.files[0]);
  }
}

const handleFileClick = (e)=>{
    fileInput.current.click();
}
const handleFileClick1 = ()=>{
    fileInput1.current.click();
  }
const handleFileClick2 = ()=>{
    fileInput2.current.click();
  }
const handleFileClick3 = ()=>{
    fileInput3.current.click();
  }
const handleFileClick4 = ()=>{
    fileInput4.current.click();
  }
const handleFileClick5 = ()=>{
    fileInput5.current.click();
    console.log("5 clicked");
  }

const getImageIdsArray = images =>{
    let result = [];
    images.map((itm,key)=>{
      result.push(itm.imageId.uuid);
    })
    return result;
}

const getImageIdArrays = images=>{
  const result = [];
  if(images !== undefined){
    images.map((itm,key)=>{
      result.push(itm.id);
    })
  }
  
  return result;
}

const handleAddListing = (e,action)=>{
  console.log("Fetching listing")
  e.preventDefault();
  e.stopPropagation();
  //Save CatalogName and coverPhoto
  const currentListingId = localStorage.getItem("currentListing");
  console.log("Fetching listing");
  const data = getNewCatalogData();
  onUpdateListing(data,"update_and_goto_existing_listing_2") && onFetchCurrentListing(new UUID(currentListingId),"update_and_goto_existing_listing_1");
}
const handleSaveListing = e =>{
  localStorage.removeItem("folderName");
  setCurrentCatalog("show_existing_catalog");
}

const handleSubmit = e =>{
 handleMoveToPublish();
}

const getImgUrl = (imgs,imgNum)=>{
  let url = "";
  if(imgs === undefined){
    return "";
  }
  imgs.map((itm,key)=>{
    if(itm.imgNum === imgNum){
      url = itm.imgUrl;
    }
  });
  return url;
}

const handleEditCatalog = catalogData =>{
  // //Set the current catalogData for Editting
  // localStorage.setItem("folderName",catalogData.folder);
  const {durationPrice =[]} = catalogData;
  
  const isDurationPrice = durationPrice !== undefined && durationPrice.length > 0 && durationPrice[0].price !== undefined && durationPrice[0].price !== 0;
  console.log("============11111111111")
  setSelectedFolderName(catalogData.folder);
  setCurrentCatalogData(catalogData);
  setCategoryId(catalogData.categoryId);
  setItemName(catalogData.itemName);
  setMinQuantity(catalogData.minQuantity);
  setPrice(catalogData.ItemPrice);
  setDescription(catalogData.description);
  setUnitQuantity(catalogData.unitQuantity);
  setMetric(catalogData.metric);
  if(isDurationPrice){
    setUsePriceByDuration(true);
    setDurationPrice(durationPrice);
  }else{
    setUsePriceByDuration(false);
  }
 
  setCurrentCatDropdownOption(catalogData.folder);
  setImageSrc1(getImgUrl(catalogData.catalogImages,"1"));
  setImageSrc2(getImgUrl(catalogData.catalogImages,"2"));
  setImageSrc3(getImgUrl(catalogData.catalogImages,"3"));
  setImageSrc4(getImgUrl(catalogData.catalogImages,"4"));
  setImageSrc5(getImgUrl(catalogData.catalogImages,"5"));
   setShowItemDetailsForm(true);
}


const handleEditFolder = (e,folderName) =>{
  e.preventDefault();
  //Save the folderName in localstorage to be used during catalog editting
  localStorage.setItem("action",ACTIONS[0]);//catalog_details
  localStorage.setItem("folderName",folderName);
  if(JSON.stringify(updatedListing) !== "{}" && JSON.stringify(ownEntities) !== "{}"){
    const {coverPhoto="",catalog=[],coverImages=[]} = updatedListing?.data?.attributes?.publicData?updatedListing?.data?.attributes?.publicData:{};
    let img = getCurrentCatalogCoverPhoto(coverImages,folderName);
    setImageSrc(img);
  }

  console.log("zzzzzzzzzzzzzzzzzzzzzzzzzzzz")
  setShowItemDetailsForm(false);
  setCurrentCatalog("edit_catalog");
  setEnableCatalogName(false);

}

const handleRemoveImage = (e,imgId,imgToRemove)=>{
  e.preventDefault();
  e.stopPropagation();

  if(imgId === undefined || imgId === ""){
    if(imgToRemove === "1"){
      setImageSrc1("");
    }else if(imgToRemove === "2"){
      setImageSrc2("");
    }else if(imgToRemove === "3"){
      setImageSrc3("");
    }else if(imgToRemove === "4"){
      setImageSrc4("");
    }else if(imgToRemove === "5"){
      setImageSrc5("");
    }
    return;
  }

  const getUUID = data =>{
    let result = [];
    data.map((itm,k)=>{
      result.push(new UUID(itm.id.uuid));
    })
    return result;
  }

  //Remove needed image from the list of uploaded images
  const existingUploadedImage = currentListing?.relationships?.images.data;
  let existingUploadedImageRemain = existingUploadedImage.filter(itm=>itm.id.uuid !== imgId);
  existingUploadedImageRemain = getUUID(existingUploadedImageRemain);

  //Remove the need image fromthe list of existing catalog images
  const {images} = currentCatalogdata;
  const remainingImageIds = images.filter(itm=>itm !== imgId);

  //Update the list of images in current catalog
  currentCatalogdata.images = [...remainingImageIds];
  let catalogSaved = publicData?.catalog === undefined?[]:publicData?.catalog;

  catalogSaved = catalogSaved.filter(itm=>itm.categoryId !== imgId);

    let data = {};
        data = {
                  id:currentListing.id,
                  publicData:{
                                catalog:[
                                          ...catalogSaved,
                                         currentCatalogdata
                                        ]
                              },
                              images:existingUploadedImageRemain
                  };
  
    onUpdateListing(data,"update_and_goto_existing_listing_2");
}

const handleCreateNewInput = ()=>{
  const id = durationPrice.length + 1;
  const isOk = parseInt(durationPrice[durationPrice.length-1].price) !== 0;
  console.log(isOk);
  if(isOk){
    setDurationPrice([...durationPrice,{id:id}])
  }
  
}

const handleDurationChange = (itm,val)=>{

 durationPrice !== undefined && durationPrice !== null && durationPrice.length>0 && durationPrice.map((item,key)=>{
    const format = item.format;
    if(item.id === itm.id){
      item.duration = val;
      if(format === undefined || format === null || format === ""){
        item.format = "Hour";
      }
    }
  })
  console.log(durationPrice);
}

const handleFormatChange = (itm,val)=>{
 durationPrice !== undefined && durationPrice !== null && durationPrice.length>0 && durationPrice.map((item,key)=>{
    if(item.id === itm.id){
      item.format = val;
    }
  })
  console.log(durationPrice);
}

const handlePriceChange = (itm,val)=>{
 durationPrice !== undefined && durationPrice !== null && durationPrice.length>0 && durationPrice.map((item,key)=>{
    if(item.id === itm.id){
      item.price = val;
    }
  })

  console.log(durationPrice);
}

const handleUsePriceChecked = ()=>{
  setUsePriceByDuration(!usePriceByDuration);
}

const getNumberOfItemsInFolder = (data,folderName)=>{
  let total = 0;
  data !== undefined && data.map((itm,key)=>{
    if(itm.folder === folderName){
      total+=1;
    }
  })
  return total;
}

const getCatalogCoverPhoto = (data,folderName)=>{
  let cover = "";
  data !== undefined && data.map((itm,key)=>{
    if(itm.folder === folderName){
      cover = itm.coverPhoto;
    }
  })
  return cover;
}

const getCatItems = (data,folderName)=>{
  let res = [];
  data !== undefined && data.map((itm,key)=>{
    if(itm.folder === folderName){
      res.push(itm);
    }
  })
  return res;
}


const handleDeletePriceDuration = (priceDurationData,itmToDelete,catalogDetails)=>{

  const remainingDurationPrice = priceDurationData.filter(itm=>itm.id !== itmToDelete.id);
  const {publicData} = updatedListing?.data?.attributes;
  let catalogSaved = publicData?.catalog === undefined?[]:publicData?.catalog;
  let remainingCatalog = [];
  catalogSaved.map((itm,key)=>{
    if(itm.folder !== catalogDetails.folder && itm.itemName !== catalogDetails.itemName){
      remainingCatalog.push(itm);
    }
  })
  //let remainingCatalog = catalogSaved.filter(itm=>itm.folder !== catalogDetails.folder && itm.itemName !== catalogDetails.itemName);

  //Edit the current catalog data
  let currentCatalogdata = catalogDetails;
  currentCatalogdata.durationPrice = remainingDurationPrice;

   let data = {};
        data = {
                  id:currentListing.id,
                  publicData:{
                                catalog:[
                                          ...remainingCatalog,
                                         currentCatalogdata
                                        ]
                              }
                  };
  
    onUpdateListing(data,"update_and_goto_existing_listing_3");
}

const handleSaveCatalogName = e =>{
  let catalogSaved = publicData?.catalog === undefined?[]:publicData?.catalog;
  const newCatalog = {
                        listingId:currentListing.id.uuid,
                        categoryId:newCatalogId,
                        folder:e.target.value,
  }
 let data = {};
        data = {
                  id:currentListing.id,
                  publicData:{
                                catalog:[
                                          ...catalogSaved,
                                          newCatalog
                                        ]
                              }
                  };
  
    onUpdateListing(data,"update_and_goto_existing_listing_3");
}

    return (
        <>
        <CatalogEdit
          showEditCat={showEditCat}
          setShowEditCat={setShowEditCat}
          css={css}
          subHeader={subHeader}
          instruction={instruction}
          handleChangeTab={handleChangeTab}
          showItemDetailsForm={showItemDetailsForm}
          selectedFolderName={folderName}
          setSelectedFolderName={setSelectedFolderName}
          setItemName={setItemName}
          itemName={itemName}
          description={description}
          setDescription={setDescription}
          pricee={pricee}
          setPrice={setPrice}
          handleUsePriceChecked={handleUsePriceChecked}
          usePriceByDuration={usePriceByDuration}
          durationPrice={durationPrice}
          handleCreateNewInput={handleCreateNewInput}
          imageSrc={imageSrc}
          imageSrc1={imageSrc1}
          imageSrc2={imageSrc2}
          imageSrc3={imageSrc3}
          imageSrc4={imageSrc4}
          imageSrc5={imageSrc5}
          handleChange1={handleChange1}
          handleChange2={handleChange2}
          handleChange3={handleChange3}
          handleChange4={handleChange4}
          handleChange5={handleChange5}
          handleFileClick={handleFileClick}
          handleFileClick1={handleFileClick1}
          handleFileClick2={handleFileClick2}
          handleFileClick3={handleFileClick3}
          handleFileClick4={handleFileClick4}
          handleFileClick5={handleFileClick5}
          handleAddListing={handleAddListing}
          isReady={isReady}
          handleHideForm={handleHideForm}
          getCatItems={getCatItems}
          handleMoveToAboutService={handleMoveToAboutService}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          fileInput={fileInput}
          fileInput1={fileInput1}
          fileInput2={fileInput2}
          fileInput3={fileInput3}
          fileInput4={fileInput4}
          fileInput5={fileInput5}
          folders={folders}
          catalog={catalog}
          handleRemoveImage={handleRemoveImage}
          handleEditCatalog={handleEditCatalog}
          ownEntities={ownEntities}
          handleAddNewItem={handleAddNewItem}
          handleDurationChange={handleDurationChange}
          handlePriceChange={handlePriceChange}
          handleFormatChange={handleFormatChange}
          handleDeletePriceDuration={handleDeletePriceDuration}
          handleSaveListing={handleSaveListing}
          handleSaveCatalogName={handleSaveCatalogName}
          enableCatalogName={enableCatalogName}
          updateInProgress={updateInProgress}
          uploadInProgress={uploadInProgress}
        />
            
          {showExistingCat?
              <div className={css.formContent_done}>
                 <div className={css.close_btn} onClick={e=>setShowCreateListing(false)}>
                    <svg className={css.close_icon} xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
                        <path d="M2.05086 1.13616C1.66033 0.745631 1.02717 0.74563 0.636643 1.13616C0.246119 1.52668 0.246119 2.15984 0.636643 2.55037L5.58639 7.50012L0.636643 12.4499C0.246119 12.8404 0.246119 13.4736 0.636643 13.8641C1.02717 14.2546 1.66033 14.2546 2.05086 13.8641L7.0006 8.91433L11.9504 13.8641C12.3409 14.2546 12.974 14.2546 13.3646 13.8641C13.7551 13.4736 13.7551 12.8404 13.3646 12.4499L8.41482 7.50012L13.3646 2.55037C13.7551 2.15984 13.7551 1.52668 13.3646 1.13616C12.974 0.745631 12.3409 0.745631 11.9504 1.13616L7.0006 6.0859L2.05086 1.13616Z" fill="black"/>
                    </svg>
                </div>
                  <ProgressTopbar step={"Step 2 of 3"} percentage={"60%"}/>
                  <TopTab activeTab={"catalog"} subHeader={subHeader} instruction={instruction} handleChangeTab={handleChangeTab}/>
                  <div className={css.action_con} >
                      <button className={css.create_new_btn} onClick={e=>{handleCreateNewItem("Create new folder")}}>Create new folder</button>
                      <button className={css.import_btn} >
                        Import catalog
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M13.9229 11.4219L10.5896 14.7553C10.2641 15.0807 9.73651 15.0807 9.41107 14.7553L6.07774 11.4219C5.7523 11.0965 5.7523 10.5689 6.07774 10.2434C6.40317 9.91799 6.93081 9.91799 7.25625 10.2434L9.16699 12.1542V2.49935C9.16699 2.03911 9.54009 1.66602 10.0003 1.66602C10.4606 1.66602 10.8337 2.03911 10.8337 2.49935V12.1542L12.7444 10.2434C13.0698 9.91799 13.5975 9.91799 13.9229 10.2434C14.2484 10.5689 14.2484 11.0965 13.9229 11.4219Z" fill="#CC400C"/>
                          <path d="M3.33366 14.5827C3.33366 14.1224 2.96056 13.7493 2.50033 13.7493C2.04009 13.7493 1.66699 14.1224 1.66699 14.5827V15.8327C1.66699 17.6736 3.15938 19.166 5.00033 19.166H15.0003C16.8413 19.166 18.3337 17.6736 18.3337 15.8327V14.5827C18.3337 14.1224 17.9606 13.7493 17.5003 13.7493C17.0401 13.7493 16.667 14.1224 16.667 14.5827V15.8327C16.667 16.7532 15.9208 17.4993 15.0003 17.4993H5.00033C4.07985 17.4993 3.33366 16.7532 3.33366 15.8327V14.5827Z" fill="#CC400C"/>
                        </svg>
                      </button>
                  </div>
                  <div className={css.grid_con}>
                    {folders !== undefined && folders.length > 0 && folders.map((folder,key)=>{
                        const numberOfItems = getNumberOfItemsInFolder(catalog,folder);

                          let img = "";
                          if(JSON.stringify(updatedListing) !== "{}" && JSON.stringify(ownEntities) !== "{}"){
                              const {coverPhoto="",catalog=[],coverImages=[]} = updatedListing?.data?.attributes?.publicData?updatedListing?.data?.attributes?.publicData:{};
                              img = getCurrentCatalogCoverPhoto(coverImages,folder);
                          }

                        const cover = img;
                        return(
                                <SimpleFormCard key={`catalog_card ${key}`} numberOfItems={numberOfItems} coverPhoto={cover} folderName={folder} handleEditCatalog={handleEditFolder} />
                            )
                      })}
                  </div>
                  
                  

                  <div className={css.base_btns}>
                    <button onClick={handleHideForm} className={css.btn_1}>Close</button>
                    <div>
                        <button onClick={handleMoveToAboutService} className={css.btn_prev}>Previous</button>
                        <button onClick={handleSubmit} className={css.btn_next}>Save and continue</button>
                    </div>
                  </div>


              </div>:""}
          {showStartCat?
              <div className={css.formContent}>
                 <div className={css.close_btn} onClick={e=>setShowCreateListing(false)}>
                      <svg className={css.close_icon} xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
                          <path d="M2.05086 1.13616C1.66033 0.745631 1.02717 0.74563 0.636643 1.13616C0.246119 1.52668 0.246119 2.15984 0.636643 2.55037L5.58639 7.50012L0.636643 12.4499C0.246119 12.8404 0.246119 13.4736 0.636643 13.8641C1.02717 14.2546 1.66033 14.2546 2.05086 13.8641L7.0006 8.91433L11.9504 13.8641C12.3409 14.2546 12.974 14.2546 13.3646 13.8641C13.7551 13.4736 13.7551 12.8404 13.3646 12.4499L8.41482 7.50012L13.3646 2.55037C13.7551 2.15984 13.7551 1.52668 13.3646 1.13616C12.974 0.745631 12.3409 0.745631 11.9504 1.13616L7.0006 6.0859L2.05086 1.13616Z" fill="black"/>
                      </svg>
                  </div>
                  <ProgressTopbar step={"Step 2 of 3"} percentage={"60%"}/>
                  <TopTab activeTab={"catalog"} subHeader={subHeader} instruction={instruction} handleChangeTab={handleChangeTab}/>
                  <div className={css.box_con} onClick={handleAddItem}>
                    <h2 className={css.header}>Add bookable items to your catalog and group them into folders </h2>
                    <div className={css.listing_box}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                        <path d="M13.5 4C13.5 3.44772 13.0523 3 12.5 3C11.9477 3 11.5 3.44772 11.5 4V11H4.5C3.94772 11 3.5 11.4477 3.5 12C3.5 12.5523 3.94772 13 4.5 13H11.5V20C11.5 20.5523 11.9477 21 12.5 21C13.0523 21 13.5 20.5523 13.5 20V13H20.5C21.0523 13 21.5 12.5523 21.5 12C21.5 11.4477 21.0523 11 20.5 11H13.5V4Z" fill="#404040"/>
                      </svg>
                      <p className={css.full_width}>Create your first item</p>
                    </div>
                  </div>
                  <div className={classNames(css.base_btns)}>
                      <button onClick={handleHideForm} className={css.btn_1}>Close</button>
                      <div>
                          <button onClick={e=>{handleMoveToAboutService(currentListing)}} className={css.btn_prev} >Previous</button>
                          <button onClick={handleSubmit} className={css.btn_next}>Save and continue</button>
                      </div>
                  </div>
              </div>:""}
               <CatalogEdit
                showEditCat={showCreateCat}
                css={css}
                subHeader={subHeader}
                instruction={instruction}
                handleChangeTab={handleChangeTab}
                showItemDetailsForm={showItemDetailsForm}
                selectedFolderName={folderName}
                setSelectedFolderName={setSelectedFolderName}
                setItemName={setItemName}
                itemName={itemName}
                description={description}
                setDescription={setDescription}
                pricee={pricee}
                setPrice={setPrice}
                handleUsePriceChecked={handleUsePriceChecked}
                usePriceByDuration={usePriceByDuration}
                durationPrice={durationPrice}
                handleCreateNewInput={handleCreateNewInput}
                imageSrc={imageSrc}
                imageSrc1={imageSrc1}
                imageSrc2={imageSrc2}
                imageSrc3={imageSrc3}
                imageSrc4={imageSrc4}
                imageSrc5={imageSrc5}
                handleChange1={handleChange1}
                handleChange2={handleChange2}
                handleChange3={handleChange3}
                handleChange4={handleChange4}
                handleChange5={handleChange5}
                handleFileClick={handleFileClick}
                handleFileClick1={handleFileClick1}
                handleFileClick2={handleFileClick2}
                handleFileClick3={handleFileClick3}
                handleFileClick4={handleFileClick4}
                handleFileClick5={handleFileClick5}
                handleAddListing={handleAddListing}
                isReady={isReady}
                handleHideForm={handleHideForm}
                getCatItems={getCatItems}
                handleMoveToAboutService={handleMoveToAboutService}
                handleSubmit={handleSubmit}
                handleChange={handleChange}
                fileInput={fileInput}
                fileInput1={fileInput1}
                fileInput2={fileInput2}
                fileInput3={fileInput3}
                fileInput4={fileInput4}
                fileInput5={fileInput5}
                folders={folders}
                catalog={catalog}
                handleRemoveImage={handleRemoveImage}
                handleEditCatalog={handleEditCatalog}
                ownEntities={ownEntities}
                handleAddNewItem={handleAddNewItem}
                handleDurationChange={handleDurationChange}
                handlePriceChange={handlePriceChange}
                handleFormatChange={handleFormatChange}
                handleDeletePriceDuration={handleDeletePriceDuration}
                handleSaveListing={handleSaveListing}
                handleSaveCatalogName={handleSaveCatalogName}
                enableCatalogName={enableCatalogName}
                updateInProgress={updateInProgress}
                uploadInProgress={uploadInProgress}
              />
            
        </>
      
    )
}

export default Catalog;

