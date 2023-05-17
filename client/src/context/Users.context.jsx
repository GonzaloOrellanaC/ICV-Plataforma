import { createContext, useContext, useEffect, useState } from "react";
import { usersRoutes } from "../routes";
import { useAuth } from "./Auth.context";

export const UsersContext = createContext()

export const UsersProvider = props => {
    const {isAuthenticated, admin, userData} = useAuth()
    const [users, setUsers] = useState([])
    const [usersFilteredBySite, setUsersFilteredBySite] = useState([])
    const [inspectors, setInspectors] = useState([])
    const [maitenances, setMaintenances] = useState([])

    useEffect(() => {
        if (isAuthenticated) {
            getUsers()
        }
    },[isAuthenticated])

    useEffect(() => {
        if (!admin && (users.length > 0) && userData.obras) {
            const usersCache = users.filter(user => {if(user.obras[0] && user.obras[0].idobra === userData.obras[0].idobra) {return user}})
            setUsersFilteredBySite(usersCache)
        }
    }, [users])

    useEffect(() => {
        const inspectorsCache = []
        const maintenancesCache = []
        if ((admin && users.length > 0) || (usersFilteredBySite.length > 0)) {
            (admin ? users : usersFilteredBySite).forEach(user => {
                user.roles.forEach(role => {
                    if (role === 'inspectionWorker') {
                        inspectorsCache.push(user)
                    }
                    if (role === 'maintenceOperator') {
                        maintenancesCache.push(user)
                    }
                })
            })
            setInspectors(inspectorsCache)
            setMaintenances(maintenancesCache)
        }
    }, [usersFilteredBySite, admin, users])

    const getUsers = async () => {
        const response = await usersRoutes.getAllUsers(admin, userData.isTest)
        setUsers(response.data)
    }

    const provider = {
        users,
        setUsers,
        getUsers,
        usersFilteredBySite,
        inspectors,
        maitenances
    }

    return (
        <UsersContext.Provider value={provider} {...props} />
    )
}

export const useUsersContext = () => useContext(UsersContext)