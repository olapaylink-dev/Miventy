import { useState } from 'react';
import css from './MessageCard.module.css';

// File updated
const MessageCard = (props)=>{
    const {content,createdAt,senderId,currentTransaction,msgId,handleDeleteMsg} = props;

    const {customer,provider} = currentTransaction;
    const customerProfileImage = customer?.profileImage?.attributes?.variants['square-small']?.url;
    const providerProfileImage = provider?.profileImage?.attributes?.variants['square-small']?.url;
    const profileImage = customer?.id?.uuid === senderId?customerProfileImage:providerProfileImage;
    const [showDelete,setShowDelete] = useState(false);
    
    return(
        <div className={css.main_com}>
            <div className={css.container} onMouseOver={e=>setShowDelete(true)} onMouseOut={e=>setShowDelete(false)}>
                <img
                    className={css.profile_img}
                    width={40}
                    height={40}
                    alt='Profile image'
                    src={profileImage}
                />
                <div className={css.flex_row}>
                    <div className={css.content_con}>
                        <p className={css.message}>
                            {content}
                        </p>
                    </div>
                    <div className={css.time}>{createdAt}</div>
                </div>
                
            </div>
            
        </div>
        
    )
}

export default MessageCard;