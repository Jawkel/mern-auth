import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import {signin, signup} from "../../actions/authActions";
import {AUTH_ERROR} from "../../constants/actionTypes";

const initialState = {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: ""
};

export const useAuth = () => {
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState(initialState);
    const error = useSelector(state => state.auth.errors);
    const dispatch = useDispatch();
    const history = useHistory();


    const handleSubmit = (e) => {
        e.preventDefault();
        if (isSignup) {
            dispatch(signup(formData, history));
        } else {
            dispatch(signin(formData, history));
        }
    };
    const handleChange = (e) => {
            dispatch({type: AUTH_ERROR, data: {error: null}});
            setFormData({...formData, [e.target.name]: e.target.value});
        }
    ;

    const switchMode = () => {
        setIsSignup(prevState => !prevState);
    };

    return {
        error,
        isSignup,
        switchMode,
        handleSubmit,
        handleChange,
    };
};