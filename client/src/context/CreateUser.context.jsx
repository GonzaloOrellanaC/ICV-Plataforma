import React, { createContext, useContext, useEffect, useState } from 'react'
import { useUsersContext } from '.'
import { useLocation } from 'react-router-dom';

export const CreateUserContext = createContext()

export const CreateUserProvider = (props) => {
    const [ rolesListSelectionCache, setRolesListSelectionCache ] = useState([]);
    const [changeModule, setChangeModule] = useState(false)

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

    /* useEffect(() => {
        console.log(userData)
    },[userData]) */

    useEffect(() => {
        if (changeModule) {
            const isRoleSelected = []
            console.log(rolesListSelectionCache)
            rolesListSelectionCache.forEach((role) => {
                if (role.selected) {
                    isRoleSelected.push(role.dbName)
                }
            })
            setUserData({...userData, roles: isRoleSelected})
            setChangeModule(false)
        }
    }, [changeModule])

    useEffect(() => {
        if (rolesListSelectionCache) {
            const isRoleSelected = []
            rolesListSelectionCache.forEach((role) => {
                if (role.selected) {
                    isRoleSelected.push(role.dbName)
                }
            })
            const userDataCache = userData
            userDataCache.roles = isRoleSelected
            console.log(userDataCache)
            setUserData({...userData, roles: isRoleSelected})
            setChangeModule(false)
        }
    },[rolesListSelectionCache])

    const provider = {
        userData,
        setUserData,
        rolesListSelectionCache,
        setRolesListSelectionCache,
        setChangeModule
    }

    return (
        
        <CreateUserContext.Provider value={provider} {...props} />
        
    )
}

export const useCreateUser = () => useContext(CreateUserContext)
