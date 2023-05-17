import React, { createContext, useContext, useEffect, useState } from 'react'
import { authRoutes, sitesRoutes, usersRoutes } from '../routes'
import { userDatabase } from '../indexedDB'
import { FirmaUsuario } from '../modals'
import { styleModal } from '../config'
import {SocketConnection} from '../connections'
export const AuthContext = createContext()

export const AuthProvider = (props) => {
    const defaultAuthenticated  = Boolean(window.localStorage.getItem('isauthenticated'))
    const defaultAdmin = Boolean(window.localStorage.getItem('isAdmin'));
    const [ isAuthenticated, setIsAuthenticated ] = useState(defaultAuthenticated || false)
    /* const [ getSelf, { loading, error , data } ] = useLazyQuery(UsersGraphQL.query.GET_SELF) */
    const [ userData, setUserData ] = useState(JSON.parse(localStorage.getItem('user'))||undefined);
    const [ admin, setAdmin ] = useState(defaultAdmin || false);
    const [ roles, setRoles ] = useState([])
    const [ site, setSite ] = useState()
    const [ isOperator, setIsOperator ] = useState(false)
    const [ isSapExecutive, setIsSapExecutive ] = useState(false)
    const [ isShiftManager, setIsShiftManager ] = useState(false)
    const [ isChiefMachinery, setIsChiefMachinery ] = useState(false)
    const [ refCanvas, setRefCanvas ] = useState()
    const [ openSign, setOpenSign ] = useState(false)

    /*useEffect(() => {
        if (data?.self) {
            console.log(data?.self)
            setUserData(data.self)
        }
        if(!data) {

        }
    }, [data]) */

    /* useEffect(() => {
        if (error) {
            setIsAuthenticated(false)
            window.localStorage.setItem('isauthenticated', false)
        }
    }, [error]) */

    useEffect(() => {
        if (isAuthenticated) {
            setIsOperator(Boolean(localStorage.getItem('isOperator')))
            setSite(JSON.parse(window.localStorage.getItem('sitio')))
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
        isOperator,
        isSapExecutive,
        isShiftManager,
        isChiefMachinery,
        loginRut: (rut, password) => {
            return new Promise(resolve => {
                console.log(rut)
                authRoutes.loginRut(rut, password)
                .then(async response => {
                    let userDataToSave = response.data
                    setUserData(userDataToSave)
                    localStorage.setItem('user', JSON.stringify(userDataToSave))
                    if(response.data.enabled) {
                        setRoles(userDataToSave.roles)
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
                        setIsAuthenticated(true)
                        resolve({
                            state: true,
                            response: response
                        })
                    } else {
                        localStorage.setItem('isauthenticated', false)
                        setIsAuthenticated(false)
                        alert('Su cuenta no está habilitada, debe confirmarla.')
                        resolve({
                            state: false,
                        })
                    }
                })
                .catch(error => {
                    console.log(error)
                    localStorage.setItem('isauthenticated', false)
                    alert('Error de autenticación: '+error)
                    setIsAuthenticated(false)
                })
            })
        },
        login: (email, password) => {
            return new Promise(resolve => {
                authRoutes.login(email, password)
                .then(async response => {
                    let userDataToSave = response.data
                    setUserData(userDataToSave)
                    localStorage.setItem('user', JSON.stringify(userDataToSave))
                    if(response.data.enabled) {
                        setRoles(userDataToSave.roles)
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
                        setIsAuthenticated(true)
                        resolve({
                            state: true,
                            response: response
                        }) 
                    } else {
                        localStorage.setItem('isauthenticated', false)
                        setIsAuthenticated(false);
                        alert('Su cuenta no está habilitada, debe confirmarla.')
                        resolve({
                            state: false,
                        })
                    }
                })
                .catch(error => {
                    localStorage.setItem('isauthenticated', false)
                    alert('Error de autenticación: '+error)
                    setIsAuthenticated(false)
                })
            })
        }
        
    }

    return (
        
        <>
        <AuthContext.Provider value={provider} {...props}/>
        <FirmaUsuario openSign={openSign} styleModal={styleModal} setRefCanvasFunction={setRefCanvasFunction} getImage={getImage} clear={clear} />
        </>
        
    )
}

export const useAuth = () => useContext(AuthContext)
