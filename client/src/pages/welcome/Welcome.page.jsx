import React, { useState, useEffect } from 'react'
import { Box, Card, Grid, Typography, Modal, Button } from '@material-ui/core'
import { environment, useStylesTheme } from '../../config'
import { CardButton } from '../../components/buttons'
import { apiIvcRoutes, reportsRoutes } from '../../routes'
import { /* pmsDatabase */ sitesDatabase, FilesToStringDatabase, trucksDatabase, machinesDatabase, pautasDatabase, reportsDatabase } from '../../indexedDB'
import { LoadingModal, VersionControlModal } from '../../modals'
import hour from './hour'
import fecha from './date'
import getMyReports from './getMyReports'
import './style.css'

//const styleWelcomePage = style;

const WelcomePage = () => {
    const classes = useStylesTheme();
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
        if(localStorage.getItem('sitio')) {
            setDisableButtons(false)
        }else{
            setNotificaciones1('Para navegar en la aplicación debe seleccionar una obra')
        }
        if((localStorage.getItem('role') === 'admin') || (localStorage.getItem('role') === 'sapExecutive')) {
            setDisableButtonsNoSAP(false);
        }else{
            setNotificaciones2('Solo Roles "Admin" o "Ejecutivo SAP" puede administrar usuarios.');
            if(localStorage.getItem('role') === 'maintenceOperator') {
                setDisableIfNoMaintenance(false)
            }else{
                setDisableIfNoMaintenance(true)
            };
            if(localStorage.getItem('role') === 'inspectionWorker') {
                setDisableIfNoInspection(false)
            }else{
                setDisableIfNoInspection(true)
            };
        }
        if(localStorage.getItem('version')) {
            if((localStorage.getItem('version') != environment.version)) {
                alert('Plataforma requiere actualización. Se cerrará sesión para actualizar el servicio.');
                logout()
            }
        }
        if(!localStorage.getItem('version')) {
            setOpenVersion(true)
            localStorage.setItem('version', environment.version);
        }
        setDate(fecha(Date.now()))
        setInterval(() => {
            setHora(hour(Date.now()))
        }, 100);
    }, []);

    const logout = async () => {
        window.localStorage.clear();
        window.location.reload();
        removeDatabases();
    }

    const removeDatabases = async () => {
        let databases = await window.indexedDB.databases();
        if(databases) {
            databases.forEach((database, index) => {
                window.indexedDB.deleteDatabase(database.name)
            })
        }
    }

    
    const setIfNeedReadDataAgain = async () => {
        return new Promise(async resolve => {
            if(navigator.onLine) {
                let sites = [];
                sites = await getSitesList();
                let db = await sitesDatabase.initDbObras();
                if(db) {
                    const response = await sitesDatabase.consultar(db.database);
                    if(response) {
                        if(sites.length == response.length) {
                            resolve(false)
                        }else{
                            resolve(true)
                        }
                    }
                }
            }else{
                resolve(false)
            }
        })
    }

    const readData = async () => {
        getAssignments();
        const revisarData = await setIfNeedReadDataAgain();
        const userRole = localStorage.getItem('role');
        if(userRole==='admin'||userRole==='superAdmin'||userRole==='sapExecutive') {
            
        }else{
            const reports = await getMyReports(localStorage.getItem('_id'));
            let db = await reportsDatabase.initDbReports();
            if(db) {
                reports.forEach((report, i) => {
                    report.idDatabase = i;
                    reportsDatabase.actualizar(report, db.database);
                    if(i == (reports.length - 1)) {
                    }
                })
                
            }
        }
        if(revisarData) {
            setOpenLoader(true)
            setLoadingData('Descargando pautas de mantenimiento e inspección.');
            const estadoDescargaPautas = await descargarPautas();
            if(estadoDescargaPautas.state) {
                setProgress(100)
                setTimeout( async () => {
                    setProgress(0)
                    setLoadingData('Descargando datos de las obras.');
                    setProgress(30)
                    const responseSites = await getSites();
                    setTimeout(async () => {
                        if(responseSites) {
                            setLoadingData('Descargando datos de las máquinas.')
                            setProgress(65)
                            const responseTrucks = await getTrucksList();
                            setTimeout(async() => {
                                if(responseTrucks) {
                                    setLoadingData('Descargando lista de las máquinas de las obras.')
                                    setProgress(100)
                                    const getMachines = await getMachinesList();
                                    if(getMachines) {
                                        setTimeout(async () => {
                                            let n = 0;
                                            await get3dElement(n, responseTrucks)
                                        }, 1000);
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
            setOpenLoader(false)
        }
        
    }

    const descargarPautas = () => {
        return new Promise(async resolve => {
            const pautas = await getPautas();
            if(pautas) {
                pautas.forEach(async (pauta, number ) => {
                    setProgress(30);
                    const response = await getHeader(pauta);
                    pauta.header = response;
                    pauta.id = number;
                    if(number == (pautas.length - 1)) {
                        let numberProgress1 = progress
                        pautas.forEach(async (pa, n) => {
                            setProgress(65)
                            const res = await getStructs(pa)
                            pa.struct = res;
                            //console.log(pa);
                            if(n == (pautas.length - 1)) {
                                let numberProgress2 = progress
                                const db = await pautasDatabase.initDbPMs();
                                if(db) {
                                    pautas.forEach(async (p, i) => {
                                        setProgress(78)
                                        await pautasDatabase.actualizar(p, db.database);
                                        if(i == (pautas.length - 1)) {

                                            resolve({
                                                progress: progress,
                                                state: true
                                            })
                                        }
                                    })
                                }
                            }
                        })
    
                    }
                })
                
            }
        })
    }

    const get3dElement = async (number, trucks) => {
        if(number == (trucks.length)) {
            setTimeout(async () => {
                setProgress(100);
                setLoadingData('Recursos descargados');
                let db = await FilesToStringDatabase.initDb3DFiles();
                if(db) {
                    let databaseInfo = await FilesToStringDatabase.consultar(db.database);
                }
                setTimeout(() => {
                    setOpenLoader(false)
                }, 1000);
            }, 1000);
        }else{
            setLoadingData('Descargando Modelo 3D ' + (number + 1))
            const url3dTruck = await get3dMachines(trucks[number]);
            const { id, model, brand, type } = trucks[number];
            let res = await fetch(url3dTruck);
            const reader = res.body.getReader();
            const contentLength = +res.headers.get('Content-Length');
            let receivedLength = 0; // received that many bytes at the moment
            let chunks = []; // array of received binary chunks (comprises the body)
            setProgress(0);
            setTimeout(async () => {
                while (true) {
                    const ele = await reader.read();
                    if (ele.done) {
                        let chunksAll = new Uint8Array(receivedLength); // (4.1)
                        let position = 0;
                        for(let chunk of chunks) {
                            chunksAll.set(chunk, position); // (4.2)
                            position += chunk.length;
                        }
                        let result = new TextDecoder("utf-8").decode(chunksAll);
                        let db = await FilesToStringDatabase.initDb3DFiles();
                        if(db) {
                            let actualizado = await FilesToStringDatabase.actualizar({id: id, info: {model: model, brand: brand, type: type}, data: result}, db.database);
                            if(actualizado) {
                                number = number + 1;
                                get3dElement(number, trucks);
                            }
                        }
                        break;
                    }
                    chunks.push(ele.value);
                    receivedLength += ele.value.length;
                    setProgress((100*receivedLength)/contentLength)                    
                }
            }, 1000);
        }
    }

    const getSites = () => {
        return new Promise(async resolve => {
            let sites = [];
            sites = await getSitesList();
            let db = await sitesDatabase.initDbObras();
            if(db) {
                sites.forEach(async (fileName, index) => {
                    fileName.id = index;
                    await sitesDatabase.actualizar(fileName, db.database, db.database.version);
                    if(index === (sites.length - 1)) {
                        const response = await sitesDatabase.consultar(db.database);
                        if(response) {
                            resolve(true)
                        }
                    } 
                });
            }
        })
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
                            fileName.image = reader.result.replace("data:", "");
                            if(fileName.image) {
                                trucksDatabase.actualizar(fileName, db.database);
                            }
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
    
    const getHeader = (pauta) => {
        return new Promise(resolve => {
            apiIvcRoutes.getHeaderPauta(pauta)
            .then(data => {
                resolve(data.data)
            })
            .catch(err => {
                //console.log('Error', err)
            })
        })
    }

    const getStructs = (pauta) => {
        return new Promise(resolve => {
            apiIvcRoutes.getStructsPauta(pauta)
            .then(data => {
                resolve(data.data)
            })
            .catch(err => {
                //console.log('Error', err)
            })
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

    const getPMlist = () => {
        return new Promise(resolve => {
            apiIvcRoutes.getPMList()
            .then(data => {
                resolve(data.data)
            })
            .catch(err => {
                //console.log('Error', err)
            })
        })
    }

    const getPautas = () => {
        return new Promise(resolve => {
            apiIvcRoutes.getPautas()
            .then(data => {
                resolve(data.data)
            })
            .catch(err => {
                //console.log('Error', err)
            })
        })
    }

    const closeModal = () => {
        setOpenVersion(false)
    }

    //Obras o sitios desde la base de datos
    const getSitesList = () => {
        return new Promise(resolve => {
            apiIvcRoutes.getSites()
            .then(data => {
                if((localStorage.getItem('role') === 'admin') || (localStorage.getItem('role') === 'sapExecutive')) {
                    localStorage.setItem('sitio', JSON.stringify(data.data[0]));
                    setTimeout(() => {
                        setDisableButtons(false)
                        setNotificaciones1('Sin notificaciones')
                    }, 500);
                }
                resolve(data.data)
            })
            .catch(err => {
                //console.log('Error', err)
            })
        })
    }

    const get3dMachines = (machine) => {
        let newMachine;
        return new Promise(resolve => {
            if(machine.type === 'Camión') {
                newMachine = environment.storageURL + 'maquinas/camiones/' + machine.brand.toUpperCase() + '/' + machine.brand.toUpperCase() + '_' + machine.model + '_' + 'Preview.gltf'
            }else if(machine.type === 'Pala') {
                newMachine = environment.storageURL + 'maquinas/palas/' + machine.brand.toUpperCase() + '/' + machine.brand + '_' + machine.model + '_' + 'Preview.gltf'
            }
            resolve(newMachine)
        })
    }

    const getAssignments = () => {
        reportsRoutes.findMyAssignations(localStorage.getItem('_id')).then(data => {
            console.log(data.data)
        })
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
            <LoadingModal open={openLoader} progress={progress} loadingData={loadingData} withProgress={true}/>
            <VersionControlModal open={openVersion} closeModal={closeModal} />
        </div>
    )
}

export default WelcomePage
