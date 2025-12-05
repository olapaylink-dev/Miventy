
import MessageCard from './MessageCard';
import MessageCardOwn from './MessageCardOwn';
import css from './MessageGen.module.css';
import OfferView from './OfferView';
import OfferViewOther from './OfferViewOther';
import OrderView from './OrderView';

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
  } = props;
  
    return(
        <div className={css.container}>
          {messages.length > 0 && messages.map((itm,key)=>{
            //console.log(itm,"   oooopppppp")
            const isOwnMessage = currentUser.id.uuid === itm.sender.id.uuid;
            const {content,createdAt} = itm?.attributes;
            const {description="",price=0} = content.includes("offerTitle")? JSON.parse(content):{};
            const isOffer = description !== "";
            
            
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
                return <MessageCardOwn content={content} createdAt={time} currentUser={currentUser}/>
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
                return <MessageCard content={content} createdAt={time} currentImgUrl={currentImgUrl} />
              }
             
            }
          })}
          
          {currentTransaction !== undefined && JSON.stringify(currentTransaction) !== "{}"?
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