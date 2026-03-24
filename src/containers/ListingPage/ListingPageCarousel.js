import React, { useState, useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

// Contexts
import { useConfiguration } from '../../context/configurationContext';
import { useRouteConfiguration } from '../../context/routeConfigurationContext';
// Utils
import { FormattedMessage, useIntl } from '../../util/reactIntl';
import { LISTING_STATE_PENDING_APPROVAL, LISTING_STATE_CLOSED, propTypes } from '../../util/types';
import { types as sdkTypes } from '../../util/sdkLoader';
import {
  LISTING_PAGE_DRAFT_VARIANT,
  LISTING_PAGE_PENDING_APPROVAL_VARIANT,
  LISTING_PAGE_PARAM_TYPE_DRAFT,
  LISTING_PAGE_PARAM_TYPE_EDIT,
  createSlug,
  NO_ACCESS_PAGE_USER_PENDING_APPROVAL,
  NO_ACCESS_PAGE_VIEW_LISTINGS,
} from '../../util/urlHelpers';
import {
  isErrorNoViewingPermission,
  isErrorUserPendingApproval,
  isForbiddenError,
} from '../../util/errors.js';
import { hasPermissionToViewData, isUserAuthorized } from '../../util/userHelpers.js';
import {
  ensureListing,
  ensureOwnListing,
  ensureUser,
  userDisplayNameAsString,
} from '../../util/data';
import { richText } from '../../util/richText';
import {
  isBookingProcess,
  isPurchaseProcess,
  resolveLatestProcessName,
} from '../../transactions/transaction';

// Global ducks (for Redux actions and thunks)
import { getMarketplaceEntities } from '../../ducks/marketplaceData.duck';
import { manageDisableScrolling, isScrollingDisabled } from '../../ducks/ui.duck';
import { initializeCardPaymentData } from '../../ducks/stripe.duck.js';

// Shared components
import {
  H4,
  Page,
  NamedLink,
  NamedRedirect,
  OrderPanel,
  LayoutSingleColumn,
  ReviewRating,
} from '../../components';

// Related components and modules
import TopbarContainer from '../TopbarContainer/TopbarContainer';
import FooterContainer from '../FooterContainer/FooterContainer';
import NotFoundPage from '../NotFoundPage/NotFoundPage';

import {
  sendInquiry,
  setInitialValues,
  fetchTimeSlots,
  fetchTransactionLineItems,
  saveLike,
  fetchUserListings,
  fetchReviews,
  reset,
} from './ListingPage.duck';

import {
  LoadingPage,
  ErrorPage,
  priceData,
  listingImages,
  handleContactUser,
  handleSubmitInquiry,
  handleSubmit,
  priceForSchemaMaybe,
} from './ListingPage.shared';
import css from './ListingPage.module.css';
import badge from '../../assets/badges.png';
import mark from '../../assets/mark2.png';
import chckedHeart from '../../assets/checkedHeart.png';
import classNames from 'classnames';
import SimpleCard_2 from '../DashboardPage/SimpleCard/SimpleCard_2.js';
import CartOptions from './CartOptions.js';
import CatalogItemOrderDetails from './CatalogItemOrderDetails.js';
import ConfirmOrderForm from './ConfirmOrderForm.js';
import { useReducer } from 'react';
import { updateProfile } from '../ProfileSettingsPage/ProfileSettingsPage.duck.js';
import CartItems from './CartItems.js';
import SuccessView from '../../components/SuccessView/SuccessView.js';
import RequestQuoteForm from '../../components/CustomComponent/RequestQuoteForm.js';
import RequestGuestDuration from '../../components/CustomComponent/RequestGuestDuration.js';
import RequestLocationTime from '../../components/CustomComponent/RequestLocationTime.js';
import { styled } from '@mui/material/styles';
import Rating from '@mui/material/Rating';

import {
  EmailShareButton,
  FacebookShareButton,
  GabShareButton,
  HatenaShareButton,
  InstapaperShareButton,
  LineShareButton,
  LinkedinShareButton,
  LivejournalShareButton,
  MailruShareButton,
  OKShareButton,
  PinterestShareButton,
  PocketShareButton,
  RedditShareButton,
  TelegramShareButton,
  ThreadsShareButton,
  TumblrShareButton,
  TwitterShareButton,
  ViberShareButton,
  VKShareButton,
  WhatsappShareButton,
  WorkplaceShareButton,
} from "react-share";

import {
  EmailIcon,
  FacebookIcon,
  FacebookMessengerIcon,
  GabIcon,
  HatenaIcon,
  InstapaperIcon,
  LineIcon,
  LinkedinIcon,
  LivejournalIcon,
  MailruIcon,
  OKIcon,
  PinterestIcon,
  PocketIcon,
  RedditIcon,
  TelegramIcon,
  ThreadsIcon,
  TumblrIcon,
  TwitterIcon,
  ViberIcon,
  VKIcon,
  WeiboIcon,
  WhatsappIcon,
  WorkplaceIcon,
  XIcon,
  BlueskyIcon,
} from "react-share";
import OwnListingMessage from '../../components/OwnListingMessage.js';
import { Box } from '@mui/material';
import StoreFrontPage from '../../components/CustomComponent/StoreFrontPage.js';
import { stringify } from 'path-to-regexp';

const MIN_LENGTH_FOR_LONG_WORDS_IN_TITLE = 16;
const REQUEST_QUOTE_TABS = [
  "service_type",
  "guest_count_and_duration",
  "location_and_time"
]

const { UUID } = sdkTypes;

export const ListingPageComponent = props => {

  const [inquiryModalOpen, setInquiryModalOpen] = useState(
    props.inquiryModalOpenForListingId === props.params.id
  );

  const {
    isAuthenticated,
    currentUser,
    getListing,
    getOwnListing,
    intl,
    onManageDisableScrolling,
    params: rawParams,
    location,
    scrollingDisabled,
    showListingError,
    reviews = [],
    fetchReviewsError,
    sendInquiryInProgress,
    sendInquiryError,
    isInquiry,
    monthlyTimeSlots,
    onFetchTimeSlots,
    onFetchTransactionLineItems,
    lineItems,
    fetchLineItemsInProgress,
    fetchLineItemsError,
    history,
    callSetInitialValues,
    onSendInquiry,
    onInitializeCardPaymentData,
    config,
    routeConfiguration,
    showOwnListingsOnly,
    onUpdateProfile,
    onSendOrderMessage,
    onSaveLikes,
    saveLikesInProgress,
    saveLikesError,
    saveLikesSuccess,
    userListings,
    onFetchUserListings,
    onFetchReviews,
    onReset
  } = props;

  const savedCartData = currentUser?.attributes?.profile?.publicData?.cartData;
  const [showCartOptions,setShowCartOptions] = useState(false);
  const [showCartCatalogOrderDetails,setShowCartCatalogOrderDetails] = useState(false);
  const [showConfirmOrderForm,setShowConfirmOrderForm] = useState(false);
  const [showSuccessView,setShowSuccessView] = useState(false);
  const [successMessage,setSuccessMessage] = useState("");
  const [showRequestQuoteView,setRequestQuoteView] = useState(false);
  const [showRequestGuestDurationView,setShowRequestGuestDurationView] = useState(false);
  const [showRequestLocationTime,setShowRequestLocationTime] = useState(false);

  
  
  const [mounted, setMounted] = useState(false);
  const [selectedCatalogFolderName,setSelectedCatalogFolderName] = useState("");
  const [currentCartItmToEdit,setCurrentCartItmToEdit] = useState({});
  const [cartData,setCartData] = useState(savedCartData);
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
  const [showSuccessBadge,setShowSuccessBadge] = useState(false);
  const [currentRequestQuoteTab,setCurrentRequestQuoteTab] = useState("");
  const [selectedServiceType, setSelectedServiceType] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [duration, setDuration] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState([]);
  const [showProgress,setShowProgress] = useState(false);
  const [showShareMenus, setShowShareMenus] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const [showOwnListingMessage, setShowOwnListingMessage] = useState(false);
  const [isUserDetails, setIsUserDetails] = useState(false);
  const [about,setAbout] = useState("");
  const favourites = currentUser?.attributes?.profile?.protectedData?.favourites || [];
  const favouriteUsers = currentUser?.attributes?.profile?.protectedData?.favouriteUsers || [];
  const [showFull, setShowFull] = useState(false);

  ////console.log(reviews,"   nnnnnnnnnnnnnnnncccccccccccccccccccc")

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if(currentRequestQuoteTab === REQUEST_QUOTE_TABS[0]){
      setRequestQuoteView(true);
    }else{
      setRequestQuoteView(false);
    }

    if(currentRequestQuoteTab === REQUEST_QUOTE_TABS[1]){
      setShowRequestGuestDurationView(true);
    }else{
      setShowRequestGuestDurationView(false);
    }

    if(currentRequestQuoteTab === REQUEST_QUOTE_TABS[2]){
      setShowRequestLocationTime(true);
    }else{
      setShowRequestLocationTime(false);
    }
  }, [currentRequestQuoteTab]);

  useEffect(() => {
    if(isInquiry){
      onReset();
      history.push("/inbox");
    }
  }, [isInquiry]);

  useEffect(()=>{
    if(saveLikesSuccess){
      setInProgress(false);
      setIsLiked(true);
    }
  },[saveLikesSuccess])

  const listingConfig = config.listing;
  const listingId = new UUID(rawParams.id);
  const isVariant = rawParams.variant != null;
  const isPendingApprovalVariant = rawParams.variant === LISTING_PAGE_PENDING_APPROVAL_VARIANT;
  const isDraftVariant = rawParams.variant === LISTING_PAGE_DRAFT_VARIANT;
  const currentListing =
    isPendingApprovalVariant || isDraftVariant || showOwnListingsOnly
      ? ensureOwnListing(getOwnListing(listingId))
      : ensureListing(getListing(listingId));

  const listingSlug = rawParams.slug || createSlug(currentListing.attributes.title || '');
  const params = { slug: listingSlug, ...rawParams };

  const listingPathParamType = isDraftVariant
    ? LISTING_PAGE_PARAM_TYPE_DRAFT
    : LISTING_PAGE_PARAM_TYPE_EDIT;
  const listingTab = isDraftVariant ? 'photos' : 'details';

  const isApproved =
    currentListing.id && currentListing.attributes.state !== LISTING_STATE_PENDING_APPROVAL;

  const pendingIsApproved = isPendingApprovalVariant && isApproved;
  const isFavourite = favourites.includes(listingId.uuid);

  // If a /pending-approval URL is shared, the UI requires
  // authentication and attempts to fetch the listing from own
  // listings. This will fail with 403 Forbidden if the author is
  // another user. We use this information to try to fetch the
  // public listing.
  const pendingOtherUsersListing =
    (isPendingApprovalVariant || isDraftVariant) &&
    showListingError &&
    showListingError.status === 403;
  const shouldShowPublicListingPage = pendingIsApproved || pendingOtherUsersListing;

  if (shouldShowPublicListingPage) {
    return <NamedRedirect name="ListingPage" params={params} search={location.search} />;
  }

  const topbar = <TopbarContainer />;

  if (showListingError && showListingError.status === 404) {
    // 404 listing not found
    return <NotFoundPage staticContext={props.staticContext} />;
  } else if (showListingError) {
    // Other error in fetching listing
    return <ErrorPage topbar={topbar} scrollingDisabled={scrollingDisabled} intl={intl} />;
  } else if (!currentListing.id) {
    // Still loading the listing
    return <LoadingPage topbar={topbar} scrollingDisabled={scrollingDisabled} intl={intl} />;
  }

  const {
    description = '',
    geolocation = null,
    price = null,
    title = '',
    publicData = {},
    metadata = {}
  } = currentListing.attributes;

  
  const {
    images = []
  } = currentListing;


  const getImageUrl = (imageArr,imgId)=>{
    let url = "";
    imageArr.map((itm,key)=>{
      if(itm.id.uuid === imgId){
        url = itm.attributes.variants["facebook"].url;
      }
    })
    return url;
  }

  const richTitle = (
    <span>
      {richText(title, {
        longWordMinLength: MIN_LENGTH_FOR_LONG_WORDS_IN_TITLE,
        longWordClass: css.longWord,
      })}
    </span>
  );

  const authorAvailable = currentListing && currentListing.author;
  const userAndListingAuthorAvailable = !!(currentUser && authorAvailable);
  const isOwnListing =
    userAndListingAuthorAvailable && currentListing.author.id.uuid === currentUser.id.uuid;

     const ServiceTypesCakes = [
      "Single-Tier Cake (One level only)",
      "Multi-Tier Cake (Two or more stacked layers)",
      "Themed cakes (custom shapes: cars, animals, handbags, letters, numbers)",
      "Piñata Cake (Surprise Inside)",
      "Lactose-free cakes",
      "Gluten-free cakes",
      "Sugar-free cakes",
    ];

  const serviceTypesCatering = [
      "Food delivery only",
      "Food + table setting items",
      "Everything in Medium + food serving + cleanup"
    ];

    const serviceTypesClasicalMusic = [
      "Vocalist",
      "Instrumental",
      "Both of them"
    ];

    const serviceTypesDecoration = [
      "Flower decoration",
      "Balloon decoration",
      "Themed decoration"
    ];

    const childrenAgeEntertainment = [
      "0-2 years",
      "2-4 years",
      "4-6 years",
      "6-8 years",
      "All ages",
    ];

    const serviceTypesEntertainment = [
      
    ];

  const serviceTypesPhotographer = [
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

const serviceTypesRentalBouncer = [
      "Inflatable bouncers (Bouncy Castles, Slides etc)",
      "Trampolines"
    ];

    const serviceTypesRentalShades = [
      "Tents",
      "Canopies/Gazebos",
      "Umbrellas",
      "Rain Covers"
    ];

const serviceTypesRentalSpace = [
      "Swimming pool",
      "Garden (outdoor space in private zone)",
      "Both: Swimming pool and Garden"
    ];

     const serviceTypesSweets = [
      "Themed sweets (custom shapes: cars, animals, handbags, letters, numbers)",
      "Lactose-free sweets",
      "Gluten-free sweets",
      "Sugar-free sweets",
    ];

    const serviceTypesVideographer = [
      "Video booth",
      "Wedding videography",
      "Event videography  (birthdays, corporate events, etc.)",
      "Commercial videography (advertising, branding)",
      "Product videography (for online stores)",
      "Family videography",
      "Newborn and child videography",
      "Fashion videography",
      "Studio videography",
      "Outdoor videography",
      "Real estate videography",
      "Model portfolio videography"
    ];
    
    const getFolder = data=>{
      let result = [];
      data.map((itm,key)=>{
        if(!result.includes(itm.folder)){
          result.push(itm.folder);
        }
        
      });
      return result;
    }
 
 
    const {
        addonsPrice="",
        catalog=[],
        category="",
        chairsPrice="",
        coverPhoto="",
        deliveryTime="",
        equipmentProvided=[],
        extras=[],
        finalChoice="",
        maxDuration="",
        minDuration="",
        photoVideoFormat=[],
        serviceMenuType=[],
        serviceStandards=[],
        serviceType=[],
        serviceTypeBasicPrice="",
        serviceTypeMediumPrice="",
        serviceTypeProPrice="",
        transactionProcessAlias="",
        listingType="",
        unitType="",
        workExperience="",
        childrenAge=[],
        originalPrice

      } = publicData;

      const folders = getFolder(catalog);
      //const [folders,setFolders] = useState(folderr);
      let serviceTypes = [];

      //useEffect(()=>{
         
        {category === "Animation" || category === "Magic" || category === "Face Paint" ?
          serviceTypes = (serviceTypesEntertainment)
        :category === "BD Cake"?
          serviceTypes = (ServiceTypesCakes)
        :category === "Sweets"?
          serviceTypes = (serviceTypesSweets)
        :category === "Photographer"?
          serviceTypes = (serviceTypesPhotographer)
        :category === "Videographer"?
          serviceTypes = (serviceTypesVideographer)
        :category === "Classical music"?
          serviceTypes = (serviceTypesClasicalMusic)
        :category === "Party Music/DJs"?
          serviceTypes = ([])
        :category === "Rental shade and rain equipment"?
          serviceTypes = (serviceTypesRentalShades)
        :category === "Rental space"?
          serviceTypes = (serviceTypesRentalSpace)
        :category === "Rental bouncer"?
         serviceTypes = (serviceTypesRentalBouncer)
        :category === "Balloon decoration" || category === "Flower arrangements" || category === "Themed decoration"?
         serviceTypes = (serviceTypesDecoration)
        :category === "Catering"?
          serviceTypes = (serviceTypesCatering)
        :
        ""}
      //},[])

     

  if (!(listingType && transactionProcessAlias && unitType)) {
    // Listing should always contain listingType, transactionProcessAlias and unitType)
    return (
      <ErrorPage topbar={topbar} scrollingDisabled={scrollingDisabled} intl={intl} invalidListing />
    );
  }
  const processName = resolveLatestProcessName(transactionProcessAlias.split('/')[0]);
  const isBooking = isBookingProcess(processName);
  const isPurchase = isPurchaseProcess(processName);
  const processType = isBooking ? 'booking' : isPurchase ? 'purchase' : 'inquiry';

  const currentAuthor = authorAvailable ? currentListing.author : null;
  const ensuredAuthor = ensureUser(currentAuthor);
  const noPayoutDetailsSetWithOwnListing =
    isOwnListing && (processType !== 'inquiry' && !currentUser?.attributes?.stripeConnected);
  const payoutDetailsWarning = noPayoutDetailsSetWithOwnListing ? (
    <span className={css.payoutDetailsWarning}>
      <FormattedMessage id="ListingPage.payoutDetailsWarning" values={{ processType }} />
      <NamedLink name="StripePayoutPage">
        <FormattedMessage id="ListingPage.payoutDetailsWarningLink" />
      </NamedLink>
    </span>
  ) : null;

  // When user is banned or deleted the listing is also deleted.
  // Because listing can be never showed with banned or deleted user we don't have to provide
  // banned or deleted display names for the function
  const authorDisplayName = userDisplayNameAsString(ensuredAuthor, '');
  const profileImage = currentListing?.author?.profileImage?.attributes?.variants['listing-card-6x']?.url;
  const businessName = currentListing?.author?.attributes?.profile?.publicData?.businessName;
  const userLocation = currentListing?.author?.attributes?.profile?.publicData?.location;
  const authorId = currentListing?.author?.id;
  const language = currentListing?.author?.attributes?.profile?.publicData?.language;
  const bio = currentListing?.author?.attributes?.profile?.publicData?.bio;

  
  // useEffect(() => {
  //   if(userListings === null || userListings === undefined || userListings.length === 0){
  //     onFetchUserListings(authorId);
  //   }
  // }, []);

  
  useEffect(() => {
    if(userListings === null || userListings === undefined || userListings.length === 0){
      onFetchUserListings(authorId);
      onFetchReviews(authorId);
    }
  }, [isUserDetails]);

  useEffect(() => {
    console.log("Updatiiiiiiiiiiiiiiiiiiiiiiig    ooooooo")
     const updated = currentUser?.attributes?.profile?.publicData?.cartData;
     const isEqual = _.isEqual(updated,cartData);
     if(!isEqual){
      console.log("Updated    ooooooo")
      setCartData(updated);
     }
     
  }, [currentUser]);

  
  const { formattedPrice } = priceData(price, config.currency, intl);

  const commonParams = { params, history, routes: routeConfiguration };
  const [showDatePicker,setShowDatePicker] = useState(false);
  
  const onContactUser = handleContactUser({
    ...commonParams,
    currentUser,
    callSetInitialValues,
    location,
    setInitialValues,
    setInquiryModalOpen,
  });
  // Note: this is for inquiry state in booking and purchase processes. Inquiry process is handled through handleSubmit.
  const onSubmitInquiry = handleSubmitInquiry({
    ...commonParams,
    getListing,
    onSendInquiry,
    setInquiryModalOpen,
  });
  const onSubmit = handleSubmit({
    ...commonParams,
    currentUser,
    callSetInitialValues,
    getListing,
    onInitializeCardPaymentData,
  });

  const handleOrderSubmit = values => {
    const isCurrentlyClosed = currentListing.attributes.state === LISTING_STATE_CLOSED;
    if (isOwnListing || isCurrentlyClosed) {
      window.scrollTo(0, 0);
    } else {
      onSubmit(values);
    }
  };

  const facebookImages = listingImages(currentListing, 'facebook');
  const twitterImages = listingImages(currentListing, 'twitter');
  const schemaImages = listingImages(
    currentListing,
    `${config.layout.listingImage.variantPrefix}-2x`
  ).map(img => img.url);
  const marketplaceName = config.marketplaceName;
  const schemaTitle = intl.formatMessage(
    { id: 'ListingPage.schemaTitle' },
    { title, price: formattedPrice, marketplaceName }
  );
  // You could add reviews, sku, etc. into page schema
  // Read more about product schema
  // https://developers.google.com/search/docs/advanced/structured-data/product
  const productURL = `${config.marketplaceRootURL}${location.pathname}${location.search}${location.hash}`;
  const currentStock = currentListing.currentStock?.attributes?.quantity || 0;
  const schemaAvailability = !currentListing.currentStock
    ? null
    : currentStock > 0
    ? 'https://schema.org/InStock'
    : 'https://schema.org/OutOfStock';

  const availabilityMaybe = schemaAvailability ? { availability: schemaAvailability } : {};

  const serviceMenuTypeDescription = [
      "A La Carte MenuA menu where clients can select individual dishes from a list of menu. That allows clients to choose individual dishes from a list",
      "A pre-set menu that offers a specific selection of dishes at a set price. Clients can choose from various fixed menu options, which typically include a combination of appetizers, main courses, and desserts",
      "A menu that includes elements of both a la carte and fixed menus, offering clients the flexibility to select from a range of fixed dishes along with additional a la carte options."
  ];

  // useEffect(()=>{
  //   if(catalog.length > 0){
  //     setFolders(getFolder(catalog));
  //   }
  // },[catalog])


  const getItemCount = (data,folderName)=>{
    let result = 0;
    data.map((itm,k)=>{
      if(itm.folder === folderName){
        result += 1;
      }
    })
    return result;
  }

  const handleShowSelectedCatalog = (e,folder)=>{
    setSelectedCatalogFolderName(folder);
    setShowCartOptions(true);
    setShowCartCatalogOrderDetails(false);
    setShowConfirmOrderForm(false);
  }

  const handleEditCartItemDetails = (e,catalog)=>{
    setCurrentCartItmToEdit(catalog);
    setShowCartCatalogOrderDetails(true);
    setShowCartOptions(false);
    setShowConfirmOrderForm(false);
  }

  const handleConfirmOrder = (e,catalog)=>{
    setCurrentCartItmToEdit(catalog);
    setShowCartCatalogOrderDetails(false);
    setShowCartOptions(false);
    setShowConfirmOrderForm(true);
  }

  const getFirstCatalogImage = (folder,catalog)=>{
    let result = "";
    catalog.map((itm,key)=>{
      if(itm.folder === folder){
        if(result !== ""){
          return;
        }
        const {catalogImages=[]} = itm;
        const imageUrl = catalogImages !== undefined && catalogImages.length > 0 && catalogImages[0].hasOwnProperty("imgUrl") && catalogImages[0]?.imgUrl !== undefined?catalogImages[0]?.imgUrl:"";
        result = imageUrl;
        
      }
    })
    return result;
  }

  const getListingCart = (cartData)=>{
    
    let res = [];
    cartData !== undefined && cartData.length > 0 && cartData.map((itm,key)=>{
        
        const listingId = currentListing?.id?.uuid;
        //console.log( listingId,"     kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk      ",itm.id)
        if(itm.id === listingId){
            res = itm;
        }
    });
    return res;
}

const getRatingsAverage = reviewData =>{
        let res = [0,0,0,0,0,0];
        let result = 0;
        if(reviewData !== undefined){
            reviewData.map((itm,key)=>{
            res[itm.attributes.rating] += 1;
            })
             result = (res[1] + res[2] + res[3] + res[4] + res[5]) / 5;
        }
        return result;
    }
  const reviewsRatingsAverage = getRatingsAverage(reviews);

  
const handleSendOrderMessage = ()=>{
    //{/* Create a new transaction and add order details to it, them send the order message to provider */}
     
    const listingCart = getListingCart(cartData);
    console.log(listingCart,"     ==========++++++=============        ",cartData);

    if(listingCart !== undefined && listingCart !== null && Object.keys(listingCart).length > 0){
      console.log(listingCart,"     =========2222222=============        ",cartData);
        const orderData = {
          cartData:listingCart,
          isRequestQuote:false,
          message:serviceDescription,
          eventDate,
          location,
          guestCount,
          duration,
          eventLocation,
          selectedServiceType
      }
      onSendOrderMessage(currentListing,orderData);
      setShowConfirmOrderForm(false);
      setSuccessMessage("Your message was sent successfully!");
      setShowSuccessView(true);
      setShowSuccessBadge(true);
    }
    else{
      const orderData = {
          isRequestQuote:true,
          message:serviceDescription,
          eventDate,
          location,
          guestCount,
          duration,
          eventLocation,
          selectedServiceType
      }
      onSendOrderMessage(currentListing,orderData);
      setShowConfirmOrderForm(false);
      setSuccessMessage("Your message was sent successfully!");
      setShowSuccessView(true);
      setShowSuccessBadge(true);
    }
    
}

const handleSendEnquiry = ()=>{
    if(isOwnListing){
      setShowOwnListingMessage(true);
    }else{
      setShowProgress(true);
      const orderData = {
          //message:"New enquiry",
      }
      localStorage.setItem("isEnquiry",true);
      onSendOrderMessage(currentListing,orderData,{isInquiry:true});
    }
    
}

const handleLike = e=>{
  setInProgress(true);
  onSaveLikes(currentListing.id,currentUser.id);
}

const handleShowRequestQuoteView = e =>{
  if(isOwnListing){
      setShowOwnListingMessage(true);
    }else{
      setRequestQuoteView(true);
    }
}

const handleParentClicked = (e,val)=>{
  setShowShareMenus(false);
}

const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '#ff6d75',
  },
  '& .MuiRating-iconHover': {
    color: '#ff3d47',
  },
});

