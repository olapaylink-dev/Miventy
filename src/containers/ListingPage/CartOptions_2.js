import React from "react";
import css from './CartOptions.module.css';
import cart from '../../assets/cart1.png';
import search_icon1 from '../../assets/Search/search_icon1.png';
import search_star from '../../assets/Search/search_star1.png';
import classNames from "classnames";
import CardForm from "./CardFrom";

const CartOptions_2 = props =>{

    const {cartData,handleAddDurationPriceToCart} = props;

    return (
        <div className={css.flex_grid}>
            {cartData.map((itm,key)=>{
                const img = itm.hasOwnProperty("catalogImages") && itm.catalogImages[0]?.imgUrl;
                const desc = itm.description;
                const price = itm.ItemPrice;
                const minQuantity = itm.minQuantity;

                        if(itm.hasOwnProperty("durationPrice") && itm.durationPrice.length > 0 && itm.durationPrice[0].price !== undefined){
                            return(
                                    <div className={css.card_container}>
                                        <div className={css.flex_col_2}>
                                            <div className={css.img_con_2}>
                                                <img className={css.resize_2} src={img}/>
                                            </div>
                                            <div>
                                                <span className={css.short_txt}>{itm.itemName}</span>
                                            </div>
                                            <div>
                                                <p>{itm.description}</p>
                                            </div>
                                            <CardForm itm={itm} handleAddDurationPriceToCart={handleAddDurationPriceToCart} />
                                        </div>
                                    </div>
                                )
                    }else{
                        return(
                            
                                    <div className={css.card_container}>
                                        <div className={css.flex_row}>
                                            <img className={css.resize} src={img}/>
                                            <div className={css.flex_col}>
                                                <h4 className={css.short_txt}>{desc}</h4>
                                                <p>€ {price}</p>
                                                <p>Min qty: {minQuantity}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                    }



            })}
        </div>
    )
}
export default CartOptions_2;