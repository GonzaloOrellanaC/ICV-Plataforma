import React, { Fragment, useMemo } from 'react'
import { Link } from 'react-router-dom'

import { alpha, AppBar, makeStyles, /* MenuItem, Select, */ Toolbar, Button } from '@material-ui/core'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faHome, faInfoCircle, faTools, faUserCog } from '@fortawesome/free-solid-svg-icons'
//import { faChartBar, faClipboard } from '@fortawesome/free-regular-svg-icons'

//import logo from '../../assets/logo.webp'
import logo from '../../assets/logo_icv_gris.png'
import { useAuth, useLanguage, useNavigation } from '../../context'

const useStyles = makeStyles((theme) => ({
    appbar: {
        //backgroundColor: alpha(theme.palette.primary.main, 0.6),
        height: 90,
        backgroundColor: '#fff',
        borderBottomRightRadius: 30,
        color: '#000'
    },
    toolbar: {
        height: 90
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
    const { navBarOpen, locationData } = useNavigation()
    const { isAuthenticated } = useAuth()
    const { dictionary/* , languageOptions, userLanguage, userLanguageChange */ } = useLanguage();
    let userData = {}

    userData.name = window.localStorage.getItem('name');
    userData.lastName = window.localStorage.getItem('lastName');
    
    if(isAuthenticated) {
        
        return (
            <Fragment>
                <AppBar position='sticky' className={classes.appbar}>
                    <Toolbar className={classes.toolbar}>
                        {!navBarOpen && <Link to='/'><img src={logo} height={75} style={{ marginLeft: 100 }}/></Link>}
                        {navBarOpen && <Link to='/'><img src={logo} height={75} style={{ marginLeft: 330 }}/></Link>}
                        {
                            isAuthenticated && <Fragment>
                                <dl>
                                    <dt style={{margin: 0}}>{isAuthenticated && <div> <h2 style={{margin: 10}}> { userData.name } { userData.lastName } </h2> </div>}</dt>
                                    <dt>{window.localStorage.getItem('name') === 'ADMINISTRADOR' && <div> <h5 style={{margin: 10}}> Administrador </h5> </div>}</dt>
                                </dl>
                            </Fragment>
                        }
                        <Fragment>
                            <div className={classes.locationText}>
                                <Link to="/info">
                                    <Button>
                                        {<FontAwesomeIcon icon={faInfoCircle} size='2x'/>}
                                    </Button>
                                </Link>
                            </div>
                            <div className={classes.locationIcon}>
                                <Link to="/alerts">
                                    <Button>
                                        {<FontAwesomeIcon icon={faBell} size='2x'/>}
                                    </Button>
                                </Link>
                            </div>
                        </Fragment>
                        {
                            /* isAuthenticated &&
                            <Fragment>
                                <p className={classes.locationText}>
                                    {NavigationTitle(locationData, dictionary)}
                                </p>
                                <div className={classes.locationIcon}>
                                    {<FontAwesomeIcon icon={NavigationIcon(locationData)} size='3x' />}
                                </div>
                            </Fragment> */
                        }
                    </Toolbar>
                </AppBar>
            </Fragment>
        )
    }

    
}

export default Header
