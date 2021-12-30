import React, {useEffect} from 'react'
import { Card, Hidden } from '@material-ui/core'
import clsx from 'clsx'
import { useParams } from 'react-router-dom'
import { useStylesTheme } from '../../config'
import imageBackground from '../../assets/Iniciar sesión-1.png';
import logoICV from '../../assets/ICV-transparent.png'
import { RestorePassword } from '../../containers';

const RestorePasswordPage = () => {
    let { id } = useParams();
    const classes = useStylesTheme()
    useEffect(() => {
        //console.log(id)
    }, [])
    const addCard = () => {
        return (
            <Card className={clsx(classes.pageCard, classes.noNavBarMargin)}>
                <div style={{textAlign: 'center', width: '100%', marginTop: 60}}>
                    <img src={logoICV} height={100} alt="" />
                    <p style={{marginTop: 0, fontSize: 6.5, textDecoration: 'underline'}}> <strong>INGENIERÍA CIVIL VICENTE</strong> </p>
                </div>
                <RestorePassword id={id} />
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

export default RestorePasswordPage