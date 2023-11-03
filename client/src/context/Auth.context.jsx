import React, { createContext, useContext, useEffect, useState } from 'react'
import { authRoutes, unidadesRoutes, usersRoutes } from '../routes'
import { machinesDatabase, pautasDatabase, userDatabase } from '../indexedDB'
import { useNavigate } from 'react-router-dom'
import { FirmaUsuarioDialog } from '../dialogs'

export const AuthContext = createContext()

export const AuthProvider = (props) => {
    const [ isAuthenticated, setIsAuthenticated ] = useState(false)
    const [ userData, setUserData ] = useState(JSON.parse(localStorage.getItem('user'))||undefined);
    const [ admin, setAdmin ] = useState(false);
    const [ roles, setRoles ] = useState([])
    const [ site, setSite ] = useState()
    const [ isOperator, setIsOperator ] = useState(false)
    const [ isSapExecutive, setIsSapExecutive ] = useState(false)
    const [ isShiftManager, setIsShiftManager ] = useState(false)
    const [ isChiefMachinery, setIsChiefMachinery ] = useState(false)
    const [ refCanvas, setRefCanvas ] = useState()
    const [ openSign, setOpenSign ] = useState(false)
    const [unidades, setUnidades] = useState([])
    const navigate = useNavigate()

    /* useEffect(() =>{
        console.log(site)
    },[site]) */

    useEffect(() => {
        /* console.log(Boolean(window.localStorage.getItem('isauthenticated'))) */
        if (window.localStorage.getItem('isauthenticated')==='true') {
            setIsAuthenticated(true)
        }
    }, [])

    useEffect(() => {
        if (isAuthenticated) {
            Notification.requestPermission().then((res) => {
                if(res === 'denied' || res === 'default') {
                    
                }
            })
            if (!userData) {
                getUserDataFromIndexedDb()
            }
        } else {
            machinesDatabase.borrarDb()
        }
    }, [isAuthenticated])

    useEffect(() => {
        if (isAuthenticated && userData) {
            getUnidades()
        }
    },[isAuthenticated, userData])

    useEffect(() => {
        if (unidades.length === 0) {
            if (localStorage.getItem('unidades')) {
                const unidadesCache = JSON.parse(localStorage.getItem('unidades'))
                setUnidades(unidadesCache)
            }
        }
    }, [unidades])

    const getUnidades = async () => {
        const response = await unidadesRoutes.getUnidades()
        /* console.log(response.data) */
        localStorage.setItem('unidades', JSON.stringify(response.data.unidades))
        if (response.data.state) {
            setUnidades(response.data.unidades)
        }
    }

    useEffect(() => {
        if (userData) {
            if (!userData.sign || userData.sign.length < 1) {
                setTimeout(() => {
                    setOpenSign(true)
                }, 500)
            }
            if (userData.roles.length > 0) {
                let listaRoles = []
                listaRoles = userData.roles
                listaRoles.forEach(rol => {
                    if(rol === 'admin' || rol === 'superAdmin') {
                        localStorage.setItem('isAdmin', true);
                        setAdmin(true)
                    }else if(rol === 'inspectionWorker' || rol === 'maintenceOperator') {
                        localStorage.setItem('isOperator', true)
                        setIsOperator(true)
                    }else if(rol === 'sapExecutive') {
                        localStorage.setItem('isSapExecutive', true)
                        setIsSapExecutive(true)
                    }else if(rol === 'shiftManager') {
                        localStorage.setItem('isShiftManager', true)
                        setIsShiftManager(true)
                    }else if(rol === 'chiefMachinery') {
                        localStorage.setItem('isChiefMachinery', true)
                        setIsChiefMachinery(true)
                    }else{
                        localStorage.setItem('isAdmin', false);
                        setAdmin(false);
                    }
                })
            }
        } else {
            getUserDataFromIndexedDb()
        }
        if (userData && userData.obras.length > 0) {
            setSite(userData.obras[0])
            window.localStorage.setItem('sitio', JSON.stringify(userData.obras[0]))
        }
    },[userData])

    const saveUserToDb = async (userDataLocal) => {
        const {database} = await userDatabase.initDb()
        await userDatabase.actualizar(userDataLocal, database)
    }

    const getUserDataFromIndexedDb = async () => {
        console.log('obteniendo datos de usuario desde base de datos')
        const {database} = await userDatabase.initDb()
        const response = await userDatabase.consultar(database)
        setUserData(response[0])
    }

    const setRefCanvasFunction = (ref) => {
        setRefCanvas(ref);
    }

    const clear = () => {
        refCanvas.clear();
    }

    const getImage = () => {
        usersRoutes.editUser({sign: refCanvas.toDataURL()}, userData._id).then(async () => {
            const userDataTemp = userData
            userDataTemp.sign = refCanvas.toDataURL()
            setUserData(userDataTemp)
            saveUserToDb(userDataTemp)
            localStorage.setItem('user', JSON.stringify(userDataTemp))
            setOpenSign(false);
            alert('Muchas gracias. Su firma ha sido actualizada.')
        })
    }

    const provider = {
        userData,
        setUserData,
        isAuthenticated,
        admin,
        roles,
        site,
        setSite,
        isOperator,
        isSapExecutive,
        isShiftManager,
        isChiefMachinery,
        /* newReport, */
        loginRut: (rut, password) => {
            return new Promise(resolve => {
                authRoutes.loginRut(rut, password)
                .then(async response => {
                    let userDataToSave = response.data
                    if(response.data.enabled) {
                        setRoles(userDataToSave.roles)
                        setUserData(userDataToSave)
                        localStorage.setItem('user', JSON.stringify(userDataToSave))
                        if (userDataToSave.role && userDataToSave.role.length > 0) {
                            if(userDataToSave.role === 'admin' || userDataToSave.role === 'superAdmin') {
                                localStorage.setItem('isAdmin', true)
                                setAdmin(true)
                            }else{
                                localStorage.setItem('isAdmin', false)
                                setAdmin(false);
                            }
                        }
                        localStorage.setItem('isauthenticated', true)
                        resolve({
                            state: true,
                            response: response
                        })
                        setIsAuthenticated(true)
                    } else {
                        if (response.data.message==='usuario no encontrado') {
                            localStorage.setItem('isauthenticated', false)
                            setIsAuthenticated(false)
                            alert('Usuario no encontrado.')
                            resolve({
                                state: false,
                            })
                        } else {
                            localStorage.setItem('isauthenticated', false)
                            setIsAuthenticated(false)
                            alert('Su cuenta no está habilitada, debe confirmarla.')
                            resolve({
                                state: false,
                            })
                        }
                    }
                })
                .catch(error => {
                    localStorage.setItem('isauthenticated', false)
                    alert((JSON.stringify(error).includes('400')) ? 'Contraseña incorrecta' : 'Error de autenticación: '+ error)
                    setIsAuthenticated(false)
                })
            })
        },
        login: (email, password) => {
            return new Promise(resolve => {
                authRoutes.login(email, password)
                .then(async response => {
                    let userDataToSave = response.data
                    if(response.data.enabled) {
                        setRoles(userDataToSave.roles)
                        setUserData(userDataToSave)
                        localStorage.setItem('user', JSON.stringify(userDataToSave))
                        if (userDataToSave.role && userDataToSave.role.length > 0) {
                            if(userDataToSave.role === 'admin' || userDataToSave.role === 'superAdmin') {
                                localStorage.setItem('isAdmin', true)
                                setAdmin(true)
                            }else{
                                localStorage.setItem('isAdmin', false)
                                setAdmin(false);
                            }
                        }
                        localStorage.setItem('isauthenticated', true)
                        resolve({
                            state: true,
                            response: response
                        })
                        setIsAuthenticated(true)
                    } else {
                        if (response.data.message==='usuario no encontrado') {
                            localStorage.setItem('isauthenticated', false)
                            setIsAuthenticated(false)
                            alert('Usuario no encontrado.')
                            resolve({
                                state: false,
                            })
                        } else {
                            localStorage.setItem('isauthenticated', false)
                            setIsAuthenticated(false)
                            alert('Su cuenta no está habilitada, debe confirmarla.')
                            resolve({
                                state: false,
                            })
                        }
                    }
                })
                .catch(error => {
                    localStorage.setItem('isauthenticated', false)
                    alert((JSON.stringify(error).includes('400')) ? 'Contraseña incorrecta' : 'Error de autenticación: '+ error)
                    setIsAuthenticated(false)
                })
            })
        },
        logout: async () => {
            if(confirm('Confirme salida de la aplicación. Para volver a iniciar sesión requiere contar con internet para validar las credenciales.')) {
                setTimeout(() => {
                    window.localStorage.clear()
                    navigate('/', {replace:true})
                    setIsAuthenticated(false)
                    pautasDatabase.borrarDb()
                }, 500);
            }
        },
        unidades
    }

    return (
        
        <>
        <AuthContext.Provider value={provider} {...props}/>
        <FirmaUsuarioDialog openSign={openSign} setRefCanvasFunction={setRefCanvasFunction} getImage={getImage} clear={clear} />
        </>
        
    )
}

export const useAuth = () => useContext(AuthContext)
