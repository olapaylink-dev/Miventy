import React, { useState } from "react";
import css from './ProgressTopbar.module.css';
import classNames from "classnames";
import { FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";

const ProgressTopbar = props=>{

    const {step,percentage} = props;
    return (
        <div className={css.container}>
            <h1 className={css.header}>{intl.formatMessage({ id: 'Dashboard.craeteYourListing' })}</h1>
            <div className={css.main_slider_con}>
                <span>{step}</span>
                <div className={css.slider_con}>
                <div className={css.slide} style={{width:`${percentage}`}}></div>
                </div>
                <div className={css.percent_con}>
                <span className={css.percent}>{percentage}</span>
                </div>
            </div>
           
        </div>
    )

}
export default ProgressTopbar;