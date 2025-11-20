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
import search1 from '../../assets/Search/search1.png';
import search2 from '../../assets/Search/search2.png';
import search3 from '../../assets/Search/search3.png';
import search4 from '../../assets/Search/search4.png';
import search5 from '../../assets/Search/search5.png';
import search6 from '../../assets/Search/search6.png';
import search7 from '../../assets/Search/search7.png';
import search8 from '../../assets/Search/search8.png';
import search9 from '../../assets/Search/search9.png';
import search10 from '../../assets/Search/search10.png';
import search11 from '../../assets/Search/search11.png';
import search12 from '../../assets/Search/search12.png';




import {
  groupListingFieldConfigs,
  initialValues,
  searchParamsPicker,
  validUrlQueryParamsFromProps,
  validFilterParams,
  cleanSearchFromConflictingParams,
  createSearchResultSchema,
  pickListingFieldFilters,
  omitLimitedListingFieldParams,
  getDatesAndSeatsMaybe,
} from './SearchPage.shared';

import FilterComponent from './FilterComponent';
import MainPanelHeader from './MainPanelHeader/MainPanelHeader';
import SearchFiltersMobile from './SearchFiltersMobile/SearchFiltersMobile';
import SortBy from './SortBy/SortBy';
import SearchResultsPanel from './SearchResultsPanel/SearchResultsPanel';
import NoSearchResultsMaybe from './NoSearchResultsMaybe/NoSearchResultsMaybe';

import css from './SearchPage.module.css';
import BoxMenu from '../../components/CustomComponent/BoxMenu';
import home from '../../assets/home.svg';
import locatn from '../../assets/location.svg';
import SearchCard from '../../components/CustomComponent/SearchCard';
import { FormControl, FormControlLabel, RadioGroup } from '@mui/material';
import RadioSelect from '../../components/CustomComponent/RadioSelect';
import PriceSelect from '../../components/CustomComponent/PriceSelect';
import LocationSelect from '../../components/CustomComponent/LocationSelect';
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min';

const MODAL_BREAKPOINT = 768; // Search is in modal on mobile layout

// SortBy component has its content in dropdown-popup.
// With this offset we move the dropdown a few pixels on desktop layout.
const FILTER_DROPDOWN_OFFSET = -14;

