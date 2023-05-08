import React, { useState, useEffect, useContext } from 'react'
import { Box, Card, Grid, Toolbar, IconButton, Button, Modal,  Fab } from '@material-ui/core'
import { ArrowBackIos, Close } from '@material-ui/icons'
import { useStylesTheme } from '../../config'
import { CreateUser, PermissionUser } from '../../containers'
import { useHistory, useParams } from 'react-router-dom'
import { usersRoutes } from '../../routes'
import { validate } from 'rut.js';
import { LoadingLogoModal, LoadingModal } from '../../modals';
import transformInfo from './transform-info'
import { CreateUserContext, useUsersContext } from '../../context'

const styleModal = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    borderRadius: 20,
    boxShadow: 24,
    p: 4,
};

const AdminNewUserPage = () => {
    const {getUsers} = useUsersContext()
    const classes = useStylesTheme();
    const history = useHistory();
    const [ open, setOpen ] = useState(false);
    const [ openLoader, setOpenLoader ] = useState(false);
    const [ loadingData, setLoadingData ] = useState('');
    const [ routingData, setRoutingData ] = useState('');
    const [ usageModule, setUsageModule ] = useState();
    const {userData, setUserData, setChangeModule, set} = useContext(CreateUserContext)

    let { id } = useParams();

    const openCloseModal = () => {
        let answer
        if(open) {
            answer = false;
            history.goBack();
            deleteData();
        }else{
            answer = true
        }
        setTimeout(() => {
            setOpen(answer)
        }, 500);
    }

    useEffect(() => {
        if(id) {
            setRoutingData('Editar usuario');
            let uData = usersRoutes.getUser(id);
            uData.then(u => {
                console.log(u)
                if (u.data.email === 'x@x.xx') {
                    u.data.email = ''
                }
                setUserData(u.data);
                setUsageModule(0)
            })
        }else{
            setUsageModule(0)
            setRoutingData('Nuevo usuario');
        }
    }, [])

    const saveUser = async () => {
        setOpenLoader(true)
        if(routingData === 'Nuevo usuario') {
            try{
                setLoadingData('Inscribiendo nuevo usuario');
                let userState = await usersRoutes.createUser(userData, userData.password);
                if(userState.status == 200) {
                    setOpenLoader(false)
                    openCloseModal()
                    getUsers()
                }else{
                    alert('Error al crear usuario. Verifique los datos ingresados. Posiblemente haya repetido datos de algún usuario inscrito')
                    setOpenLoader(false)
                    history.goBack()
                }
            } catch (err) {
                alert('Error al crear usuario. Verifique los datos ingresados. Posiblemente haya repetido datos de algún usuario inscrito')
                setOpenLoader(false)
                history.goBack()
            }
        }else if(routingData === 'Editar usuario') {
            try{
                setLoadingData('Editando usuario');
                let userState = await usersRoutes.editUser(userData);
                if(userState.status == 200) {
                    setOpenLoader(false)
                    openCloseModal()
                    getUsers()
                }else{
                    alert('Error al editar usuario. Verifique los datos ingresados. Posiblemente haya repetido datos de algún usuario inscrito')
                    setOpenLoader(false)
                    history.goBack()
                }
            } catch (err) {
                alert('Error al crear usuario. Verifique los datos ingresados. Posiblemente haya repetido datos de algún usuario inscrito')
                setOpenLoader(false)
                history.goBack()
            }
        }
    }

    const editUser = () => {
        setOpenLoader(true)
        setTimeout(async() => {
            let userData = JSON.parse(localStorage.getItem('userDataToSave'))
            let userState = await usersRoutes.editUser(userData, id)
            if(userState) {
                openCloseModal()
                setOpenLoader(false)
            }
        }, 1000)
    }

    const deleteData = () => {
        localStorage.removeItem('userDataToSave');
        localStorage.removeItem('listaPermisosReportes');
        localStorage.removeItem('listaPermisosUsuarios');
    }

    const getUserInfo = async () => {
        if (userData.rut) {
            if (validate(userData.rut)) {
                if (userData.name) {
                    if(userData.lastName) {
                        /* if (userData.email) { */
                            if (userData.obras.length > 0) {
                                if (userData.roles.length > 0) {
                                    if (id) {
                                        setUsageModule(usageModule + 1)
                                    } else {
                                        if (userData.password.length > 5) {
                                            if (userData.confirmPassword.length > 5) {
                                                if (userData.confirmPassword === userData.password) {
                                                    setUsageModule(usageModule + 1)
                                                } else {
                                                    alert('Password y su confirmación deben ser iguales')
                                                }
                                            } else {
                                                alert('Password debe contar con al menos 6 carácteres')
                                            }
                                        } else {
                                            alert('Password debe contar con al menos 6 carácteres')
                                        }
                                    }
                                } else {
                                    alert('Seleccione al menos un rol')
                                }
                            } else {
                                alert('Debe seleccionar una obra')
                            }
                        /* } else {
                            alert('Ingrese correo')
                        } */
                    } else {
                        alert('Ingrese un apellido')
                    }
                } else {
                    alert('Ingrese un nombre')
                }
            } else {
                alert('Rut inválido')
            }
        } else {
            alert('Falta Rut')
        }
        /*let user = userData JSON.parse(localStorage.getItem('userDataToSave')); */
        /* let habilitado = true;
        console.log(user) */

        /* if(user) {
            if(user.rut) {
                if(validate(user.rut)) {
                    if(user.phone) {
                        console.log(user)
                        let infoFaltante = []
                        let userData = {}
                        if (user.email === "") {
                            userData.confirmPassword = user.confirmPassword
                            userData.password = user.password
                            userData.name = user.name
                            userData.lastName = user.lastName
                            userData.phone = user.phone
                            userData.role = user.role
                            userData.roles = user.roles
                            userData.rut = user.rut
                            userData.sites = user.sites
                            Object.values(userData).map(async (value, index) => {
                                console.log(value)
                                if(!value) {
                                    if(!id) {
                                        habilitado = false
                                    }
                                    infoFaltante.push(await transformInfo(Object.keys(user)[index]))
                                }
                                if(index == (Object.values(userData).length - 2)) {
                                    console.log(infoFaltante)
                                    if(!habilitado) {
                                        setTimeout(() => {
                                            console.log('Faltan datos: ' + JSON.stringify(infoFaltante))
                                            alert('Faltan datos: ' + JSON.stringify(infoFaltante))
                                        }, 100);
                                    }else{
                                        if(id) {
                                            setUsageModule(usageModule + 1)
                                        }else{
                                            if(user.password === user.confirmPassword) {
                                                setUsageModule(usageModule + 1)
                                            }else{
                                                alert('Contraseñas no coinciden')
                                            }
                                        }
                                    }
                                }
                            })
                        } else {
                            console.log(user)
                            Object.values(user).map(async (value, index) => {
                                console.log(value)
                                if(!value) {
                                    if(!id) {
                                        habilitado = false
                                    }
                                    infoFaltante.push(await transformInfo(Object.keys(user)[index]))
                                }
                                if(index == (Object.values(user).length - 2)) {
                                    console.log(infoFaltante)
                                    if(!habilitado) {
                                        setTimeout(() => {
                                            console.log('Faltan datos: ' + JSON.stringify(infoFaltante))
                                            alert('Faltan datos: ' + JSON.stringify(infoFaltante))
                                        }, 100);
                                    }else{
                                        if(id) {
                                            setUsageModule(usageModule + 1)
                                        }else{
                                            if(user.password === user.confirmPassword) {
                                                setUsageModule(usageModule + 1)
                                            }else{
                                                alert('Contraseñas no coinciden')
                                            }
                                        }
                                    }
                                }
                            })
                        }
                        
                    }else{
                        alert('Teléfono debe contar con al menos 9 carácteres')
                    }
                }else{
                    alert('Rut inválido. Revise los datos.')
                }
            }else{
                alert('Falta RUT')
            }
        }else{
            alert('Sin datos')
        } */
        
    }

    /* const validateRut = (rut) => {
        if(validate(rut)) {
            let user = await usersRoutes.findByRut(user.rut);
        }
    } */

    return (
        <Box height='100%'>
            <Grid className={'pageRoot'} container spacing={0}>
                <Grid className={classes.pageContainer} item xs={12}>
                    <Card elevation={0} className={'pageCard'}>
                        <Grid container alignItems='center' justifyContent='center'>
                            <div style={{width: '100%', textAlign: 'left', padding: 10 }}>
                                <div style={{width: '100%', textAlign: 'left', color: '#333', backgroundColor: '#fff', borderRadius: 20 }}>
                                    <Toolbar style={{paddingLeft: 0, backgroundColor: '#F9F9F9', borderRadius: 10}}>
                                        <IconButton onClick={() => setTimeout(() => {
                                            history.goBack();
                                            deleteData();
                                        }, 500)}> 
                                            <ArrowBackIos style={{color: '#333', fontSize: 16}}/> 
                                        </IconButton> 
                                        <h1 style={{marginTop: 0, marginBottom: 0, fontSize: 16}}>
                                            Administración / Administrar usuarios / {routingData}
                                        </h1>
                                    </Toolbar>
                                </div>
                            </div>
                        </Grid>
                        <Grid container alignItems='center' justifyContent='center'>
                            <div style={{width: '100%', textAlign: 'left', padding: 10, overflowY: 'auto', /* height: 'calc(100vh-700px)' */ }}>
                                {
                                    (usageModule === 0) &&
                                        <CreateUser /* width={'calc(100vw - 450px)'} height={'calc(100vh - 320px)'} */ typeDisplay={routingData} uData={userData} />
                                }
                                {   (usageModule === 1) &&
                                        <PermissionUser width={'calc(100vw - 350px)'} height={'calc(100vh - 320px)'} typeDisplay={routingData} id={id} />
                                }
                                <div style={{position: 'absolute', right: 40, bottom: 40}}>
                                    <div style={{width: "100%"}}>
                                        <div style={{float: 'right'}}>
                                        {
                                            usageModule == 1 &&
                                                <button onClick={()=>{setUsageModule(usageModule - 1); setChangeModule(false)}} style={{width: 189, height: 48, marginRight: 17, borderRadius: 23, fontSize: 20, color: '#fff',  backgroundColor: '#BB2D2D', borderColor: '#BB2D2D'}}>
                                                    Modificar Datos
                                                </button>
                                        }
                                        <button onClick={()=>{history.goBack(); deleteData();}} style={{width: 189, height: 48, borderRadius: 23, marginRight: 17, fontSize: 20, color: '#BB2D2D', borderColor: '#BB2D2D', borderWidth: 2}}>
                                            Cancelar
                                        </button>
                                        {
                                            usageModule == 0 &&
                                                <button onClick={()=>getUserInfo()} style={{width: 189, height: 48, borderRadius: 23, fontSize: 20, color: '#fff',  backgroundColor: '#BB2D2D', borderColor: '#BB2D2D'}}>
                                                    Siguiente
                                                </button>
                                        }
                                        {
                                            ((usageModule > 0) && !id ) &&
                                                <button onClick={()=>{saveUser()}} style={{width: 189, height: 48, borderRadius: 23, fontSize: 20, color: '#fff',  backgroundColor: '#BB2D2D', borderColor: '#BB2D2D'}}>
                                                    Crear usuario
                                                </button>
                                        }
                                        {
                                            ((usageModule > 0) && id ) &&
                                                <button onClick={()=>{editUser()}} style={{width: 189, height: 48, borderRadius: 23, fontSize: 20, color: '#fff',  backgroundColor: '#BB2D2D', borderColor: '#BB2D2D'}}>
                                                    Editar usuario
                                                </button>
                                        }
                                        </div>
                                    </div> 
                                </div>
                            </div>     
                        </Grid>
                        <div>
                            <Modal
                                open={open}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box sx={styleModal}>
                                    <div style={{textAlign: 'center'}}>
                                        <img src="../../assets/icons/check-green.svg" alt="" />
                                        {(routingData === 'Nuevo usuario') &&
                                            <h1>Usuario creado con éxito</h1>}
                                        {(routingData === 'Editar usuario') &&
                                            <h1>Usuario editado con éxito</h1>}
                                    </div>
                                    <Fab onClick={openCloseModal} style={{position: 'absolute', right: 10, top: 10, boxShadow: 'none', backgroundColor: 'transparent'}}>
                                        <Close style={{color: '#ccc'}} />
                                    </Fab>
                                </Box>
                            </Modal>
                            {/* <LoadingModal open={openLoader} loadingData={loadingData} withProgress={false}/> */}
                            <LoadingLogoModal open={openLoader} />
                        </div>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

export default AdminNewUserPage