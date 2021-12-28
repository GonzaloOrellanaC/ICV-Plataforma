import React, { useState, useEffect } from 'react'
import { Box, Card, Grid, Typography, Modal, Button } from '@material-ui/core'
import { environment, useStylesTheme } from '../../config'
import { CardButton } from '../../components/buttons'
import { apiIvcRoutes } from '../../routes'
import { pmsDatabase, sitesDatabase, FilesToStringDatabase, trucksDatabase, } from '../../indexedDB'
import { LoadingModal, VersionControlModal } from '../../modals'
import hour from './hour'
import fecha from './date'
import style from './style'

const styleWelcomePage = style;

const WelcomePage = () => {
    const classes = useStylesTheme();
    const [ date, setDate ] = useState('')
    const [ hora, setHora ] = useState('')
    const [ openLoader, setOpenLoader ] = useState(false);
    const [ openVersion, setOpenVersion ] = useState(false);
    const [ progress, setProgress ] = useState(0)
    const [ loadingData, setLoadingData ] = useState('')
    const [ disableButton, setDisableButtons ] = useState(true)
    const [ disableButtonNoSAP, setDisableButtonsNoSAP ] = useState(true)

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
            setNotificaciones2('Solo Roles "Admin" o "Ejecutivo SAP" puede administrar usuarios.')
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
        setHora(hour(Date.now()))
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
                ////console.log(db)
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
        const revisarData = await setIfNeedReadDataAgain();
        console.log(revisarData)
        if(revisarData) {
            setOpenLoader(true)
            setLoadingData('Descargando datos de las obras.');
            setProgress(50)
            const responseSites = await getSites();
            setTimeout(async () => {
                if(responseSites) {
                    console.log(responseSites)
                    setLoadingData('Descargando datos de las máquinas.')
                    setProgress(100)
                    const responseTrucks = await getTrucksList();
                    if(responseTrucks) {
                        console.log(responseTrucks)
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
    }

    const get3dElement = async (number, trucks) => {
        if(number == (trucks.length)) {
            setTimeout(async () => {
                setProgress(100);
                setLoadingData('Recursos descargados');
                let db = await FilesToStringDatabase.initDb3DFiles();
                if(db) {
                    let databaseInfo = await FilesToStringDatabase.consultar(db.database);
                    console.log(databaseInfo)
                }
                setTimeout(() => {
                    setOpenLoader(false)
                }, 1000);
            }, 1000);
        }else{
            console.log(number, trucks)
            console.log(number, trucks.length)
            setLoadingData('Descargando Modelo 3D ' + (number + 1))
            const url3dTruck = await get3dMachines(trucks[number]);
            const { id, model, brand, type } = trucks[number];
            console.log(url3dTruck);
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
    
                        // Step 5: decode into a string
                        let result = new TextDecoder("utf-8").decode(chunksAll);
                        let db = await FilesToStringDatabase.initDb3DFiles();
                        console.log('Se actualiza')
                        if(db) {
                            let actualizado = await FilesToStringDatabase.actualizar({id: id, info: {model: model, brand: brand, type: type}, data: result}, db.database);
                            if(actualizado) {
                                console.log('Actualizada máquina id:' + number );
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
            //console.log(sites)
            let db = await sitesDatabase.initDbObras();
            ////console.log(db)
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

    const getTrucksList = () => {
        return new Promise(async resolve => {
            let machines = [];
            machines = await getMachines();
            let db = await trucksDatabase.initDbMachines();
            //console.log(db)
            if(db) {
                machines.forEach(async (fileName, index) => {
                    //console.log(fileName)
                    fileName.id = index;
                    var xhr = new XMLHttpRequest();
                    xhr.onload = async () => {
                        let reader = new FileReader();
                        reader.onload = async () => {
                            fileName.image = reader.result.replace("data:", "");
                            console.log(fileName);
                            if(fileName.image) {
                                trucksDatabase.actualizar(fileName, db.database);
                            }
                        }
                        reader.readAsDataURL(xhr.response);
                        
                        if(index === (machines.length - 1)) {
                            /* let database = await trucksDatabase.initDbMachines();
                            let respuestaConsulta = await trucksDatabase.consultar(database.database);
                            console.log(respuestaConsulta) */
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
            //let respuestaConsulta = await trucksDatabase.consultar(database.database);
            let respuestaConsulta;
            do {
                respuestaConsulta = await trucksDatabase.consultar(database.database);
                console.log(respuestaConsulta)
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

    const closeModal = () => {
        setOpenVersion(false)
    }

    //Obras o sitios desde la base de datos
    const getSitesList = () => {
        return new Promise(resolve => {
            apiIvcRoutes.getSites()
            .then(data => {
                //console.log(data.data);
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

    return (
        <Box height='100%' style={{fontFamily:'Raleway'}}>
            <Grid className={classes.pageRoot} container spacing={0}>
                <Grid className={classes.pageContainer} item xs={12}>
                    <Card className={classes.pageCard}>
                        <div style={{height: 70}}>
                            <p style={{fontSize: 24}}>Hola {localStorage.getItem('name')} ¿Por dónde quieres comenzar hoy?</p>
                        </div>
                        <Grid item style={{width: '100%', height: '14.5vh', margin: 'auto'}}>
                            <div style={styleWelcomePage.notificaciones1}>
                                <p style={{fontSize: '1.4vw', margin: 0}}> {notificaciones1} </p>
                            </div>
                            <div 
                                style={styleWelcomePage.notificaciones2}>
                                <p style={{fontSize: '1.4vw', margin: 0}}> {notificaciones2}</p>
                            </div>
                            <div 
                                style={styleWelcomePage.date}>
                                    <p style={{fontSize: '1vw', margin: 0}}> {date} </p>
                                    <p style={{fontSize: '2.7vw', margin: 0}}> {hora} hs </p>
                            </div>
                        </Grid>
                        <Grid container spacing={2}>
                                <CardButton variant='inspection' disableButton={disableButton}/>
                                <CardButton variant='maintenance' disableButton={disableButton}/>
                                <CardButton variant='reports'/>
                                <CardButton variant='administration' disableButton={disableButtonNoSAP}/>
                        </Grid>
                    </Card>
                    <LoadingModal open={openLoader} progress={progress} loadingData={loadingData} withProgress={true}/>
                    <VersionControlModal open={openVersion} closeModal={closeModal} />
                </Grid>
            </Grid>            
        </Box>
    )
}

export default WelcomePage
