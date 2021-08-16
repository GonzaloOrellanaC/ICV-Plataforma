import { useLazyQuery } from '@apollo/client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { UsersGraphQL } from '../graphql'
import { authRoutes } from '../routes'

const AuthContext = createContext()

export const AuthProvider = (props) => {
    const defaultAuthenticated = window.localStorage.getItem('isauthenticated')
    const [userData, setUserData] = useState({})
    const [isAuthenticated, setIsAuthenticated] = useState(defaultAuthenticated || false)
    const [getSelf, { loading, error, data }] = useLazyQuery(UsersGraphQL.query.GET_SELF)

    useEffect(() => {
        console.log(data)
        if (data?.self) {
            setUserData(data.self)
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
