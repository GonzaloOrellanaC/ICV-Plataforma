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
    const site = JSON.parse(localStorage.getItem('sitio'))
    return new Promise( resolve => {
        /* reportsRoutes.findMyAssignations(userId, site.idobra).then(data => {
            resolve(data.data)
        }) */
    })
}

const getAllAssignment = () => {
    const site = JSON.parse(localStorage.getItem('sitio'))
    const roles = localStorage.getItem('roles') ? JSON.parse(localStorage.getItem('roles')) : null
    const role = (localStorage.getItem('role') === 'undefined') ? null : localStorage.getItem('role')
    return new Promise( resolve => {
        if (roles.length > 0) {
            let state = false
            roles.forEach((role, i) => {
                if (role === 'superAdmin' || role === 'admin') {
                    state = true
                }
                if (i === (roles.length - 1)) {
                    if (state) {
                        reportsRoutes.getAllReports().then(data => {
                            resolve(data.data)
                        })
                    } else {
                        reportsRoutes.getAllReportsbySite(site.idobra).then(data => {
                            resolve(data.data)
                        })
                    }
                }
            })
        } else if (role) {
            if (role === 'superAdmin' || role === 'admin') {
                reportsRoutes.getAllReports().then(data => {
                    resolve(data.data)
                })
            } else {
                reportsRoutes.getAllReportsbySite(site.idobra).then(data => {
                    resolve(data.data)
                })
            }
        }
    })
}