import React from "react";
import css from './ReviewSlide.module.css';

import cust1 from '../../assets/customers/cust1.png';
import cust2 from '../../assets/customers/cust2.png';
import cust3 from '../../assets/customers/cust1.png';
import cust4 from '../../assets/customers/cust2.png';

import star from '../../assets/icons/star.png';
import classNames from "classnames";
import client_icon from '../../assets/icons/client.png';
import provider_icon from '../../assets/icons/provider.png';
import chevronUp from '../../assets/icons/chevron-up.png';
import NamedLink from "../NamedLink/NamedLink";
import ReviewRating from "../ReviewRating/ReviewRating";

const ReviewSlide = (props)=>{

    return(
        <>
            <div className={css.main_desktop}>

                    <div className={classNames(css.desktop)}>
                        <div className={css.title_con}>
                            <div className={css.popular_title}>
                                Happy to hear from satisfied customers
                            </div>
                            
                        </div>
                    
                        
                    </div>
            </div>
        
            
        </>
    );

}

export default ReviewSlide;