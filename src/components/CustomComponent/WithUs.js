import React, { useState } from "react";
import css from './WithUs.module.css';
import NamedLink from "../NamedLink/NamedLink";
import become from '../../assets/become/become1.png';
import { animated, useSpring } from '@react-spring/web'
import DropDownList from "./DropdownList";

const WithUs = props =>{

    const {history} = props;

    const data = [
     {key: "Entertaining",item:["Animation","Magic","Face Paint"]},
     {key: "Catering",item:[]},
     {key: "BD cake & Sweets",item:["BD Cake","Sweets"]},
     {key: "Photo/Video",item:["Photos","Videos"]},
     {key: "Music for events",item:["Classical Music","Party music/DJs"]},
     {key: "Decoration",item:["Balloon Decorations","Flower arrangements","Themed Decoration"]},
     {key: "Rentals",item:["Rental shade and rain equipment","Rental Space","Rental Bouncer"]},
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