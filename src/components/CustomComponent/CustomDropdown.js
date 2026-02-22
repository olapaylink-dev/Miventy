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
    },[parrentClicked])
    
    return (


        <div className={css.container}>
            
            {show?
                <div className={css.option_con}>
                    <div className={css.flex_row} onClick={e=>{handleLanguageChange("en");setShow(false);setCurr("en")}} >
                        EN
                        <img src={english} className={css.trans_icon} />
                    </div>
                    <div className={css.flex_row} onClick={e=>{handleLanguageChange("es");setShow(false);setCurr("es")}}>
                        
                        ES
                        <img src={spanish} className={css.trans_icon} />
                    </div>
                </div>
                :
                <div className={css.flex_row} onClick={e=>setShow(!show)}>
                    {curr}
                    {curr === "EN"?
                        <img className={css.trans_icon} src={english} />
                        :
                        <img className={css.trans_icon} src={spanish} />
                    }
                </div>
            }
            
            
        </div>
    )
}

export default CustomDropdown;