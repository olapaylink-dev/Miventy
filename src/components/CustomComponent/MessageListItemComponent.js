
import css from './MessageListItemComponent.module.css';
import profil from '../../assets/avater2.png';

// File updated
export default function MessageListItemComponent(props){
    const {transactions,currentUser,handleShowTransactionDetails,onfetchMessage,currentTransaction} = props;
    const currentUserId = currentUser.id.uuid;
    
    return(
        <div className={css.main_container}>
            {transactions.map((itm,key)=>{
                const isProvider = itm.provider.id.uuid === currentUserId;
                const data = isProvider?itm.customer:itm.provider;
                const {attributes,profileImage} = data;
                const {profile} = attributes;
                const {displayName} = profile;
                const imgUrl = profileImage?.attributes?.variants["square-small"]?.url;
                const {cartData,location,message} = itm.attributes.protectedData.cartData;
                const listingDescription = itm?.listing?.attributes?.title;
                const lastTransitione = itm?.attributes?.lastTransition;

                const checkIfPaid = (trx)=>{
                    let paid = false;
                    trx.attributes.transitions.map((i,k)=>{
                        if(i.transaction === "transition/confirm-payment"){
                            paid = true;
                        }
                    })
                    return paid;
                }

                //console.log(itm,"   oooppp")
                
                return(
                    <div key={`messageList_${key+1}`} className={itm?.id?.uuid === currentTransaction?.id?.uuid?css.container_active: css.container} onClick={e=>handleShowTransactionDetails(itm,displayName,imgUrl,isProvider)}>
                        <img className={css.profile_img} alt='Profile image' src={imgUrl} />
                        <div className={css.flex_col}>
                            <div className={css.flex_row_2}>
                                <span className={css.title}>{displayName}</span>
                            </div>
                            <div className={css.service_desc}>{listingDescription}</div>
                            <div className={css.msg}>{message}</div>

                            {lastTransitione === "transition/confirm-payment" || checkIfPaid(itm)?
                                <button className={css.paid}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-check2-circle" viewBox="0 0 16 16">
                                        <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0"/>
                                        <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z"/>
                                    </svg>
                                    Payment confirmed
                                </button>
                                :lastTransitione === "transition/provider-accept"?
                                <button className={css.accepted}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-check2-circle" viewBox="0 0 16 16">
                                        <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0"/>
                                        <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z"/>
                                    </svg>
                                    Order Accepted
                                </button>
                                :lastTransitione === "transition/provider-decline"?
                                <button className={css.declined}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                                    </svg>
                                    Order Declined
                                </button>
                                :""
                            }
                            

                        </div>
                    </div>
                )
                
            })}
            
        </div>
        
    )
}