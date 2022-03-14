import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import { Button, Grid, IconButton, Link, makeStyles, TextField } from '@material-ui/core'
import { useAuth, useLanguage } from '../../context'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

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
    const history = useHistory();
    const [ verPassword, setVerPassword ] = useState('password')

    const cambiarVistaPassword = () => {
        if(verPassword === 'password') {
            setVerPassword('text')
        }else{
            setVerPassword('password')
        } 
    }

    const handleChange = (event) => {
        switch (event?.target?.name) {
        case 'email':
            return setEmail(event.target.value)
        case 'password':
            return setPassword(event.target.value)
        }
    }

    useEffect(() => {
        if(history.location.pathname.length > 1) {
            history.replace('/')
        }
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault()
        let loginState = await login(email, password);
        if(loginState) {

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
                            type={verPassword}
                            name='password'
                            label={dictionary.login.passwordField}
                            value={password}
                            onChange={handleChange}
                            variant='outlined'
                            style={{maxWidth: 400, minWidth: 300, width: '100%'}}
                        />
                        <IconButton style={{width: 0, position: 'relative', right: 25, zIndex: 1, padding: 0}} onClick={() => {cambiarVistaPassword()}}>
                            {
                                verPassword === 'password' && <FontAwesomeIcon icon={faEye}/>
                            }
                            {
                                verPassword === 'text' && <FontAwesomeIcon icon={faEyeSlash}/>
                            }
                        </IconButton>
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
