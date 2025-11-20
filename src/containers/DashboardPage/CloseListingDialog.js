import React from "react";
import css from './CloseListingDialog.module.css';
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";

const CloseListingDialog = props =>{
    const {handleCloseListing,setShowCloseListingDialog} = props;
    return (

        <div className={css.container}>
            <div className={css.tb_con}>
                <div>
                    <h1 className={css.header}>Are you sure you want to remove this listing?</h1>
                    <p className={css.description}>You can always edit your listings.</p>
                    <div className={css.btn_con}>
                        <button onClick={e=>setShowCloseListingDialog(false)} className={css.outling_btn}>No, Keep Listing</button>
                         <button onClick={handleCloseListing} className={css.normal_btn}>Yes, Remove Listing</button>
                    </div>
                </div>
            </div>
        </div>
          
    )
}

export default CloseListingDialog;