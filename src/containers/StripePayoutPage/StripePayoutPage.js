import React, { useEffect, useReducer, useRef, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { useConfiguration } from '../../context/configurationContext';
import { useRouteConfiguration } from '../../context/routeConfigurationContext';
import { createResourceLocatorString } from '../../util/routes';
import { FormattedMessage, useIntl } from '../../util/reactIntl';
import { ensureCurrentUser } from '../../util/data';
import { propTypes } from '../../util/types';
import { isScrollingDisabled } from '../../ducks/ui.duck';
import {
  stripeAccountClearError,
  getStripeConnectAccountLink,
} from '../../ducks/stripeConnectAccount.duck';

import {
  H3,
  NamedRedirect,
  Page,
  StripeConnectAccountStatusBox,
  StripeConnectAccountForm,
  UserNav,
  LayoutSideNavigation,
  LayoutSingleColumn,
  NamedLink,
  ReviewRating,
} from '../../components';

import TopbarContainer from '../../containers/TopbarContainer/TopbarContainer';
import FooterContainer from '../../containers/FooterContainer/FooterContainer';

import { loadData, savePayoutDetails } from './StripePayoutPage.duck';

import css from './StripePayoutPage.module.css';
import css2 from './StripePayoutPage2.module.css';
import { hasPermissionToViewData, isUserAuthorized } from '../../util/userHelpers';
import { isErrorUserPendingApproval } from '../../util/errors';
import { Box, CircularProgress, FormControl, Rating, styled, Switch } from '@mui/material';
import classNames from 'classnames';
import Messages from '../DashboardPage/Messages';
import Earnings from '../DashboardPage/Earnings';
import Settings from '../DashboardPage/Settings';
import PaymentSetting from '../DashboardPage/PaymentSetting';
import NotificationSetting from '../DashboardPage/NotificationSettings';
import SelectMultipleComponent from '../../components/CustomComponent/SelectMultipleComponent';
import ListingMainForm from '../DashboardPage/ListingForms/ListingMainForm';
import OngoingPrders from '../DashboardPage/OngoingOrders';
import CompletedOrders from '../DashboardPage/CompletedOrders';
import CloseListingDialog from '../DashboardPage/CloseListingDialog';
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min';
import { updateProfile, uploadImage } from '../ProfileSettingsPage/ProfileSettingsPage.duck';
import { closeListing, getCurrentListing, requestCreateListingDraft, requestPublishListingDraft, requestUpdateListing } from '../EditListingPage/EditListingPage.duck';
import { fetchCurrentUserHasListings } from '../../ducks/user.duck';
import { getMarketplaceEntities } from '../../ducks/marketplaceData.duck';
import SearchMapNew from '../DashboardPage/SearchMapNew';
import list1 from '../../assets/images/list1.png';
import { loadDataDash } from '../DashboardPage/DashboardPage.duck';
import camera from '../../assets/avater2.png';
import SingleDatePicker from '../../components/DatePicker/DatePickers/SingleDatePicker';
import MyDatePicker from '../../components/MyDatePicker';
import OnGoingOrders from '../../components/CustomComponent/OnGoingOders';
import CompletedOrder from '../../components/CustomComponent/CompletedOrders';
import ALLOrders from '../../components/CustomComponent/AllOrders';
import { loadTransactions } from '../InboxPage/InboxPage.duck';

const MAX_MOBILE_SCREEN_WIDTH = 768;
const MIN_LENGTH_FOR_LONG_WORDS = 20;

const onImageUploadHandler = (values, fn) => {
  const { id, imageId, file ,listingId,isCoverPhoto,imgNum,catalogId,catalog,newCatData,itemName,folderName} = values;
  if (file) {
    fn({ id, imageId, file ,listingId,isCoverPhoto,imgNum,catalogId,catalog,newCatData,itemName,folderName});
  }
};

const STRIPE_ONBOARDING_RETURN_URL_SUCCESS = 'success';
const STRIPE_ONBOARDING_RETURN_URL_FAILURE = 'failure';
const STRIPE_ONBOARDING_RETURN_URL_TYPES = [
  STRIPE_ONBOARDING_RETURN_URL_SUCCESS,
  STRIPE_ONBOARDING_RETURN_URL_FAILURE,
];

// Create return URL for the Stripe onboarding form
const createReturnURL = (returnURLType, rootURL, routes) => {
  const path = createResourceLocatorString(
    'StripePayoutOnboardingPage',
    routes,
    { returnURLType },
    {}
  );
  const root = rootURL.replace(/\/$/, '');
  return `${root}${path}`;
};

// Get attribute: stripeAccountData
const getStripeAccountData = stripeAccount => stripeAccount.attributes.stripeAccountData || null;

// Get last 4 digits of bank account returned in Stripe account
const getBankAccountLast4Digits = stripeAccountData =>
  stripeAccountData && stripeAccountData.external_accounts.data.length > 0
    ? stripeAccountData.external_accounts.data[0].last4
    : null;

// Check if there's requirements on selected type: 'past_due', 'currently_due' etc.
const hasRequirements = (stripeAccountData, requirementType) =>
  stripeAccountData != null &&
  stripeAccountData.requirements &&
  Array.isArray(stripeAccountData.requirements[requirementType]) &&
  stripeAccountData.requirements[requirementType].length > 0;

// Redirect user to Stripe's hosted Connect account onboarding form
const handleGetStripeConnectAccountLinkFn = (getLinkFn, commonParams) => type => () => {
  getLinkFn({ type, ...commonParams })
    .then(url => {
      window.location.href = url;
    })
    .catch(err => console.error(err));
};

/**
 * StripePayoutPage component
 *
 * @component
 * @param {Object} props
 * @param {propTypes.currentUser} props.currentUser - The current user
 * @param {boolean} props.scrollingDisabled - Whether scrolling is disabled
 * @param {boolean} props.getAccountLinkInProgress - Whether the account link is in progress
 * @param {boolean} props.payoutDetailsSaveInProgress - Whether the payout details are in progress
 * @param {propTypes.error} props.createStripeAccountError - The create stripe account error
 * @param {propTypes.error} props.getAccountLinkError - The get account link error
 * @param {propTypes.error} props.updateStripeAccountError - The update stripe account error
 * @param {propTypes.error} props.fetchStripeAccountError - The fetch stripe account error
 * @param {Object} props.stripeAccount - The stripe account
 * @param {boolean} props.stripeAccountFetched - Whether the stripe account is fetched
 * @param {boolean} props.payoutDetailsSaved - Whether the payout details are saved
 * @param {Function} props.onPayoutDetailsChange - The function to handle the payout details change
 * @param {Function} props.onPayoutDetailsSubmit - The function to handle the payout details submit
 * @param {Function} props.onGetStripeConnectAccountLink - The function to handle the get stripe connect account link
 * @param {Object} props.params - The path params
 * @param {STRIPE_ONBOARDING_RETURN_URL_SUCCESS | STRIPE_ONBOARDING_RETURN_URL_FAILURE} props.params.returnURLType - The return URL type (success or failure)
 * @returns {JSX.Element}
 */
export const StripePayoutPageComponent = props => {
  const config = useConfiguration();
  const routes = useRouteConfiguration();
  const intl = useIntl();
  const {
    useCurrentUser,
    userShowError,
    user,
    onUpdateProfile,
    image,
    uploadImageError,
    uploadInProgress,
    onImageUpload,
    onCreateListingDraft,
    getOwnListing,
    listings,
    history,
    createListingDraftInProgress,
    createListingDraftError,
    submittedListingId,
    listingDraft,
    ownEntities,
    onUpdateListing,
    onPublishListingDraft,
    lastAction,
    isUpdateItem,
    updatedListing,
    updateInProgress,
    updateListingSuccess,
    closeListingInProgress,
    closeListingSuccess,
    onCloseListing,
    onFetctCurrentUser,
    onFetchCurrentListing,
    updateListingInProgress,
    currentUser,
    scrollingDisabled,
    getAccountLinkInProgress,
    getAccountLinkError,
    createStripeAccountError,
    updateStripeAccountError,
    fetchStripeAccountError,
    stripeAccountFetched,
    stripeAccount,
    onPayoutDetailsChange,
    onPayoutDetailsSubmit,
    onGetStripeConnectAccountLink,
    payoutDetailsSaveInProgress,
    payoutDetailsSaved,
    params,
    onLoadDashboard,
    onFetchTransaction,
    transactions,
    reviews,
  } = props;
   const{match}=props;

  const {
   params: pathParams,
  }=props;

  console.log(reviews,"   xxxxxxxxxxxxxxxxxx")

  const { returnURLType } = params || {};
  const ensuredCurrentUser = ensureCurrentUser(currentUser);
  const currentUserLoaded = !!ensuredCurrentUser.id;
  const stripeConnected = currentUserLoaded && !!stripeAccount && !!stripeAccount.id;
  const [curentPage, setCurrentPage] = useState("");
   const [showCatalogs, setShowCatalogs] = useState(false);

  const title = intl.formatMessage({ id: 'StripePayoutPage.title' });

  const formDisabled = getAccountLinkInProgress;

  const rootURL = config.marketplaceRootURL;
  const successURL = createReturnURL(STRIPE_ONBOARDING_RETURN_URL_SUCCESS, rootURL, routes);
  const failureURL = createReturnURL(STRIPE_ONBOARDING_RETURN_URL_FAILURE, rootURL, routes);

  const accountId = stripeConnected ? stripeAccount.id : null;
  const stripeAccountData = stripeConnected ? getStripeAccountData(stripeAccount) : null;
  const requirementsMissing =
    stripeAccount &&
    (hasRequirements(stripeAccountData, 'past_due') ||
      hasRequirements(stripeAccountData, 'currently_due'));

  const savedCountry = stripeAccountData ? stripeAccountData.country : null;
  const savedAccountType = stripeAccountData ? stripeAccountData.business_type : null;

  const handleGetStripeConnectAccountLink = handleGetStripeConnectAccountLinkFn(
    onGetStripeConnectAccountLink,
    {
      accountId,
      successURL,
      failureURL,
    }
  );

  const returnedNormallyFromStripe = returnURLType === STRIPE_ONBOARDING_RETURN_URL_SUCCESS;
  const returnedAbnormallyFromStripe = returnURLType === STRIPE_ONBOARDING_RETURN_URL_FAILURE;
  const showVerificationNeeded = stripeConnected && requirementsMissing;

  // Redirect from success URL to basic path for StripePayoutPage
  if (returnedNormallyFromStripe && stripeConnected && !requirementsMissing) {
    return <NamedRedirect name="StripePayoutPage" />;
  }

  // Failure url should redirect back to Stripe since it's most likely due to page reload
  // Account link creation will fail if the account is the reason
  if (returnedAbnormallyFromStripe && !getAccountLinkError) {
    handleGetStripeConnectAccountLink('custom_account_verification')();
  }
  
const [currentListing,setCurrentListing] = useState({});
  const currentListingMainCategory = currentListing?.attributes?.publicData?.listingType;
  
  const serviceAreasSave = currentUser?.attributes?.profile?.publicData?.serviceAreas;
  const availabilitySave = currentUser?.attributes?.profile?.publicData?.availability;
  const isCurrentUser = currentUser?.id && currentUser?.id?.uuid === pathParams.id;
  const profileUser = currentUser;
  const {attributes={}} = profileUser;
  const { bio, displayName, publicData, metadata } = profileUser?.attributes?.profile || {};
  const { businessName="",fullName="",language="",userType} = publicData || "";
  const { userFields } = config.user;
  const userTypeSaved = publicData?.userType;
  const [isProfileInfoComplete, setIsProfileInfoComplete] = useState(false);
  const profilePhoto = profileUser?.profileImage?.attributes?.variants["square-small"]?.url;

  const isPrivateMarketplace = config.accessControl.marketplace.private === true;
  const isUnauthorizedUser = currentUser && !isUserAuthorized(currentUser);
  const isUnauthorizedOnPrivateMarketplace = isPrivateMarketplace && isUnauthorizedUser;
  const hasUserPendingApprovalError = isErrorUserPendingApproval(userShowError);
  const hasNoViewingRightsUser = currentUser && !hasPermissionToViewData(currentUser);
  const hasNoViewingRightsOnPrivateMarketplace = isPrivateMarketplace && hasNoViewingRightsUser;
  const [currentSelectedUserType,setCurrentSelectedUserType] = useState(userTypeSaved);
  const [serviceAreas,setServiceAreas] = useState(serviceAreasSave);
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
  const [currentTab,setCurrentTab] = useState("dashboard");
  const [orderTab,setOrderTab] = useState("allOrders");
  const [showManagePayoutOptions, setShowManagePayoutOptions ] = useState(false);
  const [activePayoutOption,setActivePayoutOption] = useState("");
  const [showSettingsMenu,setShowSettingsMenu] = useState(false);
  const [showVerifyCodeSettings,setShowVerifyCodeSettings] = useState(false);
  const [showNotificationUpdated,setShowNotificationUpdated] = useState(false);
  const [showRemoveAccount,setShowRemoveAccount] = useState(false);
  const [showCreateListing,setShowCreateListing] = useState(false);
  const [showOngoingOrders,setShowOngoingOrders] = useState(false);
  const [showCompletedOrders,setShowCompletedOrders] = useState(false);
  const [selectedCategory,setSelectedCategory] = useState("Entertainers");
  const [selectedSubCategory,setSelectedSubCategory] = useState("");
  const [availability,setAvailability] = useState(availabilitySave);
  const [saveProfileIsComplete,setUserTypeIsComplete] = useState(false);
  const [personalComplete,setPersonalIsComplete] = useState(false);
  const [businessComplete,setBusinessIsComplete] = useState(false);
  const [saveProfileComplete,setSaveProfileIsComplete] = useState(false);
  const [imageSrcProfile,setImageSrcProfile] = useState(profilePhoto);
  const [isDraft,setIsDraft] = useState(false);
  const [showCloseListingDialog,setShowCloseListingDialog] = useState(false);
  const [listingIdToClose,setListingIdToClose] = useState("");
  const [listingStateToClose,setListingStateToClose] = useState("");
  const [listingAvailable,setListingAvailable] = useState(false);
  const [selectedFolderName,setSelectedFolderName] = useState("");
  const [counter,setCounter] = useState(0);

  const fileInputProfile = useRef(null);

  const catalogName = pathParams.id;
  const path = match.path;

  if(userType === "customer"){
    history.push("/")
  }
  
    useEffect(
      ()=>{

        if(path==="/profile-settings/catalog/edit/:id" || path==="/profile-settings/catalog/new/:id"){
            setShowCreateListing(true);
        }else{
            setShowCreateListing(false);
        }
       
      },[path]
    );

    useEffect(()=>{
      onFetchTransaction();
    },[])

  
  // const checkIfListingsAvailable = (data)=>{
  //   let result = false;
  //   if(JSON.stringify(data) !== "{}"){
  //     if(data.ownListing.length === 0){
  //       result = false;
  //     }
  //   Object.values(data.ownListing).map((listing,key)=>{
  //         if(listing.attributes.state === "published" || listing.state === "draft"){
  //           result = true;
  //         }
  //     })
  //   }
  //   return result;
  // }

  useEffect(()=>{

    // if(window.location.pathname === "/profile-settings/catalog"){
    //   //console.log("setShowCatalogssetShowCatalogssetShowCatalogssetShowCatalogssetShowCatalogs");
    //   setShowCatalogs(true);
    // }



    //console.log("Updating profile -----------");
      if(image !== undefined && image !== null && image.file !== undefined && image.imageId !== undefined && (image.listingId === undefined || image.listingId === null)){
        //console.log("Updating profile ------111111111111111-----");
        //console.log(image);
        const uploadedImage = image;
        // Update profileImage only if file system has been accessed
        const updatedValues = uploadedImage && uploadedImage.imageId && uploadedImage.file && {profileImageId: uploadedImage.imageId };
        //console.log(updatedValues);
        onUpdateProfile(updatedValues);
        //console.log("Updating profile ------222222222222222-----");
      }

      //console.log(listingDraft,"    bbbbbbbbbbbbbnnnnnnnnnnnnnnnnn")

      if(listingDraft !== null && isDraft){ 
        setCurrentListing(listingDraft);
      }

      if(userTypeSaved === undefined || userTypeSaved === null){
        setIsProfileInfoComplete(false);
      }else if(userTypeSaved === "businessOwner"){
        const {geolocation={}} = attributes;
        const {businessName="",teamSize="",language="",serviceAreas=[]} = publicData;
        setIsProfileInfoComplete(businessName !== "" && language !== "" && serviceAreas.length > 0);
      }else{
        const {geolocation={}} = attributes;
        const {fullName="",yearsOfExperience="",language="",dateOfBirth="",serviceAreas=[]} = publicData;
        setIsProfileInfoComplete(fullName !== "" && yearsOfExperience !== "" && language !== "" && dateOfBirth !== ""  && serviceAreas.length > 0);
      }

  },[publicData,listingDraft,currentListing,image,currentUser,isDraft]);


  useEffect(()=>{
    setServiceAreas(serviceAreasSave);
    forceUpdate();
    ////console.log("Responseeeeeeeeeeeeeeeeeemmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm");
    ////console.log(serviceAreasSave);
  },[currentUser])

  useEffect(()=>{
    if(closeListingSuccess && currentUser){
      window.location.reload();
    }
  },[closeListingSuccess,currentUser])

  // useEffect(()=>{
  //    setListingAvailable(checkIfListingsAvailable(ownEntities));
  //    ////console.log("Responseeeuuuuuuuu0000000000000");
  // },[ownEntities]);

  // useEffect(()=>{
  //    if(!showCreateListing){
  //     onFetctCurrentUser();
  //     setCurrentListing({});
  //    }
  // },[showCreateListing]);


  const getRatingsGroups = reviewData =>{
    let res = [0,0,0,0,0,0];
    reviewData.map((itm,key)=>{
      res[itm.attributes.rating] += 1;
    })
    return res;
  }
  const reviewsRatings = getRatingsGroups(reviews);

  const getRatingsAverage = reviewData =>{
    let res = [0,0,0,0,0,0];
    reviewData.map((itm,key)=>{
      res[itm.attributes.rating] += 1;
    })
    const result = (res[1] + res[2] + res[3] + res[4] + res[5]) / 5;
    return result;
  }
  const reviewsRatingsAverage = getRatingsAverage(reviews);

  const getRateByListing = reviewData =>{
    let res = {};
    reviewData.map((itm,key)=>{
      console.log("dffffgggghhhhkk");
      const initial = res[itm.listing.attributes.publicData.category] === undefined?0:res[itm.listing.attributes.publicData.category];
      res[itm.listing.attributes.publicData.category] =  initial + 1 ;
    })
    return res;
  }
  const reviewsByListing = getRateByListing(reviews);

  const handleProfileClick = ()=>{
    fileInputProfile.current.click();
    //console.log("5 clicked");
  }

  const handleChangeProfile = event =>{
    if(event.target.files && event.target.files[0]){
        let reader = new FileReader();
        reader.onload = (e) =>{
          setImageSrcProfile(e.target.result);
        }
        const file = event.target.files[0];
        //onSetSelectedFile(event.target.files[0]);
        reader.readAsDataURL(event.target.files[0]);

        if (file != null) {
          const tempId = `${file.name}_${Date.now()}`;
          onImageUpload({ id: tempId, file });
        }

      }
  }

  // const isDataLoaded = isPreview
  //   ? currentUser != null || userShowError != null
  //   : hasNoViewingRightsOnPrivateMarketplace
  //   ? currentUser != null || userShowError != null
  //   : user != null || userShowError != null;

  // const schemaTitleVars = { name: displayName, marketplaceName: config.marketplaceName };
  // const schemaTitle = intl.formatMessage({ id: 'ProfilePage.schemaTitle' }, schemaTitleVars);

  // if (!isDataLoaded) {
  //   return null;
  // } else if (!isPreview && isNotFoundError(userShowError)) {
  //   return <NotFoundPage staticContext={props.staticContext} />;
  // } else if (!isPreview && (isUnauthorizedOnPrivateMarketplace || hasUserPendingApprovalError)) {
  //   return (
  //     <NamedRedirect
  //       name="NoAccessPage"
  //       params={{ missingAccessRight: NO_ACCESS_PAGE_USER_PENDING_APPROVAL }}
  //     />
  //   );
  // } else if (
  //   (!isPreview && hasNoViewingRightsOnPrivateMarketplace && !isCurrentUser) ||
  //   isErrorNoViewingPermission(userShowError)
  // ) {
  //   // Someone without viewing rights on a private marketplace is trying to
  //   // view a profile page that is not their own – redirect to NoAccessPage
  //   return (
  //     <NamedRedirect
  //       name="NoAccessPage"
  //       params={{ missingAccessRight: NO_ACCESS_PAGE_VIEW_LISTINGS }}
  //     />
  //   );
  // } else if (!isPreview && isForbiddenError(userShowError)) {
  //   // This can happen if private marketplace mode is active, but it's not reflected through asset yet.
  //   return (
  //     <NamedRedirect
  //       name="SignupPage"
  //       state={{ from: `${location.pathname}${location.search}${location.hash}` }}
  //     />
  //   );
  // } else if (isPreview && mounted && !isCurrentUser) {
  //   // Someone is manipulating the URL, redirect to current user's profile page.
  //   return isCurrentUser === false ? (
  //     <NamedRedirect name="ProfilePage" params={{ id: currentUser?.id?.uuid }} />
  //   ) : null;
  // } else if ((isPreview || isPrivateMarketplace) && !mounted) {
  //   // This preview of the profile page is not rendered on server-side
  //   // and the first pass on client-side should render the same UI.
  //   return null;
  // }


  const onSetSelectedFile = (data)=>{
    setSelectedFile(data);
  }

  const moveNext = val =>{
    setCurrentPage(val);

    // //Save previous state
    // const userType = currentSelectedUserType;
    // //console.log(userType);
    // const data = 
    // {publicData: {
    //       userType
    //     }}
    // onUpdateProfile(data);
  }


  const handleMoveBack = val =>{
    //console.log(val);
    setCurrentPage(val);
  }

  const handleShowForm = e =>{
    setCurrentPage("businessProfile");
  }

  const handleShowCreateListing = e =>{
    //Clear current listing
    setIsDraft(false);
    setCurrentListing({});
    setSelectedCategory("");
    forceUpdate();
    //console.log("vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv");
    //console.log(selectedCategory);
    //console.log(currentListing);
    setShowCreateListing(true);
  }

  const handleHideForm = e =>{
    setCurrentPage("");
    e.preventDefault();
  }

  const handleRemove = id =>{
    const rem = serviceAreas !== undefined && serviceAreas.hasOwnProperty("length") && serviceAreas.length > 0? serviceAreas.filter(itm=>itm?.result?.id !== id):[];
    //setServiceAreas(rem);

    //console.log("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz");

    const data = 
    {publicData: {
          serviceAreas:rem
        }}
    onUpdateProfile(data);

    /////console.log(id);
    forceUpdate();
  }

  const handleSetService = val=>{
    //setServiceAreas(val);

    let dat = [];
    const serviceAreas = currentUser?.attributes?.profile?.publicData?.serviceAreas;
    if(serviceAreas !== undefined && serviceAreas.hasOwnProperty("length") && serviceAreas.length > 0 ){
      dat = [...serviceAreas,val];
    }else{
      dat.push(val);
    }
  
    const data = 
    {publicData: {
          serviceAreas:dat
        }}
    onUpdateProfile(data);

    //console.log("Calling  1111111111111111111111111111111111111");
    forceUpdate();
  }

  const showDashboard = e =>{
    e.preventDefault();
    e.stopPropagation();
    //console.log("===")
    setCurrentTab("dashboard");
  }

  const showMessages = val =>{
    setCurrentTab("messages");
  }

  const showEarnings = val =>{
    setCurrentTab("earnings");
  }

  const showSettings = val =>{
    setCurrentTab("settings");
  }

  const showPaymentSettings = val =>{
    setCurrentTab("paymentSettings");
  }

  const showNotification = val =>{
    setCurrentTab("notificationSettings");
  }

  const handleShowSettingsMenu = e=>{
    setShowSettingsMenu(!showSettingsMenu);
  }

  const handleShowListings = e=>{
    setCurrentTab("listings");
  }

  const handleClose = e=>{
    setShowManagePayoutOptions(false);
  }

  const handleAddOption =(e,val) =>{
    setActivePayoutOption(val);
  }

  const handleContinue = (e,val) =>{
    //console.log(val);
    //console.log(activePayoutOption === "VerificationCodeApplePay");
    setActivePayoutOption(val);
  }

  const handleSubmitVerification = (e,val)=>{
    setActivePayoutOption(val);
  }

  const handleCloseSuccessApplePay = (e)=>{
    setActivePayoutOption("done");
    setShowManagePayoutOptions(false);
  }

  const handleClosePasswordUpdated = e=>{
    setShowVerifyCodeSettings(false);
  }

  const handleCloseNotificationUpdated = e =>{
    setShowNotificationUpdated(false);
  }

  const handleRemoveAccount = e =>{
    setShowRemoveAccount(false)
  }

  const handleShowCompletedOrders = e=>{
    setOrderTab("completedOrders");
    setCurrentTab("orders");
  }

  const handleShowOngoingOrders = e=>{
    setOrderTab("onGoingOrders");
    setCurrentTab("orders");
  }

  const handleAvailability =  e=>{
    
    setAvailability(e.target.checked);
    const data = {publicData:{
      availability:e.target.checked
    }}
    onUpdateProfile(data);
    //console.log(availability);

  }

  const handleSaveCurrentSelectedUserType = e =>{
    setCurrentSelectedUserType(e);
    const userType = e;
    //console.log(userType);
    const data = 
    {publicData: {
          userType
        }}
    onUpdateProfile(data);
  }

  const handleEditListing = (event,listing)=>{
     localStorage.setItem("currentListing",listing.id.uuid);
     setShowCreateListing(true);
     setCurrentListing(listing);
     setIsDraft(true);
     localStorage.removeItem("folderName");
  }


  const handleSubmit = (values, userType) => {
      const { firstName, lastName, displayName, bio: rawBio, ...rest } = values;
  
      const displayNameMaybe = displayName
        ? { displayName: displayName.trim() }
        : { displayName: null };
  
      // Ensure that the optional bio is a string
      const bio = rawBio || '';
  
      // const profile = {
      //   firstName: firstName.trim(),
      //   lastName: lastName.trim(),
      //   ...displayNameMaybe,
      //   bio,
      //   publicData: {
      //     ...pickUserFieldsData(rest, 'public', userType, userFields),
      //   },
      //   protectedData: {
      //     ...pickUserFieldsData(rest, 'protected', userType, userFields),
      //   },
      //   privateData: {
      //     ...pickUserFieldsData(rest, 'private', userType, userFields),
      //   },
      // };
      // const uploadedImage = props.image;
  
      // // Update profileImage only if file system has been accessed
      // const updatedValues =
      //   uploadedImage && uploadedImage.imageId && uploadedImage.file
      //     ? { ...profile, profileImageId: uploadedImage.imageId }
      //     : profile;
  
      onUpdateProfile(updatedValues);
    };

    const handleCloseListing = (e,id,state)=>{
      onFetctCurrentUser();
      onCloseListing(listingIdToClose.uuid,listingStateToClose);
      setShowCloseListingDialog(false);

    }

    const handleSetListingToClose = (e,id,state)=>{
      setListingIdToClose(id);
      setListingStateToClose(state);
      setShowCloseListingDialog(true);
    }

    const handleShowMessages = e=>{
     history.replace("inbox");
    }

    useEffect(()=>{
      onLoadDashboard();
    },[currentTab])


  const getOngoingTransactions = (trx)=>{
        let result = [];
        trx.map((itm,k)=>{
          const state = itm?.attributes?.state;
          if(state !== "state/reviewed"){
            result.push(itm)
          }
        })
        return result;
    }

    const getCompletedTransactions = (trx)=>{
        let result = [];
        trx.map((itm,k)=>{
          const state = itm?.attributes?.state;
          if(state === "state/reviewed"){
            result.push(itm)
          }
        })
        return result;
    }
  
  const StyledRating = styled(Rating)({
    '& .MuiRating-iconFilled': {
      color: '#ff6d75',
    },
    '& .MuiRating-iconHover': {
      color: '#ff3d47',
    },
  });

  return (
    <Page title={title} scrollingDisabled={scrollingDisabled}>
      <LayoutSingleColumn
        topbar={
          
            <TopbarContainer
              desktopClassName={css.desktopTopbar}
              mobileClassName={css.mobileTopbar}
            />
          
        }
        
        currentPage="StripePayoutPage"
        footer={<FooterContainer />}
      >

        <div className={css2.main_con}>

                <div className={css2.container}>
                    <div className={css2.aside}>
                        <div onClick={showDashboard} className={css2.flex_row}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M3.33333 9.58333C2.18274 9.58333 1.25 8.65059 1.25 7.5V3.33333C1.25 2.18274 2.18274 1.25 3.33333 1.25H7.5C8.65059 1.25 9.58333 2.18274 9.58333 3.33333V7.5C9.58333 8.65059 8.65059 9.58333 7.5 9.58333H3.33333ZM2.91667 7.5C2.91667 7.73012 3.10321 7.91667 3.33333 7.91667L7.5 7.91667C7.73012 7.91667 7.91667 7.73012 7.91667 7.5V3.33333C7.91667 3.10322 7.73012 2.91667 7.5 2.91667L3.33333 2.91667C3.10321 2.91667 2.91667 3.10322 2.91667 3.33333L2.91667 7.5Z" fill="black"/>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M1.25 16.6667C1.25 17.8173 2.18274 18.75 3.33333 18.75H7.5C8.65059 18.75 9.58333 17.8173 9.58333 16.6667V12.5C9.58333 11.3494 8.65059 10.4167 7.5 10.4167H3.33333C2.18274 10.4167 1.25 11.3494 1.25 12.5V16.6667ZM3.33333 17.0833C3.10321 17.0833 2.91667 16.8968 2.91667 16.6667L2.91667 12.5C2.91667 12.2699 3.10321 12.0833 3.33333 12.0833H7.5C7.73012 12.0833 7.91667 12.2699 7.91667 12.5V16.6667C7.91667 16.8968 7.73012 17.0833 7.5 17.0833H3.33333Z" fill="black"/>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M10.4167 16.6667C10.4167 17.8173 11.3494 18.75 12.5 18.75H16.6667C17.8173 18.75 18.75 17.8173 18.75 16.6667V12.5C18.75 11.3494 17.8173 10.4167 16.6667 10.4167H12.5C11.3494 10.4167 10.4167 11.3494 10.4167 12.5V16.6667ZM12.5 17.0833C12.2699 17.0833 12.0833 16.8968 12.0833 16.6667V12.5C12.0833 12.2699 12.2699 12.0833 12.5 12.0833H16.6667C16.8968 12.0833 17.0833 12.2699 17.0833 12.5V16.6667C17.0833 16.8968 16.8968 17.0833 16.6667 17.0833H12.5Z" fill="black"/>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M10.4167 7.5C10.4167 8.65059 11.3494 9.58333 12.5 9.58333H16.6667C17.8173 9.58333 18.75 8.65059 18.75 7.5V3.33333C18.75 2.18274 17.8173 1.25 16.6667 1.25H12.5C11.3494 1.25 10.4167 2.18274 10.4167 3.33333V7.5ZM12.5 7.91667C12.2699 7.91667 12.0833 7.73012 12.0833 7.5V3.33333C12.0833 3.10322 12.2699 2.91667 12.5 2.91667L16.6667 2.91667C16.8968 2.91667 17.0833 3.10322 17.0833 3.33333V7.5C17.0833 7.73012 16.8968 7.91667 16.6667 7.91667L12.5 7.91667Z" fill="black"/>
                            </svg>
                            <span>Dashboard</span>
                        </div>
                        <NamedLink onClick={handleShowMessages} className={css.flex_row} name="InboxBasePage">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M15.8336 17.5C17.6745 17.5 19.1669 16.0076 19.1669 14.1667V6.68557C19.1672 6.67283 19.1672 6.66005 19.1669 6.64725V5.83333C19.1669 3.99238 17.6745 2.5 15.8336 2.5H4.16693C2.32598 2.5 0.833596 3.99238 0.833596 5.83333V6.64726C0.833299 6.66005 0.833301 6.67282 0.833596 6.68556V14.1667C0.833596 16.0076 2.32598 17.5 4.16693 17.5H15.8336ZM2.50026 14.1667C2.50026 15.0871 3.24645 15.8333 4.16693 15.8333H15.8336C16.7541 15.8333 17.5003 15.0871 17.5003 14.1667V7.89753L11.2382 10.4023C10.4435 10.7202 9.557 10.7202 8.76229 10.4023L2.50026 7.89753V14.1667ZM10.6192 8.85488L17.5003 6.10247V5.83333C17.5003 4.91286 16.7541 4.16667 15.8336 4.16667H4.16693C3.24645 4.16667 2.50026 4.91286 2.50026 5.83333V6.10247L9.38128 8.85488C9.77863 9.01382 10.2219 9.01382 10.6192 8.85488Z" fill="black"/>
                            </svg>
        
                            <span >Messages</span>
                        </NamedLink>
                        <div onClick={showEarnings} className={css2.flex_row}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M10.8333 1.66732C10.8333 1.20708 10.4602 0.833984 10 0.833984C9.53976 0.833984 9.16667 1.20708 9.16667 1.66732V2.50065C6.86548 2.50065 5 4.36613 5 6.66732C5 8.9685 6.86548 10.834 9.16667 10.834V15.834C7.78595 15.834 6.66667 14.7147 6.66667 13.334C6.66667 12.8737 6.29357 12.5007 5.83333 12.5007C5.3731 12.5007 5 12.8737 5 13.334C5 15.6352 6.86548 17.5006 9.16667 17.5006V18.334C9.16667 18.7942 9.53976 19.1673 10 19.1673C10.4602 19.1673 10.8333 18.7942 10.8333 18.334V17.5006C13.1345 17.5006 15 15.6352 15 13.334C15 11.0328 13.1345 9.16732 10.8333 9.16732V4.16732C12.214 4.16732 13.3333 5.28661 13.3333 6.66732C13.3333 7.12755 13.7064 7.50065 14.1667 7.50065C14.6269 7.50065 15 7.12755 15 6.66732C15 4.36613 13.1345 2.50065 10.8333 2.50065V1.66732ZM9.16667 4.16732C7.78595 4.16732 6.66667 5.28661 6.66667 6.66732C6.66667 8.04803 7.78595 9.16732 9.16667 9.16732V4.16732ZM10.8333 10.834V15.834C12.214 15.834 13.3333 14.7147 13.3333 13.334C13.3333 11.9533 12.214 10.834 10.8333 10.834Z" fill="black"/>
                            </svg>

                            <span>Earnings</span>
                        </div>
                        <div onClick={handleShowSettingsMenu} className={css2.flex_row_full_btw}>
                          <div className={css2.flex_row}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M6.66667 2.49935V4.27103C8.10436 4.64107 9.16667 5.94615 9.16667 7.49935C9.16667 9.05255 8.10436 10.3576 6.66667 10.7277V17.4993C6.66667 17.9596 6.29357 18.3327 5.83333 18.3327C5.3731 18.3327 5 17.9596 5 17.4993L5 10.7277C3.56231 10.3576 2.5 9.05255 2.5 7.49935C2.5 5.94615 3.56231 4.64107 5 4.27103L5 2.49935C5 2.03911 5.3731 1.66602 5.83333 1.66602C6.29357 1.66602 6.66667 2.03911 6.66667 2.49935ZM4.16667 7.49935C4.16667 6.57887 4.91286 5.83268 5.83333 5.83268C6.75381 5.83268 7.5 6.57887 7.5 7.49935C7.5 8.41982 6.75381 9.16602 5.83333 9.16602C4.91286 9.16602 4.16667 8.41982 4.16667 7.49935Z" fill="black"/>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M13.3333 15.7277V17.4993C13.3333 17.9596 13.7064 18.3327 14.1667 18.3327C14.6269 18.3327 15 17.9596 15 17.4993V15.7277C16.4377 15.3576 17.5 14.0525 17.5 12.4993C17.5 10.9461 16.4377 9.64107 15 9.27103V2.49935C15 2.03911 14.6269 1.66602 14.1667 1.66602C13.7064 1.66602 13.3333 2.03911 13.3333 2.49935V9.27103C11.8956 9.64107 10.8333 10.9461 10.8333 12.4993C10.8333 14.0525 11.8956 15.3576 13.3333 15.7277ZM15.8333 12.4993C15.8333 11.5789 15.0871 10.8327 14.1667 10.8327C13.2462 10.8327 12.5 11.5789 12.5 12.4993C12.5 13.4198 13.2462 14.166 14.1667 14.166C15.0871 14.166 15.8333 13.4198 15.8333 12.4993Z" fill="black"/>
                            </svg>
                            <span>Settings</span>
                          </div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                              <path fill-rule="evenodd" clip-rule="evenodd" d="M9.41075 6.91009C9.73619 6.58466 10.2638 6.58466 10.5893 6.91009L15.5893 11.9101C15.9147 12.2355 15.9147 12.7632 15.5893 13.0886C15.2638 13.414 14.7362 13.414 14.4107 13.0886L10 8.67786L5.58926 13.0886C5.26382 13.414 4.73619 13.414 4.41075 13.0886C4.08531 12.7632 4.08531 12.2355 4.41075 11.9101L9.41075 6.91009Z" fill="#667185"/>
                            </svg>
                        </div>
                        {showSettingsMenu?
                          <>
                            <div onClick={showSettings} className={css2.flex_row_full_btw}>
                              <div className={css2.flex_row}>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    
                                </svg>
                                <span>Account privacy</span>
                              </div>
                                
                            </div>

                            <div onClick={showPaymentSettings} className={css2.flex_row_full_btw}>
                              <div className={css2.flex_row}>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    
                                </svg>
                                <span>Payment settings</span>
                              </div>
                              
                            </div>

                            <div onClick={showNotification} className={css2.flex_row_full_btw}>
                              <div className={css2.flex_row}>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    
                                </svg>
                                <span>Notifications</span>
                              </div>
                                
                            </div>
                          </>
                        :""}
                      


                    </div>
                    {currentTab === "dashboard"?
                      <div className={css2.content}>
                          <div className={css2.profile_photo}>
                            
                              {imageSrcProfile !== undefined && imageSrcProfile !== null?
                                <img className={css2.profilePhoto} onClick={handleProfileClick} src={imageSrcProfile}/>
                                :
                                <svg className={css2.profilePhoto} onClick={handleProfileClick}  width="121" height="120" viewBox="0 0 121 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <rect x="3.5" y="3" width="114" height="114" rx="57" fill="#667185"/>
                                  <rect x="3.5" y="3" width="114" height="114" rx="57" stroke="white" stroke-width="6"/>
                                  <path d="M60.5 54C55.5294 54 51.5 58.0294 51.5 63C51.5 67.9706 55.5294 72 60.5 72C65.4706 72 69.5 67.9706 69.5 63C69.5 58.0294 65.4706 54 60.5 54Z" fill="white"/>
                                  <path fill-rule="evenodd" clip-rule="evenodd" d="M55.2279 34.5H65.7721C68.159 34.5 70.4482 35.4482 72.136 37.136L74.1937 39.1937C75.0556 40.0556 76.0835 40.7334 77.2152 41.1861L84.8425 44.237C88.2594 45.6038 90.5 48.9132 90.5 52.5933V76.5C90.5 81.4706 86.4706 85.5 81.5 85.5H39.5C34.5294 85.5 30.5 81.4706 30.5 76.5V52.5933C30.5 48.9132 32.7406 45.6038 36.1575 44.237L43.7848 41.1861C44.9165 40.7334 45.9444 40.0556 46.8063 39.1937L48.864 37.136C50.5518 35.4482 52.841 34.5 55.2279 34.5ZM45.5 63C45.5 54.7157 52.2157 48 60.5 48C68.7843 48 75.5 54.7157 75.5 63C75.5 71.2843 68.7843 78 60.5 78C52.2157 78 45.5 71.2843 45.5 63ZM72.043 51.577C73.2457 51.9779 74.1894 52.9216 74.5903 54.1244C74.9983 55.3484 76.7297 55.3484 77.1377 54.1244C77.5386 52.9216 78.4824 51.9779 79.6851 51.577C80.9091 51.169 80.9091 49.4376 79.6851 49.0296C78.4824 48.6287 77.5386 47.685 77.1377 46.4822C76.7297 45.2582 74.9983 45.2582 74.5903 46.4822C74.1894 47.685 73.2457 48.6287 72.043 49.0296C70.8189 49.4376 70.8189 51.169 72.043 51.577Z" fill="white"/>
                                </svg>
                              
                              }
                              <form>
                                <input 
                                      id='file5' 
                                      name='file5' 
                                      type='file' 
                                      hidden
                                      ref={fileInputProfile}
                                      onChange={handleChangeProfile}
                                  />
                              </form>
                              

                              <span className={css2.profile_title}>{displayName}</span>
                              <div className={css2.flex_row_profile}>
                                  <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path fill-rule="evenodd" clip-rule="evenodd" d="M12.5 5.49914C10.0147 5.49914 8.00003 7.51385 8.00003 9.99914C8.00003 12.4844 10.0147 14.4991 12.5 14.4991C14.9853 14.4991 17 12.4844 17 9.99914C17 7.51385 14.9853 5.49914 12.5 5.49914ZM10 9.99914C10 8.61842 11.1193 7.49914 12.5 7.49914C13.8807 7.49914 15 8.61842 15 9.99914C15 11.3798 13.8807 12.4991 12.5 12.4991C11.1193 12.4991 10 11.3798 10 9.99914Z" fill="#475367"/>
                                      <path fill-rule="evenodd" clip-rule="evenodd" d="M8.30927 3.59112C10.847 1.89931 14.1531 1.89931 16.6908 3.59112C20.1217 5.87839 21.0849 10.4941 18.8551 13.9627L15.0236 19.9229C13.8427 21.7599 11.1574 21.7599 9.9765 19.9229L6.14493 13.9627C3.91516 10.4941 4.87838 5.87839 8.30927 3.59112ZM9.41867 5.25523C11.2846 4.01128 13.7155 4.01128 15.5814 5.25523C18.104 6.93699 18.8123 10.3308 17.1728 12.8812L13.3412 18.8414C12.9476 19.4537 12.0525 19.4537 11.6589 18.8414L7.82729 12.8812C6.18779 10.3308 6.89602 6.93699 9.41867 5.25523Z" fill="#475367"/>
                                  </svg>

                                  <span>{businessName || fullName}</span>
                              </div>
                              <span className={css2.lang}>Languages: {typeof(language) === "string"?language:language.map((itm,key)=>`${itm} `)}</span>
                              <div className={css2.flex_row_btw}>
                                  <div className={css2.flex_row_itm}>
                                      Available
                                      <form onChange={handleAvailability}>
                                        <Switch checked={availability} color="warning"/>
                                      </form>
                                      

                                  </div>
                                  <div className={classNames(css2.flex_row_itm,css2.edit_btn)} onClick={handleShowForm}>
                                      <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <g id="icon / pencil-edit">
                                          <g id="icon">
                                          <path fill-rule="evenodd" clip-rule="evenodd" d="M21.0961 2.91033C19.7495 1.56374 17.5662 1.56374 16.2196 2.91033L7.69416 11.4358C7.08217 12.0478 6.68518 12.8418 6.56279 13.6985L6.31573 15.4279C6.12717 16.7478 7.25854 17.8792 8.57847 17.6906L10.3078 17.4436C11.1646 17.3212 11.9586 16.9242 12.5706 16.3122L21.0961 7.78676C22.4426 6.44017 22.4426 4.25692 21.0961 2.91033ZM17.8433 4.15085C18.407 3.76659 19.1818 3.82448 19.6818 4.32455C20.1819 4.82461 20.2398 5.59939 19.8555 6.16307L17.8433 4.15085ZM16.4112 5.54717L18.4592 7.59518L11.1564 14.898C10.8504 15.204 10.4534 15.4025 10.025 15.4637L8.29563 15.7108L8.54269 13.9814C8.60388 13.553 8.80238 13.156 9.10837 12.85L16.4112 5.54717Z" fill="#475367"/>
                                          <path d="M6.5 2.00035C4.29086 2.00035 2.5 3.79121 2.5 6.00035V18.0003C2.5 20.2095 4.29086 22.0003 6.5 22.0003H18.5C20.7091 22.0003 22.5 20.2095 22.5 18.0003V12.0003C22.5 11.4481 22.0523 11.0003 21.5 11.0003C20.9477 11.0003 20.5 11.4481 20.5 12.0003V18.0003C20.5 19.1049 19.6046 20.0003 18.5 20.0003H6.5C5.39543 20.0003 4.5 19.1049 4.5 18.0003V6.00035C4.5 4.89578 5.39543 4.00035 6.5 4.00035H9.18421C9.7365 4.00035 10.1842 3.55263 10.1842 3.00035C10.1842 2.44806 9.7365 2.00035 9.18421 2.00035H6.5Z" fill="#475367"/>
                                          </g>
                                          </g>
                                      </svg>
                                      Edit profile
                                  </div>
                              </div>

                          </div>
                          {!isProfileInfoComplete?
                            <div className={css2.profile_completion}>
                                  <div className={css2.flex_row_start}>
                                      <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <g id="icon / pencil-edit">
                                          <g id="icon">
                                          <path fill-rule="evenodd" clip-rule="evenodd" d="M21.0961 2.91033C19.7495 1.56374 17.5662 1.56374 16.2196 2.91033L7.69416 11.4358C7.08217 12.0478 6.68518 12.8418 6.56279 13.6985L6.31573 15.4279C6.12717 16.7478 7.25854 17.8792 8.57847 17.6906L10.3078 17.4436C11.1646 17.3212 11.9586 16.9242 12.5706 16.3122L21.0961 7.78676C22.4426 6.44017 22.4426 4.25692 21.0961 2.91033ZM17.8433 4.15085C18.407 3.76659 19.1818 3.82448 19.6818 4.32455C20.1819 4.82461 20.2398 5.59939 19.8555 6.16307L17.8433 4.15085ZM16.4112 5.54717L18.4592 7.59518L11.1564 14.898C10.8504 15.204 10.4534 15.4025 10.025 15.4637L8.29563 15.7108L8.54269 13.9814C8.60388 13.553 8.80238 13.156 9.10837 12.85L16.4112 5.54717Z" fill="#475367"/>
                                          <path d="M6.5 2.00035C4.29086 2.00035 2.5 3.79121 2.5 6.00035V18.0003C2.5 20.2095 4.29086 22.0003 6.5 22.0003H18.5C20.7091 22.0003 22.5 20.2095 22.5 18.0003V12.0003C22.5 11.4481 22.0523 11.0003 21.5 11.0003C20.9477 11.0003 20.5 11.4481 20.5 12.0003V18.0003C20.5 19.1049 19.6046 20.0003 18.5 20.0003H6.5C5.39543 20.0003 4.5 19.1049 4.5 18.0003V6.00035C4.5 4.89578 5.39543 4.00035 6.5 4.00035H9.18421C9.7365 4.00035 10.1842 3.55263 10.1842 3.00035C10.1842 2.44806 9.7365 2.00035 9.18421 2.00035H6.5Z" fill="#475367"/>
                                          </g>
                                          </g>
                                      </svg>
                                      <div className={css2.flex_col}>
                                          <span className={css2.header}>Your profile is 40% incomplete</span>
                                          <p>Your profile is incomplete. Complete required fields to make your service visible to customers.</p>
                                          <button onClick={handleShowForm} className={css2.complete_profile_btn}>Complete profile</button>
                                      </div>
                                  </div>
                                
                                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M5.87571 4.6972C5.55028 4.37177 5.02264 4.37177 4.6972 4.6972C4.37177 5.02264 4.37177 5.55028 4.6972 5.87571L8.82199 10.0005L4.6972 14.1253C4.37177 14.4507 4.37177 14.9784 4.6972 15.3038C5.02264 15.6292 5.55028 15.6292 5.87571 15.3038L10.0005 11.179L14.1253 15.3038C14.4507 15.6292 14.9784 15.6292 15.3038 15.3038C15.6292 14.9784 15.6292 14.4507 15.3038 14.1253L11.179 10.0005L15.3038 5.87571C15.6292 5.55028 15.6292 5.02264 15.3038 4.6972C14.9784 4.37177 14.4507 4.37177 14.1253 4.6972L10.0005 8.82199L5.87571 4.6972Z" fill="black"/>
                                  </svg>
                              </div>
                          :""}
                        
                          <div className={css2.profile_completion}>
                              <div className={css2.flex_row_start}>
                                  <div className={css2.flex_col}>
                                      <span className={css2.header_listing}>Create your service listing and start advertising on Miventy</span>
                                      <p>Your service listing will be showcased to thousands of clients daily, get more bookings and grow your business.</p>
                                  </div>
                              </div>
                              <div className={css2.create_listing_btn_con}>
                                <button onClick={handleShowCreateListing} className={css2.create_listing_btn} disabled={!isProfileInfoComplete}>
                                  {isProfileInfoComplete?"Create a listing":"Your need to complete your Profile before you can create a Listing"}
                                </button>
                              </div>
                              
                          </div>

                          <div className={css2.your_listing_con}>
                            
                            <div>
                                <h1 className={css2.header_2}>Your Listing</h1>
                                  <p className={css2.sub_header_2}>
                                  Manage your service listings
                                </p>
                            </div>
                              

                              <div className={css2.flex_grid}>
                                {ownEntities !== undefined && ownEntities.hasOwnProperty("ownListing") && Object.values(ownEntities.ownListing).map((listing,key)=>{
                                  
                                  const {id}=listing;
                                  const {publicData,state}=listing.attributes;
                                  const {listingType,coverPhoto="",catalog=[],category} = publicData;
                                  const isDraft = state === "draft";

                                  let firstImageInCatId = ""; 
                                  if(catalog.length > 0 && catalog[0].hasOwnProperty("catalogImages")){
                                    firstImageInCatId = catalog[0].catalogImages[0]?.imgUrl;
                                  }

                                  let img = "";
                                    if(coverPhoto !== undefined && coverPhoto !== ""){
                                        img = coverPhoto;
                                    }else if(ownEntities.hasOwnProperty("image")){
                                      const firstImageId = Object.keys(ownEntities?.image)[0];
                                      img = ownEntities?.image[firstImageInCatId]?.attributes?.variants["scaled-medium"]?.url;
                                    }

                                    // if(state === "closed"){
                                    //   return "";
                                    // }else{
                                      
                                    // }

                                    if(key > 2){
                                      return "";
                                    }

                                  return(
                                    <div key={key} className={css2.mylisting_card}>
                                      <div className={css2.img_con}>

                                          {img !== undefined && img !== ""?
                                            <div className={css2.image_con}>
                                              {isDraft?
                                                <div onClick={event=>{handleEditListing(event,listing)}} className={css2.draft_overlay}>
                                                  <div className={css2.text_center}>
                                                    <h5>Draft</h5>
                                                    <p>Click to complete</p>
                                                  </div>
                                                </div>
                                              :""}
                                              <img className={css2.resizeimg}  src={img}  onClick={event=>{handleEditListing(event,listing)}}/>
                                            </div>
                                            :
                                            <div className={css2.image_con}>
                                              {isDraft?
                                                <div onClick={event=>{handleEditListing(event,listing)}} className={css2.draft_overlay}>
                                                  <div className={css2.text_center}>
                                                    <h5>Draft</h5>
                                                    <p>Click to complete</p>
                                                  </div>
                                                </div>
                                              :""}
                                              <img  className={css2.resizeimg} src={list1}  onClick={event=>{handleEditListing(event,listing)}}/>
                                            </div>
                                            
                                          }

                                      </div>
                                      <div className={css2.flex_row_center_2}>
                                        <h2 className={css2.caption}>{category}</h2>
                                        <div className={css2.remove_con} onClick={e=>{handleSetListingToClose(e,id,state)}}>
                                          {closeListingInProgress?
                                            <CircularProgress size={20} sx={{ color: 'gray'}}/>
                                          :""}
                                          <span>Remove Listing</span>
                                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path d="M7.91708 1.45898C7.57069 1.45898 7.26043 1.67326 7.13775 1.99719L6.94643 2.50243C6.53628 2.46144 6.15838 2.42054 5.85247 2.38619C5.6238 2.36052 5.43582 2.33856 5.30524 2.32305L5.15462 2.30497L5.10346 2.29871C4.64672 2.24216 4.22996 2.56649 4.1734 3.02324C4.11683 3.47999 4.44125 3.89611 4.898 3.95267L4.95366 3.95947L5.10864 3.97808C5.24226 3.99395 5.43382 4.01632 5.66651 4.04245C6.13148 4.09466 6.76256 4.16206 7.42467 4.22248C8.31782 4.30399 9.29685 4.37565 10.0004 4.37565C10.704 4.37565 11.683 4.30399 12.5761 4.22248C13.2383 4.16206 13.8694 4.09466 14.3343 4.04245C14.567 4.01632 14.7586 3.99395 14.8922 3.97808L15.0472 3.95947L15.1027 3.95268C15.5595 3.89612 15.884 3.47999 15.8274 3.02324C15.7709 2.56649 15.3548 2.24208 14.898 2.29863L14.8462 2.30497L14.6956 2.32305C14.565 2.33856 14.377 2.36052 14.1484 2.38619C13.8424 2.42054 13.4645 2.46144 13.0544 2.50243L12.8631 1.99719C12.7404 1.67326 12.4301 1.45898 12.0837 1.45898H7.91708Z" fill="#475367"/>
                                            <path d="M9.16708 9.79232C9.16708 9.33208 8.79398 8.95898 8.33375 8.95898C7.87351 8.95898 7.50041 9.33208 7.50041 9.79232V13.959C7.50041 14.4192 7.87351 14.7923 8.33375 14.7923C8.79398 14.7923 9.16708 14.4192 9.16708 13.959V9.79232Z" fill="#475367"/>
                                            <path d="M11.6671 8.95898C12.1273 8.95898 12.5004 9.33208 12.5004 9.79232V13.959C12.5004 14.4192 12.1273 14.7923 11.6671 14.7923C11.2068 14.7923 10.8337 14.4192 10.8337 13.959V9.79232C10.8337 9.33208 11.2068 8.95898 11.6671 8.95898Z" fill="#475367"/>
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M15.7585 6.70945C15.834 5.65214 14.9224 4.80451 13.8865 4.92423C12.8265 5.04674 11.1907 5.20898 10.0004 5.20898C8.81013 5.20898 7.17436 5.04674 6.11433 4.92423C5.07839 4.80451 4.16685 5.65214 4.24237 6.70945L4.95631 16.7047C5.01043 17.4624 5.5748 18.103 6.34928 18.2194C7.17979 18.3443 8.7037 18.5438 10.0014 18.5423C11.2831 18.5408 12.8132 18.3422 13.6474 18.2184C14.4232 18.1034 14.9904 17.4623 15.0447 16.7024L15.7585 6.70945ZM14.0778 6.57988C14.0807 6.57955 14.0829 6.57974 14.0829 6.57974L14.0851 6.58025C14.087 6.58089 14.0899 6.58241 14.0928 6.58513C14.0947 6.58693 14.0961 6.58913 14.0961 6.58913L14.096 6.5907L13.383 16.5728C12.5574 16.6948 11.1425 16.8743 9.99945 16.8757C8.84399 16.877 7.4378 16.6972 6.61792 16.5744L5.9048 6.5907L5.90474 6.58913C5.90474 6.58913 5.90616 6.58693 5.90806 6.58513C5.91093 6.58241 5.91384 6.58089 5.91569 6.58025L5.91789 6.57974C5.91789 6.57974 5.92011 6.57955 5.923 6.57988C6.9849 6.7026 8.70495 6.87565 10.0004 6.87565C11.2959 6.87565 13.0159 6.7026 14.0778 6.57988Z" fill="#475367"/>
                                          </svg>
                                        
                                        </div>
                                      </div>
                                      
                                    </div>
                                  )
                                })}
                                  {ownEntities !== undefined && ownEntities.hasOwnProperty("ownListing") && Object.values(ownEntities.ownListing).length>2?
                                  <div className={css2.mylisting_card_2}>
                                    <button onClick={handleShowListings} className={css2.view_more}>
                                      <span>View all Listings</span>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M21.7071 12.7071C22.0976 12.3166 22.0976 11.6834 21.7071 11.2929L17.7071 7.29289C17.3166 6.90237 16.6834 6.90237 16.2929 7.29289C15.9024 7.68342 15.9024 8.31658 16.2929 8.70711L18.5858 11L3 11C2.44772 11 2 11.4477 2 12C2 12.5523 2.44772 13 3 13L18.5858 13L16.2929 15.2929C15.9024 15.6834 15.9024 16.3166 16.2929 16.7071C16.6834 17.0976 17.3166 17.0976 17.7071 16.7071L21.7071 12.7071Z" fill="#EB5017"/>
                                      </svg>
                                    </button>
                                    </div>
                                  :""}
                                  
                              </div>
                            

                          </div>


                          <div className={css2.order_tracking}>
                              <div className={css2.flex_row_start}>
                                  <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path fill-rule="evenodd" clip-rule="evenodd" d="M12 1.5C8.40056 1.5 5.20486 3.2299 3.1997 5.89942C1.81871 7.73797 1 10.0248 1 12.5C1 14.9752 1.81871 17.262 3.1997 19.1006C5.20486 21.7701 8.40056 23.5 12 23.5C15.5994 23.5 18.7951 21.7701 20.8003 19.1006C22.1813 17.262 23 14.9752 23 12.5C23 10.0248 22.1813 7.73797 20.8003 5.89942C18.7951 3.2299 15.5994 1.5 12 1.5ZM4.90148 7.4176C5.12565 7.39682 5.38969 7.37293 5.68444 7.34733C5.60258 8.56193 5.53095 9.99456 5.50782 11.5H3.05486C3.2194 10.0099 3.74743 8.63055 4.54856 7.45084C4.65102 7.44104 4.76929 7.42986 4.90148 7.4176ZM4.54856 17.5492C3.74743 16.3695 3.2194 14.9901 3.05486 13.5H5.50782C5.53095 15.0054 5.60258 16.4381 5.68444 17.6527C5.38969 17.6271 5.12565 17.6032 4.90148 17.5824C4.76929 17.5701 4.65102 17.559 4.54856 17.5492ZM7.50806 13.5C7.53297 15.0746 7.61241 16.5714 7.70023 17.8123C8.77446 17.8887 9.94229 17.9564 11 17.9852V13.5H7.50806ZM7.91935 20.3659C7.9254 20.4251 7.93118 20.4809 7.93664 20.5329C8.87517 21.0086 9.90816 21.3245 11 21.4451V19.9859C9.98757 19.9595 8.88779 19.8986 7.86654 19.8288C7.8846 20.0195 7.90151 20.1907 7.91673 20.3403C7.91761 20.3489 7.91848 20.3574 7.91935 20.3659ZM16.0634 20.5329C15.1248 21.0086 14.0918 21.3245 13 21.4451V19.9859C14.0124 19.9595 15.1122 19.8986 16.1335 19.8288C16.1154 20.0195 16.0985 20.1907 16.0833 20.3403C16.0763 20.4091 16.0696 20.4734 16.0634 20.5329ZM16.2998 17.8123C15.2255 17.8887 14.0577 17.9564 13 17.9852V13.5H16.4919C16.467 15.0746 16.3876 16.5714 16.2998 17.8123ZM16.2998 7.18766C16.3876 8.42861 16.467 9.92539 16.4919 11.5H13V7.01476C14.0577 7.0436 15.2255 7.11133 16.2998 7.18766ZM16.1335 5.17121C15.1122 5.10142 14.0124 5.04054 13 5.01407V3.55489C14.0918 3.67552 15.1248 3.99139 16.0634 4.46708C16.0696 4.52656 16.0763 4.59085 16.0833 4.65974C16.0985 4.80931 16.1154 4.98051 16.1335 5.17121ZM7.86654 5.17121C8.88779 5.10142 9.98757 5.04054 11 5.01407V3.55489C9.90816 3.67552 8.87517 3.99139 7.93664 4.46708C7.9304 4.52656 7.92375 4.59085 7.91673 4.65974C7.90151 4.80931 7.8846 4.98051 7.86654 5.17121ZM11 7.01476C9.94229 7.0436 8.77446 7.11133 7.70023 7.18766C7.61241 8.42861 7.53297 9.92539 7.50806 11.5H11V7.01476ZM19.0985 7.4176C18.8744 7.39682 18.6103 7.37293 18.3156 7.34733C18.3974 8.56193 18.4691 9.99456 18.4922 11.5H20.9451C20.7806 10.0099 20.2526 8.63055 19.4514 7.45084C19.349 7.44104 19.2307 7.42986 19.0985 7.4176ZM18.3156 17.6527C18.3974 16.4381 18.4691 15.0054 18.4922 13.5H20.9451C20.7806 14.9901 20.2526 16.3695 19.4514 17.5492C19.349 17.559 19.2307 17.5701 19.0985 17.5824C18.8744 17.6032 18.6103 17.6271 18.3156 17.6527Z" fill="#475367"/>
                                  </svg>

                                  <div className={css2.flex_col_order}>
                                      <span className={css2.header}>Orders Tracking</span>
                                      <p>Track your orders both on-going and completed orders. </p>
                                  </div>
                              </div>
                              <div className={css2.flex_row_btw_ord}>
                                  <div onClick={handleShowOngoingOrders}>
                                    <div className={css2.flex_row_full_btw}>
                                        <span className={css2.counter_header}>On-going Orders</span>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <rect width="24" height="24" fill="#FCF4F0"/>
                                          <path d="M8 6C7.44772 6 7 6.44772 7 7C7 7.55228 7.44772 8 8 8H16C16.5523 8 17 7.55228 17 7C17 6.44772 16.5523 6 16 6H8Z" fill="#475367"/>
                                          <path d="M7 12C7 11.4477 7.44772 11 8 11H16C16.5523 11 17 11.4477 17 12C17 12.5523 16.5523 13 16 13H8C7.44772 13 7 12.5523 7 12Z" fill="#475367"/>
                                          <path d="M8 16C7.44772 16 7 16.4477 7 17C7 17.5523 7.44772 18 8 18H10.6667C11.219 18 11.6667 17.5523 11.6667 17C11.6667 16.4477 11.219 16 10.6667 16H8Z" fill="#475367"/>
                                          <path d="M13.3333 16C12.781 16 12.3333 16.4477 12.3333 17C12.3333 17.5523 12.781 18 13.3333 18H16C16.5523 18 17 17.5523 17 17C17 16.4477 16.5523 16 16 16H13.3333Z" fill="#475367"/>
                                          <path fill-rule="evenodd" clip-rule="evenodd" d="M15.4818 21.9012C15.5942 21.9293 15.7033 21.9697 15.8069 22.0215C18.1928 23.2144 21 21.4795 21 18.812V5C21 2.79086 19.2091 1 17 1H7C4.79086 1 3 2.79086 3 5V18.812C3 21.4795 5.8072 23.2144 8.19308 22.0215C8.29674 21.9697 8.40575 21.9293 8.51818 21.9012L11.5149 21.152C11.8334 21.0724 12.1666 21.0724 12.4851 21.152L15.4818 21.9012ZM5 5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V18.812C19 19.9927 17.7574 20.7607 16.7013 20.2326C16.4672 20.1156 16.2209 20.0244 15.9669 19.9609L12.9701 19.2118C12.3332 19.0525 11.6668 19.0525 11.0299 19.2118L8.03311 19.9609C7.77911 20.0244 7.53283 20.1156 7.29866 20.2326C6.24257 20.7607 5 19.9927 5 18.812V5Z" fill="#475367"/>
                                        </svg>
                                    </div>
                                    <p className={css2.no_spacing}>You currently have</p>
                                    <div className={css2.flex_row_start_bottom}>
                                      <span className={css2.counter}>0</span>
                                      <span>On-going orders</span>
                                    </div>
                                  </div>
                                  <div onClick={handleShowCompletedOrders}>
                                    <div className={css2.flex_row_full_btw}>
                                        <span className={css2.counter_header}>Completed</span>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <rect width="24" height="24" fill="#FCF4F0"/>
                                          <path d="M8 6C7.44772 6 7 6.44772 7 7C7 7.55228 7.44772 8 8 8H16C16.5523 8 17 7.55228 17 7C17 6.44772 16.5523 6 16 6H8Z" fill="#475367"/>
                                          <path d="M7 12C7 11.4477 7.44772 11 8 11H16C16.5523 11 17 11.4477 17 12C17 12.5523 16.5523 13 16 13H8C7.44772 13 7 12.5523 7 12Z" fill="#475367"/>
                                          <path d="M8 16C7.44772 16 7 16.4477 7 17C7 17.5523 7.44772 18 8 18H10.6667C11.219 18 11.6667 17.5523 11.6667 17C11.6667 16.4477 11.219 16 10.6667 16H8Z" fill="#475367"/>
                                          <path d="M13.3333 16C12.781 16 12.3333 16.4477 12.3333 17C12.3333 17.5523 12.781 18 13.3333 18H16C16.5523 18 17 17.5523 17 17C17 16.4477 16.5523 16 16 16H13.3333Z" fill="#475367"/>
                                          <path fill-rule="evenodd" clip-rule="evenodd" d="M15.4818 21.9012C15.5942 21.9293 15.7033 21.9697 15.8069 22.0215C18.1928 23.2144 21 21.4795 21 18.812V5C21 2.79086 19.2091 1 17 1H7C4.79086 1 3 2.79086 3 5V18.812C3 21.4795 5.8072 23.2144 8.19308 22.0215C8.29674 21.9697 8.40575 21.9293 8.51818 21.9012L11.5149 21.152C11.8334 21.0724 12.1666 21.0724 12.4851 21.152L15.4818 21.9012ZM5 5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V18.812C19 19.9927 17.7574 20.7607 16.7013 20.2326C16.4672 20.1156 16.2209 20.0244 15.9669 19.9609L12.9701 19.2118C12.3332 19.0525 11.6668 19.0525 11.0299 19.2118L8.03311 19.9609C7.77911 20.0244 7.53283 20.1156 7.29866 20.2326C6.24257 20.7607 5 19.9927 5 18.812V5Z" fill="#475367"/>
                                        </svg>
                                    </div>
                                    <p className={css2.no_spacing}>You currently have</p>
                                    <div className={css2.flex_row_start_bottom}>
                                      <span className={css2.counter}>0</span>
                                      <span>Completed</span>
                                    </div>
                                  </div>
                              </div>
                          </div>
                          <div className={css2.order_tracking}>
                              <div className={css2.flex_row_start}>
                                  <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path fill-rule="evenodd" clip-rule="evenodd" d="M12 1.5C8.40056 1.5 5.20486 3.2299 3.1997 5.89942C1.81871 7.73797 1 10.0248 1 12.5C1 14.9752 1.81871 17.262 3.1997 19.1006C5.20486 21.7701 8.40056 23.5 12 23.5C15.5994 23.5 18.7951 21.7701 20.8003 19.1006C22.1813 17.262 23 14.9752 23 12.5C23 10.0248 22.1813 7.73797 20.8003 5.89942C18.7951 3.2299 15.5994 1.5 12 1.5ZM4.90148 7.4176C5.12565 7.39682 5.38969 7.37293 5.68444 7.34733C5.60258 8.56193 5.53095 9.99456 5.50782 11.5H3.05486C3.2194 10.0099 3.74743 8.63055 4.54856 7.45084C4.65102 7.44104 4.76929 7.42986 4.90148 7.4176ZM4.54856 17.5492C3.74743 16.3695 3.2194 14.9901 3.05486 13.5H5.50782C5.53095 15.0054 5.60258 16.4381 5.68444 17.6527C5.38969 17.6271 5.12565 17.6032 4.90148 17.5824C4.76929 17.5701 4.65102 17.559 4.54856 17.5492ZM7.50806 13.5C7.53297 15.0746 7.61241 16.5714 7.70023 17.8123C8.77446 17.8887 9.94229 17.9564 11 17.9852V13.5H7.50806ZM7.91935 20.3659C7.9254 20.4251 7.93118 20.4809 7.93664 20.5329C8.87517 21.0086 9.90816 21.3245 11 21.4451V19.9859C9.98757 19.9595 8.88779 19.8986 7.86654 19.8288C7.8846 20.0195 7.90151 20.1907 7.91673 20.3403C7.91761 20.3489 7.91848 20.3574 7.91935 20.3659ZM16.0634 20.5329C15.1248 21.0086 14.0918 21.3245 13 21.4451V19.9859C14.0124 19.9595 15.1122 19.8986 16.1335 19.8288C16.1154 20.0195 16.0985 20.1907 16.0833 20.3403C16.0763 20.4091 16.0696 20.4734 16.0634 20.5329ZM16.2998 17.8123C15.2255 17.8887 14.0577 17.9564 13 17.9852V13.5H16.4919C16.467 15.0746 16.3876 16.5714 16.2998 17.8123ZM16.2998 7.18766C16.3876 8.42861 16.467 9.92539 16.4919 11.5H13V7.01476C14.0577 7.0436 15.2255 7.11133 16.2998 7.18766ZM16.1335 5.17121C15.1122 5.10142 14.0124 5.04054 13 5.01407V3.55489C14.0918 3.67552 15.1248 3.99139 16.0634 4.46708C16.0696 4.52656 16.0763 4.59085 16.0833 4.65974C16.0985 4.80931 16.1154 4.98051 16.1335 5.17121ZM7.86654 5.17121C8.88779 5.10142 9.98757 5.04054 11 5.01407V3.55489C9.90816 3.67552 8.87517 3.99139 7.93664 4.46708C7.9304 4.52656 7.92375 4.59085 7.91673 4.65974C7.90151 4.80931 7.8846 4.98051 7.86654 5.17121ZM11 7.01476C9.94229 7.0436 8.77446 7.11133 7.70023 7.18766C7.61241 8.42861 7.53297 9.92539 7.50806 11.5H11V7.01476ZM19.0985 7.4176C18.8744 7.39682 18.6103 7.37293 18.3156 7.34733C18.3974 8.56193 18.4691 9.99456 18.4922 11.5H20.9451C20.7806 10.0099 20.2526 8.63055 19.4514 7.45084C19.349 7.44104 19.2307 7.42986 19.0985 7.4176ZM18.3156 17.6527C18.3974 16.4381 18.4691 15.0054 18.4922 13.5H20.9451C20.7806 14.9901 20.2526 16.3695 19.4514 17.5492C19.349 17.559 19.2307 17.5701 19.0985 17.5824C18.8744 17.6032 18.6103 17.6271 18.3156 17.6527Z" fill="#475367"/>
                                  </svg>

                                  <div className={css2.flex_col_order}>
                                      <span className={css2.header}>Reviews</span>
                                      <p>View feedback from customers who have used your services. </p>
                                  </div>
                              </div>
                              <p className={classNames(css2.no_spacing_main,css2.cust_p)}>Current rating: --</p>
                              <div className={css2.flex_row_center} onClick={e=>{setCurrentTab("reviews"); e.preventDefault(); e.stopPropagation();}}>
                                  <div>
                                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path fill-rule="evenodd" clip-rule="evenodd" d="M29.1543 5.83729C26.7749 2.05424 21.2235 2.05424 18.8441 5.83729L14.9864 11.9708C14.7042 12.4194 14.2516 12.7475 13.7203 12.8772L6.62721 14.6087C2.27171 15.672 0.510317 20.9235 3.43995 24.3592L8.1488 29.8814C8.49442 30.2867 8.66306 30.805 8.62505 31.3256L8.09903 38.5292C7.77091 43.0228 12.3074 46.2157 16.4415 44.5539L23.2095 41.8333C23.7154 41.6299 24.283 41.6299 24.7889 41.8333L31.5569 44.5539C35.691 46.2157 40.2275 43.0228 39.8994 38.5292L39.3734 31.3256C39.3354 30.805 39.504 30.2867 39.8496 29.8814L44.5585 24.3592C47.4881 20.9235 45.7267 15.672 41.3712 14.6087L34.2781 12.8772C33.7468 12.7475 33.2942 12.4194 33.0121 11.9708L29.1543 5.83729ZM22.2301 7.96693C23.0409 6.67769 24.9575 6.67769 25.7684 7.96693L29.6261 14.1004C30.4664 15.4364 31.7971 16.389 33.3295 16.7631L40.4226 18.4946C41.933 18.8633 42.4793 20.6327 41.5148 21.7638L36.8059 27.2861C35.7814 28.4875 35.269 30.0415 35.384 31.6169L35.91 38.8205C36.0169 40.2842 34.5117 41.4305 33.0488 40.8425L26.2808 38.1219C24.8175 37.5337 23.1809 37.5337 21.7176 38.1219L14.9496 40.8425C13.4867 41.4306 11.9815 40.2842 12.0884 38.8205L12.6144 31.6169C12.7295 30.0415 12.217 28.4875 11.1925 27.2861L6.48363 21.7638C5.51913 20.6327 6.06546 18.8633 7.5758 18.4946L14.6689 16.7631C16.2014 16.389 17.532 15.4364 18.3723 14.1004L22.2301 7.96693Z" fill="#475367"/>
                                    </svg>

                                    <span className={css2.rate_header}>You currently have no ratings</span>
                                  </div>
                              </div>
                              <button className={css2.all_reviews_btn}>View all reviews</button>
                          </div>
                        </div>
                    :""}

                    {currentTab === "messages"?
                      <Messages/>
                    :""}

                    {currentTab === "earnings"?
                      <Earnings setShowManagePayoutOptions={setShowManagePayoutOptions} showManagePayoutOptions={showManagePayoutOptions} transactions={transactions} />
                    :""}

                    {currentTab === "settings"?
                      <Settings setShowVerifyCodeSettings={setShowVerifyCodeSettings}/>
                    :""}

                    {currentTab === "paymentSettings"?

                    <>
                      {/* <PaymentSetting setShowVerifyCodeSettings={setShowVerifyCodeSettings} setShowRemoveAccount={setShowRemoveAccount}/> */}
                      
                      <div className={css.main_con}>
                          <H3 as="h1" className={css2.header}>
                            <FormattedMessage id="StripePayoutPage.heading" />
                          </H3>
                          {!currentUserLoaded ? (
                            <FormattedMessage id="StripePayoutPage.loadingData" />
                          ) : returnedAbnormallyFromStripe && !getAccountLinkError ? (
                            <FormattedMessage id="StripePayoutPage.redirectingToStripe" />
                          ) : (
                            <StripeConnectAccountForm
                              rootClassName={css.stripeConnectAccountForm}
                              disabled={formDisabled}
                              inProgress={payoutDetailsSaveInProgress}
                              ready={payoutDetailsSaved}
                              currentUser={ensuredCurrentUser}
                              stripeBankAccountLastDigits={getBankAccountLast4Digits(stripeAccountData)}
                              savedCountry={savedCountry}
                              savedAccountType={savedAccountType}
                              submitButtonText={intl.formatMessage({
                                id: 'StripePayoutPage.submitButtonText',
                              })}
                              stripeAccountError={
                                createStripeAccountError || updateStripeAccountError || fetchStripeAccountError
                              }
                              stripeAccountLinkError={getAccountLinkError}
                              stripeAccountFetched={stripeAccountFetched}
                              onChange={onPayoutDetailsChange}
                              onSubmit={onPayoutDetailsSubmit}
                              onGetStripeConnectAccountLink={handleGetStripeConnectAccountLink}
                              stripeConnected={stripeConnected}
                            >
                              {stripeConnected && !returnedAbnormallyFromStripe && showVerificationNeeded ? (
                                <StripeConnectAccountStatusBox
                                  type="verificationNeeded"
                                  inProgress={getAccountLinkInProgress}
                                  onGetStripeConnectAccountLink={handleGetStripeConnectAccountLink(
                                    'custom_account_verification'
                                  )}
                                />
                              ) : stripeConnected && savedCountry && !returnedAbnormallyFromStripe ? (
                                <StripeConnectAccountStatusBox
                                  type="verificationSuccess"
                                  inProgress={getAccountLinkInProgress}
                                  disabled={payoutDetailsSaveInProgress}
                                  onGetStripeConnectAccountLink={handleGetStripeConnectAccountLink(
                                    'custom_account_update'
                                  )}
                                />
                              ) : null}
                            </StripeConnectAccountForm>
                          )}
                        </div>

                    </>
                      






                    :""}

                    {currentTab === "notificationSettings"?
                      <NotificationSetting setShowNotificationUpdated={setShowNotificationUpdated}/>
                    :""}

                    {currentTab === "listings"?
                        <div className={css.list_con}>
                            
                            <div className={css2.flex_title}>


                                <div className={css2.mylisting_card_2}>
                                  <button onClick={showDashboard} className={css2.back_to_dashboard}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                      <path d="M15.8327 9.99935H4.16602M4.16602 9.99935L9.99935 15.8327M4.16602 9.99935L9.99935 4.16602" stroke="#0F172A" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                  <span>Back to Dashboard</span>
                                  </button>
                                </div>

                                <h1 className={css2.header_2}>Listings</h1>
                                  <p className={css2.sub_header_2}>
                                  Manage your listings
                                </p>
                            </div>
                              
                            <div className={css2.your_listing_con}>
                                  <div className={css2.flex_grid}>
                                    {ownEntities !== undefined && ownEntities.hasOwnProperty("ownListing") && Object.values(ownEntities.ownListing).map((listing,key)=>{
                                      const {id}=listing;
                                      const {publicData,state}=listing.attributes;
                                      const {listingType,coverPhoto="",catalog=[],category} = publicData;
                                      const isDraft = state === "draft";

                                      let firstImageInCatId = ""; 
                                      if(catalog.length > 0 && catalog[0].hasOwnProperty("images")){
                                        firstImageInCatId = catalog[0].images[0];
                                      }

                                      let img = "";
                                        if(coverPhoto !== undefined && coverPhoto !== ""){
                                            img = coverPhoto;
                                        }else if(ownEntities.hasOwnProperty("image")){
                                          const firstImageId = Object.keys(ownEntities?.image)[0];
                                          img = ownEntities?.image[firstImageInCatId]?.attributes?.variants["scaled-medium"]?.url;
                                        }

                                        if(state === "closed"){
                                          return "";
                                        }
                                      return(
                                        <div key={key} className={css2.mylisting_card}>
                                          <div className={css2.img_con}>

                                              {img !== undefined && img !== ""?
                                                <div className={css2.image_con}>
                                                  {isDraft?
                                                    <div onClick={event=>{handleEditListing(event,listing)}} className={css2.draft_overlay}>
                                                      <div className={css2.text_center}>
                                                        <h5>Draft</h5>
                                                        <p>Click to complete</p>
                                                      </div>
                                                    </div>
                                                  :""}
                                                  <img className={css2.resizeimg}  src={img}  onClick={event=>{handleEditListing(event,listing)}}/>
                                                </div>
                                                :
                                                <div className={css2.image_con}>
                                                  {isDraft?
                                                    <div onClick={event=>{handleEditListing(event,listing)}} className={css2.draft_overlay}>
                                                      <div className={css2.text_center}>
                                                        <h5>Draft</h5>
                                                        <p>Click to complete</p>
                                                      </div>
                                                    </div>
                                                  :""}
                                                  <img  className={css2.resizeimg} src={list1}  onClick={event=>{handleEditListing(event,listing)}}/>
                                                </div>
                                                
                                              }

                                          </div>
                                          <div className={css2.flex_row_center_2}>
                                            <h2 className={css2.caption}>{category}</h2>
                                            <div className={css2.remove_con} onClick={e=>{handleSetListingToClose(e,id,state)}}>
                                              {closeListingInProgress?
                                                <CircularProgress size={20} sx={{ color: 'gray'}}/>
                                              :""}
                                              <span>Remove Listing</span>
                                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path d="M7.91708 1.45898C7.57069 1.45898 7.26043 1.67326 7.13775 1.99719L6.94643 2.50243C6.53628 2.46144 6.15838 2.42054 5.85247 2.38619C5.6238 2.36052 5.43582 2.33856 5.30524 2.32305L5.15462 2.30497L5.10346 2.29871C4.64672 2.24216 4.22996 2.56649 4.1734 3.02324C4.11683 3.47999 4.44125 3.89611 4.898 3.95267L4.95366 3.95947L5.10864 3.97808C5.24226 3.99395 5.43382 4.01632 5.66651 4.04245C6.13148 4.09466 6.76256 4.16206 7.42467 4.22248C8.31782 4.30399 9.29685 4.37565 10.0004 4.37565C10.704 4.37565 11.683 4.30399 12.5761 4.22248C13.2383 4.16206 13.8694 4.09466 14.3343 4.04245C14.567 4.01632 14.7586 3.99395 14.8922 3.97808L15.0472 3.95947L15.1027 3.95268C15.5595 3.89612 15.884 3.47999 15.8274 3.02324C15.7709 2.56649 15.3548 2.24208 14.898 2.29863L14.8462 2.30497L14.6956 2.32305C14.565 2.33856 14.377 2.36052 14.1484 2.38619C13.8424 2.42054 13.4645 2.46144 13.0544 2.50243L12.8631 1.99719C12.7404 1.67326 12.4301 1.45898 12.0837 1.45898H7.91708Z" fill="#475367"/>
                                                <path d="M9.16708 9.79232C9.16708 9.33208 8.79398 8.95898 8.33375 8.95898C7.87351 8.95898 7.50041 9.33208 7.50041 9.79232V13.959C7.50041 14.4192 7.87351 14.7923 8.33375 14.7923C8.79398 14.7923 9.16708 14.4192 9.16708 13.959V9.79232Z" fill="#475367"/>
                                                <path d="M11.6671 8.95898C12.1273 8.95898 12.5004 9.33208 12.5004 9.79232V13.959C12.5004 14.4192 12.1273 14.7923 11.6671 14.7923C11.2068 14.7923 10.8337 14.4192 10.8337 13.959V9.79232C10.8337 9.33208 11.2068 8.95898 11.6671 8.95898Z" fill="#475367"/>
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M15.7585 6.70945C15.834 5.65214 14.9224 4.80451 13.8865 4.92423C12.8265 5.04674 11.1907 5.20898 10.0004 5.20898C8.81013 5.20898 7.17436 5.04674 6.11433 4.92423C5.07839 4.80451 4.16685 5.65214 4.24237 6.70945L4.95631 16.7047C5.01043 17.4624 5.5748 18.103 6.34928 18.2194C7.17979 18.3443 8.7037 18.5438 10.0014 18.5423C11.2831 18.5408 12.8132 18.3422 13.6474 18.2184C14.4232 18.1034 14.9904 17.4623 15.0447 16.7024L15.7585 6.70945ZM14.0778 6.57988C14.0807 6.57955 14.0829 6.57974 14.0829 6.57974L14.0851 6.58025C14.087 6.58089 14.0899 6.58241 14.0928 6.58513C14.0947 6.58693 14.0961 6.58913 14.0961 6.58913L14.096 6.5907L13.383 16.5728C12.5574 16.6948 11.1425 16.8743 9.99945 16.8757C8.84399 16.877 7.4378 16.6972 6.61792 16.5744L5.9048 6.5907L5.90474 6.58913C5.90474 6.58913 5.90616 6.58693 5.90806 6.58513C5.91093 6.58241 5.91384 6.58089 5.91569 6.58025L5.91789 6.57974C5.91789 6.57974 5.92011 6.57955 5.923 6.57988C6.9849 6.7026 8.70495 6.87565 10.0004 6.87565C11.2959 6.87565 13.0159 6.7026 14.0778 6.57988Z" fill="#475367"/>
                                              </svg>
                                            
                                            </div>
                                          </div>
                                          
                                        </div>
                                      )
                                    })}
                                  </div>
                            </div>

                            
                            

                          </div>
                    :""}

                    {currentTab === "reviews"?
                      <div className={css.list_con}>
                         <div className={css2.flex_title}>
                              <div className={css2.mylisting_card_2}>
                                <button onClick={showDashboard} className={css2.back_to_dashboard}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M15.8327 9.99935H4.16602M4.16602 9.99935L9.99935 15.8327M4.16602 9.99935L9.99935 4.16602" stroke="#0F172A" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                                  </svg>
                                <span>Back to Dashboard</span>
                                </button>
                              </div>

                              <h1 className={css2.header_2}>Reviews</h1>
                                <p className={css2.sub_header_2}>
                                  View and respond to customer feedback
                                </p>
                          </div>
                          <div className={css2.content_flex_row}>
                            <div className={css2.review_sumary}>
                              <h3 className={css2.title}>Review Summary</h3>
                              <div className={css2.flex_row_btw_normal}>
                                <div>
                                  <h1 className={css2.rate}>
                                    {reviewsRatingsAverage}
                                  </h1>
                                  <span className={css2.rate_txt}>out of 5</span>
                                </div>
                                <Box sx={{ '& > legend': { mt: 2 } }} className={css.rating_con}>
                                      <StyledRating
                                          name="customized-color"
                                          defaultValue={reviewsRatingsAverage}
                                          getLabelText={(value) => `${value} Heart${value !== 1 ? 's' : ''}`}
                                          precision={0.5}
                                          icon={
                                              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                  <path d="M8.26894 1.45105C9.06651 0.182982 10.9335 0.182982 11.7311 1.45105L13.6599 4.5178C13.9406 4.96396 14.3864 5.28413 14.9023 5.41009L18.4489 6.27584C19.9153 6.63382 20.4922 8.38907 19.5187 9.53076L17.1643 12.2919C16.8218 12.6936 16.6515 13.2116 16.6897 13.7356L16.9527 17.3374C17.0615 18.8268 15.5511 19.9116 14.1518 19.3491L10.7678 17.9888C10.2755 17.7909 9.72448 17.7909 9.23217 17.9888L5.84818 19.3491C4.44893 19.9116 2.93851 18.8268 3.04726 17.3374L3.31026 13.7356C3.34853 13.2116 3.17825 12.6936 2.83572 12.2919L0.481292 9.53076C-0.492242 8.38907 0.0846877 6.63382 1.55115 6.27584L5.09768 5.41009C5.61365 5.28413 6.05944 4.96396 6.34006 4.5178L8.26894 1.45105Z" fill="#FFD700"/>
                                              </svg>
                                          }
                                          emptyIcon={
                                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
                                                  <path fill-rule="evenodd" clip-rule="evenodd" d="M11.3159 1.1822C10.3245 -0.394067 8.01142 -0.394068 7.02 1.1822L5.41261 3.73782C5.29504 3.92475 5.10648 4.06146 4.88508 4.11551L1.92963 4.83697C0.114839 5.27999 -0.619074 7.46814 0.601607 8.89967L2.56363 11.2006C2.70764 11.3695 2.7779 11.5854 2.76206 11.8023L2.54289 14.8038C2.40617 16.6762 4.29639 18.0065 6.01892 17.3141L8.83891 16.1805C9.04973 16.0958 9.2862 16.0958 9.49701 16.1805L12.317 17.3141C14.0395 18.0065 15.9298 16.6762 15.793 14.8038L15.5739 11.8023C15.558 11.5854 15.6283 11.3695 15.7723 11.2006L17.7343 8.89967C18.955 7.46815 18.2211 5.27999 16.4063 4.83697L13.4509 4.11551C13.2294 4.06146 13.0409 3.92475 12.9233 3.73782L11.3159 1.1822ZM8.43082 2.06955C8.76868 1.53237 9.56724 1.53237 9.90511 2.06955L11.5125 4.62517C11.8626 5.18184 12.4171 5.57876 13.0556 5.73463L16.011 6.4561C16.6404 6.60972 16.868 7.34697 16.4661 7.81826L14.5041 10.1192C14.0772 10.6198 13.8637 11.2673 13.9116 11.9237L14.1308 14.9252C14.1753 15.5351 13.5482 16.0127 12.9386 15.7677L10.1186 14.6341C9.50892 14.389 8.82701 14.389 8.2173 14.6341L5.3973 15.7677C4.78775 16.0127 4.1606 15.5351 4.20513 14.9252L4.4243 11.9237C4.47224 11.2673 4.25871 10.6198 3.83183 10.1192L1.86981 7.81826C1.46793 7.34697 1.69557 6.60972 2.32488 6.4561L5.28033 5.73463C5.91886 5.57876 6.47329 5.18184 6.82342 4.62517L8.43082 2.06955Z" fill="#EBC600"/>
                                              </svg>
                                          }
                                      />
                                      
                                  </Box>
                              </div>
                              <div className={css2.rate_cat}>
                                  
                                 
                                <div className={css2.flex_row_2}>
                                    <Box sx={{ '& > legend': { mt: 2 } }} className={css.rating_con}>
                                      <StyledRating
                                          name="customized-color"
                                          defaultValue={4}
                                          getLabelText={(value) => `${value} Heart${value !== 1 ? 's' : ''}`}
                                          precision={1}
                                          icon={
                                              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                  <path d="M8.26894 1.45105C9.06651 0.182982 10.9335 0.182982 11.7311 1.45105L13.6599 4.5178C13.9406 4.96396 14.3864 5.28413 14.9023 5.41009L18.4489 6.27584C19.9153 6.63382 20.4922 8.38907 19.5187 9.53076L17.1643 12.2919C16.8218 12.6936 16.6515 13.2116 16.6897 13.7356L16.9527 17.3374C17.0615 18.8268 15.5511 19.9116 14.1518 19.3491L10.7678 17.9888C10.2755 17.7909 9.72448 17.7909 9.23217 17.9888L5.84818 19.3491C4.44893 19.9116 2.93851 18.8268 3.04726 17.3374L3.31026 13.7356C3.34853 13.2116 3.17825 12.6936 2.83572 12.2919L0.481292 9.53076C-0.492242 8.38907 0.0846877 6.63382 1.55115 6.27584L5.09768 5.41009C5.61365 5.28413 6.05944 4.96396 6.34006 4.5178L8.26894 1.45105Z" fill="#FFD700"/>
                                              </svg>
                                          }
                                          emptyIcon={
                                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
                                                  <path fill-rule="evenodd" clip-rule="evenodd" d="M11.3159 1.1822C10.3245 -0.394067 8.01142 -0.394068 7.02 1.1822L5.41261 3.73782C5.29504 3.92475 5.10648 4.06146 4.88508 4.11551L1.92963 4.83697C0.114839 5.27999 -0.619074 7.46814 0.601607 8.89967L2.56363 11.2006C2.70764 11.3695 2.7779 11.5854 2.76206 11.8023L2.54289 14.8038C2.40617 16.6762 4.29639 18.0065 6.01892 17.3141L8.83891 16.1805C9.04973 16.0958 9.2862 16.0958 9.49701 16.1805L12.317 17.3141C14.0395 18.0065 15.9298 16.6762 15.793 14.8038L15.5739 11.8023C15.558 11.5854 15.6283 11.3695 15.7723 11.2006L17.7343 8.89967C18.955 7.46815 18.2211 5.27999 16.4063 4.83697L13.4509 4.11551C13.2294 4.06146 13.0409 3.92475 12.9233 3.73782L11.3159 1.1822ZM8.43082 2.06955C8.76868 1.53237 9.56724 1.53237 9.90511 2.06955L11.5125 4.62517C11.8626 5.18184 12.4171 5.57876 13.0556 5.73463L16.011 6.4561C16.6404 6.60972 16.868 7.34697 16.4661 7.81826L14.5041 10.1192C14.0772 10.6198 13.8637 11.2673 13.9116 11.9237L14.1308 14.9252C14.1753 15.5351 13.5482 16.0127 12.9386 15.7677L10.1186 14.6341C9.50892 14.389 8.82701 14.389 8.2173 14.6341L5.3973 15.7677C4.78775 16.0127 4.1606 15.5351 4.20513 14.9252L4.4243 11.9237C4.47224 11.2673 4.25871 10.6198 3.83183 10.1192L1.86981 7.81826C1.46793 7.34697 1.69557 6.60972 2.32488 6.4561L5.28033 5.73463C5.91886 5.57876 6.47329 5.18184 6.82342 4.62517L8.43082 2.06955Z" fill="#EBC600"/>
                                              </svg>
                                          }
                                      />
                                      
                                  </Box>
                                  <div className={css2.progress}>
                                    <div style={{width:`${reviewsRatings[4]}0%`}} ></div>
                                  </div>
                                  <span className={css2.valu}>{reviewsRatings[4]}</span>
                                </div>
                                <div className={css2.flex_row_2}>
                                    <Box sx={{ '& > legend': { mt: 2 } }} className={css.rating_con}>
                                      <StyledRating
                                          name="customized-color"
                                          defaultValue={3}
                                          getLabelText={(value) => `${value} Heart${value !== 1 ? 's' : ''}`}
                                          precision={1}
                                          icon={
                                              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                  <path d="M8.26894 1.45105C9.06651 0.182982 10.9335 0.182982 11.7311 1.45105L13.6599 4.5178C13.9406 4.96396 14.3864 5.28413 14.9023 5.41009L18.4489 6.27584C19.9153 6.63382 20.4922 8.38907 19.5187 9.53076L17.1643 12.2919C16.8218 12.6936 16.6515 13.2116 16.6897 13.7356L16.9527 17.3374C17.0615 18.8268 15.5511 19.9116 14.1518 19.3491L10.7678 17.9888C10.2755 17.7909 9.72448 17.7909 9.23217 17.9888L5.84818 19.3491C4.44893 19.9116 2.93851 18.8268 3.04726 17.3374L3.31026 13.7356C3.34853 13.2116 3.17825 12.6936 2.83572 12.2919L0.481292 9.53076C-0.492242 8.38907 0.0846877 6.63382 1.55115 6.27584L5.09768 5.41009C5.61365 5.28413 6.05944 4.96396 6.34006 4.5178L8.26894 1.45105Z" fill="#FFD700"/>
                                              </svg>
                                          }
                                          emptyIcon={
                                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
                                                  <path fill-rule="evenodd" clip-rule="evenodd" d="M11.3159 1.1822C10.3245 -0.394067 8.01142 -0.394068 7.02 1.1822L5.41261 3.73782C5.29504 3.92475 5.10648 4.06146 4.88508 4.11551L1.92963 4.83697C0.114839 5.27999 -0.619074 7.46814 0.601607 8.89967L2.56363 11.2006C2.70764 11.3695 2.7779 11.5854 2.76206 11.8023L2.54289 14.8038C2.40617 16.6762 4.29639 18.0065 6.01892 17.3141L8.83891 16.1805C9.04973 16.0958 9.2862 16.0958 9.49701 16.1805L12.317 17.3141C14.0395 18.0065 15.9298 16.6762 15.793 14.8038L15.5739 11.8023C15.558 11.5854 15.6283 11.3695 15.7723 11.2006L17.7343 8.89967C18.955 7.46815 18.2211 5.27999 16.4063 4.83697L13.4509 4.11551C13.2294 4.06146 13.0409 3.92475 12.9233 3.73782L11.3159 1.1822ZM8.43082 2.06955C8.76868 1.53237 9.56724 1.53237 9.90511 2.06955L11.5125 4.62517C11.8626 5.18184 12.4171 5.57876 13.0556 5.73463L16.011 6.4561C16.6404 6.60972 16.868 7.34697 16.4661 7.81826L14.5041 10.1192C14.0772 10.6198 13.8637 11.2673 13.9116 11.9237L14.1308 14.9252C14.1753 15.5351 13.5482 16.0127 12.9386 15.7677L10.1186 14.6341C9.50892 14.389 8.82701 14.389 8.2173 14.6341L5.3973 15.7677C4.78775 16.0127 4.1606 15.5351 4.20513 14.9252L4.4243 11.9237C4.47224 11.2673 4.25871 10.6198 3.83183 10.1192L1.86981 7.81826C1.46793 7.34697 1.69557 6.60972 2.32488 6.4561L5.28033 5.73463C5.91886 5.57876 6.47329 5.18184 6.82342 4.62517L8.43082 2.06955Z" fill="#EBC600"/>
                                              </svg>
                                          }
                                      />
                                      
                                  </Box>
                                  <div className={css2.progress}>
                                    <div style={{width:`${reviewsRatings[3]}0%`}} ></div>
                                  </div>
                                  <span className={css2.valu}>{reviewsRatings[3]}</span>
                                </div>
                                <div className={css2.flex_row_2}>
                                    <Box sx={{ '& > legend': { mt: 2 } }} className={css.rating_con}>
                                      <StyledRating
                                          name="customized-color"
                                          defaultValue={2}
                                          getLabelText={(value) => `${value} Heart${value !== 1 ? 's' : ''}`}
                                          precision={1}
                                          icon={
                                              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                  <path d="M8.26894 1.45105C9.06651 0.182982 10.9335 0.182982 11.7311 1.45105L13.6599 4.5178C13.9406 4.96396 14.3864 5.28413 14.9023 5.41009L18.4489 6.27584C19.9153 6.63382 20.4922 8.38907 19.5187 9.53076L17.1643 12.2919C16.8218 12.6936 16.6515 13.2116 16.6897 13.7356L16.9527 17.3374C17.0615 18.8268 15.5511 19.9116 14.1518 19.3491L10.7678 17.9888C10.2755 17.7909 9.72448 17.7909 9.23217 17.9888L5.84818 19.3491C4.44893 19.9116 2.93851 18.8268 3.04726 17.3374L3.31026 13.7356C3.34853 13.2116 3.17825 12.6936 2.83572 12.2919L0.481292 9.53076C-0.492242 8.38907 0.0846877 6.63382 1.55115 6.27584L5.09768 5.41009C5.61365 5.28413 6.05944 4.96396 6.34006 4.5178L8.26894 1.45105Z" fill="#FFD700"/>
                                              </svg>
                                          }
                                          emptyIcon={
                                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
                                                  <path fill-rule="evenodd" clip-rule="evenodd" d="M11.3159 1.1822C10.3245 -0.394067 8.01142 -0.394068 7.02 1.1822L5.41261 3.73782C5.29504 3.92475 5.10648 4.06146 4.88508 4.11551L1.92963 4.83697C0.114839 5.27999 -0.619074 7.46814 0.601607 8.89967L2.56363 11.2006C2.70764 11.3695 2.7779 11.5854 2.76206 11.8023L2.54289 14.8038C2.40617 16.6762 4.29639 18.0065 6.01892 17.3141L8.83891 16.1805C9.04973 16.0958 9.2862 16.0958 9.49701 16.1805L12.317 17.3141C14.0395 18.0065 15.9298 16.6762 15.793 14.8038L15.5739 11.8023C15.558 11.5854 15.6283 11.3695 15.7723 11.2006L17.7343 8.89967C18.955 7.46815 18.2211 5.27999 16.4063 4.83697L13.4509 4.11551C13.2294 4.06146 13.0409 3.92475 12.9233 3.73782L11.3159 1.1822ZM8.43082 2.06955C8.76868 1.53237 9.56724 1.53237 9.90511 2.06955L11.5125 4.62517C11.8626 5.18184 12.4171 5.57876 13.0556 5.73463L16.011 6.4561C16.6404 6.60972 16.868 7.34697 16.4661 7.81826L14.5041 10.1192C14.0772 10.6198 13.8637 11.2673 13.9116 11.9237L14.1308 14.9252C14.1753 15.5351 13.5482 16.0127 12.9386 15.7677L10.1186 14.6341C9.50892 14.389 8.82701 14.389 8.2173 14.6341L5.3973 15.7677C4.78775 16.0127 4.1606 15.5351 4.20513 14.9252L4.4243 11.9237C4.47224 11.2673 4.25871 10.6198 3.83183 10.1192L1.86981 7.81826C1.46793 7.34697 1.69557 6.60972 2.32488 6.4561L5.28033 5.73463C5.91886 5.57876 6.47329 5.18184 6.82342 4.62517L8.43082 2.06955Z" fill="#EBC600"/>
                                              </svg>
                                          }
                                      />
                                      
                                  </Box>
                                  <div className={css2.progress}>
                                    <div style={{width:`${reviewsRatings[2]}0%`}} ></div>
                                  </div>
                                  <span className={css2.valu}>{reviewsRatings[2]}</span>
                                </div>
                                <div className={css2.flex_row_2}>
                                    <Box sx={{ '& > legend': { mt: 2 } }} className={css.rating_con}>
                                      <StyledRating
                                          name="customized-color"
                                          defaultValue={1}
                                          getLabelText={(value) => `${value} Heart${value !== 1 ? 's' : ''}`}
                                          precision={1}
                                          icon={
                                              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                  <path d="M8.26894 1.45105C9.06651 0.182982 10.9335 0.182982 11.7311 1.45105L13.6599 4.5178C13.9406 4.96396 14.3864 5.28413 14.9023 5.41009L18.4489 6.27584C19.9153 6.63382 20.4922 8.38907 19.5187 9.53076L17.1643 12.2919C16.8218 12.6936 16.6515 13.2116 16.6897 13.7356L16.9527 17.3374C17.0615 18.8268 15.5511 19.9116 14.1518 19.3491L10.7678 17.9888C10.2755 17.7909 9.72448 17.7909 9.23217 17.9888L5.84818 19.3491C4.44893 19.9116 2.93851 18.8268 3.04726 17.3374L3.31026 13.7356C3.34853 13.2116 3.17825 12.6936 2.83572 12.2919L0.481292 9.53076C-0.492242 8.38907 0.0846877 6.63382 1.55115 6.27584L5.09768 5.41009C5.61365 5.28413 6.05944 4.96396 6.34006 4.5178L8.26894 1.45105Z" fill="#FFD700"/>
                                              </svg>
                                          }
                                          emptyIcon={
                                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
                                                  <path fill-rule="evenodd" clip-rule="evenodd" d="M11.3159 1.1822C10.3245 -0.394067 8.01142 -0.394068 7.02 1.1822L5.41261 3.73782C5.29504 3.92475 5.10648 4.06146 4.88508 4.11551L1.92963 4.83697C0.114839 5.27999 -0.619074 7.46814 0.601607 8.89967L2.56363 11.2006C2.70764 11.3695 2.7779 11.5854 2.76206 11.8023L2.54289 14.8038C2.40617 16.6762 4.29639 18.0065 6.01892 17.3141L8.83891 16.1805C9.04973 16.0958 9.2862 16.0958 9.49701 16.1805L12.317 17.3141C14.0395 18.0065 15.9298 16.6762 15.793 14.8038L15.5739 11.8023C15.558 11.5854 15.6283 11.3695 15.7723 11.2006L17.7343 8.89967C18.955 7.46815 18.2211 5.27999 16.4063 4.83697L13.4509 4.11551C13.2294 4.06146 13.0409 3.92475 12.9233 3.73782L11.3159 1.1822ZM8.43082 2.06955C8.76868 1.53237 9.56724 1.53237 9.90511 2.06955L11.5125 4.62517C11.8626 5.18184 12.4171 5.57876 13.0556 5.73463L16.011 6.4561C16.6404 6.60972 16.868 7.34697 16.4661 7.81826L14.5041 10.1192C14.0772 10.6198 13.8637 11.2673 13.9116 11.9237L14.1308 14.9252C14.1753 15.5351 13.5482 16.0127 12.9386 15.7677L10.1186 14.6341C9.50892 14.389 8.82701 14.389 8.2173 14.6341L5.3973 15.7677C4.78775 16.0127 4.1606 15.5351 4.20513 14.9252L4.4243 11.9237C4.47224 11.2673 4.25871 10.6198 3.83183 10.1192L1.86981 7.81826C1.46793 7.34697 1.69557 6.60972 2.32488 6.4561L5.28033 5.73463C5.91886 5.57876 6.47329 5.18184 6.82342 4.62517L8.43082 2.06955Z" fill="#EBC600"/>
                                              </svg>
                                          }
                                      />
                                      
                                  </Box>
                                  <div className={css2.progress}>
                                    <div style={{width:`${reviewsRatings[1]}0%`}} ></div>
                                  </div>
                                  <span className={css2.valu}>{reviewsRatings[1]}</span>
                                </div>

                              </div>

                              <div className={css2.flex_col_3}>
                                <h3 className={css2.title}>Service Breakdown</h3>

                                  {Object.keys(reviewsByListing).map((itm,key)=>{
                                    return(
                                      <div className={css2.flex_row_normal_2}>
                                        <button className={css2.serv_btn}>{itm}</button>
                                        <span>{reviewsByListing[itm]} reviews</span>
                                      </div>
                                    )
                                  })}
                                 
                              </div>

                              <div className={css2.flex_col_4}>
                                <h3 className={css2.title}>Response Rate</h3>
                                <div className={css2.progress_response}>
                                    <div style={{width:"60%"}} ></div>
                                </div>
                                <p>You've responded to 4 out of 6 reviews</p>
                              </div>
                              
                             
                            </div>
                            <div className={css2.review_all}>
                              <h3 className={css2.title}>All Reviews</h3>
                              {reviews.length > 0 && reviews.map((itm,key)=>{

                                const category = itm?.listing?.attributes?.publicData?.category;
                                const {content,rating,createdAt} = itm.attributes;
                                const {abbreviatedName,displayName} = itm.author.attributes.profile

                               return(
                                      <>
                                        <div className={css.flex_col}>
                                          <div className={css2.flex_row_2}>
                                          <div className={css2.profile_txt}>{abbreviatedName}</div>
                                          <div className={css2.flex_row_2}>
                                            <div>
                                              <span>{displayName}</span>
                                              <Box sx={{ '& > legend': { mt: 2 } }} className={css.rating_con}>
                                                  <StyledRating
                                                      name="customized-color"
                                                      defaultValue={rating}
                                                      getLabelText={(value) => `${value} Heart${value !== 1 ? 's' : ''}`}
                                                      precision={1}
                                                      icon={
                                                          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                              <path d="M8.26894 1.45105C9.06651 0.182982 10.9335 0.182982 11.7311 1.45105L13.6599 4.5178C13.9406 4.96396 14.3864 5.28413 14.9023 5.41009L18.4489 6.27584C19.9153 6.63382 20.4922 8.38907 19.5187 9.53076L17.1643 12.2919C16.8218 12.6936 16.6515 13.2116 16.6897 13.7356L16.9527 17.3374C17.0615 18.8268 15.5511 19.9116 14.1518 19.3491L10.7678 17.9888C10.2755 17.7909 9.72448 17.7909 9.23217 17.9888L5.84818 19.3491C4.44893 19.9116 2.93851 18.8268 3.04726 17.3374L3.31026 13.7356C3.34853 13.2116 3.17825 12.6936 2.83572 12.2919L0.481292 9.53076C-0.492242 8.38907 0.0846877 6.63382 1.55115 6.27584L5.09768 5.41009C5.61365 5.28413 6.05944 4.96396 6.34006 4.5178L8.26894 1.45105Z" fill="#FFD700"/>
                                                          </svg>
                                                      }
                                                      emptyIcon={
                                                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
                                                              <path fill-rule="evenodd" clip-rule="evenodd" d="M11.3159 1.1822C10.3245 -0.394067 8.01142 -0.394068 7.02 1.1822L5.41261 3.73782C5.29504 3.92475 5.10648 4.06146 4.88508 4.11551L1.92963 4.83697C0.114839 5.27999 -0.619074 7.46814 0.601607 8.89967L2.56363 11.2006C2.70764 11.3695 2.7779 11.5854 2.76206 11.8023L2.54289 14.8038C2.40617 16.6762 4.29639 18.0065 6.01892 17.3141L8.83891 16.1805C9.04973 16.0958 9.2862 16.0958 9.49701 16.1805L12.317 17.3141C14.0395 18.0065 15.9298 16.6762 15.793 14.8038L15.5739 11.8023C15.558 11.5854 15.6283 11.3695 15.7723 11.2006L17.7343 8.89967C18.955 7.46815 18.2211 5.27999 16.4063 4.83697L13.4509 4.11551C13.2294 4.06146 13.0409 3.92475 12.9233 3.73782L11.3159 1.1822ZM8.43082 2.06955C8.76868 1.53237 9.56724 1.53237 9.90511 2.06955L11.5125 4.62517C11.8626 5.18184 12.4171 5.57876 13.0556 5.73463L16.011 6.4561C16.6404 6.60972 16.868 7.34697 16.4661 7.81826L14.5041 10.1192C14.0772 10.6198 13.8637 11.2673 13.9116 11.9237L14.1308 14.9252C14.1753 15.5351 13.5482 16.0127 12.9386 15.7677L10.1186 14.6341C9.50892 14.389 8.82701 14.389 8.2173 14.6341L5.3973 15.7677C4.78775 16.0127 4.1606 15.5351 4.20513 14.9252L4.4243 11.9237C4.47224 11.2673 4.25871 10.6198 3.83183 10.1192L1.86981 7.81826C1.46793 7.34697 1.69557 6.60972 2.32488 6.4561L5.28033 5.73463C5.91886 5.57876 6.47329 5.18184 6.82342 4.62517L8.43082 2.06955Z" fill="#EBC600"/>
                                                          </svg>
                                                      }
                                                  />
                                              </Box>
                                            </div>
                                            
                                            <span className={css2.date}>{createdAt.toDateString()}</span>
                                          </div>
                                          <button className={css2.serv_btn}>{category}</button>
                                        </div>
                                        <p className={css.review_content}>
                                         {content}
                                        </p>
                                        {/* <div className={css2.review_reply_con}>
                                          <h3 className={css2.title}>Your Response:</h3>
                                          <p>
                                            Sarah did an amazing job with the catering for our company event. The food was delicious and presentation was perfect! Would definitely hire again for our next corporate function.
                                          </p>
                                        </div> */}
                                      </div>

                                      <div className={css2.divider}></div>
                                      </>
                               ) 
                             
                                
                              })}
                              
                            </div>
                            
                          </div>
                      </div>
                    :""}
                    {currentTab === "orders"?
                      <div className={css.list_con}>
                         <div className={css2.flex_title}>
                              <div className={css2.mylisting_card_2}>
                                <button onClick={showDashboard} className={css2.back_to_dashboard}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M15.8327 9.99935H4.16602M4.16602 9.99935L9.99935 15.8327M4.16602 9.99935L9.99935 4.16602" stroke="#0F172A" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                                  </svg>
                                <span>Back to Dashboard</span>
                                </button>
                              </div>

                              <h1 className={css2.header_2}>Orders</h1>
                                <p className={css2.sub_header_2}>
                                  Manage and track all your service orders
                                </p>
                          </div>
                          <div className={css2.content_detail}>
                            <div className={css2.order_tab}>
                              <button onClick={e=>{setOrderTab("allOrders")}} className={orderTab === "allOrders"?css2.tab_btn:css2.tab_btn_active}>
                                All Orders <span>(10)</span>
                              </button>
                              <button onClick={e=>{setOrderTab("onGoingOrders")}} className={orderTab === "onGoingOrders"?css2.tab_btn:css2.tab_btn_active}>
                                Ongoing Orders <span>(4)</span>
                              </button>
                              <button onClick={e=>{setOrderTab("completedOrders")}} className={orderTab === "completedOrders"?css2.tab_btn:css2.tab_btn_active}>
                                Completed Orders <span>(6)</span>
                              </button>
                            </div>

                            {orderTab === "allOrders"?
                                <ALLOrders orders={transactions} />
                            :orderTab === "onGoingOrders"?
                                <OnGoingOrders orders={getOngoingTransactions(transactions)} />
                            :orderTab === "completedOrders"?
                                <CompletedOrder orders={getCompletedTransactions(transactions)} />
                            :
                               ""
                            }
                            
                          </div>
                      </div>
                    :""}
                </div>
              </div>

      </LayoutSingleColumn>
      {curentPage === "userType"?
      <UserTypeForm
       moveNext={moveNext} 
       currentSelectedUserType={currentSelectedUserType}
       setCurrentSelectedUserType={handleSaveCurrentSelectedUserType}
       handleHideForm={handleHideForm}
       onUpdateProfile={onUpdateProfile}
       userTypeSaved={userTypeSaved}
       setUserTypeIsComplete={setUserTypeIsComplete}
       />
    :curentPage === "businessProfile"?
      <BusinessProfileForm
       onSetSelectedFile={onSetSelectedFile}
       handleMoveBack={handleMoveBack}
       handleHideForm={handleHideForm}
       moveNext={moveNext} 
       image={image}
       onImageUpload={e => onImageUploadHandler(e, onImageUpload)}
       onUpdateProfile={onUpdateProfile}
       publicData={currentUser.attributes.profile.publicData}
       profileImage={currentUser.profileImage}
       setBusinessIsComplete={setBusinessIsComplete}
       setCurrentPage={setCurrentPage}
      />
    :curentPage === "personalProfile"?
      <PersonalProfileForm
        onSetSelectedFile={onSetSelectedFile}
        handleMoveBack={handleMoveBack}
        handleHideForm={handleHideForm}
        moveNext={moveNext}
        image={image}
        onImageUpload={e => onImageUploadHandler(e, onImageUpload)}
        onUpdateProfile={onUpdateProfile}
        publicData={currentUser.attributes.profile.publicData}
        profileImage={currentUser.profileImage}
        setPersonalIsComplete={setPersonalIsComplete}
        setCurrentPage={setCurrentPage}
      />
    :curentPage === "saveProfile"?
      <SaveProfileForm onSetSelectedFile={onSetSelectedFile} 
        handleMoveBack={handleMoveBack}
        handleHideForm={handleHideForm}
        currentSelectedUserType={currentSelectedUserType}
        serviceAreas={serviceAreas}
        setServiceAreas={handleSetService}
        handleRemove={handleRemove}
        moveNext={moveNext}
        onUpdateProfile={onUpdateProfile}
        publicData={currentUser.attributes.profile.publicData}
        setSaveProfileIsComplete={setSaveProfileIsComplete}
        setCurrentPage={setCurrentPage}
      />
    :curentPage === "profileCompleted"?
      <ProfileCompleteForm onSetSelectedFile={onSetSelectedFile} 
        handleMoveBack={handleMoveBack}
        handleHideForm={handleHideForm}
        currentSelectedUserType={currentSelectedUserType}
        serviceAreas={serviceAreas}
        setServiceAreas={handleSetService}
        handleRemove={handleRemove}
        onUpdateProfile={onUpdateProfile}
        publicData={currentUser.attributes.profile.publicData}
        setCurrentPage={setCurrentPage}

      />:""
    }

    {showManagePayoutOptions?
      <div onClick={setShowManagePayoutOptions(false)} className={css2.overlay}>
        <div className={css2.formContent}>
          <div className={css2.header_con}>
            <div className={css2.flex_col_normal}>
              <span className={css2.header_manage}>
                Payout Method
              </span>
              <p>
                Choose and add your preferred method of withdrawal
              </p>
            </div>
            <div className={css2.close_btn}>
              <svg onClick={handleClose} className={css2.close} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M7.05086 5.63664C6.66033 5.24612 6.02717 5.24612 5.63664 5.63664C5.24612 6.02717 5.24612 6.66033 5.63664 7.05086L10.5864 12.0006L5.63664 16.9504C5.24612 17.3409 5.24612 17.974 5.63664 18.3646C6.02717 18.7551 6.66033 18.7551 7.05086 18.3646L12.0006 13.4148L16.9504 18.3646C17.3409 18.7551 17.974 18.7551 18.3646 18.3646C18.7551 17.974 18.7551 17.3409 18.3646 16.9504L13.4148 12.0006L18.3646 7.05086C18.7551 6.66033 18.7551 6.02717 18.3646 5.63664C17.974 5.24612 17.3409 5.24612 16.9504 5.63664L12.0006 10.5864L7.05086 5.63664Z" fill="black"/>
              </svg>
            </div>
            
          </div>
          <div onClick={e=>{handleAddOption(e,"ApplePay")}} className={css2.pay_options}>
            <svg xmlns="http://www.w3.org/2000/svg" width="66" height="42" viewBox="0 0 66 42" fill="none">
              <path d="M43.2899 22.715V23.5791C43.2283 24.9791 42.0708 26.0925 40.6514 26.0925C40.5898 26.0925 40.526 26.0903 40.4666 26.0859H40.4754C39.2607 26.0859 38.4663 25.4625 38.4663 24.5022C38.4663 23.5681 39.2299 22.9709 40.581 22.8813L43.2899 22.715ZM46.4984 16.73L50.4749 27.6894C50.4749 27.6981 50.2746 28.3456 50.2746 28.3653C50.1448 29.2556 49.3812 29.9316 48.4591 29.9316C48.4107 29.9316 48.3601 29.9294 48.3117 29.925H48.3183C48.2809 29.9272 48.2347 29.9272 48.1884 29.9272C47.975 29.9272 47.7659 29.9119 47.5613 29.8813L47.5855 29.8834V31.7034C47.8606 31.7341 48.1796 31.7537 48.5031 31.7559C50.7851 31.7559 51.8766 30.9028 52.8163 28.2494L56.9402 16.73H54.5525L51.7688 25.6397H51.727L48.9411 16.7278L46.4984 16.73ZM41.1642 16.5331C38.4421 16.5331 36.7476 17.99 36.6222 19.9675H38.7589C38.9834 19.0334 39.8174 18.3488 40.8099 18.3488C40.9067 18.3488 40.9991 18.3553 41.0916 18.3684L41.0806 18.3662C42.4603 18.3662 43.2877 19.0925 43.2877 20.3109V21.1553L40.2707 21.3303C37.6564 21.4769 36.1798 22.6538 36.1798 24.5678C36.182 26.3988 37.674 27.8841 39.5181 27.8841C39.6326 27.8841 39.747 27.8775 39.857 27.8666L39.8438 27.8687C39.8592 27.8687 39.879 27.8687 39.8966 27.8687C41.3578 27.8687 42.632 27.0769 43.3097 25.9L43.3208 25.8803H43.3736V27.6806H45.5411V20.1359C45.5411 17.9419 43.8357 16.5353 41.1664 16.5353L41.1642 16.5331ZM18.6038 15.4481C17.367 15.4744 16.3218 16.2138 15.7166 16.2138C15.0696 16.2138 14.086 15.4919 13.0187 15.5116C11.5663 15.5487 10.3119 16.3537 9.64737 17.5328L9.63637 17.5525C9.23806 18.4931 9.007 19.5891 9.007 20.7353C9.007 22.6187 9.62977 24.3578 10.6794 25.7622L10.664 25.7403C11.3484 26.74 12.1736 27.8425 13.2607 27.8009C14.2862 27.7638 14.6911 27.1403 15.9367 27.1403C17.1844 27.1403 17.5475 27.8009 18.6324 27.7834C19.7591 27.7638 20.4677 26.7838 21.1476 25.7797C21.6076 25.1191 21.9905 24.3578 22.2567 23.5441L22.2743 23.4806C20.9826 22.9075 20.0958 21.6453 20.0826 20.1775C20.1002 18.8716 20.7977 17.7275 21.8386 17.0822L21.854 17.0734C21.1762 16.1262 20.0958 15.5028 18.8656 15.4525H18.8568C18.7732 15.4467 18.6889 15.4452 18.6038 15.4481ZM27.2763 14.6278H29.9764C30.0908 14.6103 30.2251 14.6016 30.3593 14.6016C31.9151 14.6016 33.176 15.855 33.176 17.4016C33.176 17.4737 33.1738 17.5438 33.1672 17.6138V17.605C33.1716 17.6641 33.1738 17.7341 33.1738 17.8062C33.1738 19.3594 31.9085 20.6172 30.3461 20.6172C30.2119 20.6172 30.0798 20.6084 29.95 20.5909L29.9654 20.5931H27.2741L27.2763 14.6278ZM24.9348 12.6634V27.6784H27.2785V22.5466H30.5221C30.5992 22.5509 30.6894 22.5531 30.7796 22.5531C33.4269 22.5531 35.5725 20.4203 35.5725 17.7887C35.5725 17.7188 35.5703 17.6509 35.5681 17.5831V17.5919C35.5725 17.5241 35.5747 17.4431 35.5747 17.3644C35.5747 14.7613 33.4533 12.6525 30.8346 12.6525C30.751 12.6525 30.6674 12.6547 30.586 12.6591H30.597L24.9348 12.6634ZM18.8656 11.515C17.893 11.6112 17.0457 12.0728 16.4494 12.7575L16.445 12.7619C15.9014 13.3656 15.5692 14.1662 15.5692 15.0456C15.5692 15.1244 15.5714 15.2053 15.578 15.2819V15.2709C15.5956 15.2709 15.6154 15.2709 15.6352 15.2709C16.599 15.2709 17.4573 14.8269 18.014 14.1334L18.0184 14.1269C18.5509 13.4947 18.8744 12.6722 18.8744 11.7753C18.8744 11.6834 18.87 11.5938 18.8634 11.5041L18.8656 11.515ZM5.91298 1.4H60.7516C60.932 1.4 61.1125 1.40656 61.2929 1.40875C61.6626 1.41531 62.0191 1.44594 62.3668 1.50281L62.3228 1.49625C62.6177 1.54656 62.884 1.63625 63.1282 1.76094L63.1128 1.75438C63.597 2.00156 63.9821 2.38437 64.2263 2.8525L64.2329 2.86562C64.3518 3.09312 64.442 3.35781 64.4882 3.63781L64.4904 3.65312C64.541 3.95719 64.5718 4.31156 64.5762 4.6725V4.67688C64.5828 4.85406 64.585 5.03125 64.585 5.215V36.7938C64.585 36.9709 64.585 37.1481 64.5762 37.3297C64.5718 37.695 64.541 38.0494 64.4816 38.395L64.4882 38.3556C64.3606 39.1891 63.8434 39.8781 63.1282 40.2434L63.1128 40.25C62.8862 40.3681 62.6221 40.4556 62.3426 40.5037L62.3272 40.5059C62.0213 40.5563 61.667 40.5891 61.3061 40.5934H61.3017L60.7516 40.6022H5.2418C5.06135 40.6022 4.8765 40.5956 4.70265 40.5934C4.33516 40.5891 3.97866 40.5563 3.63097 40.4994L3.67278 40.5059C3.3757 40.4534 3.10943 40.3638 2.86296 40.2412L2.87837 40.2478C2.39424 40.0006 2.00914 39.6178 1.76927 39.1497L1.76267 39.1366C1.64384 38.9091 1.55361 38.6444 1.5074 38.3644L1.5052 38.3491C1.45239 38.045 1.42158 37.6928 1.41718 37.3341V37.3297C1.41424 37.1503 1.41278 36.9709 1.41278 36.7916V5.21281C1.41278 5.03562 1.41278 4.85406 1.41718 4.67469C1.42378 4.30719 1.45679 3.95281 1.5118 3.605L1.5052 3.64875C1.55802 3.35344 1.64824 3.09094 1.77147 2.84812L1.76487 2.86562C2.01354 2.38437 2.39864 2.00375 2.86957 1.76312L2.88277 1.75656C3.11163 1.64062 3.3757 1.55094 3.65517 1.50281L3.67278 1.50062C3.97866 1.45031 4.33516 1.4175 4.69825 1.41312H4.70265C4.8809 1.40656 5.06355 1.40656 5.2418 1.40437L5.91298 1.4ZM5.91298 0C5.49633 0 5.08042 0.00291603 4.66524 0.00874937C4.22073 0.0153119 3.79161 0.0546868 3.3713 0.124687L3.42191 0.118125C2.14117 0.32375 1.08049 1.11781 0.517138 2.20719L0.506135 2.22906C0.330088 2.57031 0.195852 2.96406 0.125434 3.37969L0.121032 3.40375C0.0528142 3.77125 0.0132035 4.19781 0.0110029 4.63094C0.00513469 4.82198 0.00146706 5.01448 0 5.20406V36.7959C0 36.9863 0.00440132 37.1722 0.0088025 37.3625C0.0154043 37.8022 0.0550148 38.2309 0.125434 38.6466L0.118832 38.5984C0.198053 39.0381 0.332289 39.4319 0.519339 39.795L0.508336 39.7709C0.895639 40.5169 1.4898 41.1097 2.21819 41.4838L2.2402 41.4947C2.58129 41.6719 2.97959 41.8053 3.39771 41.8797L3.42191 41.8841C3.79161 41.9475 4.21852 41.9869 4.65424 41.9934H4.65864L5.23079 42.0022L61.3326 41.9934C61.7749 41.9869 62.2062 41.9475 62.6243 41.8775L62.5759 41.8841C63.0182 41.8075 63.4121 41.6741 63.7774 41.4881L63.7532 41.4991C64.5058 41.1163 65.1022 40.5213 65.4785 39.7972L65.4895 39.7753C65.6677 39.4341 65.8019 39.0403 65.8746 38.6247L65.879 38.6006C65.9428 38.2331 65.9824 37.8088 65.989 37.3756V37.3713C65.9956 37.1809 65.9978 36.995 65.9978 36.8025L66 36.1309V5.20844C66 5.01813 65.9934 4.83219 65.989 4.64188C65.9824 4.20219 65.9428 3.77344 65.8724 3.35781L65.879 3.40594C65.6017 1.71719 64.2791 0.400313 62.6023 0.126875L62.5803 0.124687C62.2106 0.0612493 61.7815 0.0218749 61.3436 0.0153124H61.337C60.9218 0.00364577 60.5066 0.000728691 60.0914 0.00656202L5.91298 0Z" fill="black"/>
            </svg>
            <div className={css2.flex_col_2}>
              <span className={css2.header_sub}>
                Apple pay
              </span>
              <p className={css2.flow_row_sm_gap}>
                <span>Up to 1 business day</span>
                <span>Fees may apply</span>
              </p>
            </div>
          </div>
           <div onClick={e=>{handleAddOption(e,"GooglePay")}} className={css2.pay_options}>
            <svg xmlns="http://www.w3.org/2000/svg" width="71" height="49" viewBox="0 0 71 49" fill="none">
              <path d="M64.5 1H6.5C3.46243 1 1 3.46243 1 6.5V42.5C1 45.5376 3.46243 48 6.5 48H64.5C67.5376 48 70 45.5376 70 42.5V6.5C70 3.46243 67.5376 1 64.5 1Z" fill="white" stroke="#D9D9D9"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M33.5603 32.015V25.973H36.6786C37.9564 25.973 39.035 25.5449 39.9142 24.7004L40.1252 24.4864C41.7313 22.738 41.6258 20.0144 39.9142 18.3969C39.0584 17.5405 37.8861 17.0767 36.6786 17.1005H31.6729V32.015H33.5603ZM33.5605 24.1414V18.9321H36.7262C37.4063 18.9321 38.0512 19.1937 38.5319 19.6695C39.552 20.6685 39.5754 22.3336 38.5905 23.3683C38.1098 23.8798 37.4297 24.1652 36.7262 24.1414H33.5605ZM48.9293 22.6072C48.1204 21.8579 47.0185 21.4773 45.6234 21.4773C43.8298 21.4773 42.4816 22.1433 41.5906 23.4635L43.2553 24.522C43.8649 23.6181 44.6973 23.1662 45.7524 23.1662C46.4206 23.1662 47.0653 23.416 47.5694 23.8679C48.0618 24.2961 48.3432 24.9145 48.3432 25.5687V26.0087C47.6163 25.6044 46.7019 25.3903 45.5765 25.3903C44.2635 25.3903 43.2084 25.6995 42.423 26.3299C41.6375 26.9602 41.239 27.7928 41.239 28.8513C41.2155 29.8147 41.6258 30.7305 42.3527 31.3489C43.0912 32.015 44.0291 32.348 45.131 32.348C46.4323 32.348 47.4639 31.7652 48.2494 30.5996H48.3314V32.015H50.1368V25.7233C50.1368 24.4031 49.7382 23.3565 48.9293 22.6072ZM43.8066 30.1358C43.4197 29.8503 43.1852 29.3865 43.1852 28.887C43.1852 28.328 43.4432 27.8641 43.9473 27.4954C44.4632 27.1267 45.1081 26.9364 45.8702 26.9364C46.9255 26.9245 47.7462 27.1624 48.3325 27.6381C48.3325 28.4469 48.0159 29.1486 47.3945 29.7433C46.8317 30.3142 46.0696 30.6353 45.2723 30.6353C44.7446 30.6472 44.2287 30.4688 43.8066 30.1358ZM54.193 36.4988L60.5001 21.8103H58.4485L55.5295 29.1367H55.4943L52.5049 21.8103H50.4534L54.5916 31.3608L52.247 36.4988H54.193Z" fill="#3C4043"/>
              <path d="M27.044 24.6662C27.044 24.0834 26.9971 23.5006 26.9034 22.9297H18.9434V26.2242H23.5037C23.3161 27.2828 22.7065 28.2343 21.8155 28.8289V30.9698H24.5353C26.1296 29.4831 27.044 27.2828 27.044 24.6662Z" fill="#4285F4"/>
              <path d="M18.944 33.0393C21.2183 33.0393 23.1409 32.2781 24.5359 30.9698L21.8162 28.829C21.0542 29.3523 20.0812 29.6496 18.944 29.6496C16.7401 29.6496 14.8761 28.1391 14.2079 26.1172H11.406V28.3294C12.8363 31.2196 15.7553 33.0393 18.944 33.0393Z" fill="#34A853"/>
              <path d="M14.208 26.1157C13.8563 25.0572 13.8563 23.9036 14.208 22.8331V20.6328H11.4058C10.1981 23.0472 10.1981 25.9017 11.4058 28.316L14.208 26.1157Z" fill="#FBBC04"/>
              <path d="M18.944 19.3003C20.1515 19.2765 21.3121 19.7404 22.1796 20.5848L24.5946 18.1347C23.0588 16.6837 21.0425 15.8869 18.944 15.9107C15.7553 15.9107 12.8363 17.7423 11.406 20.6324L14.2079 22.8446C14.8761 20.8108 16.7401 19.3003 18.944 19.3003Z" fill="#EA4335"/>
            </svg>
            <div className={css2.flex_col_2}>
              <span className={css2.header_sub}>
                Google pay
              </span>
              <p className={css2.flow_row_sm_gap}>
                <span>Up to 1 business day</span>
                <span>Fees may apply</span>
              </p>
            </div>
          </div>
           <div onClick={e=>{handleAddOption(e,"Paypal")}} className={css2.pay_options}>
           <svg xmlns="http://www.w3.org/2000/svg" width="69" height="47" viewBox="0 0 69 47" fill="none">
              <path d="M48.9494 14.3652L24.9583 40.7728H16.1587C15.5476 40.7728 15.0587 40.1563 15.181 39.5399L21.0474 2.06144C21.1696 1.19845 21.9029 0.582031 22.7584 0.582031H37.6688C47.935 0.951885 50.746 6.25312 48.9127 14.3899L48.9494 14.3652Z" fill="#002C8A"/>
              <path d="M49.3402 11.9258C53.0067 13.8983 53.8622 17.5969 52.64 22.5282C51.0512 29.802 46.2848 32.8841 39.3184 33.0074L37.363 33.1307C36.6297 33.1307 36.1408 33.6238 36.0186 34.3636L34.4298 44.103C34.3076 44.966 33.5743 45.5824 32.7187 45.5824H25.3857C24.7747 45.5824 24.2858 44.966 24.408 44.3496L27.0968 26.7199C27.219 26.1035 49.3402 11.9258 49.3402 11.9258Z" fill="#009BE1"/>
              <path d="M26.9502 27.5803L29.3945 11.9226C29.4747 11.5518 29.6738 11.2179 29.961 10.9728C30.2482 10.7276 30.6075 10.5848 30.9833 10.5664H42.7161C45.5271 10.5664 47.6048 11.0596 49.3158 11.9226C48.7047 17.3473 46.1382 26.1008 33.6721 26.3474H28.2946C27.6835 26.3474 27.0724 26.8405 26.9502 27.5803Z" fill="#001F6B"/>
            </svg>
            <div className={css2.flex_col_2}>
              <span className={css2.header_sub}>
                Paypal
              </span>
              <p className={css2.flow_row_sm_gap}>
                <span>Up to 1 business day</span>
                <span>Fees may apply</span>
              </p>
            </div>
          </div>
           <div onClick={e=>{handleAddOption(e,"BankTransfer")}} className={css2.pay_options}>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M25.2649 4.31269C24.4438 4.039 23.5562 4.039 22.7351 4.31269L6.73509 9.64602C5.10172 10.1905 4 11.719 4 13.4408V17.9992C4 20.2084 5.79086 21.9992 8 21.9992H10V31.9992H8C5.79086 31.9992 4 33.7901 4 35.9992V39.9992C4 42.2084 5.79086 43.9992 8 43.9992H40C42.2091 43.9992 44 42.2084 44 39.9992V35.9992C44 33.7901 42.2091 31.9992 40 31.9992H38V21.9992H40C42.2091 21.9992 44 20.2084 44 17.9992V13.4408C44 11.719 42.8983 10.1905 41.2649 9.64602L25.2649 4.31269ZM34 31.9992V21.9992H30V31.9992H34ZM26 31.9992V21.9992H22V31.9992H26ZM18 31.9992V21.9992H14V31.9992H18ZM8 35.9992V39.9992H40V35.9992H8ZM8 17.9992L8 13.4408L24 8.10742L40 13.4408V17.9992H8Z" fill="#475367"/>
            </svg>
            <div className={css2.flex_col_2}>
              <span className={css2.header_sub}>
                Bank transfer
              </span>
              <p className={css2.flow_row_sm_gap}>
                <span>Up to 1 business day</span>
                <span>Fees may apply</span>
              </p>
            </div>
          </div>
          
        </div>
      </div>
    :""}

    {activePayoutOption === "ApplePay"?
      <div onClick={setActivePayoutOption("")} className={css2.overlay}>
        <div className={css2.formContent}>
          <AddApplePayForm onSubmit={handleSubmit} handleClose={handleClose} handleContinue={handleContinue}/>
        </div>
      </div>
    :""}

    {activePayoutOption === "VerificationCodeApplePay"?
      <div onClick={setActivePayoutOption("")} className={css2.overlay}>
        <div className={css2.formContent}>
          <VerificationCodeApplePayForm 
            onSubmit={handleSubmit} 
            handleClose={handleClose}
            handleContinue={handleContinue}
            handleSubmitVerification={handleSubmitVerification}
          />
        </div>
      </div>
    :""}

    {showVerifyCodeSettings?
      <div onClick={setActivePayoutOption("")} className={css2.overlay}>
        <div className={css2.formContent}>
          <VerificationCodeForm handleClosePasswordUpdated={handleClosePasswordUpdated}/>
        </div>
      </div>
    :""}

    {activePayoutOption === "SuccessfulApplePay"?
          <ApplePayCompleteForm 
            onSubmit={handleSubmit} 
            handleClose={handleClose}
            handleContinue={handleContinue}
            handleSubmitVerification={handleSubmitVerification}
            handleCloseSuccessApplePay={handleCloseSuccessApplePay}
          />
    :""}

    {showNotificationUpdated?
      <div  className={css2.overlay}>
        <div className={css2.formContent}>
          <NotificationUpdate handleCloseNotificationUpdated={handleCloseNotificationUpdated}/>
        </div>
      </div>
    :""}
    

     {showRemoveAccount?
      <div  className={css2.overlay}>
        <div className={css2.formContent}>
          <RemoveAccountDialogue handleCloseNotificationUpdated={handleCloseNotificationUpdated} setShowRemoveAccount={setShowRemoveAccount}/>
        </div>
      </div>
    :""}

    {showCreateListing?
      <div  className={css2.overlay}>
          <ListingMainForm 
            setShowCreateListing={setShowCreateListing}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedSubCategory={selectedSubCategory}
            setSelectedSubCategory={setSelectedSubCategory}
            availabilitySettingIsOn={availability}
            onCreateListingDraft={onCreateListingDraft}
            currentListing={currentListing}
            listingDraft={listingDraft}
            onUpdateListing={onUpdateListing}
            image={image}
            uploadImageError={uploadImageError}
            uploadInProgress={uploadInProgress}
            onImageUpload={e => onImageUploadHandler(e, onImageUpload)}
            ownEntities={ownEntities}
            onPublishListingDraft={onPublishListingDraft}
            listings={listings}
            setCurrentListing={setCurrentListing}
            history={history}
            showCatalogs={showCatalogs}
            currentUser={currentUser}
            lastAction={lastAction}
            isUpdateItem={isUpdateItem}
            updatedListing={updatedListing}
            updateInProgress={updateInProgress}
            setIsDraft={setIsDraft}
            forceUpdate={forceUpdate}
            updateListingSuccess={updateListingSuccess}
            onfetchCurrentData={onFetctCurrentUser}
            getOwnListing={getOwnListing}
            onFetchCurrentListing={onFetchCurrentListing}
            updateListingInProgress={updateListingInProgress}
            selectedFolderName={selectedFolderName}
            setSelectedFolderName={setSelectedFolderName}
            path={path}
            catalogName={catalogName}
          />
      </div>
    :""}

    {showOngoingOrders?
      <div  className={css2.overlay}>
        
          <OngoingPrders setShowOngoingOrders={setShowOngoingOrders} />
        
      </div>
    :""}

    {showCompletedOrders?
      <div  className={css2.overlay}>
        
          <CompletedOrders setShowCompletedOrders={setShowCompletedOrders} currentT/>
        
      </div>
    :""}

    {showCloseListingDialog?
      <div  className={css2.overlay}>
        
          <CloseListingDialog handleCloseListing={handleCloseListing} setShowCloseListingDialog={setShowCloseListingDialog}/>
        
      </div>
    :""}



































    </Page>
  );
};

const mapStateToProps = state => {

const { currentUser } = state.user;
  const {
    userId,
    userShowError,
    queryListingsError,
    userListingRefs,
    reviews = [],
    queryReviewsError,
  } = state.ProfilePage;

const {
    image,
    uploadImageError,
    uploadInProgress,
  } = state.ProfileSettingsPage;

  const {
    createListingDraftInProgress,
    createListingDraftError,
    submittedListingId,
    listingDraft,
    lastAction,
    isUpdateItem,
    updatedListing,
    updateInProgress,
    updateListingSuccess,
    closeListingInProgress,
    closeListingSuccess,
    updateListingInProgress,
  } = state.EditListingPage;

  ////console.log(updatedListing,"   aaaaaaaqqqqqqqq")

  const { fetchInProgress, fetchOrdersOrSalesError, pagination, transactionRefs } = state.InboxPage;

  const {
    messages,
    totalMessages,
    acceptOfferInProgress,
    acceptOfferError,
    acceptOfferSuccess,
    declineOfferInProgress,
    declineOfferError,
    declineOfferSuccess,
  } = state.TransactionPage;

  const userMatches = getMarketplaceEntities(state, [{ type: 'user', id: userId }]);
  const user = userMatches.length === 1 ? userMatches[0] : null;

  // Show currentUser's data if it's not approved yet
  const isCurrentUser = userId?.uuid === currentUser?.id?.uuid;
  const useCurrentUser =
    isCurrentUser && !(isUserAuthorized(currentUser) && hasPermissionToViewData(currentUser));

  const getOwnListing = id => {
      const listings = getMarketplaceEntities(state, [{ id, type: 'ownListing' }]);
      return listings.length === 1 ? listings[0] : null;
    };

  const {
    ownEntities
  } = state.ManageListingsPage;

  const {
    getAccountLinkInProgress,
    getAccountLinkError,
    createStripeAccountError,
    updateStripeAccountError,
    fetchStripeAccountError,
    stripeAccount,
    stripeAccountFetched,
  } = state.stripeConnectAccount;
  //const { currentUser } = state.user;
  const { payoutDetailsSaveInProgress, payoutDetailsSaved } = state.StripePayoutPage;
  return {

    scrollingDisabled: isScrollingDisabled(state),
    currentUser,
    useCurrentUser,
    user,
    userShowError,
    queryListingsError,
    listings: getMarketplaceEntities(state, userListingRefs),
    reviews,
    queryReviewsError,
    image,
    uploadImageError,
    uploadInProgress,
    getOwnListing,
    createListingDraftInProgress,
    createListingDraftError,
    submittedListingId,
    listingDraft,
    ownEntities,
    lastAction,
    isUpdateItem,
    updatedListing,
    updateInProgress,
    updateListingSuccess,
    closeListingInProgress,
    closeListingSuccess,
    updateListingInProgress,
    currentUser,
    getAccountLinkInProgress,
    getAccountLinkError,
    createStripeAccountError,
    updateStripeAccountError,
    fetchStripeAccountError,
    stripeAccount,
    stripeAccountFetched,
    payoutDetailsSaveInProgress,
    payoutDetailsSaved,
    scrollingDisabled: isScrollingDisabled(state),
    transactions: getMarketplaceEntities(state, transactionRefs),
  };
};

const mapDispatchToProps = dispatch => ({

onUpdateProfile: data => dispatch(updateProfile(data)),
  onImageUpload: data => dispatch(uploadImage(data)),
  onUpdateListing: (values,action) => dispatch(requestUpdateListing(values,action)),
  onCreateListingDraft: (values, config) => dispatch(requestCreateListingDraft(values, config)),
  onPublishListingDraft: listingId => dispatch(requestPublishListingDraft(listingId)),
  onCloseListing: (listingId,state) =>dispatch(closeListing(listingId,state)),
  onFetctCurrentUser:()=>dispatch(fetchCurrentUserHasListings()),
  onFetchCurrentListing:(id,lastAction)=>dispatch(getCurrentListing(id,lastAction)),
  onLoadDashboard:()=>dispatch(loadData({},"")),
  onPayoutDetailsChange: () => dispatch(stripeAccountClearError()),
  onPayoutDetailsSubmit: (values, isUpdateCall) =>
    dispatch(savePayoutDetails(values, isUpdateCall)),
  onGetStripeConnectAccountLink: params => dispatch(getStripeConnectAccountLink(params)),
  onFetchTransaction: () => dispatch(loadTransactions({},"")),
});

const StripePayoutPage = compose(
  withRouter,
    connect(
      mapStateToProps,
      mapDispatchToProps
    )
)(StripePayoutPageComponent);

export default StripePayoutPage;










const UserTypeForm = props=>{
const {moveNext,currentSelectedUserType ,setCurrentSelectedUserType,handleHideForm,onUpdateProfile,userTypeSaved} = props;

const [userType, setUserType] = React.useState(currentSelectedUserType);
 const handleChange = (event) => {
    setUserType(event.target.value);
    setCurrentSelectedUserType(userType);
  };

const handleMoveNext = e=>{

  if(userType === "businessOwner"){
    moveNext("businessProfile");
  }else{
    moveNext("personalProfile");
  }

}

const handleSubmit = e=>{
    //Insert current data
    const data = 
    {publicData: {
          userType:"businessOwner"
        }}
    onUpdateProfile(data);
    handleMoveNext();
}

useEffect(()=>{
  //console.log(userTypeSaved);
  setUserType(userTypeSaved);
  handleSubmit();
},[]);

  return (
          <div className={css2.overlay}>

                <div className={css2.modal_complete_profile}>

                    <form>
                      <div className={css2.flex_col}>
                      <span className={css2.header_2}>Complete your profile</span>
                      <p className={classNames(css2.no_spacing,css2.p)}>Are you registering as a Business Owner or a Private Owner?</p>

                      {/* <input type='radio' name='userType' value="businessOwner" id='businessOwner'/> <label for="">I am a business owner</label>
                      <input type='radio' name='userType' value="privateOwner" id='privateOwner'/><label for="">I am a private owner</label>
                      <input type='submit' value='Submit'/> */}

                      <FormControl className={css2.full_w}>
                        <RadioGroup

                          aria-labelledby="demo-radio-buttons-group-label"
                          defaultValue={userTypeSaved}
                          name="radio-buttons-group"
                          value={userType}
                          onChange={handleChange}
                        >
                          <FormControlLabel className={css2.no_spacing} value="businessOwner" control={
                            <Radio 
                              sx={{
                                  color: "#F56630",
                                  '&.Mui-checked': {
                                    color: "#F56630",
                                  },
                                }}
                          className={classNames(css2.no_spacing,css2.radio)}/>} label="I am a business owner" />
                          <FormControlLabel className={css2.no_spacing} value="privateOwner" control={
                            <Radio 
                              sx={{
                                color: "#F56630",
                                '&.Mui-checked': {
                                  color: "#F56630",
                                },
                              }}
                            className={classNames(css2.no_spacing,css2.radio)}/>} label="I am a private owner" />
                        </RadioGroup>
                        
                      </FormControl>
                    </div>
                  

                   
                  </form>

                  <div className={css2.base_btns}>
                      <button onClick={handleHideForm} className={css2.btn_1}>Close</button>
                      <div>
                        <button className={css2.btn_prev} disabled>Previous</button>
                        <button onClick={handleSubmit} className={css2.btn_next}>Next</button>
                      </div>
                    </div>
                </div>
                  
                 
                
          </div>
  )
}


const PersonalProfileForm = props=>{
  const {onSetSelectedFile,handleMoveBack,handleHideForm,moveNext,onUpdateProfile,image,onImageUpload,publicData,profileImage,setCurrentPage} = props;
  const profileImageSrc = profileImage?.attributes?.variants["square-small"]?.url;
  const [fullName, setFullName] = React.useState(publicData.fullName);
  const [yearsOfExperience, setYearsOfExperience] = React.useState(publicData.yearsOfExperience);
  const [language, setLanguage] = React.useState(publicData.language);
  const [dateOfBirth, setDateOfBirth] = React.useState(publicData.dateOfBirth);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [imageSrc,setImageSrc] = useState(profileImageSrc);
  const fileInput = useRef(null);

  useEffect(()=>{
  },[image]);

  const handleFileClick = ()=>{
    fileInput.current.click();
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
      onImageUpload({ id: tempId, file });
    }

  }
}

