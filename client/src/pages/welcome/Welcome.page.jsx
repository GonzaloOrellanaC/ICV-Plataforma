import React, { useState, useEffect } from 'react'
import { Grid } from '@material-ui/core'
import { CardButton } from '../../components/buttons'
import { apiIvcRoutes } from '../../routes'
import { trucksDatabase, machinesDatabase, machinesImagesDatabase } from '../../indexedDB'
import { LoadingModal, VersionControlModal } from '../../modals'
import './style.css'
import getInfo from './getInfo'
import readDataSite from './readDataSite'
import readData from './readData'
import Files from './3dFiles'
import { useHistory } from 'react-router-dom'

const WelcomePage = () => {
    const [ date, setDate ] = useState('')
    const [ hora, setHora ] = useState('')
    const [ openLoader, setOpenLoader ] = useState(false);
    const [ openVersion, setOpenVersion ] = useState(false);
    const [ progress, setProgress ] = useState(0)
    const [ loadingData, setLoadingData ] = useState('')
    const [ disableButton, setDisableButtons ] = useState(true)
    const [ disableButtonNoSAP, setDisableButtonsNoSAP ] = useState(true);
    const [ disableIfNoMaintenance, setDisableIfNoMaintenance ] = useState(false);
    const [ disableIfNoInspection, setDisableIfNoInspection ] = useState(false);
    const [ network, setIfHavNetwork ] = useState(true);

    ////Notificaciones
    const [ notificaciones1, setNotificaciones1 ] = useState('Sin notificaciones')
    const [ notificaciones2, setNotificaciones2 ] = useState('Sin notificaciones')

    const [ cancel, setCancel ] = useState(true)
 
    const history = useHistory();

    window.addEventListener('online', () => {
        setIfHavNetwork(true);
        let last = Number(localStorage.getItem('timeOffline'))
        let now = Date.now();
        if(now < (last + 21600000)) {
            localStorage.setItem('revisado', true)
            localStorage.removeItem('timeOffline')
        }
    });

    window.addEventListener('offline', () => {
        setIfHavNetwork(false);
        if(!localStorage.getItem('timeOffline')) {
            setTimeOffline(Date.now())
        }
    });

    const setTimeOffline = (timestamp) => {
        localStorage.setItem('timeOffline', timestamp);
        localStorage.setItem('revisado', false)
    };

    const setLastActualization = () => {
        localStorage.setItem('ultimaActualizacion', Date.now())
    }

    useEffect(() => {
        if(cancel) {
            init()
        }
        return () => setCancel(false);
    }, [cancel]);

    const init = () => {
        readData(
            setOpenLoader,
            setLoadingData,
            getTrucksList,
            setProgress,
            getMachinesList,
            setLastActualization, 
            setDisableButtons, 
            setNotificaciones1,
            setOpenVersion,
            network
        );
        readDataSite(
            setDisableButtons,
            setNotificaciones1,
            setNotificaciones2,
            setDisableButtonsNoSAP,
            setDisableIfNoMaintenance,
            setDisableIfNoInspection,
            setHora,
            setDate
        );
    }

    const getMachinesList = () => {
        return new Promise(async resolve => {
            let machines = [];
            machines = await getAllMachines();
            let db = await machinesDatabase.initDbMachines();
            if(db) {
                machines.forEach(async (machine, index) => {
                    machine.id = index;
                    await machinesDatabase.actualizar(machine, db.database);
                    if(index === (machines.length - 1)) {
                        const response = await machinesDatabase.consultar(db.database);
                        if(response) {
                            getInfo.getPautasInstepctList(setProgress, response)
                            resolve(response)
                        }
                    } 
                });
            }
        })
    }

    const getMachinesList_ = () => {
            let machines = Files;
            console.log(machines);
    }

    const getTrucksList = () => {
        return new Promise(async resolve => {
            let machines = [];
            machines = await getMachines();
            console.log(machines)
            let db = await trucksDatabase.initDbMachines();
            console.log(db)
            if(db) {
                machines.forEach(async (fileName, index) => {
                    console.log(fileName)
                    fileName.id = index;
                    var xhr = new XMLHttpRequest();
                    xhr.onload = async () => {
                        let reader = new FileReader();
                        reader.onload = async () => {
                            let dbToImages = await machinesImagesDatabase.initDbMachinesImages();
                            if(dbToImages) {
                                let image = {
                                    id: index,
                                    data: reader.result.replace("data:", "")
                                }
                                //console.log(image)
                                await machinesImagesDatabase.actualizar(image, dbToImages.database);
                                
                            }
                            let i = await trucksDatabase.actualizar(fileName, db.database);
                            console.log(i)
                            /* fileName.image = reader.result.replace("data:", "");
                            if(fileName.image) {
                                
                                
                            } */
                        }
                        reader.readAsDataURL(xhr.response);
                        
                        if(index == (machines.length - 1)) {
                            let respuestaConsulta = await consultTrucks(machines);
                            console.log(respuestaConsulta)
                            resolve(respuestaConsulta)
                        }
                    }
                    xhr.open('GET', `/assets/${fileName.model}.png`);
                    xhr.responseType = 'blob';
                    xhr.send();
                });
            }
        })
    }

    const consultTrucks = (machines) => {
        return new Promise(async resolve=>{
            let database = await trucksDatabase.initDbMachines();
            let respuestaConsulta;
            do {
                respuestaConsulta = await trucksDatabase.consultar(database.database);
            }
            while (respuestaConsulta.length < machines.length)
            if(respuestaConsulta.length === machines.length) {
                resolve(respuestaConsulta)
            }
        })
    }

    const getMachines = () => {
        return new Promise(resolve => {
            apiIvcRoutes.getMachines()
            .then(data => {
                resolve(data.data)
            })
            .catch(err => {
                console.log('Error', err)
            })
        })
    }

    const getAllMachines = () => {
        return new Promise(resolve => {
            apiIvcRoutes.getAllMachines()
            .then(data => {
                resolve(data.data)
            })
        })
    }

    const removeAccents = (str) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    const closeModal = () => {
        setOpenVersion(false)
    }

    return (
        <div>
            <div className='container'>
                <Grid container spacing={5}>
                    <div>
                        <p className='titulo'>Hola {localStorage.getItem('name')} ¿Por dónde quieres comenzar hoy?</p>
                    </div>
                </Grid>
                <Grid container spacing={5}>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                        <div className='notificaciones reloj'>
                            <p className='reloj-fecha'> {date} </p>
                            <p className='reloj-hora'> {hora} hs </p>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                        <div className='notificaciones alertas'>
                            <p className='notificaciones-texto'> {notificaciones1} </p>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                        <div className='notificaciones alertas'>
                            <p className='notificaciones-texto'> {notificaciones2}</p>
                        </div>
                    </Grid>
                </Grid>
                <br />
                <Grid container spacing={5}>
                        <Grid item xs={12} sm={12} md={6} lg={3}>
                            <CardButton variant='assignment' disableButton={disableButton}/>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={3}>
                            <CardButton variant='machines' disableButton={disableButton}/>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={3}>
                            <CardButton variant='reports' disableButton={disableButtonNoSAP}/>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={3}>
                            <CardButton variant='administration' disableButton={disableButtonNoSAP}/>
                        </Grid>
                        
                </Grid>
            </div>
            {/* <IAModal open={true}/> */}
            <LoadingModal open={openLoader} progress={progress} loadingData={loadingData} withProgress={true}/>
            <VersionControlModal open={openVersion} closeModal={closeModal} />
        </div>
    )
}

export default WelcomePage
