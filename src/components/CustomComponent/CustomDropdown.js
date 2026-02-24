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


        <>
                <div className={css.container}>

                <div className={css.flex_row_2} onClick={e=>setShow(!show)}>
                        {curr}
                        {curr === "EN"?
                            <img className={css.trans_icon} src={english} />
                            :
                            <img className={css.trans_icon} src={spanish} />
                        }
                </div>
                
                
                
                
            </div>
            {show?
                    <div className={css.option_con}>
                        <div className={css.flex_row} onClick={e=>{handleLanguageChange("en");setShow(false);setCurr("en")}} >
                            <img src={english} className={css.trans_icon} />
                            English
                        </div>
                        <div className={css.flex_row} onClick={e=>{handleLanguageChange("es");setShow(false);setCurr("es")}}>
                            <img src={spanish} className={css.trans_icon} />
                            Spanish
                        </div>
                    </div>
                    :
                    ""
                }
        </>


        
    )
}

export default CustomDropdown;