import React, { useState, useEffect } from 'react';
import classNames from 'classnames';

import { FormattedMessage } from '../../../../util/reactIntl';
import { ACCOUNT_SETTINGS_PAGES } from '../../../../routing/routeConfiguration';
import {
  Avatar,
  InlineTextButton,
  LinkedLogo,
  Menu,
  MenuLabel,
  MenuContent,
  MenuItem,
  NamedLink,
} from '../../../../components';

import TopbarSearchForm from '../TopbarSearchForm/TopbarSearchForm';
import CustomLinksMenu from './CustomLinksMenu/CustomLinksMenu';

import css from './TopbarDesktop.module.css';
import magnifyGlass from '../../../../assets/icons/magnify_glass.png';
import translation from '../../../../assets/icons/translation.png';
import logo from '../../../../assets/logo.png';
import bell from '../../../../assets/bell.svg';
import maill from '../../../../assets/mail.svg';
import profile from '../../../../assets/profileImage.svg';
import { useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom';
import placeholder from '../../../../assets/placeholder.jpg';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import MessagesNote from '../../../../components/CustomComponent/MessagesNote';

const SignupLink = (props) => {
  const{showMenu,handleShowMenu} = props;
  

  
  return (
    <div className={css.login_con}>
      <div onClick={handleShowMenu} className={classNames(css.topbarLink,css.register)}>
        <span className={css.topbarLinkLabel}>
          Register
        </span>
      </div>
      {showMenu?
       <div className={css.signup_option}>
          <NamedLink name="SignupForUserTypePage" params={{userType:"customer"}} className={classNames(css.topbarLink_new)}>
            <span className={css.topbarLinkLabel}>
              I want to hire a service
            </span>
          </NamedLink>
          <NamedLink name="SignupForUserTypePage" params={{userType:"provider"}} className={classNames(css.topbarLink_new)}>
            <span className={css.topbarLinkLabel}>
              I want to provide a service
            </span>
          </NamedLink>
      </div>
      
      :""}
     
    </div>
   
  );
};

const LoginLink = () => {
  return (
    <NamedLink name="LoginPage" className={classNames(css.topbarLink,css.login)}>
      
        Login
    
    </NamedLink>
  );
};

const InboxLink = ({ notificationCount, currentUserHasListings }) => {
  const notificationDot = notificationCount > 0 ? <div className={css.notificationDot} /> : null;
  return (
    <NamedLink
      className={css.topbarLink}
      name="InboxPage"
      params={{ tab: currentUserHasListings ? 'sales' : 'orders' }}
    >
      <span className={css.topbarLinkLabel}>
        <FormattedMessage id="TopbarDesktop.inbox" />
        {notificationDot}
      </span>
    </NamedLink>
  );
};

const ProfileMenu = ({ currentPage, currentUser, onLogout }) => {
  const currentPageClass = page => {
    const isAccountSettingsPage =
      page === 'AccountSettingsPage' && ACCOUNT_SETTINGS_PAGES.includes(currentPage);
    return currentPage === page || isAccountSettingsPage ? css.currentPage : null;
  };

  return (
    <Menu>
      <MenuLabel className={css.profileMenuLabel} isOpenClassName={css.profileMenuIsOpen}>
        <Avatar className={css.avatar} user={currentUser} disableProfileLink />
      </MenuLabel>
      <MenuContent className={css.profileMenuContent}>
        <MenuItem key="ProfileSettingsPage">
          <NamedLink
            className={classNames(css.menuLink, currentPageClass('ProfileSettingsPage'))}
            name="ProfileSettingsPage"
          >
            <span className={css.menuItemBorder} />
            <FormattedMessage id="TopbarDesktop.profileSettingsLink" />
          </NamedLink>
        </MenuItem>
        <MenuItem key="AccountSettingsPage">
          <NamedLink
            className={classNames(css.menuLink, currentPageClass('AccountSettingsPage'))}
            name="AccountSettingsPage"
          >
            <span className={css.menuItemBorder} />
            <FormattedMessage id="TopbarDesktop.accountSettingsLink" />
          </NamedLink>
        </MenuItem>
        <MenuItem key="logout">
          <InlineTextButton rootClassName={css.logoutButton} onClick={onLogout}>
            <span className={css.menuItemBorder} />
            <FormattedMessage id="TopbarDesktop.logout" />
          </InlineTextButton>
        </MenuItem>
      </MenuContent>
    </Menu>
  );
};

/**
 * Topbar for desktop layout
 *
 * @component
 * @param {Object} props
 * @param {string?} props.className add more style rules in addition to components own css.root
 * @param {string?} props.rootClassName overwrite components own css.root
 * @param {boolean} props.currentUserHasListings
 * @param {CurrentUser} props.currentUser API entity
 * @param {string?} props.currentPage
 * @param {boolean} props.isAuthenticated
 * @param {number} props.notificationCount
 * @param {Function} props.onLogout
 * @param {Function} props.onSearchSubmit
 * @param {Object?} props.initialSearchFormValues
 * @param {Object} props.intl
 * @param {Object} props.config
 * @param {boolean} props.showSearchForm
 * @returns {JSX.Element} search icon
 */
const TopbarDesktop = props => {
  const {
    className,
    config,
    customLinks,
    currentUser,
    currentPage,
    rootClassName,
    currentUserHasListings,
    notificationCount = 0,
    intl,
    isAuthenticated,
    onLogout,
    onSearchSubmit,
    initialSearchFormValues = {},
    showSearchForm,
    setShowExpandedSearchBar,
    showExpandedSearchBar,
    isSearchPage,
    showPopups,
    pageRef,
    // showMenu,
    // setShowMenu,
    handleChangeShowMenu,
    parentClicked,
    setParentClicked,
    transactions
  } = props;

  console.log(transactions)
  const [mounted, setMounted] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showNotificationMenus, setShowNotificationMenus] = useState(false);
  const [showInboxMenus, setShowInboxMenus] = useState(false);
  const profileImage = currentUser?.profileImage?.attributes?.variants['square-small']?.url;

  const profileUser = currentUser;
  const { bio, displayName, publicData, metadata } = profileUser?.attributes?.profile || {};
  const { businessName="",fullName="",language="",userType} = publicData || "";
  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if(parentClicked){
      setParentClicked(false);
      setShowMenu(false);
      setShowNotificationMenus(false);
      setShowInboxMenus(false);
    }
  }, [parentClicked]);


  useEffect(() => {
    console.log("Page changing 0000000");
  }, [pageRef]);

  

  const location = useLocation();
  const path = location.pathname;

  const showSearchBar = path.includes("signup") || path.includes("login") || path.includes("recover-password") || path.includes("reset-password")?false:true;

  const marketplaceName = config.marketplaceName;
  const authenticatedOnClientSide = mounted && isAuthenticated;
  const isAuthenticatedOrJustHydrated = isAuthenticated || !mounted;

  const giveSpaceForSearch = customLinks == null || customLinks?.length === 0;
  const classes = classNames(rootClassName || css.root, className);

  
  const handleShowMenu = (e)=>{
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(!showMenu);
    setShowNotificationMenus(false);
    setShowInboxMenus(false);
  }

  const handleLoadInbox = (e)=>{
    e.preventDefault();
    e.stopPropagation();
    setShowInboxMenus(!showInboxMenus);
    setShowMenu(false);
    setShowNotificationMenus(false);
    //redirect("/inbox/123");
  }

  const handleShowNotiMenu = e=>{
    e.preventDefault();
    e.stopPropagation();
    setShowNotificationMenus(!showNotificationMenus);
    setShowInboxMenus(false);
    setShowMenu(false);
  }

  
  const handleSignOut = ()=>{
    onLogout();
  }


  const inboxLinkMaybe = authenticatedOnClientSide ? (
    <InboxLink
      notificationCount={notificationCount}
      currentUserHasListings={currentUserHasListings}
    />
  ) : null;

 
  const notificatn = isAuthenticated?(
    <div onClick={handleShowNotiMenu}>
      <img src={bell}/>
    </div>
  ):null;

  const mail = isAuthenticated?(
    <NamedLink name="NewListingPage">
      <img src={maill}/>
    </NamedLink>
  ):null;

  const profileMenuMaybe = authenticatedOnClientSide ? (
    <ProfileMenu currentPage={currentPage} currentUser={currentUser} onLogout={onLogout} />
  ) : null;

  // const handleShowMenu = (e) =>{
  //   e.preventDefault();
  //   e.stopPropagation();
  //   console.log("Clickesddddddddddddddd");
  //   setShowMenu(true);
  // }

  const signupLinkMaybe = isAuthenticatedOrJustHydrated || isSearchPage? null : <SignupLink handleShowMenu={handleShowMenu} showMenu={showMenu}/>;
  const loginLinkMaybe = isAuthenticatedOrJustHydrated || isSearchPage ? null : <LoginLink />;

  const searchFormMaybe = showSearchForm ? (
    <TopbarSearchForm
      className={classNames(css.searchLink, { [css.takeAvailableSpace]: giveSpaceForSearch })}
      desktopInputRoot={css.topbarSearchWithLeftPadding}
      onSubmit={onSearchSubmit}
      initialValues={initialSearchFormValues}
      appConfig={config}
    />
  ) : (
    <div
      className={classNames(css.spacer, { [css.takeAvailableSpace]: giveSpaceForSearch })}
      desktopInputRoot={css.topbarSearchWithLeftPadding}
    />
  );

  const handleSearchClick = e =>{
    e.preventDefault();
    e.stopPropagation();
    setShowExpandedSearchBar(true);
  }

  


  return (
    <nav className={classNames(classes,css.default_pad,(isSearchPage?css.add_padding_bottom:null))} onClick={e=>{e.preventDefault(); e.stopPropagation();}}>
      <div className={css.flex_row}>
          {/* <LinkedLogo
            className={css.logoLink}
            layout="desktop"
            alt={intl.formatMessage({ id: 'TopbarDesktop.logo' }, { marketplaceName })}
            linkToExternalSite={config?.topbar?.logoLink}
          /> */}

          <div className={css.logo}>
            <NamedLink name="LandingPage">
              <img className={css.resize} src={logo} />
            </NamedLink>
            
          </div>

            {!showExpandedSearchBar && showSearchBar?
              <div className={css.search_con} onClick={handleSearchClick}>
                <div className={css.flex_row_s}>
                  <div className={css.search_item_a}>
                    Service
                  </div>
                  <div className={classNames(css.border_left,css.search_item_b)}>
                    Location
                  </div>
                </div>
                <div className={css.btn_border}>
                  <button className={css.search_btn}>
                    <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M9.91 2.06245C5.76787 2.06245 2.41 5.42031 2.41 9.56245C2.41 13.7046 5.76787 17.0624 9.91 17.0624C11.6808 17.0624 13.3084 16.4487 14.5914 15.4224L17.6541 18.485C17.9795 18.8105 18.5072 18.8105 18.8326 18.485C19.158 18.1596 19.158 17.632 18.8326 17.3065L15.7699 14.2439C16.7963 12.9608 17.41 11.3333 17.41 9.56245C17.41 5.42031 14.0521 2.06245 9.91 2.06245ZM4.07667 9.56245C4.07667 6.34079 6.68834 3.72911 9.91 3.72911C13.1317 3.72911 15.7433 6.34079 15.7433 9.56245C15.7433 12.7841 13.1317 15.3958 9.91 15.3958C6.68834 15.3958 4.07667 12.7841 4.07667 9.56245Z" fill="#CC400C"/>
                    </svg>
                    Search
                  </button>
                </div>
              </div>:""
            }
          
      </div>
      <div className={isSearchPage? css.other_menu_search:css.other_menu}>

        {userType === "customer"?
          <NamedLink className={css.my_booking_link} name="InboxOrderViewPage" params={{tab:"orders"}}>
            My Bookings
          </NamedLink>
        :
          <NamedLink className={css.my_booking_link} name="InboxOrderViewPage" params={{tab:"orders"}}>
            Bookings
          </NamedLink>
        }
        
        
        <div className={css.trans_text}>
          <span>EN</span>
          <img className={css.trans_icon} src={translation} />
        </div>

       
          {isAuthenticated?
            <div className={css.flex_col}>
              <div className={css.center} onClick={handleShowNotiMenu}>
                <svg width="17" height="21" viewBox="0 0 17 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M9.23668 1C9.23668 0.447715 8.78897 0 8.23668 0C7.68439 0 7.23668 0.447715 7.23668 1V1.57087C3.84456 2.05593 1.23668 4.97223 1.23668 8.4989L1.23668 12.4993C1.23668 12.4993 1.23669 12.4991 1.23668 12.4993C1.23658 12.5012 1.2359 12.5146 1.23157 12.5409C1.22636 12.5724 1.21712 12.6152 1.20186 12.6703C1.17094 12.782 1.12171 12.9211 1.05295 13.0855C0.915086 13.4151 0.720725 13.7947 0.505769 14.1776C0.101623 14.8975 -0.102092 15.7554 0.0508464 16.5712C0.21213 17.4316 0.765921 18.1819 1.71174 18.542C2.55665 18.8637 3.68131 19.1579 5.16654 19.333C5.20188 19.3637 5.24367 19.3987 5.29167 19.4371C5.44196 19.5574 5.65668 19.7132 5.92804 19.8682C6.46661 20.176 7.2629 20.5 8.23668 20.5C9.21046 20.5 10.0068 20.176 10.5453 19.8682C10.8167 19.7132 11.0314 19.5574 11.1817 19.4371C11.2297 19.3987 11.2715 19.3637 11.3068 19.333C12.792 19.1579 13.9167 18.8637 14.7616 18.542C15.7074 18.1819 16.2612 17.4316 16.4225 16.5712C16.5755 15.7554 16.3717 14.8975 15.9676 14.1776C15.7526 13.7947 15.5583 13.4151 15.4204 13.0855C15.3516 12.9211 15.3024 12.782 15.2715 12.6703C15.2562 12.6152 15.247 12.5724 15.2418 12.5409C15.2375 12.5146 15.2368 12.5015 15.2367 12.4996C15.2367 12.4994 15.2367 12.4996 15.2367 12.4996L15.2367 12.4911V8.49938C15.2367 4.9728 12.6289 2.05601 9.23668 1.57088V1ZM3.23668 8.4989C3.23668 5.73772 5.47502 3.5 8.23668 3.5C10.9982 3.5 13.2367 5.73809 13.2367 8.49938V12.5C13.2367 12.9629 13.4101 13.4623 13.5753 13.8571C13.7547 14.2861 13.9897 14.74 14.2236 15.1566C14.451 15.5616 14.5052 15.9444 14.4568 16.2027C14.4167 16.4166 14.3098 16.574 14.0499 16.6729C12.9751 17.0822 11.1606 17.5 8.23668 17.5C5.31275 17.5 3.49828 17.0822 2.42343 16.6729C2.16357 16.574 2.05669 16.4166 2.0166 16.2027C1.96817 15.9444 2.02239 15.5616 2.24977 15.1566C2.48361 14.74 2.71871 14.2861 2.8981 13.8571C3.06323 13.4623 3.23668 12.9629 3.23668 12.5V8.4989Z" fill="black"/>
                </svg>

              </div>

                {showNotificationMenus?
                <div className={css.noti_menu_con}>
                  <div className={css.menu_title_con}>
                      <span>Notifications</span>
                      <div className={css.count}>1</div>
                  </div>
                  <div className={css.rule}></div>
                  <div className={css.icon_con}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="27" viewBox="0 0 26 27" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M13.8313 3.25952C13.8313 2.65937 13.355 2.17285 12.7674 2.17285C12.1798 2.17285 11.7034 2.65937 11.7034 3.25952V3.87986C8.09435 4.40696 5.31968 7.57601 5.31968 11.4083L5.31968 15.7554C5.31968 15.7554 5.31969 15.7553 5.31968 15.7554C5.31958 15.7575 5.31886 15.7721 5.31424 15.8006C5.3087 15.8348 5.29887 15.8814 5.28264 15.9412C5.24973 16.0626 5.19736 16.2137 5.1242 16.3924C4.97752 16.7506 4.77073 17.163 4.54202 17.5791C4.11203 18.3615 3.89528 19.2937 4.058 20.1803C4.2296 21.1152 4.81881 21.9305 5.82513 22.3218C6.72407 22.6714 7.92067 22.9911 9.50089 23.1814C9.53849 23.2147 9.58295 23.2528 9.63403 23.2945C9.79393 23.4252 10.0224 23.5945 10.3111 23.763C10.8841 24.0974 11.7313 24.4495 12.7674 24.4495C13.8035 24.4495 14.6507 24.0974 15.2237 23.763C15.5124 23.5945 15.7409 23.4252 15.9008 23.2945C15.9518 23.2528 15.9963 23.2147 16.0339 23.1814C17.6141 22.9911 18.8107 22.6714 19.7097 22.3218C20.716 21.9305 21.3052 21.1152 21.4768 20.1803C21.6395 19.2937 21.4228 18.3615 20.9928 17.5791C20.7641 17.163 20.5573 16.7506 20.4106 16.3924C20.3374 16.2137 20.285 16.0626 20.2521 15.9412C20.2359 15.8814 20.2261 15.8348 20.2205 15.8006C20.2159 15.7721 20.2152 15.7578 20.2151 15.7557C20.2151 15.7555 20.2151 15.7557 20.2151 15.7557L20.2151 15.7465V11.4088C20.2151 7.57663 17.4405 4.40705 13.8313 3.87987V3.25952ZM7.4476 11.4083C7.4476 8.40784 9.8291 5.97619 12.7674 5.97619C15.7056 5.97619 18.0872 8.40825 18.0872 11.4088V15.7562C18.0872 16.2592 18.2717 16.8018 18.4474 17.2309C18.6383 17.6971 18.8884 18.1903 19.1372 18.643C19.3791 19.0832 19.4368 19.4991 19.3853 19.7798C19.3426 20.0122 19.2289 20.1832 18.9525 20.2908C17.8088 20.7355 15.8783 21.1895 12.7674 21.1895C9.65645 21.1895 7.72593 20.7355 6.58233 20.2908C6.30585 20.1832 6.19214 20.0122 6.14949 19.7798C6.09796 19.4991 6.15565 19.0832 6.39757 18.643C6.64637 18.1903 6.8965 17.6971 7.08736 17.2309C7.26305 16.8018 7.4476 16.2592 7.4476 15.7562V11.4083Z" fill="#4B5563"/>
                      </svg>
                      <span>No notifications yet</span>
                  </div>
                  <div className={css.rule}></div>
                  <NamedLink className={css.view_all} name="InboxPage" params={{tab:"orders"}}>
                    View all
                  </NamedLink>
                </div>
              :""}


            </div>
            
          :null}

          {isAuthenticated?
            <div className={css.flex_col}>
              <div className={css.center} onClick={handleLoadInbox}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M19.0003 21C21.2094 21 23.0003 19.2091 23.0003 17V8.02268C23.0006 8.00739 23.0006 7.99206 23.0003 7.9767V7C23.0003 4.79086 21.2094 3 19.0003 3H5.00027C2.79113 3 1.00027 4.79086 1.00027 7V7.97671C0.999911 7.99206 0.999912 8.00739 1.00027 8.02268V17C1.00027 19.2091 2.79113 21 5.00027 21H19.0003ZM3.00027 17C3.00027 18.1046 3.8957 19 5.00027 19H19.0003C20.1048 19 21.0003 18.1046 21.0003 17V9.47703L13.4858 12.4828C12.5322 12.8643 11.4683 12.8643 10.5147 12.4828L3.00027 9.47703V17ZM12.743 10.6259L21.0003 7.32297V7C21.0003 5.89543 20.1048 5 19.0003 5H5.00027C3.8957 5 3.00027 5.89543 3.00027 7V7.32297L11.2575 10.6259C11.7343 10.8166 12.2662 10.8166 12.743 10.6259Z" fill="black"/>
                </svg>

              </div>

                {showInboxMenus?
                <div className={css.noti_menu_con}>
                  <div className={css.menu_title_con}>
                      <span>Inbox</span>
                      <div className={css.count}>1</div>
                  </div>
                  <div className={css.rule}></div>
                  <div className={css.icon_con}>
                    {transactions.data.length > 0?
                        <MessagesNote data={transactions} currentUser={currentUser}/>
                      :
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="27" viewBox="0 0 26 27" fill="none">
                          <path fillRule="evenodd" clipRule="evenodd" d="M13.8313 3.25952C13.8313 2.65937 13.355 2.17285 12.7674 2.17285C12.1798 2.17285 11.7034 2.65937 11.7034 3.25952V3.87986C8.09435 4.40696 5.31968 7.57601 5.31968 11.4083L5.31968 15.7554C5.31968 15.7554 5.31969 15.7553 5.31968 15.7554C5.31958 15.7575 5.31886 15.7721 5.31424 15.8006C5.3087 15.8348 5.29887 15.8814 5.28264 15.9412C5.24973 16.0626 5.19736 16.2137 5.1242 16.3924C4.97752 16.7506 4.77073 17.163 4.54202 17.5791C4.11203 18.3615 3.89528 19.2937 4.058 20.1803C4.2296 21.1152 4.81881 21.9305 5.82513 22.3218C6.72407 22.6714 7.92067 22.9911 9.50089 23.1814C9.53849 23.2147 9.58295 23.2528 9.63403 23.2945C9.79393 23.4252 10.0224 23.5945 10.3111 23.763C10.8841 24.0974 11.7313 24.4495 12.7674 24.4495C13.8035 24.4495 14.6507 24.0974 15.2237 23.763C15.5124 23.5945 15.7409 23.4252 15.9008 23.2945C15.9518 23.2528 15.9963 23.2147 16.0339 23.1814C17.6141 22.9911 18.8107 22.6714 19.7097 22.3218C20.716 21.9305 21.3052 21.1152 21.4768 20.1803C21.6395 19.2937 21.4228 18.3615 20.9928 17.5791C20.7641 17.163 20.5573 16.7506 20.4106 16.3924C20.3374 16.2137 20.285 16.0626 20.2521 15.9412C20.2359 15.8814 20.2261 15.8348 20.2205 15.8006C20.2159 15.7721 20.2152 15.7578 20.2151 15.7557C20.2151 15.7555 20.2151 15.7557 20.2151 15.7557L20.2151 15.7465V11.4088C20.2151 7.57663 17.4405 4.40705 13.8313 3.87987V3.25952ZM7.4476 11.4083C7.4476 8.40784 9.8291 5.97619 12.7674 5.97619C15.7056 5.97619 18.0872 8.40825 18.0872 11.4088V15.7562C18.0872 16.2592 18.2717 16.8018 18.4474 17.2309C18.6383 17.6971 18.8884 18.1903 19.1372 18.643C19.3791 19.0832 19.4368 19.4991 19.3853 19.7798C19.3426 20.0122 19.2289 20.1832 18.9525 20.2908C17.8088 20.7355 15.8783 21.1895 12.7674 21.1895C9.65645 21.1895 7.72593 20.7355 6.58233 20.2908C6.30585 20.1832 6.19214 20.0122 6.14949 19.7798C6.09796 19.4991 6.15565 19.0832 6.39757 18.643C6.64637 18.1903 6.8965 17.6971 7.08736 17.2309C7.26305 16.8018 7.4476 16.2592 7.4476 15.7562V11.4083Z" fill="#4B5563"/>
                        </svg>
                        <span>No messages yet</span>
                      </>
                    }
                      
                      
                  </div>
                  <div className={css.rule}></div>
                  <NamedLink className={css.view_all} name="InboxPage" params={{tab:"orders"}}>
                    View all
                  </NamedLink>

                </div>
              :""}


            </div>
            
          :null}
          
          {isAuthenticated?
            <div className={css.menu_main}>
                    <div className={css.profile_img_icon} onClick={handleShowMenu}>
                      {profileImage !== "" && profileImage !== undefined && profileImage !== null?
                        <img
                          className={css.profile_img}
                          width={40}
                          height={40}
                          alt=''
                          src={profileImage}
                        />
                      :<img
                          className={css.profile_img}
                          width={40}
                          height={40}
                          alt=''
                          src={placeholder}
                        />}
                      
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 12 13" fill="none">
                        <path d="M1.40732 4.40414L5.31464 8.08162C5.69969 8.44402 6.30032 8.44402 6.68537 8.08162L10.5927 4.40414C10.7938 4.21488 10.8034 3.89845 10.6141 3.69736C10.4248 3.49627 10.1084 3.48668 9.90732 3.67594L6 7.35342L2.09268 3.67594C1.8916 3.48668 1.57516 3.49627 1.3859 3.69736C1.19664 3.89845 1.20623 4.21488 1.40732 4.40414Z" fill="#4B5563"/>
                      </svg>
                    </div>

                    {showMenu?
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

                          <div className={css.flex_row_menu_last} onClick={handleSignOut}>
                            Logout
                          </div>
                      </div>
                :""}
              </div>
          :""}
            

          {signupLinkMaybe}
          {loginLinkMaybe}
        
      </div>
      
      
    </nav>
  );
};

export default TopbarDesktop;
