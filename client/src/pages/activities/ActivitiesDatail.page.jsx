import React, { useState, useEffect, ReactDOM } from 'react';
import { Box, Card, Grid, Toolbar, IconButton, LinearProgress, Button } from '@material-ui/core'
import { ArrowBackIos } from '@material-ui/icons'
import { getExecutivesSapEmail, useStylesTheme } from '../../config'
import { useHistory, useParams } from 'react-router-dom'
import { pautasDatabase, executionReportsDatabase, reportsDatabase } from '../../indexedDB'
import { PautaDetail } from '../../containers'
import { reportsRoutes } from '../../routes'
import { ReportCommitModal } from '../../modals'

const ActivitiesDetailPage = () => {
    const classes = useStylesTheme();
    const history = useHistory();
    const {id} = useParams();
    const [ pauta, setPauta ] = useState();
    const [ executionReport, setExecutionReport ] = useState()
    const [ progress, resutProgress ] = useState(0)
    const [ reportAssignment, setReportAssignment ] = useState()
    const [ reportLevel, setReportLevel ] = useState()
    const [ canEdit, setCanEdit ] = useState()
    const [ reportAssigned, setReportAssigned ] = useState()
    const [ openReportCommitModal, setOpenReportCommitModal ] = useState(false)

    useEffect(() => {
        console.log(id)
        reportsRoutes.getReportByIndex(id).then(r => {
            console.log(r)
            let report = r.data
            console.log(report)
            //let level = 0;
            getPauta(report);
            if(!report.level) {
                report.level = 0
            }
            setReportAssigned(report)
            
            setReportLevel(report.level);
            let myReportLevel;
            if((localStorage.getItem('role') === 'inspectionWorker')||(localStorage.getItem('role') === 'maintenceOperator')) {
                myReportLevel = 0;
            }else if(localStorage.getItem('role') === 'shiftManager') {
                myReportLevel = 1;
            }else if(localStorage.getItem('role') === 'chiefMachinery') {
                myReportLevel = 2;
            }else if(localStorage.getItem('role') === 'sapExecutive') {
                myReportLevel = 3;
            };
            if(myReportLevel === report.level) {
                setCanEdit(true)
            }
        })
        
    }, [])

    const getPauta = async (r) => {
        let report = r;
        let db = await pautasDatabase.initDbPMs();
        let pautaIdpm = r.idPm;
        console.log(pautaIdpm)
        if(db) {
            setReportAssignment(report.usersAssigned[0]);
            let pautas = await pautasDatabase.consultar(db.database);
            if(pautas) {
                let pautaFiltered = pautas.filter((info) => { 
                    if(
                        (info.typepm === report.guide)&&(report.idPm===info.idpm)||
                        (info.typepm === report.guide)&&(pautaIdpm===info.idpm)
                        ) {return info}});
                console.log(pautaFiltered)
                let exDb = await executionReportsDatabase.initDb();
                if( exDb ) {
                    let responseDatabase = await executionReportsDatabase.consultar(exDb.database);
                    console.log(responseDatabase)
                    if( responseDatabase ) {
                        let executionReportResponse = responseDatabase.filter(
                            (res) => { 
                                console.log(report._id, res.reportId);
                                if(report._id === res.reportId) {
                                    return res
                                }
                            })
                        console.log(executionReportResponse)
                        setExecutionReport(executionReportResponse[0])
                        setPauta(pautaFiltered[0]);
                    }
                }
                
            }
        }
    }

    const getIdpm = (model) => {
        if(model === '793-F') {
            return 'SPM000787';
        }else if(model === 'PC5500') {
            return 'SPM000445'
        }
    }

    const setProgress = (value) => {
        resutProgress(value)
    }

    const endReport = () => {
        //responseMessage()
        let group = new Array();
        group = Object.values(executionReport.group);
        let state = true;
        group.map((item, index) => {
            item.map((i, n) => {
                if(!i.isChecked) {
                    state = false;
                };
                if(n == (item.length - 1)) {
                    if(index == (group.length - 1)) {
                        if((localStorage.getItem('role') === 'inspectionWorker')||(localStorage.getItem('role') === 'maintenceOperator')) {
                            sendToNext(state, reportAssigned)
                        }else{
                            responseMessage()
                        }
                        
                        //
                    }
                }
            })
        })
    }

    const getResponseState = (state, report) => {
        if(state) {
            console.log(report);
            sendToNext(state, report)
        }
    }

    const responseMessage = () => {
        setOpenReportCommitModal(true);
    }

    const sendToNext = async (okToSend, reportData) => {
        if(okToSend) {
            if(confirm('Se enviará información. ¿Desea confirmar?')) {
                let report
                if(reportData) {
                    report = reportData;
                }else{
                    report = JSON.parse(id);
                }
                reportsDatabase.initDbReports().then(db => {
                    reportsDatabase.consultar(db.database).then(async response => {
                        let r = new Array()
                        r = response;
                        let filtered = response.filter(item => {if(report._id === item._id) {return item}});
                        let reportToLoad = filtered[0];
                        console.log(reportToLoad)
                        reportToLoad.level = reportLevel + 1;
                        if(report.shiftManagerApprovedCommit){
                            reportToLoad.shiftManagerApprovedCommit = report.shiftManagerApprovedCommit
                        }
                        if(report.chiefMachineryApprovedCommit) {
                            reportToLoad.chiefMachineryApprovedCommit = report.chiefMachineryApprovedCommit
                        }
                        if(report.sapExecutiveApprovedCommit) {
                            reportToLoad.sapExecutiveApprovedCommit = report.sapExecutiveApprovedCommit
                        }
                        reportToLoad.fullNameWorker = `${localStorage.getItem('name')} ${localStorage.getItem('lastName')}`;            
                        if(reportToLoad.level == 1) {
                            reportToLoad.emailing = "termino-orden-1";
                            reportToLoad.endReport = Date.now();
                            reportToLoad.endReport = reportToLoad.endReport;
                        }else if(reportToLoad.level == 2) {
                            reportToLoad.emailing = "termino-orden-2";
                            reportToLoad.shiftManagerApprovedBy = localStorage.getItem('_id');
                            reportToLoad.shiftManagerApprovedDate = Date.now();
                        }else if(reportToLoad.level == 3) {
                            reportToLoad.emailing = "termino-orden-3";
                            reportToLoad.state = 'Por cerrar'
                            reportToLoad.chiefMachineryApprovedBy = localStorage.getItem('_id');
                            reportToLoad.chiefMachineryApprovedDate = Date.now();
                        }else if(reportToLoad.level == 4) {
                            reportToLoad.emailing = "termino-orden-4";
                            reportToLoad.state = 'Completadas';
                            reportToLoad.enabled = false;
                            reportToLoad.dateClose = Date.now();
                            reportToLoad.sapExecutiveApprovedBy = localStorage.getItem('_id');
                        }
                        let emails = await getExecutivesSapEmail(reportToLoad.level);
                        reportToLoad.emailsToSend = emails;
                        reportsDatabase.actualizar(reportToLoad, db.database).then(async res => {
                            if(navigator.onLine) {
                                let generateLink=`https://icv-plataforma-mantencion.azurewebsites.net/activities/${id}`
                                if(res) {
                                    let r = await reportsRoutes.editReportFromAudit(reportToLoad, generateLink);
                                    if(r) {
                                        alert('Información enviada');
                                        history.goBack();
                                    }
                                }
                            }else{
                                alert('Información actualizada en dispositivo. No olvide sincronizar una vez cuente con conexión a internet.')
                            }
                        }) 
                    })
                })
            }
        }else{
            alert('Orden no se encuantra finalizada. Revise e intente nuevamente.');
            /* if((localStorage.getItem('role') === 'inspectionWorker')||(localStorage.getItem('role') === 'maintenceOperator')) {
                
            }else if(localStorage.getItem('role') === 'shiftManager') {
                JSON.parse(id).shiftManagerApprovedCommit = null
            }else if(localStorage.getItem('role') === 'chiefMachinery') {
                JSON.parse(id).chiefMachineryApprovedCommit = null
            }else if(localStorage.getItem('role') === 'sapExecutive') {
                JSON.parse(id).sapExecutiveApprovedCommit = null
            }; */
            
        }
    }

    const terminarjornada = async () => {
        let report = JSON.parse(id)
        let db = await reportsDatabase.initDbReports();
        let emails = await getExecutivesSapEmail();
        let reports = await reportsDatabase.consultar(db.database);
        let reportSelected = reports.filter((r) => {if(r._id === report._id) {return r}});
        let usersAssigned = new Array();
        usersAssigned = reportSelected[0].usersAssigned;
        let usersAssignedFiltered = usersAssigned.filter((user) => {if(user === localStorage.getItem('_id')){}else{return user}});
        report.usersAssigned = usersAssignedFiltered;
        report.state = "Asignar";
        report.emailing = "termino-jornada";
        report.fullNameWorker = `${localStorage.getItem('name')} ${localStorage.getItem('lastName')}`;
        report.emailsToSend = emails;
        let reportActualized = await reportsDatabase.actualizar(report, db.database);
        if(reportActualized) {
            if(navigator.onLine) {
                let actualiza = await reportsRoutes.editReport(report);
                if(actualiza) {
                    alert('Se ha actualizado su reporte. La orden desaparecerá de su listado.');
                    history.goBack();
                }
            }
        }else{
            alert('Ha ocurrido un error.')
        }
    }

    /* const openCommitModal = () => {
        setOpenReportCommitModal(true)
    } */

    const closeCommitModal = () => {
        setOpenReportCommitModal(false)
    }

    return (
        <Box height='80vh'>
            <Grid className={classes.pageRoot} container spacing={0}>
                <Grid className={classes.pageContainer} item xs={12}>
                    <Card className={classes.pageCard}>
                        <Grid container alignItems='center' justifyContent='center'>
                            <div style={{width: '100%', textAlign: 'left', padding: 10 }}>
                                <div style={{width: '100%', textAlign: 'left', color: '#333', backgroundColor: '#fff', borderRadius: 20 }}>
                                    <Toolbar style={{paddingLeft: 0, backgroundColor: '#F9F9F9', borderRadius: 10, width: '100%'}}>
                                        <IconButton onClick={() => setTimeout(() => {
                                            history.goBack()
                                        }, 500)}> 
                                            <ArrowBackIos style={{color: '#333', fontSize: 16}}/> 
                                        </IconButton> 
                                        <h1 style={{marginTop: 0, marginBottom: 0, fontSize: 16}}>
                                            Actividades Asignadas / Detalle
                                        </h1>
                                        
                                        <div style={{position: 'absolute', right: 10, width: '50%', textAlign: 'right'}}>
                                            {/* <div style={{width: '100%', position: 'relative', right: 50, display: 'block'}}>
                                                <Button variant="contained" color={'primary'} style={{ borderRadius: 50 }} onClick={()=>{endReport()}}>
                                                    Enviar
                                                </Button>
                                            </div> */}
                                            <div style={{width: '100%', position: 'relative', right: 10, display: 'block'}}>
                                                <div style={{float: 'right', width: '40%', marginTop: 10, textAlign: 'left'}}>
                                                    <LinearProgress variant="determinate" value={progress} style={{width: '100%'}}/>
                                                    <p>{progress.toFixed(0)}%</p>
                                                </div>
                                                {
                                                    (localStorage.getItem('role') != 'sapExecutive') && <div style={{float: 'right', width: '40%', marginTop: 10, textAlign: 'right', marginRight: 20}}>
                                                        {canEdit && <Button variant="contained" color={'primary'} style={{ borderRadius: 50 }} onClick={()=>{endReport()}}>
                                                            Enviar
                                                        </Button>}
                                                        {!canEdit && <Button disabled={true} variant="contained" color={'primary'} style={{ borderRadius: 50 }}>
                                                            Enviar
                                                        </Button>}
                                                    </div>
                                                }
                                                {
                                                    (localStorage.getItem('role') === 'sapExecutive') && <div style={{float: 'right', width: '40%', marginTop: 10, textAlign: 'right', marginRight: 20}}>
                                                        {canEdit && <Button variant="contained" color={'primary'} style={{ borderRadius: 50 }} onClick={()=>{endReport()}}>
                                                            Cerrar Orden
                                                        </Button>}
                                                        {!canEdit && <Button disabled={true} variant="contained" color={'primary'} style={{ borderRadius: 50 }}>
                                                            Cerrar Orden
                                                        </Button>}
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </Toolbar>
                                </div>
                            </div>
                            <div style={{width: '98%'}}>
                                {
                                    pauta && <PautaDetail height={'calc(100vh - 380px)'} reportAssigned={reportAssigned} pauta={pauta} executionReport={executionReport} reportLevel={reportLevel} reportAssignment={reportAssignment} setProgress={setProgress}/>
                                }
                            </div>
                            {
                                openReportCommitModal && <ReportCommitModal open={openReportCommitModal} closeModal={closeCommitModal} report={reportAssigned} getResponseState={getResponseState} />
                            } 
                            <div style={{width: '98%', marginTop: 20, textAlign: 'right'}}>
                                {(((localStorage.getItem('role') === 'inspectionWorker')||(localStorage.getItem('role') === 'maintenceOperator')) && canEdit) && <Button variant="contained" color={'primary'} style={{ borderRadius: 50 }} onClick={()=>{terminarjornada()}}>
                                    Terminar Jornada
                                </Button>}
                                {((localStorage.getItem('role') === 'inspectionWorker')||(localStorage.getItem('role') === 'maintenceOperator')) && !canEdit && <Button disabled variant="contained" color={'primary'} style={{ borderRadius: 50 }}>
                                    Terminar Jornada
                                </Button>}
                            </div>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

export default ActivitiesDetailPage