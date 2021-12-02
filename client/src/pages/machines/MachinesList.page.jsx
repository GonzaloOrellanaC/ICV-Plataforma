import React, { useEffect, useState } from 'react'
import { Box, Card, Grid, Toolbar, IconButton, List, ListItem, ImageListItem, Modal, Button, Fab } from '@material-ui/core';
import { Close } from '@material-ui/icons'

import { useHistory, useParams } from 'react-router-dom'
import { useStylesTheme } from '../../config'
import { ArrowBackIos } from '@material-ui/icons'
import {  MVAvatar, PautaDetail } from '../../containers'

const MachinesListPage = ({route}) => {  
    const [ routeData, setRouteData ] = useState('');
    const [ machinesList, setMachinesList ] = useState([]);
    const [open, setOpen] = useState(false);

    const history = useHistory();
    const classes = useStylesTheme();
    const site = localStorage.getItem('sitio');

    let { id } = useParams();
    const machine = JSON.parse(id);
    const openCloseModal = () => {
        setTimeout(() => {
            setOpen(!open)
        }, 500);
    }

    const goToMachineDetail = (machineData) => {
        const newMachine = {
            id: machine.id,
            brand: machine.brand,
            model: machine.model,
            pIDPM: machine.pIDPM,
            type: machine.type,
            machineData: JSON.stringify(machineData)
        }
        history.replace(`machine-detail/${JSON.stringify(newMachine)}`)
    }

    const machines = [
        {
            id: 0,
            internalNumber: 342,
            hourmeter: 33345,
            mSerial: 123456,
        },
        {
            id: 1,
            internalNumber: 343,
            hourmeter: 33345,
            mSerial: 123456,
        },
        {
            id: 2,
            internalNumber: 345,
            hourmeter: 33345,
            mSerial: 123456,
        },
        {
            id: 3,
            internalNumber: 350,
            hourmeter: 33345,
            mSerial: 123456,
        }
    ]

    useEffect(() => {
        console.log(route)
        console.log(JSON.parse(id))
        if(!site) {
            history.goBack()
        }
        if(route === 'inspection') {
            setRouteData('Inspección')
        }else if(route === 'maintenance') {
            setRouteData('Mantención')
        }
        setMachinesList(machines)
    }, [])

    return(
        <Box height='100%'>
            <Grid className={classes.pageRoot} container spacing={0}>
                <Grid className={classes.pageContainer} item xs={12}>
                    <Card className={classes.pageCard}>
                        <Grid container alignItems='center' justifyContent='center'>
                            <div style={{width: '100%', textAlign: 'center', padding: 10 }}>
                                <div style={{width: '100%', textAlign: 'center', color: '#333', backgroundColor: '#fff', borderRadius: 20 }}>
                                    <Toolbar style={{paddingLeft: 0, backgroundColor: '#F9F9F9', borderRadius: 10,}}>
                                        <IconButton onClick={() => setTimeout(() => {
                                            history.goBack()
                                        }, 500)}> 
                                            <ArrowBackIos style={{color: '#333', fontSize: 16}}/> 
                                        </IconButton> 
                                        <p style={{marginTop: 0, marginBottom: 0, fontSize: 16}}>
                                            {`${routeData}/${site}/${machine.type} ${machine.brand} ${machine.model}`}
                                        </p>
                                    </Toolbar>
                                </div>
                            </div>
                            <List style={{width: '100vw', marginRight: 11, overflowY: 'scroll', maxHeight: '70vh', paddingLeft: 20, paddingRight: 20}}>
                            {
                                machinesList.map((e, i) => {
                                    return(
                                        <ListItem alignItems="flex-start" key={i} style={{minHeight: 148, marginBottom: 20, padding: 20, borderStyle: 'solid', borderWidth: 2, borderColor: '#CCC', borderRadius: 20}}>
                                            <div>
                                                <img src="../assets/no-image.png" style={{height: 120, width: '20vw', objectFit: 'cover'}} />
                                            </div>
                                            <div style={{marginLeft: 17, marginRight: 17}}>
                                                <h1 style={{margin: 0}}> <strong>Nombre Camión {e.internalNumber}</strong> </h1>
                                                <div style={{float: 'left', minWidth: 200}}>
                                                    <p style={{marginTop: 5, marginBottom: 5}}>Marca: ksjbhiusdbisbcdbsi</p>
                                                    <p style={{marginTop: 5, marginBottom: 5}}>Modelo: ksjbhiusdbisbcdbsi</p>
                                                    <p style={{marginTop: 5, marginBottom: 5}}>Código: {e.id}</p>
                                                </div>
                                                <div style={{float: 'left', minWidth: 200 }}>
                                                    <p style={{marginTop: 5, marginBottom: 5}}>Horómetro Actual: {e.internalNumber}</p>
                                                    <p style={{marginTop: 5, marginBottom: 5}}>Número Interno: {e.internalNumber}</p>
                                                    <p style={{marginTop: 5, marginBottom: 5}}>Serie motor: {e.mSerial}</p>
                                                </div>
                                                <div style={{float: 'left', minWidth: 200 }}>
                                                    <p style={{marginTop: 5, marginBottom: 5}}>Obra: Las Llaves</p>
                                                    <p style={{marginTop: 5, marginBottom: 5}}>Sector: C</p>
                                                    <p style={{marginTop: 5, marginBottom: 5}}>Región: Lorem Ipsum</p>
                                                </div>
                                                <div style={{float: 'right', minWidth: 200, height: 80}}>
                                                    <div style={{position: 'absolute', bottom: 25}}>
                                                        <button style={{width: 100, height: 30, borderRadius: 20}} onClick={openCloseModal}>
                                                            <strong>Ver 3D</strong>
                                                        </button>
                                                        <button style={{width: 100, height: 30, borderRadius: 20, marginLeft: 6}} onClick={() => goToMachineDetail(e)} /* component={Link} to={`/${route}/${JSON.stringify(machine)}` */>
                                                            <strong>Ver más</strong>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </ListItem>
                                    )
                                })
                            }
                            </List>
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
                                            <MVAvatar machine={machine}/>
                                            {/* <Test /> */}
                                            <Fab onClick={openCloseModal} style={{position: 'absolute', right: 10, top: 10, boxShadow: 'none', backgroundColor: 'transparent'}} color="primary">
                                                <Close />
                                            </Fab>
                                        </div>
                                        
                                    </Modal>
                            </div>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

export default MachinesListPage