const handleSubmitFrom = val =>{
  setSelectedDate(val);
}


const handleMoveNext = e=>{
    moveNext("saveProfile");
}


const handleSubmit = e=>{

    //  //Clear existing data
    // onUpdateProfile({publicData:{
    //       businessName:null,
    //       teamSize:null,
    //       //fullName:null,
    //       //yearsOfExperience:null,
    //       //language:null,
    //       //dateOfBirth:null
    // }});
    //console.log("--------------------------------------------");
  
    //Add new data
    const profile = 
    {publicData: {
          fullName,
          yearsOfExperience,
          language,
          dateOfBirth
        }}

    const uploadedImage = image;
  
      // Update profileImage only if file system has been accessed
      const updatedValues =
        uploadedImage && uploadedImage.imageId && uploadedImage.file
          ? { ...profile, profileImageId: uploadedImage.imageId }
          : profile;

    onUpdateProfile(updatedValues);
  handleMoveNext();
}


  return (
          <div className={css2.overlay}>

                <div className={css2.modal_complete_profile_2}>
                  <div className={css2.close_btn} onClick={e=>setCurrentPage("")}>
                        <svg className={css2.close_icon} xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
                            <path d="M2.05086 1.13616C1.66033 0.745631 1.02717 0.74563 0.636643 1.13616C0.246119 1.52668 0.246119 2.15984 0.636643 2.55037L5.58639 7.50012L0.636643 12.4499C0.246119 12.8404 0.246119 13.4736 0.636643 13.8641C1.02717 14.2546 1.66033 14.2546 2.05086 13.8641L7.0006 8.91433L11.9504 13.8641C12.3409 14.2546 12.974 14.2546 13.3646 13.8641C13.7551 13.4736 13.7551 12.8404 13.3646 12.4499L8.41482 7.50012L13.3646 2.55037C13.7551 2.15984 13.7551 1.52668 13.3646 1.13616C12.974 0.745631 12.3409 0.745631 11.9504 1.13616L7.0006 6.0859L2.05086 1.13616Z" fill="black"/>
                        </svg>
                    </div>
                  <div className={classNames(css2.flex_col,css2.full_w)}>
                    <span className={css2.header_2}>Complete your profile</span>
                    <div className={css2.main_slider_con}>
                      <span>Step 1 of 2</span>
                      <div className={css2.slider_con}>
                        <div className={css2.slide}></div>
                      </div>
                      <div className={css2.percent_con}>
                        <span className={css2.percent}>50%</span>
                      </div>
                      
                    </div>
                    <div className={css2.flex_row_normal}>
                      <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M12.5 2C9.73858 2 7.5 4.23858 7.5 7C7.5 9.76142 9.73858 12 12.5 12C15.2614 12 17.5 9.76142 17.5 7C17.5 4.23858 15.2614 2 12.5 2ZM9.5 7C9.5 5.34315 10.8431 4 12.5 4C14.1569 4 15.5 5.34315 15.5 7C15.5 8.65685 14.1569 10 12.5 10C10.8431 10 9.5 8.65685 9.5 7Z" fill="#475367"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M12.5 23C10.9595 23 8.72982 22.6502 7.05543 21.9174C6.23343 21.5576 5.39745 21.0427 4.91175 20.2974C4.65632 19.9054 4.49483 19.4437 4.50013 18.9282C4.50537 18.4174 4.67344 17.9281 4.95591 17.4728C6.32532 15.2656 9.12679 13 12.5 13C15.8732 13 18.6747 15.2656 20.0441 17.4728C20.3266 17.9281 20.4946 18.4174 20.4999 18.9282C20.5052 19.4437 20.3437 19.9054 20.0882 20.2974C19.6025 21.0427 18.7666 21.5576 17.9446 21.9174C16.2702 22.6502 14.0405 23 12.5 23ZM6.65539 18.5272C6.52372 18.7394 6.50077 18.8757 6.50002 18.9487C6.49932 19.017 6.51686 19.0973 6.58736 19.2055C6.75354 19.4605 7.15707 19.7787 7.85732 20.0852C9.22744 20.6848 11.1732 21 12.5 21C13.8268 21 15.7726 20.6848 17.1427 20.0852C17.8429 19.7787 18.2465 19.4605 18.4126 19.2055C18.4831 19.0973 18.5007 19.017 18.5 18.9487C18.4992 18.8757 18.4763 18.7394 18.3446 18.5272C17.2225 16.7185 14.9843 15 12.5 15C10.0157 15 7.77754 16.7185 6.65539 18.5272Z" fill="#475367"/>
                      </svg>
                      <span>Personal Profile</span>
                    </div>


                    <div className={css2.add_profile} onClick={handleFileClick}>
                      {imageSrc==="" || imageSrc === undefined?
                          <>
                            <img className={css2.resize} src={camera}/>
                            <span>Add profile photo</span>
                          </>
                          :
                          <img className={css2.resize} src={imageSrc}/>
                        }
                     
                    </div>
                    
                    <FormControl className={classNames(css2.full_w,css2.form_input)}>
                      <label className={css2.labels} for={"outlined-controlled"}>Full name</label>
                      <input
                        id="outlined-controlled"
                        label="Full name"
                        name='fullName'
                        onChange={(event) => {
                          setFullName(event.target.value);
                        }}
                        value={fullName}
                        placeholder="Anima Justin"
                      />
                      <label className={css2.labels} for={"outlined-controlled"}>Years of experience</label>
                      <input
                        id="outlined-controlled"
                        label="Years of experience"
                        name='yearsOfExperience'
                        value={yearsOfExperience}
                        onChange={(event) => {
                          setYearsOfExperience(event.target.value);
                        }}
                        placeholder="Years of experience"
                      />

                      <label className={css2.labels} for={"outlined-controlled"}>Language spoken</label>
                      <select name='language' 
                      value={language}
                      onChange={
                        event=>{
                          setLanguage(event.target.value);
                          }
                        }>
                        <option value={1}>Select languages from the dropdown list</option>
                        <option value="AF">Afghanistan</option>
                        <option value="AX">�land Islands</option>
                        <option value="AL">Albania</option>
                        <option value="DZ">Algeria</option>
                        <option value="AS">American Samoa</option>
                        <option value="AD">Andorra</option>
                        <option value="AO">Angola</option>
                        <option value="AI">Anguilla</option>
                        <option value="AQ">Antarctica</option>
                        <option value="AG">Antigua and Barbuda</option>
                        <option value="AR">Argentina</option>
                        <option value="AM">Armenia</option>
                        <option value="AW">Aruba</option>
                        <option value="AU">Australia</option>
                        <option value="AT">Austria</option>
                        <option value="AZ">Azerbaijan</option>
                        <option value="BS">Bahamas</option>
                        <option value="BH">Bahrain</option>
                        <option value="BD">Bangladesh</option>
                        <option value="BB">Barbados</option>
                        <option value="BY">Belarus</option>
                        <option value="BE">Belgium</option>
                        <option value="BZ">Belize</option>
                        <option value="BJ">Benin</option>
                        <option value="BM">Bermuda</option>
                        <option value="BT">Bhutan</option>
                        <option value="BO">Bolivia, Plurinational State of</option>
                        <option value="BQ">Bonaire, Sint Eustatius and Saba</option>
                        <option value="BA">Bosnia and Herzegovina</option>
                        <option value="BW">Botswana</option>
                        <option value="BV">Bouvet Island</option>
                        <option value="BR">Brazil</option>
                        <option value="IO">British Indian Ocean Territory</option>
                        <option value="BN">Brunei Darussalam</option>
                        <option value="BG">Bulgaria</option>
                        <option value="BF">Burkina Faso</option>
                        <option value="BI">Burundi</option>
                        <option value="KH">Cambodia</option>
                        <option value="CM">Cameroon</option>
                        <option value="CA">Canada</option>
                        <option value="CV">Cape Verde</option>
                        <option value="KY">Cayman Islands</option>
                        <option value="CF">Central African Republic</option>
                        <option value="TD">Chad</option>
                        <option value="CL">Chile</option>
                        <option value="CN">China</option>
                        <option value="CX">Christmas Island</option>
                        <option value="CC">Cocos (Keeling) Islands</option>
                        <option value="CO">Colombia</option>
                        <option value="KM">Comoros</option>
                        <option value="CG">Congo</option>
                        <option value="CD">Congo, the Democratic Republic of the</option>
                        <option value="CK">Cook Islands</option>
                        <option value="CR">Costa Rica</option>
                        <option value="CI">C�te d'Ivoire</option>
                        <option value="HR">Croatia</option>
                        <option value="CU">Cuba</option>
                        <option value="CW">Cura�ao</option>
                        <option value="CY">Cyprus</option>
                        <option value="CZ">Czech Republic</option>
                        <option value="DK">Denmark</option>
                        <option value="DJ">Djibouti</option>
                        <option value="DM">Dominica</option>
                        <option value="DO">Dominican Republic</option>
                        <option value="EC">Ecuador</option>
                        <option value="EG">Egypt</option>
                        <option value="SV">El Salvador</option>
                        <option value="GQ">Equatorial Guinea</option>
                        <option value="ER">Eritrea</option>
                        <option value="EE">Estonia</option>
                        <option value="ET">Ethiopia</option>
                        <option value="FK">Falkland Islands (Malvinas)</option>
                        <option value="FO">Faroe Islands</option>
                        <option value="FJ">Fiji</option>
                        <option value="FI">Finland</option>
                        <option value="FR">France</option>
                        <option value="GF">French Guiana</option>
                        <option value="PF">French Polynesia</option>
                        <option value="TF">French Southern Territories</option>
                        <option value="GA">Gabon</option>
                        <option value="GM">Gambia</option>
                        <option value="GE">Georgia</option>
                        <option value="DE">Germany</option>
                        <option value="GH">Ghana</option>
                        <option value="GI">Gibraltar</option>
                        <option value="GR">Greece</option>
                        <option value="GL">Greenland</option>
                        <option value="GD">Grenada</option>
                        <option value="GP">Guadeloupe</option>
                        <option value="GU">Guam</option>
                        <option value="GT">Guatemala</option>
                        <option value="GG">Guernsey</option>
                        <option value="GN">Guinea</option>
                        <option value="GW">Guinea-Bissau</option>
                        <option value="GY">Guyana</option>
                        <option value="HT">Haiti</option>
                        <option value="HM">Heard Island and McDonald Islands</option>
                        <option value="VA">Holy See (Vatican City State)</option>
                        <option value="HN">Honduras</option>
                        <option value="HK">Hong Kong</option>
                        <option value="HU">Hungary</option>
                        <option value="IS">Iceland</option>
                        <option value="IN">India</option>
                        <option value="ID">Indonesia</option>
                        <option value="IR">Iran, Islamic Republic of</option>
                        <option value="IQ">Iraq</option>
                        <option value="IE">Ireland</option>
                        <option value="IM">Isle of Man</option>
                        <option value="IL">Israel</option>
                        <option value="IT">Italy</option>
                        <option value="JM">Jamaica</option>
                        <option value="JP">Japan</option>
                        <option value="JE">Jersey</option>
                        <option value="JO">Jordan</option>
                        <option value="KZ">Kazakhstan</option>
                        <option value="KE">Kenya</option>
                        <option value="KI">Kiribati</option>
                        <option value="KP">Korea, Democratic People's Republic of</option>
                        <option value="KR">Korea, Republic of</option>
                        <option value="KW">Kuwait</option>
                        <option value="KG">Kyrgyzstan</option>
                        <option value="LA">Lao People's Democratic Republic</option>
                        <option value="LV">Latvia</option>
                        <option value="LB">Lebanon</option>
                        <option value="LS">Lesotho</option>
                        <option value="LR">Liberia</option>
                        <option value="LY">Libya</option>
                        <option value="LI">Liechtenstein</option>
                        <option value="LT">Lithuania</option>
                        <option value="LU">Luxembourg</option>
                        <option value="MO">Macao</option>
                        <option value="MK">Macedonia, the former Yugoslav Republic of</option>
                        <option value="MG">Madagascar</option>
                        <option value="MW">Malawi</option>
                        <option value="MY">Malaysia</option>
                        <option value="MV">Maldives</option>
                        <option value="ML">Mali</option>
                        <option value="MT">Malta</option>
                        <option value="MH">Marshall Islands</option>
                        <option value="MQ">Martinique</option>
                        <option value="MR">Mauritania</option>
                        <option value="MU">Mauritius</option>
                        <option value="YT">Mayotte</option>
                        <option value="MX">Mexico</option>
                        <option value="FM">Micronesia, Federated States of</option>
                        <option value="MD">Moldova, Republic of</option>
                        <option value="MC">Monaco</option>
                        <option value="MN">Mongolia</option>
                        <option value="ME">Montenegro</option>
                        <option value="MS">Montserrat</option>
                        <option value="MA">Morocco</option>
                        <option value="MZ">Mozambique</option>
                        <option value="MM">Myanmar</option>
                        <option value="NA">Namibia</option>
                        <option value="NR">Nauru</option>
                        <option value="NP">Nepal</option>
                        <option value="NL">Netherlands</option>
                        <option value="NC">New Caledonia</option>
                        <option value="NZ">New Zealand</option>
                        <option value="NI">Nicaragua</option>
                        <option value="NE">Niger</option>
                        <option value="NG">Nigeria</option>
                        <option value="NU">Niue</option>
                        <option value="NF">Norfolk Island</option>
                        <option value="MP">Northern Mariana Islands</option>
                        <option value="NO">Norway</option>
                        <option value="OM">Oman</option>
                        <option value="PK">Pakistan</option>
                        <option value="PW">Palau</option>
                        <option value="PS">Palestinian Territory, Occupied</option>
                        <option value="PA">Panama</option>
                        <option value="PG">Papua New Guinea</option>
                        <option value="PY">Paraguay</option>
                        <option value="PE">Peru</option>
                        <option value="PH">Philippines</option>
                        <option value="PN">Pitcairn</option>
                        <option value="PL">Poland</option>
                        <option value="PT">Portugal</option>
                        <option value="PR">Puerto Rico</option>
                        <option value="QA">Qatar</option>
                        <option value="RE">R�union</option>
                        <option value="RO">Romania</option>
                        <option value="RU">Russian Federation</option>
                        <option value="RW">Rwanda</option>
                        <option value="BL">Saint Barth�lemy</option>
                        <option value="SH">Saint Helena, Ascension and Tristan da Cunha</option>
                        <option value="KN">Saint Kitts and Nevis</option>
                        <option value="LC">Saint Lucia</option>
                        <option value="MF">Saint Martin (French part)</option>
                        <option value="PM">Saint Pierre and Miquelon</option>
                        <option value="VC">Saint Vincent and the Grenadines</option>
                        <option value="WS">Samoa</option>
                        <option value="SM">San Marino</option>
                        <option value="ST">Sao Tome and Principe</option>
                        <option value="SA">Saudi Arabia</option>
                        <option value="SN">Senegal</option>
                        <option value="RS">Serbia</option>
                        <option value="SC">Seychelles</option>
                        <option value="SL">Sierra Leone</option>
                        <option value="SG">Singapore</option>
                        <option value="SX">Sint Maarten (Dutch part)</option>
                        <option value="SK">Slovakia</option>
                        <option value="SI">Slovenia</option>
                        <option value="SB">Solomon Islands</option>
                        <option value="SO">Somalia</option>
                        <option value="ZA">South Africa</option>
                        <option value="GS">South Georgia and the South Sandwich Islands</option>
                        <option value="SS">South Sudan</option>
                        <option value="ES">Spain</option>
                        <option value="LK">Sri Lanka</option>
                        <option value="SD">Sudan</option>
                        <option value="SR">Suriname</option>
                        <option value="SJ">Svalbard and Jan Mayen</option>
                        <option value="SZ">Swaziland</option>
                        <option value="SE">Sweden</option>
                        <option value="CH">Switzerland</option>
                        <option value="SY">Syrian Arab Republic</option>
                        <option value="TW">Taiwan, Province of China</option>
                        <option value="TJ">Tajikistan</option>
                        <option value="TZ">Tanzania, United Republic of</option>
                        <option value="TH">Thailand</option>
                        <option value="TL">Timor-Leste</option>
                        <option value="TG">Togo</option>
                        <option value="TK">Tokelau</option>
                        <option value="TO">Tonga</option>
                        <option value="TT">Trinidad and Tobago</option>
                        <option value="TN">Tunisia</option>
                        <option value="TR">Turkey</option>
                        <option value="TM">Turkmenistan</option>
                        <option value="TC">Turks and Caicos Islands</option>
                        <option value="TV">Tuvalu</option>
                        <option value="UG">Uganda</option>
                        <option value="UA">Ukraine</option>
                        <option value="AE">United Arab Emirates</option>
                        <option value="GB">United Kingdom</option>
                        <option value="US">United States</option>
                        <option value="UM">United States Minor Outlying Islands</option>
                        <option value="UY">Uruguay</option>
                        <option value="UZ">Uzbekistan</option>
                        <option value="VU">Vanuatu</option>
                        <option value="VE">Venezuela, Bolivarian Republic of</option>
                        <option value="VN">Viet Nam</option>
                        <option value="VG">Virgin Islands, British</option>
                        <option value="VI">Virgin Islands, U.S.</option>
                        <option value="WF">Wallis and Futuna</option>
                        <option value="EH">Western Sahara</option>
                        <option value="YE">Yemen</option>
                        <option value="ZM">Zambia</option>
                        <option value="ZW">Zimbabwe</option>
                      </select>

                    <label className={css2.labels} for={"outlined-controlled"}>Date of birth</label>
                    <input value={dateOfBirth} type='date' name='dateOfBirth' onChange={
                      event=>{
                          setDateOfBirth(event.target.value);
                      }
                    }/>
                    </FormControl>
                  </div>
                

                  <div className={css2.base_btns}>
                    <button onClick={handleHideForm} className={css2.btn_1}>Close</button>
                    <div>
                      <button onClick={e=>handleMoveBack("userType")} className={css2.btn_1}>Previous</button>
                      <button onClick={handleSubmit} className={css2.btn_next}>Next</button>
                       <input 
                            id='file' 
                            name='file' 
                            type='file' 
                            hidden
                            ref={fileInput}
                            onChange={handleChange}
                        />
                    </div>
                  </div>
                </div>
                
              </div>
  )
}

