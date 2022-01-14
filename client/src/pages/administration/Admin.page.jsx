import React, { useState } from 'react'
import { Box, Card, Grid, Toolbar, IconButton, Button } from '@material-ui/core'
import { ArrowBackIos } from '@material-ui/icons'
import { useStylesTheme } from '../../config'
import { CardButton } from '../../components/buttons'
import { useHistory } from 'react-router-dom'
import { useLanguage } from '../../context'

const AdminPage = () => {
    const classes = useStylesTheme();
    const history = useHistory()
    return (
        <Box height='100%'>
            <Grid className={classes.pageRoot} container spacing={0}>
                <Grid className={classes.pageContainer} item xs={12}>
                    <Card className={classes.pageCard}>
                        <Grid container alignItems='center' justifyContent='center'>
                            <div style={{width: '100%', textAlign: 'left', padding: 10 }}>
                                <div style={{width: '100%', textAlign: 'left', color: '#333', backgroundColor: '#fff', borderRadius: 20 }}>
                                    <Toolbar style={{paddingLeft: 0, backgroundColor: '#F9F9F9', borderRadius: 10}}>
                                        <IconButton onClick={() => setTimeout(() => {
                                            history.goBack()
                                        }, 500)}> 
                                            <ArrowBackIos style={{color: '#333', fontSize: 16}}/> 
                                        </IconButton> 
                                        <h1 style={{marginTop: 0, marginBottom: 0, fontSize: 16}}>
                                            Administración
                                        </h1>
                                    </Toolbar>
                                </div>
                            </div>
                        </Grid>
                        <Grid container alignItems='center' justifyContent='center'>
                            <Grid item xs={12} sm={12} md={6} lg={3}>
                                <CardButton variant='users'/>
                            </Grid>
                            {/* <div style={{width: '100%', textAlign: 'left', padding: 10 }}>
                                
                            </div>   */}      
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

export default AdminPage