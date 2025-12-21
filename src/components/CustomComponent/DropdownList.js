import React, { useState } from "react";
import css from './DropDownList.module.css';
import NamedLink from "../NamedLink/NamedLink";
import classNames from "classnames";

const DropDownList = (props)=>{
   
    const {item,title,history} = props;
    const[showEntertain, setShowEntertain] = useState(false);
    const[isActive, setIsActive] = useState(false);

    const handleShowEntertain = (title)=>{
        if(title === "Catering"){
            history.push(`/s?keywords=${title}`);
        }
        setShowEntertain(!showEntertain);
        setTimeout(() => {
            setIsActive(!isActive);
          }, 100);
        
    };



    const animate = {
        opacity: 1,
        transition: '0.5s',
     }

    const handleClick = val =>{
        history.push(`/s?keywords=${val}`);
    }
    
    return (
            <div className={css.entertain_con}>
                <div className={css.flex_row}>
                    <span className={css.header}>{title}</span>
                    <button className={css.entertain} onClick={e=>handleShowEntertain(title)}>
                        {showEntertain?
                            <span className={css.entertain}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                                </svg>
                            </span>
                        :
                            <span className={css.entertain}>
                                <svg  xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-dash" viewBox="0 0 16 16">
                                    <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8"/>
                                </svg>
                            </span>
                        }
                    </button>
                </div>
                
                {showEntertain?
                   <div
                        className={classNames(isActive?css.animate:css.no_animate)}
                    >
                        {item.map((itm,key)=>{
                            return(
                                <button className={css.btn} onClick={e=>handleClick(itm)}>
                                    {itm}
                                </button>
                            )
                        })}
                    </div>:""
            
                }
             
            </div>
        )
}

export default DropDownList;