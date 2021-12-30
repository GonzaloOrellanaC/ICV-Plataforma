import React, { useEffect, useState } from 'react'
import { Button, Grid, Link, makeStyles, TextField } from '@material-ui/core'
import { useAuth, useLanguage } from '../../context'
import { useHistory } from 'react-router-dom';
import { authRoutes } from '../../routes';


const useStyles = makeStyles(theme => ({
    button: {
        borderRadius: 20,
        maxWidth: 400, 
        minWidth: 300, 
        width: '100%'
    }
}))

const RestorePassword = ({id}) => {
    const { dictionary } = useLanguage()
    const [ password, setPassword ] = useState('')
    const [ confirmPassword, setConfirmPassword ] = useState('')
    const [ token, setToken ] = useState('')

    const classes = useStyles();
    const history = useHistory();

    useEffect(() => {
        setToken(id)
    }, [])

    const handleChange = (event) => {
        switch (event?.target?.name) {
            case 'password':
                return setPassword(event.target.value)
            case 'confirmPassword':
                return setConfirmPassword(event.target.value)
        }
    }

    const handleSubmit = async (event) => {
        if(password === confirmPassword) {
            event.preventDefault();
            const restorePasswordState = await authRoutes.restorePassword(password, token);
            alert(restorePasswordState.data.message);
            history.replace('/')

        }else{
            alert('Contraseñas ingresadas no coinciden')
        }

        //console.log(email);
        //let forgotPasswordState = await requestNewPassword();
        //console.log(forgotPasswordState)
    }

    const requestNewPassword = () => {
        alert('Servicio no disponible.')
        /* return new Promise(resolve=>{
            authRoutes.forgotPassword(email)
            .then(data=>{
                //console.log(data);
                resolve(data)
            })
            .catch(err=>{
                //console.log(err)
                resolve(err)
            })
        }) */
    }

    return (
        <Grid container style={{ padding: 20, height: '50%' }} alignItems='center' justifyContent='center'>
            <form onSubmit={handleSubmit}>
                <Grid container item spacing={2}>
                    <Grid item xs={12} container justifyContent='center' style={{paddingTop: 40}}>
                        <TextField
                            type='password'
                            name='password'
                            label={dictionary.restorePassword.passwordField}
                            value={password}
                            onChange={handleChange}
                            variant='outlined'
                            style={{maxWidth: 400, minWidth: 300, width: '100%'}}

                        />
                    </Grid>
                    <Grid item xs={12} container justifyContent='center' style={{paddingTop: 40}}>
                        <TextField
                            type='password'
                            name='confirmPassword'
                            label={dictionary.restorePassword.confirmPasswordField}
                            value={confirmPassword}
                            onChange={handleChange}
                            variant='outlined'
                            style={{maxWidth: 400, minWidth: 300, width: '100%'}}

                        />
                    </Grid>
                    <Grid item xs={12} container justifyContent='center' style={{paddingTop: 40}}>
                        <Button className={classes.button} type='submit' variant='contained' color='primary'>
                            {/* {dictionary.login.loginButton} */}
                            {dictionary.restorePassword.button}
                        </Button>
                    </Grid>
                    <Grid item xs={12} container justifyContent='center' style={{paddingTop: 40}}>
                        <Button className={classes.button} variant='contained' color='primary' onClick={()=>{history.replace('/')}}>
                            {dictionary.restorePassword.cancel}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Grid>
    )
}

export default RestorePassword