const BusinessProfileForm = props=>{
  const {onSetSelectedFile,handleMoveBack,handleHideForm,moveNext,onUpdateProfile,image,onImageUpload,publicData,profileImage,setCurrentPage} = props;
  const profileImageSrc = profileImage?.attributes?.variants["square-small"]?.url;
  const [businessName, setBusinesName] = React.useState(publicData?.businessName);
  const [yearsOfExperience, setYearsOfExperience] = React.useState(publicData?.yearsOfExperience);
  const [language, setLanguage] = useState(publicData?.language);
  const [imageSrc,setImageSrc] = useState(profileImageSrc);
  const fileInput = useRef(null);
  const [dateOfBirth, setDateOfBirth] = useState(publicData.dateOfBirth);
  const [languages, setLanguages] = useState(publicData?.language);
  const [showDatePicker,setShowDatePicker] = useState();
  const [date,setDate] = useState("");
  const [showOptions,setShowOptions] = useState(false);

  const isReady = businessName && yearsOfExperience && languages && dateOfBirth;

  const handleFileClick = ()=>{
    fileInput.current.click();
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
      onImageUpload({ id: tempId, file });
    }
    
    onSetSelectedFile(event.target.files[0]);
  }
}

const handleMoveNext = e=>{
    moveNext("saveProfile");
}

