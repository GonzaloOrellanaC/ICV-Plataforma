import React, {useEffect} from 'react'
import { Card, Hidden } from '@material-ui/core'

import { Login } from '../../containers'
import { environment } from '../../config'
import logoICV from '../../assets/ICV-transparent.png'

const LoginPage = () => {
    const addCard = () => {
        return (
            <Card elevation={0} className={`pageCard noNavBarMargin`}>
                <div style={{textAlign: 'center', width: '100%', marginTop: 60}}>
                    <img src={logoICV} height={100} alt="" />
                    <p style={{marginTop: 0, fontSize: 6.5, textDecoration: 'underline'}}> <strong>INGENIERÍA CIVIL VICENTE</strong> </p>
                    <p style={{fontSize: '2em', marginBottom: 0}}>Iniciar sesión</p>
                    <p style={{fontSize: 10, marginTop: 0}}> {environment.version} </p>
                </div>
                <Login />
            </Card>
        )
    }

    useEffect(() => {
        removeDatabases()
    }, [])

    const removeDatabases = async () => {
        let databases = await window.indexedDB.databases();
        if(databases.length > 0) {
            databases.forEach((database, index) => {
                if(database.name === '3Ds' || database.name === 'MachinesParts' || database.name === 'Executions' || database.name === 'Trucks' || database.name === 'Pautas') {

                }else{
                    window.indexedDB.deleteDatabase(database.name)
                }
            })
        }
    }

    return (
            <div style={{height: '100%', display: 'block'}}>
                <Hidden smDown>
                    <div style={{float: 'left', width: '50%', height: '100%'}}>
                        {addCard()}
                    </div>
                </Hidden>
                <Hidden smDown>
                    <div className='loginBacgroundImage'>

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
