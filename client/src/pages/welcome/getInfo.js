import { executionReportsDatabase, pautasDatabase, reportsDatabase, sitesDatabase } from "../../indexedDB";
import { apiIvcRoutes, executionReportsRoutes, reportsRoutes } from "../../routes";
import getMyReports from './getMyReports'
import getAllAssignment from './getAllAssignment'

const getAssignments = (setProgress) => {
    return new Promise(async resolve => {
        let reps = new Array();
        if((localStorage.getItem('role') === 'maintenceOperator'||(localStorage.getItem('role') === 'inspectionWorker'))){
            reps = await getMyReports(localStorage.getItem('_id'));
        }else{
            reps = await getAllAssignment()
        }
        
        console.log(reps);
        let progressNumber = 0;
        let everyProgress = 100 / reps.length;
        let db = await reportsDatabase.initDbReports();
        if(reps.length == 0) {
            resolve(true)
        }
        if(db) {
            reps.forEach(async (report, i) => {
                progressNumber = progressNumber + everyProgress;
                setProgress(progressNumber)
                console.log(report)
                report.idDatabase = i;
                reportsDatabase.actualizar(report, db.database);
                getReportExecutionFromId(report._id);
                console.log(i, reps.length)
                if(i == (reps.length - 1)) {
                    setProgress(100)
                    console.log(true)
                    setTimeout(() => {
                        resolve(true)
                    }, 100);
                }
            })
        }
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
            await executionReportsDatabase.actualizar(res.data[0], db.database);
        }
    })
}

const descargarPautas = (setProgress) => {
    setProgress(0)
    return new Promise(async resolve => {
        const pautas = await getPautas();
        console.log('Pautas: ', pautas)
        if(pautas) {
            pautas.forEach(async (pauta, number ) => {
                console.log(pauta)
                let progressNumber = 0;
                let everyProgress1 = (100 / pautas.length) / 3;        
                const response = await getHeader(pauta);
                pauta.header = response;
                console.log(pauta.header)
                pauta.id = number;
                if(pauta.typepm === 'Pauta de Inspección') {
                    pauta.action = 'Inspección'
                }else{
                    pauta.action = 'Mantención'
                }
                if(number == (pautas.length - 1)) {
                    progressNumber = progressNumber + everyProgress1;
                    setProgress(progressNumber)
                    pautas.forEach(async (pa, n) => {
                        progressNumber = progressNumber + everyProgress1;
                        setProgress(progressNumber)
                        const res = await getStructs(pa)
                        pa.struct = res;
                        //console.log(pa);
                        if(n == (pautas.length - 1)) {
                            const db = await pautasDatabase.initDbPMs();
                            if(db) {
                                pautas.forEach(async (p, i) => {
                                    progressNumber = progressNumber + everyProgress1;
                                    setProgress(progressNumber)
                                    await pautasDatabase.actualizar(p, db.database);
                                    if(i == (pautas.length - 1)) {
                                        setProgress(100)
                                        resolve({
                                            progress: 100,
                                            state: true
                                        })
                                    }
                                })
                            }
                        }
                    })

                }
            })
            
        }
    })
}

const getPautasInstepctList = (setProgress, machines) => {
    setProgress(0);
    let n = 0;
    let total = machines.length;
    let punto = (100/total);
    let pautas = [];
    return new Promise(resolve => {
        machines.forEach(async (machine, index) => {
            n = n + punto;
            setProgress(n);
            let res = await reportsRoutes.getReportByIdpm(machine.idpminspeccion);
            res.data[0].typepm = encodeURIComponent(res.data[0].typepm);
            let header = await apiIvcRoutes.getHeaderPauta(res.data[0]);
            let struct = await apiIvcRoutes.getStructsPauta(res.data[0]);
            let newPauta = res.data[0];
            newPauta.header = header;
            newPauta.struct = struct;
            newPauta.action = 'Inspección';
            pautas.push(newPauta);
            if(index == (machines.length -1)) {
                resolve(pautas)
                setProgress(100);
            }
        })
    })
}

