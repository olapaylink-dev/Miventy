import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { useHistory, useLocation } from 'react-router-dom';
import omit from 'lodash/omit';
import classNames from 'classnames';

import { useConfiguration } from '../../context/configurationContext';
import { useRouteConfiguration } from '../../context/routeConfigurationContext';

import { useIntl, FormattedMessage } from '../../util/reactIntl';
import {
  isAnyFilterActive,
  isMainSearchTypeKeywords,
  isOriginInUse,
  getQueryParamNames,
} from '../../util/search';
import {
  NO_ACCESS_PAGE_USER_PENDING_APPROVAL,
  NO_ACCESS_PAGE_VIEW_LISTINGS,
  parse,
} from '../../util/urlHelpers';
import { createResourceLocatorString } from '../../util/routes';
import { propTypes } from '../../util/types';
import {
  isErrorNoViewingPermission,
  isErrorUserPendingApproval,
  isForbiddenError,
} from '../../util/errors';
import { hasPermissionToViewData, isUserAuthorized } from '../../util/userHelpers';
import { getListingsById } from '../../ducks/marketplaceData.duck';
import { manageDisableScrolling, isScrollingDisabled } from '../../ducks/ui.duck';

import { H3, H5, NamedLink, NamedRedirect, Page } from '../../components';
import TopbarContainer from '../TopbarContainer/TopbarContainer';
import FooterContainer from '../FooterContainer/FooterContainer';

import {
  groupListingFieldConfigs,
  initialValues,
  searchParamsPicker,
  validUrlQueryParamsFromProps,
  validFilterParams,
  cleanSearchFromConflictingParams,
  omitLimitedListingFieldParams,
  getDatesAndSeatsMaybe,
} from './FavouritePage';

import css from './FavouritePage.module.css';
import locatn from '../../assets/location.svg';
import SearchCard from '../../components/CustomComponent/SearchCard';
import { FormControl, FormControlLabel, RadioGroup } from '@mui/material';
import RadioSelect from '../../components/CustomComponent/RadioSelect';
import PriceSelect from '../../components/CustomComponent/PriceSelect';
import LocationSelect from '../../components/CustomComponent/LocationSelect';
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min';
import { updateProfile } from '../ProfileSettingsPage/ProfileSettingsPage.duck';
import CustomSelect from '../../components/CustomComponent/CustomSelect';

const MODAL_BREAKPOINT = 768; // Search is in modal on mobile layout

// SortBy component has its content in dropdown-popup.
// With this offset we move the dropdown a few pixels on desktop layout.
const FILTER_DROPDOWN_OFFSET = -14;

