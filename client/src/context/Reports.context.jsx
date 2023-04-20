import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthContext } from './Auth.context'
import { reportsRoutes } from '../routes'

const ReportsContext = createContext()

export const ReportsProvider = (props) => {
    const {admin, roles, sites} = useContext(AuthContext)
    const [reports, setReports] = useState([])

    useEffect(() => {
        if (reports.length > 0) {

        }
    }, [reports])

    const getReports = async () => {
        if (admin) {
            const response = await reportsRoutes.getAllReports()
        } else {

        }
    }

    const provider = {
        reports,
        setReports
    }

    return (
        <ReportsContext.Provider value={provider} {...props} />
    )
}

export const useReportsContext = () => useContext(ReportsContext)