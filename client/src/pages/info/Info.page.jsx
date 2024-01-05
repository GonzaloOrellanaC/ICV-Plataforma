import React from 'react'
import { Box, Card, Grid } from '@mui/material'
import { useStylesTheme } from '../../config'

const InfoPage = () => {
    const classes = useStylesTheme()
    return (
        <Box height='100%'>
            <Grid className={'pageRoot'} container spacing={0}>
                <Grid className={classes.pageContainer} item xs={12}>
                    <Card elevation={0} className={'pageCard'}>
                        
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

export default InfoPage