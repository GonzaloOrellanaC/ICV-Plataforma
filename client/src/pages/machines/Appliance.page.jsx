import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Box, Card, Grid, makeStyles, Modal, Button, IconButton, Fab, Toolbar } from '@material-ui/core'
import { Close, ArrowBackIos } from '@material-ui/icons'
import { useParams } from "react-router-dom";
import { useStylesTheme } from '../../config'
import { useHistory } from 'react-router-dom'
import { pmsDatabase } from "../../indexedDB"

import { MVAvatar, PautaDetail } from '../../containers'

const AppliancePage = ({ route }) => {
    const classes = useStylesTheme()
    const [open, setOpen] = useState(false);
    const [ pauta, setPauta ] = useState();
    //const [ machineData, setMachineDate ] = useState({})

    console.log(route)
    let { id } = useParams();
    const machine = JSON.parse(id);
    const machineData = JSON.parse(machine.machineData);
    const machineTo3D = {
        id: machine.id, 
        brand: machine.brand, 
        model: machine.model, 
        pIDPM: machine.pIDPM, 
        type: machine.type
    }
    console.log(machine);
    console.log(JSON.parse(machine.machineData))

    const openCloseModal = () => {
        setTimeout(() => {
            setOpen(!open)
        }, 500);
    }

    useEffect( () => {
        pmsDatabase.initDbPMs().then(async database => {
            console.log(database)
            let data = await pmsDatabase.obtener(machine.id, database.database)
            if(data) {
                setPauta(data);
                console.log(data)
            }
        })
    }, [])

    let site = localStorage.getItem('sitio');

    const history = useHistory()

    if(!site) {
        history.goBack()
    }

    let routeData;

    if(route === 'inspection/machine-detail') {
        routeData = 'Inspección'
    }else if(route === 'maintenance/machine-detail') {
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
                                    <Toolbar style={{paddingLeft: 0, backgroundColor: '#F9F9F9', borderRadius: 10}}>
                                        <IconButton onClick={() => setTimeout(() => {
                                            history.goBack()
                                        }, 500)}> 
                                            <ArrowBackIos style={{color: '#333', fontSize: 16}}/> 
                                        </IconButton> 
                                        <p style={{marginTop: 0, marginBottom: 0, fontSize: 16}}>
                                            {routeData}/{site}/{machine.type} {machine.brand} {machine.model}/{machineData.internalNumber}
                                        </p>
                                    </Toolbar>
                                </div>
                            </div>
                            <Grid container>
                                <div style={{width: '30%', textAlign: 'left', padding: 10}}>
                                    <div style={{padding: 15, borderTopLeftRadius: 20, borderEndStartRadius: 20, backgroundColor: '#F9F9F9', borderRadius: 10, minHeight: 400}}>
                                        <h3 style={{marginTop: 5, marginBottom: 5}}>{machine.type}</h3>
                                        <div style={{position: 'relative', zIndex: '1', width: '100%', height: 180, backgroundColor: 'transparent', textAlign: 'center'}}>
                                            <img src={`/assets/${machine.model}.png`} height={'100%'} />
                                            {/* <VRAvatarPreview machine={machine}/> */}                                        
                                        </div>
                                        
                                        {/* <Button onClick={openCloseModal} style={{marginTop: -260, position: 'relative', zIndex:'100', width: '100%', height: 250, backgroundColor: 'transparent'}}>
                                                
                                        </Button> */}
                                            
                                        <div style={{width: '100%'}}>
                                            <p style={{marginTop: 5, marginBottom: 5}}><b>Marca: </b> {machine.brand} </p>
                                        </div>
                                        <div style={{width: '100%'}}>
                                            <p style={{marginTop: 5, marginBottom: 5}}><b>Modelo: </b> {machine.model} </p>
                                        </div>
                                        <div style={{width: '100%'}}>
                                            <p style={{marginTop: 5, marginBottom: 5}}><b>Código: </b> {machineData.id} </p>
                                        </div>
                                        <div style={{width: '100%'}}>
                                            <p style={{marginTop: 5, marginBottom: 5}}><b>Horómetro Actual: </b> 325,9 Km </p>
                                        </div>
                                        <div style={{width: '100%'}}>
                                            <p style={{marginTop: 5, marginBottom: 5}}><b>Número Interno: </b> {machineData.internalNumber} </p>
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
                                <div style={{width: '70%', padding: 5}}>
                                    <div style={{height: 480, padding: 5, borderEndEndRadius: 20, borderTopRightRadius: 20, backgroundColor: '#fff'}}>
                                        {
                                            pauta && <PautaDetail height={300} pauta={pauta}/>
                                        }
                                    </div>
                                    <div style={{position: 'relative', bottom: 20, width: '100%'}}>
                                        <div style={{float: 'left', width: '50%', textAlign: 'left'}}>
                                            <button onClick={openCloseModal} style={{color: '#BB2D2D', borderColor: '#BB2D2D', height: 48, width: 160, borderRadius: 23, borderWidth: 2, fontSize: 20}}>
                                                <strong>Ver 3D</strong>
                                            </button>
                                        </div>
                                        <div style={{float: 'left', width: '50%', textAlign: 'right'}}>
                                            <button style={{borderColor: '#BB2D2D', backgroundColor: '#BB2D2D', color: '#fff', height: 48, width: 210, borderRadius: 23, borderWidth: 2, fontSize: 20}}>
                                                Finalizar Jornada
                                            </button>
                                        </div>
                                        
                                        
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
                                            {/* <VRAvatar machine={machine}/> */} 
                                            <MVAvatar machine={machineTo3D}/>
                                            {/* <Test /> */}
                                            <Fab onClick={openCloseModal} style={{position: 'absolute', right: 10, top: 10, boxShadow: 'none', backgroundColor: 'transparent'}}>
                                                <Close style={{color: '#ccc'}} />
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
    //route: PropTypes.oneOf(['inspection', 'maintenance'])
    route: PropTypes.oneOf(['inspection/machine-detail', 'maintenance/machine-detail'])
}

export default AppliancePage
