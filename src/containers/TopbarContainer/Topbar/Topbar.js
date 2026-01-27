import React, { useEffect, useState } from 'react';
import pickBy from 'lodash/pickBy';
import classNames from 'classnames';

import appSettings from '../../../config/settings';
import { useConfiguration } from '../../../context/configurationContext';
import { useRouteConfiguration } from '../../../context/routeConfigurationContext';

import { FormattedMessage, useIntl } from '../../../util/reactIntl';
import { isMainSearchTypeKeywords, isOriginInUse } from '../../../util/search';
import { parse, stringify } from '../../../util/urlHelpers';
import { createResourceLocatorString, matchPathname, pathByRouteName } from '../../../util/routes';
import {
  Button,
  LimitedAccessBanner,
  LinkedLogo,
  Modal,
  ModalMissingInformation,
  NamedLink,
} from '../../../components';

import MenuIcon from './MenuIcon';
import SearchIcon from './SearchIcon';
import TopbarSearchForm from './TopbarSearchForm/TopbarSearchForm';
import TopbarMobileMenu from './TopbarMobileMenu/TopbarMobileMenu';
import TopbarDesktop from './TopbarDesktop/TopbarDesktop';

import css from './Topbar.module.css';
import BoxMenu from '../../../components/CustomComponent/BoxMenu';
import BoxMenuTopbar from '../../../components/CustomComponent/BoxMenuTopbar';
import SearchBar from '../../../components/CustomComponent/SearchBar';

const MAX_MOBILE_SCREEN_WIDTH = 1024;

const SEARCH_DISPLAY_ALWAYS = 'always';
const SEARCH_DISPLAY_NOT_LANDING_PAGE = 'notLandingPage';
const SEARCH_DISPLAY_ONLY_SEARCH_PAGE = 'onlySearchPage';
import logo from '../../../assets/logo.png';
import translation from '../../../assets/icons/translation.png';
import SearchPageBoxMenu from '../../../components/CustomComponent/SearchPageBoxMenu';

const redirectToURLWithModalState = (history, location, modalStateParam) => {
  const { pathname, search, state } = location;
  const searchString = `?${stringify({ [modalStateParam]: 'open', ...parse(search) })}`;
  history.push(`${pathname}${searchString}`, state);
};

const redirectToURLWithoutModalState = (history, location, modalStateParam) => {
  const { pathname, search, state } = location;
  const queryParams = pickBy(parse(search), (v, k) => {
    return k !== modalStateParam;
  });
  const stringified = stringify(queryParams);
  const searchString = stringified ? `?${stringified}` : '';
  history.push(`${pathname}${searchString}`, state);
};

const isPrimary = o => o.group === 'primary';
const isSecondary = o => o.group === 'secondary';
const compareGroups = (a, b) => {
  const isAHigherGroupThanB = isPrimary(a) && isSecondary(b);
  const isALesserGroupThanB = isSecondary(a) && isPrimary(b);
  // Note: sort order is stable in JS
  return isAHigherGroupThanB ? -1 : isALesserGroupThanB ? 1 : 0;
};
// Returns links in order where primary links are returned first
const sortCustomLinks = customLinks => {
  const links = Array.isArray(customLinks) ? customLinks : [];
  return links.sort(compareGroups);
};

// Resolves in-app links against route configuration
const getResolvedCustomLinks = (customLinks, routeConfiguration) => {
  const links = Array.isArray(customLinks) ? customLinks : [];
  return links.map(linkConfig => {
    const { type, href } = linkConfig;
    const isInternalLink = type === 'internal' || href.charAt(0) === '/';
    if (isInternalLink) {
      // Internal link
      try {
        const testURL = new URL('http://my.marketplace.com' + href);
        const matchedRoutes = matchPathname(testURL.pathname, routeConfiguration);
        if (matchedRoutes.length > 0) {
          const found = matchedRoutes[0];
          const to = { search: testURL.search, hash: testURL.hash };
          return {
            ...linkConfig,
            route: {
              name: found.route?.name,
              params: found.params,
              to,
            },
          };
        }
      } catch (e) {
        return linkConfig;
      }
    }
    return linkConfig;
  });
};

