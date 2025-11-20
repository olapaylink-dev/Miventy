import React, { useEffect, useRef, useState } from "react";
import css from './SlideShowDesk.module.css';
import classNames from "classnames";


const colors = ["#0088FE", "#00C49F", "#FFBB28"];

const delay = 5000;

const SlideshowDesk =(props) =>{

  const {imgUrl,slideImages,imageBtns,slideLogos,slideGear} = props;
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);

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
                                    <div className={css.slide_row}>




                                    <div className={css.flexCol}>
                                    <img className={css.imgs} src={slideImages[index]}/>
                                    <div className={css.flexCol}>
                                      <div className={css.flexRow2}>
                                        <div className={css.flexRow3}>
                                           <img className={css.listingLogo} src={slideLogos[index]}/>
                                            <span className={css.cardTitle}>Super</span>
                                        </div>
                                        <img className={css.listingLogo} src={slideGear[index]}/>
                                      </div>
                                    
                                      <p className={css.slideTitle}>Super commedian <br/> all year 2025</p> 
                                        
                                      <div className={css.flexRow2}>
                                        <div>11/Day</div>
                                        <div>$450</div>
                                      </div>
                                      
                                    </div>
                                  </div>

                                  <div className={css.flexCol}>
                                    <img className={css.imgs} src={slideImages[index]}/>
                                    <div className={css.flexCol}>
                                      <div className={css.flexRow2}>
                                        <div className={css.flexRow3}>
                                           <img className={css.listingLogo} src={slideLogos[index]}/>
                                            <span className={css.cardTitle}>Super</span>
                                        </div>
                                        <img className={css.listingLogo} src={slideGear[index]}/>
                                      </div>
                                    
                                      <p className={css.slideTitle}>Super commedian <br/> all year 2025</p> 
                                        
                                      <div className={css.flexRow2}>
                                        <div>11/Day</div>
                                        <div>$450</div>
                                      </div>
                                      
                                    </div>
                                  </div>

















                                    </div>
                                 
                                    
                                </div>
                                ))}
                            </div>
                        </div>
                        <div className={css.dots_con}>
                                <div className={css.slideshowDots}>
                                {imageBtns.map((_, idx) => {

                                    let classess = "";
                                    if(index === idx){
                                        classess = css.active;
                                    }
                                return <div key={idx} className={classNames(css.slideshowDot,classess)} 
                                            onClick={() => {
                                            setIndex(idx);
                                            }}
                                            ></div>
                                })}
                                </div>
                        </div>
                    </div>
                
          </div>
           

    

            </>
  );
}

export default SlideshowDesk;

/**
 * 
 * 
 * <Slideshow
            imgUrl={imgUrl}
            />
 * 
 */