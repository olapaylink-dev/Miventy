import { useState } from "react";
import css from './SuccessView.module.css';
import classNames from "classnames";

const SuccessView = props=>{
  const {
    setShowSuccessView,
    message,
    setShowFull,
    showFull
  } = props;

  const handleBackToDashboard = e=>{
    console.log("closing");

    setShowSuccessView(false);
    if(setShowFull){
      setShowFull(!showFull);
    }
  }

  return (
                <div className={css.modal_complete_profile_busi}>
                  <div className={classNames(css.flex_col)}>
                    <span className={css.completed_header}>Successful</span>
                    <div className={css.mark_con}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0 60C0 44.087 6.32141 28.8258 17.5736 17.5736C28.8258 6.32141 44.087 0 60 0C75.913 0 91.1742 6.32141 102.426 17.5736C113.679 28.8258 120 44.087 120 60C120 75.913 113.679 91.1742 102.426 102.426C91.1742 113.679 75.913 120 60 120C44.087 120 28.8258 113.679 17.5736 102.426C6.32141 91.1742 0 75.913 0 60ZM56.576 85.68L91.12 42.496L84.88 37.504L55.424 74.312L34.56 56.928L29.44 63.072L56.576 85.68Z" fill="#6DC347"/>
                      </svg>
                    </div>
                     <p className={css.complete_content}>
                     {message}
                    </p>
                    <button className={css.back_btn} onClick={handleBackToDashboard}>Continue</button>
                  </div>
                 
                </div>
                
  )
}

export default SuccessView;