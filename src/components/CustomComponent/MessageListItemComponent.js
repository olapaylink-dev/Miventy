
import css from './MessageListItemComponent.module.css';
import profil from '../../assets/avater2.png';
import { useState } from 'react';
import MessageListItem from './MessageListItem';

// File updated
export default function MessageListItemComponent(props){
    const {transactions,
        currentUser,
        handleShowTransactionDetails,
        onfetchMessage,
        currentTransaction,
        handleDeleteChat,
        deletedChat,
        setShowAside
    } = props;
    const currentUserId = currentUser.id.uuid;
    const profileUser = currentUser;
    const {  protectedData } = profileUser?.attributes?.profile || {};
    const data = protectedData?.notifications || [];

    const getNotificationId = noti=>{
        let res = [];
        noti.map((itm,key)=>{
        res.push(itm.trxId);
        })
        return res;
    }

    const notiIds = getNotificationId(data);

    
    if(transactions.length === 0){
        return "";
    }
    
    return(
        <div className={css.main_container}>
            {transactions.map((itm,key)=>{
               
               return <MessageListItem
                        key={key}
                        itm={itm}
                        currentUserId={currentUserId}
                        deletedChat={deletedChat}
                        handleShowTransactionDetails={handleShowTransactionDetails}
                        onfetchMessage={onfetchMessage}
                        currentTransaction={currentTransaction}
                        handleDeleteChat={handleDeleteChat}
                        setShowAside={setShowAside}
                        notiIds={notiIds}
                      />
                
            })}
            
        </div>
        
    )
}