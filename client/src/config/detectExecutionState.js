import { executionReportsDatabase } from '../indexedDB'
import { reportsRoutes } from '../routes'

export default () => {
    return new Promise(async resolve => {
        const db = await executionReportsDatabase.initDb()
        const {database} = db
        let response = new Array()
        response = await executionReportsDatabase.consultar(database)
        response.forEach(async (executionReportData, index) =>{
            const res = await reportsRoutes.getReportById(executionReportData.reportId)
            console.log(index, res.data.level)
            if (index === 21) {
                console.log(res.data.level)
            }
            if (res.data) {
                if (res.data.level !== undefined) {
                    if (res.data.level === 4) {
                        const state = await executionReportsDatabase.eliminar(executionReportData._id, database)
                        console.log(state)
                    }
                    if (index === (response.length - 1)) {
                        resolve(true)
                    }
                }
            }
        })
    })
}

