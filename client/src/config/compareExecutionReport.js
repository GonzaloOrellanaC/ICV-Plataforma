import { executionReportsDatabase } from "../indexedDB";


export default (executionReportData) => {
    return new Promise(async resolve => {
        let exDb = await executionReportsDatabase.initDb();
        let executionReportList = new Array();
        executionReportList = await executionReportsDatabase.consultar(exDb.database);
        let executionReport = executionReportList.filter(r => {if(r._id === executionReportData._id) {return r}});
        if(executionReport[0]) {
            let dateExOnDB = new Date(executionReport[0].updatedAt);
            let dateCloud = new Date(executionReportData.updatedAt);
            if(dateExOnDB.getTime() > dateCloud.getTime()) {
                resolve(false)
            }else{
                resolve(true)
            }
        }else{
            resolve(false)
        }
    })

}