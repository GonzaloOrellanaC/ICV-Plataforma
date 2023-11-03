import { executionReportsRoutes, reportsRoutes } from "../routes"


export default (reportData) => {
    return new Promise(resolve => {
        executionReportsRoutes.getExecutionReportById(reportData._id)
        .then(data => {
            resolve(data.data)
        })
    })
}