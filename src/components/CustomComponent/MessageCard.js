import css from './MessageCard.module.css';

// File updated
const MessageCard = (props)=>{
    const {content,createdAt,currentImgUrl} = props;
    
    return(
        <div className={css.main_com}>
            <div className={css.container}>
                <img
                    className={css.profile_img}
                    width={40}
                    height={40}
                    alt='Profile image'
                    src={currentImgUrl}
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