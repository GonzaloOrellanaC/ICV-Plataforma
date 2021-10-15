import React from 'react'
import { Box, Card, Grid, Hidden } from '@material-ui/core'
import { useStylesTheme } from '../../config'
import clsx from 'clsx'

import { ResetPassword } from '../../containers'

const ResetPasswordPage = () => {
    const classes = useStylesTheme()
    return (
        <Box height='100%'>
            <Grid className={classes.pageRoot} container spacing={0}>
                <Grid className={classes.pageContainer} item xs={12} md={6}>
                    <Card className={clsx(classes.pageCard, classes.noNavBarMargin)}>
                        <ResetPassword />
                    </Card>
                </Grid>
                <Hidden smDown><Grid item xs={12} md={6}></Grid></Hidden>
            </Grid>
        </Box>
    )
}

export default ResetPasswordPage