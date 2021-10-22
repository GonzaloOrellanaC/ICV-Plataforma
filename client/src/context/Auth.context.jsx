import { useLazyQuery } from '@apollo/client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { UsersGraphQL } from '../graphql'
import { authRoutes } from '../routes'

const AuthContext = createContext()

export const AuthProvider = (props) => {
    const defaultAuthenticated  = Boolean(JSON.parse(window.localStorage.getItem('isauthenticated')));
    const [isAuthenticated, setIsAuthenticated] = useState(defaultAuthenticated || false)
    const [getSelf, { loading, error, data }] = useLazyQuery(UsersGraphQL.query.GET_SELF)
    const [userData, setUserData] = useState({})

    useEffect(() => {
        if (data?.self) {
            setUserData(data.self)
        }
        if(!data) {
            //console.log('NO HAY AUTENTICACIÓN');
        }
    }, [data])

    useEffect(() => {
        if (error) {
            setIsAuthenticated(true)
            window.localStorage.setItem('isauthenticated', false)
        }
    }, [error])

    useEffect(() => {
        getSelf()
    }, [])

    const provider = {
        userData,
        isAuthenticated,
        loading,
        error,
        login: (email, password) => {
            authRoutes.login(email, password)
            .then(response => {
                setUserData(response.data.userInfo);
                window.localStorage.setItem('email', userData.email);
                window.localStorage.setItem('fullName', userData.fullName);
                window.localStorage.setItem('name', userData.name);
                window.localStorage.setItem('lastName', userData.lastName);
                setTimeout(() => {
                    setIsAuthenticated(true)
                    window.localStorage.setItem('isauthenticated', true)
                    //getSelf();
                    console.log(userData)
                }, 500);
                
            })
            .catch(error => {
                //console.log('REPLACE: Error notification')
                //console.log(error)
                setIsAuthenticated(false)
                window.localStorage.setItem('isauthenticated', false)
            })
        }
        
    }

    return (
        <AuthContext.Provider value={provider} {...props} />
    )
}

export const useAuth = () => useContext(AuthContext)
