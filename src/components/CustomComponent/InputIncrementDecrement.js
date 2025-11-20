import React from "react"
import css from './InputIncrementDecrement.module.css';

const InputIncrementDecrement = props=>{
    const {
        setWorkExperience,
        workExperience
    }=props;

    const increment = e=>{
        if(isNaN(workExperience)){
            setWorkExperience(1);
        }else{
            setWorkExperience(parseInt(workExperience) + 1);
        }
        console.log(workExperience);
    }
    const decrement = e=>{
        if(isNaN(workExperience)){
            setWorkExperience(1);
        }else{
            setWorkExperience(parseInt(workExperience) - 1);
        }
        console.log(workExperience);
    }
    return(
        <div className={css.flex_row_btw_con}>
        
        <input type="number" min={1} onChange={e=>{setWorkExperience(e.target.value)}} name="work_experience" value={workExperience}  placeholder="Add the number of years of experience that you have"  />
            <div className={css.flex_row_start}>
                <span>Years</span>
                {/* <div className={css.controler}>
                    <svg className={css.control} onClick={increment} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-up" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"/>
                    </svg>
                    <svg className={css.control} onClick={decrement} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
                    </svg>
                </div> */}
            </div>
        </div>
    )
}

export default InputIncrementDecrement;