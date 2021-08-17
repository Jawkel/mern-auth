import {useSelector} from "react-redux";

const initialState = {user: null, token: null, errors: null, retry: 3};

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        default:
            return state;
    }
};

export const useAuthRedux = () => {
    return useSelector(state => state.auth);
};