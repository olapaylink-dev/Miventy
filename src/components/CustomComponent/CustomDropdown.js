import { useEffect, useState } from "react"
import css from './CustomDropdown.module.css';
import english from '../../assets/icons/english.png';
import spanish from '../../assets/icons/spanish.png';

const CustomDropdown = props =>{
    const {handleLanguageChange,curr,setCurr,parrentClicked} = props;
    const [show,setShow] = useState(false);

    useEffect(()=>{
        if(parrentClicked){
            setShow(false);
        }
        console.log("Parent cklicccc")
    },[parrentClicked])
    
    return (


        <div className={css.container}>
            
            {show?
                <div className={css.option_con}>
                    <div className={css.flex_row} onClick={e=>{handleLanguageChange("en");setShow(false);setCurr("en")}} >
                        EN
                        <img src={english} className={css.resize} />
                    </div>
                    <div className={css.flex_row} onClick={e=>{handleLanguageChange("es");setShow(false);setCurr("es")}}>
                        
                        ES
                        <img src={spanish} className={css.resize} />
                    </div>
                </div>
                :
                <div onClick={e=>setShow(!show)}>{curr}</div>
            }
            
            
        </div>
    )
}

export default CustomDropdown;