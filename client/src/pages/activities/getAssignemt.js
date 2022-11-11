import { executionReportsDatabase, reportsDatabase } from "../../indexedDB";
import { executionReportsRoutes, reportsRoutes } from "../../routes";

export default () => {
    return new Promise(async resolve => {
        const isOperator = Boolean(localStorage.getItem('isOperator'))
        let reps = new Array()
        if(isOperator||(localStorage.getItem('role') === 'maintenceOperator'||(localStorage.getItem('role') === 'inspectionWorker'))){
            reps = await getMyReports(localStorage.getItem('_id'));
        }else{
            reps = await getAllAssignment()
        }
        resolve(reps)
        let db = await reportsDatabase.initDbReports();
        if(db) {
            reps.forEach(async (report, i) => {
                report.idDatabase = i;
                //reportsDatabase.actualizar(report, db.database);
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