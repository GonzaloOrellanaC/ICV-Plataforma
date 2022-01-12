import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Drawer, Grid, IconButton, makeStyles } from '@material-ui/core';
import { Menu, Close } from '@material-ui/icons';
import clsx from 'clsx';
import logo from '../../assets/Logologo_icv_1.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCog, 
    faHome, 
    faInfoCircle, 
    faSignOutAlt, 
    faTools, 
    faSearch, 
    faClipboardList, 
    faMapMarkerAlt, 
    faList, 
    faUserCog, 
    faListAlt} from '@fortawesome/free-solid-svg-icons';
import { useAuth, useNavigation } from '../../context';
import { VersionControlModal } from '../../modals'

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
    const { userData } = useAuth();
    const [ useButon, setUseButton ] = useState()
    const [ path, setPath ] = useState('')
    const history = useHistory();
    const [ disableButtonNoSAP, setDisableButtonsNoSAP ] = useState(true);
    const [ openVersionModal, setOpenVersionModal ] = useState(false);


    const logout = async () => {
        if(confirm('Confirme salida de la aplicación. Para volver a iniciar sesión requiere contar con internet para validar las credenciales.')) {
            window.localStorage.clear();
            window.location.reload();
            removeDatabases();
        }
        
    }

    const removeDatabases = async () => {
        let databases = await window.indexedDB.databases();
        if(databases) {
            databases.forEach((database, index) => {
                window.indexedDB.deleteDatabase(database.name)
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



    useEffect(() => {
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
    }, [])

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
                            {(localStorage.getItem('role')==='admin' || localStorage.getItem('role')==='sapExecutive') && <div style={{width: '100%', textAlign: navBarOpen ? 'left' : 'center'}}>
                                <IconButton onClick={closeSideBar} title='Obras'>
                                    <Link to='/sites' className={classes.sideButtons} style={{ color: (path === '/sites') ? '#BE2E26' : '#FFFFFF', textDecoration: 'none' }}>
                                        <FontAwesomeIcon icon={faMapMarkerAlt}/> {navBarOpen ?  ' Obras' : ''}
                                    </Link>
                                </IconButton>
                            </div>}
                            <div style={{width: '100%', textAlign: navBarOpen ? 'left' : 'center'}}>
                                {useButon && <IconButton onClick={closeSideBar} title='Inspección'>
                                    <Link to='/inspection' className={classes.sideButtons} style={{ color: (path.includes('/inspection')) ? '#BE2E26' : '#FFFFFF', textDecoration: 'none' }}>
                                        <FontAwesomeIcon icon={faSearch}/> {navBarOpen ?  ' Inspección' : ''}
                                    </Link>
                                </IconButton>}
                                {!useButon && <IconButton disabled onClick={closeSideBar} title='Inspección'>
                                    <FontAwesomeIcon icon={faSearch}/> {navBarOpen ?  ' Inspección' : ''}
                                </IconButton>}
                            </div>
                            <div style={{width: '100%', textAlign: navBarOpen ? 'left' : 'center'}}>
                                {useButon && <IconButton onClick={closeSideBar} title='Mantención'>
                                    <Link to='/maintenance' className={classes.sideButtons} style={{ color: (path.includes('/maintenance')) ? '#BE2E26' : '#FFFFFF', textDecoration: 'none' }}>
                                        <FontAwesomeIcon icon={faTools}/> {navBarOpen ?  ' Mantención' : ''}
                                    </Link>
                                </IconButton> }
                                {!useButon && <IconButton disabled onClick={closeSideBar} title='Mantención'>
                                    <FontAwesomeIcon icon={faTools}/> {navBarOpen ?  ' Mantención' : ''}
                                </IconButton>}
                            </div>
                            {!disableButtonNoSAP && <div style={{width: '100%', textAlign: navBarOpen ? 'left' : 'center'}}>
                                <IconButton onClick={closeSideBar} title='Reportes'>
                                    <Link to='/reports' className={classes.sideButtons} style={{ color: (path.includes('/reports')) ? '#BE2E26' : '#FFFFFF', textDecoration: 'none' }}>
                                        <FontAwesomeIcon icon={faClipboardList}/> {navBarOpen ?  ' Reportes' : ''}
                                    </Link>
                                </IconButton>
                            </div>}
                            {!disableButtonNoSAP && <div style={{width: '100%', textAlign: navBarOpen ? 'left' : 'center'}}>
                                <IconButton onClick={closeSideBar} title='Administración'>
                                    <Link to='/administration' className={classes.sideButtons} style={{ color: (path.includes('/administration')||path.includes('/users')) ? '#BE2E26' : '#FFFFFF', textDecoration: 'none' }}>
                                        <FontAwesomeIcon icon={faUserCog}/> {navBarOpen ?  ' Administración' : ''}
                                    </Link>
                                </IconButton>
                            </div>}
                            {disableButtonNoSAP && <div style={{width: '100%', textAlign: navBarOpen ? 'left' : 'center'}}>
                                <IconButton onClick={closeSideBar} title='Listado Asignaciones'>
                                    <Link to='/activities' className={classes.sideButtons} style={{ color: (path.includes('/activities')) ? '#BE2E26' : '#FFFFFF', textDecoration: 'none' }}>
                                        <FontAwesomeIcon icon={faListAlt}/> {navBarOpen ?  ' Listado Asignaciones' : ''}
                                    </Link>
                                </IconButton>
                            </div>}
                            <div style={{width: '100%', textAlign: navBarOpen ? 'left' : 'center'}}>
                                <IconButton onClick={closeSideBar} title='Listado Pautas'>
                                    <Link to='/pms' className={classes.sideButtons} style={{ color: (path === '/pms') ? '#BE2E26' : '#FFFFFF', textDecoration: 'none' }}>
                                        <FontAwesomeIcon icon={faList}/> {navBarOpen ?  ' Listado Pautas' : ''}
                                    </Link>
                                </IconButton>
                            </div>
                            <div style={{width: '100%', textAlign: navBarOpen ? 'left' : 'center'}}>
                                <IconButton onClick={closeSideBar}  title='Configuración'>
                                    <Link to='/configuration' className={classes.sideButtons} style={{ color: (path === '/configuration') ? '#BE2E26' : '#FFFFFF', textDecoration: 'none' }}>
                                        <FontAwesomeIcon icon={faCog}/> {navBarOpen ?  ' Configuración' : ''}
                                    </Link>
                                </IconButton>
                            </div>
                            <div style={{width: '100%', textAlign: navBarOpen ? 'left' : 'center'}}>
                                <IconButton onClick={closeSideBar}  title='Información' onClickCapture={()=>{toOpenVersionModal()}}>
                                    <div className={classes.sideButtons} style={{ color: (path === '/information') ? '#BE2E26' : '#FFFFFF', textDecoration: 'none' }}>
                                        <FontAwesomeIcon icon={faInfoCircle}/> {navBarOpen ?  ' Información' : ''}
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
                    <VersionControlModal open={openVersionModal} closeModal={closeModal} />
                </div>
            </Drawer>
        </div>
    )
}

export default Navbar
