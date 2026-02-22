import React from "react";
import css from './Why.module.css';

import why1 from '../../assets/why/why1.png';
import why2 from '../../assets/why/why2.png';
import why3 from '../../assets/why/why3.png';
import why4 from '../../assets/why/why4.png';

import star from '../../assets/icons/star.png';
import classNames from "classnames";
import { FormattedMessage, useIntl } from '../../util/reactIntl';


const Why = (props)=>{

    return(
        <>
        <div className={css.main_desktop}>
                    <div className={classNames(css.desktop)}>
                        <div className={css.title_con}>
                            <div className={css.popular_title}>
                                <FormattedMessage id="LandingPage.whyTitle" />
                            </div>
                            
                        </div>
                        <div className={css.flex_grids}>

                            <div className={css.items}>
                                <img src={why1}/>
                                
                                <span className={css.title}><FormattedMessage id="LandingPage.convinience" /></span>
                                <p>
                                    <FormattedMessage id="LandingPage.findAll" />
                                </p>
                            </div>
                            <div className={css.items}>
                                <img src={why2}/>
                                <span className={css.title}><FormattedMessage id="LandingPage.varietyForSelf" /></span>
                                <p>
                                    <FormattedMessage id="LandingPage.AccessAWide" />
                                </p>
                            </div>
                            <div className={css.items}>
                                <img src={why3}/>
                                <span className={css.title}><FormattedMessage id="LandingPage.paymentProtection" /></span>
                                <p>
                                    <FormattedMessage id="LandingPage.weHoldThePayment" />
                                </p>
                            </div>

                            <div className={css.items}>
                                <img src={why4}/>
                                <span className={css.title}><FormattedMessage id="LandingPage.trust" /></span>
                                <p>
                                    <FormattedMessage id="LandingPage.ourReview" />
                                </p>
                            </div>

                        </div>
                        
                    </div>
        </div>

        <div className={css.mobile}>

        <div className={classNames(css.mobile_con)}>
                        <div className={css.title_con}>
                            <div className={css.popular_title}>
                                <FormattedMessage id="LandingPage.whyTitle" />
                            </div>
                            
                        </div>
                        <div className={css.flex_grids}>

                            <div className={css.items}>
                                <img src={why1}/>
                                
                                <span className={css.title}><FormattedMessage id="LandingPage.convinience" /></span>
                                <p>
                                    <FormattedMessage id="LandingPage.findAll" />
                                </p>
                            </div>
                            <div className={css.items}>
                                <img src={why2}/>
                                <span className={css.title}><FormattedMessage id="LandingPage.varietyForSelf" /></span>
                                <p>
                                    <FormattedMessage id="LandingPage.AccessAWide" />
                                </p>
                            </div>
                            <div className={css.items}>
                                <img src={why3}/>
                                <span className={css.title}><FormattedMessage id="LandingPage.paymentProtection" /></span>
                                <p>
                                    <FormattedMessage id="LandingPage.weHoldThePayment" />
                                </p>
                            </div>

                            <div className={css.items}>
                                <img src={why4}/>
                                <span className={css.title}><FormattedMessage id="LandingPage.trust" /></span>
                                <p>
                                    <FormattedMessage id="LandingPage.ourReview" />
                                </p>
                            </div>

                        </div>
                        
                    </div>

        </div>
         
        </>
    );

}

export default Why;