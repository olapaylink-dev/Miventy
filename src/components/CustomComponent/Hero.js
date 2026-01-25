import React from "react";
import css from './Hero.module.css';

import phones from '../../assets/facepainter.jpg';
import Slideshow from "./SlideShow";
import icon1 from '../../assets/icons/icon1.png';
import icon2 from '../../assets/icons/icon2.png';
import icon3 from '../../assets/icons/icon3.png';
import icon4 from '../../assets/icons/icon4.png';
import icon5 from '../../assets/icons/icon5.png';
import icon6 from '../../assets/icons/icon6.png';
import icon7 from '../../assets/icons/icon7.png';

import gear from '../../assets/gear.png';
import bgImg from '../../assets/hero_bg.PNG';
import classNames from "classnames";
import SlideshowDesk from "./SlideShowDesk";

import baloonman from '../../assets/ballonman.jpeg';
import clown from '../../assets/clownman.jpg';
import magician from '../../assets/magician.jpeg';
import NamedLink from "../NamedLink/NamedLink";
import BoxMenu from "./BoxMenu";
import { useInView } from "react-intersection-observer";

const Hero = (props)=>{
  const {setShowTopBoxMenu,showTopBoxMenu,history} = props;

      const { ref, inView, entry } = useInView({
          /* Optional options */
          threshold: 0,
      });
  
      if(inView){
          //console.log("In view");
          setShowTopBoxMenu(false);
          
      }else{
          //console.log("Not view");
          setShowTopBoxMenu(true);
      
      }

    return (
        <>
          <div className={css.main_desktop}>
            <div className={classNames(css.desktop)}>
                  <div className={classNames(css.container_desk)} style={{backgroundImage:`url(${bgImg})`, backgroundSize:'cover'}}>
                    
                    <div className={css.header_con}>
                      <h2 className={css.header}>
                        Discover and Book The Perfect <br/><span>Entertainer</span> for Your Events
                      </h2>
                      <p ref={ref}>
                        From magicians to event planners, find everything you need to make your 
                        celebration extraordinary quickly and effortlessly.
                      </p>

                      <div className={css.action_con}>
                        <NamedLink name="SearchPage" className={css.btn_a}>
                          Browse Category
                        </NamedLink>
                        <NamedLink name="ProfileSettingsPage" className={css.btn_b}>
                          Post your service
                        </NamedLink>
                      </div>
                    </div>

                  </div>
                  {!showTopBoxMenu?
                    <BoxMenu 
                      setShowTopBoxMenu={setShowTopBoxMenu}
                      showTopBoxMenu={showTopBoxMenu}
                      history={history}
                    />:<div className={css.space}></div>
                  }
                  
              </div>
              
          </div>
           

          <div className={css.mobile}>
                   

                  <div className={classNames(css.container_mobile)} style={{backgroundImage:`url(${bgImg})`, backgroundSize:'cover'}}>
                    
                    <div className={css.header_con}>
                      <h2 className={css.header}>
                        Discover and Book The Perfect <span>Entertainer</span> for Your Events
                      </h2>
                      <p>
                        From magicians to event planners, find everything you need to make your 
                        celebration extraordinary quickly and effortlessly.
                      </p>

                     
                    </div>
                    <BoxMenu 
                        setShowTopBoxMenu={setShowTopBoxMenu}
                        showTopBoxMenu={showTopBoxMenu}
                        history={history}
                      />

                       <div className={css.action_con}>
                        <NamedLink name="SearchPage" className={css.btn_a}>
                          Browse Category
                        </NamedLink>
                        <NamedLink name="ProfileSettingsPage" className={css.btn_b}>
                          Post your service
                        </NamedLink>
                      </div>
                  </div>
                   

          </div>


        </>
    )

}

export default Hero;