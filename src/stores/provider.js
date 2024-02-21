import { useEffect, useReducer, useState } from "react";
import Context from "./context";
import reducer, { initState } from "./reducer";

function Provider({ children }) {
    const [state, dispatch] = useReducer(reducer, initState);

    console.log("running...", state);
    const [toast, setToast] = useState(null);

    const showToast = (message, type) => {
        setToast({message, type});
        setTimeout(() => {           
            setToast(null);
        }, 4000);
    };
    useEffect(() => {
        let timer;
        if(toast !== null) {
            timer = setTimeout(() => {
                setToast(null);
            }, 4000)
        }
        return () => {
            clearTimeout(timer);           
        }
    }, [toast]);

    return (
        <Context.Provider value={{state, dispatch, toast, showToast}}>
            { children }
        </Context.Provider>
    );
};

export default Provider;