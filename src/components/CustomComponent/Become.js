import React from "react";
import css from './Become.module.css';
import NamedLink from "../NamedLink/NamedLink";
import become from '../../assets/become/become1.png';
import become2 from '../../assets/become/become2.png';
import { FormattedMessage, useIntl } from '../../util/reactIntl';

const Become = props =>{

    return (

        <>
            <div className={css.main_desktop}>

                    <div className={css.container}>
                    <div className={css.become_title_con}>
                        <h2 className={css.become_title}>
                            <FormattedMessage id="LandingPage.becomeProvider" />
                        </h2>
                    </div>
                    <div className={css.content}>
                        <div className={css.flex_col}>
                            <ol>
                                <li><FormattedMessage id="LandingPage.showcaseTalent" /></li>
                                <li><FormattedMessage id="LandingPage.growYourBusi" /></li>
                                <li><FormattedMessage id="LandingPage.getPaid" /></li>
                            </ol>

                            <div className={css.browse_cat_con}>
                                <NamedLink className={css.browse_cat} name="StripePayoutPage">
                                    <FormattedMessage id="LandingPage.postService" />
                                </NamedLink>
                            </div>
                        </div>
                        <div>
                            <img className={css.become_img} src={become} />
                        </div>

                    </div>
                </div>
            </div>

            <div className={css.mobile}>
                <div className={css.container}>
                        <div className={css.become_title_con}>
                            <h2 className={css.become_title}>
                                Become a Service Provider on Miventy
                            </h2>
                        </div>
                        <div className={css.content}>
                            <div className={css.flex_col}>
                                <ol>
                                    <li>Showcase your talent.</li>
                                    <li>Grow your business.</li>
                                    <li>Get paid.</li>
                                </ol>

                                <div className={css.browse_cat_con}>
                                    <NamedLink className={css.browse_cat} name="StripePayoutPage">
                                        Post your service
                                    </NamedLink>
                                </div>
                            </div>
                            <div>
                                <img className={css.become_img} src={become2} />
                            </div>

                        </div>
                    </div>
            </div>
        
        </>
       
    )
}

export default Become;