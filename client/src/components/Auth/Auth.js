import React from 'react';
import {useAuth} from "./useAuth";
import {Avatar, Box, Button, Paper, Grid, Typography, Container} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import {pink} from '@material-ui/core/colors';
import Input from "./Input";


export default function Auth() {

    const {
        error,
        isSignup,
        switchMode,
        handleSubmit,
        handleChange,
    } = useAuth();

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={15} sx={{m: 3, p: 2}}>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Avatar sx={{m: 1, bgcolor: pink[500]}}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography variant="h5" align="center"
                                gutterBottom>{isSignup ? "Sign Up" : "Sign In"}</Typography>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            {isSignup && (
                                <>
                                    <Input name="firstname" label="First Name"
                                           handleChange={handleChange} autoFocus
                                           half/>
                                    <Input name="lastname" label="Last Name"
                                           handleChange={handleChange}
                                           half/>
                                </>
                            )}
                            <Input name="email" label="Email Address" handleChange={handleChange}
                                   autoFocus={isSignup ? false : true}/>
                            <Input name="password" label="Password" handleChange={handleChange}/>
                            {isSignup &&
                            <Input name={"confirmPassword"} label={"Repeat Password"}
                                   handleChange={handleChange}
                                   type={"password"}/>}

                        </Grid>
                        {error &&
                        <Typography variant="button" color="error"
                                    align="center">{error}</Typography>}
                        <Button type="submit" fullWidth variant="contained"
                            // color="primary"
                                sx={{bgcolor: pink[500], my: 2}}
                                onClick={handleSubmit}>
                            {isSignup ? 'Sign Up' : 'Sign In'}
                        </Button>
                        {/*<GoogleLogin*/}
                        {/*    clientId="158797838233-su5vhftg5f46hsetvoclnolsnmbe5e1k.apps.googleusercontent.com"*/}
                        {/*    render={(renderProps) => (*/}
                        {/*        <Button color="primary" fullWidth*/}
                        {/*                onClick={renderProps.onClick}*/}
                        {/*                disabled={renderProps.disabled}*/}
                        {/*                startIcon={<Icon/>}*/}
                        {/*                sx={{bgcolor: pink[500]}}*/}
                        {/*                variant="contained">Google Sign In</Button>*/}
                        {/*    )}*/}
                        {/*    onSuccess={googleSuccess}*/}
                        {/*    onFailure={googleFailure}*/}
                        {/*    cookiePolicy="single_host_origin"*/}
                        {/*/>*/}
                        <Grid container justifyContent="flex-end">
                            <Button
                                onClick={switchMode}>{isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}</Button>
                        </Grid>
                    </form>
                </Box>
            </Paper>
        </Container>
    );
}