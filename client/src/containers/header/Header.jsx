import React, { Fragment } from 'react'

import { alpha, AppBar, makeStyles, Toolbar } from '@material-ui/core'

import logo from '../../assets/logo.webp'

const useStyles = makeStyles((theme) => ({
    appbar: {
        backgroundColor: alpha(theme.palette.primary.main, 0.6)
    }
}))

const Header = () => {
    const classes = useStyles()
    return (
        <Fragment>
            <AppBar position='sticky' className={classes.appbar}>
                <Toolbar>
                    <img src={logo} height={100} style={{ marginTop: 20 }}/>
                </Toolbar>
            </AppBar>
        </Fragment>
    )
}

export default Header
