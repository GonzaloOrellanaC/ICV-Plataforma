import React, { useState } from 'react'

import { Button, Grid, Link, makeStyles, TextField } from '@material-ui/core'
import { useAuth, useLanguage } from '../../context'

const useStyles = makeStyles(theme => ({
    button: {
        borderRadius: 20
    }
}))

const Login = () => {
    const { dictionary } = useLanguage()
    const { login } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const classes = useStyles()

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
        let data = await login(email, password);
        console.log(data)
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
                        <TextField
                            type='password'
                            name='password'
                            label={dictionary.login.passwordField}
                            value={password}
                            onChange={handleChange}
                            variant='outlined'
                        />
                    </Grid>
                    <Grid item xs={12} container justifyContent='center'>
                        <Button className={classes.button} type='submit' variant='contained' color='primary'>
                            {dictionary.login.loginButton}
                        </Button>
                    </Grid>
                    <Grid item xs={12} container justifyContent='center'>
                        {dictionary.login.forgotPasswordText} <Link href="/reset-password" >{dictionary.login.forgotPasswordLink}</Link>
                    </Grid>
                </Grid>
            </form>
        </Grid>
    )
}

export default Login
