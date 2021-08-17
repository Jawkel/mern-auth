import {AUTH, AUTH_ERROR} from "../constants/actionTypes";
import * as api from "../api/index.js";

export const signin = (formData, history) => async (dispatch, getState) => {
    try {
        // login the user
        const {data} = await api.signIn(formData);
        console.log("DATA Received:", data);

        // localStorage.setItem('user', JSON.stringify(data.user));
        dispatch({type: AUTH, data: {user: data.user, token: data.accessToken}});

        // history.push('/lol');
    } catch (e) {
        let data = {
            result: {},
            token: "",
            errors: e?.response?.data.message
        };
        dispatch({type: AUTH, data});
    }
};
export const signup = (formData, history) => async (dispatch) => {
    try {
        const {data} = await api.signUp(formData);
        console.log("DATA MF!", data);

        dispatch({type: AUTH, data});

        history.push('/');
    } catch (e) {
        let data = {
            result: {},
            token: "",
            errors: e?.response.data.message
        };
        dispatch({type: AUTH, data});
        // console.log(e);
    }
};

export const refresh = () => async (dispatch) => {
    try {
        // 3 retries
        dispatch({type: AUTH_ERROR, data: {}});
        const {data} = await api.refresh();
        localStorage.setItem('user', JSON.stringify(data.user));
        dispatch({type: AUTH, data: {user: data.user, token: data.accessToken}});
        // Successful -> setting retry back to 3
        dispatch({type: AUTH_ERROR, data: {retry: 3}});
    } catch (e) {
        console.log(e);
    }
};

// export const retry = () => async (dispatch) => {
//
// }

export const logout = () => async (dispatch) => {
    try {
        await api.logout();
    } catch (e) {
        console.log("-> e", e);
    }
};