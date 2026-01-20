import React, { useEffect, useState } from 'react';

import { IconSpinner, LayoutComposer } from '../../components/index.js';
import TopbarContainer from '../../containers/TopbarContainer/TopbarContainer.js';
import FooterContainer from '../FooterContainer/FooterContainer.js';

import { validProps } from './Field';

import SectionBuilder from './SectionBuilder/SectionBuilder.js';
import StaticPage from './StaticPage.js';

import css from './PageBuilder.module.css';
import classNames from 'classnames';

const getMetadata = (meta, schemaType, fieldOptions) => {
  const { pageTitle, pageDescription, socialSharing } = meta;

  // pageTitle is used for <title> tag in addition to page schema for SEO
  const title = validProps(pageTitle, fieldOptions)?.content;
  // pageDescription is used for different <meta> tags in addition to page schema for SEO
  const description = validProps(pageDescription, fieldOptions)?.content;
  // Data used when the page is shared in social media services
  const openGraph = validProps(socialSharing, fieldOptions);
  // We add OpenGraph image as schema image if it exists.
  const schemaImage = openGraph?.images1200?.[0]?.url;
  const schemaImageMaybe = schemaImage ? { image: [schemaImage] } : {};
  const isArticle = ['Article', 'NewsArticle', 'TechArticle'].includes(schemaType);
  const schemaHeadlineMaybe = isArticle ? { headline: title } : {};

  // Schema for search engines (helps them to understand what this page is about)
  // http://schema.org (This template uses JSON-LD format)
  //
  // In addition to this schema data for search engines, src/components/Page/Page.js adds some extra schemas
  // Read more about schema:
  // - https://schema.org/
  // - https://developers.google.com/search/docs/advanced/structured-data/intro-structured-data
  const pageSchemaForSEO = {
    '@context': 'http://schema.org',
    '@type': schemaType || 'WebPage',
    description: description,
    name: title,
    ...schemaHeadlineMaybe,
    ...schemaImageMaybe,
  };

  return {
    title,
    description,
    schema: pageSchemaForSEO,
    socialSharing: openGraph,
  };
};

const LoadingSpinner = () => {
  return (
    <div className={css.loading}>
      <IconSpinner delay={600} />
    </div>
  );
};

//////////////////
// Page Builder //
//////////////////


/**
 * @typedef {Object} FieldComponentConfig
 * @property {ReactNode} component
 * @property {Function} pickValidProps
 */

/**
 * PageBuilder can be used to build content pages using page-asset.json.
 *
 * Note: props can include a lot of things that depend on
 * - pageAssetsData: json asset that contains instructions how to build the page content
 *   - asset should contain an array of _sections_, which might contain _fields_ and an array of _blocks_
 *     - _blocks_ can also contain _fields_
 * - fallbackPage: component. If asset loading fails, this is used instead.
 * - options: extra mapping of 3 level of sub components
 *   - sectionComponents: { ['my-section-type']: { component: MySection } }
 *   - blockComponents: { ['my-component-type']: { component: MyBlock } }
 *   - fieldComponents: { ['my-field-type']: { component: MyField, pickValidProps: data => Number.isInteger(data.content) ? { content: data.content } : {} }
 *     - fields have this pickValidProps as an extra requirement for data validation.
 * - pageProps: props that are passed to src/components/Page/Page.js component
 *
 * @param {Object} props
 * @param {Object} props.pageAssetsData
 * @param {Array<Object>} props.pageAssetsData.sections
 * @param {Object} props.pageAssetsData.meta
 * @param {Object} props.pageAssetsData.meta.pageTitle
 * @param {Object} props.pageAssetsData.meta.pageDescription
 * @param {Object} props.pageAssetsData.meta.socialSharing
 * @param {boolean?} props.inProgress
 * @param {Object?} props.error
 * @param {ReactNode?} props.fallbackPage
 * @param {string} props.schemaType type from schema.org (e.g. 'Article', 'Website')
 * @param {string?} props.currentPage name of the current page based on route configuration
 * @param {Object} props.options
 * @param {Object<string,FieldComponentConfig>} props.options.fieldComponents custom field components
 * @returns {JSX.Element} page component
 */
