import React from 'react'
import { Box, Card, Grid, Hidden } from '@material-ui/core'
import clsx from 'clsx'

import { Login } from '../../containers'
import { environment, useStylesTheme } from '../../config'
import imageBackground from '../../assets/Iniciar sesión-1.png';
import logoICV from '../../assets/logo_icv_gris.png'

const LoginPage = () => {
    const classes = useStylesTheme();

    const addCard = () => {
        return (
            <Card className={clsx(classes.pageCard, classes.noNavBarMargin)}>
                <div style={{textAlign: 'center', width: '100%', marginTop: 60}}>
                    <img src={logoICV} height={80} alt="" />
                    <p style={{marginTop: 0, fontSize: 6.5, textDecoration: 'underline'}}> <strong>INGENIERÍA CIVIL VICENTE</strong> </p>
                    <p style={{fontSize: '2em', marginBottom: 0}}>Iniciar sesión</p>
                    <p style={{fontSize: 10, marginTop: 0}}> {environment.version} </p>
                </div>
                <Login />
            </Card>
        )
    }

    return (
            <div style={{height: '100%', display: 'block'}}>
                <Hidden smDown>
                    <div style={{float: 'left', width: '50%', height: '100%'}}>
                        {addCard()}
                    </div>
                </Hidden>
                <Hidden smDown>
                    <div style={{float: 'left', width: '50%', height: '100%', display: 'block'}}>
                        <img src={imageBackground} style={{objectFit: 'cover', width: '100%', height: '100%'}}/>
                    </div>
                </Hidden>
                <Hidden mdUp>
                    <div>
                        {addCard()}
                    </div>
                </Hidden>
            </div>
            
    )
}

export default LoginPage
