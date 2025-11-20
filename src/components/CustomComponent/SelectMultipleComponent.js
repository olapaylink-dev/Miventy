
import { useState } from 'react';
import css from './SelectMultipleComponent.module.css';
import classNames from 'classnames';
const SelectMultipleComponent = props=>{
    const {options,value=[],handleSelectChange,showOptions,setShowOptions} = props;
    const [optionss,setOptions] = useState(options);

    const handleSelect = itemSelected =>{
        setShowOptions(false);
        let exist = [];
        if(typeof(value) === "string"){
            let data = [];
            exist.push(value);
            if(value !== itemSelected){
                data = [value,itemSelected];
            }else{
                data = [];
            }
            handleSelectChange(data);
        }else{
            exist = value.filter(itm=>itm === itemSelected);
            const rem = value.filter(itm=>itm !== itemSelected);
            let data = [];
            if(exist.length > 0){
                data = [...rem];
            }else{
                data = [...rem,itemSelected];
            }
            handleSelectChange(data);
        }  
        setShowOptions(false);
    }

    const handleRemove = (e,val) =>{
        e.preventDefault();
        e.stopPropagation();
        const rem = value.filter(itm=>itm !== val);
        const   data = [...rem];
        handleSelectChange(data);
        setShowOptions(false);
    }

    return (
        <div className={css.container} onClick={e=>{setShowOptions(true); e.preventDefault(); e.stopPropagation()}}>
            {value !== undefined && value.length > 0 && typeof(value) !== "string"?
                <div className={css.location_selected_2} >
                    {value !== undefined && value.map((itm,k)=>{
                        return (
                            <div className={css.loca_con}>
                                <svg onClick={e=>handleRemove(e,itm)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className={classNames(css.remove,"bi bi-x-circle")} viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                                </svg>
                                <span>{itm}</span>
                            </div>
                        )
                    })}
                </div>
            :
                <input className={css.no_border} type='text' placeholder='Select languages from the dropdown list'/>
            }
            
            {showOptions?
                <div className={css.options_con}>
                    {options.map((itm,key)=>{
                        return(
                            <div key={`options_${key+1}`} className={css.option_item} onClick={e=>{handleSelect(itm); e.preventDefault(); e.stopPropagation()}}>{itm}</div>
                        )
                    })}
                </div>
            :""}
        </div>
    )
}
export default SelectMultipleComponent;