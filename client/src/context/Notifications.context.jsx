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
            getNotifications()
        }
    },[userData, isAuthenticated])

    const getNotifications = async () => {
        const response = await notificationsRoutes.getNotificationsById(userData._id)
        setMyNotifications(response.data.reverse())
        setLastNotification(response.data.reverse()[0])
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