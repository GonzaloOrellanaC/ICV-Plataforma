import React, { useState } from 'react'

import { Button, Grid, Link, makeStyles, TextField } from '@material-ui/core'
import { useAuth, useLanguage } from '../../context'
import { authRoutes } from '../../routes'
import { useNavigate } from 'react-router-dom';
import { LoadingModal } from '../../modals';


const useStyles = makeStyles(theme => ({
    button: {
        borderRadius: 20,
        maxWidth: 400, 
        minWidth: 300, 
        width: '100%'
    }
}))

const ResetPassword = () => {
    const { dictionary } = useLanguage()
    const { login } = useAuth()
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)

    const classes = useStyles();
    const navigate = useNavigate();

    const handleChange = (event) => {
        switch (event?.target?.name) {
        case 'email':
            return setEmail(event.target.value)
        }
    }

    const handleSubmit = async (event) => {
        /* setLoading(true) */
        try{
            event.preventDefault()
            let forgotPasswordState = await requestNewPassword();
            console.log(forgotPasswordState)
            if(forgotPasswordState.data.status) {
                if(forgotPasswordState.data.status === 'no-email') {
                    alert(forgotPasswordState.data.message);
                    setLoading(false)
                }
            }else{
                alert(forgotPasswordState.data.message);
                setLoading(false)
                navigate.replace('/')
            }
        }catch (err) {
            console.log('No se pudo obtener el reset')
        }
    }

    const requestNewPassword = () => {
        return new Promise(resolve=>{
            authRoutes.forgotPassword(email)
            .then(data=>{
                resolve(data)
            })
            .catch(err=>{
                resolve(err)
            })
        })
    }

    return (
        <Grid container style={{ padding: 20, height: '50%' }} alignItems='center' justifyContent='center'>
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
                        <Button className={classes.button} type='submit' variant='contained' color='primary'>
                            SOLICITAR
                        </Button>
                    </Grid>
                    <Grid item xs={12} container justifyContent='center' style={{paddingTop: 40}}>
                        <Button className={classes.button} variant='contained' color='primary' onClick={()=>{navigate(-1)}}>
                            VOLVER
                        </Button>
                    </Grid>
                </Grid>
            </form>
            {
                loading && <LoadingModal open={loading} loadingData={'Solicitando restablecer contraseña'} withProgress={false}/>
            }
        </Grid>
    )
}

export default ResetPassword