import reportsDatabase from "../indexedDB/reports.database"

export default (reportData) => {
    return new Promise(async resolve => {
        const db = await reportsDatabase.initDbReports()
        const {database} = db
        const response = await reportsDatabase.actualizar(reportData, database)
        if(response) {
            resolve(true)
        }else{
            resolve(false)
        }
    })

}