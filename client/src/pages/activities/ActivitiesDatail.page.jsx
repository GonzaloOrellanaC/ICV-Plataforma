import React, { useState, useEffect, ReactDOM } from 'react';
import { Box, Card, Grid, Toolbar, IconButton, LinearProgress, Button, Icon, SvgIcon } from '@material-ui/core'
import { ArrowBackIos, Close } from '@material-ui/icons'
import { getExecutionReport, getExecutivesSapEmail, getExecutivesSapId, saveExecutionReport, useStylesTheme } from '../../config'
import { useHistory, useParams } from 'react-router-dom'
import { pautasDatabase, executionReportsDatabase, reportsDatabase, readyToSendReportsDatabase } from '../../indexedDB'
import { PautaDetail } from '../../containers'
import { executionReportsRoutes, reportsRoutes } from '../../routes'
import { LoadingLogoModal, LoadingModal, ReportCommitModal, ReportMessagesModal } from '../../modals'
import { SocketConnection } from '../../connections';
import sendnotificationToManyUsers from './sendnotificationToManyUsers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faPaperPlane, faComment } from '@fortawesome/free-solid-svg-icons';
import fileCircleXMark from './fileCircleXMark'

const ActivitiesDetailPage = () => {
    const classes = useStylesTheme();
    const history = useHistory();
    const {id} = useParams();
    const [ pauta, setPauta ] = useState();
    const [ progress, resutProgress ] = useState(0)
    const [ itemProgress, resultThisItemProgress ] = useState(0)
    const [ reportAssignment, setReportAssignment ] = useState()
    const [ reportLevel, setReportLevel ] = useState()
    const [ canEdit, setCanEdit ] = useState()
    const [ reportAssigned, setReportAssigned ] = useState()
    const [ openReportCommitModal, setOpenReportCommitModal ] = useState(false)
    const [ loading, setLoading ] = useState(false)
    const [ loadingMessage, setLoadingMessage ] = useState(false)
    const [ indexGroup, setIndexGroup] = useState([])
    const [ loadingLogo, setLoadingLogo ] = useState(false)
    const [ canSendReport, setCanSendReport ] = useState(false)
    const [ canRejectReport, setCanRejectReport ] = useState(false)
    const [ messageType, setMessageType ] = useState()
    const [ openMessagesModal, setOpenMessagesModal ] = useState(false)
    const [ smActivated, setSmActivated ] = useState(false)

    useEffect(async () => {
        window.addEventListener('resize', (ev) => {
            if(ev.target.outerHeight > ev.target.outerWidth) {
                setSmActivated(true)
            }else {
                setSmActivated(false)
            }
        }, true)
        if(window.screen.height > window.screen.width) {
            setSmActivated(true)
        } else {
            setSmActivated(false)
        }
        if((localStorage.getItem('role') === 'inspectionWorker')||(localStorage.getItem('role') === 'maintenceOperator')) {
            setCanSendReport(false)
        }else{
            setCanSendReport(true)
        }
        setLoadingLogo(true)
        if(navigator.onLine) {
            reportsRoutes.getReportByIndex(id).then(r => {
                let report = r.data
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
                    setCanRejectReport(true)
                }
            })
        }else{
            const db = await reportsDatabase.initDbReports()
            const {database} = db
            const list = await reportsDatabase.consultar(database)
            console.log(list)
            const reportFiltered = list.filter(item => {if(Number(item.idIndex) == id){return item}})
            console.log(reportFiltered)
            let report = reportFiltered[0]
            console.log(report)
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
        }
    }, [])

    const getPauta = async (r) => {
        let report = r;
        let db = await pautasDatabase.initDbPMs();
        let pautaIdpm = r.idPm
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
        console.log(pautaFiltered[0])
        setPauta(pautaFiltered[0])
        setTimeout(() => {
            setLoadingLogo(false)
        }, 1000)
    }

    const setProgress = (value) => {
        resutProgress(value)
    }

    const endReport = async () => {
        let group = new Array()
        let state = true;
        const executionReportData = await getExecutionReport(reportAssigned._id)
        group = Object.values(executionReportData.data.group)
        if(navigator.onLine) {
            if(localStorage.getItem('role') === 'sapExecutive') {
                setLoadingMessage('Cerrando OT...')
            }else{
                setLoadingMessage('Enviando estado...')
            }
            if(reportAssigned.testMode) {
                let groupFiltered = []
                indexGroup.map((g, i) => {
                    groupFiltered.push(executionReportData.data.group[g.data])
                    if(i == (indexGroup.length - 1)) {
                        sendDataToRead(groupFiltered, state, true)
                    }
                })
            }else{
                sendDataToRead(group, state, true)
            }
        }else{
            setLoadingLogo(true)
            console.log(reportAssigned.testMode)
            if(reportAssigned.testMode) {
                let groupFiltered = []
                indexGroup.map((g, i) => {
                    groupFiltered.push(executionReportData.data.group[g.data])
                    if(i == (indexGroup.length - 1)) {
                        sendDataToRead(groupFiltered, state, false)
                    }
                })
            }else{
                sendDataToRead(group, state, false)
            }
            
        }
    }

    const saveDataLocal = async () => {
        alert('Dispositivo no está conectado a internet. Conecte a una red e intente nuevamente. Estado de la OT cambia a "Listo para enviar"')
        reportAssigned.readyToSend = true
        let db = await  readyToSendReportsDatabase.initDb()
        let state = await readyToSendReportsDatabase.actualizar(reportAssigned, db.database)
        if(state) {
            history.goBack()
            setLoadingLogo(false)
        } else {
            setLoadingLogo(false)
            alert('Error al intentar guardar el estado de avance sin conexión. Intente nuevamente. De continuar el problema, contactar a la administración.')
        }
    }

    const rejectReport = async () => {
        if(navigator.onLine) {
            setMessageType('rejectReport')
            setOpenReportCommitModal(true)
        }else{
            alert('Dispositivo no está conectado a internet. Conecte a una red e intente nuevamente')
        }
    }

    const sendDataToRead = (group = new Array(), state = new Boolean(), send = new Boolean()) => {
        group.map((item, index) => {
            item.map((i, n) => {
                console.log(i.isChecked)
                if(!i.isChecked) {
                    state = false
                }
                if(reportAssigned.testMode) {
                    console.log(i)
                }
                if(n == (item.length - 1)) {
                    if(index == (group.length - 1)) {
                        if (state) {
                            console.log(state, send)
                            if( send ) {
                                responseMessage()
                            } else {
                                console.log('Enviando en desconexzión')
                                saveDataLocal()
                            }
                        } else {
                            alert('Debe completar la pauta totalmente para enviar a revisión.')
                            setLoadingLogo(false)
                        }
                        /* if((localStorage.getItem('role') === 'inspectionWorker')||(localStorage.getItem('role') === 'maintenceOperator')) {
                            sendToNext(state, reportAssigned)
                        }else{
                            responseMessage()
                        } */
                    }
                }
            })
        })
    }

    const getResponseState = (state, report) => {
        if(state) {
            setLoading(true)
            if(messageType === 'rejectReport') {
                sendToBack(report)
            } else if (messageType === 'sendReport') {
                sendToNext(state, report)
            }
        }
    }

    const responseMessage = () => {
        setMessageType('sendReport')
        setOpenReportCommitModal(true);
    }

    const sendToNext = async (okToSend, reportData) => {
        if(okToSend) {
            if(confirm('Se enviará información. ¿Desea confirmar?')) {
                setLoading(true)
                let report
                if(reportData) {
                    report = reportData;
                }else{
                    report = JSON.parse(id);
                }
                console.log(report)
                let db = await readyToSendReportsDatabase.initDb()
                let response = await readyToSendReportsDatabase.eliminar(report.idIndex, db.database)
                console.log(response)
                report.level = report.level + 1
                report.fullNameWorker = `${localStorage.getItem('name')} ${localStorage.getItem('lastName')}`
                /* report.history.push({
                    id: Date.now(),
                    userSendingData: localStorage.getItem('_id'),
                    type: 'sending-to-next-level'
                }) */
                if(report.level === 1) {
                    console.log('Iniciando envío nivel 1')
                    report.emailing = "termino-orden-1";
                    report.endReport = Date.now();
                    report.endReport = report.endReport;
                    console.log(report)
                    let res = await nextActivity(report)
                    if(res) {
                        sendnotificationToManyUsers(report.emailing, report.idIndex)
                        setLoading(false)
                        history.goBack()
                    }else{
                        alert('Error de actualización de datos en servidor. contacte al administrador.')
                        setLoading(false)
                    }
                }else if(report.level === 2) {
                    console.log('Iniciando envío nivel 2')
                    report.emailing = "termino-orden-2";
                    report.shiftManagerApprovedBy = localStorage.getItem('_id');
                    report.shiftManagerApprovedDate = Date.now();
                    console.log(report)
                    let res = await nextActivity(report)
                    if(res) {
                        sendnotificationToManyUsers(report.emailing, report.idIndex)
                        setLoading(false)
                        history.goBack()
                    }else{
                        alert('Error de actualización de datos en servidor. contacte al administrador.')
                        setLoading(false)
                    }
                }else if(report.level === 3) {
                    console.log('Iniciando envío nivel 3')
                    report.emailing = "termino-orden-3";
                    report.state = 'Por cerrar'
                    report.chiefMachineryApprovedBy = localStorage.getItem('_id')
                    report.chiefMachineryApprovedDate = Date.now();
                    console.log(report)
                    let res = await nextActivity(report)
                    if(res) {
                        sendnotificationToManyUsers(report.emailing, report.idIndex)
                        setLoading(false)
                        history.goBack()
                    }else{
                        alert('Error de actualización de datos en servidor. contacte al administrador.')
                        setLoading(false)
                    }
                }else if(report.level === 4) {
                    console.log('Iniciando envío nivel 4')
                    report.emailing = "termino-orden-4";
                    report.state = 'Completadas';
                    report.enabled = false;
                    report.dateClose = Date.now();
                    report.sapExecutiveApprovedBy = localStorage.getItem('_id')
                    console.log(report)
                    let res = await nextActivity(report)
                    if(res) {
                        sendnotificationToManyUsers(report.emailing, report.idIndex)
                        setLoading(false)
                        history.goBack()
                    }else{
                        alert('Error de actualización de datos en servidor. contacte al administrador.')
                        setLoading(false)
                    }
                } else {
                    alert('Error al leer los niveles del reporte. Debe ser reparado por el administrador del servicio.')
                }
            }else{
                setLoading(false)
            }
        }else{
            alert('Orden no se encuantra finalizada. Revise e intente nuevamente.')
            setLoadingMessage('Retrocediendo...')
            setTimeout(() => {
                setLoading(false)
            }, 1000);
        }
    }

    const sendToBack = async (report) => {
        setLoading(true)
        let ejecutor = new String()
        if(localStorage.getItem('role')==='shiftManager') {
            ejecutor = 'ejecutor'
        }else if(localStorage.getItem('role')==='chiefMachinery') {
            ejecutor = 'jefe de turno'
        }else if(localStorage.getItem('role')==='sapExecutive') {
            ejecutor = 'jefe de maquinaria'
        }
        if(confirm(`Devolverá la información al ${ejecutor}. ¿Desea confirmar?`)) {
            //let report = reportAssigned
            report.level = report.level - 1
            report.fullNameWorker = `${localStorage.getItem('name')} ${localStorage.getItem('lastName')}`
            if(report.level === 0) {
                report.emailing = "rechazo-orden-0";
                sendnotificationToManyUsers(report.emailing, report.idIndex, report.history[report.history.length - 1].userSendingData)
                let res = await reportsRoutes.editReport(report)
                if(res) {
                    setTimeout(() => {
                        setLoading(false)
                        history.goBack()
                    }, 1000);
                }
            }else if(report.level === 1) {
                report.emailing = "rechazo-orden-1";
                sendnotificationToManyUsers(report.emailing, report.idIndex, report.history[report.history.length - 1].userSendingData)
                let res = await reportsRoutes.editReport(report)
                if(res) {
                    setTimeout(() => {
                        setLoading(false)
                        history.goBack()
                    }, 1000);
                }
            }else if(report.level === 2) {
                report.emailing = "rechazo-orden-2";
                sendnotificationToManyUsers(report.emailing, report.idIndex, report.history[report.history.length - 1].userSendingData)
                let res = await reportsRoutes.editReport(report)
                if(res) {
                    setTimeout(() => {
                        setLoading(false)
                        history.goBack()
                    }, 1000);
                }
            } else {
                alert('Error al leer los niveles del reporte. Debe ser reparado por el administrador del servicio.')
            }
        }
    }

    const nextActivity =  (report) => {
        return new Promise(async resolve => {
            console.log('Segunda lectura :', report)
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
                        resolve(true)
                    }, 500);
                }else{
                    resolve(false)
                }
            }, 1000);
        })
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

    const openMessages = () => {
        setOpenMessagesModal(true)
    }

    const closeMessages = () => {
        setOpenMessagesModal(false)
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
                                    </Toolbar>
                                </div>
                            </div>
                            <Grid container>
                                <Grid item xl={10} md={10} sm={12}>
                                    <div style={{padding: 20}}>
                                        {
                                            pauta && <PautaDetail 
                                                height={smActivated ? 'calc(100vh - 850px)' :'calc(100vh - 360px)'} 
                                                reportAssigned={reportAssigned} 
                                                pauta={pauta} 
                                                reportLevel={reportLevel} 
                                                reportAssignment={reportAssignment} 
                                                setProgress={setProgress} 
                                                setIndexGroupToSend={setIndexGroup}
                                                resultThisItemProgress={resultThisItemProgress}
                                                />
                                        }
                                    </div>
                                </Grid>
                                <Grid item xl={2} md={2} sm={12}>
                                    <div style={{marginTop: 20, padding: 20, backgroundColor: '#F9F9F9', borderRadius: 10, height: '98%'}}>
                                        <div style={{textAlign: 'center', width: '100%'}}>
                                            <h2 style={{margin: 0}}>OT {id}</h2>
                                            <p style={{margin: 0}}>Tipo de pauta: <br /> <strong>{pauta && pauta.typepm}</strong></p>
                                            <p style={{backgroundColor: 'red', color: 'white', marginBottom: 0}}><strong>{reportAssigned && reportAssigned.testMode ? 'Modo test' : ''}</strong></p>
                                        </div>
                                        <h4 style={{textAlign: 'center'}}>Avance en esta hoja: {progress.toFixed(0)}%</h4>
                                        <LinearProgress variant="determinate" value={progress} style={{width: '100%'}}/>
                                        {/* <p style={{textAlign: 'center'}}>{progress.toFixed(0)}%</p> */}
                                        <h4 style={{textAlign: 'center'}}>Avance total: {itemProgress.toFixed(0)}%</h4>
                                        <LinearProgress variant="determinate" value={itemProgress} style={{width: '100%'}}/>
                                        {/* <p style={{textAlign: 'center'}}>{itemProgress.toFixed(0)}%</p> */}
                                        <br />
                                        {(localStorage.getItem('role') != 'sapExecutive') && <Button disabled={!canEdit} variant="contained" color='primary' style={{padding: 10, width: '100%', marginBottom: 20}} onClick={()=>{endReport()}}>
                                            <FontAwesomeIcon icon={faPaperPlane} style={{marginRight: 10}} /> Enviar OT
                                        </Button>}
                                        {(localStorage.getItem('role') === 'sapExecutive') && <Button disabled={!canEdit} variant="contained" color='primary' style={{padding: 10, width: '100%', marginBottom: 20}} onClick={()=>{endReport()}}>
                                            <FontAwesomeIcon icon={faPaperPlane} style={{marginRight: 10}} /> Cerrar OT
                                        </Button>
                                        }
                                        {!((localStorage.getItem('role') === 'inspectionWorker')||(localStorage.getItem('role') === 'maintenceOperator')) && 
                                        <Button disabled={!canSendReport || !canRejectReport} variant="contained" color='primary' style={{padding: 10, width: '100%', marginBottom: 20}} onClick={()=>{rejectReport()}}>
                                            <Close />
                                            Rechazar OT
                                        </Button>}
                                        {(((localStorage.getItem('role') === 'inspectionWorker')||(localStorage.getItem('role') === 'maintenceOperator'))&&(reportLevel===0)) && <Button onClick={()=>{terminarjornada()}} variant="contained" color='primary' style={{padding: 10, width: '100%', marginBottom: 20}}>
                                            <FontAwesomeIcon icon={faClock} style={{marginRight: 10}} /> Terminar Jornada
                                        </Button>}
                                        <Button variant="contained" color='primary' style={{padding: 10, width: '100%', marginBottom: 0}} onClick={()=>{openMessages()}}>
                                            <FontAwesomeIcon icon={faComment} style={{marginRight: 10}} /> Mensajes de flujo
                                        </Button>
                                    </div>
                                </Grid>
                            </Grid>
                            {
                                openReportCommitModal && <ReportCommitModal open={openReportCommitModal} closeModal={closeCommitModal} report={reportAssigned} getResponseState={getResponseState} messageType={messageType}/>
                            }
                            {
                                openMessagesModal && <ReportMessagesModal open={openMessagesModal} close={closeMessages} report={reportAssigned} />
                            }
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
            {
                <LoadingModal open={loading} withProgress={false} loadingData={loadingMessage} />
            }
            {
                loadingLogo && <LoadingLogoModal open={loadingLogo} />
            }
        </Box>
    )
}

export default ActivitiesDetailPage