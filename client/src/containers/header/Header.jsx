import React, { Fragment, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'

import { alpha, AppBar, makeStyles, /* MenuItem, Select, */ Toolbar, Button } from '@material-ui/core'
import { faCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faHome, faInfoCircle, faTools, faUserCog } from '@fortawesome/free-solid-svg-icons'
//import { faChartBar, faClipboard } from '@fortawesome/free-regular-svg-icons'

//import logo from '../../assets/logo.webp'
import logo from '../../assets/logo_icv_gris.png'
import { useAuth, useLanguage, useNavigation } from '../../context'
import { changeTypeUser } from '../../config'
import { useState } from 'react'

const useStyles = makeStyles((theme) => ({
    appbar: {
        //backgroundColor: alpha(theme.palette.primary.main, 0.6),
        height: 80,
        width: '100%',
        backgroundColor: '#fff',
        borderBottomRightRadius: 30,
        color: '#000'
    },/* 
    toolbar: {
        height: 90
    }, */
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
    const { navBarOpen, locationData } = useNavigation()
    const { isAuthenticated } = useAuth()
    const { dictionary/* , languageOptions, userLanguage, userLanguageChange */ } = useLanguage();
    const [ network, setIfHavNetwork ] = useState(true);
    let userData = {}

    userData.name = window.localStorage.getItem('name');
    userData.lastName = window.localStorage.getItem('lastName');
    if(window.localStorage.getItem('role')) {
        userData.role = changeTypeUser(window.localStorage.getItem('role'))
    }

    useEffect(() => {
        if(isAuthenticated) {
            //console.log('Initially ' + (window.navigator.onLine ? 'on' : 'off') + 'line');
            window.addEventListener('online', () => {
                console.log('Became online'); setIfHavNetwork(true);
            });
            window.addEventListener('offline', () => {
                console.log('Became offline'); setIfHavNetwork(false);
            });
        }
    }, [])

    /* setInterval(() => {
        if(window.navigator.onLine) {
            setIfHavNetwork(true)
        }else{
            setIfHavNetwork(false)
        }
    }, 10000); */
    
    if(isAuthenticated) {
        
        
        return (
            <AppBar className={classes.appbar}/* className='header-bar' */>
                <div className='header-bar'>
                <Toolbar>
                    {!navBarOpen && <Link to='/'><img src={logo} height={75} /></Link>}
                    {isAuthenticated && <Fragment>
                            <dl>
                                <dt style={{margin: 0}}>{isAuthenticated && <div> <p className='nombre'> { userData.name } { userData.lastName } </p> </div>}</dt>
                                {/* <dt>{window.localStorage.getItem('name') === 'ADMINISTRADOR' && <div> <p className='rol'> Administrador </p> </div>}</dt> */}
                                <dt> {userData.role} </dt>
                            </dl>
                        </Fragment>}
                        <div style={{position: 'absolute', right: 10}}>
                            <p><FontAwesomeIcon icon={faCircle} color={network ? '#2FB83F' : '#B62800'} /> {network ? 'Online' : 'Offline'}</p>
                             {!network && <p>Sin red</p>}
                            {/*{!network && <p>Offline</p>} */}
                        </div>
                </Toolbar>
                </div>
                {/* <Toolbar className={classes.toolbar}>
                    {!navBarOpen && <Link to='/'><img src={logo} height={75} style={{ marginLeft: '15vw' }}/></Link>}
                    {navBarOpen && <Link to='/'><img src={logo} height={75} style={{ marginLeft: 330 }}/></Link>}
                    {
                        isAuthenticated && <Fragment>
                            <dl>
                                <dt style={{margin: 0}}>{isAuthenticated && <div> <p style={{margin: 10}}> { userData.name } { userData.lastName } </p> </div>}</dt>
                                <dt>{window.localStorage.getItem('name') === 'ADMINISTRADOR' && <div> <h5 style={{margin: 10}}> Administrador </h5> </div>}</dt>
                            </dl>
                        </Fragment>
                    }
                    {
                        isAuthenticated && <Fragment>
                            <dl>
                                <dt style={{margin: 0}}>{isAuthenticated && <div> <p style={{margin: 10}}> { userData.name } { userData.lastName } </p> </div>}</dt>
                                <dt>{window.localStorage.getItem('name') === 'ADMINISTRADOR' && <div> <h5 style={{margin: 10}}> Administrador </h5> </div>}</dt>
                            </dl>
                        </Fragment>
                    }
                    <Fragment>
                        <div className={classes.locationText}>
                            <Link to="/info">
                                <Button title='Información'>
                                    {<FontAwesomeIcon icon={faInfoCircle} size='2x'/>}
                                </Button>
                            </Link>
                        </div>
                        <div className={classes.locationIcon}>
                            <Link to="/alerts">
                                <Button title='Alertas'>
                                    {<FontAwesomeIcon icon={faBell} size='2x'/>}
                                </Button>
                            </Link>
                        </div>
                    </Fragment>
                    
                </Toolbar> */}
            </AppBar>
        )
    }

    
}

export default Header
