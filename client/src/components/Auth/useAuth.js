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
        // console.log(formData);
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
        // handleShowPassword(false);
    };

    // const googleSuccess = async (res) => {
    //     const result = res?.profileObj;
    //     console.log(result);
    //     const token = res?.tokenId;
    //
    //     try {
    //         dispatch({type: 'AUTH', data: {result, token}});
    //         history.push('/');
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };
    // const googleFailure = () => {
    //     console.log("Google Sign In went wrong. Try again later");
    // };

    return {
        error,
        isSignup,
        // showPassword,
        switchMode,
        handleSubmit,
        handleChange,
        // handleShowPassword
    };
};