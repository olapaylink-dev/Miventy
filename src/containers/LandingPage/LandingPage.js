import React, { useState } from 'react';
import loadable from '@loadable/component';

import { bool, object } from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { camelize } from '../../util/string';
import { propTypes } from '../../util/types';

import FallbackPage from './FallbackPage';
import { ASSET_NAME } from './LandingPage.duck';
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min';

const PageBuilder = loadable(() =>
  import(/* webpackChunkName: "PageBuilder" */ '../PageBuilder/PageBuilder')
);

export const LandingPageComponent = props => {
  const { pageAssetsData, inProgress, error,history,onLogout } = props;
  const [showPopups,seShowPopups] = useState(false);
  const [showMenu,setShowMenu] = useState(false);

  const [showList1, setShowList1] = useState(false);
  const [showList2, setShowList2] = useState(false);

  const handleChangePopups = e =>{
    seShowPopups(true);
  }

  const handleChangeShowMenu = e =>{
    setShowMenu(false);
  }


  return (
    <PageBuilder
      pageAssetsData={pageAssetsData?.[camelize(ASSET_NAME)]?.data}
      inProgress={inProgress}
      error={error}
      fallbackPage={<FallbackPage error={error} />}
      showPopups={showPopups}
      seShowPopups={seShowPopups}
      handleChangePopups={handleChangePopups}
      showMenu={showMenu}
      setShowMenu={setShowMenu}
      handleChangeShowMenu={handleChangeShowMenu}
      history={history}
      setShowList1={setShowList1}
      setShowList2={setShowList2}
      showList1={showList1}
      showList2={showList2}
      onLogout={onLogout}
    />
  );
};

LandingPageComponent.propTypes = {
  pageAssetsData: object,
  inProgress: bool,
  error: propTypes.error,
};

const mapStateToProps = state => {
  const { pageAssetsData, inProgress, error } = state.hostedAssets || {};
  return { pageAssetsData, inProgress, error };
};

// Note: it is important that the withRouter HOC is **outside** the
// connect HOC, otherwise React Router won't rerender any Route
// components since connect implements a shouldComponentUpdate
// lifecycle hook.
//
// See: https://github.com/ReactTraining/react-router/issues/4671
const LandingPage = compose( withRouter,connect(mapStateToProps))(LandingPageComponent);


export default LandingPage;
