import React, { useState } from 'react'

import { Button, Grid, Link, makeStyles, TextField } from '@material-ui/core'
import { useAuth, useLanguage } from '../../context'
import { authRoutes } from '../../routes'

const useStyles = makeStyles(theme => ({
    button: {
        borderRadius: 20
    }
}))

const ResetPassword = () => {
    const { dictionary } = useLanguage()
    const { login } = useAuth()
    const [email, setEmail] = useState('')

    const classes = useStyles()

    const handleChange = (event) => {
        switch (event?.target?.name) {
        case 'email':
            return setEmail(event.target.value)
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        console.log(email);
        let forgotPasswordState = await requestNewPassword();
        console.log(forgotPasswordState)
    }

    const requestNewPassword = () => {
        return new Promise(resolve=>{
            authRoutes.forgotPassword(email)
            .then(data=>{
                console.log(data);
                resolve(data)
            })
            .catch(err=>{
                console.log(err)
                resolve(err)
            })
        })
    }

    return (
        <Grid container style={{ padding: 20, height: '100%' }} alignItems='center' justifyContent='center'>
            <form onSubmit={handleSubmit}>
                <Grid container item spacing={2}>
                    <Grid item xs={12} container justifyContent='center'>
                        <TextField
                            type='email'
                            name='email'
                            label={dictionary.login.emailField}
                            value={email}
                            onChange={handleChange}
                            variant='outlined'
                        />
                    </Grid>
                    <Grid item xs={12} container justifyContent='center'>
                        <Button className={classes.button} type='submit' variant='contained' color='primary'>
                            {dictionary.login.loginButton}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Grid>
    )
}

export default ResetPassword