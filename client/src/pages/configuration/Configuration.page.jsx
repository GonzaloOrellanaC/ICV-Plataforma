import React from 'react'
import { Box, Card, Grid, ListItem, Button } from '@material-ui/core'
import { useStylesTheme } from '../../config'

const ConfigurationPage = () => {
    const classes = useStylesTheme()
    return (
        <Box height='100%'>
            <Grid className={'pageRoot'} container spacing={0}>
                <Grid className={classes.pageContainer} item xs={12}>
                    <Card elevation={0} className={'pageCard'}>
                        <Grid style={{flexShrink: 0}}>
                            <div style={{width: '100%', color: '#fff'}} >
                                <h1>Configuración</h1>
                            </div>
                        </Grid>
                        <Grid container spacing={1}>
                            <div style={{width: '30%'}}>
                                <div style={{textAlign: 'left', width: '100%', backgroundColor: 'rgba(255,  255,  255,  0.5)'}}>
                                    <ListItem button style={{width: '100%', textAlign: 'left'}}>
                                        <label style={{color: '#333',fontSize: 20, textAlign: 'left', fontWeight: 'bold'}}>Perfil</label>
                                    </ListItem>
                                    <ListItem button style={{width: '100%', textAlign: 'left'}}>
                                        <label style={{color: '#333',fontSize: 20, textAlign: 'left', fontWeight: 'bold'}}>Notificaciones</label>
                                    </ListItem>
                                    <ListItem button style={{width: '100%', textAlign: 'left'}}>
                                        <label style={{color: '#333',fontSize: 20, textAlign: 'left', fontWeight: 'bold'}}>Información</label>
                                    </ListItem>
                                    <ListItem button style={{width: '100%', textAlign: 'left'}}>
                                        <label style={{color: '#333',fontSize: 20, textAlign: 'left', fontWeight: 'bold'}}>Soporte</label>
                                    </ListItem>
                                </div>
                            </div>
                            <div style={{width: '70%', height: '35rem', overflowY: 'auto'}}>
                                <div style={{textAlign: 'left', height: '100%', width: '100%', backgroundColor: 'rgba(255,  255,  255,  0.5)'}}>
                                    <div style={{height: '50%'}}>
                                        
                                    </div>
                                </div>
                            </div>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

export default ConfigurationPage