import { createContext, useContext, useEffect, useState } from "react";

export const ConnectionContext = createContext()

export const ConnectionProvider = props => {
    const [isOnline, setIsOnline] = useState(true)

    useEffect(() => {
        window.addEventListener('online', () => {
            setIsOnline(true)
        })
        window.addEventListener('offline', () => {
            setIsOnline(false)
        })
    },[])

    useEffect(() => {
        console.log('Network: ', isOnline)
    },[isOnline])

    const provider = {
        isOnline
    }

    return (
        <ConnectionContext.Provider value={provider} {...props} />
    )
}

export const useConnectionContext = () => useContext(ConnectionContext)