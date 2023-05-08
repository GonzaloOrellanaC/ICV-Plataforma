import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthContext } from './Auth.context'
import { machinesRoutes, patternsRoutes, reportsRoutes } from '../routes'
import { pautasDatabase, reportsDatabase } from '../indexedDB'
import { useConnectionContext } from './Connection.context'
import { LoadingLogoModal } from '../modals'

export const ReportsContext = createContext()

export const ReportsProvider = (props) => {
    const {isOnline} = useConnectionContext()
    const {admin, isSapExecutive, isShiftManager, isChiefMachinery, roles, site, isOperator, isAuthenticated, userData} = useContext(AuthContext)
    const [reports, setReports] = useState([])
    const [assignments, setAssignments] = useState([])
    const [listSelected, setListSelected] = useState([])
    const [pautas, setPautas] = useState([])
    const [loading, setLoading] = useState(false)
    const [priorityAssignments, setPriorityAssignments] = useState([])
    const [normalAssignments, setnormalAssignments] = useState([])

    useEffect(() => {
        if (reports.length > 0) {
            setLoading(false)
            reports.forEach((report, i) => {
                if(report.guide === 'Pauta de Inspección') {
                    report._guide = 'PI' 
                }else{
                    report._guide = report.guide
                }
            })
            setAssignments(reports)
            saveReportsToIndexedDb()
            getAllPautas()
        } else {
            setLoading(false)
            setAssignments([])
        }
    }, [reports])

    useEffect(() => {
        if (assignments.length > 0) {
            if (isShiftManager) {
                const priorityAssignmentsCache = []
                const assignmentsCache = []
                assignments.forEach((assignment, i) => {
                    if (assignment.level === 1) {
                        assignment.isPrioritary = true
                        priorityAssignmentsCache.push(assignment)
                    } else {
                        assignment.isPrioritary = false
                        assignmentsCache.push(assignment)
                    }
                })
                setPriorityAssignments(priorityAssignmentsCache)
                setnormalAssignments(assignmentsCache)
            } else if (isChiefMachinery) {
                const priorityAssignmentsCache = []
                const assignmentsCache = []
                assignments.forEach((assignment, i) => {
                    if (assignment.level === 2) {
                        assignment.isPrioritary = true
                        priorityAssignmentsCache.push(assignment)
                    } else {
                        assignment.isPrioritary = false
                        assignmentsCache.push(assignment)
                    }
                })
                setPriorityAssignments(priorityAssignmentsCache)
                setnormalAssignments(assignmentsCache)
            } else if (isOperator || admin || isSapExecutive) {
                setnormalAssignments(assignments)
            }
        }
    }, [assignments])

    useEffect(() => {
        if (isAuthenticated)
        if (admin || isOperator || isSapExecutive || isShiftManager || isChiefMachinery) {
            if(isOnline)
            getReports()
        }
    }, [admin, isOperator, isSapExecutive, isShiftManager, isChiefMachinery, isOnline, isAuthenticated])

    const getAllPautas = async () => {
        const response = await patternsRoutes.getPatternDetails()
        setPautas(response.data)
    }

    const saveReportsToIndexedDb = async () => {
        const {database} = await reportsDatabase.initDbReports()
        assignments.forEach(async (report, i) => {
            await reportsDatabase.actualizar(report, database)
        })
    }

    const getReportsFromIndexedDb = async () => {
        const {database} = await reportsDatabase.initDbReports()
        const reportsResponse = await reportsDatabase.consultar(database)
        setAssignments(reportsResponse)
    }

    const getReports = async () => {
        setLoading(true)
        if (isOnline) {
            console.log(isOperator, userData)
            if (admin) {
                const response = await reportsRoutes.getAllReports()
                console.log(response)
                setReports(response.data.reverse())
            } else {
                if (isOperator) {
                    const response = await reportsRoutes.findMyAssignations(userData._id, userData.obras[0].idobra)
                    console.log(response.data)
                    setReports(response.data.reverse())
                } else if (isSapExecutive || isShiftManager || isChiefMachinery) {
                    const response = await reportsRoutes.getAllReportsbySite(userData.obras[0].idobra)
                    setReports(response.data.reverse())
                }
            }
        } else {
            getReportsFromIndexedDb()
            setLoading(false)
        }
    }

    const provider = {
        reports,
        setReports,
        assignments,
        listSelected,
        setListSelected,
        pautas,
        priorityAssignments,
        normalAssignments
    }

    return (
        <>
            <ReportsContext.Provider value={provider} {...props} />
            <LoadingLogoModal open={loading} />
        </>
    )
}

export const useReportsContext = () => useContext(ReportsContext)