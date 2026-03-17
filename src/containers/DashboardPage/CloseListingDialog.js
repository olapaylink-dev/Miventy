import React from "react";
import css from './CloseListingDialog.module.css';
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { FormattedMessage, useIntl } from '../../util/reactIntl';

const CloseListingDialog = props =>{
    const intl = useIntl();
    const {handleCloseListing,setShowCloseListingDialog} = props;
    return (

        <div className={css.container}>
            <div className={css.tb_con}>
                <div>
                    <h1 className={css.header}>{intl.formatMessage({ id: 'Dashboard.areYouSure' })}</h1>
                    <p className={css.description}>{intl.formatMessage({ id: 'Dashboard.youCanAlways' })}</p>
                    <div className={css.btn_con}>
                        <button onClick={e=>setShowCloseListingDialog(false)} className={css.outling_btn}>{intl.formatMessage({ id: 'Dashboard.noKeep' })}</button>
                         <button onClick={handleCloseListing} className={css.normal_btn}>{intl.formatMessage({ id: 'Dashboard.yesRemove' })}</button>
                    </div>
                </div>
            </div>
        </div>
          
    )
}

export default CloseListingDialog;