import React, { useState } from 'react'

import { Button, Grid, Link, makeStyles, TextField } from '@material-ui/core'
import { useAuth, useLanguage } from '../../context'

const useStyles = makeStyles(theme => ({
    button: {
        borderRadius: 20,
        maxWidth: 400, 
        minWidth: 300, 
        width: '100%'
    }
}))

const Login = () => {
    const { dictionary } = useLanguage()
    const { login } = useAuth()
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const classes = useStyles()
    const [ userData, setUserData ] = useState({})

    const handleChange = (event) => {
        switch (event?.target?.name) {
        case 'email':
            return setEmail(event.target.value)
        case 'password':
            return setPassword(event.target.value)
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        let loginState = await login(email, password);
        if(loginState) {
            let userDataToSave = loginState.response.data;
            setUserData(userDataToSave);
            localStorage.setItem('email', userDataToSave.email);
            localStorage.setItem('fullName', userDataToSave.fullName);
            localStorage.setItem('name', userDataToSave.name);
            localStorage.setItem('lastName', userDataToSave.lastName);
            localStorage.setItem('_id', userDataToSave._id);
            localStorage.setItem('role', userDataToSave.role);
            localStorage.setItem('isauthenticated', true);
        }
    }

    return (
        <Grid container style={{ padding: 10, height: '50%' }} alignItems='center' justifyContent='center'>
            <form onSubmit={handleSubmit}>
                <Grid container item spacing={2}>
                    <Grid item xs={12} container justifyContent='center' style={{paddingTop: 40}}>
                        <TextField
                            type='email'
                            name='email'
                            label={dictionary.login.emailField}
                            value={email}
                            onChange={handleChange}
                            variant='outlined'
                            style={{maxWidth: 400, minWidth: 300, width: '100%'}}
                        />
                    </Grid>
                    <Grid item xs={12} container justifyContent='center' style={{paddingTop: 40}}>
                        <TextField
                            type='password'
                            name='password'
                            label={dictionary.login.passwordField}
                            value={password}
                            onChange={handleChange}
                            variant='outlined'
                            style={{maxWidth: 400, minWidth: 300, width: '100%'}}
                        />
                    </Grid>
                    <Grid item xs={12} container justifyContent='center' style={{paddingTop: 40}}>
                        <Button className={classes.button} type='submit' variant='contained' color='primary'>
                            {dictionary.login.loginButton}
                        </Button>
                    </Grid>
                    <Grid item xs={12} container justifyContent='center'>
                        {/* {dictionary.login.forgotPasswordText} <Link href="/reset-password" >{dictionary.login.forgotPasswordLink}</Link> */}
                        <Link href="/reset-password" > {dictionary.login.forgotPasswordText} </Link>
                    </Grid>
                </Grid>
            </form>
        </Grid>
    )
}

export default Login
