import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Card, Grid, makeStyles, Modal, Button, IconButton, Fab, Toolbar } from '@material-ui/core'
import { Close, ArrowBackIos } from '@material-ui/icons'
import {
    useParams
  } from "react-router-dom";
import { useStylesTheme } from '../../config'
import { useHistory } from 'react-router-dom'
//import clsx from 'clsx'
import { VRAvatar, VRAvatarPreview } from '../../containers'

/* const useStyles = makeStyles((theme) => ({
    root: {
        padding: 20,
        backgroundColor: 'rgba(0, 0, 0, 0)',
        border: '5px solid gray',
        borderRadius: 0,
        boxShadow: 'none'
    },
    fichaText: {
        fontSize: '1.2rem',
        color: theme.palette.primary.main
    },
    name: {
        fontWeight: 'bold'
    }
})) */

const AppliancePage = ({ route }) => {
    const classes = useStylesTheme()
    const [open, setOpen] = useState(false);
    
    let { id } = useParams();
    const machine = JSON.parse(id);

    const openCloseModal = () => {
        setTimeout(() => {
            setOpen(!open)
        }, 500);
    }

    let site = localStorage.getItem('sitio');

    const history = useHistory()

    if(!site) {
        history.goBack()
    }

    let routeData;

    //console.log(route);

    if(route === 'inspection') {
        routeData = 'Inspección'
    }else if(route === 'maintenance') {
        routeData = 'Mantención'
    }

    
    return (
        <Box height='100%'>
            <Grid className={classes.pageRoot} container spacing={0}>
                <Grid className={classes.pageContainer} item xs={12}>
                    <Card className={classes.pageCard}>
                        <Grid container alignItems='center' justifyContent='center'>
                            <div style={{width: '100%', textAlign: 'left', padding: 10 }}>
                                <div style={{width: '100%', textAlign: 'left', color: '#333', backgroundColor: '#fff', borderRadius: 20 }}>
                                    <Toolbar style={{paddingLeft: 0}}>
                                        <IconButton onClick={() => setTimeout(() => {
                                            history.goBack()
                                        }, 500)}> 
                                            <ArrowBackIos style={{color: '#333', fontSize: 35}}/> 
                                        </IconButton> 
                                        <h1 style={{marginTop: 0, marginBottom: 0}}>
                                            {routeData}/{site}/{machine.type} {machine.brand} {machine.model}
                                        </h1>
                                    </Toolbar>
                                </div>
                            </div>
                            <Grid container>
                                <div style={{width: '30%', textAlign: 'left', padding: 10}}>
                                    <div style={{padding: 15, borderTopLeftRadius: 20, borderEndStartRadius: 20, backgroundColor: '#fff', minHeight: 550}}>
                                        <h3 style={{marginTop: 5, marginBottom: 5}}>{machine.type}</h3>
                                        <div style={{position: 'relative', zIndex: '1', width: '100%', height: 200, backgroundColor: 'transparent'}}>
                                            <VRAvatarPreview machine={machine}/>                                        
                                        </div>
                                        
                                        <Button onClick={openCloseModal} style={{marginTop: -260, position: 'relative', zIndex:'100', width: '100%', height: 250, backgroundColor: 'transparent'}}>
                                                
                                        </Button>
                                            
                                        <div style={{width: '100%'}}>
                                            <p style={{marginTop: 5, marginBottom: 5}}><b>Marca: </b> {machine.brand} </p>
                                        </div>
                                        <div style={{width: '100%'}}>
                                            <p style={{marginTop: 5, marginBottom: 5}}><b>Modelo: </b> {machine.model} </p>
                                        </div>
                                        <div style={{width: '100%'}}>
                                            <p style={{marginTop: 5, marginBottom: 5}}><b>Código: </b> {machine.id} </p>
                                        </div>
                                        <div style={{width: '100%'}}>
                                            <p style={{marginTop: 5, marginBottom: 5}}><b>Horómetro Actual: </b> 325,9 Km </p>
                                        </div>
                                        <div style={{width: '100%'}}>
                                            <p style={{marginTop: 5, marginBottom: 5}}><b>Número Interno: </b> 119 </p>
                                        </div>
                                        <div style={{width: '100%'}}>
                                            <p style={{marginTop: 5, marginBottom: 5}}><b>Información: </b> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua </p>
                                        </div>
                                        <div style={{width: '100%'}}>
                                            <p style={{marginTop: 5, marginBottom: 5}}><b>Última Mantención: </b> 12/10/2021 </p>
                                        </div>
                                        <div style={{width: '100%'}}>
                                            <p style={{marginTop: 5, marginBottom: 5}}><b>Último Inspector: </b> Juan Pérez </p>
                                        </div>
                                    </div>
                                </div>
                                <div style={{width: '70%', padding: 10}}>
                                    <div style={{padding: 30, borderEndEndRadius: 20, borderTopRightRadius: 20, backgroundColor: '#fff', height: '100%'}}>

                                    </div>
                                </div>
                                
                                <div>
                                    <Modal
                                        open={open}
                                        close={!open}
                                        //onClose={handleClose}
                                        aria-labelledby="modal-modal-title"
                                        aria-describedby="modal-modal-description"
                                    >
                                        <div style={{height: '100%', width: '100%', backgroundColor: '#333'}}>
                                            <VRAvatar machine={machine}/>
                                            <Fab onClick={openCloseModal} style={{position: 'absolute', right: 10, top: 10, boxShadow: 'none', backgroundColor: 'transparent'}} color="primary">
                                                <Close />
                                            </Fab>
                                        </div>
                                    </Modal>
                                </div>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Box>
        
    )
}

AppliancePage.propTypes = {
    route: PropTypes.oneOf(['inspection', 'maintenance'])
}

export default AppliancePage
