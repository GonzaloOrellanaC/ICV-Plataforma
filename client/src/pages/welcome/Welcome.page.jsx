import React, { useState, useEffect } from 'react'
import { Grid } from '@material-ui/core'
import { CardButton } from '../../components/buttons'
import { LoadingModal, VersionControlModal } from '../../modals'
import './style.css'
import Files from './3dFiles'
import { useNavigate } from 'react-router-dom'
import { dateWithTime, /* download3DFiles, imageToBase64 */ } from '../../config'
import { useAuth, useTimeContext } from '../../context'
import { useNotificationsContext } from '../../context/Notifications.context'

const WelcomePage = (/* { readyToLoad } */) => {
    const {admin, isOperator, isSapExecutive, isShiftManager, isChiefMachinery, userData} = useAuth()
    const {date, hour} = useTimeContext()
    const {lastNotification, ultimaNoticia, listaLectura} = useNotificationsContext()
    /* const [ date, setDate ] = useState('')
    const [ hora, setHora ] = useState('') */
    const [ openLoader, setOpenLoader ] = useState(false)
    const [ openVersion, setOpenVersion ] = useState(false)
    const [ progress, setProgress ] = useState(0)
    const [ loadingData, setLoadingData ] = useState('')
    const [ disableButton, setDisableButtons ] = useState(false)
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

    useEffect(() => {
        if (admin || isSapExecutive || isShiftManager || isChiefMachinery) {
            setDisableButtonsNoSAP(false)
        }
        if (admin) {
            setDisableButtonNoAdmin(false)
        }
    }, [admin, isOperator, isSapExecutive, isShiftManager, isChiefMachinery])

 
    const navigate = useNavigate()

    window.addEventListener('online', () => {
        setIfHavNetwork(true)
        let last = Number(localStorage.getItem('timeOffline'))
        let now = Date.now()
        if(now < (last + 21600000)) {
            localStorage.setItem('revisado', true)
            localStorage.removeItem('timeOffline')
        }
    })

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
                            <p className='reloj-hora'> {hour} hs </p>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                        <button className='notificaciones alertas' onClick={() => navigate('/notifications')}>
                            <p className='notificaciones-texto'> <b>Última Notificación:</b> </p>
                            <p className='notificaciones-texto'> {lastNotification && lastNotification.message} </p>
                        </button>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                        <button className='notificaciones alertas' onClick={() => navigate('/mynews')}>
                                <div>
                                    <p style={{marginTop: 5}}>Noticias internas</p>
                                    <p className='notificaciones-texto'> {
                                    listaLectura ? 
                                    (ultimaNoticia ? 
                                    ultimaNoticia.titulo : 'No tiene noticias en su muro') : 'Cargando noticias en su muro'} </p>
                                </div>
                                
                            {/* {
                                (isOperator || localStorage.getItem('role') === 'inspectionWorker' || localStorage.getItem('role') === 'maintenceOperator') &&
                                <p className='notificaciones-texto'> <b>OT Listas a enviar:</b> </p>
                            }
                            <p className='notificaciones-texto'> {notificaciones2}</p> */}
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
            
        </div>
    )
}

export default WelcomePage
