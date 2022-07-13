import React, { useState, useEffect } from 'react'
import { Grid, LinearProgress } from '@material-ui/core'
import { CardButton } from '../../components/buttons'
import { apiIvcRoutes, notificationsRoutes } from '../../routes'
import { trucksDatabase, machinesDatabase, machinesImagesDatabase, imageDatabase, pautasDatabase, readyToSendReportsDatabase } from '../../indexedDB'
import { LoadingModal, VersionControlModal } from '../../modals'
import './style.css'
import getInfo from './getInfo'
import readDataSite from './readDataSite'
import readData from './readData'
import Files from './3dFiles'
import { useHistory } from 'react-router-dom'
import { dateWithTime, download3DFiles, imageToBase64 } from '../../config'
import addNotification from 'react-push-notification'
import { io } from "socket.io-client"

const WelcomePage = ({ readyToLoad }) => {
    const [ date, setDate ] = useState('')
    const [ hora, setHora ] = useState('')
    const [ openLoader, setOpenLoader ] = useState(false)
    const [ openVersion, setOpenVersion ] = useState(false)
    const [ progress, setProgress ] = useState(0)
    const [ loadingData, setLoadingData ] = useState('')
    const [ disableButton, setDisableButtons ] = useState(true)
    const [ disableButtonNoSAP, setDisableButtonsNoSAP ] = useState(true)
    const [ disableButtonNoAdmin, setDisableButtonNoAdmin ] = useState(true)
    const [ disableIfNoMaintenance, setDisableIfNoMaintenance ] = useState(false)
    const [ disableIfNoInspection, setDisableIfNoInspection ] = useState(false)
    const [ network, setIfHavNetwork ] = useState(true)
    const [ elementsReadyToSend, setElementsReadyToSend ] = useState([])

    ////Notificaciones
    const [ notificaciones1, setNotificaciones1 ] = useState('Sin notificaciones pendientes')
    const [ notificaciones2, setNotificaciones2 ] = useState('Sin informaciones pendientes')

    const [ cancel, setCancel ] = useState(true)

 
    const history = useHistory()

    window.addEventListener('online', () => {
        setIfHavNetwork(true)
        let last = Number(localStorage.getItem('timeOffline'))
        let now = Date.now()
        if(now < (last + 21600000)) {
            localStorage.setItem('revisado', true)
            localStorage.removeItem('timeOffline')
        }
    })

    const buttonClick = () => {
        addNotification({
            title: 'Warning',
            subtitle: 'This is a subtitle',
            message: 'This is a very long message',
            theme: 'darkblue',
            //native: true // when using native, your OS will handle theming.
        })
    }

    window.addEventListener('offline', () => {
        setIfHavNetwork(false)
        if(!localStorage.getItem('timeOffline')) {
            setTimeOffline(Date.now())
        }
    })

    const setTimeOffline = (timestamp) => {
        localStorage.setItem('timeOffline', timestamp)
        localStorage.setItem('revisado', false)
    }

    const setLastActualization = () => {
        localStorage.setItem('ultimaActualizacion', Date.now())
    }

    useEffect(async() => {
        /* setOpenDownload3D(true) */
        let db = await readyToSendReportsDatabase.initDb()
        let data2 = await readyToSendReportsDatabase.consultar(db.database)
        /* setElementsReadyToSend(data) */
        readNotifications(data2)
        if(cancel) {
            const socket = io()
            if (navigator.onLine) {
                socket.on(`notification_${localStorage.getItem('_id')}`, data => {
                    readNotifications()
                })
            }
            init()
            var xhr = new XMLHttpRequest()
            xhr.onload = async () => {
                let reader = new FileReader()
                reader.onload = async () => {
                    let dbImages = await imageDatabase.initDb()
                    if(dbImages) {
                        let image = {
                            name: 'no-image-profile',
                            data: reader.result.replace("data:", "")
                        }
                        await imageDatabase.actualizar(image, dbImages.database)
                    }
                }
                reader.readAsDataURL(xhr.response)
            }
            xhr.open('GET', '../assets/no-profile-image.png')
            xhr.responseType = 'blob'
            xhr.send()
        }
        return () => setCancel(false)
    }, [cancel])

    const readNotifications = (data2 = []) => {
        notificationsRoutes.getNotificationsById(localStorage.getItem('_id')).then(data => {
            let lista = []
            lista = data.data.reverse()
            if(lista.length > 0) {
                if(lista[0].state) {
                    setNotificaciones1('Sin notificaciones pendientes')
                } else {
                    setNotificaciones1(lista[0].message + '. \n ' + dateWithTime(lista[0].createdAt))
                }
                if(localStorage.getItem('role') === 'inspectionWorker' || localStorage.getItem('role') === 'maintenceOperator') {
                    if(data2.length > 0) {
                        setNotificaciones2('Existen ' + data2.length + ' Ordenes de trabajo listos a enviar.')
                    }else{
                        setNotificaciones2('Sin OT listas a enviar')
                    }
                }
            }
        })
    }

    const init = async () => {
        readData(
            setOpenLoader,
            setLoadingData,
            getTrucksList,
            setProgress,
            getMachinesList,
            setLastActualization, 
            setDisableButtons, 
            setOpenVersion,
            network,
            readyToLoad
        )
        readDataSite(
            setDisableButtons,
            setNotificaciones2,
            setDisableButtonsNoSAP,
            setDisableIfNoMaintenance,
            setDisableIfNoInspection,
            setDisableButtonNoAdmin,
            setHora,
            setDate
        )
    }

    const getMachinesList = () => {
        return new Promise(async resolve => {
            let machines = []
            machines = await getAllMachines()
            let db = await machinesDatabase.initDbMachines()
            if(db) {
                machines.forEach(async (machine, index) => {
                    machine.id = index
                    await machinesDatabase.actualizar(machine, db.database)
                    if(index === (machines.length - 1)) {
                        const response = await machinesDatabase.consultar(db.database)
                        if(response) {
                            getInfo.getPautasInstepctList(setProgress, response)
                            resolve(response)
                        }
                    } 
                })
            }
        })
    }

    const getMachinesList_ = () => {
            let machines = Files
    }

    const getTrucksList = () => {
        return new Promise(async resolve => {
            let machines = []
            machines = await getMachines()
            let db = await trucksDatabase.initDbMachines()
            if(db) {
                machines.forEach(async (fileName, index) => {
                    fileName.id = index
                    var xhr = new XMLHttpRequest()
                    xhr.onload = async () => {
                        let reader = new FileReader()
                        reader.onload = async () => {
                            let dbToImages = await machinesImagesDatabase.initDbMachinesImages()
                            if(dbToImages) {
                                let image = {
                                    id: index,
                                    data: reader.result.replace("data:", "")
                                }
                                await machinesImagesDatabase.actualizar(image, dbToImages.database)
                                
                            }
                            let i = await trucksDatabase.actualizar(fileName, db.database)
                            /*if(fileName.image) {
                                
                                
                            } */
                        }
                        reader.readAsDataURL(xhr.response)
                        
                        if(index == (machines.length - 1)) {
                            let respuestaConsulta = await consultTrucks(machines)
                            resolve(respuestaConsulta)
                        }
                    }
                    xhr.open('GET', `/assets/${fileName.model}.png`)
                    xhr.responseType = 'blob'
                    xhr.send()
                })
            }
        })
    }

    const consultTrucks = (machines) => {
        return new Promise(async resolve=>{
            let database = await trucksDatabase.initDbMachines()
            let respuestaConsulta
            do {
                respuestaConsulta = await trucksDatabase.consultar(database.database)
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
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    }

    const closeModal = () => {
        setOpenVersion(false)
    }

    return (
        <div>
            <div className='container'>
                {/* <img src="../assets/no-profile-image.png" width={100} alt="" /> */}
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
                        <button className='notificaciones alertas' onClick={() => history.push('/notifications')}>
                            <p className='notificaciones-texto'> <b>Notificaciones:</b> </p>
                            <p className='notificaciones-texto'> {notificaciones1} </p>
                        </button>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                        <button className='notificaciones alertas' onClick={() => history.push('/assignment')}>
                            {
                                (localStorage.getItem('role') === 'inspectionWorker' || localStorage.getItem('role') === 'maintenceOperator') &&
                                <p className='notificaciones-texto'> <b>OT Listas a enviar:</b> </p>
                            }
                            <p className='notificaciones-texto'> {notificaciones2}</p>
                        </button>
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
                            <CardButton variant='administration' disableButton={disableButtonNoAdmin}/>
                        </Grid>
                        
                </Grid>
            </div>
            <LoadingModal open={openLoader} progress={progress} loadingData={loadingData} withProgress={true}/>
            <VersionControlModal open={openVersion} closeModal={closeModal} />
            
            {/* <Download3DFilesDialog open={openDownload3D} /> */}
        </div>
    )
}

export default WelcomePage
