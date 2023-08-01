import { createContext, useContext, useEffect, useState } from "react";
import fecha from '../config/date'
import getHour from '../config/hour'

export const TimeContext = createContext()

export const TimeProvider = props => {
    /* const [isOnline, setIsOnline] = useState(false) */
    const [date, setDate] = useState('')
    const [hour, setHour] = useState('')

    useEffect(() => {
        setDate(`${traduceDia(new Date().getDay())} ${new Date().toLocaleDateString()}`);
        const interval = setInterval(() => {
            setHour(getHour(Date.now()))
        }, 100);
        return () => clearInterval(interval);
    },[])

    const traduceDia = (num) => {
        if (num === 0) {
            return 'Dom'
        } else if (num === 1) {
            return 'Lun'
        } else if (num === 2) {
            return 'Mar'
        } else if (num === 3) {
            return 'Mie'
        } else if (num === 4) {
            return 'Jue'
        } else if (num === 5) {
            return 'Vie'
        } else if (num === 6) {
            return 'Sab'
        } 
    }

    const provider = {
        date,
        hour
    }

    return (
        <TimeContext.Provider value={provider} {...props} />
    )
}

export const useTimeContext = () => useContext(TimeContext)