const getPautasMaintenanceList = (setProgress, machines) => {
    setProgress(0);
    let n = 0;
    let total = machines.length;
    let punto = (100/total);
    let pautas = []
    return new Promise(resolve => {
        machines.forEach(async (machine, index) => {
            n = n + punto;
            setProgress(n);
            let res = await reportsRoutes.getReportByIdpm(machine.idpmmantencion);
            res.data[0].typepm = encodeURIComponent(res.data[0].typepm);
            let header = await apiIvcRoutes.getHeaderPauta(res.data[0]);
            let struct = await apiIvcRoutes.getStructsPauta(res.data[0]);
            let newPauta = res.data[0];
            newPauta.header = header;
            newPauta.struct = struct;
            newPauta.action = 'Mantención';
            pautas.push(newPauta);
            if(index == (machines.length -1)) {
                resolve(pautas)
                setProgress(100);
            }
        })
    })
}

const getPautas = () => {
    return new Promise(resolve => {
        apiIvcRoutes.getPautas()
        .then(data => {
            resolve(data.data)
        })
        .catch(err => {
            //console.log('Error', err)
        })
    })
}

const getHeader = (pauta) => {
    return new Promise(resolve => {
        apiIvcRoutes.getHeaderPauta(pauta)
        .then(data => {
            resolve(data.data)
        })
        .catch(err => {
            //console.log('Error', err)
        })
    })
}

const getStructs = (pauta) => {
    return new Promise(resolve => {
        apiIvcRoutes.getStructsPauta(pauta)
        .then(data => {
            resolve(data.data)
        })
        .catch(err => {
            //console.log('Error', err)
        })
    })
}

const getSites = (setProgress, setDisableButtons, setNotificaciones1) => {
    setProgress(0)
    return new Promise(async resolve => {
        let sites = [];
        sites = await getSitesList(setDisableButtons, setNotificaciones1);
        let db = await sitesDatabase.initDbObras();
        if(db) {
            let progressNumber = 0;
            let everyProgress = 100 / sites.length;        
            sites.forEach(async (fileName, index) => {
                progressNumber = progressNumber + everyProgress;
                setProgress(progressNumber)
                fileName.id = index;
                await sitesDatabase.actualizar(fileName, db.database, db.database.version);
                if(index === (sites.length - 1)) {
                    const response = await sitesDatabase.consultar(db.database);
                    if(response) {
                        resolve(true)
                    }
                } 
            });
        }
    })
}

const getSitesList = (setDisableButtons, setNotificaciones1) => {
    return new Promise(resolve => {
        apiIvcRoutes.getSites()
        .then(data => {
            if((localStorage.getItem('role') === 'admin') || (localStorage.getItem('role') === 'sapExecutive')) {
                localStorage.setItem('sitio', JSON.stringify(data.data[0]));
                setTimeout(() => {
                    setDisableButtons(false)
                    setNotificaciones1('Sin notificaciones')
                }, 500);
            }
            resolve(data.data)
        })
        .catch(err => {
            //console.log('Error', err)
        })
    })
}

const setIfNeedReadDataAgain = async (setDisableButtons, setNotificaciones1) => {
    return new Promise(async resolve => {
        if(navigator.onLine) {
            let sites = [];
            sites = await getSitesList(setDisableButtons, setNotificaciones1);
            let db = await sitesDatabase.initDbObras();
            if(db) {
                const response = await sitesDatabase.consultar(db.database);
                if(response) {
                    if(sites.length == response.length) {
                        resolve({
                            state: true,
                            data: 'reload'
                        })
                    }else{
                        resolve({
                            state: true,
                            data: 'full'
                        })
                    }
                }
            }
        }else{
            resolve(false)
        }
    })
}

export default {
    getAssignments,
    descargarPautas,
    getSites,
    getSitesList,
    setIfNeedReadDataAgain,
    getPautasInstepctList,
    getPautasMaintenanceList
}