const handleSubmit = async e=>{
    //Add new data
    const profile = 
    {publicData: {
          userType:"businessOwner",
          businessName,
          yearsOfExperience,
          language:languages,
          dateOfBirth,
        }}

    //console.log(profile,"   xxxxxxxxxxxxxmmmmmmmmmmmmmmmmmm")

    const uploadedImage = image;
  
      // Update profileImage only if file system has been accessed
      const updatedValues =
        uploadedImage && uploadedImage.imageId && uploadedImage.file
          ? { ...profile, profileImageId: uploadedImage.imageId }
          : profile;

    await onUpdateProfile(updatedValues);
    await handleMoveNext();
}

function onChange(timestamp) {
    //console.log(timestamp);
    setDate(timestamp);
  }

  const handleDateChange = value=>{
    const date = new Date(value).toLocaleDateString();
    const dateArr = date.split("/");
    const year = dateArr[2];
    const month = dateArr[0];
    const day = dateArr[1];
    setDateOfBirth(`${year}-${month}-${day}`);//YYYY-MM-DD
  }

  const countryLanguages = {
    "af": "Afrikaans",
    "sq": "Albanian - shqip",
    "am": "Amharic - አማርኛ",
    "ar": "Arabic - العربية",
    "an": "Aragonese - aragonés",
    "hy": "Armenian - հայերեն",
    "ast": "Asturian - asturianu",
    "az": "Azerbaijani - azərbaycan dili",
    "eu": "Basque - euskara",
    "be": "Belarusian - беларуская",
    "bn": "Bengali - বাংলা",
    "bs": "Bosnian - bosanski",
    "br": "Breton - brezhoneg",
    "bg": "Bulgarian - български",
    "ca": "Catalan - català",
    "ckb": "Central Kurdish - کوردی (دەستنوسی عەرەبی)",
    "zh": "Chinese - 中文",
    "zh-HK": "Chinese (Hong Kong) - 中文（香港）",
    "zh-CN": "Chinese (Simplified) - 中文（简体）",
    "zh-TW": "Chinese (Traditional) - 中文（繁體）",
    "co": "Corsican",
    "hr": "Croatian - hrvatski",
    "cs": "Czech - čeština",
    "da": "Danish - dansk",
    "nl": "Dutch - Nederlands",
    "en": "English",
    "en-AU": "English (Australia)",
    "en-CA": "English (Canada)",
    "en-IN": "English (India)",
    "en-NZ": "English (New Zealand)",
    "en-ZA": "English (South Africa)",
    "en-GB": "English (United Kingdom)",
    "en-US": "English (United States)",
    "eo": "Esperanto - esperanto",
    "et": "Estonian - eesti",
    "fo": "Faroese - føroyskt",
    "fil": "Filipino",
    "fi": "Finnish - suomi",
    "fr": "French - français",
    "fr-CA": "French (Canada) - français (Canada)",
    "fr-FR": "French (France) - français (France)",
    "fr-CH": "French (Switzerland) - français (Suisse)",
    "gl": "Galician - galego",
    "ka": "Georgian - ქართული",
    "de": "German - Deutsch",
    "de-AT": "German (Austria) - Deutsch (Österreich)",
    "de-DE": "German (Germany) - Deutsch (Deutschland)",
    "de-LI": "German (Liechtenstein) - Deutsch (Liechtenstein)",
    "de-CH": "German (Switzerland) - Deutsch (Schweiz)",
    "el": "Greek - Ελληνικά",
    "gn": "Guarani",
    "gu": "Gujarati - ગુજરાતી",
    "ha": "Hausa",
    "haw": "Hawaiian - ʻŌlelo Hawaiʻi",
    "he": "Hebrew - עברית",
    "hi": "Hindi - हिन्दी",
    "hu": "Hungarian - magyar",
    "is": "Icelandic - íslenska",
    "id": "Indonesian - Indonesia",
    "ia": "Interlingua",
    "ga": "Irish - Gaeilge",
    "it": "Italian - italiano",
    "it-IT": "Italian (Italy) - italiano (Italia)",
    "it-CH": "Italian (Switzerland) - italiano (Svizzera)",
    "ja": "Japanese - 日本語",
    "kn": "Kannada - ಕನ್ನಡ",
    "kk": "Kazakh - қазақ тілі",
    "km": "Khmer - ខ្មែរ",
    "ko": "Korean - 한국어",
    "ku": "Kurdish - Kurdî",
    "ky": "Kyrgyz - кыргызча",
    "lo": "Lao - ລາວ",
    "la": "Latin",
    "lv": "Latvian - latviešu",
    "ln": "Lingala - lingála",
    "lt": "Lithuanian - lietuvių",
    "mk": "Macedonian - македонски",
    "ms": "Malay - Bahasa Melayu",
    "ml": "Malayalam - മലയാളം",
    "mt": "Maltese - Malti",
    "mr": "Marathi - मराठी",
    "mn": "Mongolian - монгол",
    "ne": "Nepali - नेपाली",
    "no": "Norwegian - norsk",
    "nb": "Norwegian Bokmål - norsk bokmål",
    "nn": "Norwegian Nynorsk - nynorsk",
    "oc": "Occitan",
    "or": "Oriya - ଓଡ଼ିଆ",
    "om": "Oromo - Oromoo",
    "ps": "Pashto - پښتو",
    "fa": "Persian - فارسی",
    "pl": "Polish - polski",
    "pt": "Portuguese - português",
    "pt-BR": "Portuguese (Brazil) - português (Brasil)",
    "pt-PT": "Portuguese (Portugal) - português (Portugal)",
    "pa": "Punjabi - ਪੰਜਾਬੀ",
    "qu": "Quechua",
    "ro": "Romanian - română",
    "mo": "Romanian (Moldova) - română (Moldova)",
    "rm": "Romansh - rumantsch",
    "ru": "Russian - русский",
    "gd": "Scottish Gaelic",
    "sr": "Serbian - српски",
    "sh": "Serbo - Croatian",
    "sn": "Shona - chiShona",
    "sd": "Sindhi",
    "si": "Sinhala - සිංහල",
    "sk": "Slovak - slovenčina",
    "sl": "Slovenian - slovenščina",
    "so": "Somali - Soomaali",
    "st": "Southern Sotho",
    "es": "Spanish - español",
    "es-AR": "Spanish (Argentina) - español (Argentina)",
    "es-419": "Spanish (Latin America) - español (Latinoamérica)",
    "es-MX": "Spanish (Mexico) - español (México)",
    "es-ES": "Spanish (Spain) - español (España)",
    "es-US": "Spanish (United States) - español (Estados Unidos)",
    "su": "Sundanese",
    "sw": "Swahili - Kiswahili",
    "sv": "Swedish - svenska",
    "tg": "Tajik - тоҷикӣ",
    "ta": "Tamil - தமிழ்",
    "tt": "Tatar",
    "te": "Telugu - తెలుగు",
    "th": "Thai - ไทย",
    "ti": "Tigrinya - ትግርኛ",
    "to": "Tongan - lea fakatonga",
    "tr": "Turkish - Türkçe",
    "tk": "Turkmen",
    "tw": "Twi",
    "uk": "Ukrainian - українська",
    "ur": "Urdu - اردو",
    "ug": "Uyghur",
    "uz": "Uzbek - o‘zbek",
    "vi": "Vietnamese - Tiếng Việt",
    "wa": "Walloon - wa",
    "cy": "Welsh - Cymraeg",
    "fy": "Western Frisian",
    "xh": "Xhosa",
    "yi": "Yiddish",
    "yo": "Yoruba - Èdè Yorùbá",
    "zu": "Zulu - isiZulu"
};

  return (
          <div className={css2.overlay} onClick={e=>{setShowDatePicker(false); setShowOptions(false)}}>

                <div className={css2.modal_complete_profile_busi}>
                   <div className={css2.close_btn} onClick={e=>setCurrentPage("")}>
                        <svg className={css2.close_icon} xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
                            <path d="M2.05086 1.13616C1.66033 0.745631 1.02717 0.74563 0.636643 1.13616C0.246119 1.52668 0.246119 2.15984 0.636643 2.55037L5.58639 7.50012L0.636643 12.4499C0.246119 12.8404 0.246119 13.4736 0.636643 13.8641C1.02717 14.2546 1.66033 14.2546 2.05086 13.8641L7.0006 8.91433L11.9504 13.8641C12.3409 14.2546 12.974 14.2546 13.3646 13.8641C13.7551 13.4736 13.7551 12.8404 13.3646 12.4499L8.41482 7.50012L13.3646 2.55037C13.7551 2.15984 13.7551 1.52668 13.3646 1.13616C12.974 0.745631 12.3409 0.745631 11.9504 1.13616L7.0006 6.0859L2.05086 1.13616Z" fill="black"/>
                        </svg>
                    </div>
                  <div className={classNames(css2.flex_col,css2.full_w)}>
                    <span className={css2.header_2}>Complete your profile</span>
                    <div className={css2.main_slider_con}>
                      <span>Step 1 of 2</span>
                      <div className={css2.slider_con}>
                        <div className={css2.slide}></div>
                      </div>
                      <div className={css2.percent_con}>
                        <span className={css2.percent}>50%</span>
                      </div>
                      
                    </div>
                    <div className={css2.flex_row_normal}>
                      <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M12.5 2C9.73858 2 7.5 4.23858 7.5 7C7.5 9.76142 9.73858 12 12.5 12C15.2614 12 17.5 9.76142 17.5 7C17.5 4.23858 15.2614 2 12.5 2ZM9.5 7C9.5 5.34315 10.8431 4 12.5 4C14.1569 4 15.5 5.34315 15.5 7C15.5 8.65685 14.1569 10 12.5 10C10.8431 10 9.5 8.65685 9.5 7Z" fill="#475367"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M12.5 23C10.9595 23 8.72982 22.6502 7.05543 21.9174C6.23343 21.5576 5.39745 21.0427 4.91175 20.2974C4.65632 19.9054 4.49483 19.4437 4.50013 18.9282C4.50537 18.4174 4.67344 17.9281 4.95591 17.4728C6.32532 15.2656 9.12679 13 12.5 13C15.8732 13 18.6747 15.2656 20.0441 17.4728C20.3266 17.9281 20.4946 18.4174 20.4999 18.9282C20.5052 19.4437 20.3437 19.9054 20.0882 20.2974C19.6025 21.0427 18.7666 21.5576 17.9446 21.9174C16.2702 22.6502 14.0405 23 12.5 23ZM6.65539 18.5272C6.52372 18.7394 6.50077 18.8757 6.50002 18.9487C6.49932 19.017 6.51686 19.0973 6.58736 19.2055C6.75354 19.4605 7.15707 19.7787 7.85732 20.0852C9.22744 20.6848 11.1732 21 12.5 21C13.8268 21 15.7726 20.6848 17.1427 20.0852C17.8429 19.7787 18.2465 19.4605 18.4126 19.2055C18.4831 19.0973 18.5007 19.017 18.5 18.9487C18.4992 18.8757 18.4763 18.7394 18.3446 18.5272C17.2225 16.7185 14.9843 15 12.5 15C10.0157 15 7.77754 16.7185 6.65539 18.5272Z" fill="#475367"/>
                      </svg>
                      <span>Business Profile</span>
                    </div>

                    <div className={css2.add_profile} onClick={handleFileClick}>
                      {imageSrc==="" || imageSrc === undefined?
                          <>
                            <img className={css2.resize} src={camera}/>
                            <span>Add profile photo</span>
                          </>
                          :
                          <img className={css2.resize} src={imageSrc}/>
                        }
                     
                    </div>
                    
                    <FormControl className={classNames(css2.full_w,css2.form_input)}>
                      <div>
                        <label className={css2.labels} for={"outlined-controlled"}>Full name/ Business name</label>
                        <input
                          id="outlined-controlled"
                          name='businessName'
                          onChange={(event) => {
                            setBusinesName(event.target.value);
                          }}
                          value={businessName}
                          placeholder={businessName}
                        />
                        {businessName !== undefined && businessName !== ""?"":<span className={css2.error_msg}>Name is required</span>}
                      </div>
                      
                      <div>
                          <label className={css2.labels} for={"outlined-controlled"}>Years of Experience</label>
                        <input
                          id="outlined-controlled"
                          name='yearsOfExperience'
                          value={yearsOfExperience}
                          onChange={(event) => {
                            setYearsOfExperience(event.target.value);
                          }}
                          placeholder="Write out your years of experience"
                        />
                        {yearsOfExperience !== undefined && yearsOfExperience !== ""?"":<span className={css2.error_msg}>Years of experience is required</span>}
                      </div>
                      

                      <div>
                        <label className={css2.labels} for={"outlined-controlled"}>Language spoken</label>
                        <SelectMultipleComponent 
                            options={Object.values(countryLanguages)} 
                            value={languages}
                            handleSelectChange={e=>setLanguages(e)}
                            showOptions = {showOptions}
                            setShowOptions = {setShowOptions}
                          />
                          {languages !== undefined && languages.length > 0 ?"":<span className={css2.error_msg}>Language spoken is required</span>}
                      </div>
                      
                      
                      <div className={css.flex_col}>
                        <label className={css2.labels} for={"outlined-controlled"}>Date of birth</label>
                        <MyDatePicker currentDate={dateOfBirth} onChange={handleDateChange} showDatePicker={showDatePicker} setShowDatePicker={setShowDatePicker}/>
                        {dateOfBirth !== undefined && dateOfBirth !== null ?"":<span className={css2.error_msg}>Date of birth is required</span>}
                      </div>

                      <input 
                                id='file5' 
                                name='file5' 
                                type='file' 
                                hidden
                                ref={fileInput}
                                onChange={handleChange}
                            />

                    </FormControl>
                  </div>
                

                  <div className={css2.base_btns}>
                    <button onClick={handleHideForm} className={css2.btn_1}>Close</button>
                    <div>
                      <button onClick={handleSubmit} className={css2.btn_next} disabled={!isReady}>Next</button>
                    </div>
                  </div>
                </div>
                
              </div>
  )
}


