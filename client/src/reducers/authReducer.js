import {useSelector} from "react-redux";
import {AUTH, AUTH_ERROR, LOGOUT} from "../constants/actionTypes";

const initialState = {user: null, token: null, errors: null, retry: 3};

export const authReducer = (state = initialState, {type, data}) => {
    switch (type) {
        case AUTH:
            return {...state, user: data.user, token: data.token, errors: data.errors};

        case AUTH_ERROR:
            return {
                ...state,
                retry: data.retry ? data.retry : state.retry - 1,
                errors: data.errors || null
            };
        case LOGOUT:
            return initialState;

        default:
            return state;
    }
};

export const useAuthRedux = () => {
    return useSelector(state => state.auth);
};