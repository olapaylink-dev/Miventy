import css from './MessageCard.module.css';

// File updated
const MessageCard = (props)=>{
    const {content,createdAt,senderId,currentTransaction} = props;

    const {customer,provider} = currentTransaction;
    const customerProfileImage = customer?.profileImage?.attributes?.variants['square-small']?.url;
    const providerProfileImage = provider?.profileImage?.attributes?.variants['square-small']?.url;
    const profileImage = customer.id.uuid === senderId?customerProfileImage:providerProfileImage;
    
    return(
        <div className={css.main_com}>
            <div className={css.container}>
                <img
                    className={css.profile_img}
                    width={40}
                    height={40}
                    alt='Profile image'
                    src={profileImage}
                />
                <p className={css.message}>
                    {content}
                </p>
                <div className={css.time}>{createdAt}</div>
            </div>
        </div>
        
    )
}

export default MessageCard;