import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

import { alpha, AppBar, makeStyles, /* MenuItem, Select, */ Toolbar } from '@material-ui/core'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faHome, faInfoCircle, faTools, faUserCog } from '@fortawesome/free-solid-svg-icons'
import { faChartBar, faClipboard } from '@fortawesome/free-regular-svg-icons'

//import logo from '../../assets/logo.webp'
import logo from '../../assets/logo_icv_blanco.png'
import { useAuth, useLanguage, useNavigation } from '../../context'

const useStyles = makeStyles((theme) => ({
    appbar: {
        backgroundColor: alpha(theme.palette.primary.main, 0.6),
        height: 90
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

/* const NavigationTitle = (location, dictionary) => {
    switch (location) {
    case 'inspection':
        return dictionary.location.inspection
    case 'maintenance':
        return dictionary.location.maintenance
    case 'reports':
        return dictionary.location.reports
    case 'configuration':
        return dictionary.location.configuration
    default:
        return dictionary.location.start
    }
}

const NavigationIcon = (location) => {
    switch (location) {
    case 'inspection':
        return faClipboard
    case 'maintenance':
        return faTools
    case 'reports':
        return faChartBar
    case 'configuration':
        return faUserCog
    default:
        return faHome
    }
} */

/* <Select
    className={classes.languageSelector}
    variant='outlined'
    value={userLanguage}
    onChange={(event) => userLanguageChange(event.target.value)}
>
    {Object.keys(languageOptions).map(option => <MenuItem key={option} value={option}>{languageOptions[option]}</MenuItem>)}
</Select> */

const Header = () => {
    const classes = useStyles()
    const { navBarOpen, locationData } = useNavigation()
    const { isAuthenticated, userData } = useAuth()
    const { dictionary/* , languageOptions, userLanguage, userLanguageChange */ } = useLanguage()

    console.log(isAuthenticated);
    if(!userData) {
        useAuth()
    }
    
    console.log(userData);
    if(isAuthenticated) {
        
        return (
            <Fragment>
                <AppBar position='sticky' className={classes.appbar}>
                    <Toolbar className={classes.toolbar}>
                        {!navBarOpen && <Link to='/'><img src={logo} height={75} style={{ marginLeft: 30 }}/></Link>}
                        {isAuthenticated && <Fragment>
                            <dl>
                                <dt style={{margin: 0}}>{isAuthenticated && <div> <h4> {userData.name} {userData.lastName} </h4> </div>}</dt>
                                <dt>{userData.name === 'ADMINISTRADOR' && <div> <h5> Administrador </h5> </div>}</dt>
                            </dl>
                        </Fragment>}
                        <Fragment>
                            <p className={classes.locationText}>
                                {<FontAwesomeIcon icon={faBell} size='2x'/>}
                            </p>
                            <div className={classes.locationIcon}>
                                {<FontAwesomeIcon icon={faInfoCircle} size='2x'/>}
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