const SaveProfileForm = props=>{
  const {
    onSetSelectedFile,
    handleMoveBack,
    handleHideForm,
    currentSelectedUserType,
    serviceAreas,
    setServiceAreas,
    handleRemove,
    moveNext,
    onUpdateProfile,
    publicData,
    setCurrentPage
  } = props;
  const [address, setAddress] = useState(publicData?.address);
  const [city, setCity] = useState(publicData?.city);
  const fileInput = useRef(null);
  const {userType} = publicData;
  const [showMap,setShowMap] = useState(false);

  const isReady = address && city && serviceAreas;

  //console.log(userType +"    uuuuuuuuuuuuuuuuuu");

  const handleFileClick = ()=>{
    fileInput.current.click();
  }

const handleMoveNext = e =>{
  moveNext("profileCompleted");
}

let back = "";
if(currentSelectedUserType === "businessOwner"){
      back = "businessProfile";
}else{
      back = "personalProfile";
}

  const moveBack = e =>{
    let page = "";
    if(userType === "businessOwner"){
      page = "businessProfile";
    }else{
      page = "personalProfile";
    }
      handleMoveBack(page);
  }

  useEffect(()=>{
    //console.log(serviceAreas);
  },[serviceAreas]);
 

const handleSubmit = async e=>{
    //Add new data
    const profile = 
    {publicData: {
          address,
          city,
          serviceAreas
        }}

    await onUpdateProfile(profile);
    await handleMoveNext();
}
  return (
          <div className={css2.overlay}>

                <div className={css2.modal_complete_profile_busi}>
                   <div className={css2.close_btn} onClick={e=>setCurrentPage("")}>
                        <svg className={css2.close_icon} xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
                            <path d="M2.05086 1.13616C1.66033 0.745631 1.02717 0.74563 0.636643 1.13616C0.246119 1.52668 0.246119 2.15984 0.636643 2.55037L5.58639 7.50012L0.636643 12.4499C0.246119 12.8404 0.246119 13.4736 0.636643 13.8641C1.02717 14.2546 1.66033 14.2546 2.05086 13.8641L7.0006 8.91433L11.9504 13.8641C12.3409 14.2546 12.974 14.2546 13.3646 13.8641C13.7551 13.4736 13.7551 12.8404 13.3646 12.4499L8.41482 7.50012L13.3646 2.55037C13.7551 2.15984 13.7551 1.52668 13.3646 1.13616C12.974 0.745631 12.3409 0.745631 11.9504 1.13616L7.0006 6.0859L2.05086 1.13616Z" fill="black"/>
                        </svg>
                    </div>
                  <div className={classNames(css2.flex_col,css2.full_w)}>
                    <span className={css2.header_2}>Complete your profile</span>
                    <div className={css2.main_slider_con}>
                      <span>Step 1 of 2</span>
                      <div className={css2.slider_con}>
                        <div className={css2.slide_100}></div>
                      </div>
                      <div className={css2.percent_con}>
                        <span className={css2.percent}>100%</span>
                      </div>
                      
                    </div>
                    <div className={css2.flex_row_normal}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0002 5.49914C9.51487 5.49914 7.50015 7.51385 7.50015 9.99914C7.50015 12.4844 9.51487 14.4991 12.0002 14.4991C14.4854 14.4991 16.5002 12.4844 16.5002 9.99914C16.5002 7.51385 14.4854 5.49914 12.0002 5.49914ZM9.50015 9.99914C9.50015 8.61842 10.6194 7.49914 12.0002 7.49914C13.3809 7.49914 14.5002 8.61842 14.5002 9.99914C14.5002 11.3798 13.3809 12.4991 12.0002 12.4991C10.6194 12.4991 9.50015 11.3798 9.50015 9.99914Z" fill="#475367"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M7.80939 3.59112C10.3471 1.89931 13.6532 1.89931 16.1909 3.59112C19.6218 5.87839 20.585 10.4941 18.3553 13.9627L14.5237 19.9229C13.3428 21.7599 10.6575 21.7599 9.47662 19.9229L5.64505 13.9627C3.41528 10.4941 4.3785 5.87839 7.80939 3.59112ZM8.9188 5.25523C10.7847 4.01128 13.2156 4.01128 15.0815 5.25523C17.6042 6.93699 18.3124 10.3308 16.6729 12.8812L12.8413 18.8414C12.4477 19.4537 11.5526 19.4537 11.159 18.8414L7.32741 12.8812C5.68792 10.3308 6.39615 6.93699 8.9188 5.25523Z" fill="#475367"/>
                      </svg>
                      <span>Location & Availability</span>
                    </div>

                  
                    <FormControl className={classNames(css2.full_w,css2.form_input)}>
                     

                       <div>
                         <label className={css2.labels} for={"outlined-controlled"}>Address</label>
                        <input
                          id="outlined-controlled"
                          value={address}
                          onChange={(event) => {
                            setAddress(event.target.value);
                          }}
                          placeholder="Street address"
                        />
                        {address !== undefined && address !== ""?"":<span className={css2.error_msg}>Address is required</span>}
                      </div>



                      <div>
                        <label className={css2.labels} for={"outlined-controlled"}>City</label>
                        <input
                          id="outlined-controlled"
                          value={city}
                          onChange={(event) => {
                            setCity(event.target.value);
                          }}
                          placeholder="City"
                        />
                        {city !== undefined && city !== ""?"":<span className={css2.error_msg}>City is required</span>}
                      </div>
                      
                      <div>
                        <label className={css2.labels} for={"outlined-controlled"}>Service area (km)</label>
                        <div className={css2.area_con} onClick={e=>setShowMap(true)}>
                          <div className={css2.flex_row_area}>
                            
                            {serviceAreas !== undefined && serviceAreas.length > 0?
                              <div className={css2.location_selected_2}>
                              {serviceAreas !== undefined && serviceAreas.map((itm,k)=>{
                                    return (
                                      <div className={css2.loca_con}>
                                        <span>{itm?.result?.place_name}</span>
                                        <svg onClick={e=>{handleRemove(itm.result.id)}} className={css2.remove} xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                                          <path d="M7.05684 6.61503C6.79649 6.35468 6.37438 6.35468 6.11403 6.61503C5.85368 6.87538 5.85368 7.29749 6.11403 7.55784L7.05684 8.50065L6.11403 9.44346C5.85368 9.70381 5.85368 10.1259 6.11403 10.3863C6.37438 10.6466 6.79649 10.6466 7.05684 10.3863L7.99965 9.44346L8.94246 10.3863C9.20281 10.6466 9.62492 10.6466 9.88527 10.3863C10.1456 10.1259 10.1456 9.70381 9.88527 9.44346L8.94246 8.50065L9.88527 7.55784C10.1456 7.29749 10.1456 6.87538 9.88527 6.61503C9.62492 6.35468 9.20281 6.35468 8.94246 6.61503L7.99965 7.55784L7.05684 6.61503Z" fill="#475367"/>
                                          <path fill-rule="evenodd" clip-rule="evenodd" d="M7.99967 1.83398C4.31778 1.83398 1.33301 4.81875 1.33301 8.50065C1.33301 12.1825 4.31778 15.1673 7.99967 15.1673C11.6816 15.1673 14.6663 12.1825 14.6663 8.50065C14.6663 4.81875 11.6816 1.83398 7.99967 1.83398ZM2.66634 8.50065C2.66634 5.55513 5.05416 3.16732 7.99967 3.16732C10.9452 3.16732 13.333 5.55513 13.333 8.50065C13.333 11.4462 10.9452 13.834 7.99967 13.834C5.05416 13.834 2.66634 11.4462 2.66634 8.50065Z" fill="#475367"/>
                                        </svg>
                                      </div>
                                    )
                                })}
                            </div>
                            :
                            <>
                              <span>Select your service area from the map</span>
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0002 5.49914C9.51487 5.49914 7.50015 7.51385 7.50015 9.99914C7.50015 12.4844 9.51487 14.4991 12.0002 14.4991C14.4854 14.4991 16.5002 12.4844 16.5002 9.99914C16.5002 7.51385 14.4854 5.49914 12.0002 5.49914ZM9.50015 9.99914C9.50015 8.61842 10.6194 7.49914 12.0002 7.49914C13.3809 7.49914 14.5002 8.61842 14.5002 9.99914C14.5002 11.3798 13.3809 12.4991 12.0002 12.4991C10.6194 12.4991 9.50015 11.3798 9.50015 9.99914Z" fill="#475367"/>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M7.80939 3.59112C10.3471 1.89931 13.6532 1.89931 16.1909 3.59112C19.6218 5.87839 20.585 10.4941 18.3553 13.9627L14.5237 19.9229C13.3428 21.7599 10.6575 21.7599 9.47662 19.9229L5.64505 13.9627C3.41528 10.4941 4.3785 5.87839 7.80939 3.59112ZM8.9188 5.25523C10.7847 4.01128 13.2156 4.01128 15.0815 5.25523C17.6042 6.93699 18.3124 10.3308 16.6729 12.8812L12.8413 18.8414C12.4477 19.4537 11.5526 19.4537 11.159 18.8414L7.32741 12.8812C5.68792 10.3308 6.39615 6.93699 8.9188 5.25523Z" fill="#475367"/>
                              </svg>
                            </>
                            }
                            
                          </div>
                          <span className={css2.your_serv}>Your service will be shown to users in the service areas you select.</span>
                        </div>
                        {serviceAreas !== undefined && serviceAreas.length > 0?"":<span className={css2.error_msg}>Service area is required</span>}
                      </div>
                      
                      
                    </FormControl>
                  </div>
                

                  <div className={css2.base_btns}>
                    <button onClick={handleHideForm} className={css2.btn_1}>Close</button>
                    <div>
                      <button onClick={moveBack} className={css2.btn_1}>Previous</button>
                      <button onClick={handleSubmit} className={css2.btn_next} disabled={!isReady}>Save</button>
                    </div>
                  </div>

                  {showMap?
                    <div className={css2.map_overlay}>
                      <div className={css2.map_con} >
                          <SearchMapNew serviceAreas={serviceAreas} setServiceAreas={setServiceAreas} />
                          <div className={css2.close_con} onClick={e=>setShowMap(false)}>
                            <div className={css2.close_map}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M2.05086 0.636643C1.66033 0.246119 1.02717 0.246119 0.636643 0.636643C0.246119 1.02717 0.246119 1.66033 0.636643 2.05086L5.58639 7.0006L0.636643 11.9504C0.246119 12.3409 0.246119 12.974 0.636643 13.3646C1.02717 13.7551 1.66033 13.7551 2.05086 13.3646L7.0006 8.41482L11.9504 13.3646C12.3409 13.7551 12.974 13.7551 13.3646 13.3646C13.7551 12.974 13.7551 12.3409 13.3646 11.9504L8.41482 7.0006L13.3646 2.05086C13.7551 1.66033 13.7551 1.02717 13.3646 0.636643C12.974 0.246119 12.3409 0.246119 11.9504 0.636643L7.0006 5.58639L2.05086 0.636643Z" fill="black"/>
                              </svg>
                            </div>
                          </div>
                      </div>

                        <div className={css2.location_selected}>
                          {serviceAreas !== undefined && serviceAreas.map((itm,k)=>{
                                return (
                                  <div className={css2.loca_con}>
                                    <span>{itm?.result?.place_name}</span>
                                    <svg onClick={e=>{handleRemove(itm.result.id)}} className={css2.remove} xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                                      <path d="M7.05684 6.61503C6.79649 6.35468 6.37438 6.35468 6.11403 6.61503C5.85368 6.87538 5.85368 7.29749 6.11403 7.55784L7.05684 8.50065L6.11403 9.44346C5.85368 9.70381 5.85368 10.1259 6.11403 10.3863C6.37438 10.6466 6.79649 10.6466 7.05684 10.3863L7.99965 9.44346L8.94246 10.3863C9.20281 10.6466 9.62492 10.6466 9.88527 10.3863C10.1456 10.1259 10.1456 9.70381 9.88527 9.44346L8.94246 8.50065L9.88527 7.55784C10.1456 7.29749 10.1456 6.87538 9.88527 6.61503C9.62492 6.35468 9.20281 6.35468 8.94246 6.61503L7.99965 7.55784L7.05684 6.61503Z" fill="#475367"/>
                                      <path fill-rule="evenodd" clip-rule="evenodd" d="M7.99967 1.83398C4.31778 1.83398 1.33301 4.81875 1.33301 8.50065C1.33301 12.1825 4.31778 15.1673 7.99967 15.1673C11.6816 15.1673 14.6663 12.1825 14.6663 8.50065C14.6663 4.81875 11.6816 1.83398 7.99967 1.83398ZM2.66634 8.50065C2.66634 5.55513 5.05416 3.16732 7.99967 3.16732C10.9452 3.16732 13.333 5.55513 13.333 8.50065C13.333 11.4462 10.9452 13.834 7.99967 13.834C5.05416 13.834 2.66634 11.4462 2.66634 8.50065Z" fill="#475367"/>
                                    </svg>
                                  </div>
                                )
                            })}
                        </div>
                    </div>
                  :""}
                  
                </div>
                
              </div>
  )
}

