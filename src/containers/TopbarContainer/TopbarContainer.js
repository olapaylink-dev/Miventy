import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import loadable from '@loadable/component';

import { propTypes } from '../../util/types';

import { sendVerificationEmail, hasCurrentUserErrors, fetchCurrentUserHasListings, fetchCurrentUserHasOrders } from '../../ducks/user.duck';
import { logout, authenticationInProgress } from '../../ducks/auth.duck';
import { manageDisableScrolling } from '../../ducks/ui.duck';
import { updateProfile } from '../ProfileSettingsPage/ProfileSettingsPage.duck';
import { searchListingByKeyword } from '../SearchPage/SearchPage.duck';

const Topbar = loadable(() => import(/* webpackChunkName: "Topbar" */ './Topbar/Topbar'));

/**
 * Topbar container component, which is connected to Redux Store.
 * @component
 * @param {Object} props
 * @returns {JSX.Element}
 */
export const TopbarContainerComponent = props => {
  const {onFetchCurrentTransaction, notificationCount = 0, ...rest } = props;
  const {showPopups} = props;
  console.log(showPopups);

  useEffect(()=>{
    onFetchCurrentTransaction();
  },[])
  
  console.log(notificationCount,"  vvvvvvvvvvvvvvvvvvv")
  return <Topbar notificationCount={notificationCount} {...rest} />;
};


const mapStateToProps = state => {
  // Topbar needs isAuthenticated and isLoggedInAs
  const { isAuthenticated, isLoggedInAs, logoutError, authScopes } = state.auth;
  // Topbar needs user info.
  const {
    currentUser,
    currentUserHasListings,
    currentUserHasOrders,
    currentUserNotificationCount: notificationCount,
    sendVerificationEmailInProgress,
    sendVerificationEmailError,
    transactions
  } = state.user;
  const hasGenericError = !!(logoutError || hasCurrentUserErrors(state));
  const {searchTitles} = state.SearchPage;
  console.log(searchTitles)
  return {
    authInProgress: authenticationInProgress(state),
    currentUser,
    currentUserHasListings,
    currentUserHasOrders,
    notificationCount,
    isAuthenticated,
    isLoggedInAs,
    authScopes,
    sendVerificationEmailInProgress,
    sendVerificationEmailError,
    hasGenericError,
    transactions,
    searchTitles
  };
};

const mapDispatchToProps = dispatch => ({
  onLogout: historyPush => dispatch(logout(historyPush)),
  onManageDisableScrolling: (componentId, disableScrolling) => dispatch(manageDisableScrolling(componentId, disableScrolling)),
  onResendVerificationEmail: () => dispatch(sendVerificationEmail()),
  onFetchCurrentTransaction: () => dispatch(fetchCurrentUserHasOrders()),
  onUpdateProfile:(data) => dispatch(updateProfile(data)),
  onSearchKeyword: searchTerm => dispatch(searchListingByKeyword(searchTerm))
});

// Note: it is important that the withRouter HOC is **outside** the
// connect HOC, otherwise React Router won't rerender any Route
// components since connect implements a shouldComponentUpdate
// lifecycle hook.
//
// See: https://github.com/ReactTraining/react-router/issues/4671
const TopbarContainer = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(TopbarContainerComponent);

export default TopbarContainer;
