import { createContext, useContext, useEffect, useState } from "react";
import { executionReportsRoutes } from "../routes";

export const ExecutionReportContext = createContext()

export const ExecutionReportProvider = (props) => {

    const [report, setReport] = useState()
    const [executionReport, setExecutionReport] = useState()
    const [reportId, setReportId] = useState()
    const [otIndex, setOtIndex] = useState(0)
    const [sapId, setSapId] = useState()
    const [serieEquipo, setSerieEquipo] = useState()
    const [modoTest, setModoTest] = useState(true)
    const [avanceHoja, setAvanceHoja] = useState(0)
    const [avanceTotal, setAvanceTotal] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (report) {
            setReportId(report._id)
            setOtIndex(report.idIndex)
            setSapId(report.sapId)
            setSerieEquipo(report.machine)
            setModoTest(report.testMode)
            getExecutionReport()
        }
    },[report])

    useEffect(() => {
        if (executionReport) {
            console.log(executionReport)
            setLoading(false)
        }
    }, [executionReport])

    const getExecutionReport = async () => {
        if (navigator.onLine) {
            const response = await executionReportsRoutes.getExecutionReportById(report)
            console.log(response)
            setExecutionReport(response.data[0])
        } else {
            setLoading(false)
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
        setLoading
    }

    return (
        <ExecutionReportContext.Provider value={provider} {...props} />
    )
}

export const useExecutionReportContext = () => useContext(ExecutionReportContext)