const ProfileCompleteForm = props=>{
  const {onSetSelectedFile,handleMoveBack,handleHideForm,userType,currentSelectedUserType,serviceAreas,setServiceAreas,handleRemove} = props;
  const [name, setName] = React.useState('Mark');
  const [startDate, setStartDate] = useState(new Date());
  const [imageSrc,setImageSrc] = useState("");
  const fileInput = useRef(null);

  const handleFileClick = ()=>{
    fileInput.current.click();
  }

  const handleBackToDashboard = e=>{
    handleMoveBack("done");
  }


let back = "";
if(currentSelectedUserType === "businessOwner"){
      back = "businessProfile";
    }else{
      back = "personalProfile";
  }

  return (
          <div className={css2.overlay}>

                <div className={css2.modal_complete_profile_busi}>
                  <div className={classNames(css2.flex_col,css2.full_w)}>
                    <span className={css2.completed_header}>Profile Completed</span>
                    <div className={css2.mark_con}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0 60C0 44.087 6.32141 28.8258 17.5736 17.5736C28.8258 6.32141 44.087 0 60 0C75.913 0 91.1742 6.32141 102.426 17.5736C113.679 28.8258 120 44.087 120 60C120 75.913 113.679 91.1742 102.426 102.426C91.1742 113.679 75.913 120 60 120C44.087 120 28.8258 113.679 17.5736 102.426C6.32141 91.1742 0 75.913 0 60ZM56.576 85.68L91.12 42.496L84.88 37.504L55.424 74.312L34.56 56.928L29.44 63.072L56.576 85.68Z" fill="#6DC347"/>
                      </svg>
                    </div>
                     <p className={css2.complete_content}>
                      Your profile is now complete. Continue to create a listing.
                    </p>
                    <button className={css2.back_btn} onClick={handleBackToDashboard}>Back to dashboard</button>
                  </div>
                 
                </div>
                
              </div>
  )
}


