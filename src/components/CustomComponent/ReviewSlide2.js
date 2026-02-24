import React, { useRef } from "react";
import css from './ReviewSlide.module.css';
import cust1 from '../../assets/customers/cust1.png';
import cust2 from '../../assets/customers/cust2.png';
import cust3 from '../../assets/customers/cust1.png';
import cust4 from '../../assets/customers/cust2.png';
import avater from '../../assets/avater2.png';

import star from '../../assets/icons/star.png';
import classNames from "classnames";
import ReviewRating from "../ReviewRating/ReviewRating";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
    slidesToSlide: 3 // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 2 // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1 // optional, default to 1.
  }
};

const ReviewSlider = props =>{

    const reff = useRef(null);


    return(
        <>
        <div className={css.main_desktop}>
            <div className={css.slide_con}>
                 <div id="carouselExampleInterval" class="carousel slide" data-bs-ride="carousel">
                    <div class="carousel-inner">
                    <div class="carousel-item active" data-bs-interval="100">
                        <div className={css.flex_row_slider}>
                              
                                <div className={classNames(css.flex_col,css.item)}>
                                    <p>
                                        List your party decoration services on our platform and reach a 
                                        wide audience of customer looking to make their event stand out.
                                    </p>
                                    
                                    <div className={css.flex_row_center}>
                                        <img src={cust2}/>
                                        <div className={css.flex_col_sub}>
                                            <div>
                                                <ReviewRating
                                                    rating={parseInt(4)}
                                                    className={css.ratng}
                                                />
                                            </div>
                                            <div className={"d-flex gap-2 justify-start align-middle"}><span className={css.user_name}>Sarah Kickflip</span><span className={css.user_title}>Caterer</span></div>
                                            
                                        </div>
                                    </div>
                                </div>
                                <div className={classNames(css.flex_col,css.item)}>
                                    <p>
                                        List your party decoration services on our platform and reach a 
                                        wide audience of customer looking to make their event stand out.
                                    </p>
                                    
                                    <div className={css.flex_row_center}>
                                        <img src={cust3}/>
                                        <div className={css.flex_col_sub}>
                                            <div>
                                                <ReviewRating
                                                    rating={parseInt(4)}
                                                    className={css.ratng}
                                                />
                                            </div>
                                            <div className={"d-flex gap-2 justify-start align-middle"}><span className={css.user_name}>John Smiles</span><span className={css.user_title}>Caterer</span></div>
                                            
                                        </div>
                                    </div>
                                </div>
                                <div className={classNames(css.flex_col,css.item)}>
                                    <p>
                                        List your party decoration services on our platform and reach a 
                                        wide audience of customer looking to make their event stand out.
                                    </p>
                                    
                                    <div className={css.flex_row_center}>
                                        <img src={cust4}/>
                                        <div className={css.flex_col_sub}>
                                            <div>
                                                <ReviewRating
                                                    rating={parseInt(3)}
                                                    className={css.ratng}
                                                />
                                            </div>
                                            <div className={"d-flex gap-2 justify-start align-middle"}><span className={css.user_name}>Mia Dance</span><span className={css.user_title}>Caterer</span></div>
                                            
                                        </div>
                                    </div>
                                </div>
                            

                        </div>
                        
                    </div>
                  
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">{intl.formatMessage({id: 'CategoriesForm.previous'})}</span>
                </button>
                <button ref={reff} class="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
    </div>

            </div>

    <div className={css.mobile}>

            <div className={css.slide_con}>
                 <div id="carouselExampleInterval" class="carousel slide" data-bs-ride="carousel">
                    <div class="carousel-inner">
                    <div class="carousel-item active" data-bs-interval="100">
                        <div className={css.flex_row_slider}>
                                <div className={classNames(css.flex_col,css.item)}>
                                    <p>
                                        List your party decoration services on our platform and reach a 
                                        wide audience of customer looking to make their event stand out.
                                    </p>
                                    
                                    <div className={css.flex_row_center}>
                                        <img src={cust1}/>
                                        <div className={css.flex_col_sub}>
                                            <div>
                                                <ReviewRating
                                                    rating={parseInt(3)}
                                                    className={css.ratng}
                                                />
                                            </div>
                                            <div className={"d-flex gap-2 justify-start align-middle"}><span className={css.user_name}>Sarah Kickflip</span><span className={css.user_title}>Caterer</span></div>
                                            
                                        </div>
                                    </div>
                                </div>
                                <div className={classNames(css.flex_col,css.item)}>
                                    <p>
                                        List your party decoration services on our platform and reach a 
                                        wide audience of customer looking to make their event stand out.
                                    </p>
                                    
                                    <div className={css.flex_row_center}>
                                        <img src={cust2}/>
                                        <div className={css.flex_col_sub}>
                                            <div>
                                                <ReviewRating
                                                    rating={parseInt(4)}
                                                    className={css.ratng}
                                                />
                                            </div>
                                            <div className={"d-flex gap-2 justify-start align-middle"}><span className={css.user_name}>Sarah Kickflip</span><span className={css.user_title}>Caterer</span></div>
                                            
                                        </div>
                                    </div>
                                </div>
                                <div className={classNames(css.flex_col,css.item)}>
                                    <p>
                                        List your party decoration services on our platform and reach a 
                                        wide audience of customer looking to make their event stand out.
                                    </p>
                                    
                                    <div className={css.flex_row_center}>
                                        <img src={cust3}/>
                                        <div className={css.flex_col_sub}>
                                            <div>
                                                <ReviewRating
                                                    rating={parseInt(4)}
                                                    className={css.ratng}
                                                />
                                            </div>
                                            <div className={"d-flex gap-2 justify-start align-middle"}><span className={css.user_name}>Sarah Kickflip</span><span className={css.user_title}>Caterer</span></div>
                                            
                                        </div>
                                    </div>
                                </div>
                              
                        </div>
                        
                    </div>
                  
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">{intl.formatMessage({id: 'CategoriesForm.previous'})}</span>
                </button>
                <button ref={reff} class="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
    </div>


            </div>

        
        </>
   
           
    )
}

export default ReviewSlider;
