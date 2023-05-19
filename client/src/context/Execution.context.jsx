import { createContext, useContext, useEffect, useState } from "react";
import { useReportsContext } from "./Reports.context";
import { executionReportsDatabase } from "../indexedDB";
import { useAuth, useConnectionContext } from ".";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { executionReportsRoutes } from "../routes";
import { LoadingLogoModal } from "../modals";

export const ExecutionReportContext = createContext()

export const ExecutionReportProvider = (props) => {
    const {isOperator} = useAuth()
    const {isOnline} = useConnectionContext()
    const {reports, executionReportInternal} = useReportsContext()
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
    const location = useLocation()

    useEffect(() => {
        if (!location.pathname.includes('assignment/')) {
            setExecutionReport(undefined)
            setReport(undefined)
        }
    }, [location])

    useEffect(() => {
        if (executionReport) {
            saveExecutionReportToDb()
        }
    }, [executionReport])

    useEffect(() => {
        if (executionReportInternal) {
            setExecutionReport(executionReportInternal)
        }
    }, [executionReportInternal])

    const saveExecutionReportToDb = async () => {
        const {database} = await executionReportsDatabase.initDb()
        await executionReportsDatabase.actualizar(executionReport, database)
    }

    useEffect(() => {
        if (report) {
            setReportId(report._id)
            setOtIndex(report.idIndex)
            setSapId(report.sapId)
            setSerieEquipo(report.machine)
            setModoTest(report.testMode)
            getExecutionReport()
        }
        if (!report && otIndex && (reports.length > 0)) {
            getReportFromOtIndex()
        }
    },[report, otIndex, reports])

    const getReportFromOtIndex = () => {
        const reportFiltered = reports.filter(report => {if(report.idIndex === Number(otIndex)) {return report}})
        setReport(reportFiltered[0])
    }

    const getExecutionReport = async () => {
        setExecutionReport(undefined)
        if (!isOperator && isOnline) {
            /* setLoading(true) */
            const response = await executionReportsRoutes.getExecutionReportById(report)
            setExecutionReport(response.data)
            setLoading(false)
        } else {
            const {database} = await executionReportsDatabase.initDb()
            const response = await executionReportsDatabase.consultar(database)
            const excetutionReportCache = response.filter(doc => {if(doc.reportId === report._id) return doc})[0]
            if (excetutionReportCache) {
                setExecutionReport(excetutionReportCache)
            }
        }
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
        setLoadingMessage
    }

    return (
        <>
        <ExecutionReportContext.Provider value={provider} {...props} />
        {/* <LoadingLogoModal open={loading} /> */}
        </>
    )
}

export const useExecutionReportContext = () => useContext(ExecutionReportContext)