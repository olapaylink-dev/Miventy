import React, { useEffect, useRef } from "react";
import css from './ReviewSlide.module.css';
import cust1 from '../../assets/customers/cust1.png';
import cust2 from '../../assets/customers/cust2.png';
import cust3 from '../../assets/customers/cust1.png';
import cust4 from '../../assets/customers/cust2.png';
import classNames from "classnames";
import ReviewRating from "../ReviewRating/ReviewRating";
import { FormattedMessage, useIntl } from '../../util/reactIntl';
import Gallery from "./Galery";
import TestimonyCard from "./TestimonyCard";
import { fetchAnyReviews, fetchUserReviews } from "../../containers/ListingPage/ListingPage.duck";
import { connect } from "react-redux";
import { compose } from "redux";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
    slidesToSlide: 3 // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 2 // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1 // optional, default to 1.
  }
};

const ReviewSliderComponent = props =>{

    const intl = useIntl();
    const reff = useRef(null);
    const {onFetchReviews,reviews,included} = props;

    const getImage = (id,included) =>{
      let result = "";
      included.map((itm,key)=>{
        if(itm.type === "image" && itm.id.uuid === id){
          const url = itm.attributes.variants['square-small'].url;
          
          result = url;
        }
      })
      return result;
    }

    const getAuthor = (id,included) =>{
      let result = {};
      included.map((itm,key)=>{
        if(itm.type === "user" && itm.id.uuid === id){
          const imgId = itm.relationships.profileImage.data.id.uuid;
          const url = getImage(imgId,included);
          const res = {
            name:itm.attributes.profile.publicData.businessName,
            category:"Customer",
            img: url
          }
          result = res;
        }
      })
      return result;
    }

    const normalizeData = (reviews,included) =>{
      let result = [];
      reviews.map((itm,key)=>{
        const authorId = itm.relationships.author.data.id.uuid;
        const desc = itm.attributes.content;
        const rating = itm.attributes.rating;
        const userData = getAuthor(authorId,included);
        console.log("uuuuuuuuu")
        result.push({desc,name:userData.name,category:userData.category,img:userData.img,rating});
      })
      return result;
    }

    const testimony = normalizeData(reviews,included);

    console.log(testimony,"    wwwwwwwwwwwwwwww")

    useEffect(()=>{
        onFetchReviews();
    },[])

    return(
        <>
        <div className={css.main_desktop}>
            <div className={css.slide_con}>
              {JSON.stringify(testimony) !== "{}" && testimony !== undefined?
                <Gallery testimony={testimony}/>
              :""}
                
            </div>

            </div>

        <div className={css.mobile}>
            <div className={css.slide_con}>
                 <div id="carouselExampleInterval" class="carousel slide" data-bs-ride="carousel">
                    <div class="carousel-inner">
                        <div class="carousel-item active" data-bs-interval="100">
                            <div className={css.flex_row_slider}>
                                
                            </div>
                        </div>
                    </div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">{intl.formatMessage({id: 'CategoriesForm.previous'})}</span>
                    </button>
                    <button ref={reff} class="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">{intl.formatMessage({id:'Dashboard.next'})}</span>
                    </button>
                </div>
            </div>
        </div>
        </>
    )
}


const mapStateToProps = state => {
  const { isAuthenticated } = state.auth;
  const {
    showListingError,
    reviews,
    included,
  } = state.ListingPage;

  console.log(reviews,"   oooiiuuu    ",included)
 
  return {
   
    reviews,
    included
    
  };
};

const mapDispatchToProps = dispatch => ({
  onFetchReviews:()=> dispatch(fetchAnyReviews()),
});

const ReviewSlider = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ReviewSliderComponent);




export default ReviewSlider;
