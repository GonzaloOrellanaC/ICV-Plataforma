import { executionReportsDatabase } from "../indexedDB"

export default (reportDataId = new String()) => {
    console.log(reportDataId)
    return new Promise(async resolve => {
        const db = await executionReportsDatabase.initDb()
        const {database} = db
        let response = new Array()
        response = await executionReportsDatabase.consultar(database)
        console.log(response)
        const executionReport = response.filter((element) => {if(element.reportId === reportDataId) {return element}})
        if(executionReport.length > 0) {
            resolve({
                state: true,
                data: executionReport[0]
            })
        }else{
            resolve({
                state: false,
                data: {
                    message: 'Sin datos'
                }
            })
        }
    })
}