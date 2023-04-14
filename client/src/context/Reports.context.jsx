import React, { createContext, useContext, useEffect, useState } from 'react'

const ReportsContext = createContext()

export const ReportsProvider = (props) => {

    const [reports, setReports] = useState([])

    useEffect(() => {
        if (reports.length > 0) {

        }
    }, [reports])

    const provider = {
        reports,
        setReports
    }

    return (
        <ReportsContext.Provider value={provider} {...props} />
    )
}

export const useReportsContext = () => useContext(ReportsContext)