export class FavouritePageComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isMobileModalOpen: false,
      showMenu:false,
      showTopBoxMenu:false,
      showExpandedSearchBar:false,
      parentClicked:false,
      showPopups:false,
      showTopBoxMenu:false,
      showList1:false,
      showList2:false,
      selectedPrice:"",
      selectedLocation:"",
      selectedOption:"",
      showBestRatedFilterList:false,
      showLocationFilterList:false,
      showPriceFilterList:false,
    };

    this.onOpenMobileModal = this.onOpenMobileModal.bind(this);
    this.onCloseMobileModal = this.onCloseMobileModal.bind(this);
    this.seShowPopups = this.seShowPopups.bind(this);
    this.setShowTopBoxMenu = this.setShowTopBoxMenu.bind(this);
    this.handleChangePopups = this.handleChangePopups.bind(this);
    this.handleChangeShowMenu = this.handleChangeShowMenu.bind(this);
    this.setShowList1 = this.setShowList1.bind(this);
    this.setShowList2 = this.setShowList2.bind(this);
    this.setSelectedOption = this.setSelectedOption.bind(this);
    this.setSelectedLocation = this.setSelectedLocation.bind(this);
    this.setSelectedPrice = this.setSelectedPrice.bind(this);
    this.setShowBestRatedFilterList = this.setShowBestRatedFilterList.bind(this);
    this.setShowLocationFilterList = this.setShowLocationFilterList.bind(this);
    this.setShowPriceFilterList = this.setShowPriceFilterList.bind(this);
    this.setParentClicked = this.setParentClicked.bind(this);
    this.setShowMenu = this.setShowMenu.bind(this);

  }

  // Invoked when a modal is opened from a child component,
  // for example when a filter modal is opened in mobile view
  onOpenMobileModal() {
    this.setState({ isMobileModalOpen: true });
  }

  // Invoked when a modal is closed from a child component,
  // for example when a filter modal is opened in mobile view
  onCloseMobileModal() {
    this.setState({ isMobileModalOpen: false });
  }

  seShowPopups(val){
    this.setState(
      {showPopups:val}
    )
  }

  setShowTopBoxMenu(val){
    this.setState(
      {showTopBoxMenu:val}
    )
  }

  handleChangePopups(val){
    this.setState(
      {showPopups:val}
    )
  }

  handleChangeShowMenu (){
    this.setState(
      {showMenu:false}
    )
  }

  setShowList1(val){
    this.setState({
      showList1:val
    })
  }

  setShowList2(val){
    this.setState({
      showList2:val
    })
  }

  setSelectedOption(val){
    this.setState({
      selectedOption:val
    })
  }

  setSelectedLocation(val){
    this.setState({
      selectedLocation:val
    })
  }

  setSelectedPrice(val){
    this.setState({
      selectedPrice:val
    })
  }

   setShowBestRatedFilterList(){
    this.setState({
      showBestRatedFilterList:true,
      showLocationFilterList:false,
      showPriceFilterList:false
    })
  }

   setShowLocationFilterList(){
    this.setState({
      showBestRatedFilterList:false,
      showLocationFilterList:true,
      showPriceFilterList:false
    })
  }

  setShowPriceFilterList(){
    this.setState({
      showBestRatedFilterList:false,
      showLocationFilterList:false,
      showPriceFilterList:true
    })
  }

  setParentClicked(){
    console.log("Calling --------")
      this.setState(
        {
          showBestRatedFilterList:false,
          showLocationFilterList:false,
          showPriceFilterList:false
        }
      )
    }


  render() {
    const {
      intl,
      listings = [],
      location,
      onManageDisableScrolling,
      pagination,
      scrollingDisabled,
      searchInProgress,
      searchListingsError,
      searchParams = {},
      routeConfiguration,
      config,
      history,
      onUpdateProfile,
      favourites,
      // parentClicked,
      // setParentClicked
    } = this.props;

    
    // N.B. openMobileMap button is sticky.
    // For some reason, stickyness doesn't work on Safari, if the element is <button>

    const topbarClasses = this.state.isMobileModalOpen
          ? classNames(css.topbarBehindModal, css.topbar)
          : css.topbar;

    const setShowMenu = e =>{
      this.setState(
        {showMenu:true}
      )
    }

    const setShowExpandedSearchBar = e =>{
        this.setState(
          {
            showExpandedSearchBar:!this.state.showExpandedSearchBar
          }
        )
    }

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

    return (
      <div onClick={this.setParentClicked}>
          <Page
          
          scrollingDisabled={scrollingDisabled}
          description={"Favourites"}
          title={"Favourites"}
        >
          <TopbarContainer
            rootClassName={classNames(topbarClasses,css.topMargin)}
            currentSearchParams={[]}
            isSearchPage={true}
            setShowMenu={this.setShowMenu}
            showMenu={this.state.showMenu}
            showExpandedSearchBar={this.state.showExpandedSearchBar}
            setShowExpandedSearchBar={setShowExpandedSearchBar}
            handleChangeShowMenu={this.handleChangeShowMenu}
            parentClicked={this.state.parentClicked}
            setParentClicked={this.setParentClicked}
            setShowTopBoxMenu={this.setShowTopBoxMenu}
            showTopBoxMenu={this.state.showTopBoxMenu}
            showPopups={this.state.showPopups}
            seShowPopups={this.seShowPopups}
            handleChangePopups={this.handleChangePopups}
            showList1={this.state.showList1}
            showList2={this.state.showList2}
            setShowList1={this.setShowList1}
            setShowList2={this.setShowList2}
          />
          
          <div className={css.layoutWrapperContainer}>

          <div className={css.container_m}>
            <div className={css.header_con}>
              <div className={css.drd_con}>
                <CustomSelect
                  parentClicked={this.state.parentClicked}
                  setParentClicked={this.setParentClicked}
                  show={ this.state.showBestRatedFilterList}
                  setShow={this.setShowBestRatedFilterList}
                  sortOptions={["Recently added","Old"]}
                />
              </div>
              <div className={css.search_header}>
                <span>Favourites</span>
              </div>
              <SearchCard 
                listings={listings}
                handleAddFavourite={handleAddFavourite}
                handleRemoveFavourite={handleRemoveFavourite}
                favourites={favourites}
              />
            </div>
          </div>
          </div>
          <FooterContainer />
        </Page>
      </div>
      
    );
  }
}

