import css from "./MessagesNote.module.css";
import icon from '../../assets/msg.png';
import NamedLink from "../NamedLink/NamedLink";
import { useEffect } from "react";

const NotificationNote = props =>{
    const {data=[],history,onUpdateProfile,currentUser} = props;

    useEffect(()=>{
        // const lastAction = localStorage.getItem("lastAction");
        // if(lastAction === "show_notification"){
        //     //const pageToGo = localStorage.getItem("pageToGo");
        //     localStorage.removeItem("lastAction");
        //     localStorage.removeItem("pageToGo");
        //     history.push("/inbox/orders");
        // }
    },[currentUser])
    
    const handleDeleteNoti = (id,pageToGo) =>{
        // const notifications = data.filter(itm=>itm.id !== id);
        // const dat = 
        //     {protectedData: {
        //         notifications
        //         }}
        
        // localStorage.setItem("lastAction","show_notification");
        // localStorage.setItem("pageToGo",pageToGo);
        // onUpdateProfile(dat);

        if(pageToGo === "InboxPage"){
            history.push("/inbox/orders");
        }else{
            history.push("inbox/orders/bookings");
        }
    }

    return (
        <div className={css.container_main}>
            {data.map((itm,key)=>{
                if(key > 3){return ""}
                // const providerId = itm.relationships.provider.data.id.uuid;
                // const isOwnListing = currentUser.id.uuid === providerId;
                // const message = itm?.attributes?.protectedData?.cartData?.message;
                const {title,pageToGo,id,createdAt} = itm || {};

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
                    <div key={`MessageNote_${key}`} className={css.container} onClick={e=>handleDeleteNoti(id,pageToGo)} >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 8 11" fill="none">
                            <path d="M4.11826 0.5C4.11826 0.223858 3.89441 0 3.61826 0C3.34212 0 3.11826 0.223858 3.11826 0.5V1.25C3.11826 1.26387 3.11883 1.2776 3.11994 1.29118C1.70026 1.52844 0.618263 2.76237 0.618263 4.24945V6.25C0.618263 6.50009 0.413208 6.93379 0.188808 7.33354C-0.126953 7.89603 -0.0691244 8.5742 0.533715 8.80374C1.14003 9.0346 2.10989 9.25 3.61826 9.25C5.12663 9.25 6.0965 9.0346 6.70281 8.80374C7.30565 8.5742 7.36348 7.89603 7.04772 7.33354C6.82332 6.9338 6.61826 6.50009 6.61826 6.25V4.24969C6.61826 2.76261 5.53627 1.52849 4.11659 1.29119C4.1177 1.27761 4.11826 1.26387 4.11826 1.25V0.5Z" fill="#4B5563"/>
                            <path d="M2.07832 9.66229C2.09698 9.67858 2.11952 9.69758 2.14577 9.71858C2.22091 9.7787 2.32827 9.85661 2.46395 9.93414C2.73324 10.088 3.13138 10.25 3.61827 10.25C4.10516 10.25 4.50331 10.088 4.77259 9.93414C4.90827 9.85661 5.01563 9.7787 5.09078 9.71858C5.11703 9.69758 5.13956 9.67858 5.15823 9.66229C4.72105 9.71673 4.21128 9.75002 3.61827 9.75002C3.02526 9.75002 2.51549 9.71673 2.07832 9.66229Z" fill="#4B5563"/>
                        </svg>
                        <div>
                            <p className={css.p}>{title}</p>
                            {createdAt?
                                <span>{elapsedDisplay}</span>
                                :""
                            }
                            
                        </div>
                        
                        
                    </div>
                )
            })}
        </div>
    )
}

export default NotificationNote;