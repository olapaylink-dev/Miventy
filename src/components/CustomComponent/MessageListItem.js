import css from './MessageListItemComponent.module.css';
import { useState } from "react";
import { FormattedMessage, useIntl } from '../../util/reactIntl';

const MessageListItem = props =>{
    const intl = useIntl();
    const {
        itm,
        currentUserId,
        deletedChat,
        handleShowTransactionDetails,
        onfetchMessage,
        currentTransaction,
        handleDeleteChat,
        key,
        setShowAside,
        notiIds,
        setShowDeletePopup,
        showDeletePopup,
        setTrxToDelete
    } = props;
    const {customer,provider} = itm;
    const isProvider = itm?.provider?.id?.uuid === currentUserId;
    const data = isProvider?itm.customer:itm.provider;
    const {attributes,profileImage} = data || {};
    const {profile} = attributes || {};
    const {displayName} = profile || {};
    const imgUrl = profileImage?.attributes?.variants["square-small"]?.url;
    const {cartData,location,message} = itm?.attributes?.protectedData?.cartData;
    const listingDescription = itm?.listing?.attributes?.title;
    const lastTransitione = itm?.attributes?.lastTransition;
    const id = itm.id.uuid;
    const isDeleted = deletedChat.includes(id);

    const checkIfPaid = (trx)=>{
        let paid = false;
        trx.attributes.transitions.map((i,k)=>{
            //console.log(i.transition,"    vvvvvvvvvvv111111")
            if(i.transition === "transition/confirm-payment"){
                paid = true;
            }
        })
        //console.log(trx?.attributes?.state,"  bbbnnnnnnmmmmmm2222222222222");
        return paid;
    }
    
    //console.log(itm,"   ooop00000000000000000000000pp")
    if(isDeleted){
        return "";
    }

    return(
                    <div key={`messageList_${key+1}`} 
                        className={itm?.id?.uuid === currentTransaction?.id?.uuid?css.container_active: css.container} 
                        onClick={e=>{handleShowTransactionDetails(itm,displayName,imgUrl,isProvider);setShowAside(false); e.preventDefault();e.stopPropagation()}}
                    >
                        <img className={css.profile_img} alt='Profile image' src={imgUrl} />
                        <div className={css.flex_col}>
                            <div  className={css.flex_row_2}>
                                <span className={css.title}>{displayName}</span>
                                <div>
                                    {notiIds.includes(itm.id.uuid)?
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 8 11" fill="none">
                                            <path d="M4.11826 0.5C4.11826 0.223858 3.89441 0 3.61826 0C3.34212 0 3.11826 0.223858 3.11826 0.5V1.25C3.11826 1.26387 3.11883 1.2776 3.11994 1.29118C1.70026 1.52844 0.618263 2.76237 0.618263 4.24945V6.25C0.618263 6.50009 0.413208 6.93379 0.188808 7.33354C-0.126953 7.89603 -0.0691244 8.5742 0.533715 8.80374C1.14003 9.0346 2.10989 9.25 3.61826 9.25C5.12663 9.25 6.0965 9.0346 6.70281 8.80374C7.30565 8.5742 7.36348 7.89603 7.04772 7.33354C6.82332 6.9338 6.61826 6.50009 6.61826 6.25V4.24969C6.61826 2.76261 5.53627 1.52849 4.11659 1.29119C4.1177 1.27761 4.11826 1.26387 4.11826 1.25V0.5Z" fill="#4B5563"/>
                                            <path d="M2.07832 9.66229C2.09698 9.67858 2.11952 9.69758 2.14577 9.71858C2.22091 9.7787 2.32827 9.85661 2.46395 9.93414C2.73324 10.088 3.13138 10.25 3.61827 10.25C4.10516 10.25 4.50331 10.088 4.77259 9.93414C4.90827 9.85661 5.01563 9.7787 5.09078 9.71858C5.11703 9.69758 5.13956 9.67858 5.15823 9.66229C4.72105 9.71673 4.21128 9.75002 3.61827 9.75002C3.02526 9.75002 2.51549 9.71673 2.07832 9.66229Z" fill="#4B5563"/>
                                        </svg>
                                    :""}
                                    
                                    <svg onClick={e=>{
                                        setShowDeletePopup(true);
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setTrxToDelete(itm)
                                        }
                                        } className={css.options} xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 4 25" fill="none">
                                        <path d="M13.5 4.5C13.5 5.32843 12.8284 6 12 6C11.1716 6 10.5 5.32843 10.5 4.5C10.5 3.67157 11.1716 3 12 3C12.8284 3 13.5 3.67157 13.5 4.5Z" fill="#475367"/>
                                        <path d="M13.5 12.5C13.5 13.3284 12.8284 14 12 14C11.1716 14 10.5 13.3284 10.5 12.5C10.5 11.6716 11.1716 11 12 11C12.8284 11 13.5 11.6716 13.5 12.5Z" fill="#475367"/>
                                        <path d="M12 22C12.8284 22 13.5 21.3284 13.5 20.5C13.5 19.6716 12.8284 19 12 19C11.1716 19 10.5 19.6716 10.5 20.5C10.5 21.3284 11.1716 22 12 22Z" fill="#475367"/>
                                    </svg>
                                    
                                </div>
                                
                                
                                
                                
                            </div>
                            {/* {showDelete?
                                <div className={css.delete_chat_con}>
                                        <div onClick={e=>{handleDeleteChat(id)}}>
                                            <svg className={css.delete} onClick={e=>handleDeleteMsg(msgId)} xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                                                <path d="M8.41708 1.45898C8.07069 1.45898 7.76043 1.67326 7.63775 1.99719L7.44643 2.50243C7.03628 2.46144 6.65838 2.42054 6.35247 2.38619C6.1238 2.36052 5.93582 2.33856 5.80524 2.32305L5.65462 2.30497L5.60346 2.29871C5.14672 2.24216 4.72996 2.56649 4.6734 3.02324C4.61683 3.47999 4.94125 3.89611 5.398 3.95267L5.45366 3.95947L5.60864 3.97808C5.74226 3.99395 5.93382 4.01632 6.16651 4.04245C6.63148 4.09466 7.26256 4.16206 7.92467 4.22248C8.81782 4.30399 9.79685 4.37565 10.5004 4.37565C11.204 4.37565 12.183 4.30399 13.0761 4.22248C13.7383 4.16206 14.3694 4.09466 14.8343 4.04245C15.067 4.01632 15.2586 3.99395 15.3922 3.97808L15.5472 3.95947L15.6027 3.95268C16.0595 3.89612 16.384 3.47999 16.3274 3.02324C16.2709 2.56649 15.8548 2.24208 15.398 2.29863L15.3462 2.30497L15.1956 2.32305C15.065 2.33856 14.877 2.36052 14.6484 2.38619C14.3424 2.42054 13.9645 2.46144 13.5544 2.50243L13.3631 1.99719C13.2404 1.67326 12.9301 1.45898 12.5837 1.45898H8.41708Z" fill="#667185"/>
                                                <path d="M9.66708 9.79232C9.66708 9.33208 9.29398 8.95898 8.83375 8.95898C8.37351 8.95898 8.00041 9.33208 8.00041 9.79232V13.959C8.00041 14.4192 8.37351 14.7923 8.83375 14.7923C9.29398 14.7923 9.66708 14.4192 9.66708 13.959V9.79232Z" fill="#667185"/>
                                                <path d="M12.1671 8.95898C12.6273 8.95898 13.0004 9.33208 13.0004 9.79232V13.959C13.0004 14.4192 12.6273 14.7923 12.1671 14.7923C11.7068 14.7923 11.3337 14.4192 11.3337 13.959V9.79232C11.3337 9.33208 11.7068 8.95898 12.1671 8.95898Z" fill="#667185"/>
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M16.2585 6.70945C16.334 5.65214 15.4224 4.80451 14.3865 4.92423C13.3265 5.04674 11.6907 5.20898 10.5004 5.20898C9.31013 5.20898 7.67436 5.04674 6.61433 4.92423C5.57839 4.80451 4.66685 5.65214 4.74237 6.70945L5.45631 16.7047C5.51043 17.4624 6.0748 18.103 6.84928 18.2194C7.67979 18.3443 9.2037 18.5438 10.5014 18.5423C11.7831 18.5408 13.3132 18.3422 14.1474 18.2184C14.9232 18.1034 15.4904 17.4623 15.5447 16.7024L16.2585 6.70945ZM14.5778 6.57988C14.5807 6.57955 14.5829 6.57974 14.5829 6.57974L14.5851 6.58025C14.587 6.58089 14.5899 6.58241 14.5928 6.58513C14.5947 6.58693 14.5961 6.58913 14.5961 6.58913L14.596 6.5907L13.883 16.5728C13.0574 16.6948 11.6425 16.8743 10.4994 16.8757C9.34399 16.877 7.9378 16.6972 7.11792 16.5744L6.4048 6.5907L6.40474 6.58913C6.40474 6.58913 6.40616 6.58693 6.40806 6.58513C6.41093 6.58241 6.41384 6.58089 6.41569 6.58025L6.41789 6.57974C6.41789 6.57974 6.42011 6.57955 6.423 6.57988C7.4849 6.7026 9.20495 6.87565 10.5004 6.87565C11.7959 6.87565 13.5159 6.7026 14.5778 6.57988Z" fill="#667185"/>
                                            </svg>
                                            Delete chat
                                        </div>
                                </div>
                            :""} */}
                            
                            {/* <div className={css.service_desc}>{listingDescription}</div> */}

                            <div className={css.msg}>
                                {message}
                            </div>

                            {lastTransitione === "transition/confirm-payment" || checkIfPaid(itm)?
                                <button className={css.paid}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-check2-circle" viewBox="0 0 16 16">
                                        <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0"/>
                                        <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z"/>
                                    </svg>
                                    {intl.formatMessage({ id: 'Dashboard.paymentConfirmed' })}
                                </button>
                                :lastTransitione === "transition/provider-accept"?
                                <button className={css.accepted}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-check2-circle" viewBox="0 0 16 16">
                                        <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0"/>
                                        <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z"/>
                                    </svg>
                                    {intl.formatMessage({ id: 'Dashboard.orderAccepted' })}
                                </button>
                                :lastTransitione === "transition/provider-decline"?
                                <button className={css.declined}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                                    </svg>
                                     {intl.formatMessage({ id: 'Dashboard.orderDeclined' })}
                                </button>
                                :""
                            }
                        </div>
                    </div>
                )
}

export default MessageListItem;