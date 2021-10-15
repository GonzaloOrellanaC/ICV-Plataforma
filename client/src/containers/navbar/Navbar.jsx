import React, { } from 'react'
import { Link, useHistory } from 'react-router-dom'

import { Divider, Drawer, Grid, IconButton, List, ListItem, ListItemIcon, ListItemText, makeStyles } from '@material-ui/core'
import { PlayArrow, Menu, Close } from '@material-ui/icons'

import clsx from 'clsx'

//import logo from '../../assets/logo.webp'
import logo from '../../assets/logo_icv.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCircle as farUserCircle } from '@fortawesome/free-regular-svg-icons'
import { faClipboard, faCog, faHome, faInfoCircle, faSignOutAlt, faTools, faUsers } from '@fortawesome/free-solid-svg-icons'
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
        width: 250,
        maxWidth: '100vw',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        }),
        overflow: 'hidden'
    },
    drawerClose: {
        width: 48,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        overflowX: ' hidden'
    },
    drawerPaper: {
        marginTop: 0,
        backgroundColor: 'rgb(127, 127, 127)',
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
        color: '#fff',
        
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

    const logout = async () => {
        window.localStorage.setItem('isauthenticated', false);
        window.location.reload();
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
                        <IconButton onClick={handleNavBar} style={{ color: 'white' }}>
                            {navBarOpen ? <Close /> : <Menu />}
                        </IconButton>
                        <IconButton style={{ width: '100%', textAlign: navBarOpen ? 'left' : 'center'}}>
                            <div component={Link} to='/' className={classes.sideButtons}>
                                <FontAwesomeIcon icon={faHome}/> {navBarOpen ?  ' Inicio' : ''}
                            </div>
                        </IconButton>
                        <IconButton style={{ width: '100%', textAlign: navBarOpen ? 'left' : 'center'}}>
                            <div className={classes.sideButtons}>
                                <FontAwesomeIcon icon={faClipboard}/> {navBarOpen ?  ' Inspección' : ''}
                            </div>
                        </IconButton>
                        <IconButton style={{ width: '100%', textAlign: navBarOpen ? 'left' : 'center'}}>
                            <div className={classes.sideButtons}>
                                <FontAwesomeIcon icon={faTools}/> {navBarOpen ?  ' Mantención' : ''}
                            </div>
                        </IconButton>
                        <IconButton style={{ width: '100%', textAlign: navBarOpen ? 'left' : 'center'}}>
                            <div className={classes.sideButtons}>
                                <FontAwesomeIcon icon={faCog}/> {navBarOpen ?  ' Configuración' : ''}
                            </div>
                        </IconButton>
                        <IconButton style={{ width: '100%', textAlign: navBarOpen ? 'left' : 'center'}}>
                            <div className={classes.sideButtons}>
                                <FontAwesomeIcon icon={faInfoCircle}/> {navBarOpen ?  ' Información' : ''}
                            </div>
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
