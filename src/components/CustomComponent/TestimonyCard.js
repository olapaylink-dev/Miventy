
import React, { useRef } from "react";
import css from './ReviewSlide.module.css';
import classNames from "classnames";
import ReviewRating from "../ReviewRating/ReviewRating";
import { Box, Rating, styled } from "@mui/material";



const TestimonyCard = props=>{

    
const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '#ff6d75',
  },
  '& .MuiRating-iconHover': {
    color: '#ff3d47',
  },
});

    const {data} = props;
    console.log(data,"    ggghhh")
    return (
        <div className={classNames(css.flex_col,css.item)}>
            <p>
                {data.desc}
            </p>
            
            <div className={css.flex_row_center}>
                <div style={{width:"50px",height:"50px"}}>
                    <img style={{width:"50px",height:"50px",borderRadius:"50%"}} src={data.img}/>
                </div>
                
                <div className={css.flex_col_sub}>
                    <div>
                        <ReviewRating
                            rating={2}
                            className={css.ratng}
                        />

                                    <Box sx={{ '& > legend': { mt: 2 } }} className={css.rating_con}>
                                      <StyledRating
                                          name="customized-color"
                                          defaultValue={data.rating}
                                          getLabelText={(value) => `${value} Heart${value !== 1 ? 's' : ''}`}
                                          precision={0.5}
                                          icon={
                                              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                  <path d="M8.26894 1.45105C9.06651 0.182982 10.9335 0.182982 11.7311 1.45105L13.6599 4.5178C13.9406 4.96396 14.3864 5.28413 14.9023 5.41009L18.4489 6.27584C19.9153 6.63382 20.4922 8.38907 19.5187 9.53076L17.1643 12.2919C16.8218 12.6936 16.6515 13.2116 16.6897 13.7356L16.9527 17.3374C17.0615 18.8268 15.5511 19.9116 14.1518 19.3491L10.7678 17.9888C10.2755 17.7909 9.72448 17.7909 9.23217 17.9888L5.84818 19.3491C4.44893 19.9116 2.93851 18.8268 3.04726 17.3374L3.31026 13.7356C3.34853 13.2116 3.17825 12.6936 2.83572 12.2919L0.481292 9.53076C-0.492242 8.38907 0.0846877 6.63382 1.55115 6.27584L5.09768 5.41009C5.61365 5.28413 6.05944 4.96396 6.34006 4.5178L8.26894 1.45105Z" fill="#FFD700"/>
                                              </svg>
                                          }
                                          emptyIcon={
                                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
                                                  <path fill-rule="evenodd" clip-rule="evenodd" d="M11.3159 1.1822C10.3245 -0.394067 8.01142 -0.394068 7.02 1.1822L5.41261 3.73782C5.29504 3.92475 5.10648 4.06146 4.88508 4.11551L1.92963 4.83697C0.114839 5.27999 -0.619074 7.46814 0.601607 8.89967L2.56363 11.2006C2.70764 11.3695 2.7779 11.5854 2.76206 11.8023L2.54289 14.8038C2.40617 16.6762 4.29639 18.0065 6.01892 17.3141L8.83891 16.1805C9.04973 16.0958 9.2862 16.0958 9.49701 16.1805L12.317 17.3141C14.0395 18.0065 15.9298 16.6762 15.793 14.8038L15.5739 11.8023C15.558 11.5854 15.6283 11.3695 15.7723 11.2006L17.7343 8.89967C18.955 7.46815 18.2211 5.27999 16.4063 4.83697L13.4509 4.11551C13.2294 4.06146 13.0409 3.92475 12.9233 3.73782L11.3159 1.1822ZM8.43082 2.06955C8.76868 1.53237 9.56724 1.53237 9.90511 2.06955L11.5125 4.62517C11.8626 5.18184 12.4171 5.57876 13.0556 5.73463L16.011 6.4561C16.6404 6.60972 16.868 7.34697 16.4661 7.81826L14.5041 10.1192C14.0772 10.6198 13.8637 11.2673 13.9116 11.9237L14.1308 14.9252C14.1753 15.5351 13.5482 16.0127 12.9386 15.7677L10.1186 14.6341C9.50892 14.389 8.82701 14.389 8.2173 14.6341L5.3973 15.7677C4.78775 16.0127 4.1606 15.5351 4.20513 14.9252L4.4243 11.9237C4.47224 11.2673 4.25871 10.6198 3.83183 10.1192L1.86981 7.81826C1.46793 7.34697 1.69557 6.60972 2.32488 6.4561L5.28033 5.73463C5.91886 5.57876 6.47329 5.18184 6.82342 4.62517L8.43082 2.06955Z" fill="#EBC600"/>
                                              </svg>
                                          }
                                          disabled
                                      />
                                      
                                  </Box>






                    </div>
                    <div className={"d-flex gap-2 justify-start align-middle"}>
                        <span className={css.user_name}>{data.name}</span><span className={css.user_title}>{data.category}</span>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}


export default TestimonyCard;