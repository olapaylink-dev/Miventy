import React, { useState } from "react";
import css from './Incrementer.module.css';


const Incrementer = props =>{
    const {setQuantity} = props;
    const [quantityVal,setQuantityVal] = useState(0);


const handleDecrement = (event) => {
      let q = parseInt(quantityVal);
      let value = 0;
      if(q > 1){
        value = q - 1;
        setQuantityVal(value);
        setQuantity(value);
      }
    };

  const handleIncrement = (event) => {
      let q = parseInt(quantityVal);
      let value = q + 1;
      setQuantityVal(value);
      setQuantity(value);
    };


    return (
            <div className={css.flex_row_btw_input}>
                <span className={css.label_1}>Quantity</span>

                <div className={css.count_con}>
                    <div onClick={handleDecrement} className={css.btn_con}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M4 11C3.44772 11 3 11.4477 3 12C3 12.5523 3.44772 13 4 13H20C20.5523 13 21 12.5523 21 12C21 11.4477 20.5523 11 20 11H4Z" fill="#667185"/>
                        </svg>
                    </div>
                    <span className={css.count} id="count">{quantityVal}</span>
                    <div onClick={handleIncrement} className={css.btn_con}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M13 4C13 3.44772 12.5523 3 12 3C11.4477 3 11 3.44772 11 4V11H4C3.44772 11 3 11.4477 3 12C3 12.5523 3.44772 13 4 13H11V20C11 20.5523 11.4477 21 12 21C12.5523 21 13 20.5523 13 20V13H20C20.5523 13 21 12.5523 21 12C21 11.4477 20.5523 11 20 11H13V4Z" fill="#667185"/>
                        </svg>
                    </div>
                </div>
                
            </div>
    )
}
export default Incrementer;