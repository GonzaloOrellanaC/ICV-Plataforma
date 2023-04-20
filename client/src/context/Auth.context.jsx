import { useLazyQuery } from '@apollo/client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { UsersGraphQL } from '../graphql'
import { authRoutes, sitesRoutes } from '../routes'

export const AuthContext = createContext()

export const AuthProvider = (props) => {
    const defaultAuthenticated  = Boolean(window.localStorage.getItem('isauthenticated'))
    const defaultAdmin = Boolean(window.localStorage.getItem('isAdmin'));
    const [ isAuthenticated, setIsAuthenticated ] = useState(defaultAuthenticated || false)
    /* const [ getSelf, { loading, error , data } ] = useLazyQuery(UsersGraphQL.query.GET_SELF) */
    const [ userData, setUserData ] = useState({});
    const [ admin, setAdmin ] = useState(defaultAdmin || false);
    const [ roles, setRoles ] = useState([])
    const [ sites, setSites ] = useState([])

/*      useEffect(() => {
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
        console.log(isAuthenticated)
    }, [isAuthenticated])

    /* useEffect(() => {
        getSelf()
    }, []) */

    /* const guardarDatos = (userDataToSave) => {
        localStorage.setItem('email', userDataToSave.email)
        localStorage.setItem('fullName', userDataToSave.fullName)
        localStorage.setItem('name', userDataToSave.name)
        localStorage.setItem('lastName', userDataToSave.lastName)
        localStorage.setItem('_id', userDataToSave._id)
        localStorage.setItem('role', userDataToSave.role)
        localStorage.setItem('roles', JSON.stringify(userDataToSave.roles))
        if (userDataToSave.roles && userDataToSave.roles[0]) {
            let roles = new Array
            roles = userDataToSave.roles
            if (roles.length > 0) {
                roles.map(rol => {
                    if(rol === 'admin' || rol === 'superAdmin') {
                        localStorage.setItem('isAdmin', true);
                        setAdmin(true)
                    }else if(rol === 'inspectionWorker' || rol === 'maintenceOperator') {
                        localStorage.setItem('isOperator', true)
                    }else if(rol === 'sapExecutive') {
                        localStorage.setItem('isSapExecutive', true)
                    }else if(rol === 'shiftManager') {
                        localStorage.setItem('isShiftManager', true)
                    }else if(rol === 'chiefMachinery') {
                        localStorage.setItem('isChiefMachinery', true)
                    }else{
                        localStorage.setItem('isAdmin', false);
                        setAdmin(false);
                    }
                })
            }
        }
        if (userDataToSave.role.length > 0) {
            if(userDataToSave.role === 'admin' || userDataToSave.role === 'superAdmin') {
                localStorage.setItem('isAdmin', true)
                setAdmin(true)
            }else{
                localStorage.setItem('isAdmin', false)
                setAdmin(false);
            }
        }
        if(userDataToSave.sites) {
            localStorage.setItem('sitio', userDataToSave.sites)
        }
    } */

    const loginRut = async (rut, password) => {
        const response = await authRoutes.loginRut(rut, password)

    }

    const provider = {
        /* userData, */
        isAuthenticated,
        /* loading,
        error, */
        admin,
        roles,
        sites,
        loginRut: (rut, password) => {
            return new Promise(resolve => {
                console.log(rut)
                authRoutes.loginRut(rut, password)
                .then(async response => {
                    let userDataToSave = response.data
                    console.log(userDataToSave)
                    if(response.data.enabled) {
                        localStorage.setItem('email', userDataToSave.email)
                        localStorage.setItem('fullName', userDataToSave.fullName)
                        localStorage.setItem('name', userDataToSave.name)
                        localStorage.setItem('lastName', userDataToSave.lastName)
                        localStorage.setItem('_id', userDataToSave._id)
                        localStorage.setItem('role', userDataToSave.role)
                        localStorage.setItem('roles', JSON.stringify(userDataToSave.roles))
                        setRoles(userDataToSave.roles)
                        if (userDataToSave.roles && userDataToSave.roles[0]) {
                            let roles = new Array
                            roles = userDataToSave.roles
                            if (roles.length > 0) {
                                roles.map(rol => {
                                    if(rol === 'admin' || rol === 'superAdmin') {
                                        localStorage.setItem('isAdmin', true);
                                        setAdmin(true)
                                    }else if(rol === 'inspectionWorker' || rol === 'maintenceOperator') {
                                        localStorage.setItem('isOperator', true)
                                    }else if(rol === 'sapExecutive') {
                                        localStorage.setItem('isSapExecutive', true)
                                    }else if(rol === 'shiftManager') {
                                        localStorage.setItem('isShiftManager', true)
                                    }else if(rol === 'chiefMachinery') {
                                        localStorage.setItem('isChiefMachinery', true)
                                    }else{
                                        localStorage.setItem('isAdmin', false);
                                        setAdmin(false);
                                    }
                                })
                            }
                        }
                        if (userDataToSave.role && userDataToSave.role.length > 0) {
                            if(userDataToSave.role === 'admin' || userDataToSave.role === 'superAdmin') {
                                localStorage.setItem('isAdmin', true)
                                setAdmin(true)
                            }else{
                                localStorage.setItem('isAdmin', false)
                                setAdmin(false);
                            }
                        }
                        /* setSites(userData.obras) */
                        if(userDataToSave.sites) {
                            if (userDataToSave.obras) {
                                const response = await sitesRoutes.getSiteById(userDataToSave.obras[0])
                                console.log(response.data)
                                localStorage.setItem('sitio', JSON.stringify(response.data.data))
                            } else {
                                localStorage.setItem('sitio', userDataToSave.sites)
                            }
                        } else {
                            if (userDataToSave.obras) {
                                const response = await sitesRoutes.getSiteById(userDataToSave.obras[0])
                                console.log(response.data)
                                localStorage.setItem('sitio', JSON.stringify(response.data.data))
                            } else {
                                localStorage.setItem('sitio', userDataToSave.sites)
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
                    console.log(response)
                    let userDataToSave = response.data
                    if(response.data.enabled) {
                        localStorage.setItem('email', userDataToSave.email)
                        localStorage.setItem('fullName', userDataToSave.fullName)
                        localStorage.setItem('name', userDataToSave.name)
                        localStorage.setItem('lastName', userDataToSave.lastName)
                        localStorage.setItem('_id', userDataToSave._id)
                        localStorage.setItem('role', userDataToSave.role)
                        localStorage.setItem('roles', JSON.stringify(userDataToSave.roles))
                        setRoles(userDataToSave.roles)
                        let roles = new Array
                        roles = userDataToSave.roles
                        if (roles.length > 0) {
                            roles.map(rol => {
                                if(rol === 'admin' || rol === 'superAdmin') {
                                    localStorage.setItem('isAdmin', true);
                                    setAdmin(true)
                                }else if(rol === 'inspectionWorker' || rol === 'maintenceOperator') {
                                    localStorage.setItem('isOperator', true)
                                }else if(rol === 'sapExecutive') {
                                    localStorage.setItem('isSapExecutive', true)
                                }else if(rol === 'shiftManager') {
                                    localStorage.setItem('isShiftManager', true)
                                }else if(rol === 'chiefMachinery') {
                                    localStorage.setItem('isChiefMachinery', true)
                                }else{
                                    localStorage.setItem('isAdmin', false);
                                    setAdmin(false);
                                }
                            })
                        }
                        if (userDataToSave.role && userDataToSave.role.length > 0) {
                            if(userDataToSave.role === 'admin' || userDataToSave.role === 'superAdmin') {
                                localStorage.setItem('isAdmin', true)
                                setAdmin(true)
                            }else{
                                localStorage.setItem('isAdmin', false)
                                setAdmin(false);
                            }
                        }
                        /* setSites(userData.obras) */
                        if(userDataToSave.sites) {
                            if (userDataToSave.obras) {
                                const response = await sitesRoutes.getSiteById(userDataToSave.obras[0])
                                console.log(response.data)
                                localStorage.setItem('sitio', JSON.stringify(response.data.data))
                            } else {
                                localStorage.setItem('sitio', userDataToSave.sites)
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
        
        <AuthContext.Provider value={provider} {...props} />
        
    )
}

export const useAuth = () => useContext(AuthContext)
