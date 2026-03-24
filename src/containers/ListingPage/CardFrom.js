import React, { useState } from "react";
import css from './CartOptions.module.css';
import { FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { FormattedMessage, useIntl } from '../../util/reactIntl';


const CardForm = props =>{
    const intl = useIntl();
    const {itm,handleAddDurationPriceToCart,imageUrl} = props;
    const [selectedValue, setSelectedValue] = useState("");
    const isSelected = selectedValue !== "";

    console.log(itm, "    mmmmmmmmmmmmmmmmmmmmmmmmm")

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };

    return (
        <>
          <form className={css.flex_col_3}>
                    <RadioGroup
                        aria-labelledby={itm.itemName}
                        name={itm.itemName}
                        value={selectedValue}
                        onChange={handleChange}
                        style={{width:"100%"}}
                        className={css.flex_col}
                    >
                        <div className={css.flex_col_4}>
                            {itm.durationPrice !== undefined && itm.durationPrice.length > 0 && itm.durationPrice[0].price != 0 && itm.durationPrice.map((i,key)=>{
                                    const {price,duration,format,id} = i;
                                    console.log(itm.itemName)
                                    return(
                                            <div className={css.durationPrice_itm}>
                                                <div className={css.flex_row_4}>
                                                    <Radio
                                                        value={JSON.stringify(i)}
                                                        sx={{
                                                                color: "#F56630",
                                                                '&.Mui-checked': {
                                                                color: "#F56630",
                                                                },
                                                            }}
                                                    />
                                                    <div>{duration} {format}</div>
                                                </div>
                                                <div>€{price}</div>
                                            </div>
                                    )

                                })}
                        </div>
                        
                </RadioGroup>
                    
                    
                </form>
                <button onClick={e=>handleAddDurationPriceToCart(e,selectedValue,itm,imageUrl)} className={css.btn_fill_full} disabled={!isSelected}>
                    {intl.formatMessage({ id:'ListingPage.addToCart'})}
                </button>
            </>
    )

}

export default CardForm;