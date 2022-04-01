import { executionReportsDatabase } from "../indexedDB"

export default (executionReport, report) => {
    return new Promise(async resolve => {
        executionReport.updatedAt = new Date(Date.now()).toISOString()
        report.updatedAt = new Date(Date.now()).toISOString()
        const exDb = await executionReportsDatabase.initDb()
        const {database} = exDb
        const response = await executionReportsDatabase.actualizar(executionReport, database)
        if(response) {
            resolve(true)
        }else{
            resolve(false)
        }
    })
}