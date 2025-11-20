import React, { useEffect, useRef, useState } from "react";
import f1 from '../../assets/images/list1.png';
import css from './Carousel.module.css';
import classNames from "classnames";


const colors = ["#0088FE", "#00C49F", "#FFBB28"];
const images = [f1, f1, f1];
const delay = 250000;

const Carousel =(props) =>{

    const {data} = props;

  
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);

  const getImageUrlArr = (data)=>{
    let res = [];
    data !== undefined && data !== null && data.length > 0 && data.map((itm,key)=>{
      res.push(itm.imgUrl);
    })
    return res;
  }

  const slideImages = getImageUrlArr(data);

  const resetTimeout = ()=> {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setIndex((prevIndex) =>
          prevIndex === colors.length - 1 ? 0 : prevIndex + 1
        ),
      delay
    );
    return () => {resetTimeout();};
  }, [index]);

  return (
          <>    
          <div className={css.slideMainCon}>
           
            <div className={css.slideShowCon}>
                        <div className={css.slideshow}>
                            <div className={css.slideshowSlider} style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}>
                                {slideImages.map((img, index) => (
                                <div
                                    className={css.slide}
                                    key={index}
                                    
                                >
                                    <img className={css.imgs} src={slideImages[index]}/>
                                </div>
                                ))}
                            </div>
                        </div>
                       
                    </div>
                    <div className={css.slideImageBtnsCon}>
                      {slideImages.map((_, idx) => {

                          let classess = "";
                          if(index === idx){
                              classess = css.active;
                          }
                          return <img key={idx} className={classNames(css.slideImageBtn,classess)} src={slideImages[idx]} 
                              onClick={() => {
                                  setIndex(idx);
                              }}
                          />
                      })}
                  </div>
                
          </div>

          </>
  );
}

export default Carousel;

/**
 * 
 * 
 * <Slideshow
            imgUrl={imgUrl}
            />
 * 
 */