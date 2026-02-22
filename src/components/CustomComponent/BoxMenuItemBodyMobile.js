import classNames from 'classnames';
import React from 'react';
import { useState } from 'react';
import css from './BoxMenuItemBodyMobile.module.css';


import phones from '../../assets/facepainter.jpg';

const BoxMenuItemBodyMobile = props=>{
    const {setShowExpandedSearchBar,isSearchPage,history} = props;
    const [showItems, setShowItems] = useState(false);
    const {itemData} = props;

    const handleMouseOver = e=>{
        setShowItems(true);
    }

    const handleMouseOut = e=>{
        setShowItems(false);
    }

    const handleMouseOutP = e=>{
        if(showItems){
            setShowItems(false);
        }
        
    }

    const handleParentClicked = e =>{
        console.log("Parent clicked");
        //setShowExpandedSearchBar(true);
    }

    const handleSearch = val =>{
            history.push(`/s?keywords=${val}`);
    }

    const handleClick = val =>{
        if(val === "Catering"){
            history.push(`/s?keywords=${val}`);
        }else{
            setShowItems(true);
        }
       
    }

    return (
        <div className={css.flex_col} onClick={handleParentClicked} >
            <button className={classNames(css.menu_btn,itemData.css)}  onClick={e=>{handleClick(itemData.key); e.preventDefault(); e.stopPropagation();}}>
                <span>{itemData.key}</span>
            </button>
            {
                showItems?
                    <div className={css.drd_itm_maincon} onClick={e=>setShowItems(false)}>
                        <div className={css.space} ></div>
                        <div className={css.drd_itm_con}>
                                {

                                    itemData.item.map((itm,key)=>{
                                        return (
                                            <button className={classNames(css.drd_itm)}  onClick={e=>handleSearch(itm.value)}>
                                                <img src={itm.icon} className={css.icon_sm}/>
                                                <span>{itm.key}</span>
                                            </button>
                                        )
                                    })
                                }
                            </div>
                    </div>
                    
                :
                ""
            }
            
        </div>
        
                        
    )
}

export default BoxMenuItemBodyMobile;