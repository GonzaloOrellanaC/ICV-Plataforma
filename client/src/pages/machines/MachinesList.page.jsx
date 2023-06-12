import React, { useEffect, useState } from 'react';
import { Box, Card, Grid, Toolbar, IconButton, List, Modal, Fab } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { styleModal3D, useStylesTheme } from '../../config';
import { ArrowBackIos } from '@material-ui/icons';
import { MVAvatar } from '../../containers';
import { LoadingPage } from '../loading';
import { useAuth, useMachineContext } from '../../context';

const MachinesListPage = ({route}) => {  
    const {machinesBySite, setMachineSelected} = useMachineContext()
    const [ routeData, setRouteData ] = useState('');
    const [ machinesList, setMachinesList ] = useState([]);
    const [open, setOpen] = useState(false);
    const [showMachinesList, setShowMachinesList] = useState(false)
    const [machine, setMachine] = useState()

    const navigate = useNavigate();
    const classes = useStylesTheme();

    let { id } = useParams();

    useEffect(() => {
        setMachine(JSON.parse(id))
    },[])

    useEffect(() => {
        if(route === 'inspection') {
            setRouteData('Inspección')
        }else if(route === 'maintenance') {
            setRouteData('Mantención')
        }else if(route === 'machines') {
            setRouteData('Máquinas')
        }
    },[route])

    useEffect(() => {
        if (machinesBySite.length > 0 && machine) {
            const machinesTemps = machinesBySite.filter(machine => {if(machine.model === JSON.parse(id).model) { return machine}})
            .sort((a, b) => {return a.equ - b.equ})
            setMachinesList(machinesTemps)
            setShowMachinesList(true)
        }
    }, [machinesBySite, machine])

    const goToMachineDetail = (machineData) => {
        setMachineSelected(machineData)
        navigate(`machine-detail/${machineData.equid}`)
    }

    const closeModal = () => {
        setOpen(false)
    }

    return(
        <Box height='100%'>
            <Grid className={'pageRoot'} container spacing={0}>
                <Grid className={classes.pageContainer} item xs={12}>
                    <Card elevation={0} className={'pageCard'}>
                        {machine && <Grid container alignItems='center' justifyContent='center'>
                            <div style={{width: '100%', textAlign: 'center', padding: 10 }}>
                                <div style={{width: '100%', textAlign: 'center', color: '#333', backgroundColor: '#fff', borderRadius: 20 }}>
                                    <Toolbar style={{paddingLeft: 0, backgroundColor: '#F9F9F9', borderRadius: 10,}}>
                                        <IconButton onClick={() => setTimeout(() => {
                                            navigate(-1)
                                        }, 500)}> 
                                            <ArrowBackIos style={{color: '#333', fontSize: 16}}/> 
                                        </IconButton> 
                                        <p style={{marginTop: 0, marginBottom: 0, fontSize: 16}}>
                                            {machine && `${routeData}/${machine.type} ${machine.brand} ${machine.model}`}
                                        </p>
                                    </Toolbar>
                                </div>
                            </div>
                            <div style={{width: '100%', paddingLeft: 20, height: 40, textAlign: 'center'}}>
                                {
                                    (machine.model === '793-F' || machine.model === 'PC5500')
                                    &&
                                    <button style={{height: 30, borderRadius: 20, position: 'relative', right: 10, paddingLeft: 30, paddingRight: 30}} onClick={() => openCloseModal()}>
                                    <strong>{`Ver modelo 3D de ${machine.type} ${machine.brand} ${machine.model}`}</strong>
                                </button>}
                            </div>
                            <List style={{width: '100vw', marginRight: 11, overflowY: 'scroll', maxHeight: '70vh', paddingLeft: 20, paddingRight: 20}}>
                            {
                                !showMachinesList
                                &&
                                <LoadingPage />
                            }
                            {
                                showMachinesList && machinesList.map((machine, i) => {
                                    return(
                                        
                                            <Grid key={i} container style={{minHeight: 148, marginBottom: 20, padding: 20, borderStyle: 'solid', borderWidth: 2, borderColor: '#CCC', borderRadius: 20}}>
                                                <Grid item xs={12} sm={12} md={3} lg={2}>
                                                    <img src={machine.image ? machine.image : '../assets/no-image.png'} style={{height: 120, width: '100%', objectFit: 'cover'}} />
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
                                                    <p style={{marginTop: 5, marginBottom: 5}}>Horómetro Actual: {Number(machine.hourMeter)/3600000}</p>
                                                    <p style={{marginTop: 5, marginBottom: 5}}>Número Interno: {machine.equ}</p>
                                                    <p style={{marginTop: 5, marginBottom: 5}}>Serie motor: {machine.enginesnr}</p>
                                                    </div>
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={12} lg={2}>
                                                    <div style={{width: '100%', textAlign: 'center'}} >
                                                        <button style={{width: 100, height: 30, borderRadius: 20, marginLeft: 6}} onClick={() => goToMachineDetail(machine)}  /* component={Link} to={`/${route}/${JSON.stringify(machine)}` */ >
                                                            <strong>Ver más</strong>
                                                        </button>
                                                    </div>
                                                </Grid>
                                            </Grid>
                                    )
                                })
                            }
                            {
                                ((machinesList.length === 0) && showMachinesList)
                                &&
                                <Grid container style={{minHeight: 148, marginBottom: 20, padding: 20, borderStyle: 'solid', borderWidth: 2, borderColor: '#CCC', borderRadius: 20}}>
                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                        <p>Obra no gestiona máquina seleccionada.</p>
                                    </Grid>
                                </Grid>
                            }
                            </List>
                            <div>
                                <Modal
                                    open={open}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                >
                                    <Box sx={styleModal3D}>
                                        <MVAvatar machine={machine}/>
                                        <Fab onClick={() => closeModal()} style={{position: 'absolute', right: 10, top: 10, boxShadow: 'none', backgroundColor: 'transparent'}} color="primary">
                                            <Close />
                                        </Fab>
                                    </Box>
                                    
                                </Modal>
                            </div>
                        </Grid>}
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

export default MachinesListPage