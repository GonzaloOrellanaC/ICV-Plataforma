import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from ".";
import { newsRoutes, notificationsRoutes } from "../routes";

export const NotificationsContext = createContext()

export const NotificationsProvider = props => {
    const {userData, isAuthenticated} = useAuth()
    const [myNotifications, setMyNotifications] = useState([])
    const [lastNotification, setLastNotification] = useState()
    const [listaLectura, setListaLectura] = useState(false)

    const [noticias, setNoticias] = useState([])
    const [ultimaNoticia, setUltimaNoticia] = useState()

    useEffect(() => {
        if (userData && isAuthenticated) {
            getNoticias()
            getNotifications()
        }
    },[userData, isAuthenticated])

    const orderByDate = (a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt)
    }

    const getNoticias = async () => {
        const response = await newsRoutes.getMyNews(userData._id)
        setNoticias(response.data.data.sort(orderByDate))
        setUltimaNoticia(response.data.data.sort(orderByDate)[0])
        setListaLectura(true)
    }

    const getNotifications = async () => {
        const response = await notificationsRoutes.getNotificationsById(userData._id)
        setMyNotifications(response.data.sort(orderByDate))
        setLastNotification(response.data.sort(orderByDate)[0])
    }

    const provider = {
        myNotifications,
        lastNotification,
        getNotifications,
        noticias,
        ultimaNoticia,
        listaLectura
    }

    return (
        <NotificationsContext.Provider value={provider} {...props} />
    )
}

export const useNotificationsContext = () => useContext(NotificationsContext)