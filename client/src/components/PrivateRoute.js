import React, {useEffect, useState} from 'react';
import {Redirect, Route} from "react-router-dom";
import {useDispatch} from "react-redux";
import {refresh} from "../actions/authActions";
import {CircularProgress} from "@material-ui/core";
import {useAuthRedux} from "../reducers/authReducer";

const PrivateRoute = ({component: Component, ...rest}) => {
    const {user, token} = useAuthRedux();
    const [isLoading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!token) {
            const refreshToken = async () => await dispatch(refresh());
            refreshToken().finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [token, dispatch]);

    return (
        <Route {...rest} render={props => {
            return user ? <Component {...props} /> : isLoading ?
                <CircularProgress color="secondary"/> : <Redirect to="/login"/>;
        }}>

        </Route>
    );
};

export default PrivateRoute;