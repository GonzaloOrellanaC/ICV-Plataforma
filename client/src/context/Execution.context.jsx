import { createContext, useContext, useEffect, useState } from "react";
import { executionReportsDatabase, pautasDatabase } from "../indexedDB";
import { ReportsContext, useAuth, useConnectionContext } from ".";
import { executionReportsRoutes, reportsRoutes } from "../routes";
import { useLocation } from "react-router-dom";

export const ExecutionReportContext = createContext()

export const ExecutionReportProvider = (props) => {
    const {isOperator, userData} = useAuth()
    const {isOnline} = useConnectionContext()
    const {reports, setMessage} = useContext(ReportsContext)
    const [report, setReport] = useState()
    const [executionReport, setExecutionReport] = useState()
    const [reportId, setReportId] = useState()
    const [otIndex, setOtIndex] = useState()
    const [sapId, setSapId] = useState()
    const [serieEquipo, setSerieEquipo] = useState()
    const [modoTest, setModoTest] = useState(true)
    const [avanceHoja, setAvanceHoja] = useState(0)
    const [avanceTotal, setAvanceTotal] = useState(0)
    const [loading, setLoading] = useState(false)
    const [loadingMessage, setLoadingMessage] = useState('')
    const [reporteIniciado, setReporteIniciado] = useState(true)

    const location = useLocation()

    useEffect(() => {
        if (!location.pathname.includes('assignment/')) {
            console.log('Borrado')
            setReporteIniciado(true)
            setExecutionReport(undefined)
            setReport(undefined)
            setReportId(undefined)
            setOtIndex(undefined)
            setSapId(undefined)
            setSerieEquipo(undefined)
            setModoTest(true)
        }
    }, [location])

    useEffect(() => {
        if (executionReport) {
            saveExecutionReportToDb()
        }
    }, [executionReport])

    const saveExecutionReportToDb = async () => {
        const {database} = await executionReportsDatabase.initDb()
        await executionReportsDatabase.actualizar(executionReport, database)
    }

    useEffect(() => {
        if (report) {
            console.log(report)
            setReportId(report._id)
            setOtIndex(report.idIndex)
            setSapId(report.sapId)
            setSerieEquipo(report.machine)
            setModoTest(report.testMode)
            setMessage('Buscando Pauta')
            getExecutionReport()
        }
        if (otIndex) {
            getReportFromOtIndex()
        }
    },[report, otIndex])

    useEffect(() => {
        console.log(otIndex)
    },[otIndex])

    const getReportFromOtIndex = () => {
        console.log('Obteniendo reporte')
        const reportFiltered = reports.filter(report => {if(report.idIndex === Number(otIndex)) {return report}})
        console.log(reportFiltered)
        setReport(reportFiltered[0])
    }

    const getExecutionReport = async () => {
        console.log('Buscando Pauta')
        setExecutionReport(undefined)
        if (!isOperator && isOnline) {
            const response = await executionReportsRoutes.getExecutionReportById(report)
            console.log(response.data)
            if (!response.data._id) {
                setMessage('OT no iniciado')
                setReporteIniciado(false)
            } else {
                setExecutionReport(response.data)
            }
            setLoading(false)
            setTimeout(() => {
                setMessage('')
            }, (500));
        } else if (isOperator && isOnline) {
            const {database} = await executionReportsDatabase.initDb()
            const response = await executionReportsDatabase.consultar(database)
            const excetutionReportCache = response.filter(doc => {if(doc.reportId === report._id) return doc})
            if (excetutionReportCache.length > 0) {
                const responseData = await executionReportsRoutes.getExecutionReportById(report)
                if (excetutionReportCache[0].offLineGuard > responseData.data.offLineGuard) {
                    setExecutionReport(excetutionReportCache[0])
                } else {
                    setExecutionReport(responseData.data)
                }
            } else {
                const responseData = await executionReportsRoutes.getExecutionReportById(report)
                if (responseData.data && responseData.data._id) {
                    setExecutionReport(responseData.data)
                } else {
                    if (isOperator) {
                        const db = await pautasDatabase.initDbPMs()
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
                        setExecutionReport(responseNewExecution.data)
                        console.log('Se guarda reporte ', responseNewExecution)
                        if (!report.dateInit) {
                            report.dateInit = new Date()
                            await reportsRoutes.editReportById(report)
                        }
                    }
                    setMessage('No se logra descargar ejecución de datos.')
                    setTimeout(() => {
                        setMessage('')
                    }, 1000);
                }
                setTimeout(() => {
                    setMessage('')
                }, 1000);
            }
        } else if (isOperator && !isOnline) {
            const {database} = await executionReportsDatabase.initDb()
            const response = await executionReportsDatabase.consultar(database)
            const excetutionReportCache = response.filter(doc => {if(doc.reportId === report._id) return doc})
            if (excetutionReportCache.length > 0) {
                setExecutionReport(excetutionReportCache[0])
            }
            setTimeout(() => {
                setMessage('')
            }, 1000);
        }
        setMessage('')
    }

    const provider = {
        report,
        setReport,
        executionReport,
        setExecutionReport,
        reportId,
        sapId,
        serieEquipo,
        modoTest,
        avanceHoja,
        avanceTotal,
        otIndex,
        setAvanceHoja,
        setAvanceTotal,
        loading,
        setLoading,
        setOtIndex,
        setLoadingMessage,
        reporteIniciado
    }

    return (
        <>
        <ExecutionReportContext.Provider value={provider} {...props} />
        </>
    )
}

export const useExecutionReportContext = () => useContext(ExecutionReportContext)