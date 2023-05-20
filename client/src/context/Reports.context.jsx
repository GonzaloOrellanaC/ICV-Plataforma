import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './Auth.context'
import { executionReportsRoutes, patternsRoutes, reportsRoutes } from '../routes'
import { executionReportsDatabase, pautasDatabase, reportsDatabase } from '../indexedDB'
import { useConnectionContext } from './Connection.context'
import { SocketConnection } from '../connections'
import { LoadingLogoModal } from '../modals'

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
    const [message, setMessage] = useState('')
    const [statusReports, setStatusReports] = useState(false)
    const [revision, setRevision] = useState(true)

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
        if (reports.length > 0) {
            /* setMessage('Descargando recursos') */
            setAssignments(reports)
            if(revision) {
                getAllPautas()
                saveReportsToIndexedDb()
            }
            setRevision(false)
        } else {
            setMessage('Descargando recursos')
            getReportsFromDatabase()
            setAssignments([])
        }
    }, [reports])

    useEffect(() => {
        if (pautas.length > 0) {
            setMessage('Guardando pautas')
            savePautas()
            if (isOperator && isOnline) {
                /* if (revision) { */
                    saveExecutionReportToDatabase()
                /* } */
            }
        }
    }, [pautas])

    const saveReport = async (reportData) => {
        /* setLoading(true) */
        setMessage('Guardando reportes')
        const reportsCache = [...reports]
        const response = await reportsRoutes.editReportById(reportData)
        console.log(response)
        const reportUpdated = response.data
        const reportIndex = reportsCache.find((report, index) => {
            if (report._id === reportUpdated._id) return index
        })
        reportsCache[reportIndex] = reportUpdated
        setReports(reportsCache)
        setMessage('')
        console.log('reporte asignado')
        alert('reporte asignado')
        setLoading(false)
    }

    const saveReportToData = async (reportData) => {
        /* setLoading(true) */
        setMessage('Guardando reportes')
        const reportsCache = [...reports]
        const response = await reportsRoutes.editReportById(reportData)
        console.log(response)
        const reportUpdated = response.data
        const reportIndex = reportsCache.find((report, index) => {
            if (report._id === reportUpdated._id) return index
        })
        reportsCache[reportIndex] = reportUpdated
        setReports(reportsCache)
        setMessage('')
    }

    const savePautas = async () => {
        const {database} = await pautasDatabase.initDbPMs()
        pautas.forEach(async (pauta, i) => {
            await pautasDatabase.actualizar(pauta, database)
            if (i === (pautas.length - 1)) {
                setMessage('')
            }
        })
    }

    const getReportsFromDatabase = async () => {
        setMessage('Descargando recursos')
        const {database} = await reportsDatabase.initDbReports()
        const response = await reportsDatabase.consultar(database)
        if (response.length > 0) {
            setReports(response)
        } else {
            setMessage('')
        }
    }

    const saveExecutionReportToDatabase = async () => {
        setMessage('Guardando datos en navegador')
        console.log('init!!!!')
        const executionReportsCache = []
        const {database} = await executionReportsDatabase.initDb()
        /* const reportsCache = reports */
        reports.forEach(async (report, i) => {
            const response = await executionReportsRoutes.getExecutionReportById(report)
            if (response.data._id) {
                executionReportsCache.push(response.data)
                const dataExist = await executionReportsDatabase.obtener(response.data._id, database)
                if(dataExist) {
                    if (response.data.offLineGuard > dataExist.offLineGuard) {
                        await executionReportsDatabase.actualizar(response.data, database)
                    } else {
                        console.log('Existe database')
                        setMessage('Revisando base de datos')
                    }
                } else {
                    console.log('No existe database')
                    setMessage('Guardando datos en navegador')
                    await executionReportsDatabase.actualizar(response.data, database)
                }
                /* if (!executionReportsDatabase.obtener(response.data._id, database)) */
            } else {
                setMessage('Guardando pauta de OT '+report.idIndex)
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
            if (i === (reports.length - 1)) {
                setMessage('')
            }
        })
    }

    useEffect(() => {
        if (assignments.length > 0) {
            if (isShiftManager) {
                const priorityAssignmentsCache = []
                const assignmentsCache = []
                assignments.forEach((assignment, i) => {
                    if(assignment.guide === 'Pauta de Inspección') {
                        assignment._guide = 'PI' 
                    }else{
                        assignment._guide = assignment.guide
                    }
        
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
                    if(assignment.guide === 'Pauta de Inspección') {
                        assignment._guide = 'PI' 
                    }else{
                        assignment._guide = assignment.guide
                    }
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
                assignments.forEach((assignment, i) => {
                    if(assignment.guide === 'Pauta de Inspección') {
                        assignment._guide = 'PI' 
                    }else{
                        assignment._guide = assignment.guide
                    }
                })
                setnormalAssignments(assignments)
            }
        }
    }, [assignments])

    useEffect(() => {
        /* console.log(isAuthenticated, site) */
        if (isAuthenticated && site) {
            /* console.log(admin, isOperator, isSapExecutive, isShiftManager, isChiefMachinery) */
            if (admin || isOperator || isSapExecutive || isShiftManager || isChiefMachinery) {
                if(isOnline) {
                    console.log(isOnline)
                    setMessage('Descargando reportes')
                    getReports()
                }
            }
        }
    }, [admin, isOperator, isSapExecutive, isShiftManager, isChiefMachinery, isOnline, isAuthenticated, site])

    const getAllPautas = async () => {
        setMessage('Descargando pautas')
        const response = await patternsRoutes.getPatternDetails()
        setPautas(response.data)
    }

    const saveReportsToIndexedDb = async () => {
        const {database} = await reportsDatabase.initDbReports()
        assignments.forEach(async (report, i) => {
            await reportsDatabase.actualizar(report, database)
        })
        setLoading(false)
    }

    const getReportsFromIndexedDb = async () => {
        const {database} = await reportsDatabase.initDbReports()
        const reportsResponse = await reportsDatabase.consultar(database)
        setAssignments(reportsResponse)
    }

    const getReports = async () => {
        setMessage('Sincronizando reportes')
        setStatusReports(true)
        if (isOnline) {
            console.log(isOperator, userData)
            if (admin) {
                const response = await reportsRoutes.getAllReports()
                console.log(response)
                setReports(response.data.reverse())
                setStatusReports(false)
                setMessage('')
            } else {
                console.log(isOperator, isSapExecutive , isShiftManager , isChiefMachinery)
                if (isOperator && (!isSapExecutive && !isShiftManager && !isChiefMachinery)) {
                    console.log(userData._id, site.idobra)
                    const response = await reportsRoutes.findMyAssignations(userData._id, site.idobra)
                    console.log(response.data)
                    setReports(response.data.reverse())
                    setMessage('')
                    setStatusReports(false)
                } else if (isOperator && (isSapExecutive || isShiftManager || isChiefMachinery)) {
                    const response = await reportsRoutes.getAllReportsbySite(site.idobra)
                    setReports(response.data.reverse())
                    setStatusReports(false)
                    setMessage('')
                } else if (isSapExecutive || isShiftManager || isChiefMachinery) {
                    const response = await reportsRoutes.getAllReportsbySite(site.idobra)
                    setReports(response.data.reverse())
                    setStatusReports(false)
                    setMessage('')
                }
            }
        } else {
            getReportsFromIndexedDb()
            setStatusReports(false)
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
        loading,
        pautas,
        priorityAssignments,
        normalAssignments,
        saveReport,
        saveReportToData,
        getReports,
        message,
        setMessage,
        statusReports,
        setStatusReports
    }

    return (
        <>
            <ReportsContext.Provider value={provider} {...props} />
            {/* <LoadingLogoModal open={statusReports} /> */}
        </>
    )
}

export const useReportsContext = () => useContext(ReportsContext)