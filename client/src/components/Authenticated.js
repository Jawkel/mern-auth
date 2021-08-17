import React, {useState} from 'react';
import {Paper} from "@material-ui/core";
import {test} from "../api";
import {useAuthRedux} from "../reducers/authReducer";

export default function Authenticated() {
    const {token} = useAuthRedux();
    const [result, setResult] = useState(null);

    const sendTest = () => {
        test(token).then(res => {
            setResult(res.data.auth);
        }).catch(e => setResult(e.toString()));
    };
    return (
        <>
            <Paper><h2>Authenticated</h2><h3 style={{cursor: "pointer"}}
                                             onClick={sendTest}>Test</h3></Paper>
            {result && <Paper>{result}</Paper>}
        </>
    );
}