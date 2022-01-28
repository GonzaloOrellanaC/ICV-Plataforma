import { executionReportsDatabase, reportsDatabase } from "../indexedDB";
import { executionReportsRoutes, reportsRoutes } from "../routes";

const actualizarReporte = () => {
    return new Promise(async resolve => {
        let db = await reportsDatabase.initDbReports();
        let response = new Array();
        response = await reportsDatabase.consultar(db.database);
        if(response) {
            response.map((report, i) => {
                reportsRoutes.editReport(report);
                if(i == (response.length - 1)) {
                    resolve(true)
                }
            })
        }
    })
}

export default () => {
    return new Promise(async resolve => {
        if(confirm('Se ha detectado reconexión a internet. ¿Desea sincronizar los datos?')) {
            let db = await executionReportsDatabase.initDb();
            let response = new Array();
            response = await executionReportsDatabase.consultar(db.database);
            console.log(response);
            response.forEach(async (report, index) => {
                await executionReportsRoutes.saveExecutionReport(report);
                if(index ==(response.length - 1)) {
                    let sync1 = await actualizarReporte()
                    if(sync1) {
                        resolve({
                            message: 'Servicio actualizado.'
                        });
                    }
                }
            })
        }else{
            resolve({
                message: 'No olvide sincronizar datos para evitar perdida del avance de sus reportes.'
            })
        }
    })
}