import React, { Fragment } from 'react'

import { alpha, AppBar, makeStyles, Toolbar } from '@material-ui/core'

import logo from '../../assets/logo.webp'
import { useNavigation } from '../../context'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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
        fontSize: '1rem'
    }
}))

const Header = () => {
    const classes = useStyles()
    const { navBarOpen, locationData } = useNavigation()
    return (
        <Fragment>
            <AppBar position='sticky' className={classes.appbar}>
                <Toolbar className={classes.toolbar}>
                    {!navBarOpen && <img src={logo} height={75} style={{ marginTop: 15 }}/>}
                    <p className={classes.locationText}>
                        {locationData?.title && locationData.title}
                    </p>
                    <div className={classes.locationIcon}>
                        {locationData?.icon && <FontAwesomeIcon icon={locationData.icon} size='3x' />}
                    </div>
                </Toolbar>
            </AppBar>
        </Fragment>
    )
}

export default Header
