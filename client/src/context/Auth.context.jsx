import { useLazyQuery } from '@apollo/client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { UsersGraphQL } from '../graphql'
import { authRoutes } from '../routes'

const AuthContext = createContext()

export const AuthProvider = (props) => {
    const defaultAuthenticated  = Boolean(window.localStorage.getItem('isauthenticated'));
    const defaultAdmin = Boolean(window.localStorage.getItem('isAdmin'));
    const [isAuthenticated, setIsAuthenticated] = useState(defaultAuthenticated || false)
    const [getSelf, { loading, error, data }] = useLazyQuery(UsersGraphQL.query.GET_SELF)
    const [userData, setUserData] = useState({});
    const [ admin, setAdmin ] = useState(defaultAdmin || false)

    /* useEffect(() => {
        if (data?.self) {
            setUserData(data.self)
        }
        if(!data) {

        }
    }, [data])

    useEffect(() => {
        if (error) {
            setIsAuthenticated(false)
            window.localStorage.setItem('isauthenticated', false)
        }
    }, [error])

    useEffect(() => {
        getSelf()
    }, []) */

    const provider = {
        userData,
        isAuthenticated,
        loading,
        error,
        admin,
        login: (email, password) => {
            return new Promise(resolve => {
                authRoutes.login(email, password)
                .then(response => {
                    console.log(response);
                    let userDataToSave = response.data;
                    if(response.data.enabled) {
                        localStorage.setItem('email', userDataToSave.email);
                        localStorage.setItem('fullName', userDataToSave.fullName);
                        localStorage.setItem('name', userDataToSave.name);
                        localStorage.setItem('lastName', userDataToSave.lastName);
                        localStorage.setItem('_id', userDataToSave._id);
                        localStorage.setItem('role', userDataToSave.role);
                        if(userDataToSave.role === 'admin' || userDataToSave.role === 'superAdmin') {
                            localStorage.setItem('isAdmin', true);
                            setAdmin(true)
                        }else{
                            localStorage.setItem('isAdmin', false);
                            setAdmin(false)
                        }
                        if(userDataToSave.sites) {
                            localStorage.setItem('sitio', userDataToSave.sites);
                        }
                        localStorage.setItem('isauthenticated', true);
                        setIsAuthenticated(true);
                        resolve({
                            state: true,
                            response: response
                        })
                    }else{
                        setIsAuthenticated(false);
                        alert('Su cuenta no está habilitada, debe confirmarla.')
                        resolve({
                            state: false,
                        })
                    }
                })
                .catch(error => {
                    alert('Error de autenticación: '+error);
                    console.log(error)
                    setIsAuthenticated(false);
                    localStorage.setItem('isauthenticated', false);
                })
            })
        }
        
    }

    return (
        
        <AuthContext.Provider value={provider} {...props} />
        
    )
}

export const useAuth = () => useContext(AuthContext)
