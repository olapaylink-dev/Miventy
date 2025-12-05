
import { useState } from 'react';
import css from './SelectComponent.module.css';
const SelectComponent = props=>{
    const {options,value,handleSelectChange} = props;
    const [showOptions,setShowOptions] = useState(false);

    const handleSelect = itemSelected =>{
        setShowOptions(false);
        handleSelectChange(itemSelected);
        //console.log(itemSelected,"   ==============")
    }
    return (
        <div className={css.container} onClick={e=>setShowOptions(true)}>
            {value}
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
export default SelectComponent;