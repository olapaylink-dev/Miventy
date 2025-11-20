import React from "react";
import css from './Why.module.css';

import why1 from '../../assets/why/why1.png';
import why2 from '../../assets/why/why2.png';
import why3 from '../../assets/why/why3.png';
import why4 from '../../assets/why/why4.png';

import star from '../../assets/icons/star.png';
import classNames from "classnames";
import NamedLink from "../NamedLink/NamedLink";


const Why = (props)=>{

    return(
        <>
        <div className={css.main_desktop}>
                    <div className={classNames(css.desktop)}>
                        <div className={css.title_con}>
                            <div className={css.popular_title}>
                                Why Miventy?
                            </div>
                            
                        </div>
                        <div className={css.flex_grids}>

                            <div className={css.items}>
                                <img src={why1}/>
                                
                                <span className={css.title}>Convenience</span>
                                <p>
                                    Find all services in one place with easy filters for location and price, saving you time.
                                </p>
                            </div>
                            <div className={css.items}>
                                <img src={why2}/>
                                <span className={css.title}>Variety for self-planning</span>
                                <p>
                                    Access a wide range of goods and services to independently organize your events without costly agencies.
                                </p>
                            </div>
                            <div className={css.items}>
                                <img src={why3}/>
                                <span className={css.title}>Payment Protection</span>
                                <p>
                                    We hold the payment until you’re satisfied with the service, ensuring that you only pay when you’re happy with what you receive.
                                </p>
                            </div>

                            <div className={css.items}>
                                <img src={why4}/>
                                <span className={css.title}>Trust</span>
                                <p>
                                    Our review system helps you choose reliable service providers confidently.
                                </p>
                            </div>

                        </div>
                        
                    </div>
        </div>

        <div className={css.mobile}>

        <div className={classNames(css.mobile_con)}>
                        <div className={css.title_con}>
                            <div className={css.popular_title}>
                                Why Miventy?
                            </div>
                            
                        </div>
                        <div className={css.flex_grids}>

                            <div className={css.items}>
                                <img src={why1}/>
                                
                                <span className={css.title}>Convenience</span>
                                <p>
                                    Find all services in one place with easy filters for location and price, saving you time.
                                </p>
                            </div>
                            <div className={css.items}>
                                <img src={why2}/>
                                <span className={css.title}>Variety for self-planning</span>
                                <p>
                                    Access a wide range of goods and services to independently organize your events without costly agencies.
                                </p>
                            </div>
                            <div className={css.items}>
                                <img src={why3}/>
                                <span className={css.title}>Payment Protection</span>
                                <p>
                                    We hold the payment until you’re satisfied with the service, ensuring that you only pay when you’re happy with what you receive.
                                </p>
                            </div>

                            <div className={css.items}>
                                <img src={why4}/>
                                <span className={css.title}>Trust</span>
                                <p>
                                    Our review system helps you choose reliable service providers confidently.
                                </p>
                            </div>

                        </div>
                        
                    </div>

        </div>
         
        </>
    );

}

export default Why;