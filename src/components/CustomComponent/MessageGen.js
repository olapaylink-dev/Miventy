
import MessageCard from './MessageCard';
import MessageCardOwn from './MessageCardOwn';
import css from './MessageGen.module.css';
import OfferView from './OfferView';
import OfferViewOther from './OfferViewOther';
import OrderView from './OrderView';
import no_msg from '../../assets/no_msg.png';

// File updated
const MessageGen =(props)=>{

  const {
    currentUser,
    currentTransaction,
    isProvider,
    setShowQuotationForm,
    messages,
    totalMessages,
    currentImgUrl,
    setShowOrder,
    setShowOffer,
    setShowQuoteAccepted,
    currentOfferInView,
    setCurrentOfferInView,
    handleDeleteMsg,
    deletedMsg,
    deletedChat,
    filteredTrx
  } = props;


    const {protectedData={}} = currentTransaction !== undefined && JSON.stringify(currentTransaction) !== "{}"?currentTransaction?.attributes:{};
    const {provider={},listing={}} = currentTransaction;
    const cartDat = protectedData?.cartData !== undefined?protectedData?.cartData:{};
    const {cartData,eventLocation,guestCount,message,selectedServiceType,eventTime} = cartDat !== undefined?cartDat:{};
    const isOwn = provider?.id?.uuid === currentUser?.id?.uuid;
    const listingType = listing?.attributes?.publicData?.listingType;

    //console.log(cartDat,"   cccccssssss222222")

    if(filteredTrx.length === 0){
      return (
        <div className={css.no_msg_con}>
          <img src={no_msg} />
        </div>
      )
    }
  
    return(
        <div className={css.container}>
          {messages.length > 0 && messages.map((itm,key)=>{
            //console.log(itm,"   oooopppppp")
            const senderId = itm.sender.id.uuid;
            const isOwnMessage = currentUser.id.uuid === senderId;
            const {content,createdAt} = itm?.attributes;
            const {description="",price=0} = content.includes("offerTitle")? JSON.parse(content):{};
            const isOffer = description !== "";
            const msgId = itm.id.uuid;
            const isDelete = deletedMsg.includes(msgId);
            
            
            let time = createdAt.toLocaleString([], {
                hour: "2-digit",
                minute: "2-digit",
            });

            if(isOwnMessage){
              if(isOffer){
                return <OfferView
                          trx={currentTransaction} 
                          isProvider={isProvider} 
                          setShowQuotationForm={setShowQuotationForm} 
                          currentImgUrl={currentImgUrl}
                          setShowOrder={setShowOrder}
                          setShowOffer={setShowOffer}
                          setShowQuoteAccepted={setShowQuoteAccepted}
                          content={content}
                          currentOfferInView={currentOfferInView}
                          setCurrentOfferInView={setCurrentOfferInView}
                        />
              }else{
                  return <>
                          {!isDelete?
                              <MessageCardOwn 
                                      content={content} 
                                      createdAt={time} 
                                      senderId={senderId} 
                                      currentUser={currentUser} 
                                      currentTransaction={currentTransaction}
                                      msgId={msgId}
                                      handleDeleteMsg={handleDeleteMsg}
                                    />
                              :""}
                          </> 
                
              }
              
            }else{
              if(isOffer){
                return <OfferViewOther
                          trx={currentTransaction} 
                          isProvider={isProvider} 
                          setShowQuotationForm={setShowQuotationForm} 
                          currentImgUrl={currentImgUrl}
                          setShowOrder={setShowOrder}
                          setShowOffer={setShowOffer}
                          setShowQuoteAccepted={setShowQuoteAccepted}
                          content={content}
                          currentOfferInView={currentOfferInView}
                          setCurrentOfferInView={setCurrentOfferInView}
                        />
              }else{
                return <>
                  {!isDelete?
                      <MessageCard 
                          content={content} 
                          createdAt={time} 
                          senderId={senderId} 
                          currentImgUrl={currentImgUrl} 
                          currentTransaction={currentTransaction} 
                          msgId={msgId}
                          handleDeleteMsg={handleDeleteMsg}
                        />
                  :""}
                </> 
              }
             
            }
          })}
          
          {currentTransaction !== undefined && JSON.stringify(currentTransaction) !== "{}" && cartData !== undefined?
            <OrderView 
              trx={currentTransaction} 
              isProvider={isProvider} 
              setShowQuotationForm={setShowQuotationForm} 
              currentImgUrl={currentImgUrl}
              setShowOrder={setShowOrder}
            />
          :""}
        </div>
    )
}
export default MessageGen;