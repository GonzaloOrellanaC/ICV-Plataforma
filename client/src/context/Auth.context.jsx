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
            console.log('NO HAY AUTENTICACIÓN');
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
    }, [])

    const provider = {
        userData,
        isAuthenticated,
        loading,
        error,
        login: (email, password) => {
            authRoutes.login(email, password)
            .then(response => {
                setUserData(response.data.userInfo)
                setIsAuthenticated(true)
                window.localStorage.setItem('isauthenticated', true)
                getSelf()
            })
            .catch(error => {
                console.log('REPLACE: Error notification')
                console.log(error)
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
