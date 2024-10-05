import React            from "react";
import { useIdleTimer } from "react-idle-timer";

const SessionTime = (props)=> {
    const handleOnIdle = (event) => {        
        setTimeout( ()=>{
            props.CloseSession();
        }, 3000 );
    };
   
    useIdleTimer({
        timeout: 1000 * 60 * 60,
        onIdle: handleOnIdle,
        debounce: 500,
    });
    return <></>;
}

export default SessionTime;