const AddApplePayForm = props => {
  const{handleClose,handleContinue} = props;

  return(
    <>
    
     <div className={css2.header_con}>
            <div className={css2.flex_col_normal}>
              <span className={classNames("pb-2",css2.header_manage)}>
                Add Apple pay account
              </span>
              <p>
                Enter the email address linked to the Apple pay account you want to use for withdrawing funds. A verification code will be sent to the email address or phone linked to your account.
              </p>
            </div>
            <div className={css2.close_btn}>
              <svg onClick={handleClose} className={css2.close} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M7.05086 5.63664C6.66033 5.24612 6.02717 5.24612 5.63664 5.63664C5.24612 6.02717 5.24612 6.66033 5.63664 7.05086L10.5864 12.0006L5.63664 16.9504C5.24612 17.3409 5.24612 17.974 5.63664 18.3646C6.02717 18.7551 6.66033 18.7551 7.05086 18.3646L12.0006 13.4148L16.9504 18.3646C17.3409 18.7551 17.974 18.7551 18.3646 18.3646C18.7551 17.974 18.7551 17.3409 18.3646 16.9504L13.4148 12.0006L18.3646 7.05086C18.7551 6.66033 18.7551 6.02717 18.3646 5.63664C17.974 5.24612 17.3409 5.24612 16.9504 5.63664L12.0006 10.5864L7.05086 5.63664Z" fill="black"/>
              </svg>
            </div>
          </div>
          <form className={css2.form} onSubmit={handleSubmit}>
              <label labelfor="email">Email address</label>
              <input type='email' placeholder='Enter your email address'/>
              <button onClick={e=>{handleContinue(e,"VerificationCodeApplePay")}} className={css2.continue} type="submit">Continue</button>
          </form>
    
    </>
    
  )
      
    
};

