import React from 'react'
import { Card, Hidden } from '@material-ui/core'
import clsx from 'clsx'
import { useStylesTheme } from '../../config'
import imageBackground from '../../assets/Iniciar sesión-1.png';
import logoICV from '../../assets/ICV-transparent.png'
import { ResetPassword } from '../../containers'

const ResetPasswordPage = () => {
    const classes = useStylesTheme()
    const addCard = () => {
        return (
            <Card elevation={0} className={clsx(classes.pageCard, classes.noNavBarMargin)}>
                <div style={{textAlign: 'center', width: '100%', marginTop: 60}}>
                    <img src={logoICV} height={100} alt="" />
                    <p style={{marginTop: 0, fontSize: 6.5, textDecoration: 'underline'}}> <strong>INGENIERÍA CIVIL VICENTE</strong> </p>
                    <p style={{fontSize: '2em'}}>Recuperar Contraseña</p>
                </div>
                <ResetPassword />
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
                <div style={{float: 'left', width: '50%', height: '100vh', display: 'block'}}>
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

export default ResetPasswordPage