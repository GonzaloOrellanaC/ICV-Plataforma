import { createContext, useContext, useEffect, useState } from "react";
import { usersRoutes } from "../routes";
import { useAuth } from "./Auth.context";

export const UsersContext = createContext()

export const UsersProvider = props => {
    const {isAuthenticated, admin} = useAuth()
    const [users, setUsers] = useState([])

    useEffect(() => {
        if (isAuthenticated) {
            getUsers()
        }
    },[isAuthenticated])

    const getUsers = async () => {
        const response = await usersRoutes.getAllUsers(admin)
        setUsers(response.data)
    }

    const provider = {
        users,
        setUsers,
        getUsers
    }

    return (
        <UsersContext.Provider value={provider} {...props} />
    )
}

export const useUsersContext = () => useContext(UsersContext)