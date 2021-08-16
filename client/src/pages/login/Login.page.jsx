import React from 'react'
import { Box, Card, Grid, Hidden } from '@material-ui/core'
import clsx from 'clsx'

import { Login } from '../../containers'
import { useStylesTheme } from '../../config'

const LoginPage = () => {
    const classes = useStylesTheme()

    return (
        <Box height='100%'>
            <Grid className={classes.pageRoot} container spacing={0}>
                <Hidden smDown><Grid item xs={12} md={6}></Grid></Hidden>
                <Grid className={classes.pageContainer} item xs={12} md={6}>
                    <Card className={clsx(classes.pageCard, classes.noNavBarMargin)}>
                        <Login />
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

export default LoginPage
