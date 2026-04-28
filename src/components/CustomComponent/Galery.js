import React, { Suspense, useEffect, useRef ,useState} from "react";
import css from './Gallery.module.css';
import slide1 from '../../assets/images/slides/slide1.jpg';
import slide2 from '../../assets/images/slides/slide2.jpg';
import slide3 from '../../assets/images/slides/slide3.jpg';
import slide4 from '../../assets/images/slides/slide4.jpg';
import slide5 from '../../assets/images/slides/slide5.jpg';
import slide6 from '../../assets/images/slides/slide6.jpg';
import slide7 from '../../assets/images/slides/slide7.jpg';
import slide8 from '../../assets/images/slides/slide8.jpg';

import loadable from "@loadable/component";
const Carrousel = loadable(() => import(/* webpackChunkName: "AuthenticationPage" */ './OwlCarouselComp'));

const Gallery = props =>{

    const {testimony} = props;

    return(
        <>
        <div className={css.main_desktop}>
                <div className={css.slide_con}>
                    <Suspense fallback={<Loading />}>
                        <Carrousel
                            data={testimony}
                        />
                    </Suspense>
                </div>
            </div>

    <div className={css.mobile}>

            <div className={css.slide_con}>
                <div className={css.slide_con}>
                 <div>
                   
                    <div className={css.card_con}>
                        <div className={css.flex_row}>
                            <div className={css.header}>
                                <span className={css.txt_sm}>REAL WEDLY MOMENTS</span>
                                <h3 className={css.popular_title}>Gallery of reimagined wedding</h3>
                            </div>
                            <div className={css.flex_col_2}>
                                <p>
                                    Scroll a living moodboard of a desert sunset, textural gowns, and ceremony details styles from pre-loved pieces.
                                </p>
                            </div>
                        </div>

                        <div className={css.flex_row_2}>
                            <div className={css.card} style={{backgroundImage:`url(${slide1})`,backgroundSize:"cover"}}>
                                <div className={css.caption}>
                                    Grace love lace
                                </div>
                            </div>
                            <div className={css.card} style={{backgroundImage:`url(${slide2})`,backgroundSize:"cover"}}>
                                <div className={css.caption}>
                                    Lovely cool wedding gown
                                </div>
                            </div>
                            <div className={css.card} style={{backgroundImage:`url(${slide3})`,backgroundSize:"cover"}}>
                                <div className={css.caption}>
                                    I love wedding
                                </div>
                            </div>
                            <div className={css.card} style={{backgroundImage:`url(${slide4})`,backgroundSize:"cover"}}>
                                <div className={css.caption}>
                                    A cool wedding setting
                                </div>
                            </div>
                           
                        </div>
                    </div>
               
            </div>
            </div>
    </div>


            </div>

        
        </>
   
           
    )
}

const Loading = props =>{
    return "Loading";
}

export default Gallery;
