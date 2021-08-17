import axios from "axios";

const API = axios.create({
    baseURL: `http://localhost:${process.env.REACT_APP_SERVER_PORT}`,
    withCredentials: true
});

/*==================
===== Users
==================*/
export const signIn = (formData) => API.post('/user/login', formData);
export const signUp = (formData) => API.post('/user/signup', formData);
export const test = (token) => API.get('/api/test-middleware-auth', {headers: {"access-token": token}});
export const refresh = () => API.get('/user/refresh_token');
export const logout = () => API.post('/user/logout');