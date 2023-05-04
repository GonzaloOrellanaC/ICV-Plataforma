import React, { Fragment, useContext, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { AppBar, makeStyles, Toolbar, Grid } from '@material-ui/core'
import { faCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import logo from '../../assets/logo_icv_gris.png'
import logoNotification from '../../assets/logo_icv_notification_push.png'
import { ConnectionContext, useAuth, useNavigation } from '../../context'
import { changeTypeUser, styleModal, sync } from '../../config'
import { useState } from 'react'
import './style.css'
import { usersRoutes } from '../../routes'
import addNotification from 'react-push-notification';
import { SocketConnection } from '../../connections'
import { FirmaUsuario } from '../../modals'


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
    const {isOnLine} = useContext(ConnectionContext)
    const { navBarOpen } = useNavigation()
    const { isAuthenticated, userData } = useAuth()
    const [ network, setIfHavNetwork ] = useState(false)
    const [ openSign, setOpenSign ] = useState(false)
    const [ refCanvas, setRefCanvas ] = useState()
    const history = useHistory();
    useEffect(() => {
        if (isOnLine) {
            setIfHavNetwork(true)
        } else {
            setIfHavNetwork(false);
            addNotification({
                icon: logoNotification,
                title: 'Alerta',
                subtitle: 'Pérdida de conexión',
                message: 'El dispositivo no cuenta con conexión a internet.',
                theme: 'red',
                native: true // when using native, your OS will handle theming.
            })
        }
    },[isOnLine])
    useEffect(() => {
        if(isAuthenticated) {
            if(navigator.onLine) {
                usersRoutes.getUser(localStorage.getItem('_id')).then(data => {
                    if(data.data) {
                        if(!data.data.sign || (data.data.sign.length < 1)) {
                            setOpenSign(true)
                        }
                    }
                })
            }
            if (navigator.onLine) {
                setIfHavNetwork(true)
            } else {
                setIfHavNetwork(false)
            }
            Notification.requestPermission().then((res) => {
                if(res === 'denied' || res === 'default') {
                    
                }
            })
        }
    }, [])

    const setRefCanvasFunction = (ref) => {
        setRefCanvas(ref);
    }

    const clear = () => {
        refCanvas.clear();
    }

    const getImage = () => {
        usersRoutes.editUser({sign: refCanvas.toDataURL()}, localStorage.getItem('_id')).then(data => {
            setOpenSign(false);
            alert('Muchas gracias. Su firma ha sido actualizada.')
        })
    }

    const sendTestNotification = () => {
        SocketConnection.sendnotificationToAllUsers(
            'test',
            localStorage.getItem('_id'),
            'Envío prueba',
            'Todos los usuarios',
            'Se envía notificación de prueba a todos los usuarios.'
        )
    }
    
    return (
        <AppBar className={classes.appbar}>
            <div className='header-bar'>
                <Toolbar>
                    {!navBarOpen && <Link to='/'><img src={logo} height={75} /></Link>}
                    {(isAuthenticated && userData) && <Fragment>
                            <div className='user-name' onClick={()=>{history.push('/user-profile')}}>
                            <dl>
                                <dt style={{margin: 0}}><div> <p className='nombre'> { userData.name } { userData.lastName } </p> </div></dt>
                                {
                                    (userData.role && userData.role.length > 0)
                                    ?
                                    <dt>
                                        {userData.role}
                                    </dt>
                                    :
                                    <Grid container>
                                        {
                                            userData.roles && userData.roles.map((role, i) => {
                                                return (
                                                    <Grid item key={i} style={{marginRight: 10}}>
                                                        {changeTypeUser(role)} |
                                                    </Grid>
                                                )
                                            })
                                        }
                                    </Grid>
                                        
                                }
                            </dl>
                            </div>
                        </Fragment>}
                        <div style={{position: 'absolute', right: 10}}>
                            {
                                (localStorage.getItem('role')==='admin'||localStorage.getItem('role')==='superAdmin') && <button onClick={() => sendTestNotification()}>Notif. Test</button>
                            }
                            <p><FontAwesomeIcon icon={faCircle} color={network ? '#2FB83F' : '#B62800'} /> {network ? 'Online' : 'Offline'}</p>
                            {!network && <p>Sin red</p>}
                        </div>
                </Toolbar>
                <FirmaUsuario openSign={openSign} styleModal={styleModal} setRefCanvasFunction={setRefCanvasFunction} getImage={getImage} clear={clear} />
            </div>
        </AppBar>
    )
}

export default Header
