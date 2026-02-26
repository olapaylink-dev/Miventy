import React from "react";
import css from './Popular.module.css';


import popular1 from '../../assets/popular/popular1.png';
import popular2 from '../../assets/popular/popular2.png';
import popular3 from '../../assets/popular/popular3.png';
import popular4 from '../../assets/popular/popular4.png';
import popular5 from '../../assets/popular/popular5.png';
import popular6 from '../../assets/popular/popular6.png';
import popular7 from '../../assets/popular/popular7.png';
import popular8 from '../../assets/popular/popular8.png';
import star from '../../assets/icons/star.png';
import classNames from "classnames";
import NamedLink from "../NamedLink/NamedLink";
import { FormattedMessage, useIntl } from '../../util/reactIntl';

const Popular = (props)=>{

    const {history} = props;
    const handleClick = word =>{
        history.push(`/s?keywords=${word}`);
    }

    return (
        <>
        <div className={css.main_desktop}>
                    <div className={classNames(css.desktop)}>
                        <div className={css.title_con}>
                            <div className={css.popular_title}>
                                <FormattedMessage id="LandingPage.mostPopularInArea" />
                            </div>
                            <p className={css.title_p}>
                                <FormattedMessage id="LandingPage.discoverTheMost" />
                            </p>
                        </div>
                        <div className={css.flex_grids}>

                            <div onClick={e=>{handleClick("Animations")}}>
                                <div className={css.items}>
                                <div className={css.img_con}>
                                    <img className={css.zoom} src={popular1}/>
                                </div>
                                
                                <div className={css.flex_row}>
                                    <span className={css.title}><FormattedMessage id="LandingPage.animators" /></span>
                                    <img src={star}/>
                                </div>
                            </div>
                            </div>
                             <div onClick={e=>{handleClick("Cakes")}}>
                                <div className={css.items}>
                                <div className={css.img_con}>
                                    <img className={css.zoom} src={popular2}/>
                                </div>
                                
                                <div className={css.flex_row}>
                                    <span className={css.title}><FormattedMessage id="LandingPage.cakes" /></span>
                                    <img src={star}/>
                                </div>
                            </div>
                            </div>
                             <div onClick={e=>{handleClick("Catering")}}>
                                 <div className={css.items}>
                                <div className={css.img_con}>
                                    <img className={css.zoom} src={popular3}/>
                                </div>
                                <div className={css.flex_row}>
                                    <span className={css.title}><FormattedMessage id="LandingPage.catering" /></span>
                                    <img src={star}/>
                                </div>
                            </div>
                            </div>
                             <div onClick={e=>{handleClick("Photographer")}}>
                                <div className={css.items}>
                                <div className={css.img_con}>
                                    <img className={css.zoom} src={popular4}/>
                                </div>
                                <div className={css.flex_row}>
                                    <span className={css.title}><FormattedMessage id="LandingPage.photographer" /></span>
                                    <img src={star}/>
                                </div>
                            </div>
                            </div>
                             <div onClick={e=>{handleClick("Balloon decoration")}}>
                                 <div className={css.items}>
                                <div className={css.img_con}>
                                    <img className={css.zoom} src={popular5}/>
                                </div>
                                <div className={css.flex_row}>
                                    <span className={css.title}><FormattedMessage id="LandingPage.balloonDecorations" /></span>
                                    <img src={star}/>
                                </div>
                            </div>
                            </div>
                             <div onClick={e=>{handleClick("Themed decoration")}}>
                                 <div className={css.items}>
                                <div className={css.img_con}>
                                    <img className={css.zoom} src={popular6}/>
                                </div>
                                <div className={css.flex_row}>
                                    <span className={css.title}><FormattedMessage id="LandingPage.themedDecoration" /></span>
                                    <img src={star}/>
                                </div>
                            </div>
                            </div>
                            <div onClick={e=>{handleClick("Rental shade")}}>
                                <div className={css.items}>
                                    <div className={css.img_con}>
                                        <img className={css.zoom} src={popular7}/>
                                    </div>
                                    <div className={css.flex_row}>
                                        <span className={css.title}><FormattedMessage id="LandingPage.rentalsShadeAndRain" /></span>
                                        <img src={star}/>
                                    </div>
                                </div>
                            </div>
                            <div onClick={e=>{handleClick("Rental space")}}>
                                <div className={css.items}>
                                    <div className={css.img_con}>
                                        <img className={css.zoom} src={popular8}/>
                                    </div>
                                    <div className={css.flex_row}>
                                        <span className={css.title}><FormattedMessage id="LandingPage.rentalSpace" /></span>
                                        <img src={star}/>
                                    </div>
                                </div>
                            </div>
                           
                        </div>
                        <div className={css.browse_cat_con}>
                            <NamedLink className={css.browse_cat} name="SearchPage">
                                <FormattedMessage id="LandingPage.browseCategory" />
                            </NamedLink>
                        </div>
                        
                    </div>
        </div>
            
            <div className={css.mobile}>
            <div className={classNames(css.mobile_con)}>
                        <div className={classNames(css.title_con,css.mag_top)}>
                            <div className={classNames(css.popular_title)}>
                                <FormattedMessage id="LandingPage.mostPopularInArea" />
                            </div>
                            <p className={css.title_p}>
                                <FormattedMessage id="LandingPage.discoverTheMost" />
                            </p>
                        </div>
                        <div className={css.flex_grids}>

                            <div>
                        <div className={css.items}>
                                <div className={css.img_con}>
                                    <img className={css.zoom} src={popular1}/>
                                </div>
                                
                                <div className={css.flex_row}>
                                    <span className={css.title}><FormattedMessage id="LandingPage.animators" /></span>
                                    <img src={star}/>
                                </div>
                            </div>
                            </div>
                            <div>
                        <div className={css.items}>
                                <div className={css.img_con}>
                                    <img className={css.zoom} src={popular2}/>
                                </div>
                                
                                <div className={css.flex_row}>
                                    <span className={css.title}><FormattedMessage id="LandingPage.cakes" /></span>
                                    <img src={star}/>
                                </div>
                            </div>
                            </div>
                            <div>
                            <div className={css.items}>
                                <div className={css.img_con}>
                                    <img className={css.zoom} src={popular3}/>
                                </div>
                                <div className={css.flex_row}>
                                    <span className={css.title}><FormattedMessage id="LandingPage.catering" /></span>
                                    <img src={star}/>
                                </div>
                            </div>
                            </div>
                            <div>
                            <div className={css.items}>
                                <div className={css.img_con}>
                                    <img className={css.zoom} src={popular4}/>
                                </div>
                                <div className={css.flex_row}>
                                    <span className={css.title}><FormattedMessage id="LandingPage.photographer" /></span>
                                    <img src={star}/>
                                </div>
                            </div>
                            </div>
                            <div>
                            <div className={css.items}>
                                <div className={css.img_con}>
                                    <img className={css.zoom} src={popular5}/>
                                </div>
                                <div className={css.flex_row}>
                                    <span className={css.title}><FormattedMessage id="LandingPage.balloonDecorations" /></span>
                                    <img src={star}/>
                                </div>
                            </div>
                            </div>
                            <div>
                            <div className={css.items}>
                                <div className={css.img_con}>
                                    <img className={css.zoom} src={popular6}/>
                                </div>
                                <div className={css.flex_row}>
                                    <span className={css.title}><FormattedMessage id="LandingPage.themedDecoration" /></span>
                                    <img src={star}/>
                                </div>
                            </div>
                            </div>
                            <div>
                                <div className={css.items}>
                                    <div className={css.img_con}>
                                        <img className={css.zoom} src={popular7}/>
                                    </div>
                                    <div className={css.flex_row}>
                                        <span className={css.title}><FormattedMessage id="LandingPage.rentalsShadeAndRain" /></span>
                                        <img src={star}/>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className={css.items}>
                                    <div className={css.img_con}>
                                        <img className={css.zoom} src={popular8}/>
                                    </div>
                                    <div className={css.flex_row}>
                                        <span className={css.title}><FormattedMessage id="LandingPage.rentalSpace" /></span>
                                        <img src={star}/>
                                    </div>
                                </div>
                            </div>
                           

                        </div>
                        <div className={css.browse_cat_con}>
                            <NamedLink className={css.browse_cat} name="SearchPage">
                                <FormattedMessage id="LandingPage.browseCategory" />
                            </NamedLink>
                        </div>
                        
                    </div>
            </div>


        </>
    )

}

export default Popular;