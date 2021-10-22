import React, { } from 'react'
import { Link } from 'react-router-dom'

import { Drawer, Grid, IconButton, makeStyles } from '@material-ui/core'
import { Menu, Close } from '@material-ui/icons'

import clsx from 'clsx'

//import logo from '../../assets/logo.webp'
import logo from '../../assets/logo_icv.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCircle as farUserCircle } from '@fortawesome/free-regular-svg-icons'
import { faClipboard, faCog, faHome, faInfoCircle, faSignOutAlt, faTools, faChartBar, faSearch, faClipboardList, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'
import { useAuth, useNavigation } from '../../context'
import { FilterField } from '../../components/fields'
import { authRoutes } from '../../routes'

const useStyles = makeStyles(theme => ({
    drawer: {
        width: 250,
        flexShrink: 0,
        whiteSpace: 'nowrap'
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
        width: 99,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        overflowX: ' hidden'
    },
    drawerPaper: {
        marginTop: 0,
        //backgroundColor: 'rgb(127, 127, 127)',
        backgroundColor: '#F9F9F9',
        border: 'none'
    },
    drawerContainer: {
        //height: 'calc(100vh - 90px)',
        position: 'relative',
        height: '100%'
    },
    drawerBottom: {
        position: 'absolute',
        backgroundColor: 'rgb(228, 228, 228)',
        //minHeight: 70,
        width: '100%',
        display: 'flex',
        //alignItems: 'center',
        bottom: 0,
        padding: 5
    },
    bottomButtons: {
        height: 54,
        width: 54
    },
    sideButtons: {
        paddingTop: 10,
        width: '100%',
        color: '#505050',
        
    },
    divider: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.18)'
        //backgroundColor: '#505050'
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

    const logout = async () => {
        window.localStorage.clear();
        window.location.reload();
    }

    const closeSideBar = () => {
        if(navBarOpen) {
            handleNavBar()
        }
    }

    

    return (
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
                        <IconButton onClick={handleNavBar} style={{ color: '#505050', width: "100%", marginBottom: 50, marginTop: 15 }}>
                            {navBarOpen ? <Close /> : <Menu />}
                        </IconButton>
                        <IconButton style={{ width: '100%', textAlign: navBarOpen ? 'left' : 'center'}} onClick={closeSideBar}>
                            <Link to='/' className={classes.sideButtons} style={{ textDecoration: 'none' }}>
                                <FontAwesomeIcon icon={faHome}/> {navBarOpen ?  ' Inicio' : ''}
                            </Link>
                        </IconButton>
                        <IconButton style={{ width: '100%', textAlign: navBarOpen ? 'left' : 'center'}} onClick={closeSideBar}>
                            <Link to='/sites' className={classes.sideButtons} style={{ textDecoration: 'none' }}>
                                <FontAwesomeIcon icon={faMapMarkerAlt}/> {navBarOpen ?  ' Sitios' : ''}
                            </Link>
                        </IconButton>
                        <IconButton style={{ width: '100%', textAlign: navBarOpen ? 'left' : 'center'}} onClick={closeSideBar}>
                            <Link to='/inspection' className={classes.sideButtons} style={{ textDecoration: 'none' }}>
                                <FontAwesomeIcon icon={faSearch}/> {navBarOpen ?  ' Inspección' : ''}
                            </Link>
                        </IconButton>
                        <IconButton style={{ width: '100%', textAlign: navBarOpen ? 'left' : 'center'}} onClick={closeSideBar}>
                            <Link to='/maintenance' className={classes.sideButtons} style={{ textDecoration: 'none' }}>
                                <FontAwesomeIcon icon={faTools}/> {navBarOpen ?  ' Mantención' : ''}
                            </Link>
                        </IconButton>
                        <IconButton style={{ width: '100%', textAlign: navBarOpen ? 'left' : 'center'}} onClick={closeSideBar}>
                            <Link to='/reports' className={classes.sideButtons} style={{ textDecoration: 'none' }}>
                                <FontAwesomeIcon icon={faClipboardList}/> {navBarOpen ?  ' Reportes' : ''}
                            </Link>
                        </IconButton>
                        <IconButton style={{ width: '100%', textAlign: navBarOpen ? 'left' : 'center'}} onClick={closeSideBar}>
                            <Link to='/configuration' className={classes.sideButtons} style={{ textDecoration: 'none' }}>
                                <FontAwesomeIcon icon={faCog}/> {navBarOpen ?  ' Configuración' : ''}
                            </Link>
                        </IconButton>
                        <IconButton style={{ width: '100%', textAlign: navBarOpen ? 'left' : 'center'}} onClick={closeSideBar}>
                            <Link to='/information' className={classes.sideButtons} style={{ textDecoration: 'none' }}>
                                <FontAwesomeIcon icon={faInfoCircle}/> {navBarOpen ?  ' Información' : ''}
                            </Link>
                        </IconButton>
                    </Grid>
                    <Grid item style={{ position: 'absolute', bottom: 0, width: '100%' }}>
                        <IconButton onClick={logout} style={{ width: '100%', textAlign: navBarOpen ? 'left' : 'center'}}>
                            <div className={classes.sideButtons}>
                                <FontAwesomeIcon icon={faSignOutAlt}/> {navBarOpen ?  ' Cerrar Sesión' : ''}
                            </div>
                        </IconButton>
                    </Grid>
                </Grid>
            </div>
        </Drawer>
    )
}

export default Navbar
