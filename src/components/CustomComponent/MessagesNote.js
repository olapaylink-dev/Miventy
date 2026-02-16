import css from "./MessagesNote.module.css";
import icon from '../../assets/msg.png';
import NamedLink from "../NamedLink/NamedLink";

const MessagesNote = props =>{
    const {data=[],currentUser,included} = props;

    const getImageUrl = (data,imgId)=>{
        let url = "";
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

    const handleClick = e=>{

    }

    return (
        <div className={css.container_main}>
            {data.map((itm,key)=>{
                if(key > 3){return ""}
                const providerId = itm.relationships.provider.data.id.uuid;
                const isOwnListing = currentUser.id.uuid === providerId;
                const message = itm?.attributes?.protectedData?.cartData?.message;
                const {name,image} = getProviderData(included,providerId);
                return(
                    <NamedLink key={`MessageNote_${key}`} className={css.container} name="InboxPage" params={{tab:"orders"}} >
                        <img className={css.resize} src={image}/>
                        <div>
                            <h3 className={css.header}>{name}</h3>
                            <p className={css.p}>{message}</p>
                            <span>5 min</span>
                        </div>
                    </NamedLink>
                )
            })}
        </div>
    )
}

export default MessagesNote;