import React from 'react'
import { Box, Card, Grid, Hidden, makeStyles } from '@material-ui/core'
import { Login } from '../../containers/login'

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%'
    },
    formSide: {
        height: '100%',
        [theme.breakpoints.down('sm')]: {
            padding: 10
        }
    },
    formCard: {
        height: '100%',
        backgroundColor: 'rgba(255,255,255, 0.8)',
        borderRadius: 0,
        boxShadow: 'none'
    }
}))

const LoginPage = () => {
    const classes = useStyles()

    return (
        <Box height='100%'>
            <Grid className={classes.root} container spacing={0}>
                <Hidden smDown><Grid item xs={12} md={6}></Grid></Hidden>
                <Grid className={classes.formSide} item xs={12} md={6}>
                    <Card className={classes.formCard}>
                        <Login />
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

export default LoginPage
