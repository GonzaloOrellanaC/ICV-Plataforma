import { executionReportsDatabase, reportsDatabase } from "../../indexedDB";
import { executionReportsRoutes, reportsRoutes } from "../../routes";

export default () => {
    return new Promise(async resolve => {
        let reps = new Array()
        if((localStorage.getItem('role') === 'maintenceOperator'||(localStorage.getItem('role') === 'inspectionWorker'))){
            reps = await getMyReports(localStorage.getItem('_id'));
        }else{
            reps = await getAllAssignment()
        }
        console.log(reps)
        resolve(reps)
        let db = await reportsDatabase.initDbReports();
        if(db) {
            //resolve(reps)
            reps.forEach(async (report, i) => {
                report.idDatabase = i;
                reportsDatabase.actualizar(report, db.database);
                /* let state = await getReportExecutionFromId(report._id);
                if(i == (reps.length - 1)) {
                    setTimeout(() => {
                        resolve(state)
                    }, 100);
                }  */
            })
        }
    })
}

const getMyReports = (userId) => {
    return new Promise( resolve => {
        reportsRoutes.findMyAssignations(userId).then(data => {
            resolve(data.data)
        })
    })
}

const getAllAssignment = () => {
    return new Promise( resolve => {
        reportsRoutes.getAllReports().then(data => {
            resolve(data.data)
        })
    })
}

const getReportExecutionFromId = (reportId) => {
    return new Promise(async resolve => {
        let reportData = {
            reportId: reportId,
            createdBy: localStorage.getItem('_id')
        };
        let res = await executionReportsRoutes.getExecutionReportById(reportData);
        let db = await executionReportsDatabase.initDb();
        if(db) {
            let state = await executionReportsDatabase.actualizar(res.data[0], db.database);
            resolve(state)
        }
    })
}