import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './Auth.context'
import { executionReportsRoutes, patternsRoutes, reportsRoutes } from '../routes'
import { executionReportsDatabase, pautasDatabase, reportsDatabase } from '../indexedDB'
import { useConnectionContext } from './Connection.context'
import { SocketConnection } from '../connections'
import { useNotificationsContext } from './Notifications.context'
import { useNavigate } from 'react-router-dom'
import addNotification from 'react-push-notification'
import logoNotification from '../assets/logo_icv_notification_push.png'

export const ReportsContext = createContext()

export const ReportsProvider = (props) => {
    const {isOnline} = useConnectionContext()
    const {admin, isSapExecutive, isShiftManager, isChiefMachinery, roles, site, isOperator, isAuthenticated, userData} = useAuth()
    const [reports, setReports] = useState([])
    const [assignments, setAssignments] = useState([])
    const [listSelected, setListSelected] = useState([])
    const [listSelectedCache, setListSelectedCache] = useState([])
    const [pautas, setPautas] = useState([])
    const [pautasCache, setPautasCache] = useState([])
    const [loading, setLoading] = useState(false)
    const [priorityAssignments, setPriorityAssignments] = useState([])
    const [normalAssignments, setnormalAssignments] = useState([])
    const [message, setMessage] = useState('Descargando reportes')
    const [statusReports, setStatusReports] = useState(false)
    const [revision, setRevision] = useState(true)
    const [newReport, setNewReport] = useState()
    const navigate = useNavigate()

    useEffect(() => {
        if (priorityAssignments || normalAssignments)
        setMessage('')
    }, [priorityAssignments, normalAssignments])

    useEffect(() => {
        if (newReport) {
            const reportsCache = [...reports]
            let reportsFiltered = null
            reportsCache.forEach((report, i) => {
                if (report._id === newReport._id) {
                    reportsFiltered = i
                }
                if (i === (reportsCache.length - 1)) {
                    if (reportsFiltered === null) {
                        console.log('Agregando Reporte')
                        reportsCache.push(newReport)
                    } else {
                        console.log('Cambiando Reporte')
                        reportsCache[reportsFiltered] = newReport
                    }
                    console.log(reportsCache)
                    setReports(reportsCache)
                }
            })
        }
    }, [newReport])

    useEffect(() => {
        if (userData && isAuthenticated) {
            stateReports()
        }
    },[userData, isOnline, isAuthenticated])

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
        SocketConnection.listenNotifocations(userData, getData)
    }

    const getData = (data) => {
        console.log(data)
        addNotification({
            icon: logoNotification,
            title: data.title,
            subtitle: data.subtitle,
            message: data.message,
            theme: 'red',
            native: true
        })
        if (data.report) {
            /* setNewReport(data.report) */
            getReports()
        }
    }

    useEffect(() => {
        if (reports.length > 0) {
            /* reports.forEach((report) => {
                console.log(report.description)
            }) */
            console.log('Guardando reporte')
            console.log(revision)
            if(revision) {
                getAllPautas()
                setRevision(false)
            } else {
                setPautas(pautasCache)
            }
            setAssignments(reports)
            console.log(reports)
        } else {
            if (isAuthenticated) {
                console.log('Guardando reporte') 
                setMessage('Descargando recursos')
                getReportsFromDatabase()
                setAssignments([])
            }
        }
    }, [reports, isAuthenticated])

    useEffect(() => {
        if (!isOnline) {
            setRevision(true)
        }
    }, [isOnline])

    useEffect(() => {
        if (pautas.length > 0) {
            setMessage('Guardando pautas')
            savePautas()
        }
    }, [pautas])

    const saveReport = async (reportData) => {
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
        console.log('reporte asignado')
        alert('reporte asignado')
        setLoading(false)
    }

    const createReport = async (reportData, setLoading) => {
        console.log(reportData)
        setLoading(true)
        const reportsCache = [...reports]
        const response = await reportsRoutes.createReport(reportData)
        const reportUpdated = response.data
        reportsCache.push(reportUpdated)
        setReports(reportsCache)
        alert(`Reporte ${reportUpdated.idIndex}, para máquina modelo ${reportUpdated.machine} creado satisfactoriamente.`)
        setLoading(false)
        navigate('/reports', {replace: true})
    }

    const saveReportAsignation = async (reportData) => {
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
        /* setMessage('') */
    }

    const savePautas = async () => {
        const {database} = await pautasDatabase.initDbPMs()
        pautas.forEach(async (pauta, i) => {
            await pautasDatabase.actualizar(pauta, database)
            if (i === (pautas.length - 1)) {
                setMessage('')
                /* saveExecutionReportToDatabase() */
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
        const {database} = await executionReportsDatabase.initDb()
        const db = await pautasDatabase.initDbPMs()
        reports.forEach(async (report, i) => {
            /* const dataExist = await executionReportsDatabase.obtener(response.data._id, database)
            if(dataExist) {
                if (response.data.offLineGuard > dataExist.offLineGuard) {
                    await executionReportsDatabase.actualizar(response.data, database)
                } else {
                    setMessage('Revisando base de datos')
                }
            } else {
                setMessage('Guardando datos en navegador')
                await executionReportsDatabase.actualizar(response.data, database)
            } */
            /* const response = await executionReportsRoutes.getExecutionReportById(report)
            if (response.data._id) {
                if (isOperator) {
                    const dataExist = await executionReportsDatabase.obtener(response.data._id, database)
                    if(dataExist) {
                        if (response.data.offLineGuard > dataExist.offLineGuard) {
                            await executionReportsDatabase.actualizar(response.data, database)
                        } else {
                            setMessage('Revisando base de datos')
                        }
                    } else {
                        setMessage('Guardando datos en navegador')
                        await executionReportsDatabase.actualizar(response.data, database)
                    }
                }
            } else { */
                if (isOperator) {
                    setMessage('Guardando pauta de OT '+report.idIndex)
                    const pautas = await pautasDatabase.consultar(db.database)
                    const pautaFiltered = pautas.filter((info) => { 
                        if((info.typepm === report.guide)&&(report.idPm===info.idpm)) {
                                return info
                            }})
                    const group = await pautaFiltered[0].struct.reduce((r, a) => {
                        r[a.strpmdesc] = [...r[a.strpmdesc] || [], a]
                        return r
                    }, {})
                    const executionReportData = {
                        reportId: report._id,
                        createdBy: userData._id,
                        group: group,
                        offLineGuard: null
                    }
                    const responseNewExecution = await executionReportsRoutes.saveExecutionReport(executionReportData)
                    console.log('Se guarda reporte ', responseNewExecution)
                    await executionReportsDatabase.actualizar(responseNewExecution.data, database)
                    console.log('Se guarda reporte ', responseNewExecution)
                    if (!report.dateInit) {
                        report.dateInit = new Date()
                        await reportsRoutes.editReportById(report)
                    }
                }
            /* } */
        })
        setMessage('')
    }

    useEffect(() => {
        setMessage('Guardando asignaciones')
        if(pautas.length > 0)
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
        } else {
            setPriorityAssignments([])
            setnormalAssignments([])
        }
        saveReportsToIndexedDb()
    }, [assignments, pautas])

    useEffect(() => {
        if (isAuthenticated && site) {
            setMessage('Descargando reportes')
            if ((admin || isOperator || isSapExecutive || isShiftManager || isChiefMachinery)&&userData) {
                getReports()
            }
        }
    }, [admin, isOperator, isSapExecutive, isShiftManager, isChiefMachinery, isOnline, isAuthenticated, site, userData])

    const getAllPautas = async () => {
        setMessage('Descargando pautas')
        const {database} = await pautasDatabase.initDbPMs()
        const response = await pautasDatabase.consultar(database)
        console.log(response)
        if (response.length > 0) {
            setPautas(response)
            setPautasCache(response)
        } else {
            const responseCache = await patternsRoutes.getPatternDetails()
            console.log('Pautas: ', responseCache.data)
            setPautas(responseCache.data)
            setPautasCache(responseCache.data)
        }
    }

    const saveReportsToIndexedDb = async () => {
        setMessage('Actualizando OTs')
        const {database} = await reportsDatabase.initDbReports()
        assignments.forEach(async (report, i) => {
            await reportsDatabase.actualizar(report, database)
        })
        const elementsToremoved = await reportsDatabase.consultar(database)
        elementsToremoved.forEach(async (el) => {
            const filtered = assignments.filter(report => {
                if (el.idIndex === report.idIndex) {
                    return report
                }
            })
            if (filtered.length === 0) {
                await reportsDatabase.eliminar(el.idIndex, database)
            }
        })
        setMessage('')
        setLoading(false)
    }

    const getReportsFromIndexedDb = async () => {
        const {database} = await reportsDatabase.initDbReports()
        const reportsResponse = await reportsDatabase.consultar(database)
        setReports(reportsResponse)
    }

    const getReports = async () => {
        setMessage('Sincronizando reportes')
        setStatusReports(true)
        if (isOnline) {
            console.log(isOperator, userData)
            if (admin) {
                const response = await reportsRoutes.getAllReports()
                console.log(response)
                setReports(response.data)
                setStatusReports(false)
                /* setMessage('') */
            } else {
                console.log(isOperator, isSapExecutive , isShiftManager , isChiefMachinery)
                if (isOperator && (!isSapExecutive && !isShiftManager && !isChiefMachinery)) {
                    console.log(userData._id, site.idobra)
                    const response = await reportsRoutes.findMyAssignations(userData._id, site.idobra)
                    console.log(response.data)
                    setReports(response.data)
                    /* setMessage('') */
                    setStatusReports(false)
                } else if (isOperator && (isSapExecutive || isShiftManager || isChiefMachinery)) {
                    const response = await reportsRoutes.getAllReportsbySite(site.idobra)
                    setReports(response.data)
                    setStatusReports(false)
                    /* setMessage('') */
                } else if (isSapExecutive || isShiftManager || isChiefMachinery) {
                    const response = await reportsRoutes.getAllReportsbySite(site.idobra)
                    console.log('Reportes: ', response.data)
                    setReports(response.data)
                    setStatusReports(false)
                    /* setMessage('') */
                }
            }
        } else {
            getReportsFromIndexedDb()
            setStatusReports(false)
        }
    }

    const getReportsOffline = () => {
        getReportsFromIndexedDb()
    }
 
    const provider = {
        reports,
        setReports,
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
        getReportsOffline,
        message,
        setMessage,
        statusReports,
        setStatusReports,
        createReport
    }

    return (
        <>
            <ReportsContext.Provider value={provider} {...props} />
        </>
    )
}

export const useReportsContext = () => useContext(ReportsContext)