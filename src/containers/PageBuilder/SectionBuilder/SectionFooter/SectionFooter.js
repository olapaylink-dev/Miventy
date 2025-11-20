import React from 'react';
import classNames from 'classnames';
import { LinkedLogo, NamedLink } from '../../../../components';

import Field from '../../Field';
import BlockBuilder from '../../BlockBuilder';

import SectionContainer from '../SectionContainer';
import css from './SectionFooter.module.css';
import logo from '../../../../assets/logo.png';

// The number of columns (numberOfColumns) affects styling

const GRID_CONFIG = [
  { contentCss: css.contentCol1, gridCss: css.gridCol1 },
  { contentCss: css.contentCol2, gridCss: css.gridCol2 },
  { contentCss: css.contentCol3, gridCss: css.gridCol3 },
  { contentCss: css.contentCol4, gridCss: css.gridCol4 },
];
const MAX_MOBILE_SCREEN_WIDTH = 1024;

const getIndex = numberOfColumns => numberOfColumns - 1;

const getContentCss = numberOfColumns => {
  const contentConfig = GRID_CONFIG[getIndex(numberOfColumns)];
  return contentConfig ? contentConfig.contentCss : GRID_CONFIG[0].contentCss;
};

const getGridCss = numberOfColumns => {
  const contentConfig = GRID_CONFIG[getIndex(numberOfColumns)];
  return contentConfig ? contentConfig.gridCss : GRID_CONFIG[0].gridCss;
};

/**
 * @typedef {Object} SocialMediaLinkConfig
 * @property {'socialMediaLink'} fieldType
 * @property {string} platform
 * @property {string} url
 */

/**
 * @typedef {Object} BlockConfig
 * @property {string} blockId
 * @property {string} blockName
 * @property {'defaultBlock' | 'footerBlock' | 'socialMediaLink'} blockType
 */

/**
 * @typedef {Object} FieldComponentConfig
 * @property {ReactNode} component
 * @property {Function} pickValidProps
 */

/**
 * Section component that's able to show blocks in multiple different columns (defined by "numberOfColumns" prop)
 *
 * @component
 * @param {Object} props
 * @param {string?} props.className add more style rules in addition to components own css.root
 * @param {string?} props.rootClassName overwrite components own css.root
 * @param {string} props.sectionId id of the section
 * @param {'footer'} props.sectionType
 * @param {number} props.numberOfColumns columns for blocks in footer (1-4)
 * @param {Array<SocialMediaLinkConfig>?} props.socialMediaLinks array of social media link configs
 * @param {Object?} props.slogan
 * @param {Object?} props.copyright
 * @param {Object?} props.appearance
 * @param {Array<BlockConfig>?} props.blocks array of block configs
 * @param {Object} props.options extra options for the section component (e.g. custom fieldComponents)
 * @param {Object<string,FieldComponentConfig>?} props.options.fieldComponents custom fields
 * @returns {JSX.Element} Section for article content
 */
const SectionFooter = props => {
  const {
    sectionId,
    className,
    rootClassName,
    numberOfColumns = 1,
    socialMediaLinks = [],
    slogan,
    appearance,
    copyright,
    blocks = [],
    options,
    linkLogoToExternalSite,
  } = props;

  // If external mapping has been included for fields
  // E.g. { h1: { component: MyAwesomeHeader } }
  const fieldComponents = options?.fieldComponents;
  const fieldOptions = { fieldComponents };
  const linksWithBlockId = socialMediaLinks?.map(sml => {
    return {
      ...sml,
      blockId: sml.link.platform,
    };
  });

  const showSocialMediaLinks = socialMediaLinks?.length > 0;
  const hasMatchMedia = typeof window !== 'undefined' && window?.matchMedia;
  const isMobileLayout = hasMatchMedia
    ? window.matchMedia(`(max-width: ${MAX_MOBILE_SCREEN_WIDTH}px)`)?.matches
    : true;
  const logoLayout = isMobileLayout ? 'mobile' : 'desktop';

  // use block builder instead of mapping blocks manually

  return (
   
    <>
      <div className={css.main_desktop}>
        <div className={css.footer}>
          <div className={classNames(css.content)}>

            <div className={css.flex_row_2}>
                <div className={css.logo}>
                  <NamedLink name="LandingPage">
                    <img className={css.resize} src={logo} />
                  </NamedLink>
                </div>
                <div className={css.flex_row_3}>
                    <div className={css.flex_col}>
                      <span className={css.footer_header}>
                        Getting started
                      </span>
                      <NamedLink name="LandingPage">
                        How it works
                      </NamedLink>
                      <NamedLink name="LandingPage">
                        Offer your service
                      </NamedLink>
                      <NamedLink name="LandingPage">
                        Popular categories
                      </NamedLink>
                      <NamedLink name="LandingPage">
                        Tips for entertainers
                      </NamedLink>
                      <NamedLink name="LandingPage">
                        FAQ
                      </NamedLink>
                    </div>
                    <div className={css.flex_col}>
                      <span className={css.footer_header}>
                        Contact us
                      </span>
                      <NamedLink name="LandingPage">
                        Instagram
                      </NamedLink>
                      <NamedLink name="LandingPage">
                        Twitter
                      </NamedLink>
                      <NamedLink name="LandingPage">
                        Facebook
                      </NamedLink>
                    </div>
                    <div className={css.flex_col}>
                      <span className={css.footer_header}>
                        About us
                      </span>
                      <NamedLink name="LandingPage">
                        Contact us
                      </NamedLink>
                    </div>
                </div>
            </div>
          
          
          <div className={css.flex_row}>
              <div className={css.copyright}>© 2023 — Copyright</div>
              <div className={css.privacy}>Privacy</div>
          </div>
            
            
          </div>
        </div>
      </div>

      <div className={css.mobile}>
      <div className={css.footer}>
          <div className={classNames(css.content)}>

            <div className={css.flex_row_2}>
                <div className={css.logo}>
                  <NamedLink name="LandingPage">
                    <img className={css.resize} src={logo} />
                  </NamedLink>
                </div>
                <div className={css.flex_row_3}>
                    <div className={css.flex_col}>
                      <span className={css.footer_header}>
                        Getting started
                      </span>
                      <NamedLink name="LandingPage">
                        How it works
                      </NamedLink>
                      <NamedLink name="LandingPage">
                        Offer your service
                      </NamedLink>
                      <NamedLink name="LandingPage">
                        Popular categories
                      </NamedLink>
                      <NamedLink name="LandingPage">
                        Tips for entertainers
                      </NamedLink>
                      <NamedLink name="LandingPage">
                        FAQ
                      </NamedLink>
                    </div>
                    <div className={css.flex_col}>
                      <span className={css.footer_header}>
                        Contact us
                      </span>
                      <NamedLink name="LandingPage">
                        Instagram
                      </NamedLink>
                      <NamedLink name="LandingPage">
                        Twitter
                      </NamedLink>
                      <NamedLink name="LandingPage">
                        Facebook
                      </NamedLink>
                    </div>
                    <div className={css.flex_col}>
                      <span className={css.footer_header}>
                        About us
                      </span>
                      <NamedLink name="LandingPage">
                        Contact us
                      </NamedLink>
                    </div>
                </div>
            </div>
          
          
          <div className={css.flex_row}>
              <div className={css.copyright}>© 2023 — Copyright</div>
              <div className={css.privacy}>Privacy</div>
          </div>
            
            
          </div>
        </div>
      </div>
    
    </>
      
    
  );
};

export default SectionFooter;
