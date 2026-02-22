import React from "react";

import css from './BoxMenu.module.css';

import phones from '../../assets/facepainter.jpg';
import Slideshow from "./SlideShow";
import icon1 from '../../assets/icons/icon1.png';
import icon2 from '../../assets/icons/icon2.png';
import icon3 from '../../assets/icons/icon3.png';
import icon4 from '../../assets/icons/icon4.png';
import icon5 from '../../assets/icons/icon5.png';
import icon6 from '../../assets/icons/icon6.png';
import icon7 from '../../assets/icons/icon7.png';

import icon1sm from '../../assets/icons/icon1.png';
import icon2sm from '../../assets/icons/icon2.png';
import icon3sm from '../../assets/icons/icon3.png';
import icon4sm from '../../assets/icons/icon4.png';
import icon5sm from '../../assets/icons/icon5.png';
import icon6sm from '../../assets/icons/icon6.png';
import icon7sm from '../../assets/icons/icon7.png';
import icon8sm from '../../assets/icons/icon1.png';
import icon9sm from '../../assets/icons/icon2.png';
import icon10sm from '../../assets/icons/icon3.png';
import icon11sm from '../../assets/icons/icon4.png';
import icon12sm from '../../assets/icons/icon5.png';
import icon13sm from '../../assets/icons/icon6.png';
import icon14sm from '../../assets/icons/icon7.png';
import rain from '../../assets/icons/rainn.png';
import space from '../../assets/icons/space.png';
import { FormattedMessage, useIntl } from '../../util/reactIntl';


import gear from '../../assets/gear.png';
import bgImg from '../../assets/hero_bg.PNG';
import classNames from "classnames";
import SlideshowDesk from "./SlideShowDesk";
//import { useInView } from "@react-spring/web";
import { useInView } from "react-intersection-observer";
import BoxMenuItem from "./BoxMenuItem";
import BoxMenuItemBodyMobile from "./BoxMenuItemBodyMobile";

const BoxMenu = props =>{

    const {setShowTopBoxMenu,history,setShowExpandedSearchBar} = props;
    // const { ref, inView, entry } = useInView({
    //     /* Optional options */
    //     threshold: 0,
    // });

    // if(inView){
    //     console.log("In view");
    //     setShowTopBoxMenu(false);
        
    // }else{
    //     console.log("Not view");
    //     setShowTopBoxMenu(true);
    
    // }


    const data = [
        {key: <FormattedMessage id="LandingPage.entertaining" />,
            item:[
                {key:<FormattedMessage id="LandingPage.animation" />,icon:icon1sm},
                {key:<FormattedMessage id="LandingPage.magic" />,icon:icon2sm},
                {key:<FormattedMessage id="LandingPage.facePaint" />,icon:icon3sm}
            ],css:css.menu1,icon:icon1},
        {key: <FormattedMessage id="LandingPage.catering" />,item:[],css:css.menu2,icon:icon2},
        {key: <FormattedMessage id="LandingPage.bdCakesAndSweets" />,
            item:[
                {key:<FormattedMessage id="LandingPage.bdCake" />,icon:icon4sm},
                {key:<FormattedMessage id="LandingPage.sweets" />,icon:icon5sm},
            ],css:css.menu3,icon:icon3},
        {key: <FormattedMessage id="LandingPage.photoVideo" />,
            item:[
                {key:<FormattedMessage id="LandingPage.photos" />,icon:icon6sm},
                {key:<FormattedMessage id="LandingPage.videos" />,icon:icon7sm},
            ],css:css.menu4,icon:icon4},
        {key: <FormattedMessage id="LandingPage.musicEvents" />,
            item:[
                {key:<FormattedMessage id="LandingPage.classicMusic" />,icon:icon8sm},
                {key:<FormattedMessage id="LandingPage.partyMusic" />,icon:icon9sm},
            ],css:css.menu5,icon:icon5},
        {key: <FormattedMessage id="LandingPage.decoration" />,
            item:[
                {key:<FormattedMessage id="LandingPage.balloonDecorations" />,icon:icon10sm},
                {key:<FormattedMessage id="LandingPage.flowerArragement" />,icon:icon11sm},
                {key:<FormattedMessage id="LandingPage.themedDecoration" />,icon:icon12sm},
            ],css:css.menu6,icon:icon6},
        {key: <FormattedMessage id="LandingPage.rentals" />,
                            item:[
                                {key:<FormattedMessage id="LandingPage.rentalsShadeAndRain" />,icon:rain},
                                {key:<FormattedMessage id="LandingPage.rentalSpace" />,icon:space},
                                {key:<FormattedMessage id="LandingPage.rentalBouncer" />,icon:icon6},
                            ],css:css.menu7,icon:icon7},
       ];

       

    return(
        <>
            <div className={css.main_desktop}>
                <div className={css.sub_menu}>
                    {data.map((itm,key)=>{
                        return (
                            <BoxMenuItem itemData={itm} history={history} setShowExpandedSearchBar={setShowExpandedSearchBar} />
                        )
                    })}
                </div>
            </div>
            <div className={css.mobile}>
                <div className={css.flex_row_hidden}>
                    <div className={css.sub_menu}>
                        {data.map((itm,key)=>{
                            return (
                                <BoxMenuItemBodyMobile itemData={itm} history={history} setShowExpandedSearchBar={setShowExpandedSearchBar}/>
                            )
                        })}
                    </div>
                </div>
                
            </div>
        
        </>
           
           
    )
}

export default BoxMenu;