const VerificationCodeApplePayForm = props => {
  const{handleClose,handleContinue,handleSubmitVerification} = props;
  return(
    <>
    
     <div className={css2.header_con}>
            <div className={css2.flex_col_normal}>
              <span className={classNames("pb-2",css2.header_manage)}>
                Verification code sent
              </span>
              <p>
                 Verification code has been sent to the email ks######@gmail.com, and also the phone number +33********6. Kindly check.
              </p>
            </div>
            <div className={css2.close_btn}>
              <svg onClick={handleClose} className={css2.close} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M7.05086 5.63664C6.66033 5.24612 6.02717 5.24612 5.63664 5.63664C5.24612 6.02717 5.24612 6.66033 5.63664 7.05086L10.5864 12.0006L5.63664 16.9504C5.24612 17.3409 5.24612 17.974 5.63664 18.3646C6.02717 18.7551 6.66033 18.7551 7.05086 18.3646L12.0006 13.4148L16.9504 18.3646C17.3409 18.7551 17.974 18.7551 18.3646 18.3646C18.7551 17.974 18.7551 17.3409 18.3646 16.9504L13.4148 12.0006L18.3646 7.05086C18.7551 6.66033 18.7551 6.02717 18.3646 5.63664C17.974 5.24612 17.3409 5.24612 16.9504 5.63664L12.0006 10.5864L7.05086 5.63664Z" fill="black"/>
              </svg>
            </div>
          </div>
          <form className={css2.form} onSubmit={handleSubmit}>
              <label labelfor="email">Enter code</label>
              <input type='number' placeholder='Enter your email address'/>
              <button onClick={e=>{handleSubmitVerification(e,"SuccessfulApplePay")}} className={css2.continue} type="submit">Submit</button>
          </form>
    
    </>
  )
      
    
};

const ApplePayCompleteForm = props=>{
  const {onSetSelectedFile,handleMoveBack,handleHideForm,userType,currentSelectedUserType,serviceAreas,setServiceAreas,handleRemove,handleCloseSuccessApplePay} = props;
  const [name, setName] = React.useState('Mark');
  const [startDate, setStartDate] = useState(new Date());
  const [imageSrc,setImageSrc] = useState("");
  const fileInput = useRef(null);

  const handleFileClick = ()=>{
    fileInput.current.click();
  }

  const handleBackToDashboard = e=>{
    handleMoveBack("done");
  }


let back = "";
if(currentSelectedUserType === "businessOwner"){
      back = "businessProfile";
    }else{
      back = "personalProfile";
  }

  return (
          <div className={css2.overlay}>

                <div className={css2.modal_complete_profile_busi}>
                  <div className={classNames(css2.flex_col_success,css2.full_w)}>
                    
                    <div className={css2.mark_con}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0 60C0 44.087 6.32141 28.8258 17.5736 17.5736C28.8258 6.32141 44.087 0 60 0C75.913 0 91.1742 6.32141 102.426 17.5736C113.679 28.8258 120 44.087 120 60C120 75.913 113.679 91.1742 102.426 102.426C91.1742 113.679 75.913 120 60 120C44.087 120 28.8258 113.679 17.5736 102.426C6.32141 91.1742 0 75.913 0 60ZM56.576 85.68L91.12 42.496L84.88 37.504L55.424 74.312L34.56 56.928L29.44 63.072L56.576 85.68Z" fill="#6DC347"/>
                      </svg>
                    </div>
                    <div className={css2.success_center}>
                      <span className={css2.success_header}>Successful</span>
                      <p className={css2.success_content}>
                        Apple pay account ks######@gmail.com has been added successfully for withdrawal.
                      </p>
                    </div>
                    
                    <button className={css2.close_success_btn} onClick={handleCloseSuccessApplePay}>Close</button>
                  </div>
                 
                </div>
                
              </div>
  )
}