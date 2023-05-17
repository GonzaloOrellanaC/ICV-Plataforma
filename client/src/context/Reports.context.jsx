import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './Auth.context'
import { executionReportsRoutes, patternsRoutes, reportsRoutes } from '../routes'
import { executionReportsDatabase, pautasDatabase, reportsDatabase } from '../indexedDB'
import { useConnectionContext } from './Connection.context'
import { LoadingLogoModal } from '../modals'
import { io } from 'socket.io-client'
import { SocketConnection } from '../connections'

export const ReportsContext = createContext()

export const ReportsProvider = (props) => {
    const {isOnline} = useConnectionContext()
    const {admin, isSapExecutive, isShiftManager, isChiefMachinery, roles, site, isOperator, isAuthenticated, userData} = useAuth()
    const [reports, setReports] = useState([])
    const [assignments, setAssignments] = useState([])
    const [listSelected, setListSelected] = useState([])
    const [listSelectedCache, setListSelectedCache] = useState([])
    const [pautas, setPautas] = useState([])
    const [loading, setLoading] = useState(false)
    const [priorityAssignments, setPriorityAssignments] = useState([])
    const [normalAssignments, setnormalAssignments] = useState([])
    const [executeReportInternal, setExecuteReportInternal] = useState()

    useEffect(() => {
        if (isOnline && userData) {
            stateReports()
        }
    },[userData, isOnline])

    const notificationData = (data) => {
        console.log(data)
        getReports()
    }

    const reportsData = (data) => {
        console.log(data)
        getReports()
    }

    const stateReports = async () => {
        SocketConnection.listenReports(userData, reportsData)
        SocketConnection.listenNotifocations(userData, notificationData)
    }

    useEffect(() => {
        if (pautas.length > 0) {
            savePautas()
        }
    }, [pautas])

    const saveReport = async (reportData) => {
        const reportsCache = [...reports]
        const response = await reportsRoutes.editReportById(reportData)
        console.log(response)
        const reportUpdated = response.data
        const reportIndex = reportsCache.find((report, index) => {
            if (report._id === reportUpdated._id) return index
        })
        reportsCache[reportIndex] = reportUpdated
        setReports(reportsCache)
        console.log('reporte asignado')
        alert('reporte asignado')
    }

    const savePautas = async () => {
        const {database} = await pautasDatabase.initDbPMs()
        pautas.forEach(async pauta => {
            await pautasDatabase.actualizar(pauta, database)
        })
    }

    const getReportsFromDatabase = async () => {
        const {database} = await reportsDatabase.initDbReports()
        const response = await reportsDatabase.consultar(database)
        if (response.length > 0) {
            setReports(response)
        }
    }

    useEffect(() => {
        if (reports.length > 0) {
            setLoading(false)
            if (isOperator) {
                if (isOnline) {
                    saveExecutionReportToDatabase()
                } else {
                    alert('Requiere estar conectado a internet.')
                }
            }
            getAllPautas()
            setAssignments(reports)
            saveReportsToIndexedDb()
        } else {
            getReportsFromDatabase()
            setLoading(false)
            setAssignments([])
        }
    }, [reports])

    const saveExecutionReportToDatabase = async () => {
        console.log('init!!!!')
        const executionReportsCache = []
        const {database} = await executionReportsDatabase.initDb()
        reports.forEach(async (report, i) => {
            if(report.guide === 'Pauta de Inspección') {
                report._guide = 'PI' 
            }else{
                report._guide = report.guide
            }
            const response = await executionReportsRoutes.getExecutionReportById(report)
            if (response.data._id) {
                executionReportsCache.push(response.data)
                const dataExist = await executionReportsDatabase.obtener(response.data._id, database)
                if(dataExist) {
                    if (response.data.offLineGuard > dataExist.offLineGuard) {
                        await executionReportsDatabase.actualizar(response.data, database)
                    } else {
                        console.log('Existe database')
                    }
                } else {
                    console.log('No existe database')
                    await executionReportsDatabase.actualizar(response.data, database)
                }
                /* if (!executionReportsDatabase.obtener(response.data._id, database)) */
            } else {
                alert('Guardando pauta de OT '+report.idIndex)
                const db = await pautasDatabase.initDbPMs()
                const pautas = await pautasDatabase.consultar(db.database)
                const pautaFiltered = pautas.filter((info) => { 
                    if(
                        (info.typepm === report.guide)&&(report.idPm===info.idpm)
                        ) {
                            return info
                        }})
                const group = await pautaFiltered[0].struct.reduce((r, a) => {
                    r[a.strpmdesc] = [...r[a.strpmdesc] || [], a]
                    return r
                }, {})
                console.log(group)
                const executionReportData = {
                    reportId: report._id,
                    createdBy: userData._id,
                    group: group,
                    offLineGuard: null
                }
                const responseExecution = await executionReportsRoutes.saveExecutionReport(executionReportData)
                console.log(responseExecution)
                executionReportsCache.push(executionReportData)
                await executionReportsDatabase.actualizar(responseExecution.data, database)
                setExecuteReportInternal(executionReportData.data)
                if (!report.dateInit) {
                    report.dateInit = new Date()
                    const response = await reportsRoutes.editReportById(report)
                    console.log(response)
                }
            }
        })
        /* setExecuteReports(executionReportsCache) */
    }

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
            if(isOnline) {
                getReports()
            }
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
        executeReportInternal,
        assignments,
        listSelected,
        listSelectedCache,
        setListSelected,
        setListSelectedCache,
        pautas,
        priorityAssignments,
        normalAssignments,
        saveReport,
        getReports
    }

    return (
        <>
            <ReportsContext.Provider value={provider} {...props} />
            <LoadingLogoModal open={loading} />
        </>
    )
}

export const useReportsContext = () => useContext(ReportsContext)