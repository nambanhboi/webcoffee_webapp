import storage from "@/ultils/storage";
import { LOGIN, LOGOUT, INIT, SET_AVATAR } from "./constants";
import { setAuthToken } from "@/ultils/axios";

const isAuth = storage.getIsAuth();
const auth = storage.getAuth();
const accessToken = storage.getAccessToken();
const refreshToken = storage.getRefreshToken();

const initState = {
    isAuth,
    auth,
    accessToken,
    refreshToken
};
let newAccessToken;
let newRefreshToken;
let newIsAuth;
let newAuth;

function reducer(state, action) {
    switch (action.type) {
        default: 
            throw new Error('invalid action');
        case LOGIN:
            newAccessToken = action.payload.accessToken;
            storage.setAccessToken(newAccessToken);
            newRefreshToken = action.payload.refreshToken;
            storage.setRefreshToken(newRefreshToken);
            newIsAuth = action.payload.role;
            storage.setIsAuth(newIsAuth);
            newAuth = {
                username: action.payload.username,
                avatar: action.payload.avatar
            }
            storage.setAuth(newAuth)

            //set token header axios
            setAuthToken(newAccessToken);
            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
                isAuth: newIsAuth,
                auth: newAuth
            };
        case LOGOUT:
            storage.setAccessToken(null);
            storage.removeAuth();
            storage.removeIsAuth();
            storage.setRefreshToken(null);
            return {
                accessToken: null,
                refreshToken: null,
                isAuth: null,
                auth: null
            }
        case INIT: 
            newAccessToken = action.payload.accessToken;
            newRefreshToken = action.payload.refreshToken;
            newIsAuth = action.payload.isAuth;
            newAuth = action.payload.auth;
            setAuthToken(newAccessToken);
            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
                isAuth: newIsAuth,
                auth: newAuth
            };
        case SET_AVATAR: 
            newAuth = {
                ...newAuth,
                avatar: action.payload
            }
            storage.setAuth(newAuth)
            return {
                ...state,
                auth: newAuth
            }
    }
};

export { initState };
export default reducer;