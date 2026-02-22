import React, { useState } from "react";
import css from './WithUs.module.css';
import NamedLink from "../NamedLink/NamedLink";
import become from '../../assets/become/become1.png';
import { animated, useSpring } from '@react-spring/web'
import DropDownList from "./DropdownList";
import { FormattedMessage, useIntl } from '../../util/reactIntl';

const WithUs = props =>{

    const {history} = props;

    // const data = [
    //  {key: "Entertaining",item:["Animation","Magic","Face Paint"]},
    //  {key: "Catering",item:[]},
    //  {key: "BD cake & Sweets",item:["BD Cake","Sweets"]},
    //  {key: "Photo/Video",item:["Photos","Videos"]},
    //  {key: "Music for events",item:["Classical Music","Party music/DJs"]},
    //  {key: "Decoration",item:["Balloon Decorations","Flower arrangements","Themed Decoration"]},
    //  {key: "Rentals",item:["Rental shade and rain equipment","Rental Space","Rental Bouncer"]},
    // ];


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



    // Catering:[],
    //   "BD cake & Sweets":["BD Cake","Sweets"],
    //   "Photo/Video":["Photos","Videos"],
    //   "Music for events":["Classical Music","Party music/DJs"],
    //   Decoration:["Balloon Decorations","Flower arrangements","Themed Decoration"],
    //   Rentals:["Inflatable Rentals","Party Locations"]


    const [springs, api] = useSpring(() => ({
        from: {opacity:0},
      }))
    // const springs = useSpring({
    //     from: { x: 0 },
    //     to: { x: 100 },
    //   })
    
    const[showEntertain, setShowEntertain] = useState(false);
    
    return (
        <>
            <div className={css.main_desktop}>
                <div className={css.container}>
                    <div className={css.become_title_con}>
                        <h2 className={css.become_title}>
                            With us you can book
                        </h2>
                    </div>
                    <div className={css.content}>
                        {data.map((itm,key)=>{
                            return (
                                <DropDownList item={itm.item} title={itm.key} history={history}/>
                            )
                        })}
                    </div>
                </div>
            </div>

            <div className={css.mobile}>
                <div className={css.container}>
                    <div className={css.become_title_con}>
                        <h2 className={css.become_title}>
                            With us you can book
                        </h2>
                    </div>
                    <div className={css.content}>
                        {data.map((itm,key)=>{
                            return (
                                <DropDownList item={itm.item} title={itm.key} history={history}/>
                            )
                        })}
                    </div>
                </div>
            </div>

        </>
        
    )
}

export default WithUs;