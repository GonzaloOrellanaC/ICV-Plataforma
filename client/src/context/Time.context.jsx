import { createContext, useContext, useEffect, useState } from "react";
import fecha from '../config/date'
import getHour from '../config/hour'

export const TimeContext = createContext()

export const TimeProvider = props => {
    /* const [isOnline, setIsOnline] = useState(false) */
    const [date, setDate] = useState('')
    const [hour, setHour] = useState('')

    useEffect(() => {
        setDate(fecha(Date.now()));
        const interval = setInterval(() => {
            setHour(getHour(Date.now()))
        }, 100);
        return () => clearInterval(interval);
    },[])

    const provider = {
        date,
        hour
    }

    return (
        <TimeContext.Provider value={provider} {...props} />
    )
}

export const useTimeContext = () => useContext(TimeContext)