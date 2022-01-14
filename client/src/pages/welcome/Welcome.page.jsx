import React, { useState, useEffect } from 'react'
import { Grid } from '@material-ui/core'
import { environment } from '../../config'
import { CardButton } from '../../components/buttons'
import { apiIvcRoutes } from '../../routes'
import { FilesToStringDatabase, trucksDatabase, machinesDatabase, machinesImagesDatabase } from '../../indexedDB'
import { LoadingModal, VersionControlModal } from '../../modals'
import './style.css'
import getInfo from './getInfo'
import readDataSite from './readDataSite'
import get3dElement from './get3dElement'

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

    ////Notificaciones
    const [ notificaciones1, setNotificaciones1 ] = useState('Sin notificaciones')
    const [ notificaciones2, setNotificaciones2 ] = useState('Sin notificaciones')

    useEffect(() => {
        readData();
        readDataSite(
            setDisableButtons,
            setNotificaciones1,
            setNotificaciones2,
            setDisableButtonsNoSAP,
            setDisableIfNoMaintenance,
            setDisableIfNoInspection,
            setHora,
            setDate
        )    
    }, []);

    const readData = async () => {
        const revisarData = await getInfo.setIfNeedReadDataAgain(setDisableButtons, setNotificaciones1);
        const userRole = localStorage.getItem('role');
        if(revisarData) {
            setOpenLoader(true);
            if(userRole==='admin'||userRole==='superAdmin'||userRole==='sapExecutive') {
                setLoadingData('Descargando pautas de mantenimiento e inspección.');
                const estadoDescargaPautas = await getInfo.descargarPautas(setProgress);
                if(estadoDescargaPautas.state) {
                    setTimeout( async () => {
                        setLoadingData('Descargando datos de las obras.');
                        const responseSites = await getInfo.getSites(setProgress, setDisableButtons, setNotificaciones1);
                        setTimeout(async () => {
                            if(responseSites) {
                                setLoadingData('Descargando datos de las máquinas.')
                                setProgress(65)
                                const responseTrucks = await getTrucksList();
                                console.log(responseTrucks)
                                setTimeout(async() => {
                                    if(responseTrucks) {
                                        setLoadingData('Descargando lista de las máquinas de las obras.')
                                        setProgress(100)
                                        const getMachines = await getMachinesList();
                                        if(getMachines) {
                                            let n = 0;
                                            get3dElement(n, responseTrucks, setProgress, setOpenLoader, setLoadingData, setOpenVersion)
                                            /* if(!localStorage.getItem('version')) {
                                                setOpenVersion(true)
                                                localStorage.setItem('version', environment.version);
                                            } */
                                        }
                                    }else{
                                        setOpenLoader(false)
                                    }
                                }, 1000);
                            }else{
                                setOpenLoader(false)
                            }
                        }, 1000);
                    }, 1000);
                }
            }else{
                setLoadingData('Actualizando asignaciones.');
                const assignMentResolve = await getInfo.getAssignments(setProgress);
                console.log(assignMentResolve)
                if(assignMentResolve) {
                    setLoadingData('Descargando pautas de mantenimiento e inspección.');
                    const estadoDescargaPautas = await getInfo.descargarPautas(setProgress);
                    if(estadoDescargaPautas.state) {
                        setTimeout( async () => {
                            setLoadingData('Descargando datos de las obras.');
                            const responseSites = await getInfo.getSites(setProgress, setDisableButtons, setNotificaciones1);
                            setTimeout(async () => {
                                if(responseSites) {
                                    setLoadingData('Descargando datos de las máquinas.')
                                    setProgress(65)
                                    const responseTrucks = await getTrucksList();
                                    console.log(responseTrucks)
                                    setTimeout(async() => {
                                        if(responseTrucks) {
                                            setLoadingData('Descargando lista de las máquinas de las obras.')
                                            setProgress(100)
                                            const getMachines = await getMachinesList();
                                            if(getMachines) {
                                                let n = 0;
                                                get3dElement(n, responseTrucks, setProgress, setOpenLoader, setLoadingData, setOpenVersion)
                                                /* if(!localStorage.getItem('version')) {
                                                    setOpenVersion(true)
                                                    localStorage.setItem('version', environment.version);
                                                } */
                                            }
                                        }else{
                                            setOpenLoader(false)
                                        }
                                    }, 1000);
                                }else{
                                    setOpenLoader(false)
                                }
                            }, 1000);
                        }, 1000);
                    }
                }
            }
        }else{
            setOpenLoader(false)
        }
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
                            resolve(true)
                        }
                    } 
                });
            }
        })
    }

    const getTrucksList = () => {
        return new Promise(async resolve => {
            let machines = [];
            machines = await getMachines();
            let db = await trucksDatabase.initDbMachines();
            if(db) {
                machines.forEach(async (fileName, index) => {
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
                                machinesImagesDatabase.actualizar(image, dbToImages.database)
                            }
                            trucksDatabase.actualizar(fileName, db.database);
                            /* fileName.image = reader.result.replace("data:", "");
                            if(fileName.image) {
                                
                                
                            } */
                        }
                        reader.readAsDataURL(xhr.response);
                        
                        if(index === (machines.length - 1)) {
                            let respuestaConsulta = await consultTrucks(machines)
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
                //console.log('Error', err)
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
                            <CardButton variant='inspection' disableButton={disableButton || disableIfNoInspection}/>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={3}>
                            <CardButton variant='maintenance' disableButton={disableButton || disableIfNoMaintenance}/>
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
