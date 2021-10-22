import React from 'react'
import { Box, Card, Grid, List, ListItem, Toolbar, IconButton, Button } from '@material-ui/core'
import { Close, ArrowBackIos } from '@material-ui/icons'
import { useStylesTheme } from '../../config'
import { CardButton, SiteButton } from '../../components/buttons'



const UserPage = () => {
    const classes = useStylesTheme();


    return (
        <Box height='100%'>
            <Grid className={classes.pageRoot} container spacing={0}>
                <Grid className={classes.pageContainer} item xs={12}>
                    <Card className={classes.pageCard}>
                        <Grid container style={{ height: '100%' }} alignItems='center' justifyContent='center'>
                            
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

export default UserPage