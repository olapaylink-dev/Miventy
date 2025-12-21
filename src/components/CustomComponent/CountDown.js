import { useEffect,useState } from "react";


const CountDown = props =>{

     const [eventName, setEventName] = useState("");
        const [eventDate, setEventDate] = useState(60);
        const [countdownStarted, setCountdownStarted] = useState(false);
        const [timeRemaining, setTimeRemaining] = useState(60);
        const handleVerify = e=>{
            setShowPasswordUpdated(true);
        }
    
    
        useEffect(() => {
            const countdownInterval = setInterval(() => {
                let val = 0;
                if(timeRemaining > 0){
                    val = timeRemaining -1;
                    setTimeRemaining(val);
                }else{
                    remainingTime = 0;
                    clearInterval(countdownInterval);
                    alert("Countdown complete!");
                }
            }, 1000);
    
          return () => clearInterval(countdownInterval);
        
        }, [timeRemaining]);
    


    return (
        `00:${timeRemaining}`
    )
}

export default CountDown;