const PageBuilder = props => {
  const {
    pageAssetsData,
    inProgress,
    error,
    fallbackPage,
    schemaType,
    options,
    currentPage,
    showPopups,
    seShowPopups,
    handleChangePopups,
    showMenu,
    history,
    setShowMenu,
    handleChangeShowMenu,
    setShowList1,
    setShowList2,
    showList1,
    showList2,
    ...pageProps
  } = props;

  if (!pageAssetsData && fallbackPage && !inProgress && error) {
    return fallbackPage;
  }

  // Page asset contains UI info and metadata related to it.
  // - "sections" (data that goes inside <body>)
  // - "meta" (which is data that goes inside <head>)
  const { sections = [], meta = {} } = pageAssetsData || {};
  const pageMetaProps = getMetadata(meta, schemaType, options?.fieldComponents);
  const [showTopBoxMenu,setShowTopBoxMenu] = useState(false);
  const [showExpandedSearchBar, setShowExpandedSearchBar] = useState(false);
  const [parentClicked, setParentClicked] = useState(false);
  
  

  const layoutAreas = `
    topbar
    main
    footer
  `;

const handleClick = e =>{
  seShowPopups(false);
  setShowMenu(false);
  handleChangePopups();
  //console.log("Removing oooooooo showPopups  oooooooo    " + showPopups);
  //console.log("Removing 11111111111   showMenu   11111111111111    " + showMenu);
  //console.log(showPopups);
  handleChangeShowMenu();
  setParentClicked(!parentClicked);
}

// const handleShowMenu = (e) =>{
//     console.log("Clickesddddddddddddddd");
//     setShowMenu(true);
//   }

  return (
    <StaticPage {...pageMetaProps} {...pageProps} >
      <LayoutComposer areas={layoutAreas} className={css.layout} onClick={e=>{handleClick(e)}}>
        {props => {
          const { Topbar, Main, Footer } = props;
          return (
            <>
              <Topbar as="header" className={css.topbar}>
                <TopbarContainer 
                  currentPage={currentPage}
                  setShowTopBoxMenu={setShowTopBoxMenu}
                  showTopBoxMenu={showTopBoxMenu}
                  showPopups={showPopups}
                  seShowPopups={seShowPopups}
                  handleChangePopups={handleChangePopups}
                  showExpandedSearchBar={showExpandedSearchBar}
                  setShowExpandedSearchBar={setShowExpandedSearchBar}
                  showMenu={showMenu}
                  setShowMenu={setShowMenu}
                  handleChangeShowMenu={handleChangeShowMenu}
                  parentClicked={parentClicked}
                  setParentClicked={setParentClicked}
                  showList1={showList1}
                  showList2={showList2}
                  setShowList1={setShowList1}
                  setShowList2={setShowList2}
                />
              </Topbar>
              <Main as="main" className={classNames(css.main,(showExpandedSearchBar?css.negative_mag_top:""))}>
                {sections.length === 0 && inProgress ? (
                  <LoadingSpinner />
                ) : (
                  <SectionBuilder 
                    sections={sections} 
                    options={options} 
                    setShowTopBoxMenu={setShowTopBoxMenu}
                    showTopBoxMenu={showTopBoxMenu}
                    showPopups={showPopups}
                    seShowPopups={seShowPopups}
                    history={history}
                   />
                )}
              </Main>
              <Footer>
                <FooterContainer />
              </Footer>
            </>
          );
        }}
      </LayoutComposer>
    </StaticPage>
  );
};


export { LayoutComposer, StaticPage, SectionBuilder };

export default PageBuilder;
