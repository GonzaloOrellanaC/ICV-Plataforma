import React, { createContext, useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min'

export const CreateUserContext = createContext()

export const CreateUserProvider = (props) => {

    const userDataDefault = {
        rut:'',
        name:'',
        lastName:'',
        email:'',
        phone:'',
        password:'',
        confirmPassword:'',
        sites: '',
        obras: [],
        roles: [],
        isTest: false
    }

    const location = useLocation()
    const [userData, setUserData] = useState({
        rut:'',
        name:'',
        lastName:'',
        email:'',
        phone:'',
        password:'',
        confirmPassword:'',
        sites: '',
        obras: [],
        roles: [],
        isTest: false
    })

    useEffect(() => {
        if (location.pathname === '/new-users') {
            
        } else {
            setUserData(userDataDefault)
        }
    },[location])

    useEffect(() => {
        if (userData) {
            console.log(userData)
        }
    }, [userData])

    const provider = {
        userData,
        setUserData
    }

    return (
        
        <CreateUserContext.Provider value={provider} {...props} />
        
    )
}

export const useCreateUser = () => useContext(CreateUserContext)
