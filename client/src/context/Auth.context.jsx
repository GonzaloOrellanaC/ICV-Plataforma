import React, { createContext, useContext, useState } from 'react'
import { authRoutes } from '../routes'

const AuthContext = createContext()

export const AuthProvider = (props) => {
    const [userData, setUserData] = useState({})
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    const provider = {
        userData,
        isAuthenticated,
        login: (email, password) => {
            authRoutes.login(email, password)
                .then(response => {
                    setUserData(response.data.userInfo)
                    setIsAuthenticated(true)
                })
                .catch(error => {
                    console.log('REPLACE: Error notification')
                    console.log(error)
                    setUserData({})
                    setIsAuthenticated(false)
                })
        }
    }

    return (
        <AuthContext.Provider value={provider} {...props} />
    )
}

export const useAuth = () => useContext(AuthContext)
