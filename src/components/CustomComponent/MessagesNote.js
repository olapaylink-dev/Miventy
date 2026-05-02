import css from "./MessagesNote.module.css";
import icon from '../../assets/msg.png';
import NamedLink from "../NamedLink/NamedLink";

const MessagesNote = props =>{
    const {data=[],currentUser,included} = props;

    console.log("urllllllll222222222222222llllllllll")

    const getImageUrl = (data,imgId)=>{
        let url = "";
        console.log("urllllllllllllllllll")
        data.map((itm,key)=>{
            if(itm.type === "image" && itm.id.uuid === imgId){
                url = itm.attributes.variants["square-small"].url;
            }
        })
        return url;
    }

    const getProviderData = (data,userId) =>{
        let result = {};
        data.map((itm,key)=>{
            if(itm.type === "user" && itm.id.uuid === userId){
                const imgId = itm?.relationships?.profileImage?.data?.id?.uuid;
                result = {
                    image:getImageUrl(data,imgId),
                    name:itm.attributes.profile.displayName
                }
            }
        })
        return result;
    }

    return (
        <div className={css.container_main}>
            {data.map((itm,key)=>{
                if(key > 3){return ""}
                // const providerId = itm.senderId;
                const providerId = itm.relationships.provider.data.id.uuid
                const isOwnListing = currentUser.id.uuid === providerId;
                const message = itm?.attributes?.protectedData?.cartData?.message;
                const {name,image} = getProviderData(included,providerId);
                const createdAt = itm?.attributes?.transitions[0]?.createdAt;
                  // set the time
                let past = new Date(createdAt);  //YYYY-MM-DD

                // assigning present time to now variable
                let now = new Date();

                let elapsed = (now - past);

                // by dividing by 1000 we will get 
                // the time in seconds
                const daysElapsed = Math.floor(elapsed/(1000*60*60*24));
                const hoursElapsed = Math.floor(elapsed/(1000*60*60));
                const minElapsed = Math.floor(elapsed/(1000*60));

                let elapsedDisplay ;
                if(daysElapsed > 0){
                    elapsedDisplay = `${daysElapsed} days`;
                }else if(hoursElapsed > 0){
                    elapsedDisplay = `${hoursElapsed} hours`;
                }else if(minElapsed > 0){
                    elapsedDisplay = `${minElapsed} min`;
                }

                return(
                    <NamedLink key={`MessageNote_${key}`} className={css.container} name="InboxPage" params={{tab:"orders"}} >
                        <img className={css.resize} src={image}/>
                        <div>
                            <h3 className={css.header}>{name}</h3>
                            <p className={css.p}>{message}</p>
                            <span>{elapsedDisplay}</span>
                        </div>
                    </NamedLink>
                )
            })}
        </div>
    )
}

export default MessagesNote;