import axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:8000/',
    headers: {
        'Content-Type': 'application/json',
    }
})

export const setAuthToken = (token) => {
    if(token) {
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
    }
    else {
        delete instance.defaults.headers.common['Authorization'];
    }
}

export default instance;