import React from "react";

import css from './BoxMenuTopbar.module.css';
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

import gear from '../../assets/gear.png';
import bgImg from '../../assets/hero_bg.PNG';
import classNames from "classnames";
import SlideshowDesk from "./SlideShowDesk";
//import { useInView } from "@react-spring/web";
import { useInView } from "react-intersection-observer";
import BoxMenuItem from "./BoxMenuItem";

const BoxMenuTopbar = props =>{
    const {setShowExpandedSearchBar,isSearchPage,history}=props;
     const data = [
            {key: "Entertaining",
                item:[
                    {key:"Animation",icon:icon1sm},
                    {key:"Magic",icon:icon2sm},
                    {key:"Face Paint",icon:icon3sm}
                ],css:css.menu1,icon:icon1},
            {key: "Catering",item:[],css:css.menu2,icon:icon2},
            {key: "BD cake & Sweets",
                item:[
                    {key:"BD Cake",icon:icon4sm},
                    {key:"Sweets",icon:icon5sm},
                ],css:css.menu3,icon:icon3},
            {key: "Photo/Video",
                item:[
                    {key:"Photos",icon:icon6sm},
                    {key:"Videos",icon:icon7sm},
                ],css:css.menu4,icon:icon4},
            {key: "Music for events",
                item:[
                    {key:"Classical Music",icon:icon8sm},
                    {key:"Party music/DJs",icon:icon9sm},
                ],css:css.menu5,icon:icon5},
            {key: "Decoration",
                item:[
                    {key:"Balloon Decorations",icon:icon10sm},
                    {key:"Flower arrangements",icon:icon11sm},
                    {key:"Themed Decoration",icon:icon12sm},
                ],css:css.menu6,icon:icon6},
            {key: "Rentals",
                                item:[
                                    {key:"Rental shade and rain equipment",icon:rain},
                                    {key:"Rental Space",icon:space},
                                    {key:"Rental Bouncer",icon:icon6},
                                ],css:css.menu7,icon:icon7},
           ];
    

    return(
        <>
            <div className={css.main_desktop}>
                <div className={css.sub_menu_topbar}>
                {data.map((itm,key)=>{
                        return (
                            <BoxMenuItem key={"BoxMenuItem"+key} itemData={itm} setShowExpandedSearchBar={setShowExpandedSearchBar} isSearchPage={isSearchPage} history={history}/>
                        )
                    })}
                </div>
            </div>
           
            

        </>
            
    )
}

export default BoxMenuTopbar;