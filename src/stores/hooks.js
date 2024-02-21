import Context from "./context";
import { useContext } from "react";

export const useStore = () => {
    console.log("use store", useContext(Context));
    return useContext(Context);
};
