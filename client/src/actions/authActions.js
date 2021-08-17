import {AUTH, AUTH_ERROR, LOGOUT} from "../constants/actionTypes";
import * as api from "../api/index.js";

export const signin = (formData, history) => async (dispatch, getState) => {
    try {
        // login the user
        const {data} = await api.signIn(formData);

        dispatch({type: AUTH, data: {user: data.user, token: data.accessToken}});
        history.push('/');
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

        dispatch({type: AUTH, data});
        history.push('/');
    } catch (e) {
        let data = {
            result: {},
            token: "",
            errors: e?.response.data.message
        };
        dispatch({type: AUTH, data});
    }
};

export const refresh = () => async (dispatch) => {
    try {
        // 3 retries
        dispatch({type: AUTH_ERROR, data: {}});
        const {data} = await api.refresh();
        dispatch({type: AUTH, data: {user: data.user, token: data.accessToken}});
        // Successful -> setting retry back to 3
        dispatch({type: AUTH_ERROR, data: {retry: 3}});
    } catch (e) {
        console.log(e);
    }
};

export const logout = () => async (dispatch) => {
    try {
        await api.logout();
        dispatch({type: LOGOUT});
    } catch (e) {
        console.log("-> e", e);
    }
};