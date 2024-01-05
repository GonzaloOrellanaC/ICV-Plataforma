import React from 'react'
import { Box, Card, Grid } from '@mui/material'
import { useStylesTheme } from '../../config'
import { CardButton } from '../../components/buttons'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context'

const NoPermissionPage = () => {
    const classes = useStylesTheme();
    const navigate = useNavigate()
    return (
        <Box height='100%'>
            <Grid className={'pageRoot'} container spacing={0}>
                <Grid className={classes.pageContainer} item xs={12}>
                    <Card elevation={0} className={'pageCard'}>
                        <Grid container alignItems='center' justifyContent='center'>
                            <div style={{width: '100%', textAlign: 'left', padding: 10 }}>
                                <h1>Sin permiso de acceso</h1>
                            </div>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

export default NoPermissionPage