const handleAddFavourite = (listingId,e) =>{
        const data = 
        {protectedData: {
              favourites:[...favourites,listingId]
            }}
        onUpdateProfile(data);
    }

const handleRemoveFavourite = (listingId,e) =>{
  const remainingFavourites = favourites.filter(itm=>itm !== listingId);
    const data = 
    {protectedData: {
          favourites:remainingFavourites
        }}
    onUpdateProfile(data);
}

const handleAddFavouriteUsers = (id,e) =>{
  e.preventDefault();
  e.stopPropagation();
  console.log("vvv")
        const data = 
        {protectedData: {
              favouriteUsers:[...favouriteUsers,id]
            }}
        onUpdateProfile(data);
    }

const handleRemoveFavouriteUsers = (id,e) =>{

  e.preventDefault();
  e.stopPropagation();
  console.log("vvv")
  const remainingFavourites = favouriteUsers.filter(itm=>itm !== id);
    const data = 
    {protectedData: {
          favouriteUsers:remainingFavourites
        }}
    onUpdateProfile(data);
}

console.log(userLocation,"   vvvvvvvvvvvvvvvvc77777777777777cccccccccccccc")
//console.log(userListings,"   userListings")

  return (
    <div onClick={e=>{handleParentClicked(e,true); setShowDatePicker(false)}}>
      <Page
      title={schemaTitle}
      scrollingDisabled={scrollingDisabled}
      author={authorDisplayName}
      description={description}
      facebookImages={facebookImages}
      twitterImages={twitterImages}
      schema={{
        '@context': 'http://schema.org',
        '@type': 'Product',
        description: description,
        name: schemaTitle,
        image: schemaImages,
        offers: {
          '@type': 'Offer',
          url: productURL,
          ...priceForSchemaMaybe(price),
          ...availabilityMaybe,
        },
      }}
    >
      <LayoutSingleColumn
        mainColumnClassName={css.layoutWrapperMain}
        topbar={<TopbarContainer />}
        footer={<FooterContainer />}
      >


        {isUserDetails?
          <StoreFrontPage
            authorDisplayName={authorDisplayName}
            userLocation={userLocation}
            language={language}
            bio={bio}
            userListings={userListings}
            reviews={reviews}
            setShowShareMenus={setShowShareMenus}
            handleSendEnquiry={handleSendEnquiry}
            showShareMenus={showShareMenus}
            handleLike={handleLike}
            profileImage={profileImage}
            setIsUserDetails={setIsUserDetails}
            history={history}
            handleRemoveFavouriteUsers={handleRemoveFavouriteUsers}
            handleAddFavouriteUsers={handleAddFavouriteUsers}
            favouriteUsers={favouriteUsers}
            authorId={authorId}
          />
        :
         <div>
              <div className={css.container_m} >
              <div className={classNames(css.flex_row_1,css.full_w)}>
                <NamedLink name="LandingPage">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M11.9137 1.98752C10.766 1.18411 9.23837 1.18411 8.09063 1.98752L2.35932 5.99944C1.39381 6.6753 0.856954 7.81078 0.947345 8.98587L1.53486 16.6236C1.64567 18.064 2.95084 19.111 4.38105 18.9067L7.0224 18.5294C8.25402 18.3534 9.16884 17.2986 9.16884 16.0545V15C9.16884 14.5398 9.54194 14.1667 10.0022 14.1667C10.4624 14.1667 10.8355 14.5398 10.8355 15V16.0545C10.8355 17.2986 11.7503 18.3534 12.982 18.5294L15.6233 18.9067C17.0535 19.111 18.3587 18.064 18.4695 16.6236L19.057 8.98587C19.1474 7.81078 18.6105 6.67531 17.645 5.99944L11.9137 1.98752ZM9.0464 3.35291C9.62027 2.9512 10.3841 2.9512 10.9579 3.35291L16.6893 7.36483C17.172 7.70276 17.4404 8.2705 17.3952 8.85805L16.8077 16.4957C16.7708 16.9759 16.3357 17.3249 15.859 17.2568L13.2177 16.8795C12.8071 16.8208 12.5022 16.4692 12.5022 16.0545V15C12.5022 13.6193 11.3829 12.5 10.0022 12.5C8.62146 12.5 7.50218 13.6193 7.50218 15V16.0545C7.50218 16.4692 7.19723 16.8208 6.7867 16.8795L4.14535 17.2568C3.66861 17.3249 3.23355 16.9759 3.19662 16.4957L2.6091 8.85804C2.56391 8.2705 2.83233 7.70276 3.31509 7.36483L9.0464 3.35291Z" fill="#EB5017"/>
                  </svg>
                </NamedLink>
                
                <span className={css.catering}>
                  <NamedLink name="SearchPage">
                    <span className={css.item_list}>Item List</span>
                  </NamedLink>
                  / <span className={css.item_list}>Categories</span> / </span>
              </div>
            </div>
            <div className={css.content_con}>
                <div className={css.flex_col_f}>
                
                  <div className={css.content}>
                    
                    <div className={css.flex_row_header}>
                        <div>
                          <img onClick={e=>setIsUserDetails(true)} className={css.profile_img} src={profileImage} />
                        </div>
                        <div>
                          <h1 className={css.header} onClick={e=>setIsUserDetails(true)}>
                            {authorDisplayName}
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                              <path d="M13.7023 8.75223C14.004 8.45153 13.9966 7.97118 13.6857 7.67933C13.3748 7.38749 12.8781 7.39467 12.5764 7.69537L8.57091 11.6868L7.42624 10.5461C7.12449 10.2454 6.62782 10.2383 6.31691 10.5301C6.006 10.8219 5.99858 11.3023 6.30033 11.603L8.00796 13.3046C8.1557 13.4519 8.35878 13.5349 8.57091 13.5349C8.78304 13.5349 8.98613 13.4519 9.13387 13.3046L13.7023 8.75223Z" fill="#0C63CC"/>
                              <path fill-rule="evenodd" clip-rule="evenodd" d="M11.964 2.93458C10.8697 1.9107 9.13294 1.9107 8.03862 2.93458C7.76067 3.19463 7.37419 3.31609 6.99127 3.2637C5.48369 3.05747 4.07866 4.04476 3.81559 5.49519C3.74877 5.86359 3.50991 6.18155 3.16829 6.35685C1.8233 7.04703 1.28662 8.6445 1.95529 9.96747C2.12513 10.3035 2.12513 10.6965 1.95529 11.0325C1.28662 12.3555 1.8233 13.953 3.16829 14.6432C3.50991 14.8185 3.74877 15.1364 3.81559 15.5048C4.07866 16.9553 5.48369 17.9425 6.99127 17.7363C7.37419 17.6839 7.76067 17.8054 8.03862 18.0654C9.13294 19.0893 10.8697 19.0893 11.964 18.0654C12.2419 17.8054 12.6284 17.6839 13.0113 17.7363C14.5189 17.9425 15.9239 16.9553 16.187 15.5048C16.2538 15.1364 16.4927 14.8185 16.8343 14.6432C18.1793 13.953 18.716 12.3555 18.0473 11.0325C17.8775 10.6965 17.8775 10.3035 18.0473 9.96747C18.716 8.6445 18.1793 7.04703 16.8343 6.35685C16.4927 6.18155 16.2538 5.86359 16.187 5.49519C15.9239 4.04476 14.5189 3.05747 13.0113 3.2637C12.6284 3.31609 12.2419 3.19463 11.964 2.93458ZM9.12955 4.02522C9.61561 3.57045 10.387 3.57045 10.8731 4.02522C11.4988 4.61072 12.369 4.88415 13.2311 4.76622C13.9007 4.67462 14.5248 5.11314 14.6416 5.75737C14.792 6.58679 15.3298 7.30265 16.0989 7.69733C16.6963 8.00388 16.9347 8.71343 16.6377 9.30104C16.2553 10.0576 16.2553 10.9424 16.6377 11.699C16.9347 12.2866 16.6963 12.9961 16.0989 13.3027C15.3298 13.6974 14.792 14.4132 14.6416 15.2426C14.5248 15.8869 13.9007 16.3254 13.2311 16.2338C12.369 16.1159 11.4988 16.3893 10.8731 16.9748C10.387 17.4296 9.61561 17.4296 9.12955 16.9748C8.50377 16.3893 7.63364 16.1159 6.77153 16.2338C6.10192 16.3254 5.47785 15.8869 5.361 15.2426C5.21057 14.4132 4.6728 13.6974 3.90367 13.3027C3.30627 12.9961 3.0679 12.2866 3.3649 11.699C3.74727 10.9424 3.74727 10.0576 3.3649 9.30104C3.0679 8.71343 3.30627 8.00388 3.90367 7.69733C4.6728 7.30265 5.21057 6.58679 5.361 5.75737C5.47785 5.11314 6.10192 4.67462 6.77153 4.76622C7.63364 4.88415 8.50377 4.61072 9.12955 4.02522Z" fill="#0C63CC"/>
                            </svg>
                            <span className={css.verified}>Verified</span>
                          </h1>
                          <p className={css.sub_header}>
                            <div>
                              <span>{businessName}</span> <img src={badge}/> 
                            </div>
                            <div className={css.flex_row_4}>
                              <span>(0 reviews)</span> 
                              <div className={css.count_con}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
                                  <path d="M10.5549 1.79976L12.1387 4.99359C12.3547 5.43818 12.9306 5.86463 13.4166 5.94629L16.2872 6.42718C18.123 6.73567 18.555 8.07853 17.2321 9.40325L15.0004 11.6534C14.6224 12.0345 14.4154 12.7695 14.5324 13.2957L15.1714 16.0812C15.6753 18.2861 14.5144 19.139 12.5796 17.9867L9.88895 16.3807C9.403 16.0903 8.60209 16.0903 8.10714 16.3807L5.41644 17.9867C3.49065 19.139 2.32078 18.277 2.82473 16.0812L3.46366 13.2957C3.58064 12.7695 3.37367 12.0345 2.99571 11.6534L0.763955 9.40325C-0.5499 8.07853 -0.126947 6.73567 1.70885 6.42718L4.57953 5.94629C5.05648 5.86463 5.63242 5.43818 5.84839 4.99359L7.43222 1.79976C8.29612 0.0667465 9.69997 0.0667465 10.5549 1.79976Z" fill="#FFFF4D"/>
                                </svg>
                                <span>0</span>
                              </div>
                              
                            </div>
                          
                          </p>

                          <div className={css.flex_row_2}>
                            {userLocation !== undefined && JSON.stringify(userLocation) !== "{}" ?
                            <div>
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0011 5.5C9.51585 5.5 7.50113 7.51472 7.50113 10C7.50113 12.4853 9.51585 14.5 12.0011 14.5C14.4864 14.5 16.5011 12.4853 16.5011 10C16.5011 7.51472 14.4864 5.5 12.0011 5.5ZM9.50113 10C9.50113 8.61929 10.6204 7.5 12.0011 7.5C13.3818 7.5 14.5011 8.61929 14.5011 10C14.5011 11.3807 13.3818 12.5 12.0011 12.5C10.6204 12.5 9.50113 11.3807 9.50113 10Z" fill="#475367"/>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M7.81037 3.59199C10.3481 1.90017 13.6542 1.90017 16.1919 3.59199C19.6228 5.87925 20.586 10.495 18.3562 13.9635L14.5247 19.9238C13.3438 21.7607 10.6585 21.7607 9.47759 19.9238L5.64603 13.9635C3.41626 10.495 4.37948 5.87925 7.81037 3.59199ZM8.91977 5.25609C10.7857 4.01214 13.2166 4.01214 15.0825 5.25609C17.6051 6.93785 18.3134 10.3317 16.6739 12.882L12.8423 18.8422C12.4487 19.4546 11.5536 19.4546 11.16 18.8422L7.32839 12.882C5.68889 10.3317 6.39712 6.93785 8.91977 5.25609Z" fill="#475367"/>
                              </svg>
                              <span>{userLocation?.result?.place_name}</span>
                            </div>
                            :""}
                            <span>Languages:   {language.hasOwnProperty("length")?language.map((itm,key)=>{
                              if(key < language.length-1){
                                return `${itm}, `
                              }else{
                                return `${itm}`
                              }
                              
                              }):language}</span>
                          </div>
                          <div className={css.flex_row_3_}>
                            <div className={css.share} onClick={e=>{setShowShareMenus(true);e.preventDefault(); e.stopPropagation();}}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M14.1654 1.66667C12.3244 1.66667 10.832 3.15905 10.832 5C10.832 5.14235 10.841 5.28262 10.8583 5.42027C10.7378 5.51705 10.5807 5.63956 10.3977 5.77418C9.95111 6.10262 9.3769 6.48286 8.81426 6.74424C8.33092 6.96879 7.7504 7.16366 7.27492 7.30508C7.04048 7.3748 6.83816 7.42961 6.69513 7.46682C6.62372 7.48539 6.56737 7.49951 6.52951 7.50883L6.4871 7.51915L6.47715 7.52153L6.47515 7.522C6.45429 7.52689 6.43365 7.53257 6.41355 7.53892C5.8208 6.99715 5.03168 6.66667 4.16536 6.66667C2.32442 6.66667 0.832031 8.15905 0.832031 10C0.832031 11.841 2.32442 13.3333 4.16536 13.3333C5.03166 13.3333 5.82078 13.0029 6.41351 12.4611C6.44371 12.4706 6.47476 12.4786 6.5066 12.4847L6.50751 12.4849L6.5158 12.4866L6.55393 12.4945C6.58855 12.5018 6.64092 12.5132 6.708 12.5287C6.84241 12.5598 7.03457 12.6072 7.26044 12.6714C7.71811 12.8014 8.28817 12.9931 8.79269 13.2454C9.30285 13.5004 9.88559 13.8868 10.3574 14.2245C10.5528 14.3644 10.7241 14.4922 10.8566 14.5931C10.8404 14.7265 10.832 14.8623 10.832 15C10.832 16.841 12.3244 18.3333 14.1654 18.3333C16.0063 18.3333 17.4987 16.841 17.4987 15C17.4987 13.1591 16.0063 11.6667 14.1654 11.6667C13.0769 11.6667 12.1103 12.1884 11.5019 12.9954C11.4462 12.9547 11.388 12.9125 11.3276 12.8693C10.8342 12.5161 10.1669 12.0691 9.53804 11.7546C8.90353 11.4374 8.22359 11.2124 7.71601 11.0682C7.58478 11.0309 7.46334 10.9985 7.35508 10.9709C7.44847 10.6637 7.4987 10.3377 7.4987 10C7.4987 9.65769 7.4471 9.32742 7.35125 9.01657C7.46931 8.98418 7.60399 8.94603 7.75005 8.90258C8.256 8.75211 8.92548 8.53031 9.51647 8.25576C10.2233 7.9274 10.8991 7.47431 11.3851 7.11684C11.4296 7.08416 11.4726 7.05212 11.5142 7.02085C12.1233 7.81861 13.0842 8.33333 14.1654 8.33333C16.0063 8.33333 17.4987 6.84095 17.4987 5C17.4987 3.15905 16.0063 1.66667 14.1654 1.66667ZM12.4987 5C12.4987 4.07953 13.2449 3.33333 14.1654 3.33333C15.0858 3.33333 15.832 4.07953 15.832 5C15.832 5.92048 15.0858 6.66667 14.1654 6.66667C13.2449 6.66667 12.4987 5.92048 12.4987 5ZM2.4987 10C2.4987 9.07953 3.24489 8.33333 4.16536 8.33333C5.08584 8.33333 5.83203 9.07953 5.83203 10C5.83203 10.9205 5.08584 11.6667 4.16536 11.6667C3.24489 11.6667 2.4987 10.9205 2.4987 10ZM12.4987 15C12.4987 14.0795 13.2449 13.3333 14.1654 13.3333C15.0858 13.3333 15.832 14.0795 15.832 15C15.832 15.9205 15.0858 16.6667 14.1654 16.6667C13.2449 16.6667 12.4987 15.9205 12.4987 15Z" fill="#CC400C"/>
                              </svg>
                              {intl.formatMessage({ id: 'ListingPageCarousel.shareProfile' })}
                            </div>
                            
                            <div className={css.send_con}>
                              <div className={css.send} onClick={e=>{handleSendEnquiry()}}>
                                {intl.formatMessage({ id: 'ListingPageCarousel.sendAMessage' })}
                                {showProgress?
                                  <div class="spinner-border" role="status">
                                  </div>
                                :""}
                              </div>
                              <div className={css.icon_con}>
                                    {isFavourite?
                                        <svg onClick={e=>{handleRemoveFavourite(listingId.uuid,e);e.preventDefault();e.stopPropagation();}} width="20" height="20" viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path  d="M13.9479 3.64151C14.8016 4.07387 15.4966 4.57992 16.0036 5.0054C16.5106 4.57992 17.2055 4.07388 18.0592 3.64151C19.9938 2.66172 22.7781 2.05573 25.9093 3.6415C27.9095 4.65447 29.2625 6.18721 29.9993 8.04814C30.7262 9.88406 30.8249 11.9625 30.475 14.0713C29.8789 17.664 27.4233 20.87 24.9012 23.3401C22.3477 25.8411 19.5479 27.7591 17.9688 28.7592C16.7602 29.5247 15.2471 29.5247 14.0384 28.7592C12.4594 27.7591 9.65947 25.8411 7.1059 23.3401C4.58382 20.87 2.12813 17.6641 1.532 14.0713C1.18212 11.9625 1.28088 9.88406 2.00776 8.04814C2.74455 6.18721 4.09756 4.65447 6.09771 3.6415C9.22891 2.05572 12.0133 2.66172 13.9479 3.64151ZM14.9878 7.71393C15.2411 8.01188 15.6125 8.18364 16.0036 8.18364C16.3941 8.18363 16.7649 8.01246 17.0182 7.71547C17.0185 7.71513 17.0187 7.71479 17.019 7.71444C17.0194 7.71404 17.0197 7.71364 17.0201 7.71324L17.0403 7.69052C17.061 7.6675 17.0959 7.62957 17.1442 7.57958C17.241 7.47937 17.3906 7.33202 17.5876 7.1597C17.9845 6.81244 18.5574 6.37839 19.2641 6.02047C20.6521 5.31751 22.5194 4.91384 24.7045 6.02048C26.1312 6.743 27.0262 7.78282 27.5199 9.0298C28.0235 10.3018 28.1377 11.8666 27.8444 13.6348C27.3891 16.3785 25.4326 19.0871 23.0353 21.435C20.6695 23.7521 18.0429 25.5557 16.542 26.5064C16.2046 26.7201 15.8027 26.7201 15.4653 26.5064C13.9643 25.5557 11.3376 23.7521 8.9718 21.435C6.57449 19.0871 4.61795 16.3785 4.16271 13.6348C3.86933 11.8666 3.98355 10.3018 4.48717 9.0298C4.98088 7.78282 5.87588 6.743 7.30253 6.02048C9.48764 4.91384 11.355 5.3175 12.7431 6.02048C13.4498 6.3784 14.0227 6.81246 14.4197 7.15972C14.6167 7.33205 14.7662 7.47939 14.8631 7.5796C14.9114 7.6296 14.9462 7.66752 14.967 7.69055L14.9878 7.71393Z" fill="red"/>
                                        </svg>
                                    :
                                        <svg onClick={e=>{handleAddFavourite(listingId.uuid,e);e.preventDefault();e.stopPropagation();}} width="20" height="20" viewBox="0 0 32 32" fill="red" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M13.9479 3.64151C14.8016 4.07387 15.4966 4.57992 16.0036 5.0054C16.5106 4.57992 17.2055 4.07388 18.0592 3.64151C19.9938 2.66172 22.7781 2.05573 25.9093 3.6415C27.9095 4.65447 29.2625 6.18721 29.9993 8.04814C30.7262 9.88406 30.8249 11.9625 30.475 14.0713C29.8789 17.664 27.4233 20.87 24.9012 23.3401C22.3477 25.8411 19.5479 27.7591 17.9688 28.7592C16.7602 29.5247 15.2471 29.5247 14.0384 28.7592C12.4594 27.7591 9.65947 25.8411 7.1059 23.3401C4.58382 20.87 2.12813 17.6641 1.532 14.0713C1.18212 11.9625 1.28088 9.88406 2.00776 8.04814C2.74455 6.18721 4.09756 4.65447 6.09771 3.6415C9.22891 2.05572 12.0133 2.66172 13.9479 3.64151ZM14.9878 7.71393C15.2411 8.01188 15.6125 8.18364 16.0036 8.18364C16.3941 8.18363 16.7649 8.01246 17.0182 7.71547C17.0185 7.71513 17.0187 7.71479 17.019 7.71444C17.0194 7.71404 17.0197 7.71364 17.0201 7.71324L17.0403 7.69052C17.061 7.6675 17.0959 7.62957 17.1442 7.57958C17.241 7.47937 17.3906 7.33202 17.5876 7.1597C17.9845 6.81244 18.5574 6.37839 19.2641 6.02047C20.6521 5.31751 22.5194 4.91384 24.7045 6.02048C26.1312 6.743 27.0262 7.78282 27.5199 9.0298C28.0235 10.3018 28.1377 11.8666 27.8444 13.6348C27.3891 16.3785 25.4326 19.0871 23.0353 21.435C20.6695 23.7521 18.0429 25.5557 16.542 26.5064C16.2046 26.7201 15.8027 26.7201 15.4653 26.5064C13.9643 25.5557 11.3376 23.7521 8.9718 21.435C6.57449 19.0871 4.61795 16.3785 4.16271 13.6348C3.86933 11.8666 3.98355 10.3018 4.48717 9.0298C4.98088 7.78282 5.87588 6.743 7.30253 6.02048C9.48764 4.91384 11.355 5.3175 12.7431 6.02048C13.4498 6.3784 14.0227 6.81246 14.4197 7.15972C14.6167 7.33205 14.7662 7.47939 14.8631 7.5796C14.9114 7.6296 14.9462 7.66752 14.967 7.69055L14.9878 7.71393Z" fill="red"/>
                                        </svg>
                                    }
                              </div>
                            </div>
                          </div>
                          
                          {showShareMenus?
                              <div className={css.main_share_con}>
                                  <div className={css.share_link_con}>
                                    <div className={css.link_itm} onClick={e=>{setShowShareMenus(false);navigator.clipboard.writeText(window.location.href);}}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M19.7786 4.22179C17.826 2.26917 14.6602 2.26917 12.7076 4.22179L9.87913 7.05022C9.48861 7.44074 9.48861 8.07391 9.87913 8.46443C10.2697 8.85496 10.9028 8.85496 11.2933 8.46443L14.1218 5.636C15.2933 4.46443 17.1928 4.46443 18.3644 5.636C19.536 6.80758 19.536 8.70707 18.3644 9.87864L15.536 12.7071C15.1455 13.0976 15.1455 13.7308 15.536 14.1213C15.9265 14.5118 16.5597 14.5118 16.9502 14.1213L19.7786 11.2929C21.7312 9.34024 21.7312 6.17441 19.7786 4.22179Z" fill="black"/>
                                            <path d="M14.1218 11.2929C14.5123 10.9023 14.5123 10.2692 14.1218 9.87864C13.7312 9.48812 13.0981 9.48812 12.7076 9.87864L9.87913 12.7071C9.48861 13.0976 9.48861 13.7308 9.87913 14.1213C10.2697 14.5118 10.9028 14.5118 11.2933 14.1213L14.1218 11.2929Z" fill="black"/>
                                            <path d="M8.46492 11.2929C8.85544 10.9023 8.85544 10.2692 8.46492 9.87864C8.07439 9.48812 7.44123 9.48812 7.05071 9.87864L4.22228 12.7071C2.26966 14.6597 2.26966 17.8255 4.22228 19.7781C6.1749 21.7308 9.34072 21.7308 11.2933 19.7781L14.1218 16.9497C14.5123 16.5592 14.5123 15.926 14.1218 15.5355C13.7312 15.145 13.0981 15.145 12.7076 15.5355L9.87913 18.3639C8.70756 19.5355 6.80806 19.5355 5.63649 18.3639C4.46492 17.1924 4.46492 15.2929 5.63649 14.1213L8.46492 11.2929Z" fill="black"/>
                                        </svg>
                                        <span>Copy link</span>
                                    </div>
                                    <FacebookShareButton url={window.location.href}>
                                        <div className={css.link_itm} onClick={e=>setShowShareMenus(false)}>
                                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                              <g clipPath="url(#clip0_761_66337)">
                                                  <path d="M18.375 0H5.625C2.5184 0 0 2.5184 0 5.625V18.375C0 21.4816 2.5184 24 5.625 24H18.375C21.4816 24 24 21.4816 24 18.375V5.625C24 2.5184 21.4816 0 18.375 0Z" fill="url(#paint0_radial_761_66337)"/>
                                                  <path d="M18.375 0H5.625C2.5184 0 0 2.5184 0 5.625V18.375C0 21.4816 2.5184 24 5.625 24H18.375C21.4816 24 24 21.4816 24 18.375V5.625C24 2.5184 21.4816 0 18.375 0Z" fill="url(#paint1_radial_761_66337)"/>
                                                  <path d="M12.0008 2.625C9.45478 2.625 9.13519 2.63616 8.13525 2.68163C7.13719 2.72738 6.45591 2.88534 5.85984 3.11719C5.24316 3.35662 4.72013 3.67697 4.19906 4.19822C3.67753 4.71937 3.35719 5.24241 3.117 5.85881C2.8845 6.45506 2.72634 7.13662 2.68144 8.13422C2.63672 9.13425 2.625 9.45394 2.625 12.0001C2.625 14.5463 2.63625 14.8648 2.68163 15.8647C2.72756 16.8628 2.88553 17.5441 3.11719 18.1402C3.35681 18.7568 3.67716 19.2799 4.19841 19.8009C4.71938 20.3225 5.24241 20.6436 5.85862 20.883C6.45516 21.1148 7.13653 21.2728 8.13441 21.3186C9.13444 21.364 9.45375 21.3752 11.9997 21.3752C14.5461 21.3752 14.8646 21.364 15.8646 21.3186C16.8626 21.2728 17.5447 21.1148 18.1412 20.883C18.7576 20.6436 19.2799 20.3225 19.8007 19.8009C20.3223 19.2799 20.6425 18.7568 20.8828 18.1404C21.1133 17.5441 21.2715 16.8626 21.3184 15.8649C21.3633 14.865 21.375 14.5463 21.375 12.0001C21.375 9.45394 21.3633 9.13444 21.3184 8.13441C21.2715 7.13634 21.1133 6.45516 20.8828 5.85909C20.6425 5.24241 20.3223 4.71937 19.8007 4.19822C19.2793 3.67678 18.7578 3.35644 18.1406 3.11728C17.543 2.88534 16.8613 2.72728 15.8632 2.68163C14.8632 2.63616 14.5448 2.625 11.9979 2.625H12.0008ZM11.1598 4.31447C11.4095 4.31409 11.688 4.31447 12.0008 4.31447C14.5041 4.31447 14.8007 4.32347 15.7892 4.36838C16.7032 4.41019 17.1994 4.56291 17.5298 4.69125C17.9674 4.86112 18.2793 5.06428 18.6072 5.3925C18.9353 5.72062 19.1384 6.03309 19.3088 6.47062C19.4371 6.80062 19.59 7.29675 19.6316 8.21081C19.6765 9.19913 19.6863 9.49594 19.6863 11.9979C19.6863 14.4999 19.6765 14.7968 19.6316 15.7851C19.5898 16.6991 19.4371 17.1952 19.3088 17.5253C19.1389 17.9629 18.9353 18.2744 18.6072 18.6023C18.2791 18.9305 17.9676 19.1335 17.5298 19.3035C17.1997 19.4324 16.7032 19.5848 15.7892 19.6266C14.8009 19.6715 14.5041 19.6812 12.0008 19.6812C9.49753 19.6812 9.20081 19.6715 8.21259 19.6266C7.29853 19.5844 6.80241 19.4317 6.47166 19.3033C6.03422 19.1333 5.72166 18.9303 5.39353 18.6022C5.06541 18.274 4.86234 17.9623 4.692 17.5246C4.56366 17.1945 4.41075 16.6984 4.36913 15.7843C4.32422 14.796 4.31522 14.4992 4.31522 11.9956C4.31522 9.492 4.32422 9.19678 4.36913 8.20847C4.41094 7.29441 4.56366 6.79828 4.692 6.46781C4.86197 6.03028 5.06541 5.71781 5.39363 5.38969C5.72184 5.06156 6.03422 4.85841 6.47175 4.68816C6.80222 4.55925 7.29853 4.40691 8.21259 4.36491C9.07744 4.32581 9.41259 4.31409 11.1598 4.31212V4.31447ZM17.0052 5.87109C16.3841 5.87109 15.8802 6.37453 15.8802 6.99572C15.8802 7.61681 16.3841 8.12072 17.0052 8.12072C17.6263 8.12072 18.1302 7.61681 18.1302 6.99572C18.1302 6.37463 17.6263 5.87072 17.0052 5.87072V5.87109ZM12.0008 7.18556C9.34209 7.18556 7.18641 9.34125 7.18641 12.0001C7.18641 14.6589 9.34209 16.8136 12.0008 16.8136C14.6597 16.8136 16.8146 14.6589 16.8146 12.0001C16.8146 9.34134 14.6595 7.18556 12.0007 7.18556H12.0008ZM12.0008 8.87503C13.7267 8.87503 15.1259 10.2741 15.1259 12.0001C15.1259 13.7259 13.7267 15.1252 12.0008 15.1252C10.275 15.1252 8.87588 13.7259 8.87588 12.0001C8.87588 10.2741 10.2749 8.87503 12.0008 8.87503Z" fill="white"/>
                                              </g>
                                              <defs>
                                                  <radialGradient id="paint0_radial_761_66337" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(6.375 25.8485) rotate(-90) scale(23.7858 22.1227)">
                                                  <stop stopColor="#FFDD55"/>
                                                  <stop offset="0.1" stopColor="#FFDD55"/>
                                                  <stop offset="0.5" stopColor="#FF543E"/>
                                                  <stop offset="1" stopColor="#C837AB"/>
                                                  </radialGradient>
                                                  <radialGradient id="paint1_radial_761_66337" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(-4.02009 1.72884) rotate(78.681) scale(10.6324 43.827)">
                                                  <stop stopColor="#3771C8"/>
                                                  <stop offset="0.128" stopColor="#3771C8"/>
                                                  <stop offset="1" stopColor="#6600FF" stopOpacity="0"/>
                                                  </radialGradient>
                                                  <clipPath id="clip0_761_66337">
                                                  <rect width="24" height="24" fill="white"/>
                                                  </clipPath>
                                              </defs>
                                          </svg>
                                          <span>Instagram</span>
                                      </div>
                                    </FacebookShareButton>
                                    
                                    <WhatsappShareButton url={window.location.href}>
                                      <div className={css.link_itm} onClick={e=>setShowShareMenus(false)}>
                                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                              <g clipPath="url(#clip0_761_66343)">
                                                  <path d="M0.510625 11.8563C0.510062 13.8728 1.04106 15.8417 2.05075 17.5771L0.414062 23.5066L6.52956 21.9156C8.22104 22.8292 10.1162 23.308 12.0421 23.3081H12.0471C18.4048 23.3081 23.5801 18.1748 23.5828 11.8653C23.584 8.80792 22.3851 5.93295 20.2069 3.76997C18.0291 1.60718 15.1327 0.415458 12.0467 0.414062C5.68825 0.414062 0.513344 5.54709 0.510719 11.8563" fill="url(#paint0_linear_761_66343)"/>
                                                  <path d="M0.100313 11.8527C0.0996563 13.9417 0.649687 15.981 1.69537 17.7786L0 23.9207L6.33478 22.2726C8.08022 23.2168 10.0454 23.7147 12.0451 23.7154H12.0502C18.636 23.7154 23.9972 18.3975 24 11.8621C24.0011 8.69488 22.7591 5.71656 20.5031 3.47609C18.2468 1.23591 15.2468 0.00130233 12.0502 0C5.46337 0 0.102938 5.31721 0.100313 11.8527ZM3.87291 17.469L3.63637 17.0965C2.64206 15.5277 2.11725 13.7149 2.118 11.8534C2.12006 6.4213 6.57544 2.00186 12.054 2.00186C14.7071 2.00298 17.2005 3.02921 19.0759 4.89116C20.9512 6.7533 21.9831 9.22865 21.9824 11.8614C21.98 17.2935 17.5245 21.7135 12.0502 21.7135H12.0463C10.2638 21.7126 8.51569 21.2376 6.99113 20.34L6.62831 20.1265L2.86912 21.1045L3.87291 17.469Z" fill="url(#paint1_linear_761_66343)"/>
                                                  <path d="M9.06187 6.89771C8.83819 6.4044 8.60278 6.39445 8.39006 6.3858C8.21587 6.37836 8.01675 6.37892 7.81781 6.37892C7.61869 6.37892 7.29516 6.45324 7.02169 6.74952C6.74794 7.04608 5.97656 7.76273 5.97656 9.22031C5.97656 10.6779 7.04653 12.0866 7.19569 12.2845C7.34503 12.482 9.26128 15.5689 12.2962 16.7564C14.8184 17.7433 15.3317 17.547 15.8791 17.4975C16.4266 17.4482 17.6457 16.7811 17.8944 16.0892C18.1433 15.3975 18.1433 14.8046 18.0687 14.6807C17.9941 14.5572 17.795 14.4831 17.4964 14.335C17.1978 14.1869 15.7297 13.4701 15.4561 13.3712C15.1823 13.2724 14.9833 13.2231 14.7842 13.5198C14.5851 13.8159 14.0133 14.4831 13.839 14.6807C13.6649 14.8787 13.4906 14.9034 13.1921 14.7552C12.8933 14.6065 11.9317 14.2941 10.7909 13.2849C9.90328 12.4996 9.30403 11.5298 9.12984 11.2331C8.95566 10.937 9.11119 10.7764 9.26091 10.6288C9.39506 10.496 9.55959 10.2828 9.70903 10.1099C9.85791 9.93687 9.90759 9.81343 10.0072 9.61585C10.1068 9.41808 10.0569 9.24506 9.98241 9.09687C9.90759 8.94868 9.32737 7.48347 9.06187 6.89771Z" fill="white"/>
                                              </g>
                                              <defs>
                                                  <linearGradient id="paint0_linear_761_66343" x1="1158.85" y1="2309.67" x2="1158.85" y2="0.414062" gradientUnits="userSpaceOnUse">
                                                  <stop stopColor="#1FAF38"/>
                                                  <stop offset="1" stopColor="#60D669"/>
                                                  </linearGradient>
                                                  <linearGradient id="paint1_linear_761_66343" x1="1200" y1="2392.07" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
                                                  <stop stopColor="#F9F9F9"/>
                                                  <stop offset="1" stopColor="white"/>
                                                  </linearGradient>
                                                  <clipPath id="clip0_761_66343">
                                                  <rect width="24" height="24" fill="white"/>
                                                  </clipPath>
                                              </defs>
                                          </svg>
                                          <span>WhatsApp</span>
                                      </div>
                                    </WhatsappShareButton>
                                    
                                    <TwitterShareButton url={window.location.href}>
                                        <div className={css.link_itm} onClick={e=>setShowShareMenus(false)}>
                                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="22" viewBox="0 0 24 22" fill="none">
                                              <path d="M18.9 0.124512H22.5806L14.5406 9.33708L24 21.8754H16.5943L10.7897 14.2725L4.15543 21.8754H0.471429L9.07029 12.0182L0 0.126226H7.59429L12.8331 7.07423L18.9 0.124512ZM17.6057 19.6674H19.6457L6.48 2.21765H4.29257L17.6057 19.6674Z" fill="black"/>
                                          </svg>
                                          <span>X (Twitter)</span>
                                      </div>
                                    </TwitterShareButton>
                                    
                                </div>
                              </div>
                              
                          :""}

                        </div>
                    </div>
                      
                      <div className={css.flex_row_3_mobile}>
                        <button className={css.share}>
                          
                           {intl.formatMessage({ id: 'ListingPageCarousel.shareProfile' })}
                        </button>
                        <div className={css.send_con}>
                          <button className={css.send} onClick={e=>{handleSendEnquiry()}}>
                             {intl.formatMessage({ id: 'ListingPageCarousel.sendAMessage' })}
                            {showProgress?
                              <div class="spinner-border" role="status">
                              </div>
                            :""}
                            
                          </button>
                          <div className={css.icon_con}>
                                    {isFavourite?
                                        <svg onClick={e=>{handleRemoveFavourite(listingId.uuid,e);e.preventDefault();e.stopPropagation();}} width="20" height="20" viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path  d="M13.9479 3.64151C14.8016 4.07387 15.4966 4.57992 16.0036 5.0054C16.5106 4.57992 17.2055 4.07388 18.0592 3.64151C19.9938 2.66172 22.7781 2.05573 25.9093 3.6415C27.9095 4.65447 29.2625 6.18721 29.9993 8.04814C30.7262 9.88406 30.8249 11.9625 30.475 14.0713C29.8789 17.664 27.4233 20.87 24.9012 23.3401C22.3477 25.8411 19.5479 27.7591 17.9688 28.7592C16.7602 29.5247 15.2471 29.5247 14.0384 28.7592C12.4594 27.7591 9.65947 25.8411 7.1059 23.3401C4.58382 20.87 2.12813 17.6641 1.532 14.0713C1.18212 11.9625 1.28088 9.88406 2.00776 8.04814C2.74455 6.18721 4.09756 4.65447 6.09771 3.6415C9.22891 2.05572 12.0133 2.66172 13.9479 3.64151ZM14.9878 7.71393C15.2411 8.01188 15.6125 8.18364 16.0036 8.18364C16.3941 8.18363 16.7649 8.01246 17.0182 7.71547C17.0185 7.71513 17.0187 7.71479 17.019 7.71444C17.0194 7.71404 17.0197 7.71364 17.0201 7.71324L17.0403 7.69052C17.061 7.6675 17.0959 7.62957 17.1442 7.57958C17.241 7.47937 17.3906 7.33202 17.5876 7.1597C17.9845 6.81244 18.5574 6.37839 19.2641 6.02047C20.6521 5.31751 22.5194 4.91384 24.7045 6.02048C26.1312 6.743 27.0262 7.78282 27.5199 9.0298C28.0235 10.3018 28.1377 11.8666 27.8444 13.6348C27.3891 16.3785 25.4326 19.0871 23.0353 21.435C20.6695 23.7521 18.0429 25.5557 16.542 26.5064C16.2046 26.7201 15.8027 26.7201 15.4653 26.5064C13.9643 25.5557 11.3376 23.7521 8.9718 21.435C6.57449 19.0871 4.61795 16.3785 4.16271 13.6348C3.86933 11.8666 3.98355 10.3018 4.48717 9.0298C4.98088 7.78282 5.87588 6.743 7.30253 6.02048C9.48764 4.91384 11.355 5.3175 12.7431 6.02048C13.4498 6.3784 14.0227 6.81246 14.4197 7.15972C14.6167 7.33205 14.7662 7.47939 14.8631 7.5796C14.9114 7.6296 14.9462 7.66752 14.967 7.69055L14.9878 7.71393Z" fill="red"/>
                                        </svg>
                                    :
                                        <svg onClick={e=>{handleAddFavourite(listingId.uuid,e);e.preventDefault();e.stopPropagation();}} width="20" height="20" viewBox="0 0 32 32" fill="red" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M13.9479 3.64151C14.8016 4.07387 15.4966 4.57992 16.0036 5.0054C16.5106 4.57992 17.2055 4.07388 18.0592 3.64151C19.9938 2.66172 22.7781 2.05573 25.9093 3.6415C27.9095 4.65447 29.2625 6.18721 29.9993 8.04814C30.7262 9.88406 30.8249 11.9625 30.475 14.0713C29.8789 17.664 27.4233 20.87 24.9012 23.3401C22.3477 25.8411 19.5479 27.7591 17.9688 28.7592C16.7602 29.5247 15.2471 29.5247 14.0384 28.7592C12.4594 27.7591 9.65947 25.8411 7.1059 23.3401C4.58382 20.87 2.12813 17.6641 1.532 14.0713C1.18212 11.9625 1.28088 9.88406 2.00776 8.04814C2.74455 6.18721 4.09756 4.65447 6.09771 3.6415C9.22891 2.05572 12.0133 2.66172 13.9479 3.64151ZM14.9878 7.71393C15.2411 8.01188 15.6125 8.18364 16.0036 8.18364C16.3941 8.18363 16.7649 8.01246 17.0182 7.71547C17.0185 7.71513 17.0187 7.71479 17.019 7.71444C17.0194 7.71404 17.0197 7.71364 17.0201 7.71324L17.0403 7.69052C17.061 7.6675 17.0959 7.62957 17.1442 7.57958C17.241 7.47937 17.3906 7.33202 17.5876 7.1597C17.9845 6.81244 18.5574 6.37839 19.2641 6.02047C20.6521 5.31751 22.5194 4.91384 24.7045 6.02048C26.1312 6.743 27.0262 7.78282 27.5199 9.0298C28.0235 10.3018 28.1377 11.8666 27.8444 13.6348C27.3891 16.3785 25.4326 19.0871 23.0353 21.435C20.6695 23.7521 18.0429 25.5557 16.542 26.5064C16.2046 26.7201 15.8027 26.7201 15.4653 26.5064C13.9643 25.5557 11.3376 23.7521 8.9718 21.435C6.57449 19.0871 4.61795 16.3785 4.16271 13.6348C3.86933 11.8666 3.98355 10.3018 4.48717 9.0298C4.98088 7.78282 5.87588 6.743 7.30253 6.02048C9.48764 4.91384 11.355 5.3175 12.7431 6.02048C13.4498 6.3784 14.0227 6.81246 14.4197 7.15972C14.6167 7.33205 14.7662 7.47939 14.8631 7.5796C14.9114 7.6296 14.9462 7.66752 14.967 7.69055L14.9878 7.71393Z" fill="red"/>
                                        </svg>
                                    }
                              </div>
                        </div>
                      </div>
                  </div>
                
                  <div className={css.section}>
                    <h1 className={css.about_header}>
                      {intl.formatMessage({ id: 'ListingPageCarousel.aboutMyService' })}
                    </h1>

                    <p>
                      {description}
                    </p>
                    
                    <p>Experience: {workExperience} years</p>

                    
                      {serviceMenuType.length > 0? 
                      <div className={classNames(css.flex_row,"gap-3")}>
                        <div>
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <g clip-path="url(#clip0_2802_77255)">
                              <path d="M12.559 0.960693C12.559 0.960693 11.9515 1.27072 11.3446 1.72729C11.0412 1.95557 10.734 2.22041 10.4912 2.52543C10.2484 2.8304 10.0505 3.19255 10.0806 3.61602C10.1141 4.08665 10.4331 4.43713 10.7734 4.64727C11.1137 4.85737 11.5001 4.98449 11.864 5.10988C12.2279 5.23527 12.5694 5.35893 12.7861 5.49276C13.0028 5.62654 13.0698 5.71321 13.0806 5.86602C13.0819 5.88337 13.061 5.97599 12.9581 6.10522C12.8552 6.23446 12.6897 6.38319 12.5165 6.51351C12.1702 6.77399 11.809 6.96069 11.809 6.96069L12.1938 7.71144C12.1938 7.71144 12.6075 7.50079 13.0238 7.18766C13.2319 7.0311 13.4445 6.8489 13.6182 6.63079C13.7919 6.41258 13.946 6.14141 13.9222 5.80612C13.8887 5.33549 13.5697 4.98501 13.2294 4.77487C12.8891 4.56472 12.5027 4.43765 12.1388 4.31226C11.7749 4.18687 11.4334 4.06321 11.2167 3.92938C11 3.79555 10.933 3.70893 10.9222 3.55612C10.9147 3.45055 10.9792 3.26699 11.1512 3.05094C11.3232 2.83485 11.5833 2.60333 11.8518 2.40135C12.3887 1.99743 12.9438 1.71144 12.9438 1.71144L12.559 0.960693ZM6.55897 3.21069C6.55897 3.21069 5.95147 3.52072 5.34458 3.97729C5.04116 4.20557 4.73403 4.47041 4.49122 4.77543C4.24841 5.0804 4.0505 5.44255 4.08059 5.86602C4.11406 6.33665 4.43309 6.68713 4.77341 6.89727C5.11367 7.10737 5.50006 7.23449 5.86395 7.35988C6.22789 7.48527 6.56942 7.60893 6.78608 7.74276C7.00278 7.87654 7.06977 7.96321 7.08059 8.11602C7.08186 8.13337 7.061 8.22599 6.95811 8.35522C6.85522 8.48446 6.6897 8.63319 6.51655 8.76351C6.17023 9.02399 5.80897 9.21069 5.80897 9.21069L6.19381 9.96144C6.19381 9.96144 6.60753 9.75079 7.02378 9.43766C7.23191 9.2811 7.44453 9.0989 7.6182 8.88074C7.79187 8.66258 7.946 8.39137 7.92219 8.05612C7.88872 7.58549 7.56969 7.23501 7.22937 7.02487C6.88906 6.81472 6.50272 6.68765 6.13883 6.56226C5.77489 6.43686 5.43336 6.31321 5.2167 6.17938C5 6.04555 4.93301 5.95893 4.92219 5.80612C4.91469 5.70055 4.97923 5.51699 5.15122 5.30094C5.32325 5.08485 5.58331 4.85333 5.85181 4.65135C6.38872 4.24743 6.94381 3.96144 6.94381 3.96144L6.55897 3.21069ZM18.559 3.21069C18.559 3.21069 17.9515 3.52072 17.3446 3.97729C17.0412 4.20557 16.734 4.47041 16.4912 4.77543C16.2484 5.0804 16.0505 5.44255 16.0806 5.86602C16.1141 6.33665 16.4331 6.68713 16.7734 6.89727C17.1137 7.10737 17.5001 7.23449 17.864 7.35988C18.2279 7.48527 18.5694 7.60893 18.7861 7.74276C19.0028 7.87654 19.0698 7.96321 19.0806 8.11602C19.0819 8.13337 19.061 8.22599 18.9581 8.35522C18.8552 8.48446 18.6897 8.63319 18.5165 8.76351C18.1702 9.02399 17.809 9.21069 17.809 9.21069L18.1938 9.96144C18.1938 9.96144 18.6075 9.75079 19.0238 9.43766C19.2319 9.2811 19.4445 9.0989 19.6182 8.88074C19.7919 8.66258 19.946 8.39137 19.9222 8.05612C19.8887 7.58549 19.5697 7.23501 19.2294 7.02487C18.8891 6.81472 18.5027 6.68765 18.1388 6.56226C17.7749 6.43686 17.4334 6.31321 17.2167 6.17938C17 6.04555 16.933 5.95893 16.9222 5.80612C16.9147 5.70055 16.9792 5.51699 17.1512 5.30094C17.3232 5.08485 17.5833 4.85333 17.8518 4.65135C18.3887 4.24743 18.9438 3.96144 18.9438 3.96144L18.559 3.21069ZM12.0014 8.7891C11.392 8.7891 10.9799 9.06632 10.6649 9.53882C10.5345 9.73443 10.4292 9.96538 10.3501 10.2169C10.8807 10.1415 11.4315 10.1018 12.0014 10.1018C12.5712 10.1018 13.122 10.1415 13.6527 10.2169C13.5735 9.96538 13.4683 9.73443 13.3379 9.53882C13.0229 9.06632 12.6108 8.7891 12.0014 8.7891ZM12.0014 10.9454C6.40325 10.9454 2.91927 14.9784 2.69483 19.1018H21.308C21.0835 14.9784 17.5995 10.9453 12.0014 10.9453V10.9454ZM1.04966 19.3191L0.453125 19.9156C1.3025 20.765 2.25139 20.7891 3.00139 20.7891H21.0014C21.7514 20.7891 22.7002 20.765 23.5497 19.9156L22.9531 19.3191C22.3025 19.9696 21.7514 19.9455 21.0014 19.9455H3.00139C2.25139 19.9455 1.70023 19.9696 1.04966 19.3191ZM5.28955 21.6329L6.22714 23.0393H17.7756L18.7132 21.6329H5.28955Z" fill="#475367"/>
                            </g>
                            <defs>
                              <clipPath id="clip0_2802_77255">
                                <rect width="24" height="24" fill="white"/>
                              </clipPath>
                            </defs>
                          </svg>
                          {serviceMenuType.length} Menu types
                        </div>
                        <div>
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M21.001 3.75V2.25C19.51 2.25 18.346 2.66625 17.5472 3.48C17.1517 3.88818 16.8585 4.38421 16.6915 4.9275C16.3105 4.665 15.868 4.5 15.376 4.5C13.4837 4.5 12.7683 6.006 12.751 7.03125C12.7506 7.20339 12.7449 7.37547 12.7337 7.54725C12.2297 9.0375 11.251 8.04975 11.251 6C8.83375 8.5665 11.4385 9.513 9.9535 10.998C9.637 11.3145 8.881 11.4375 8.4085 10.8577C7.78525 10.116 9.0535 8.89725 7.85275 7.986C8.0725 9.35775 7.015 9.0735 6.65725 8.78025C6.1915 8.39925 5.34475 7.5615 6.751 5.25C5.3125 5.90625 4.4455 7.239 4.501 8.25C4.651 10.9012 8.749 13.2037 7.09375 14.751C6.259 15.5332 4.61875 14.4757 5.251 12.75C4.4635 13.1512 3.53725 14.1068 3.8335 15.5925C4.0375 16.62 5.5315 18.9375 3.001 20.25L3.03325 20.259L2.96875 21.75C3.01825 21.753 3.22075 21.759 3.54625 21.759C5.65525 21.759 12.9557 21.4335 17.4505 17.13C19.8055 14.874 21.001 11.886 21.001 8.25C21.001 7.21275 20.5292 5.25 18.751 5.25C18.5312 5.25 18.3265 5.28 18.133 5.3265C18.2177 5.0745 18.364 4.7865 18.616 4.52925C19.126 4.014 19.9255 3.75 21.001 3.75ZM18.751 6.75C19.4597 6.75 19.501 8.238 19.501 8.25C19.501 11.4578 18.4607 14.0797 16.4162 16.0425C13.0967 19.2248 7.867 20.013 5.02825 20.2005C5.71975 20.0422 6.5515 19.7197 7.46275 19.1047C11.8518 16.6995 14.1603 11.0273 14.245 7.251H14.251V7.04625C14.254 6.87 14.3245 6 15.376 6C16.0172 6 16.501 6.91125 16.501 7.5H18.001C18.001 7.1775 18.0797 6.75 18.751 6.75Z" fill="#475367"/>
                          </svg>
                          All ingredients provided
                        </div>
                      </div>
                      :""}

                    <div className={css.flex_row_btw}>
                      {serviceMenuType && serviceMenuType.length > 0?
                      
                      <div>
                        <h1 className={css.header_2}>Menu type:</h1>
                        {serviceMenuType.map((itm,key)=>{
                          return(
                            <>
                              <h2 key={`serviceMenuTypeView_${key}`} className={css.header_3}>{itm}</h2>
                              <p>{serviceMenuTypeDescription[key]}</p>
                            </>
                            
                          )
                        })}
                      
                      </div>
                      
                      :""}
                    
                    {serviceType && serviceType.length > 0?
                      <div>
                          <h1 className={css.header_2}>Service types:</h1>
                            {serviceType.map((itm,key)=>{
                              return(
                                <>
                                  <h2 key={`serviceTypeView_${key}`} className={css.header_3}>{itm}</h2>
                                  <p>{serviceTypes[key]}</p>
                                </>
                              )
                            })}
                          
                        </div>
                    :""}

                    {childrenAge && childrenAge.length > 0?
                      <div>
                          <h1 className={css.header_2}>{intl.formatMessage({ id: 'ListingPageCarousel.childrenAge' })}</h1>
                            {childrenAge.map((itm,key)=>{
                              return(
                                <>
                                  <h2 key={`childrenAge${key}`} className={css.header_3}>{itm}</h2>
                                  
                                </>
                              )
                            })}
                          
                        </div>
                    :""}

                    {equipmentProvided && equipmentProvided.length > 0?
                      <div>
                          <h1 className={css.header_2}>Equipments provided:</h1>
                            {equipmentProvided.map((itm,key)=>{
                              return(
                                <>
                                  <h2 key={`equipmentProvided${key}`} className={css.header_3}>{itm}</h2>
                                  
                                </>
                              )
                            })}
                          
                        </div>
                    :""}

                    {photoVideoFormat && photoVideoFormat.length > 0?
                      <div>
                          <h1 className={css.header_2}>Format:</h1>
                            {photoVideoFormat.map((itm,key)=>{
                              return(
                                <>
                                  <h2 key={`photoVideoFormat${key}`} className={css.header_3}>{itm}</h2>
                                  
                                </>
                              )
                            })}
                          
                        </div>
                    :""}

                    {extras && extras.length > 0?
                      <div>
                          <h1 className={css.header_2}>Extras:</h1>
                            {extras.map((itm,key)=>{
                              return(
                                <>
                                  <h2 key={`extras${key}`} className={css.header_3}>{itm}</h2>
                                  
                                </>
                              )
                            })}
                          
                        </div>
                    :""}
                      
                    </div>


                  </div>
                  <div className={classNames(css.section,css.flex_col)}>
                    <h1 className={css.header_2}>
                      {intl.formatMessage({ id: 'ListingPageCarousel.catalog' })}
                    </h1>
                    <div className={css.category_item}>

                    {folders !== undefined && folders.length > 0 && folders.map((folder,key)=>{
                        ////console.log(folder);
                        return(
                                <SimpleCard_2 
                                                description={description} 
                                                image={getFirstCatalogImage(folder,catalog)} 
                                                folder={folder} 
                                                catalog={catalog} 
                                                count={1} 
                                                price={price}
                                                handleShowSelectedCatalog={handleShowSelectedCatalog}
                                            />
                            )
                      })}
                      
                    </div>
                    

                  </div>

                  {serviceStandards.length > 0?
                  <div className={css.section}>
                      <h1 className={css.header_2}>
                        {intl.formatMessage({ id: 'ListingPageCarousel.serviceStandard' })}
                      </h1>
                      {serviceStandards.map((itm,key)=>{
                          return (
                            <div className={css.list}>
                              <div className={css.svg_con}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                  <path d="M15.6754 10.7375C16.0827 10.3644 16.1105 9.73188 15.7375 9.3246C15.3644 8.91732 14.7319 8.88954 14.3246 9.26255L10.6325 12.644L9.6754 11.7674C9.26812 11.3944 8.63557 11.4221 8.26255 11.8294C7.88954 12.2367 7.91732 12.8693 8.3246 13.2423L9.95712 14.7374C10.3393 15.0875 10.9257 15.0875 11.3079 14.7374L15.6754 10.7375Z" fill="#475367"/>
                                  <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12Z" fill="#475367"/>
                                </svg>
                              </div>
                              
                              <span className={css.list_content}>{itm}</span>
                            </div>
                          )
                      })}
                      
                    </div>
                  :""}
                
                  <div className={css.section}>
                    <div className={classNames(css.flex_row_btw,css.mag_top_sm)}>
                      <h1 className={css.header_2}>
                        {intl.formatMessage({ id: 'ListingPageCarousel.reviews' })}
                      </h1>
                      <div className={classNames(css.flex_row)}>
                        <span style={{marginTop:-5}}>({reviewsRatingsAverage})</span>


                       <Box sx={{ '& > legend': { mt: 2 } }} className={css.rating_con}>
                            <StyledRating
                                name="customized-color"
                                defaultValue={reviewsRatingsAverage}
                                getLabelText={(value) => `${value} Heart${value !== 1 ? 's' : ''}`}
                                precision={0.5}
                                icon={
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8.26894 1.45105C9.06651 0.182982 10.9335 0.182982 11.7311 1.45105L13.6599 4.5178C13.9406 4.96396 14.3864 5.28413 14.9023 5.41009L18.4489 6.27584C19.9153 6.63382 20.4922 8.38907 19.5187 9.53076L17.1643 12.2919C16.8218 12.6936 16.6515 13.2116 16.6897 13.7356L16.9527 17.3374C17.0615 18.8268 15.5511 19.9116 14.1518 19.3491L10.7678 17.9888C10.2755 17.7909 9.72448 17.7909 9.23217 17.9888L5.84818 19.3491C4.44893 19.9116 2.93851 18.8268 3.04726 17.3374L3.31026 13.7356C3.34853 13.2116 3.17825 12.6936 2.83572 12.2919L0.481292 9.53076C-0.492242 8.38907 0.0846877 6.63382 1.55115 6.27584L5.09768 5.41009C5.61365 5.28413 6.05944 4.96396 6.34006 4.5178L8.26894 1.45105Z" fill="#FFD700"/>
                                    </svg>
                                }
                                emptyIcon={
                                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M11.3159 1.1822C10.3245 -0.394067 8.01142 -0.394068 7.02 1.1822L5.41261 3.73782C5.29504 3.92475 5.10648 4.06146 4.88508 4.11551L1.92963 4.83697C0.114839 5.27999 -0.619074 7.46814 0.601607 8.89967L2.56363 11.2006C2.70764 11.3695 2.7779 11.5854 2.76206 11.8023L2.54289 14.8038C2.40617 16.6762 4.29639 18.0065 6.01892 17.3141L8.83891 16.1805C9.04973 16.0958 9.2862 16.0958 9.49701 16.1805L12.317 17.3141C14.0395 18.0065 15.9298 16.6762 15.793 14.8038L15.5739 11.8023C15.558 11.5854 15.6283 11.3695 15.7723 11.2006L17.7343 8.89967C18.955 7.46815 18.2211 5.27999 16.4063 4.83697L13.4509 4.11551C13.2294 4.06146 13.0409 3.92475 12.9233 3.73782L11.3159 1.1822ZM8.43082 2.06955C8.76868 1.53237 9.56724 1.53237 9.90511 2.06955L11.5125 4.62517C11.8626 5.18184 12.4171 5.57876 13.0556 5.73463L16.011 6.4561C16.6404 6.60972 16.868 7.34697 16.4661 7.81826L14.5041 10.1192C14.0772 10.6198 13.8637 11.2673 13.9116 11.9237L14.1308 14.9252C14.1753 15.5351 13.5482 16.0127 12.9386 15.7677L10.1186 14.6341C9.50892 14.389 8.82701 14.389 8.2173 14.6341L5.3973 15.7677C4.78775 16.0127 4.1606 15.5351 4.20513 14.9252L4.4243 11.9237C4.47224 11.2673 4.25871 10.6198 3.83183 10.1192L1.86981 7.81826C1.46793 7.34697 1.69557 6.60972 2.32488 6.4561L5.28033 5.73463C5.91886 5.57876 6.47329 5.18184 6.82342 4.62517L8.43082 2.06955Z" fill="#EBC600"/>
                                    </svg>
                                }
                                disabled
                            />
                            
                        </Box>


                      </div>
                      
                    </div>
                    
                    {reviews.length > 0 && reviews.map((itm,key)=>{
                      //console.log(itm,"   vvvvvvvvvvvvvvvvccccccccccccccc")
                      const {attributes,author} = itm;
                      const {content,rating} = attributes;
                      const displayName = author?.attributes?.profile?.displayName;
                      const profileImage = author?.profileImage;
                      const createdAt = author?.attributes?.createdAt?.toDateString();

                      return (
                          <div className={css.section_sub}>
                              <div className={classNames(css.flex_row_btw_2,css.mag_top_sm)}>
                                <div className={classNames(css.flex_row_8)}>
                                  {profileImage !== undefined && profileImage !== null?
                                  <img src={profileImage} />
                                  :
                                  <svg xmlns="http://www.w3.org/2000/svg" width="44" height="45" viewBox="0 0 44 45" fill="none">
                                    <circle cx="22" cy="22.5" r="22" fill="#D9D9D9"/>
                                  </svg>
                                }
                                  
                                  <div>
                                    <h3 className={css.header_4}>{displayName}</h3>
                                    <p>{createdAt}</p>
                                  </div>
                                </div>
                              
                                
                                <Box sx={{ '& > legend': { mt: 2 } }} className={css.rating_con}>
                                      <StyledRating
                                          name="customized-color"
                                          defaultValue={rating}
                                          getLabelText={(value) => `${value} Heart${value !== 1 ? 's' : ''}`}
                                          precision={1}
                                          icon={
                                              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                  <path d="M8.26894 1.45105C9.06651 0.182982 10.9335 0.182982 11.7311 1.45105L13.6599 4.5178C13.9406 4.96396 14.3864 5.28413 14.9023 5.41009L18.4489 6.27584C19.9153 6.63382 20.4922 8.38907 19.5187 9.53076L17.1643 12.2919C16.8218 12.6936 16.6515 13.2116 16.6897 13.7356L16.9527 17.3374C17.0615 18.8268 15.5511 19.9116 14.1518 19.3491L10.7678 17.9888C10.2755 17.7909 9.72448 17.7909 9.23217 17.9888L5.84818 19.3491C4.44893 19.9116 2.93851 18.8268 3.04726 17.3374L3.31026 13.7356C3.34853 13.2116 3.17825 12.6936 2.83572 12.2919L0.481292 9.53076C-0.492242 8.38907 0.0846877 6.63382 1.55115 6.27584L5.09768 5.41009C5.61365 5.28413 6.05944 4.96396 6.34006 4.5178L8.26894 1.45105Z" fill="#FFD700"/>
                                              </svg>
                                          }
                                          emptyIcon={
                                              <svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none">
                                                  <path fill-rule="evenodd" clip-rule="evenodd" d="M11.3159 1.1822C10.3245 -0.394067 8.01142 -0.394068 7.02 1.1822L5.41261 3.73782C5.29504 3.92475 5.10648 4.06146 4.88508 4.11551L1.92963 4.83697C0.114839 5.27999 -0.619074 7.46814 0.601607 8.89967L2.56363 11.2006C2.70764 11.3695 2.7779 11.5854 2.76206 11.8023L2.54289 14.8038C2.40617 16.6762 4.29639 18.0065 6.01892 17.3141L8.83891 16.1805C9.04973 16.0958 9.2862 16.0958 9.49701 16.1805L12.317 17.3141C14.0395 18.0065 15.9298 16.6762 15.793 14.8038L15.5739 11.8023C15.558 11.5854 15.6283 11.3695 15.7723 11.2006L17.7343 8.89967C18.955 7.46815 18.2211 5.27999 16.4063 4.83697L13.4509 4.11551C13.2294 4.06146 13.0409 3.92475 12.9233 3.73782L11.3159 1.1822ZM8.43082 2.06955C8.76868 1.53237 9.56724 1.53237 9.90511 2.06955L11.5125 4.62517C11.8626 5.18184 12.4171 5.57876 13.0556 5.73463L16.011 6.4561C16.6404 6.60972 16.868 7.34697 16.4661 7.81826L14.5041 10.1192C14.0772 10.6198 13.8637 11.2673 13.9116 11.9237L14.1308 14.9252C14.1753 15.5351 13.5482 16.0127 12.9386 15.7677L10.1186 14.6341C9.50892 14.389 8.82701 14.389 8.2173 14.6341L5.3973 15.7677C4.78775 16.0127 4.1606 15.5351 4.20513 14.9252L4.4243 11.9237C4.47224 11.2673 4.25871 10.6198 3.83183 10.1192L1.86981 7.81826C1.46793 7.34697 1.69557 6.60972 2.32488 6.4561L5.28033 5.73463C5.91886 5.57876 6.47329 5.18184 6.82342 4.62517L8.43082 2.06955Z" fill="#EBC600"/>
                                              </svg>
                                          }
                                          disabled
                                      />
                                      
                                  </Box>
                              </div>
                              <p>{content}</p>
                            </div>
                      )
                    })}
                  

                    <button className={classNames(css.btn_outline,css.center_content)}>
                      {intl.formatMessage({ id: 'Dashboard.viewAllReview' })}
                    </button>
                  </div>
                </div>
                <div className={css.aside_con}>
                  <div className={css.aside}>
                    <div className={css.flex_row_3}><span>{intl.formatMessage({ id: 'Dashboard.startingFrom' })}</span><span className={css.amount}>€{originalPrice !== undefined?(originalPrice.amount/100).toFixed(2):(price.amount/100).toFixed(2)}</span></div>
                    <p>Items in cart</p>
                    {currentUser?
                      <CartItems currentUser={currentUser} 
                        listingId={listingId}
                        onUpdateProfile={onUpdateProfile}
                        setSuccessMessage={setSuccessMessage}
                        setShowSuccessView={setShowSuccessView}
                      />
                    :""}
                    <div className={css.flex_col}>
                      {/* <button className={css.btn_outline} onClick={handleConfirmOrder}>
                        Place an order
                      </button> */}
                      <button className={css.send} onClick={handleShowRequestQuoteView}>
                        {intl.formatMessage({ id: 'Dashboard.requestAQuote' })}
                      </button>
                    </div>
                    
                  </div>

                  {showSuccessBadge?
                    <div className={css.success_display}>
                      <div className={css.success_icon_con}>
                      <img src={mark}/>

                      </div>
                      <div>
                        <h3 className={css.header_5}>
                          {intl.formatMessage({ id: 'Dashboard.orderSent' })}
                        </h3>
                        <p className={css.description}>
                          {intl.formatMessage({ id: 'Dashboard.yourOrderHasBeenSent' })}
                        </p>
                      </div>
                      <div onClick={e=>setShowSuccessBadge(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M5.87571 4.69681C5.55028 4.37137 5.02264 4.37137 4.6972 4.69681C4.37177 5.02224 4.37177 5.54988 4.6972 5.87532L8.82199 10.0001L4.6972 14.1249C4.37177 14.4503 4.37177 14.978 4.6972 15.3034C5.02264 15.6288 5.55028 15.6288 5.87571 15.3034L10.0005 11.1786L14.1253 15.3034C14.4507 15.6288 14.9784 15.6288 15.3038 15.3034C15.6292 14.978 15.6292 14.4503 15.3038 14.1249L11.179 10.0001L15.3038 5.87532C15.6292 5.54988 15.6292 5.02224 15.3038 4.69681C14.9784 4.37137 14.4507 4.37137 14.1253 4.69681L10.0005 8.8216L5.87571 4.69681Z" fill="black"/>
                        </svg>
                      </div>
                    </div>
                  :""}
                  
                </div>
                
            </div>
        </div>
        }

       
       

        {showCartOptions?
            <div className={css.overlay}>
              <CartOptions 
                selectedCatalogFolderName={selectedCatalogFolderName} 
                catalog={catalog} 
                images={images} 
                getImageUrl={getImageUrl} 
                setShowCartOptions={setShowCartOptions}
                handleEditCartItemDetails={handleEditCartItemDetails}
                listingId={listingId}
                currentUser={currentUser}
                onUpdateProfile={onUpdateProfile}
                setShowSuccessView={setShowSuccessView}
                setSuccessMessage={setSuccessMessage}
                setShowSuccessBadge={setShowSuccessBadge}
              />
            </div>
          :""
        }

        {showCartCatalogOrderDetails?
            <div className={css.overlay}>
               <CatalogItemOrderDetails 
                currentCartItmToEdit={currentCartItmToEdit} 
                images={images} 
                setCurrentCartItmToEdit={setCurrentCartItmToEdit}
                setShowCartCatalogOrderDetails={setShowCartCatalogOrderDetails}
                forceUpdate={forceUpdate}
                onUpdateProfile={onUpdateProfile}
                currentUser={currentUser}
                cartData={cartData}
                setCartData={setCartData}
                setShowSuccessView={setShowSuccessView}
                setSuccessMessage={setSuccessMessage}
                setShowSuccessBadge={setShowSuccessBadge}
               />
            </div>
          :""
        }

         {showConfirmOrderForm?
            <div className={css.overlay}>
               <ConfirmOrderForm
                  forceUpdate={forceUpdate}
                  onUpdateProfile={onUpdateProfile}
                  currentUser={currentUser}
                  cartData={cartData}
                  setCartData={setCartData}
                  listingType={listingType}
                  setShowConfirmOrderForm={setShowConfirmOrderForm}
                  onSendOrderMessage={onSendOrderMessage}
                  currentListing={currentListing}
                  setShowSuccessView={setShowSuccessView}
                  setSuccessMessage={setSuccessMessage}
                  setShowSuccessBadge={setShowSuccessBadge}
                  showDatePicker={showDatePicker}
                  setShowDatePicker={setShowDatePicker}
               />
            </div>
          :""
        }

        {showSuccessView?
        <div className={css.overlay}>
          <SuccessView
            setShowSuccessView={setShowSuccessView} 
            message={successMessage}
            setShowFull={setShowFull}
            showFull={showFull}
           />
        </div>
          
        :""}

         {showOwnListingMessage?
        <div className={css.overlay}>
          <OwnListingMessage
            setShowOwnListingMessage={setShowOwnListingMessage}
           />
        </div>
          
        :""}

         {showRequestQuoteView?
          <div className={css.overlay}>
            <RequestQuoteForm
              setRequestQuoteView={setRequestQuoteView} 
              message={serviceDescription} 
              currentListing={currentListing} 
              setCurrentRequestQuoteTab={setCurrentRequestQuoteTab}
              setSelectedServiceType={setSelectedServiceType}
              setServiceDescription={setServiceDescription}
            />
          </div>
        :""}

        {showRequestGuestDurationView?
          <div className={css.overlay}>
            <RequestGuestDuration
              setShowRequestGuestDurationView={setShowRequestGuestDurationView} 
              message={successMessage} 
              currentListing={currentListing} 
              setCurrentRequestQuoteTab={setCurrentRequestQuoteTab}
              setGuestCount={setGuestCount}
              setDuration={setDuration}
            />
          </div>
        :""}
        {showRequestLocationTime?
          <div className={css.overlay}>
            <RequestLocationTime
              setShowRequestLocationTime={setShowRequestLocationTime} 
              message={successMessage} 
              currentListing={currentListing} 
              setCurrentRequestQuoteTab={setCurrentRequestQuoteTab}
              
              onUpdateProfile={onUpdateProfile}
              currentUser={currentUser}
              listingType={listingType}
              setShowConfirmOrderForm={setShowConfirmOrderForm}
              onSendOrderMessage={onSendOrderMessage}
              setShowSuccessView={setShowSuccessView}
              setSuccessMessage={setSuccessMessage}
              setShowSuccessBadge={setShowSuccessBadge}
              setEventDate={setEventDate}
              eventDate={eventDate}
              setEventLocation={setEventLocation}
              eventLocation={eventLocation}
              handleSendOrderMessage={handleSendOrderMessage}
              showDatePicker={showDatePicker}
              setShowDatePicker={setShowDatePicker}
            />
          </div>
        :""}

        {showFull?
          <div className={css.cart_modal}>
           <div>
                  <div className={css.aside}>
                    <div className={css.flex_row_9}>
                      <div className={css.flex_row_3}><span>{intl.formatMessage({ id: 'Dashboard.startingFrom' })}</span><span className={css.amount}>€{originalPrice !== undefined?(originalPrice.amount/100).toFixed(2):(price.amount/100).toFixed(2)}</span></div>
                      <svg onClick={e=>setShowFull(false)} xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-caret-down" viewBox="0 0 16 16">
                        <path d="M3.204 5h9.592L8 10.481zm-.753.659 4.796 5.48a1 1 0 0 0 1.506 0l4.796-5.48c.566-.647.106-1.659-.753-1.659H3.204a1 1 0 0 0-.753 1.659"/>
                      </svg>
                    </div>
                       
                    <p>Items in cart</p>
                    {currentUser?
                      <CartItems currentUser={currentUser} 
                        listingId={listingId}
                        onUpdateProfile={onUpdateProfile}
                        setSuccessMessage={setSuccessMessage}
                        setShowSuccessView={setShowSuccessView}
                      />
                    :""}
                    <div className={css.flex_col}>
                      {/* <button className={css.btn_outline} onClick={handleConfirmOrder}>
                        Place an order
                      </button> */}
                      <button className={css.send} onClick={handleShowRequestQuoteView}>
                        {intl.formatMessage({ id: 'Dashboard.requestAQuote' })}
                      </button>
                    </div>
                    
                  </div>

                  {showSuccessBadge?
                    <div className={css.success_display}>
                      <div className={css.success_icon_con}>
                      <img src={mark}/>

                      </div>
                      <div>
                        <h3 className={css.header_5}>
                          {intl.formatMessage({ id: 'Dashboard.orderSent' })}
                        </h3>
                        <p className={css.description}>
                          {intl.formatMessage({ id: 'Dashboard.yourOrderHasBeenSent' })}
                        </p>
                      </div>
                      <div onClick={e=>setShowSuccessBadge(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M5.87571 4.69681C5.55028 4.37137 5.02264 4.37137 4.6972 4.69681C4.37177 5.02224 4.37177 5.54988 4.6972 5.87532L8.82199 10.0001L4.6972 14.1249C4.37177 14.4503 4.37177 14.978 4.6972 15.3034C5.02264 15.6288 5.55028 15.6288 5.87571 15.3034L10.0005 11.1786L14.1253 15.3034C14.4507 15.6288 14.9784 15.6288 15.3038 15.3034C15.6292 14.978 15.6292 14.4503 15.3038 14.1249L11.179 10.0001L15.3038 5.87532C15.6292 5.54988 15.6292 5.02224 15.3038 4.69681C14.9784 4.37137 14.4507 4.37137 14.1253 4.69681L10.0005 8.8216L5.87571 4.69681Z" fill="black"/>
                        </svg>
                      </div>
                    </div>
                  :""}
                  
                </div>
        </div>
        :
        <div className={classNames(css.cart_modal,css.flex_row_9)}>
          <div className={css.flex_row_3}><span>{intl.formatMessage({ id: 'Dashboard.startingFrom' })}</span><span className={css.amount}>€{originalPrice !== undefined?(originalPrice.amount/100).toFixed(2):(price.amount/100).toFixed(2)}</span></div>
          <svg onClick={e=>setShowFull(true)} xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-caret-up" viewBox="0 0 16 16">
            <path d="M3.204 11h9.592L8 5.519zm-.753-.659 4.796-5.48a1 1 0 0 1 1.506 0l4.796 5.48c.566.647.106 1.659-.753 1.659H3.204a1 1 0 0 1-.753-1.659"/>
          </svg>
        </div>
        }
        
      </LayoutSingleColumn>
    </Page>
    </div>
    
  );
};

/**
 * The ListingPage component with carousel layout.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.params - The path params object
 * @param {string} props.params.id - The listing id
 * @param {string} props.params.slug - The listing slug
 * @param {LISTING_PAGE_DRAFT_VARIANT | LISTING_PAGE_PENDING_APPROVAL_VARIANT} props.params.variant - The listing variant
 * @param {Function} props.onManageDisableScrolling - The on manage disable scrolling function
 * @param {boolean} props.isAuthenticated - Whether the user is authenticated
 * @param {Function} props.getListing - The get listing function
 * @param {Function} props.getOwnListing - The get own listing function
 * @param {Object} props.currentUser - The current user
 * @param {boolean} props.scrollingDisabled - Whether scrolling is disabled
 * @param {string} props.inquiryModalOpenForListingId - The inquiry modal open for the specific listing id
 * @param {propTypes.error} props.showListingError - The show listing error
 * @param {Function} props.callSetInitialValues - The call setInitialValues function, which is given to this function as a parameter
 * @param {Array<propTypes.review>} props.reviews - The reviews
 * @param {propTypes.error} props.fetchReviewsError - The fetch reviews error
 * @param {Object<string, Object>} props.monthlyTimeSlots - The monthly time slots. E.g. { '2019-11': { timeSlots: [], fetchTimeSlotsInProgress: false, fetchTimeSlotsError: null } }
 * @param {boolean} props.sendInquiryInProgress - Whether the send inquiry is in progress
 * @param {propTypes.error} props.sendInquiryError - The send inquiry error
 * @param {Function} props.onSendInquiry - The on send inquiry function
 * @param {Function} props.onInitializeCardPaymentData - The on initialize card payment data function
 * @param {Function} props.onFetchTimeSlots - The on fetch time slots function
 * @param {Function} props.onFetchTransactionLineItems - The on fetch transaction line items function
 * @param {Array<propTypes.transactionLineItem>} props.lineItems - The line items
 * @param {boolean} props.fetchLineItemsInProgress - Whether the fetch line items is in progress
 * @param {propTypes.error} props.fetchLineItemsError - The fetch line items error
 * @returns {JSX.Element} listing page component
 */
const EnhancedListingPage = props => {
  const config = useConfiguration();
  const routeConfiguration = useRouteConfiguration();
  const intl = useIntl();
  const history = useHistory();
  const location = useLocation();

  const showListingError = props.showListingError;
  const isVariant = props.params?.variant != null;
  const currentUser = props.currentUser;
  if (isForbiddenError(showListingError) && !isVariant && !currentUser) {
    // This can happen if private marketplace mode is active
    return (
      <NamedRedirect
        name="SignupPage"
        state={{ from: `${location.pathname}${location.search}${location.hash}` }}
      />
    );
  }

  const isPrivateMarketplace = config.accessControl.marketplace.private === true;
  const isUnauthorizedUser = currentUser && !isUserAuthorized(currentUser);
  const hasNoViewingRights = currentUser && !hasPermissionToViewData(currentUser);
  const hasUserPendingApprovalError = isErrorUserPendingApproval(showListingError);

  if ((isPrivateMarketplace && isUnauthorizedUser) || hasUserPendingApprovalError) {
    return (
      <NamedRedirect
        name="NoAccessPage"
        params={{ missingAccessRight: NO_ACCESS_PAGE_USER_PENDING_APPROVAL }}
      />
    );
  } else if (
    (hasNoViewingRights && isForbiddenError(showListingError)) ||
    isErrorNoViewingPermission(showListingError)
  ) {
    // If the user has no viewing rights, fetching anything but their own listings
    // will return a 403 error. If that happens, redirect to NoAccessPage.
    return (
      <NamedRedirect
        name="NoAccessPage"
        params={{ missingAccessRight: NO_ACCESS_PAGE_VIEW_LISTINGS }}
      />
    );
  }

  return (
    <ListingPageComponent
      config={config}
      routeConfiguration={routeConfiguration}
      intl={intl}
      history={history}
      location={location}
      showOwnListingsOnly={hasNoViewingRights}
      {...props}
    />
  );
};

const mapStateToProps = state => {
  const { isAuthenticated } = state.auth;
  const {
    showListingError,
    reviews,
    fetchReviewsError,
    monthlyTimeSlots,
    sendInquiryInProgress,
    sendInquiryError,
    isInquiry,
    lineItems,
    fetchLineItemsInProgress,
    fetchLineItemsError,
    inquiryModalOpenForListingId,
    saveLikesInProgress,
    saveLikesError,
    saveLikesSuccess,
    userListings
  } = state.ListingPage;
  const { currentUser } = state.user;

  //console.log(reviews,"   ooooooooooooooo")

  const getListing = id => {
    const ref = { id, type: 'listing' };
    const listings = getMarketplaceEntities(state, [ref]);
    return listings.length === 1 ? listings[0] : null;
  };

  const getOwnListing = id => {
    const ref = { id, type: 'ownListing' };
    const listings = getMarketplaceEntities(state, [ref]);
    return listings.length === 1 ? listings[0] : null;
  };

  return {
    isAuthenticated,
    currentUser,
    getListing,
    getOwnListing,
    scrollingDisabled: isScrollingDisabled(state),
    inquiryModalOpenForListingId,
    showListingError,
    reviews,
    fetchReviewsError,
    monthlyTimeSlots,
    lineItems,
    fetchLineItemsInProgress,
    fetchLineItemsError,
    sendInquiryInProgress,
    sendInquiryError,
    isInquiry,
    saveLikesInProgress,
    saveLikesError,
    saveLikesSuccess,
    userListings
  };
};

const mapDispatchToProps = dispatch => ({
  onManageDisableScrolling: (componentId, disableScrolling) =>
    dispatch(manageDisableScrolling(componentId, disableScrolling)),
  callSetInitialValues: (setInitialValues, values, saveToSessionStorage) =>
    dispatch(setInitialValues(values, saveToSessionStorage)),
  onFetchTransactionLineItems: params => dispatch(fetchTransactionLineItems(params)),
  onSendInquiry: (listing, message) => dispatch(sendInquiry(listing, message)),
  onInitializeCardPaymentData: () => dispatch(initializeCardPaymentData()),
  onFetchTimeSlots: (listingId, start, end, timeZone) =>
    dispatch(fetchTimeSlots(listingId, start, end, timeZone)),
  onUpdateProfile:(data) => dispatch(updateProfile(data)),
  onSendOrderMessage:(listing,orderData,isInquiry) => dispatch(sendInquiry(listing,orderData,isInquiry)),
  onSaveLikes:(listingId,userId) => dispatch(saveLike(listingId,userId)),
  onFetchUserListings:(userId)=> dispatch(fetchUserListings(userId)),
  onFetchReviews:(authorId)=> dispatch(fetchReviews()),
  onReset:()=>dispatch(reset())
});


// Note: it is important that the withRouter HOC is **outside** the
// connect HOC, otherwise React Router won't rerender any Route
// components since connect implements a shouldComponentUpdate
// lifecycle hook.
//
// See: https://github.com/ReactTraining/react-router/issues/4671
const ListingPage = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(EnhancedListingPage);

export default ListingPage;
