import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, Grid, IconButton, Link, makeStyles, TextField } from '@material-ui/core'
import { useAuth, useLanguage } from '../../context'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { format } from 'rut.js';

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
    const { login, loginRut } = useAuth()
    const [ email, setEmail ] = useState('')
    const [ rut, setRut ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ typeAccess, setTypeAccess ] = useState('rut')
    const [ typeText, setTipeText ] = useState('email')
    const classes = useStyles()
    const navigate = useNavigate();
    const location = useLocation()
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
        case 'rut':
            return setRut(format(event.target.value))
        case 'email':
            return setEmail(event.target.value)
        case 'password':
            return setPassword(event.target.value)
        }
    }

    useEffect(() => {
        if(location.pathname.length > 1) {
            /* navigate('/', {replace:true}) */
        }
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (typeAccess === 'email') {
            let loginState = await login(email, password);
            if(loginState.state) {
                navigate('/welcome', {replace: true})
            }
        } else if (typeAccess === 'rut') {
            let loginState = await loginRut(rut, password);
            if(loginState.state) {
                navigate('/welcome', {replace: true})
            }
        }
    }

    const changeTypeAccess = () => {
        if (typeAccess === 'email') {
            setTypeAccess('rut')
            setTipeText('email')
        } else {
            setTypeAccess('email')
            setTipeText('rut')
        }
    }

    const toResetPassword = () => {
        navigate('/reset-password')
    }

    return (
        <Grid container style={{ padding: 10, height: '50%' }} alignItems='center' justifyContent='center'>
            <form onSubmit={handleSubmit}>
                <Grid container item spacing={2}>
                    {(typeAccess === 'rut') && <Grid item xs={12} container justifyContent='center' style={{paddingTop: 40}}>
                        <TextField
                            type='text'
                            name='rut'
                            label={dictionary.login.rutField}
                            value={rut}
                            onChange={handleChange}
                            variant='outlined'
                            style={{maxWidth: 400, minWidth: 300, width: '100%'}}
                        />
                    </Grid>}
                    {(typeAccess === 'email') && <Grid item xs={12} container justifyContent='center' style={{paddingTop: 40}}>
                        <TextField
                            type='email'
                            name='email'
                            label={dictionary.login.emailField}
                            value={email}
                            onChange={handleChange}
                            variant='outlined'
                            style={{maxWidth: 400, minWidth: 300, width: '100%'}}
                        />
                    </Grid>}
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
                        <Button className={classes.button} style={{ marginBottom: 20 }} type='submit' variant='contained' color='primary'>
                            {dictionary.login.loginButton}
                        </Button>
                    </Grid>
                    <Grid item xs={12} container justifyContent='center' style={{paddingTop: 40}}>
                        <Button className={classes.button} variant='contained' onClick={() => {changeTypeAccess()}}>
                            Usar {typeText}
                        </Button>
                    </Grid>
                    <Grid item xs={12} container justifyContent='center'>
                        {/* {(typeText === 'rut') && <Link to="/reset-password" > {dictionary.login.forgotPasswordText} </Link>} */}
                        {(typeText === 'rut') && <p className='link-text' onClick={toResetPassword}>{dictionary.login.forgotPasswordText}</p>}
                    </Grid>
                </Grid>
            </form>
        </Grid>
    )
}

export default Login