export class SearchPageComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isMobileModalOpen: false,
      currentQueryParams: validUrlQueryParamsFromProps(props),
      showMenu:false,
      showTopBoxMenu:false,
      showExpandedSearchBar:false,
      //parentClicked:false,
      showPopups:false,
      showTopBoxMenu:false,
      showList1:false,
      showList2:false,
      selectedPrice:"",
      selectedLocation:"",
      selectedOption:""
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

    // Filter functions
    this.resetAll = this.resetAll.bind(this);
    this.getHandleChangedValueFn = this.getHandleChangedValueFn.bind(this);

    // SortBy
    this.handleSortBy = this.handleSortBy.bind(this);
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

  // Reset all filter query parameters
  resetAll(e) {
    const { history, routeConfiguration, config } = this.props;
    const { listingFields: listingFieldsConfig } = config?.listing || {};
    const { defaultFilters: defaultFiltersConfig } = config?.search || {};

    const urlQueryParams = validUrlQueryParamsFromProps(this.props);
    const filterQueryParamNames = getQueryParamNames(listingFieldsConfig, defaultFiltersConfig);

    // Reset state
    this.setState({ currentQueryParams: {} });

    // Reset routing params
    const queryParams = omit(urlQueryParams, filterQueryParamNames);
    history.push(createResourceLocatorString('SearchPage', routeConfiguration, {}, queryParams));
  }

  getHandleChangedValueFn(useHistoryPush) {
    const { history, routeConfiguration, config } = this.props;
    const { listingFields: listingFieldsConfig } = config?.listing || {};
    const { defaultFilters: defaultFiltersConfig, sortConfig } = config?.search || {};
    const listingCategories = config.categoryConfiguration.categories;
    const filterConfigs = {
      listingFieldsConfig,
      defaultFiltersConfig,
      listingCategories,
    };

    const urlQueryParams = validUrlQueryParamsFromProps(this.props);

    return updatedURLParams => {
      const updater = prevState => {
        const { address, bounds, keywords } = urlQueryParams;
        const mergedQueryParams = { ...urlQueryParams, ...prevState.currentQueryParams };

        // Address and bounds are handled outside of MainPanel.
        // I.e. TopbarSearchForm && search by moving the map.
        // We should always trust urlQueryParams with those.
        // The same applies to keywords, if the main search type is keyword search.
        const keywordsMaybe = isMainSearchTypeKeywords(config) ? { keywords } : {};
        const datesAndSeatsMaybe = getDatesAndSeatsMaybe(mergedQueryParams, updatedURLParams);
        return {
          currentQueryParams: omitLimitedListingFieldParams(
            {
              ...mergedQueryParams,
              ...updatedURLParams,
              ...keywordsMaybe,
              ...datesAndSeatsMaybe,
              address,
              bounds,
            },
            filterConfigs
          ),
        };
      };

      const callback = () => {
        if (useHistoryPush) {
          const searchParams = this.state.currentQueryParams;
          const search = cleanSearchFromConflictingParams(searchParams, filterConfigs, sortConfig);
          history.push(createResourceLocatorString('SearchPage', routeConfiguration, {}, search));
        }
      };

      this.setState(updater, callback);
    };
  }

  handleSortBy(urlParam, values) {
    const { history, routeConfiguration } = this.props;
    const urlQueryParams = validUrlQueryParamsFromProps(this.props);

    const queryParams = values
      ? { ...urlQueryParams, [urlParam]: values }
      : omit(urlQueryParams, urlParam);

    history.push(createResourceLocatorString('SearchPage', routeConfiguration, {}, queryParams));
  }

  // Reset all filter query parameters
  handleResetAll(e) {
    this.resetAll(e);

    // blur event target if event is passed
    if (e && e.currentTarget) {
      e.currentTarget.blur();
    }
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
      parentClicked,
      setParentClicked
    } = this.props;

    const { listingFields } = config?.listing || {};
    const { defaultFilters: defaultFiltersConfig, sortConfig } = config?.search || {};
    const activeListingTypes = config?.listing?.listingTypes.map(config => config.listingType);
    const marketplaceCurrency = config.currency;
    const categoryConfiguration = config.categoryConfiguration;
    const listingCategories = categoryConfiguration.categories;
    const listingFieldsConfig = pickListingFieldFilters({
      listingFields,
      locationSearch: location.search,
      categoryConfiguration,
    });
    const filterConfigs = {
      listingFieldsConfig,
      defaultFiltersConfig,
      listingCategories,
    };

    // Page transition might initially use values from previous search
    // urlQueryParams doesn't contain page specific url params
    // like mapSearch, page or origin (origin depends on config.maps.search.sortSearchByDistance)
    const { searchParamsAreInSync, urlQueryParams, searchParamsInURL } = searchParamsPicker(
      location.search,
      searchParams,
      filterConfigs,
      sortConfig,
      isOriginInUse(config)
    );
    const validQueryParams = urlQueryParams;

    const isKeywordSearch = isMainSearchTypeKeywords(config);
    const builtInPrimaryFilters = defaultFiltersConfig.filter(f =>
      ['categoryLevel'].includes(f.key)
    );
    const builtInFilters = isKeywordSearch
      ? defaultFiltersConfig.filter(f => !['keywords', 'categoryLevel'].includes(f.key))
      : defaultFiltersConfig.filter(f => !['categoryLevel'].includes(f.key));
    const [customPrimaryFilters, customSecondaryFilters] = groupListingFieldConfigs(
      listingFieldsConfig,
      activeListingTypes
    );
    const availableFilters = [
      ...builtInPrimaryFilters,
      ...customPrimaryFilters,
      ...builtInFilters,
      ...customSecondaryFilters,
    ];

    // Selected aka active filters
    const selectedFilters = validQueryParams;
    const isValidDatesFilter =
      searchParamsInURL.dates == null ||
      (searchParamsInURL.dates != null && searchParamsInURL.dates === selectedFilters.dates);
    const keysOfSelectedFilters = Object.keys(selectedFilters);
    const selectedFiltersCountForMobile = isKeywordSearch
      ? keysOfSelectedFilters.filter(f => f !== 'keywords').length
      : keysOfSelectedFilters.length;

    const hasPaginationInfo = !!pagination && pagination.totalItems != null;
    const totalItems =
      searchParamsAreInSync && hasPaginationInfo
        ? pagination.totalItems
        : pagination?.paginationUnsupported
        ? listings.length
        : 0;
    const listingsAreLoaded =
      !searchInProgress &&
      searchParamsAreInSync &&
      !!(hasPaginationInfo || pagination?.paginationUnsupported);

    const conflictingFilterActive = isAnyFilterActive(
      sortConfig.conflictingFilters,
      validQueryParams,
      filterConfigs
    );
    const sortBy = mode => {
      return sortConfig.active ? (
        <SortBy
          sort={validQueryParams[sortConfig.queryParamName]}
          isConflictingFilterActive={!!conflictingFilterActive}
          hasConflictingFilters={!!(sortConfig.conflictingFilters?.length > 0)}
          selectedFilters={selectedFilters}
          onSelect={this.handleSortBy}
          showAsPopup
          mode={mode}
          contentPlacementOffset={FILTER_DROPDOWN_OFFSET}
        />
      ) : null;
    };
    const noResultsInfo = (
      <NoSearchResultsMaybe
        listingsAreLoaded={listingsAreLoaded}
        totalItems={totalItems}
        location={location}
        resetAll={this.resetAll}
      />
    );

    const { title, description, schema } = createSearchResultSchema(
      listings,
      searchParamsInURL || {},
      intl,
      routeConfiguration,
      config
    );

    // Set topbar class based on if a modal is open in
    // a child component
    const topbarClasses = this.state.isMobileModalOpen
      ? classNames(css.topbarBehindModal, css.topbar)
      : css.topbar;

    // N.B. openMobileMap button is sticky.
    // For some reason, stickyness doesn't work on Safari, if the element is <button>
    
    console.log(listings);

    const cardData =[
      {
        title:"Delicious Delights Catering",
        content:"We’ll make your child’s birthday a feast to remember!",
        badge:"Catering ",
        location:"Seville",
        from:"$250",
        rate:"4.7 (10)",
        img:search1
      },
      {
        title:"Betty Delights Catering",
        content:"We’ll make your child’s birthday a feast to remember!",
        badge:"Catering ",
        location:"Seville",
        from:"$250",
        rate:"4.7 (10)",
        img:search2
      },
      {
        title:"Joyful Bites Catering",
        content:"We’ll make your child’s birthday a feast to remember!",
        badge:"Catering ",
        location:"Seville",
        from:"$250",
        rate:"4.7 (10)",
        img:search3
      },
      {
        title:"Captivating Catering Co.",
        content:"We’ll make your child’s birthday a feast to remember!",
        badge:"Catering ",
        location:"Seville",
        from:"$250",
        rate:"4.7 (10)",
        img:search4
      },
      {
        title:"Joyful Bites Catering",
        content:"We’ll make your child’s birthday a feast to remember!",
        badge:"Catering ",
        location:"Seville",
        from:"$250",
        rate:"4.7 (10)",
        img:search5
      },
      {
        title:"Delicious Delights Catering",
        content:"We’ll make your child’s birthday a feast to remember!",
        badge:"Catering ",
        location:"Seville",
        from:"$250",
        rate:"4.7 (10)",
        img:search6
      },{
        title:"Joyful Bites Catering",
        content:"We’ll make your child’s birthday a feast to remember!",
        badge:"Catering ",
        location:"Seville",
        from:"$250",
        rate:"4.7 (10)",
        img:search7
      },{
        title:"Betty Delights Catering",
        content:"We’ll make your child’s birthday a feast to remember!",
        badge:"Catering ",
        location:"Seville",
        from:"$250",
        rate:"4.7 (10)",
        img:search8
      },
      {
        title:"Betty Delights Catering",
        content:"We’ll make your child’s birthday a feast to remember!",
        badge:"Catering ",
        location:"Seville",
        from:"$250",
        rate:"4.7 (10)",
        img:search9
      },
      {
        title:"Betty Delights Catering",
        content:"We’ll make your child’s birthday a feast to remember!",
        badge:"Catering ",
        location:"Seville",
        from:"$250",
        rate:"4.7 (10)",
        img:search10
      },
      {
        title:"Betty Delights Catering",
        content:"We’ll make your child’s birthday a feast to remember!",
        badge:"Catering ",
        location:"Seville",
        from:"$250",
        rate:"4.7 (10)",
        img:search11
      },
      {
        title:"Betty Delights Catering",
        content:"We’ll make your child’s birthday a feast to remember!",
        badge:"Catering ",
        location:"Seville",
        from:"$250",
        rate:"4.7 (10)",
        img:search12
      },
    ];

    

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

    return (
      <div>
          <Page
          
          scrollingDisabled={scrollingDisabled}
          description={description}
          title={title}
          schema={schema}
        >
          <TopbarContainer
            rootClassName={classNames(topbarClasses,css.topMargin)}
            currentSearchParams={validQueryParams}
            isSearchPage={true}
            setShowMenu={setShowMenu}
            showMenu={this.state.showMenu}
            showExpandedSearchBar={this.state.showExpandedSearchBar}
            setShowExpandedSearchBar={setShowExpandedSearchBar}
            handleChangeShowMenu={this.handleChangeShowMenu}
            parentClicked={parentClicked}
            setParentClicked={setParentClicked}
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
              <div className={classNames(css.flex_row,css.full_w)}>
                <NamedLink name="LandingPage">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M11.9137 1.98752C10.766 1.18411 9.23837 1.18411 8.09063 1.98752L2.35932 5.99944C1.39381 6.6753 0.856954 7.81078 0.947345 8.98587L1.53486 16.6236C1.64567 18.064 2.95084 19.111 4.38105 18.9067L7.0224 18.5294C8.25402 18.3534 9.16884 17.2986 9.16884 16.0545V15C9.16884 14.5398 9.54194 14.1667 10.0022 14.1667C10.4624 14.1667 10.8355 14.5398 10.8355 15V16.0545C10.8355 17.2986 11.7503 18.3534 12.982 18.5294L15.6233 18.9067C17.0535 19.111 18.3587 18.064 18.4695 16.6236L19.057 8.98587C19.1474 7.81078 18.6105 6.67531 17.645 5.99944L11.9137 1.98752ZM9.0464 3.35291C9.62027 2.9512 10.3841 2.9512 10.9579 3.35291L16.6893 7.36483C17.172 7.70276 17.4404 8.2705 17.3952 8.85805L16.8077 16.4957C16.7708 16.9759 16.3357 17.3249 15.859 17.2568L13.2177 16.8795C12.8071 16.8208 12.5022 16.4692 12.5022 16.0545V15C12.5022 13.6193 11.3829 12.5 10.0022 12.5C8.62146 12.5 7.50218 13.6193 7.50218 15V16.0545C7.50218 16.4692 7.19723 16.8208 6.7867 16.8795L4.14535 17.2568C3.66861 17.3249 3.23355 16.9759 3.19662 16.4957L2.6091 8.85804C2.56391 8.2705 2.83233 7.70276 3.31509 7.36483L9.0464 3.35291Z" fill="#EB5017"/>
                  </svg>
                </NamedLink>
                <span className={css.catering}><span className={css.item_list}>Item List</span> /</span>
              </div>
              <div className={classNames(css.pg_header,css.full_w)}><span className={css.light_text}>Showing {listings.length} results for </span> services near you</div>
              <div className={classNames(css.icon_con,css.full_w)}>
                <img className={css.locatn} src={locatn}/>
                <span>Location pending...</span>
              </div>

              <div className={css.drd_con}>
                <RadioSelect
                  parentClicked={parentClicked}
                  setParentClicked={setParentClicked}
                />
                <LocationSelect
                  parentClicked={parentClicked}
                  setParentClicked={setParentClicked}
                />
                <PriceSelect history={history}
                  selectedPrice={this.state.selectedPrice}
                  setSelectedPrice={this.setSelectedPrice}
                  selectedLocation={this.state.selectedLocation}
                  selectedOption={this.state.selectedOption}
                  parentClicked={parentClicked}
                  setParentClicked={setParentClicked}
                />
              </div>
              <div className={css.showing}>Showing 200+ results</div>
              <SearchCard listings={listings}/>
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
const EnhancedSearchPage = props => {
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
          <SearchPageComponent
            config={config}
            routeConfiguration={routeConfiguration}
            intl={intl}
            history={history}
            location={location}
            parentClicked={parentClicked}
            setParentClicked={setParentClicked}
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
});

// Note: it is important that the withRouter HOC is **outside** the
// connect HOC, otherwise React Router won't rerender any Route
// components since connect implements a shouldComponentUpdate
// lifecycle hook.
//
// See: https://github.com/ReactTraining/react-router/issues/4671
const SearchPage = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(EnhancedSearchPage);

export default SearchPage;
