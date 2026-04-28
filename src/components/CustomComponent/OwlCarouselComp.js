import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import css from './Gallery.module.css';
import TestimonyCard from './TestimonyCard';


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
                            <TestimonyCard data={itm}/>
                        )
                    })}
                    
                </OwlCarousel>
                                        
        )
}

export default OwlCarouselComp;