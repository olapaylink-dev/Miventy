import classNames from 'classnames';
import React from 'react';
import { useState } from 'react';
import css from './BoxMenuItem.module.css';


const BoxMenuItem = props=>{
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
        setShowExpandedSearchBar(true);
    }

    const handleSearch = val =>{
         history.push(`/s?keywords=${val}`);
    }

    const handleClick = val =>{
        if(val === "Catering"){
            history.push(`/s?keywords=${val}`);
        }
    }
    return (
        <div className={css.flex_col} onClick={handleParentClicked} onMouseOut={handleMouseOut}>
            <button className={classNames(css.menu_btn,itemData.css)} onMouseOver={handleMouseOver} onClick={e=>handleClick(itemData.key)}>
                <img src={itemData.icon} className={css.icon}/>
                <span>{itemData.key}</span>
            </button>
            {
                showItems?
                    <div className={css.drd_itm_maincon} onMouseOut={handleMouseOut}>
                        <div className={css.space} onMouseOver={handleMouseOver}></div>
                        <div className={css.drd_itm_con}>
                                
                                {
                                    itemData.item.map((itm,key)=>{
                                        return (
                                            <button className={classNames(css.drd_itm)} onMouseOver={handleMouseOver} onClick={e=>handleSearch(itm.key)}>
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

export default BoxMenuItem;