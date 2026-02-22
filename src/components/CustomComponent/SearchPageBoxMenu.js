import React from "react";

import css from './SearchPageBoxMenu.module.css';

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
import rain from '../../assets/icons/rainn.png';
import space from '../../assets/icons/space.png';
import BoxMenuItemBodyMobile from "./BoxMenuItemBodyMobile";
import { FormattedMessage } from '../../util/reactIntl';

const SearchPageBoxMenu = props =>{

    const {setShowTopBoxMenu,isSearchPage,history,setShowExpandedSearchBar} = props;
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
                {key:<FormattedMessage id="LandingPage.animation" />,value:"Animation"},
                {key:<FormattedMessage id="LandingPage.magic" />,value:"Magic"},
                {key:<FormattedMessage id="LandingPage.facePaint" />,value:"Face Paint"}
            ],css:css.menu1},
        {key: <FormattedMessage id="LandingPage.catering" />,item:[],value:"Catering"},
        {key: <FormattedMessage id="LandingPage.bdCakesAndSweets" />,
            item:[
                {key:<FormattedMessage id="LandingPage.bdCake" />,value:"BD Cake"},
                {key:<FormattedMessage id="LandingPage.sweets" />,value:"Sweets"},
            ],css:css.menu3},
        {key: <FormattedMessage id="LandingPage.photoVideo" />,
            item:[
                {key:<FormattedMessage id="LandingPage.photos" />,value:"Photos"},
                {key:<FormattedMessage id="LandingPage.videos" />,value:"Videos"},
            ],css:css.menu4},
        {key: <FormattedMessage id="LandingPage.musicEvents" />,
            item:[
                {key:<FormattedMessage id="LandingPage.classicMusic" />,value:"Classical Music"},
                {key:<FormattedMessage id="LandingPage.partyMusic" />,value:"Party music/DJs"},
            ],css:css.menu5},
        {key: <FormattedMessage id="LandingPage.decoration" />,
            item:[
                {key:<FormattedMessage id="LandingPage.balloonDecorations" />,value:"Balloon Decorations"},
                {key:<FormattedMessage id="LandingPage.flowerArragement" />,value:"Flower arrangements"},
                {key:<FormattedMessage id="LandingPage.themedDecoration" />,value:"Themed Decoration"},
            ],css:css.menu6},
        {key: <FormattedMessage id="LandingPage.rentals" />,
                            item:[
                                {key:<FormattedMessage id="LandingPage.rentalsShadeAndRain" />,value:"Rental shade and rain equipment"},
                                {key:<FormattedMessage id="LandingPage.rentalSpace" />,value:"Rental Space"},
                                {key:<FormattedMessage id="LandingPage.rentalBouncer" />,value:"Rental Bouncer"},
                            ],css:css.menu7},
       ];


    return(
        <>
            <div className={css.main_desktop}>
                <div className={css.sub_menu}>
                    {data.map((itm,key)=>{
                        return (
                            <BoxMenuItemBodyMobile itemData={itm} isSearchPage={isSearchPage} history={history} setShowExpandedSearchBar={setShowExpandedSearchBar}/>
                        )
                    })}
                </div>
            </div>
            <div className={css.mobile}>
                <div className={css.flex_row_hidden}>
                    <div className={css.sub_menu}>
                        {data.map((itm,key)=>{
                            return (
                                <BoxMenuItemBodyMobile key={"itemBobyMobile"+key} itemData={itm} isSearchPage={isSearchPage} history={history} setShowExpandedSearchBar={setShowExpandedSearchBar}/>
                            )
                        })}
                    </div>
                </div>
                
            </div>
        
        </>
           
           
    )
}

export default SearchPageBoxMenu;