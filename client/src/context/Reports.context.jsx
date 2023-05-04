import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthContext } from './Auth.context'
import { reportsRoutes } from '../routes'
import { reportsDatabase } from '../indexedDB'

export const ReportsContext = createContext()

export const ReportsProvider = (props) => {
    const {admin, roles, site, isOperator, isAuthenticated, userData} = useContext(AuthContext)
    const [reports, setReports] = useState([])
    const [assignments, setAssignments] = useState([])

    useEffect(() => {
        console.log(reports)
        if (reports.length > 0) {
            setAssignments(reports)
        }
    }, [reports])

    useEffect(() => {
        if (assignments.length > 0) {
            saveReportsToIndexedDb()
        }
    }, [assignments])

    useEffect(() => {
        console.log(userData)
    },[userData])

    useEffect(() => {
        if (isAuthenticated && site && userData) {
            getReports()
        }
    }, [isAuthenticated, site, userData])

    const saveReportsToIndexedDb = async () => {
        const {database} = await reportsDatabase.initDbReports()
        assignments.forEach(async (report, i) => {
            const response = await reportsDatabase.actualizar(report, database)
            console.log(response)
        })
    }

    const getReports = async () => {
        if (admin) {
            const response = await reportsRoutes.getAllReports()
            console.log(response)
        } else {
            if (isOperator) {
                console.log(isAuthenticated, site, userData)
                const response = await reportsRoutes.findMyAssignations(userData._id, site.idobra)
                console.log(response)
                setReports(response.data)
            }
        }
    }

    const provider = {
        reports,
        setReports,
        assignments
    }

    return (
        <ReportsContext.Provider value={provider} {...props} />
    )
}

export const useReportsContext = () => useContext(ReportsContext)