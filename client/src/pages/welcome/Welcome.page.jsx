import React from 'react'
import { Box, Card, Grid } from '@material-ui/core'
import { useStylesTheme } from '../../config'
import { CardButton } from '../../components/buttons'

const WelcomePage = () => {
    const classes = useStylesTheme()
    return (
        <Box height='100%'>
            <Grid className={classes.pageRoot} container spacing={0}>
                <Grid className={classes.pageContainer} item xs={12}>
                    <Card className={classes.pageCard}>
                        <Grid container style={{ height: '100%' }} alignItems='center' justifyContent='center'>
                            <Grid container item spacing={5} justifyContent='center'>
                                <Grid item>
                                    <CardButton variant='inspection'/>
                                </Grid>
                                <Grid item>
                                    <CardButton variant='maintenance'/>
                                </Grid>
                            {/* </Grid>
                            <Grid container item spacing={5} justifyContent='center'> */}
                                <Grid item>
                                    <CardButton variant='reports'/>
                                </Grid>
                                <Grid item>
                                    <CardButton variant='configuration'/>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

export default WelcomePage
