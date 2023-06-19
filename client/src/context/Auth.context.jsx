import React, { createContext, useContext, useEffect, useState } from 'react'
import { authRoutes, usersRoutes } from '../routes'
import { userDatabase } from '../indexedDB'
import { useNavigate } from 'react-router-dom'
import { FirmaUsuarioDialog } from '../dialogs'

export const AuthContext = createContext()

export const AuthProvider = (props) => {
    /* const defaultAdmin = Boolean(window.localStorage.getItem('isAdmin')); */
    const [ isAuthenticated, setIsAuthenticated ] = useState(false)
    /* const [ getSelf, { loading, error , data } ] = useLazyQuery(UsersGraphQL.query.GET_SELF) */
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
    const navigate = useNavigate()

    useEffect(() => {
        console.log(Boolean(window.localStorage.getItem('isauthenticated')))
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
        }
    }, [isAuthenticated])

    useEffect(() => {
        if (userData) {
            if (!userData.sign || userData.sign.length < 1) {
                setTimeout(() => {
                    setOpenSign(true)
                }, 500);
            }
            if (userData.roles.length > 0) {
                userData.roles.map(rol => {
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
    },[userData])

    useEffect(() => {
        if (userData && userData.obras.length > 0) {
            setSite(userData.obras[0])
            window.localStorage.setItem('sitio', JSON.stringify(userData.obras[0]))
        }
    },[userData])

    /* useEffect(() => {
        if (userData && isAuthenticated) { */
            /* SocketConnection.listenNotifocations(userData, getData) */
        /* }
    },[userData, isAuthenticated])

    const getData = (data) => {
        console.log(data)
        addNotification({
            icon: logoNotification,
            title: data.title,
            subtitle: data.subtitle,
            message: data.message,
            theme: 'red',
            native: true
        })
        if (data.report) {
            setNewReport(data.report)
        }
    } */

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
                console.log(rut)
                authRoutes.loginRut(rut, password)
                .then(async response => {
                    console.log(response)
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
                    console.log(response)
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
        logout: () => {
            if(confirm('Confirme salida de la aplicación. Para volver a iniciar sesión requiere contar con internet para validar las credenciales.')) {
                window.localStorage.clear();
                navigate('/', {replace:true})
                setIsAuthenticated(false)
            }
        }
    }

    return (
        
        <>
        <AuthContext.Provider value={provider} {...props}/>
        <FirmaUsuarioDialog openSign={openSign} setRefCanvasFunction={setRefCanvasFunction} getImage={getImage} clear={clear} />
        </>
        
    )
}

export const useAuth = () => useContext(AuthContext)