/**
 * SearchPage component with grid layout (no map)
 *
 * @param {Object} props
 * @param {propTypes.currentUser} [props.currentUser] - The current user
 * @param {Array<propTypes.listing>} [props.listings] - The listings
 * @param {propTypes.pagination} [props.pagination] - The pagination
 * @param {boolean} [props.scrollingDisabled] - Whether the scrolling is disabled
 * @param {boolean} [props.searchInProgress] - Whether the search is in progress
 * @param {propTypes.error} [props.searchListingsError] - The search listings error
 * @param {Object} [props.searchParams] - The search params from the Redux state
 * @param {Function} [props.onManageDisableScrolling] - The function to manage the disable scrolling
 * @returns {JSX.Element}
 */
const EnhancedFavouritePage = props => {
  const config = useConfiguration();
  const routeConfiguration = useRouteConfiguration();
  const intl = useIntl();
  const history = useHistory();
  const location = useLocation();

  const searchListingsError = props.searchListingsError;
  if (isForbiddenError(searchListingsError)) {
    // This can happen if private marketplace mode is active
    return (
      <NamedRedirect
        name="SignupPage"
        state={{ from: `${location.pathname}${location.search}${location.hash}` }}
      />
    );
  }

  const { currentUser, ...restOfProps } = props;
  const favourites = currentUser?.attributes?.profile?.protectedData?.favourites || [];
  const isPrivateMarketplace = config.accessControl.marketplace.private === true;
  const isUnauthorizedUser = currentUser && !isUserAuthorized(currentUser);
  const hasNoViewingRightsUser = currentUser && !hasPermissionToViewData(currentUser);
  const hasUserPendingApprovalError = isErrorUserPendingApproval(searchListingsError);
  const hasNoViewingRightsError = isErrorNoViewingPermission(searchListingsError);
  const [parentClicked,setParentClicked] = useState(false);

  if ((isPrivateMarketplace && isUnauthorizedUser) || hasUserPendingApprovalError) {
    return (
      <NamedRedirect
        name="NoAccessPage"
        params={{ missingAccessRight: NO_ACCESS_PAGE_USER_PENDING_APPROVAL }}
      />
    );
  } else if (hasNoViewingRightsUser || hasNoViewingRightsError) {
    return (
      <NamedRedirect
        name="NoAccessPage"
        params={{ missingAccessRight: NO_ACCESS_PAGE_VIEW_LISTINGS }}
      />
    );
  }

  const handleClick = e =>{
    e.preventDefault();
    e.stopPropagation();
    setParentClicked(!parentClicked);
  }

  return (
        <div onClick={handleClick}>
          <FavouritePageComponent
            config={config}
            routeConfiguration={routeConfiguration}
            intl={intl}
            history={history}
            location={location}
            parentClicked={parentClicked}
            setParentClicked={setParentClicked}
            favourites={favourites}
            {...restOfProps}
          />
        </div>
  );
};

const mapStateToProps = state => {
  const { currentUser } = state.user;
  const {
    currentPageResultIds,
    pagination,
    searchInProgress,
    searchListingsError,
    searchParams,
  } = state.SearchPage;
  const listings = getListingsById(state, currentPageResultIds);

  return {
    currentUser,
    listings,
    pagination,
    scrollingDisabled: isScrollingDisabled(state),
    searchInProgress,
    searchListingsError,
    searchParams,
  };
};

const mapDispatchToProps = dispatch => ({
  onManageDisableScrolling: (componentId, disableScrolling) =>
    dispatch(manageDisableScrolling(componentId, disableScrolling)),
  onUpdateProfile:(data) =>dispatch(updateProfile(data))
});

// Note: it is important that the withRouter HOC is **outside** the
// connect HOC, otherwise React Router won't rerender any Route
// components since connect implements a shouldComponentUpdate
// lifecycle hook.
//
// See: https://github.com/ReactTraining/react-router/issues/4671
const FavouritePage = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(EnhancedFavouritePage);

export default FavouritePage;
