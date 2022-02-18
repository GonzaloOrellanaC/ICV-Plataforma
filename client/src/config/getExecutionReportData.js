import { executionReportsRoutes, reportsRoutes } from "../routes"


export default (reportData) => {
    return new Promise(resolve => {
        executionReportsRoutes.getExecutionReportById(reportData)
        .then(data => {
            resolve(data.data)
        })
    })
}