import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AppBar, makeStyles, Toolbar, Grid } from '@material-ui/core'
import { faCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import logo from '../../assets/logo_icv_gris.png'
import logoNotification from '../../assets/logo_icv_notification_push.png'
import { ConnectionContext, useAuth, useMachines3DContext, useNavigation, useReportsContext } from '../../context'
import './style.css'
import addNotification from 'react-push-notification';
import { SocketConnection } from '../../connections'


const useStyles = makeStyles((theme) => ({
    appbar: {
        height: 80,
        width: '100%',
        backgroundColor: '#fff',
        borderBottomRightRadius: 30,
        color: '#000'
    },
    locationIcon: {
        height: 60,
        width: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    locationText: {
        display: 'flex',
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        fontSize: '1rem'
    },
    languageSelector: {
        marginRight: 15,
        '&.MuiInputBase-root': {
            color: 'white'
        },
        '& .MuiSelect-icon': {
            color: 'white'
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'white!important'
        }
    }
}))

const Header = () => {
    const classes = useStyles()
    const {isOnline} = useContext(ConnectionContext)
    const { navBarOpen } = useNavigation()
    const { isAuthenticated, userData, admin, site } = useAuth()
    const [messageDownloading, setMessageDownloading] = useState('')
    const {message} = useReportsContext()
    const {
        downloadingData3D,
        progressDownload3D,
        openDownload3D,
        openVersion
    } = useMachines3DContext()
    

    useEffect(() => {
        if (downloadingData3D === 'Recursos descargados' || downloadingData3D === 'Modelos 3D descargados.') {
            setMessageDownloading('Recursos 3D descargados')
            setTimeout(() => {
                setMessageDownloading('')
            }, 1000);
            
        } else {
            setMessageDownloading(`${downloadingData3D} - ${Math.trunc(progressDownload3D)}%. No desconecte internet`)
        }
        console.log(downloadingData3D,
            progressDownload3D,
            openDownload3D,
            openVersion)
    }, [downloadingData3D,
        progressDownload3D,
        openDownload3D,
        openVersion])

    const navigate = useNavigate();
    useEffect(() => {
        console.log('La red está o no conectada: ', isOnline)
        if (isOnline) {
            /* setIfHavNetwork(true) */
        } else {
            /* setIfHavNetwork(false); */
            addNotification({
                icon: logoNotification,
                title: 'Alerta',
                subtitle: 'Pérdida de conexión',
                message: 'El dispositivo no cuenta con conexión a internet.',
                theme: 'red',
                native: true // when using native, your OS will handle theming.
            })
        }
    },[isOnline])
    
    const sendTestNotification = () => {
        SocketConnection.sendnotificationToAllUsers(
            'test',
            localStorage.getItem('_id'),
            'Envío prueba',
            'Todos los usuarios',
            'Se envía notificación de prueba a todos los usuarios.'
        )
    }

    const changeTypeUser = (userType) => {
        if(userType === 'superAdmin') {
            return 'Super Administrador'
        }else if(userType === 'admin') {
            return 'Administrador'
        }else if(userType === 'sapExecutive') {
            return 'Ejecutivo SAP'
        }else if(userType === 'inspectionWorker') {
            return 'Operario de Inspección'
        }else if(userType === 'maintenceOperator') {
            return 'Operario de Mantención'
        }else if(userType === 'shiftManager') {
            return 'Jefe de turno - Inspección y Mantención'
        }else if(userType === 'chiefMachinery') {
            return 'Jefe de maquinaria'
        }else if(userType === 'observer') {
            return 'Observador'
        }
    }
    
    return (
        <AppBar className={classes.appbar}>
            <div className='header-bar'>
                <Toolbar>
                    {!navBarOpen && <Link to='/'><img src={logo} height={75} /></Link>}
                    {(isAuthenticated && userData) && <Fragment>
                            <div className='user-name' onClick={()=>{navigate('/user-profile')}}>
                            <dl>
                                <dt style={{margin: 0}}><div> <p className='nombre'> { userData.name } { userData.lastName } </p> </div></dt>
                                <Grid container>
                                    {
                                        userData.roles && userData.roles.map((role, i) => {
                                            return (
                                                <Grid item key={i} style={{marginRight: 10}}>
                                                    {changeTypeUser(role)}
                                                </Grid>
                                            )
                                        })
                                    }
                                    {/* <Grid item style={{marginRight: 10}}>
                                        {site && site.descripcion}
                                    </Grid> */}
                                    <Grid item>
                                        <strong>{messageDownloading}</strong>
                                    </Grid>
                                </Grid>
                            </dl>
                            </div>
                        </Fragment>}
                        <div style={{position: 'absolute', right: 10}}>
                            {/* {
                                (admin) && <button onClick={() => sendTestNotification()}>Notif. Test</button>
                            } */}
                            <p> <b>{message.length > 0 && message}</b> <FontAwesomeIcon icon={faCircle} color={isOnline ? '#2FB83F' : '#B62800'} /> {isOnline ? 'Online' : 'Offline'}</p>
                            {!isOnline && <p>Sin red</p>}
                        </div>
                </Toolbar>
            </div>
        </AppBar>
    )
}

export default Header
