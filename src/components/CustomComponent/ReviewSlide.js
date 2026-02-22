import React from "react";
import css from './ReviewSlide.module.css';

import classNames from "classnames";
import { FormattedMessage, useIntl } from '../../util/reactIntl';

const ReviewSlide = (props)=>{

    return(
        <>
            <div className={css.main_desktop}>

                    <div className={classNames(css.desktop)}>
                        <div className={css.title_con}>
                            <div className={css.popular_title}>
                                <FormattedMessage id="LandingPage.happyToHear" />
                            </div>
                        </div>
                    </div>
            </div>
        
            
        </>
    );

}

export default ReviewSlide;