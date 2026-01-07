
import css from './MessageCardOwn.module.css';

// File updated
export default function MessageCardOwn(props){
    const {content,createdAt,currentUser,senderId,currentTransaction} = props;
    const {customer,provider} = currentTransaction;
    const customerProfileImage = customer?.profileImage?.attributes?.variants['square-small']?.url;
    const providerProfileImage = provider?.profileImage?.attributes?.variants['square-small']?.url;
    const profileImage = customer.id.uuid === senderId?customerProfileImage:providerProfileImage;

    //console.log(profileImage,"    zzzxxxxccccvvv")
    return(
        <div className={css.main_com}>
                    <div className={css.container}>
                        <div className={css.time}>{createdAt}</div>
                        <p className={css.message}>
                            {content}
                        </p>
                        <img
                            className={css.profile_img}
                            width={40}
                            height={40}
                            alt='Profile image'
                            src={profileImage}
                        />
                    </div>
                </div>
    )
}