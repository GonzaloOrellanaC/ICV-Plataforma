import { useLazyQuery } from '@apollo/client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { UsersGraphQL } from '../graphql'
import { authRoutes } from '../routes'

const AuthContext = createContext()

export const AuthProvider = (props) => {
    const defaultAuthenticated  = Boolean(window.localStorage.getItem('isauthenticated'));
    const [isAuthenticated, setIsAuthenticated] = useState(defaultAuthenticated || false)
    const [getSelf, { loading, error, data }] = useLazyQuery(UsersGraphQL.query.GET_SELF)
    const [userData, setUserData] = useState({})

    useEffect(() => {
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
        //getSelf()
    }, [])

    const provider = {
        userData,
        isAuthenticated,
        loading,
        error,
        login: (email, password) => {
            return new Promise(resolve => {
                authRoutes.login(email, password)
                .then(response => {
                    if(response.data.enabled) {
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
                    alert('Error de autenticación.')
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
