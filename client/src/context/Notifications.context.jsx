import { createContext, useContext, useEffect, useState } from "react";
import fecha from '../config/date'
import getHour from '../config/hour'
import { useAuth } from ".";
import { notificationsRoutes } from "../routes";

export const NotificationsContext = createContext()

export const NotificationsProvider = props => {
    const {userData, isAuthenticated} = useAuth()
    const [myNotifications, setMyNotifications] = useState([])
    const [lastNotification, setLastNotification] = useState()

    useEffect(() => {
        if (userData && isAuthenticated) {
            console.log(userData._id, isAuthenticated)
            getNotifications()
        }
    },[userData, isAuthenticated])

    const orderByDate = (a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt)
    }

    const getNotifications = async () => {
        const response = await notificationsRoutes.getNotificationsById(userData._id)
        console.log(response.data)
        setMyNotifications(response.data.sort(orderByDate))
        setLastNotification(response.data.sort(orderByDate)[0])
    }

    const provider = {
        myNotifications,
        lastNotification,
        getNotifications
    }

    return (
        <NotificationsContext.Provider value={provider} {...props} />
    )
}

export const useNotificationsContext = () => useContext(NotificationsContext)