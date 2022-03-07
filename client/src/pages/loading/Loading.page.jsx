import React from 'react'
import { Box, Card, CircularProgress, Grid } from '@material-ui/core'
import clsx from 'clsx'

import { useStylesTheme } from '../../config'

const LoadingPage = () => {
    const classes = useStylesTheme()

    return (
        <Box height='100%'>
            <Grid className={classes.pageRoot} container spacing={0}>
                <Grid className={classes.pageContainer} item xs={12}>
                    <Card elevation={0} className={clsx(classes.pageCard, classes.noNavBarMargin)}>
                        <Grid container style={{ height: '100%' }} alignItems='center' justifyContent='center'>
                            <Grid container item spacing={8} justifyContent='center'>
                                <Grid item>
                                    <CircularProgress size={200}/>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

export default LoadingPage
