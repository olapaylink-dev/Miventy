import React, { useState } from "react";
import css from './Categories.module.css';

import phones from '../../assets/facepainter.jpg';
import Slideshow from "./SlideShow";
import client_icon from '../../assets/icons/client.png';
import provider_icon from '../../assets/icons/provider.png';
import chevronUp from '../../assets/icons/chevron-up.png';
import classNames from "classnames";
import NamedLink from "../NamedLink/NamedLink";

const Categories = (props)=>{

    const [showClient, setShowClient] = useState(false);
    const [showService, setShowService] = useState(false);

    const handleShowClient = e =>{
        setShowClient(!showClient);
    }

    const handleShowService = e =>{
        setShowService(!showService);
    }


    return (
        <>
            

            <div className={css.desktop}>
                <div className={css.category}>
                    <div className={css.cate_itm_1}>
                        <div className={classNames(css.flex_row)} onClick={handleShowClient}>
                            <div className={css.flex_row}>
                                <img src={client_icon}/>
                                <span>I am a client</span>
                            </div>
                            
                            <img src={chevronUp}/>
                        </div>
                        {showClient?
                            <>
                                <p className={css.pad_1}>
                                    Explore our wide range of party planning services to make 
                                    your event truly unforgettable. From decorations to catering, we've got you covered.
                                </p>
                                <div className={css.browse_cat_con}>
                                    <NamedLink className={css.browse_cat} name="SearchPage">
                                        Browse Category
                                    </NamedLink>
                                </div>
                            </>
                        :""}
                       
                    </div>

                    <div className={css.cate_itm_2}>
                        <div className={classNames(css.flex_row)} onClick={handleShowService}>
                            <div className={css.flex_row}>
                                <img src={provider_icon}/>
                                <span>I am a service provider</span>
                            </div>
                            
                            <img src={chevronUp}/>
                        </div>
                        {showService?
                            <>
                                <p className={css.pad_1}>
                                    List your party decoration services on our platform and reach a 
                                    wide audience of customer looking to make their event stand out.
                                </p>
                                <div className={css.browse_cat_con}>
                                    <NamedLink className={css.browse_cat} name="StripePayoutPage">
                                        Post your service
                                    </NamedLink>
                                </div>
                            </>
                        
                        :""}
                        
                    </div>

                </div>
            </div>

            <div className={css.mobile}>
            <div className={css.category_mobile}>
                    <div className={css.cate_itm_1}>
                        <div className={classNames(css.flex_row,css.pad_1)} onClick={handleShowClient}>
                            <div className={css.flex_row}>
                                <img className={css.resize} src={client_icon}/>
                                <span>I am a client</span>
                            </div>
                            
                            <img src={chevronUp}/>
                        </div>
                        {showClient?
                            <>
                                <p>
                                    Explore our wide range of party planning services to make 
                                    your event truly unforgettable. From decorations to catering, we've got you covered.
                                </p>
                                <div className={css.browse_cat_con}>
                                    <NamedLink className={css.browse_cat} name="SearchPage">
                                        Browse Category
                                    </NamedLink>
                                </div>
                            </>
                        :""}
                       
                    </div>

                    <div className={css.cate_itm_2}>
                        <div className={classNames(css.flex_row,css.pad_1)} onClick={handleShowService}>
                            <div className={css.flex_row}>
                                <img className={css.resize} src={provider_icon}/>
                                <span>I am a service provider</span>
                            </div>
                            
                            <img src={chevronUp}/>
                        </div>
                        {showService?
                            <>
                                <p>
                                    List your party decoration services on our platform and reach a 
                                    wide audience of customer looking to make their event stand out.
                                </p>
                                <div className={css.browse_cat_con}>
                                    <NamedLink className={css.browse_cat} name="StripePayoutPage">
                                        Post your service
                                    </NamedLink>
                                </div>
                            </>
                        
                        :""}
                        
                    </div>

                </div>
            </div>

        </>
    )

}

export default Categories;