import { INIT, LOGIN, LOGOUT, SET_AVATAR } from "./constants";

export const login = payload => ({
    type: LOGIN,
    payload
});

export const logout = payload => ({
    type: LOGOUT,
    payload
});

export const init = payload => ({
    type: INIT,
    payload
});

export const setavatar = payload => ({
    type: SET_AVATAR,
    payload
});