import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import css from './carousel.module.css';
import { ReviewRating } from '.';


const OwlCarouselComp = props =>{
    const {data} = props;
    console.log(data,"  ssssssssssssssssssssssssssssssssss")
        return (
                                    
                <OwlCarousel 
                    className='owl-theme' 
                    loop={true}
                    margin={20} 
                    items={4}
                    autoplay={true}
                    autoplayTimeout={3000}
                    dots={false}
                    nav
                >

                    {data.map((itm,key)=>{
                        return(
                                <div key={`OwlCarouselComp_${key}`} class='item'>
                                    <div className={classNames(css.flex_col,css.item)}>
                                        <p>
                                            List your party decoration services on our platform and reach a 
                                            wide audience of customer looking to make their event stand out.
                                        </p>
                                        
                                        <div className={css.flex_row_center}>
                                            <img src={cust3}/>
                                            <div className={css.flex_col_sub}>
                                                <div>
                                                    <ReviewRating
                                                        rating={parseInt(4)}
                                                        className={css.ratng}
                                                    />
                                                </div>
                                                <div className={"d-flex gap-2 justify-start align-middle"}><span className={css.user_name}>John Smiles</span><span className={css.user_title}>Caterer</span></div>
                                                
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        )
                    })}
                    
                </OwlCarousel>
                                        
        )
}

export default OwlCarouselComp;