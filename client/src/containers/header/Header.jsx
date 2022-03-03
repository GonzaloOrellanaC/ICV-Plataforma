import React, { Fragment, useEffect, useMemo } from 'react'
import { Link, useHistory } from 'react-router-dom'

import { AppBar, makeStyles, Toolbar, Button, Modal, Box } from '@material-ui/core'
import { faCircle, faEraser, faPen, faSave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import logo from '../../assets/logo_icv_gris.png'
import { useAuth, useLanguage, useNavigation } from '../../context'
import { changeTypeUser, styleModal, sync } from '../../config'
import { useState } from 'react'

import './style.css'
import { usersRoutes } from '../../routes'
import { Canvas } from '..'


const useStyles = makeStyles((theme) => ({
    appbar: {
        height: 80,
        width: '100%',
        backgroundColor: '#fff',
        borderBottomRightRadius: 30,
        color: '#000'
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
    const { navBarOpen } = useNavigation()
    const { isAuthenticated } = useAuth()
    const [ network, setIfHavNetwork ] = useState(true);
    const [ openSign, setOpenSign ] = useState(false);
    const [ refCanvas, setRefCanvas ] = useState();
    let userData = {};
    const history = useHistory();
    userData.name = window.localStorage.getItem('name');
    userData.lastName = window.localStorage.getItem('lastName');
    if(window.localStorage.getItem('role')) {
        userData.role = changeTypeUser(window.localStorage.getItem('role'))
    }


    useEffect(() => {
        if(isAuthenticated) {
            if(navigator.onLine) {
                usersRoutes.getUser(localStorage.getItem('_id')).then(data => {
                    console.log(data)
                    if(!data.data.sign) {
                        console.log('No hay firma');
                        setOpenSign(true)
                    }
                })
            }
            window.addEventListener('online', () => {
                console.log('Became online'); setIfHavNetwork(true);
            });
            window.addEventListener('offline', () => {
                console.log('Became offline'); setIfHavNetwork(false);
            });
        }
    }, [])

    const setRefCanvasFunction = (ref) => {
        setRefCanvas(ref);
        console.log(ref)
    }

    const clear = () => {
        refCanvas.clear();
    }

    const getImage = () => {
        console.log(refCanvas.toDataURL());
        usersRoutes.editUser({sign: refCanvas.toDataURL()}, localStorage.getItem('_id')).then(data => {
            console.log(data)
            setOpenSign(false);
            alert('Muchas gracias. Su firma ha sido actualizada.')
        })
    }
    
    if(isAuthenticated) {
        return (
            <AppBar className={classes.appbar}>
                <div className='header-bar'>
                    <Toolbar>
                        {!navBarOpen && <Link to='/'><img src={logo} height={75} /></Link>}
                        {isAuthenticated && <Fragment>
                                <div className='user-name' onClick={()=>{history.push('/user-profile')}}>
                                <dl>
                                    <dt style={{margin: 0}}>{isAuthenticated && <div> <p className='nombre'> { userData.name } { userData.lastName } </p> </div>}</dt>
                                    <dt> {userData.role} </dt>
                                </dl>
                                </div>
                            </Fragment>}
                            <div style={{position: 'absolute', right: 10}}>
                                <p><FontAwesomeIcon icon={faCircle} color={network ? '#2FB83F' : '#B62800'} /> {network ? 'Online' : 'Offline'}</p>
                                {!network && <p>Sin red</p>}
                            </div>
                    </Toolbar>
                    <Modal
                        open={openSign}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={styleModal}>
                            <div style={{width: '100%', textAlign: 'center'}}>
                                <h2>Para continuar deje su firma para la documentación. (Obligatorio)</h2>
                            </div>
                            <div style={{width: '100%', textAlign: 'center', position: 'relative'}}>
                                <div style={{position: 'absolute', width: '100%', textAlign: 'center', marginTop: 10}}>
                                    <FontAwesomeIcon size='lg' icon={faPen} color={'#333'} />
                                </div>
                                <Canvas 
                                    disabled={true}
                                    width={300} 
                                    height={300}
                                    setRefCanvas={setRefCanvasFunction}
                                />
                            </div>
                            <div style={{width: '100%', textAlign: 'center'}}>
                                <div style={{width: '50%', textAlign: 'center', float: 'left'}}>
                                    <Button 
                                    onClick={()=> clear()} 
                                    style={
                                        {
                                            borderStyle: 'solid',
                                            borderWidth: 1,
                                            borderColor: '#333',
                                            borderRadius: 10
                                            }
                                        }
                                    >
                                        <FontAwesomeIcon 
                                            size='lg' 
                                            icon={faEraser} 
                                            color={'#333'} 
                                            style={{marginRight: 10}}
                                        /> Borrar
                                    </Button>
                                </div>
                                <div style={{width: '50%', textAlign: 'center', float: 'right'}}>
                                    <Button 
                                    onClick={()=> getImage()}
                                    style={
                                        {
                                            borderStyle: 'solid',
                                            borderWidth: 1,
                                            borderColor: '#333',
                                            borderRadius: 10
                                            }
                                        }>
                                        <FontAwesomeIcon 
                                            size='lg' 
                                            icon={faSave} 
                                            color={'#333'} 
                                            style={{marginRight: 10}}
                                        /> Guardar
                                    </Button>
                                </div>
                            </div>
                        </Box>
                    </Modal>
                </div>
            </AppBar>
        )
    }
}

export default Header
