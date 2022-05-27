import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { CircularProgress, Drawer, Grid, IconButton, LinearProgress, makeStyles } from '@material-ui/core';
import { Menu, Close } from '@material-ui/icons';
import clsx from 'clsx';
import logo from '../../assets/Logologo_icv_1.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faHome, 
    faInfoCircle, 
    faSignOutAlt, 
    faClipboardList, 
    faMapMarkerAlt, 
    faUserCog, 
    faListAlt,
    faRobot,
    faComment,
    faTruck,
    faUser,
    faCube,
    faTrash} from '@fortawesome/free-solid-svg-icons';
import { useAuth, useNavigation } from '../../context';
import { IAModal, InternalMessageModal, VersionControlModal } from '../../modals'
import { io } from "socket.io-client";
import logoNotification from '../../assets/logo_icv_notification_push.png'
import addNotification from 'react-push-notification';
import { download3DFiles } from '../../config';

const useStyles = makeStyles(theme => ({
    drawer: {
        width: 250,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: 330,
        maxWidth: '100vw',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        }),
        overflow: 'hidden'
    },
    drawerClose: {
        width: '15vw',
        maxWidth: 99,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        overflowX: ' hidden'
    },
    drawerPaper: {
        marginTop: 0,
        backgroundColor: '#212121',
        border: 'none',
        borderEndEndRadius: 30,
        borderTopRightRadius: 30,
    },
    drawerContainer: {
        position: 'relative',
        //height: '100%',
    },
    drawerBottom: {
        position: 'absolute',
        backgroundColor: 'rgb(228, 228, 228)',
        width: '100%',
        display: 'flex',
        bottom: 0,
        padding: 5
    },
    bottomButtons: {
        height: 54,
        width: 54
    },
    sideButtons: {
        width: '5vh',
        maxWidth: 26,
        height: '2.5vh',
        color: '#FFFFFF',
    },
    sideButtonsCloseMenu: {
        width: 26,
        height: 26,
        color: '#FFFFFF',
        paddingBottom: 100,
        paddingTop: 40,
    },
    sideButtonsOpenMenu: {
        width: 26,
        height: 26,
        color: '#FFFFFF',
        paddingBottom: 20,
        paddingTop: 40,
    },
    divider: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.18)'
    },
    searchField: {
        '& .MuiFormLabel-root': {
            color: 'white'
        },
        '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'white!important'
        },
        '& .fa-search': {
            color: 'white'
        },
        '& .MuiInputBase-input': {
            color: 'white'
        }
    },
    listItemText: {
        whiteSpace: 'normal',
        color: 'white',
        fontWeight: 'bold'
    }
}))
const Navbar = () => {
    const classes = useStyles()
    const { navBarOpen, handleNavBar } = useNavigation()
    const { userData } = useAuth()
    const [ useButton, setUseButton ] = useState()
    const [ path, setPath ] = useState('')
    const history = useHistory()
    const [ disableButtonNoSAP, setDisableButtonsNoSAP ] = useState(true)
    const [ openVersionModal, setOpenVersionModal ] = useState(false)
    const [ openIAModal, setOpenIAModal ] = useState(false)
    const [ openInternalMessagesModal, setOpenInternalMessagesModal ] = useState(false)
    const [ cancel, setCancel ] = useState(true)
    // 
/*     const [ openDownload3D, setOpenDownload3D ] = useState(false)
    const [ progressDownload3D, setProgressDownload3D ] = useState(0)
    const [ loadingData3D, setLoadingData3D ] = useState('') */

    const logout = async () => {
        if(confirm('Confirme salida de la aplicación. Para volver a iniciar sesión requiere contar con internet para validar las credenciales.')) {
            window.localStorage.clear();
            window.location.reload();
            removeDatabases();
        }
    }

    const removeDatabases = async () => {
        let databases = await window.indexedDB.databases();
        if(databases.length > 0) {
            databases.forEach((database, index) => {
                if(database.name === '3Ds' || database.name === 'MachinesParts') {

                }else{
                    window.indexedDB.deleteDatabase(database.name)
                }
            })
        }
    }

    const closeSideBar = () => {
        if(navBarOpen) {
            handleNavBar()
        }
    }

    const toOpenVersionModal = () => {
        setOpenVersionModal(true)
    }
    const closeModal = () => {
        setOpenVersionModal(false)
    }

    const toOpenIAModal = () => {
        setOpenIAModal(true)
    }
    const closeIAModal = () => {
        setOpenIAModal(false)
    }


    const toOpenInternalMessagesModal = () => {
        setOpenInternalMessagesModal(true)
    }
    const closeInternalMessageModal = () => {
        setOpenInternalMessagesModal(false)
    }

    const isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        },
        other: function() {
            return navigator.userAgent.match(/Mozilla/i) || navigator.userAgent.match(/AppleWebKit/i) || navigator.userAgent.match(/Chrome/i) || navigator.userAgent.match(/Safari/i)
        }
    };

    const openCadAssistant = () => {
        if(isMobile.Android()) {
            window.location.replace('market://details?id=org.opencascade.cadassistant')
        } else {
            alert('Su dispositivo no cuenta con el link a Cad Assistant')
        }
    }

    const clearAndLogout = () => {
        if(confirm('Limpiará toda la data del sistema y cerrará la sesión. Una vez terminado vuelva a iniciar.')) {
            window.indexedDB.databases().then((db) => {
                console.log(db)
                db.forEach((database, index) => {
                    window.indexedDB.deleteDatabase(database.name)
                    if(index == (db.length - 1)) {
                        window.localStorage.clear();
                        window.location.reload();
                        removeDatabases();
                    }
                })
            })
        }
    }

    useEffect(() => {
        if(cancel) {
            /* window.addEventListener('online', () => { */
                const socket = io()
                /* socket.on(`test_${localStorage.getItem('_id')}`, data => {
                    addNotification({
                        icon: logoNotification,
                        title: 'Test',
                        subtitle: 'Notifications',
                        message: data.message,
                        theme: 'red',
                        duration: 5000,
                        native: true // when using native, your OS will handle theming.
                    })
                    //alert(data.message)
                }) */
                socket.on(`notification_${localStorage.getItem('_id')}`, data => {
                    addNotification({
                        icon: logoNotification,
                        title: data.title,
                        subtitle: data.subtitle,
                        message: data.message,
                        theme: 'red',
                        duration: 5000,
                        native: true // when using native, your OS will handle theming.
                    })
                })
            /* }) */
            window.addEventListener('offline', () => {
                
            })
            
            if((localStorage.getItem('role') === 'admin') || (localStorage.getItem('role') === 'superAdmin') || (localStorage.getItem('role') === 'sapExecutive')) {
                setDisableButtonsNoSAP(false);
            }
            setPath(history.location.pathname)
            if(history.listen(data => {
                setPath(data.pathname)
            }))
            setUseButton(true)
            const timer = setInterval(() => {
                if(!(localStorage.getItem('sitio'))) {
                    setUseButton(false)
                }else{
                    setUseButton(true)
                    clearInterval(timer);
                }
            }, 1000);
        }
        return () => setCancel(false);
    }, [cancel])

    return (
        <div>
            <Drawer
                className={clsx(clsx(classes.drawer, {
                    [classes.drawerOpen]: navBarOpen,
                    [classes.drawerClose]: !navBarOpen
                }))} 
                variant='permanent'
                classes={{
                    paper: clsx(classes.drawerPaper, {
                        [classes.drawerOpen]: navBarOpen,
                        [classes.drawerClose]: !navBarOpen
                    })
                }}
                
            >
                <div className={classes.drawerContainer}>
                    <Grid container spacing={2} style={{ padding: navBarOpen ? 8 : '8px 0 0 0' }}>
                        <Grid item xs={12} container>
                            <div style={{width: '100%', textAlign: navBarOpen ? 'right' : 'center'}}>
                                <IconButton title={!navBarOpen ? 'Abrir Menú' : 'Cerrar Menú'} onClick={handleNavBar} className={navBarOpen ? classes.sideButtonsOpenMenu : classes.sideButtonsCloseMenu} >
                                    {navBarOpen ? <Close /> : <Menu />}
                                </IconButton>
                            </div>
                            {navBarOpen && 
                                <div style={{padding: 10}}>
                                    <img height={60} src={logo} alt="" />
                                    <p style={{color: '#fff', margin: 0}}>Ingeniería Civil Vicente</p>
                                </div>
                            }
                            <div style={{height: 1, backgroundColor: '#fff', width: '100%', marginRight: 10, marginLeft: 10}}>

                            </div>
                            <div style={{width: '100%', marginTop: 40, textAlign: navBarOpen ? 'left' : 'center'}}>
                                <IconButton onClick={closeSideBar} title='Inicio'>
                                    <Link to='/' className={classes.sideButtons} style={{ textDecoration: 'none', color: (path === '/') ? '#BE2E26' : '#FFFFFF' }}>
                                        <FontAwesomeIcon icon={faHome}/> {navBarOpen ?  ' Inicio' : ''}
                                    </Link>
                                </IconButton>
                            </div>
                            <div style={{width: '100%', textAlign: navBarOpen ? 'left' : 'center'}}>
                                <IconButton onClick={closeSideBar} title='Máquinas'>
                                    <Link to='/machines' className={classes.sideButtons} style={{ textDecoration: 'none', color: (path.match('/machines')) ? '#BE2E26' : '#FFFFFF' }}>
                                        <FontAwesomeIcon icon={faTruck}/> {navBarOpen ?  ' Máquinas' : ''}
                                    </Link>
                                </IconButton>
                            </div>
                            {(localStorage.getItem('role')==='admin' || localStorage.getItem('role')==='sapExecutive') && <div style={{width: '100%', textAlign: navBarOpen ? 'left' : 'center'}}>
                                <IconButton onClick={closeSideBar} title='Obras'>
                                    <Link to='/sites' className={classes.sideButtons} style={{ color: (path === '/sites') ? '#BE2E26' : '#FFFFFF', textDecoration: 'none' }}>
                                        <FontAwesomeIcon icon={faMapMarkerAlt}/> {navBarOpen ?  ' Obras' : ''}
                                    </Link>
                                </IconButton>
                            </div>}
                            {!disableButtonNoSAP && <div style={{width: '100%', textAlign: navBarOpen ? 'left' : 'center'}}>
                                <IconButton onClick={closeSideBar} title='Ordenes de Trabajo'>
                                    <Link to='/reports' className={classes.sideButtons} style={{ color: (path.includes('/reports')) ? '#BE2E26' : '#FFFFFF', textDecoration: 'none' }}>
                                        <FontAwesomeIcon icon={faClipboardList}/> {navBarOpen ?  ' Ordenes de Trabajo' : ''}
                                    </Link>
                                </IconButton>
                            </div>}
                            {!disableButtonNoSAP && <div style={{width: '100%', textAlign: navBarOpen ? 'left' : 'center'}}>
                                <IconButton onClick={closeSideBar} title='Administración'>
                                    <Link to='/administration' className={classes.sideButtons} style={{ color: (path.includes('/administration')||path.includes('/users')||path.includes('/edit-user')||path.includes('/new-users')) ? '#BE2E26' : '#FFFFFF', textDecoration: 'none' }}>
                                        <FontAwesomeIcon icon={faUserCog}/> {navBarOpen ?  ' Administración' : ''}
                                    </Link>
                                </IconButton>
                            </div>}
                            <div style={{width: '100%', textAlign: navBarOpen ? 'left' : 'center'}}>
                                <IconButton onClick={closeSideBar} title='Listado Asignaciones'>
                                    <Link to='/assignment' className={classes.sideButtons} style={{ color: (path.includes('/assignment')) ? '#BE2E26' : '#FFFFFF', textDecoration: 'none' }}>
                                        <FontAwesomeIcon icon={faListAlt}/> {navBarOpen ?  ' Listado Asignaciones' : ''}
                                    </Link>
                                </IconButton>
                            </div>
                            <div style={{width: '100%', textAlign: navBarOpen ? 'left' : 'center'}}>
                                <IconButton onClick={closeSideBar} title='Perfil'>
                                    <Link to='/user-profile' className={classes.sideButtons} style={{ color: (path.includes('/user-profile')) ? '#BE2E26' : '#FFFFFF', textDecoration: 'none' }}>
                                        <FontAwesomeIcon icon={faUser}/> {navBarOpen ?  ' Perfil' : ''}
                                    </Link>
                                </IconButton>
                            </div>
                            <div style={{width: '100%', textAlign: navBarOpen ? 'left' : 'center'}}>
                                <IconButton onClick={closeSideBar} title='Int. Artificial (Beta)' onClickCapture={()=>{toOpenIAModal()}}>
                                    <div className={classes.sideButtons} style={{ color: (path === '/pms') ? '#BE2E26' : '#FFFFFF', textDecoration: 'none' }}>
                                        <FontAwesomeIcon icon={faRobot}/> {navBarOpen ?  ' Int. Artificial (Beta)' : ''}
                                    </div>
                                </IconButton>
                            </div>
                            <div style={{width: '100%', textAlign: navBarOpen ? 'left' : 'center'}}>
                                <IconButton onClick={closeSideBar} title='Mensajes App' onClickCapture={()=>{toOpenInternalMessagesModal()}}>
                                    <div className={classes.sideButtons} style={{ color: (path === '/pms') ? '#BE2E26' : '#FFFFFF', textDecoration: 'none' }}>
                                        <FontAwesomeIcon icon={faComment}/> {navBarOpen ?  ' Mensajes App' : ''}
                                    </div>
                                </IconButton>
                            </div>
                            <div style={{width: '100%', textAlign: navBarOpen ? 'left' : 'center'}}>
                                <IconButton onClick={closeSideBar}  title='Información' onClickCapture={()=>{toOpenVersionModal()}}>
                                    <div className={classes.sideButtons} style={{ color: (path === '/information') ? '#BE2E26' : '#FFFFFF', textDecoration: 'none' }}>
                                        <FontAwesomeIcon icon={faInfoCircle}/> {navBarOpen ?  ' Información' : ''}
                                    </div>
                                </IconButton>
                            </div>
                            <div style={{width: '100%', textAlign: navBarOpen ? 'left' : 'center'}}>
                                <IconButton onClick={closeSideBar}  title='Información' onClickCapture={()=>{openCadAssistant()}}>
                                    <div className={classes.sideButtons} style={{ color: (path === '/information') ? '#BE2E26' : '#FFFFFF', textDecoration: 'none' }}>
                                        <FontAwesomeIcon icon={faCube}/> {navBarOpen ?  ' Cad Assistant' : ''}
                                    </div>
                                </IconButton>
                            </div>
                            <div style={{width: '100%', textAlign: navBarOpen ? 'left' : 'center'}}>
                                <IconButton onClick={closeSideBar}  title='Limpiar Datos' onClickCapture={()=>{clearAndLogout()}}>
                                    <div className={classes.sideButtons} style={{ color: (path === '/information') ? '#BE2E26' : '#FFFFFF', textDecoration: 'none' }}>
                                        <FontAwesomeIcon icon={faTrash}/> {navBarOpen ?  ' Limpiar Datos' : ''}
                                    </div>
                                </IconButton>
                            </div>
                            <div style={{width: '100%', textAlign: navBarOpen ? 'left' : 'center',}}>
                                <IconButton onClick={logout} title='Cerrar Sesión'>
                                    <div className={classes.sideButtons}>
                                        <FontAwesomeIcon icon={faSignOutAlt}/> {navBarOpen ?  ' Cerrar Sesión' : ''}
                                    </div>
                                </IconButton>
                            </div>
                        </Grid>
                    </Grid>
                    {openVersionModal && <VersionControlModal open={openVersionModal} closeModal={closeModal} />}
                    {openIAModal && <IAModal open={openIAModal} closeModal={closeIAModal} />}
                    {openInternalMessagesModal && <InternalMessageModal open={openInternalMessagesModal} closeModal={closeInternalMessageModal} />}
                </div>
            </Drawer>
            {/* {
                (navigator.onLine && openDownload3D) && 
                <div style={
                    {
                        position: 'absolute', 
                        bottom: 20, 
                        right: 20, 
                        width: 300, 
                        paddingTop: 50, 
                        paddingBottom: 40, 
                        paddingLeft: 20, 
                        paddingRight: 20,
                        borderRadius: 20,
                        backgroundColor: '#fff',
                        borderColor: '#ccc',
                        borderWidth: 1,
                        borderStyle: 'solid',
                        textAlign: 'center',
                        zIndex: 2
                    }
                }>
                    {
                        !loadingData3D && <CircularProgress color='primary' />
                    }
                    {
                        !loadingData3D && <p style={{margin: 0, marginTop: 10}}>Cargando datos...</p>
                    }
                    {
                        loadingData3D && <LinearProgress variant="determinate" value={progressDownload3D} />
                    }
                    {
                        loadingData3D && <p style={{margin: 0, marginTop: 10}}>{loadingData3D}</p>
                    }
                </div>
            } */}
        </div>
    )
}

export default Navbar
