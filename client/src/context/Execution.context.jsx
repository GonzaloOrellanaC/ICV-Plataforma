import { createContext, useContext, useEffect, useState } from "react";
import { useReportsContext } from "./Reports.context";
import { executionReportsDatabase } from "../indexedDB";
import { ReportsContext, useAuth, useConnectionContext } from ".";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { executionReportsRoutes } from "../routes";
import { LoadingLogoModal } from "../modals";

export const ExecutionReportContext = createContext()

export const ExecutionReportProvider = (props) => {
    const {isOperator, admin, isSapExecutive, isShiftManager, isChiefMachinery} = useAuth()
    const {isOnline} = useConnectionContext()
    const {reports, setMessage, pautas} = useContext(ReportsContext)
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
            setReporteIniciado(true)
            setExecutionReport(undefined)
            setReport(undefined)
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
        /* console.log(report) */
        if (report!==undefined) {
            setReportId(report._id)
            setOtIndex(report.idIndex)
            setSapId(report.sapId)
            setSerieEquipo(report.machine)
            setModoTest(report.testMode)
            setMessage('Buscando Pauta')
            getExecutionReport()
        }
        if (!report && otIndex /* && (reports.length > 0) && (pautas.length > 0) */) {
            getReportFromOtIndex()
        }
    },[report, otIndex/* , reports, pautas */])

    const getReportFromOtIndex = () => {
        const reportFiltered = reports.filter(report => {if(report.idIndex === Number(otIndex)) {return report}})
        setReport(reportFiltered[0])
    }

    const getExecutionReport = async () => {
        setExecutionReport(undefined)
        if (!isOperator && isOnline) {
            /* setLoading(true) */
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
                setExecutionReport(excetutionReportCache[0])
                /* setMessage('Ejecusión encontrada.') */
            } else {
                setTimeout(() => {
                    setMessage('')
                }, 1000);
            }
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
        {/* <LoadingLogoModal open={loading} /> */}
        </>
    )
}

export const useExecutionReportContext = () => useContext(ExecutionReportContext)