const isCMSPage = found =>
  found.route?.name === 'CMSPage' ? `CMSPage:${found.params?.pageId}` : null;
const isInboxPage = found =>
  found.route?.name === 'InboxPage' ? `InboxPage:${found.params?.tab}` : null;
// Find the name of the current route/pathname.
// It's used as handle for currentPage check.
const getResolvedCurrentPage = (location, routeConfiguration) => {
  const matchedRoutes = matchPathname(location.pathname, routeConfiguration);
  if (matchedRoutes.length > 0) {
    const found = matchedRoutes[0];
    const cmsPageName = isCMSPage(found);
    const inboxPageName = isInboxPage(found);
    return cmsPageName ? cmsPageName : inboxPageName ? inboxPageName : `${found.route?.name}`;
  }
};

const GenericError = props => {
  const { show } = props;
  const classes = classNames(css.genericError, {
    [css.genericErrorVisible]: show,
  });
  return (
    <div className={classes}>
      <div className={css.genericErrorContent}>
        <p className={css.genericErrorText}>
          <FormattedMessage id="Topbar.genericError" />
        </p>
      </div>
    </div>
  );
};

const TopbarComponent = props => {
  const {
    className,
    rootClassName,
    desktopClassName,
    mobileRootClassName,
    mobileClassName,
    isAuthenticated,
    isLoggedInAs,
    authScopes = [],
    authInProgress,
    currentUser,
    currentUserHasListings,
    currentUserHasOrders,
    currentPage,
    notificationCount = 0,
    intl,
    history,
    location,
    onManageDisableScrolling,
    onResendVerificationEmail,
    sendVerificationEmailInProgress,
    sendVerificationEmailError,
    showGenericError,
    config,
    routeConfiguration,
    showTopBoxMenu,
    setShowTopBoxMenu,
    handleShowPopUps,
    showPopups,
    seShowPopups,
    showExpandedSearchBar,
    setShowExpandedSearchBar,
    isSearchPage,
    handleShowMenu,
    pageRef,
    showMenu,
    setShowMenu,
    handleChangeShowMenu,
    parentClicked,
    setParentClicked,
    showList1,
    showList2,
    setShowList1,
    setShowList2,
    transactions,
    onLogout,
    
  } = props;

//console.log(transactions,"   zzx2222222xcc");
  //const [showExpandedSearchBar, setShowExpandedSearchBar] = useState(false);
  //const [showList1, setShowList1] = useState(false);
  //const [showList2, setShowList2] = useState(false);

  const profileUser = currentUser;
  const { bio, displayName, publicData, metadata } = profileUser?.attributes?.profile || {};
  const { businessName="",fullName="",language="",userType} = publicData || "";

  const handleSubmit = values => {
    const { currentSearchParams, history, config, routeConfiguration } = props;

    const topbarSearchParams = () => {
      if (isMainSearchTypeKeywords(config)) {
        return { keywords: values?.keywords };
      }
      // topbar search defaults to 'location' search
      const { search, selectedPlace } = values?.location;
      const { origin, bounds } = selectedPlace;
      const originMaybe = isOriginInUse(config) ? { origin } : {};

      return {
        ...originMaybe,
        address: search,
        bounds,
      };
    };
    const searchParams = {
      ...currentSearchParams,
      ...topbarSearchParams(),
    };
    history.push(createResourceLocatorString('SearchPage', routeConfiguration, {}, searchParams));
  };

  const handleLogout = () => {
    const { onLogout, history, routeConfiguration } = props;
    onLogout().then(() => {
      const path = pathByRouteName('LandingPage', routeConfiguration);

      // In production we ensure that data is really lost,
      // but in development mode we use stored values for debugging
      if (appSettings.dev) {
        history.push(path);
      } else if (typeof window !== 'undefined') {
        window.location = path;
      }

      console.log('logged out'); // eslint-disable-line
    });
  };

  const { mobilemenu, mobilesearch, keywords, address, origin, bounds } = parse(location.search, {
    latlng: ['origin'],
    latlngBounds: ['bounds'],
  });

  // Custom links are sorted so that group="primary" are always at the beginning of the list.
  const sortedCustomLinks = sortCustomLinks(config.topbar?.customLinks);
  const customLinks = getResolvedCustomLinks(sortedCustomLinks, routeConfiguration);
  const resolvedCurrentPage = currentPage || getResolvedCurrentPage(location, routeConfiguration);

  const notificationDot = notificationCount > 0 ? <div className={css.notificationDot} /> : null;

  const hasMatchMedia = typeof window !== 'undefined' && window?.matchMedia;
  const isMobileLayout = hasMatchMedia
    ? window.matchMedia(`(max-width: ${MAX_MOBILE_SCREEN_WIDTH}px)`)?.matches
    : true;
  const isMobileMenuOpen = isMobileLayout && mobilemenu === 'open';
  const isMobileSearchOpen = isMobileLayout && mobilesearch === 'open';
  const [selectedService,setSelectedService] = useState("");
  const [selectedLocation,setSelectedLocation] = useState("");
  
  const mobileMenu = (
    <TopbarMobileMenu
      isAuthenticated={isAuthenticated}
      currentUserHasListings={currentUserHasListings}
      currentUser={currentUser}
      onLogout={handleLogout}
      notificationCount={notificationCount}
      currentPage={resolvedCurrentPage}
      customLinks={customLinks}
      transactions={transactions}
    />
  );

  const topbarSearcInitialValues = () => {
    if (isMainSearchTypeKeywords(config)) {
      return { keywords };
    }

    // Only render current search if full place object is available in the URL params
    const locationFieldsPresent = isOriginInUse(config)
      ? address && origin && bounds
      : address && bounds;
    return {
      location: locationFieldsPresent
        ? {
            search: address,
            selectedPlace: { address, origin, bounds },
          }
        : null,
    };
  };
  const initialSearchFormValues = topbarSearcInitialValues();

  const classes = classNames(rootClassName || css.root, className);

  const { display: searchFormDisplay = SEARCH_DISPLAY_ALWAYS } = config?.topbar?.searchBar || {};

  // Search form is shown conditionally depending on configuration and
  // the current page.
  const showSearchOnAllPages = searchFormDisplay === SEARCH_DISPLAY_ALWAYS;
  const showSearchOnSearchPage =
    searchFormDisplay === SEARCH_DISPLAY_ONLY_SEARCH_PAGE && resolvedCurrentPage === 'SearchPage';
  const showSearchNotOnLandingPage =
    searchFormDisplay === SEARCH_DISPLAY_NOT_LANDING_PAGE && resolvedCurrentPage !== 'LandingPage';

  const showSearchForm =
    showSearchOnAllPages || showSearchOnSearchPage || showSearchNotOnLandingPage;

  const mobileSearchButtonMaybe = showSearchForm ? (
    <Button
      rootClassName={css.searchMenu}
      onClick={() => redirectToURLWithModalState(history, location, 'mobilesearch')}
      title={intl.formatMessage({ id: 'Topbar.searchIcon' })}
    >
      <SearchIcon className={css.searchMenuIcon} />
    </Button>
  ) : (
    <div className={css.searchMenu} />
  );


const handleClick = e =>{
  e.preventDefault();
  e.stopPropagation();
  seShowPopups(true);
  console.log(showPopups);
}

// useEffect(()=>{

// },[parentClicked])

const handleSearchClick = e =>{
    e.preventDefault();
    e.stopPropagation();
    setShowExpandedSearchBar(true);
  }



  return (
    <>
    <div className={classNames(classes)} onClick={handleClick}>
      <LimitedAccessBanner
        isAuthenticated={isAuthenticated}
        isLoggedInAs={isLoggedInAs}
        authScopes={authScopes}
        currentUser={currentUser}
        onLogout={handleLogout}
        currentPage={resolvedCurrentPage}
      />
      <div className={css.mobile}>
        <div className={css.flex_row}>
          <div>
            <NamedLink name="LandingPage">
              <img className={css.resize} src={logo} />
            </NamedLink>
          </div>
          
          <div className={css.flex_row}>
             <div className={css.trans_text}>
              <span>EN</span>
              <img className={css.trans_icon} src={translation} />
            </div>
            <button className={css.search_btn} onClick={handleSearchClick}>
              <svg className={css.search_svg} width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.91 2.06245C5.76787 2.06245 2.41 5.42031 2.41 9.56245C2.41 13.7046 5.76787 17.0624 9.91 17.0624C11.6808 17.0624 13.3084 16.4487 14.5914 15.4224L17.6541 18.485C17.9795 18.8105 18.5072 18.8105 18.8326 18.485C19.158 18.1596 19.158 17.632 18.8326 17.3065L15.7699 14.2439C16.7963 12.9608 17.41 11.3333 17.41 9.56245C17.41 5.42031 14.0521 2.06245 9.91 2.06245ZM4.07667 9.56245C4.07667 6.34079 6.68834 3.72911 9.91 3.72911C13.1317 3.72911 15.7433 6.34079 15.7433 9.56245C15.7433 12.7841 13.1317 15.3958 9.91 15.3958C6.68834 15.3958 4.07667 12.7841 4.07667 9.56245Z" fill="black"></path></svg>
            </button>
            <button
              className={css.menu_btn}
              onClick={e=>setShowMenu(!showMenu)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 4H21" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M3 12H21" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M3 20H21" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>

            </button>
          </div>
        </div>
         {/* {showMenu && !isAuthenticated?
               <div className={css.signup_option}>
                  <div className={css.close_con} onClick={e=>setShowMenu(!showMenu)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M1.70711 0.292893C1.31658 -0.0976309 0.683418 -0.0976312 0.292893 0.292893C-0.0976311 0.683418 -0.0976311 1.31658 0.292893 1.70711L5.24264 6.65685L0.292893 11.6066C-0.0976311 11.9971 -0.0976311 12.6303 0.292893 13.0208C0.683418 13.4113 1.31658 13.4113 1.70711 13.0208L6.65685 8.07107L11.6066 13.0208C11.9971 13.4113 12.6303 13.4113 13.0208 13.0208C13.4113 12.6303 13.4113 11.9971 13.0208 11.6066L8.07107 6.65685L13.0208 1.70711C13.4113 1.31658 13.4113 0.683418 13.0208 0.292893C12.6303 -0.0976309 11.9971 -0.0976306 11.6066 0.292893L6.65685 5.24264L1.70711 0.292893Z" fill="black"/>
                    </svg>
                  </div>
                  <NamedLink name="SignupForUserTypePage" params={{userType:"customer"}} className={classNames(css.topbarLink_new)}>
                    <span className={css.fill_btn}>
                      I want to hire a service
                    </span>
                  </NamedLink>
                  <NamedLink name="SignupForUserTypePage" params={{userType:"provider"}} className={classNames(css.topbarLink_new)}>
                    <span className={css.outline_btn}>
                      I want to provide a service
                    </span>
                  </NamedLink>
              </div>
              
              :
              ""
              } */}

                    {showMenu?
                    <>
                      {isAuthenticated?
                      
                       <div className={css.menus_con}>
                         {userType === "customer"?
                          <NamedLink name="ProfileSettingsPage" > 
                              <div className={css.flex_row_menu}>
                                Profile settings
                              </div>
                            </NamedLink>
                         :
                         <>
                              <NamedLink name="StripePayoutPage" > 
                                <div className={css.flex_row_menu}>
                                My Profile
                                </div>
                              </NamedLink>
                              <NamedLink name="SearchPage" > 
                                <div className={css.flex_row_menu}>
                                Hire A Service
                                </div>
                              </NamedLink>
                         </>
                            
                         }
                          
                          {userType === "customer"?
                          <>
                              <NamedLink name="InboxOrderViewPage" params={{tab:"orders"}}> 
                                <div className={css.flex_row_menu}>
                                  My bookings
                                </div>
                              </NamedLink>
                              <NamedLink name="StripePayoutPage" > 
                                <div className={css.flex_row_menu}>
                                  Favorite
                                </div>
                              </NamedLink>
                              <NamedLink name="StripePayoutPage" > 
                                <div className={css.flex_row_menu}>
                                  Become a service provider
                                </div>
                              </NamedLink>
                          </>
                            
                            
                          :
                            ""
                          }

                          <div className={css.flex_row_menu_last} onClick={handleLogout}>
                            Logout
                          </div>
                      </div>
                      
                      
                      :
                      
                       <div className={css.signup_option}>
                          <div className={css.close_con} onClick={e=>setShowMenu(!showMenu)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path d="M1.70711 0.292893C1.31658 -0.0976309 0.683418 -0.0976312 0.292893 0.292893C-0.0976311 0.683418 -0.0976311 1.31658 0.292893 1.70711L5.24264 6.65685L0.292893 11.6066C-0.0976311 11.9971 -0.0976311 12.6303 0.292893 13.0208C0.683418 13.4113 1.31658 13.4113 1.70711 13.0208L6.65685 8.07107L11.6066 13.0208C11.9971 13.4113 12.6303 13.4113 13.0208 13.0208C13.4113 12.6303 13.4113 11.9971 13.0208 11.6066L8.07107 6.65685L13.0208 1.70711C13.4113 1.31658 13.4113 0.683418 13.0208 0.292893C12.6303 -0.0976309 11.9971 -0.0976306 11.6066 0.292893L6.65685 5.24264L1.70711 0.292893Z" fill="black"/>
                            </svg>
                          </div>
                          <NamedLink name="LoginPage" className={classNames(css.topbarLink_new)}>
                            <span className={css.fill_btn}>
                              Login
                            </span>
                          </NamedLink>
                          <NamedLink name="SignupForUserTypePage" params={{userType:"customer"}} className={classNames(css.topbarLink_new)}>
                            <span className={css.fill_btn}>
                              I want to hire a service
                            </span>
                          </NamedLink>
                          <NamedLink name="SignupForUserTypePage" params={{userType:"provider"}} className={classNames(css.topbarLink_new)}>
                            <span className={css.outline_btn}>
                              I want to provide a service
                            </span>
                          </NamedLink>
                      </div>
                      
                      }
                    
                    </>
                     

                    :
                     ""
                    }














        
      </div>
      <div className={css.desktop} onClick={e=>{e.preventDefault(); e.stopPropagation();}}>
        <TopbarDesktop
          className={classNames(desktopClassName,(isSearchPage?css.add_border_bottom:null))}
          currentUserHasListings={currentUserHasListings}
          currentUser={currentUser}
          currentPage={resolvedCurrentPage}
          initialSearchFormValues={initialSearchFormValues}
          intl={intl}
          isAuthenticated={isAuthenticated}
          notificationCount={notificationCount}
          onLogout={handleLogout}
          onSearchSubmit={handleSubmit}
          config={config}
          customLinks={customLinks}
          showSearchForm={showSearchForm}
          setShowExpandedSearchBar={setShowExpandedSearchBar}
          showExpandedSearchBar={showExpandedSearchBar}
          isSearchPage={isSearchPage}
          showPopups={showPopups}
          showMenu={showMenu}
          setShowMenu={setShowMenu}
          handleChangeShowMenu={handleChangeShowMenu}
          handleShowMenu={handleShowMenu}
          pageRef={pageRef}
          parentClicked={parentClicked}
          setParentClicked={setParentClicked}
          transactions={transactions}
        />
      </div>
      <Modal
        id="TopbarMobileMenu"
        containerClassName={css.modalContainer}
        isOpen={isMobileMenuOpen}
        onClose={() => redirectToURLWithoutModalState(history, location, 'mobilemenu')}
        usePortal
        onManageDisableScrolling={onManageDisableScrolling}
      >
        {authInProgress ? null : mobileMenu}
      </Modal>
      <Modal
        id="TopbarMobileSearch"
        containerClassName={css.modalContainerSearchForm}
        isOpen={isMobileSearchOpen}
        onClose={() => redirectToURLWithoutModalState(history, location, 'mobilesearch')}
        usePortal
        onManageDisableScrolling={onManageDisableScrolling}
      >
        <div className={css.searchContainer}>
          <TopbarSearchForm
            onSubmit={handleSubmit}
            initialValues={initialSearchFormValues}
            isMobile
            appConfig={config}
          />
          <p className={css.mobileHelp}>
            <FormattedMessage id="Topbar.mobileSearchHelp" />
          </p>
        </div>
      </Modal>
      {/* <ModalMissingInformation
        id="MissingInformationReminder"
        containerClassName={css.missingInformationModal}
        currentUser={currentUser}
        currentUserHasListings={currentUserHasListings}
        currentUserHasOrders={currentUserHasOrders}
        location={location}
        onManageDisableScrolling={onManageDisableScrolling}
        onResendVerificationEmail={onResendVerificationEmail}
        sendVerificationEmailInProgress={sendVerificationEmailInProgress}
        sendVerificationEmailError={sendVerificationEmailError}
      /> */}

      {showExpandedSearchBar?
        <SearchBar
          className={css.searchBar}
          showTopBoxMenu={showTopBoxMenu}
          setShowTopBoxMenu={setShowTopBoxMenu}
          showPopups={showPopups}
          seShowPopups={seShowPopups}
          onClick={handleClick}
          history={history}
          parentClicked={parentClicked}
          setParentClicked={setParentClicked}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          selectedService={selectedService}
          setSelectedService={setSelectedService}
          showList1={showList1}
          showList2={showList2}
          setShowList1={setShowList1}
          setShowList2={setShowList2}
          setShowExpandedSearchBar={setShowExpandedSearchBar}
          showExpandedSearchBar={showExpandedSearchBar}
        />
        :""
      }
      
      {showTopBoxMenu && !showExpandedSearchBar?
        <BoxMenuTopbar
          showTopBoxMenu={showTopBoxMenu}
          setShowTopBoxMenu={setShowTopBoxMenu}
          setShowExpandedSearchBar={setShowExpandedSearchBar}
          isSearchPage={isSearchPage}
          history={history}
        />:""}

      {isSearchPage && !showExpandedSearchBar?<SearchPageBoxMenu isSearchPage={isSearchPage} history={history} setShowExpandedSearchBar={setShowExpandedSearchBar}/>:""}
        
    </div>
   
    
    </>
  );
};

/**
 * Topbar containing logo, main search and navigation links.
 *
 * @component
 * @param {Object} props
 * @param {string?} props.className add more style rules in addition to components own css.root
 * @param {string?} props.rootClassName overwrite components own css.root
 * @param {Object} props.desktopClassName add more style rules for TopbarDesktop
 * @param {Object} props.mobileRootClassName overwrite mobile layout root classes
 * @param {Object} props.mobileClassName add more style rules for mobile layout
 * @param {boolean} props.isAuthenticated
 * @param {boolean} props.isLoggedInAs
 * @param {Object} props.currentUser
 * @param {boolean} props.currentUserHasListings
 * @param {boolean} props.currentUserHasOrders
 * @param {string} props.currentPage
 * @param {number} props.notificationCount
 * @param {Function} props.onLogout
 * @param {Function} props.onManageDisableScrolling
 * @param {Function} props.onResendVerificationEmail
 * @param {Object} props.sendVerificationEmailInProgress
 * @param {Object} props.sendVerificationEmailError
 * @param {boolean} props.showGenericError
 * @param {Object} props.history
 * @param {Function} props.history.push
 * @param {Object} props.location
 * @param {string} props.location.search '?foo=bar'
 * @returns {JSX.Element} topbar component
 */
const Topbar = props => {
  const config = useConfiguration();
  const routeConfiguration = useRouteConfiguration();
  const intl = useIntl();
  //const {showPopups} = props;
  console.log(props.parentClicked,"   zzxxcc");
  return (
    <TopbarComponent
      config={config}
      routeConfiguration={routeConfiguration}
      intl={intl}
      {...props}
    />
  );
};

export default Topbar;
