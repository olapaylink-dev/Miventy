import React, { useState } from 'react';
import classNames from 'classnames';

// Section components
import SectionArticle from './SectionArticle';
import SectionCarousel from './SectionCarousel';
import SectionColumns from './SectionColumns';
import SectionFeatures from './SectionFeatures';
import SectionHero from './SectionHero';

// Styles
// Note: these contain
// - shared classes that are passed as defaultClasses
// - dark theme overrides
// TODO: alternatively, we could consider more in-place way of theming components
import css from './SectionBuilder.module.css';
import SectionFooter from './SectionFooter';
import Hero from '../../../components/CustomComponent/Hero';
import Categories from '../../../components/CustomComponent/Categories';
import Popular from '../../../components/CustomComponent/Popular';
import Why from '../../../components/CustomComponent/Why';
import ReviewSlide from '../../../components/CustomComponent/ReviewSlide';
import Become from '../../../components/CustomComponent/Become';
import WithUs from '../../../components/CustomComponent/WithUs';
import ReviewSlider from '../../../components/CustomComponent/ReviewSlide2';
import Gallery from '../../../components/CustomComponent/Galery';

import slide1 from '../../../assets/images/slides/slide1.jpg';
import slide2 from '../../../assets/images/slides/slide2.jpg';
import slide3 from '../../../assets/images/slides/slide3.jpg';
import slide4 from '../../../assets/images/slides/slide4.jpg';
import slide5 from '../../../assets/images/slides/slide5.jpg';
import slide6 from '../../../assets/images/slides/slide6.jpg';
import slide7 from '../../../assets/images/slides/slide7.jpg';
import slide8 from '../../../assets/images/slides/slide8.jpg';

// These are shared classes.
// Use these to have consistent styles between different section components
// E.g. share the same title styles
const DEFAULT_CLASSES = {
  sectionDetails: css.sectionDetails,
  title: css.title,
  description: css.description,
  ctaButton: css.ctaButton,
  blockContainer: css.blockContainer,
};

/////////////////////////////////////////////
// Mapping of section types and components //
/////////////////////////////////////////////

const defaultSectionComponents = {
  article: { component: SectionArticle },
  carousel: { component: SectionCarousel },
  columns: { component: SectionColumns },
  features: { component: SectionFeatures },
  footer: { component: SectionFooter },
  hero: { component: SectionHero },
};

//////////////////////
// Section builder //
//////////////////////

/**
 * @typedef {Object} FieldOption
 * @property {ReactNode} component
 * @property {Function} pickValidProps
 */

/**
 * @typedef {Object} BlockOption
 * @property {ReactNode} component
 */

/**
 * @typedef {Object} SectionOption
 * @property {ReactNode} component
 */

/**
 * @typedef {Object} SectionConfig
 * @property {string} sectionId
 * @property {string} sectionName
 * @property {('article' | 'carousel' | 'columns' | 'features' | 'hero')} sectionType
 */

/**
 * Build section elements from given section config array.
 *
 * @component
 * @param {Object} props
 * @param {Array<SectionConfig>} props.sections
 * @param {Object} props.options
 * @param {Object<string,FieldOption>} props.options.fieldComponents
 * @param {Object<string,BlockOption>} props.options.blockComponents
 * @param {Object<string,SectionOption>} props.options.sectionComponents
 * @param {boolean} props.options.isInsideContainer
 * @returns {JSX.Element} element containing array of sections according from given config array.
 */
const SectionBuilder = props => {
  const { sections = [], options,
    setShowTopBoxMenu,
    showTopBoxMenu,
    showPopups,
    seShowPopups,
    handleShowPopUps,
    history,
  } = props;
  const { sectionComponents = {}, isInsideContainer, ...otherOption } = options || {};
  const [showExpandedSearchBar,setShowExpandedSearchBar] = useState(false);

  // If there's no sections, we can't render the correct section component
  if (!sections || sections.length === 0) {
    return null;
  }

  // Selection of Section components
  const components = { ...defaultSectionComponents, ...sectionComponents };
  const getComponent = sectionType => {
    const config = components[sectionType];
    return config?.component;
  };

  // Generate unique ids for sections if operator has managed to create duplicates
  // E.g. "foobar", "foobar1", and "foobar2"
  const sectionIds = [];
  const getUniqueSectionId = (sectionId, index) => {
    const candidate = sectionId || `section-${index + 1}`;
    if (sectionIds.includes(candidate)) {
      let sequentialCandidate = `${candidate}1`;
      for (let i = 2; sectionIds.includes(sequentialCandidate); i++) {
        sequentialCandidate = `${candidate}${i}`;
      }
      return getUniqueSectionId(sequentialCandidate, index);
    } else {
      sectionIds.push(candidate);
      return candidate;
    }
  };

  const testimony = [
        {desc:"Test1",name:"Cart Mark",category:"Animator",img:slide1},
        {desc:"Test2",name:"Bob Ruff",category:"Caterer",img:slide2},
        {desc:"Test3",name:"Fred Mathew",category:"Magician",img:slide3},
        {desc:"Test4",name:"Judge Willis",category:"Caterer",img:slide4},
        {desc:"Test5",name:"Marry Moose",category:"Face painter",img:slide5},
        {desc:"Test6",name:"Mickel Moris",category:"Animator",img:slide6},
        {desc:"Test7",name:"Babara Almond",category:"Caterer",img:slide7}
    ]

  return (
    <>
      {sections.map((section, index) => {
        const Section = getComponent(section.sectionType);
        // If the default "dark" theme should be applied (when text color is white).
        // By default, this information is stored to customAppearance field
        const isDarkTheme =
          section?.appearance?.fieldType === 'customAppearance' &&
          section?.appearance?.textColor === 'white';
        const classes = classNames({ [css.darkTheme]: isDarkTheme });
        const sectionId = getUniqueSectionId(section.sectionId, index);

        console.log(sectionId);

        if (Section) {
          return (
           <>
            {section.sectionName === "Marketplace introduction"?
                <Hero 
                  setShowTopBoxMenu={setShowTopBoxMenu}
                  showTopBoxMenu={showTopBoxMenu}
                  showPopups={showPopups}
                  seShowPopups={seShowPopups}
                  handleShowPopUps={handleShowPopUps}
                  history={history}
                  setShowExpandedSearchBar={setShowExpandedSearchBar}
                />
              :""}
            <div className={css.main_pad}>

                  {section.sectionName === "Featured locations"?
                    <Categories/>
                  :

                  section.sectionName === "How it works"?
                    <>
                      <Popular history={history}/>
                      <Why/>
                      <ReviewSlide/>
                      <ReviewSlider testimony={testimony} />
                      {/* <Gallery/> */}
                      <Become/>
                      <WithUs history={history}/>
                    </>
                  :""}
            </div>
             

              {
              sectionId === "footer"?
                <Section
                  key={`${sectionId}_i${index}`}
                  className={classes}
                  defaultClasses={DEFAULT_CLASSES}
                  isInsideContainer={isInsideContainer}
                  options={otherOption}
                  {...section}
                  sectionId={sectionId}
                />
              :""  
              }
           
           </>
          );
        } else {
          // If the section type is unknown, the app can't know what to render
          console.warn(
            `Unknown section type (${section.sectionType}) detected using sectionName (${section.sectionName}).`
          );
          return null;
        }
      })}
    </>
  );
};


export default SectionBuilder;
