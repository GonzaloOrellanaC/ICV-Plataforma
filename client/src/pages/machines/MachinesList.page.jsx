import React, { useEffect, useState } from 'react';
import { Box, Card, Grid, Toolbar, IconButton, List, Modal, Fab } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { useHistory, useParams } from 'react-router-dom';
import { useStylesTheme } from '../../config';
import { ArrowBackIos } from '@material-ui/icons';
import { MVAvatar } from '../../containers';
import { machinesDatabase } from '../../indexedDB';

const MachinesListPage = ({route}) => {  
    const [ routeData, setRouteData ] = useState('');
    const [ machinesList, setMachinesList ] = useState([]);
    const [open, setOpen] = useState(false);

    const history = useHistory();
    const classes = useStylesTheme();
    const site = JSON.parse(localStorage.getItem('sitio')).descripcion;
    const idobra = JSON.parse(localStorage.getItem('sitio')).idobra;

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

    const readAllMachinesFromIndexedDB = async (model) => {
        let db = await machinesDatabase.initDbMachines();
        if(db) {
            let readAllMachines = [] = await machinesDatabase.consultar(db.database);
            console.log(readAllMachines);
            setMachinesList(
                readAllMachines
                .filter(machine => {if(machine.model === model) { return machine}})
                .sort((a, b) => {return a.equ - b.equ})
            )
            
        }
    }


    useEffect(() => {
        console.log(route)
        console.log(JSON.parse(id));
        readAllMachinesFromIndexedDB(JSON.parse(id).model);
        if(!site) {
            history.goBack()
        }
        if(route === 'inspection') {
            setRouteData('Inspección')
        }else if(route === 'maintenance') {
            setRouteData('Mantención')
        }
        
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
                                machinesList.map((machine, i) => {
                                    return(
                                        
                                            <Grid key={i} container style={{minHeight: 148, marginBottom: 20, padding: 20, borderStyle: 'solid', borderWidth: 2, borderColor: '#CCC', borderRadius: 20}}>
                                                <Grid item xs={12} sm={12} md={3} lg={2}>
                                                    <img src="../assets/no-image.png" style={{height: 120, width: '100%', objectFit: 'cover'}} />
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={3} lg={2}>
                                                    <div style={{padding: 10}}>
                                                    <h1 style={{margin: 0}}> <strong>{machine.type} {machine.equ}</strong> </h1>
                                                    </div>
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={3} lg={3}>
                                                    <div style={{padding: 10}}>
                                                        <p style={{marginTop: 5, marginBottom: 5}}>Marca: {machine.brand.toUpperCase()}</p>
                                                        <p style={{marginTop: 5, marginBottom: 5}}>Modelo: {machine.model}</p>
                                                        <p style={{marginTop: 5, marginBottom: 5}}>Código: {machine.equid}</p>
                                                    </div>
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={3} lg={3}>
                                                    <div style={{padding: 10}}>
                                                    <p style={{marginTop: 5, marginBottom: 5}}>Horómetro Actual: {machine.hourMeter}</p>
                                                    <p style={{marginTop: 5, marginBottom: 5}}>Número Interno: {machine.equ}</p>
                                                    <p style={{marginTop: 5, marginBottom: 5}}>Serie motor: {machine.enginesnr}</p>
                                                    </div>
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={12} lg={2}>
                                                    <div style={{width: '100%', textAlign: 'center'}} >
                                                        <button style={{width: 100, height: 30, borderRadius: 20}} onClick={openCloseModal}>
                                                            <strong>Ver 3D</strong>
                                                        </button>
                                                        <button style={{width: 100, height: 30, borderRadius: 20, marginLeft: 6}} onClick={() => goToMachineDetail(machine)}  /* component={Link} to={`/${route}/${JSON.stringify(machine)}` */ >
                                                            <strong>Ver más</strong>
                                                        </button>
                                                    </div>
                                                </Grid>
                                            </Grid>
                                            
                                        
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