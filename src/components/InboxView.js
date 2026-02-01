
import css from './InboxView.module.css';
import placeholder from '../assets/placeholder.png';
import MessageListItemComponent from './CustomComponent/MessageListItemComponent';
import MessageGen from './CustomComponent/MessageGen';
import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

export default function InboxView(props){

     const {
        listingId,
        currentUser,
        transactions,
        setShowQuotationForm,
        history,
        onSendMessage,
        messages,
        totalMessages,
        onfetchMessage,
        setShowOrder,
        currentTransaction,
        setCurrentTransaction,
        isProvider,
        setIsProvider,
        setShowOffer,
        setShowQuoteAccepted,
        currentOfferInView,
        setCurrentOfferInView,
        currentDisplayName,
        setCurrentDisplayName,
        currentImgUrl,
        setCurrentImgUrl,
        onUpdateProfile,
        deletedChat,
        deletedMsg,
        onUpdateProfileDeleteChat
    } = props;
   
    const userType = currentUser?.attributes?.profile?.publicData?.userType;
     const inputRef = useRef(null);
    
     const [message,setMessage] = useState("");
     const [showAside,setShowAside] = useState(true);

     const msgCount = transactions.length;

     const removeDeletedTransaction = tx=>{
        let res = [];
        tx.map((itm,k)=>{
            if(!deletedChat.includes(itm?.id?.uuid)){
                res.push(itm);
            }
        })
        return res;
     }

     const filteredTrx = removeDeletedTransaction(transactions);
    
     const handleShowTransactionDetails = (itm,displayName,imgUrl,isProvider) =>{
        setCurrentTransaction(itm);
        setCurrentDisplayName(displayName);
        setCurrentImgUrl(imgUrl);
        setIsProvider(isProvider);
        onfetchMessage(itm.id.uuid);
     }

     const handleBack = e=>{
        history.goBack();
     }

     const handleSendMessage = e=>{
        const txId = currentTransaction.id.uuid;
        //console.log("Sending")
        onSendMessage(txId,message);
        inputRef.current.value = "";
     }

    const handleDeleteMsg = msgId =>{
        const data = 
        {publicData: {
              deletedMsg:[...new Set(deletedMsg),msgId]
            }}
        onUpdateProfile(data);
    }

    const handleDeleteChat = (customerId,providerId,trxId) =>{
        onUpdateProfileDeleteChat(customerId,providerId,trxId);
        console.log("Deleted =========")
    }

    return (
            <>
                <div className={css.container_main}>
                    <div className={css.flex_row}>
                        <svg onClick={handleBack} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M2.29289 12.7071C1.90237 12.3166 1.90237 11.6834 2.29289 11.2929L6.29289 7.29289C6.68342 6.90237 7.31658 6.90237 7.70711 7.29289C8.09763 7.68342 8.09763 8.31658 7.70711 8.70711L5.41421 11L21 11C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13L5.41421 13L7.70711 15.2929C8.09763 15.6834 8.09763 16.3166 7.70711 16.7071C7.31658 17.0976 6.68342 17.0976 6.29289 16.7071L2.29289 12.7071Z" fill="#475367"/>
                        </svg>
                        <h2 className={css.header}>Inbox</h2>
                    </div>
                    
                    <div className={css.grid_con}>
                        {showAside?
                            <aside className={classNames(css.msg_list,css.mobile)}>
                                <div className={css.flex_row_2}>
                                    <span className={`${css.sub_header} ${css.mag_16}`}>All Messages</span>
                                    <div className={css.msg_count}>
                                        {msgCount}
                                    </div>
                                </div>
                                <div className={css.searchbar}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M7.33337 1.83398C4.01967 1.83398 1.33337 4.52028 1.33337 7.83398C1.33337 11.1477 4.01967 13.834 7.33337 13.834C8.75005 13.834 10.0521 13.343 11.0785 12.5219L13.5286 14.9721C13.789 15.2324 14.2111 15.2324 14.4714 14.9721C14.7318 14.7117 14.7318 14.2896 14.4714 14.0292L12.0213 11.5791C12.8424 10.5527 13.3334 9.25066 13.3334 7.83398C13.3334 4.52028 10.6471 1.83398 7.33337 1.83398ZM2.66671 7.83398C2.66671 5.25666 4.75605 3.16732 7.33337 3.16732C9.9107 3.16732 12 5.25666 12 7.83398C12 10.4113 9.9107 12.5007 7.33337 12.5007C4.75605 12.5007 2.66671 10.4113 2.66671 7.83398Z" fill="#475367"/>
                                    </svg>
                                    Search
                                </div>
                                <MessageListItemComponent
                                    transactions={filteredTrx} 
                                    currentUser={currentUser}
                                    handleShowTransactionDetails={handleShowTransactionDetails}
                                    onfetchMessage={onfetchMessage}
                                    currentTransaction={currentTransaction}
                                    handleDeleteChat={handleDeleteChat}
                                    deletedChat={deletedChat}
                                    setShowAside={setShowAside}
                                />
                            </aside>
                        :""}

                        <aside className={classNames(css.msg_list,css.desktop)}>
                            <div className={css.flex_row_2}>
                                <span className={`${css.sub_header} ${css.mag_16}`}>All Messages</span>
                                <div className={css.msg_count}>
                                    {msgCount}
                                </div>
                            </div>
                            <div className={css.searchbar}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M7.33337 1.83398C4.01967 1.83398 1.33337 4.52028 1.33337 7.83398C1.33337 11.1477 4.01967 13.834 7.33337 13.834C8.75005 13.834 10.0521 13.343 11.0785 12.5219L13.5286 14.9721C13.789 15.2324 14.2111 15.2324 14.4714 14.9721C14.7318 14.7117 14.7318 14.2896 14.4714 14.0292L12.0213 11.5791C12.8424 10.5527 13.3334 9.25066 13.3334 7.83398C13.3334 4.52028 10.6471 1.83398 7.33337 1.83398ZM2.66671 7.83398C2.66671 5.25666 4.75605 3.16732 7.33337 3.16732C9.9107 3.16732 12 5.25666 12 7.83398C12 10.4113 9.9107 12.5007 7.33337 12.5007C4.75605 12.5007 2.66671 10.4113 2.66671 7.83398Z" fill="#475367"/>
                                </svg>
                                Search
                            </div>
                            <MessageListItemComponent
                                transactions={filteredTrx} 
                                currentUser={currentUser}
                                handleShowTransactionDetails={handleShowTransactionDetails}
                                onfetchMessage={onfetchMessage}
                                currentTransaction={currentTransaction}
                                handleDeleteChat={handleDeleteChat}
                                deletedChat={deletedChat}
                                setShowAside={setShowAside}
                            />
                        </aside>
                        
                        <div className={css.content_con}>
                            <div className={css.content_header}>
                                {currentDisplayName !== undefined && currentDisplayName !== ""?
                                    <div className={css.flex_row_3}>
                                        <svg onClick={e=>setShowAside(true)} className={classNames(css.hide,css.mobile)} xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-arrow-left-circle" viewBox="0 0 16 16">
                                            <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
                                        </svg>
                                        <div>
                                            <img
                                                className={css.profile_img}
                                                width={40}
                                                height={40}
                                                alt='Profile image'
                                                src={currentImgUrl}
                                            />
                                        </div>
                                        <div>
                                            <span className={css.user_name}>{currentDisplayName}</span>
                                            <p className={css.active_txt}>Active now</p>
                                        </div>
                                    </div>
                                :
                                    <div>
                                        <img
                                                className={css.profile_img}
                                                width={40}
                                                height={40}
                                                alt='Profile image'
                                                src={placeholder}
                                            />
                                    </div>
                                }
                                
                                <svg className={css.options} xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                                    <path d="M13.5 4.5C13.5 5.32843 12.8284 6 12 6C11.1716 6 10.5 5.32843 10.5 4.5C10.5 3.67157 11.1716 3 12 3C12.8284 3 13.5 3.67157 13.5 4.5Z" fill="#475367"/>
                                    <path d="M13.5 12.5C13.5 13.3284 12.8284 14 12 14C11.1716 14 10.5 13.3284 10.5 12.5C10.5 11.6716 11.1716 11 12 11C12.8284 11 13.5 11.6716 13.5 12.5Z" fill="#475367"/>
                                    <path d="M12 22C12.8284 22 13.5 21.3284 13.5 20.5C13.5 19.6716 12.8284 19 12 19C11.1716 19 10.5 19.6716 10.5 20.5C10.5 21.3284 11.1716 22 12 22Z" fill="#475367"/>
                                </svg>
                            </div>
                            <div className={css.content}>
                                <div className={css.msg_con}>
                                    

                                    <MessageGen 
                                        currentUser={currentUser}
                                        currentTransaction={currentTransaction} 
                                        isProvider={isProvider} 
                                        setShowQuotationForm={setShowQuotationForm}
                                        messages={messages}
                                        totalMessages={totalMessages}
                                        onfetchMessage={onfetchMessage}
                                        currentImgUrl={currentImgUrl}
                                        setShowOrder={setShowOrder}
                                        setShowOffer={setShowOffer}
                                        setShowQuoteAccepted={setShowQuoteAccepted}
                                        currentOfferInView={currentOfferInView}
                                        setCurrentOfferInView={setCurrentOfferInView}
                                        handleDeleteMsg={handleDeleteMsg}
                                        deletedMsg={deletedMsg}
                                        deletedChat={deletedChat}
                                        filteredTrx={filteredTrx}
                                    />
                                </div>

                                <div className={css.msg_input}>
                                    <input className={css.input} ref={inputRef} type="text" placeholder="Type your message..." 
                                        onKeyDown={e=>{
                                            if (e.key === "Enter") {
                                                console.log("Enter pressed")
                                                handleSendMessage(e);
                                            }
                                        }} 
                                        onChange={e=>setMessage(e.target.value)} 
                                    />
                                    <div className={css.flex_row_4}>
                                        {userType === "businessOwner"?
                                            <button className={css.send_quote} onClick={e=>setShowQuotationForm(true)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                    <path d="M8 6C7.44772 6 7 6.44772 7 7C7 7.55228 7.44772 8 8 8H16C16.5523 8 17 7.55228 17 7C17 6.44772 16.5523 6 16 6H8Z" fill="#475367"/>
                                                    <path d="M7 12C7 11.4477 7.44772 11 8 11H16C16.5523 11 17 11.4477 17 12C17 12.5523 16.5523 13 16 13H8C7.44772 13 7 12.5523 7 12Z" fill="#475367"/>
                                                    <path d="M8 16C7.44772 16 7 16.4477 7 17C7 17.5523 7.44772 18 8 18H10.6667C11.219 18 11.6667 17.5523 11.6667 17C11.6667 16.4477 11.219 16 10.6667 16H8Z" fill="#475367"/>
                                                    <path d="M13.3333 16C12.781 16 12.3333 16.4477 12.3333 17C12.3333 17.5523 12.781 18 13.3333 18H16C16.5523 18 17 17.5523 17 17C17 16.4477 16.5523 16 16 16H13.3333Z" fill="#475367"/>
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M15.4818 21.9012C15.5942 21.9293 15.7033 21.9697 15.8069 22.0215C18.1928 23.2144 21 21.4795 21 18.812V5C21 2.79086 19.2091 1 17 1H7C4.79086 1 3 2.79086 3 5V18.812C3 21.4795 5.8072 23.2144 8.19308 22.0215C8.29674 21.9697 8.40575 21.9293 8.51818 21.9012L11.5149 21.152C11.8334 21.0724 12.1666 21.0724 12.4851 21.152L15.4818 21.9012ZM5 5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V18.812C19 19.9927 17.7574 20.7607 16.7013 20.2326C16.4672 20.1156 16.2209 20.0244 15.9669 19.9609L12.9701 19.2118C12.3332 19.0525 11.6668 19.0525 11.0299 19.2118L8.03311 19.9609C7.77911 20.0244 7.53283 20.1156 7.29866 20.2326C6.24257 20.7607 5 19.9927 5 18.812V5Z" fill="#475367"/>
                                                </svg>
                                                Send a quote
                                            </button>
                                        :""}
                                        
                                        <div onClick={handleSendMessage} className={css.send_btn_con}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M19.8759 4.122C21.8401 4.07037 23.0939 6.24159 22.0673 7.91692L21.9569 8.08294L12.8925 20.663C11.7097 22.3041 9.19805 21.9232 8.5204 20.0722L8.46083 19.8886L7.34462 15.9882C7.08692 15.0869 7.35745 14.1309 8.01649 13.498C7.20255 13.7337 6.31601 13.5423 5.67177 12.9755L5.52528 12.8359L2.70497 9.91887C1.25363 8.41762 2.17329 5.9033 4.25087 5.69329L19.6766 4.13469L19.8759 4.122ZM9.47157 14.8847C9.29069 15.0053 9.20781 15.2294 9.26747 15.4384L10.3837 19.3388L10.41 19.4101C10.5633 19.7501 11.0414 19.8117 11.2704 19.4941L19.3241 8.31536L9.47157 14.8847ZM4.45204 7.68352C4.03665 7.72551 3.85257 8.22797 4.14247 8.52825L6.96278 11.4452L7.02333 11.499C7.17221 11.61 7.37335 11.6301 7.54384 11.5458L18.1581 6.29778L4.45204 7.68352Z" fill="white"/>
                                            </svg>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </>
           
    )
}