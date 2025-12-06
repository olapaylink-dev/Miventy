import { useEffect, useState } from 'react';
import css from './OfferView.module.css';

// File updated
const OfferView = (props)=>{
    const {
        trx,
        isProvider,
        setShowQuoteAccepted,
        currentImgUrl,
        setShowOffer,
        content,
        currentOfferInView,
        setCurrentOfferInView
    } = props;
    const {listing} = trx;
    //const title = listing?.attributes?.publicData?.title;
    const [title,setTitle] = useState("");
    useEffect(()=>{
        setTitle(listing?.attributes?.title);
        //console.log("Changingggggggg11111111111111111111111gggggggggggggg")
    },[listing])
    ////console.log(currentTransaction,"    nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn");

    const checkIfPaid = (trx)=>{
        let paid = false;
        trx.attributes.transitions.map((i,k)=>{
            if(i.transition === "transition/confirm-payment"){
                paid = true;
            }
        })
        return paid;
    }

    const isPaid = checkIfPaid(trx);

    return(
        <div className={css.main_com}>
            <div className={css.container}>
                {isPaid?
                    <div className={css.message}>
                        <span className={css.title}>Service quote</span>
                        <p className={css.desc}>{title}</p>
                        <p>Payment Completed</p>
                    </div>
                :
                <>
                    <div className={css.time}>12:15 AM</div>
                    <div className={css.message}>
                        <span className={css.title}>Service quote</span>
                        <p className={css.desc}>{title}</p>
                        <p>You have sent an Offer.</p>
                        <button className={css.view_btn} onClick={e=>{setShowOffer(true);setCurrentOfferInView(content)}}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 6C7.44772 6 7 6.44772 7 7C7 7.55228 7.44772 8 8 8H16C16.5523 8 17 7.55228 17 7C17 6.44772 16.5523 6 16 6H8Z" fill="#475367"/>
                                <path d="M7 12C7 11.4477 7.44772 11 8 11H16C16.5523 11 17 11.4477 17 12C17 12.5523 16.5523 13 16 13H8C7.44772 13 7 12.5523 7 12Z" fill="#475367"/>
                                <path d="M8 16C7.44772 16 7 16.4477 7 17C7 17.5523 7.44772 18 8 18H10.6667C11.219 18 11.6667 17.5523 11.6667 17C11.6667 16.4477 11.219 16 10.6667 16H8Z" fill="#475367"/>
                                <path d="M13.3333 16C12.781 16 12.3333 16.4477 12.3333 17C12.3333 17.5523 12.781 18 13.3333 18H16C16.5523 18 17 17.5523 17 17C17 16.4477 16.5523 16 16 16H13.3333Z" fill="#475367"/>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M15.4818 21.9012C15.5942 21.9293 15.7033 21.9697 15.8069 22.0215C18.1928 23.2144 21 21.4795 21 18.812V5C21 2.79086 19.2091 1 17 1H7C4.79086 1 3 2.79086 3 5V18.812C3 21.4795 5.8072 23.2144 8.19308 22.0215C8.29674 21.9697 8.40575 21.9293 8.51818 21.9012L11.5149 21.152C11.8334 21.0724 12.1666 21.0724 12.4851 21.152L15.4818 21.9012ZM5 5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V18.812C19 19.9927 17.7574 20.7607 16.7013 20.2326C16.4672 20.1156 16.2209 20.0244 15.9669 19.9609L12.9701 19.2118C12.3332 19.0525 11.6668 19.0525 11.0299 19.2118L8.03311 19.9609C7.77911 20.0244 7.53283 20.1156 7.29866 20.2326C6.24257 20.7607 5 19.9927 5 18.812V5Z" fill="#475367"/>
                            </svg>
                            View offer
                        </button>
                    </div>
                </>
                }
               
                 <img
                    className={css.profile_img}
                    width={40}
                    height={40}
                    alt='Profile image'
                    src={currentImgUrl}
                />
            </div>
            {/* {isProvider?
                <div className={css.action_con}>
                    <button className={css.btn_fill} onClick={e=>setShowQuotationForm(true)}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.6754 8.73745C14.0827 8.36444 14.1105 7.73188 13.7375 7.3246C13.3644 6.91732 12.7319 6.88954 12.3246 7.26255L8.63252 10.644L7.6754 9.76739C7.26812 9.39437 6.63557 9.42215 6.26255 9.82943C5.88954 10.2367 5.91732 10.8693 6.3246 11.2423L7.95712 12.7374C8.33934 13.0875 8.92569 13.0875 9.30792 12.7374L13.6754 8.73745Z" fill="white"/>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0ZM2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10Z" fill="white"/>
                        </svg>

                        Create proposal
                    </button>
                    <button className={css.btn_outline}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.58575 7.17157C8.19523 6.78105 7.56206 6.78105 7.17154 7.17157C6.78101 7.5621 6.78101 8.19526 7.17154 8.58579L8.58575 10L7.17154 11.4142C6.78101 11.8047 6.78101 12.4379 7.17154 12.8284C7.56206 13.219 8.19523 13.219 8.58575 12.8284L9.99996 11.4142L11.4142 12.8284C11.8047 13.219 12.4379 13.219 12.8284 12.8284C13.2189 12.4379 13.2189 11.8047 12.8284 11.4142L11.4142 10L12.8284 8.58579C13.2189 8.19526 13.2189 7.5621 12.8284 7.17157C12.4379 6.78105 11.8047 6.78105 11.4142 7.17157L9.99996 8.58579L8.58575 7.17157Z" fill="#475367"/>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0ZM2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10Z" fill="#475367"/>
                        </svg>
                        Decline
                    </button>
                </div>
            :""} */}
            
        </div>
    )
}

export default OfferView;