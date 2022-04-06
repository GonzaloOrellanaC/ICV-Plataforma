import React, { useState, useEffect, ReactDOM } from 'react';
import { Box, Card, Grid, Toolbar, IconButton, LinearProgress, Button } from '@material-ui/core'
import { ArrowBackIos } from '@material-ui/icons'
import { getExecutionReport, getExecutivesSapEmail, getExecutivesSapId, saveExecutionReport, useStylesTheme } from '../../config'
import { useHistory, useParams } from 'react-router-dom'
import { pautasDatabase, executionReportsDatabase, reportsDatabase } from '../../indexedDB'
import { PautaDetail } from '../../containers'
import { executionReportsRoutes, reportsRoutes } from '../../routes'
import { LoadingModal, ReportCommitModal } from '../../modals'
import { SocketConnection } from '../../connections';
import sendnotificationToManyUsers from './sendnotificationToManyUsers';

const ActivitiesDetailPage = () => {
    const classes = useStylesTheme();
    const history = useHistory();
    const {id} = useParams();
    const [ pauta, setPauta ] = useState();
    const [ progress, resutProgress ] = useState(0)
    const [ reportAssignment, setReportAssignment ] = useState()
    const [ reportLevel, setReportLevel ] = useState()
    const [ canEdit, setCanEdit ] = useState()
    const [ reportAssigned, setReportAssigned ] = useState()
    const [ openReportCommitModal, setOpenReportCommitModal ] = useState(false)
    const [ loading, setLoading ] = useState(false)
    const [ loadingMessage, setLoadingMessage ] = useState(false)
    const [ indexGroup, setIndexGroup] = useState([])

    useEffect(() => {
        if(navigator.onLine) {
            reportsRoutes.getReportByIndex(id).then(r => {
                let report = r.data
                //console.log(report)
                getPauta(report);
                if(!report.level) {
                    report.level = 0
                }
                setReportAssigned(report);
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
        }else{

        }       
    }, [])

    const getPauta = async (r) => {
        let report = r;
        let db = await pautasDatabase.initDbPMs();
        let pautaIdpm = r.idPm;
        if(db) {
            setReportAssignment(report.usersAssigned[0]);
            let pautas = await pautasDatabase.consultar(db.database);
            let pautaFiltered = pautas.filter((info) => { 
                if(
                    (info.typepm === report.guide)&&(report.idPm===info.idpm)||
                    (info.typepm === report.guide)&&(pautaIdpm===info.idpm)
                    ) {
                        return info
                    }});
            const state = await saveExecutionReport(pautaFiltered[0], report)
            console.log(state)
            setPauta(pautaFiltered[0]);
            setTimeout(async () => {
                const element = await getExecutionReport(report._id)
            }, 2000);
        }
    }

    const setProgress = (value) => {
        resutProgress(value)
    }

    const endReport = async () => {
        if(navigator.onLine) {
            setLoading(true)
            if(localStorage.getItem('role') === 'sapExecutive') {
                setLoadingMessage('Cerrando OT...')
            }else{
                setLoadingMessage('Enviando estado...')
            }
            let group = new Array()
            const executionReportData = await getExecutionReport(reportAssigned._id)
            let state = true;
            if(reportAssigned.testMode) {
                let groupFiltered = []
                indexGroup.map((g, i) => {
                    groupFiltered.push(executionReportData.data.group[g.data])
                    if(i == (indexGroup.length - 1)) {
                        sendDataToRead(groupFiltered, state)
                    }
                })
            }else{
                group = Object.values(executionReportData.data.group)
                sendDataToRead(group, state)
            }
        }else{
            alert('Dispositivo no está conectado a internet. Conecte a una red e intente nuevamente')
        }
    }

    const sendDataToRead = (group = new Array(), state = new Boolean()) => {
        group.map((item, index) => {
            item.map((i, n) => {
                if(!i.isChecked) {
                    state = false
                }
                if(n == (item.length - 1)) {
                    if(index == (group.length - 1)) {
                        if((localStorage.getItem('role') === 'inspectionWorker')||(localStorage.getItem('role') === 'maintenceOperator')) {
                            sendToNext(state, reportAssigned)
                        }else{
                            responseMessage()
                        }
                    }
                }
            })
        })
    }

    const getResponseState = (state, report) => {
        if(state) {
            setLoading(true)
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
                report.level = report.level + 1
                report.fullNameWorker = `${localStorage.getItem('name')} ${localStorage.getItem('lastName')}`;            
                if(report.level == 1) {
                    report.emailing = "termino-orden-1";
                    report.endReport = Date.now();
                    report.endReport = report.endReport;
                    sendnotificationToManyUsers(report.emailing, report.idIndex)
                }else if(report.level == 2) {
                    report.emailing = "termino-orden-2";
                    report.shiftManagerApprovedBy = localStorage.getItem('_id');
                    report.shiftManagerApprovedDate = Date.now();
                    sendnotificationToManyUsers(report.emailing, report.idIndex)
                }else if(report.level == 3) {
                    report.emailing = "termino-orden-3";
                    report.state = 'Por cerrar'
                    report.chiefMachineryApprovedBy = localStorage.getItem('_id')
                    report.chiefMachineryApprovedDate = Date.now();
                    sendnotificationToManyUsers(report.emailing, report.idIndex)
                }else if(report.level == 4) {
                    report.emailing = "termino-orden-4";
                    report.state = 'Completadas';
                    report.enabled = false;
                    report.dateClose = Date.now();
                    report.sapExecutiveApprovedBy = localStorage.getItem('_id')
                    sendnotificationToManyUsers(report.emailing, report.idIndex)
                }
                const emails = await getExecutivesSapEmail(report.level);
                report.emailsToSend = emails;
                console.log(report)
                setTimeout(async () => {
                    const generateLink=`/activities/${id}`
                    const r = await reportsRoutes.editReportFromAudit(report, generateLink)
                    console.log(r)
                    if(r) {
                        alert('Información enviada')
                        setTimeout(() => {
                            setLoading(false)
                            history.goBack()
                        }, 500);
                    }
                }, 1000);
                /*  */
            }
        }else{
            alert('Orden no se encuantra finalizada. Revise e intente nuevamente.')
            setLoadingMessage('Retrocediendo...')
            setTimeout(() => {
                setLoading(false)
            }, 1000);
        }
    }

    const terminarjornada = async () => {
        if(navigator.onLine) {
            setLoading(true)
            setLoadingMessage('Terminando su jornada')
            const report = reportAssigned
            const emails = await getExecutivesSapEmail(reportLevel)
    /*      let reports = await reportsDatabase.consultar(db.database);
            let reportSelected = reports.filter((r) => {if(r.idIndex == Number(id)) {return r}}); */
            let usersAssigned = new Array()
            usersAssigned = reportAssigned.usersAssigned
            let usersAssignedFiltered = usersAssigned.filter((user) => {if(user === localStorage.getItem('_id')){}else{return user}})
            report.idIndex = id
            report.usersAssigned = usersAssignedFiltered
            report.state = "Asignar"
            report.emailing = "termino-jornada"
            report.fullNameWorker = `${localStorage.getItem('name')} ${localStorage.getItem('lastName')}`
            report.emailsToSend = emails
            let ids = new Array()
            ids = await getExecutivesSapId()
            ids.forEach(async (id, index) => {
                SocketConnection.sendnotificationToUser(
                    'termino-jornada',
                    `${localStorage.getItem('_id')}`,
                    id,
                    'Aviso general',
                    'Término de jornada',
                    `${localStorage.getItem('name')} ${localStorage.getItem('lastName')} ha terminado su jornada. Recuerde reasignar OT`,
                    '/reports'
                );
                if(index == (ids.length - 1)) {
                    console.log('enviadas las notificaciones!')
                    let actualiza = await reportsRoutes.editReport(report)
                    if(actualiza) {
                        setLoading(false)
                        setTimeout(() => {
                            alert('Se ha actualizado su reporte. La orden desaparecerá de su listado.')
                            history.goBack()
                        }, 500)
                    }
                }
            })
        }else{
            alert('Dispositivo no está conectado a internet. Conecte a una red e intente nuevamente')
        }
    }

    const closeCommitModal = () => {
        setOpenReportCommitModal(false)
    }

    return (
        <Box height='80vh'>
            <Grid className={classes.pageRoot} container spacing={0}>
                <Grid className={classes.pageContainer} item xs={12}>
                    <Card elevation={0} className={classes.pageCard}>
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
                                            Actividades Asignadas / Detalle / OT {id} <strong>{reportAssigned && reportAssigned.testMode ? 'Modo test' : ''}</strong>
                                        </h1>
                                        
                                        <div style={{position: 'absolute', right: 10, width: '50%', textAlign: 'right'}}>
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
                                    pauta && <PautaDetail height={'calc(100vh - 380px)'} reportAssigned={reportAssigned} pauta={pauta} reportLevel={reportLevel} reportAssignment={reportAssignment} setProgress={setProgress} setIndexGroupToSend={setIndexGroup}/>
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
            {
                <LoadingModal open={loading} withProgress={false} loadingData={loadingMessage} />
            }
        </Box>
    )
}

export default ActivitiesDetailPage