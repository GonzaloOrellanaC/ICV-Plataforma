import React, { useState, useEffect, useContext } from 'react'
import { Box, Card, Grid, Toolbar, IconButton, LinearProgress, Button, Modal, Fab } from '@material-ui/core'
import { ArrowBackIos, Close } from '@material-ui/icons'
import { getExecutionReport, getExecutivesSapEmail, getExecutivesSapId, getMachineData, useStylesTheme, detectIf3DModelExist, translateSubSystem, styleModal3D, dateSimple, dateWithTime, saveExecutionReport, base64ToImage } from '../../config'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { pautasDatabase, reportsDatabase, readyToSendReportsDatabase, executionReportsDatabase } from '../../indexedDB'
import { MVAvatar, PautaDetail } from '../../containers'
import { executionReportsRoutes, pdfMakeRoutes, reportsRoutes } from '../../routes'
import { LoadingLogoModal, LoadingModal, ReportCommitModal, ReportMessagesModal } from '../../modals'
import { SocketConnection } from '../../connections'
import sendnotificationToManyUsers from './sendnotificationToManyUsers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faPaperPlane, faComment, faEye } from '@fortawesome/free-solid-svg-icons'
import toPDF from '../../modals/pdf/toPDF'
import PreviewModal from '../../modals/preview/Preview.modal'
import { useAuth, useConnectionContext, useExecutionReportContext, useReportsContext } from '../../context'

const ActivitiesDetailPage = () => {
    const {admin, isOperator, isSapExecutive, isShiftManager, isChiefMachinery, userData} = useAuth()
    const {isOnline} = useConnectionContext()
    const classes = useStylesTheme()
    const history = useHistory()
    const {id} = useParams()
    const {report, executionReport, setOtIndex, sapId, serieEquipo, setLoading, setLoadingMessage} = useExecutionReportContext()
    const {setReports, getReports} = useReportsContext()
    const [ progress, resutProgress ] = useState(0)
    const [ itemProgress, resultThisItemProgress ] = useState(0)
    const [ reportLevel, setReportLevel ] = useState()
    const [ canEdit, setCanEdit ] = useState(false)
    const [ reportAssigned, setReportAssigned ] = useState()
    const [ openReportCommitModal, setOpenReportCommitModal ] = useState(false)
/*     const [ loadingMessage, setLoadingMessage ] = useState(false)
 */    const [ indexGroup, setIndexGroup] = useState([])
    const [ loadingLogo, setLoadingLogo ] = useState(false)
    const [ canSendReport, setCanSendReport ] = useState(false)
    const [ canRejectReport, setCanRejectReport ] = useState(false)
    const [ messageType, setMessageType ] = useState()
    const [ openMessagesModal, setOpenMessagesModal ] = useState(false)
    const [ smActivated, setSmActivated ] = useState(false)
    const [ machineData, setMachineDtaa ] = useState()
    const [ habilite3D, setHabilite3D ] = useState(false)
    const [ subSistem, setSubSistem ] = useState()
    const [ open3D, setOpen3D ] = useState(false)
    const [ ultimoGuardadoDispositivo, setUltimoGuardadoDispositivo ] = useState()
    const [openPreviewModal, setOpenPreviewModal] = useState(false)
    const [materialesPreview, setMaterialesPreview] = useState()
    const [toForward, setToForward] = useState(false)
    /* NUEVA VERSION */

    useEffect(() => {
        if (report) {
            console.log(isSapExecutive, report.level)
            if ((isOperator && (report.level === 0 || !report.level)) || 
            (isShiftManager && (report.level === 1)) || 
            (isChiefMachinery && (report.level === 2)) || 
            (isSapExecutive && (report.level === 3))) {
                setCanEdit(true)
            } else {
                setCanEdit(false)
            }
        } else {
            console.log('No report')
            if (id) {
                setOtIndex(id)
            }
        }
    }, [report, id, isOperator, isSapExecutive, isShiftManager, isChiefMachinery])

    const setProgress = ({progressPage, globalProgress}) => {
        resutProgress(Number(progressPage))
        resultThisItemProgress(Number(globalProgress))
    }

    const selectionItem = (value = new String()) => {
        const state = detectIf3DModelExist(value, machineData.model)
        let system = {
            name: translateSubSystem(value),
            brand: machineData.brand,
            model: machineData.model,
            nameModel: `${translateSubSystem(value)}_${machineData.model}`
        }
        console.log(state)
        setSubSistem(JSON.stringify(system))
        setHabilite3D(state)
    }

    const endReport = async () => {
        setMessageType(toForward ? 'sendReport' : 'rejectReport')
        setOpenReportCommitModal(true)
    }

    const forwardReport = () => {
        if (isOnline) {
            setToForward(true)
            endReport()
        } else {
            alert('Dispositivo debe estar conectado a internet.')
        }
    }

    const rejectReport = () => {
        if (isOnline) {
            setToForward(false)
            endReport()
        } else {
            alert('Dispositivo debe estar conectado a internet.')
        }
    }

    const terminarjornada = async () => {
        if(isOnline) {
            const reportCache = report
            const emails = await getExecutivesSapEmail(reportLevel)
            let usersAssigned = new Array()
            usersAssigned = reportCache.usersAssigned
            let usersAssignedFiltered = usersAssigned.filter((user) => {if(user === userData._id){}else{return user}})
            reportCache.idIndex = id
            reportCache.usersAssigned = usersAssignedFiltered
            reportCache.state = "Asignar"
            reportCache.emailing = "termino-jornada"
            reportCache.fullNameWorker = `${userData.name} ${userData.lastName}`
            reportCache.emailsToSend = emails
            let ids = new Array()
            ids = await getExecutivesSapId()
            ids.forEach(async (id, index) => {
                SocketConnection.sendnotificationToUser(
                    'termino-jornada',
                    `${userData._id}`,
                    id,
                    'Aviso general',
                    'Término de jornada',
                    `${userData.name} ${userData.lastName} ha terminado su jornada. Recuerde reasignar OT`,
                    '/reports'
                )
                if(index == (ids.length - 1)) {
                    let actualiza = await reportsRoutes.editReport(reportCache)
                    if(actualiza) {
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

    const closeCommitModalToBack = (state) => {
        setOpenReportCommitModal(false)
        if (state) {
            console.log(report)
            const reportCache = report
            if (reportCache.testMode) {
                const level = reportCache.level - 1
                reportCache.level = level
                reportCache.emailing = `rechazo-orden-${level}`
                if (level === 2) {
                } else if (level === 3) {
                    reportCache.state = 'En proceso'
                }
                console.log(reportCache)
                sendnotificationToManyUsers(reportCache.emailing, reportCache.idIndex, reportCache.history[reportCache.history.length - 1].userSendingData)
                saveReportToDatabases(reportCache)
            } else {
                if (itemProgress === 100) {
                    const level = reportCache.level - 1
                    reportCache.level = level
                    reportCache.emailing = `rechazo-orden-${level}`
                    if (level === 2) {
                    } else if (level === 3) {
                        reportCache.state = 'En proceso'
                    }
                    console.log(reportCache)
                    sendnotificationToManyUsers(reportCache.emailing, reportCache.idIndex, reportCache.history[reportCache.history.length - 1].userSendingData)
                    saveReportToDatabases(reportCache)
                } else {
                    alert('Reporte está incompleto.')
                }
            }
        }
    }

    const closeCommitModalToForward = async (state) => {
        setOpenReportCommitModal(false)
        if (state) {
            setLoadingMessage('Guardando información')
            /* setLoading(true) */
            console.log(report)
            const reportCache = report
            if (reportCache.testMode) {
                let level = 0
                if (!reportCache.level||reportCache.level === 0) {
                    level = 1
                    reportCache.endReport = new Date()
                } else {
                    level = reportCache.level + 1
                }
                reportCache.emailing = `termino-orden-${level}`
                if (level === 2) {
                    reportCache.shiftManagerApprovedBy = userData._id
                    reportCache.shiftManagerApprovedDate = new Date()
                } else if (level === 3) {
                    reportCache.chiefMachineryApprovedBy = userData._id
                    reportCache.chiefMachineryApprovedDate = new Date()
                    reportCache.state = 'Por cerrar'
                } else if (level === 4) {
                    reportCache.sapExecutiveApprovedBy = userData._id
                    reportCache.dateClose = new Date()
                    reportCache.state = 'Completadas'
                    reportCache.level = level
                    console.log(reportCache)
                    await pdfMakeRoutes.createPdfDoc(reportCache)
                    /* toPDF(reportCache, reportCache.machineData, 'Enviando archivo') */
                }
                reportCache.level = level
                sendnotificationToManyUsers(reportCache.emailing, reportCache.idIndex, reportCache.history[reportCache.history.length - 1].userSendingData, userData)
                saveReportToDatabases(reportCache)
                getReports()
            } else {
                if (itemProgress === 100) {
                    let level = 0
                    if (!reportCache.level||reportCache.level === 0) {
                        level = 1
                    } else {
                        level = reportCache.level + 1
                    }
                    reportCache.emailing = `termino-orden-${level}`
                    if (level === 2) {
                        reportCache.shiftManagerApprovedBy = userData._id
                        reportCache.shiftManagerApprovedDate = new Date()
                    } else if (level === 3) {
                        reportCache.chiefMachineryApprovedBy = userData._id
                        reportCache.chiefMachineryApprovedDate = new Date()
                        reportCache.state = 'Por cerrar'
                    } else if (level === 4) {
                        reportCache.sapExecutiveApprovedBy = userData._id
                        reportCache.dateClose = new Date()
                        reportCache.state = 'Completadas' 
                        saveReportToDatabases(reportCache)
                        const response = await pdfMakeRoutes.createPdfDoc(reportCache)    
                    }
                    reportCache.level = level
                    sendnotificationToManyUsers(reportCache.emailing, reportCache.idIndex, reportCache.history[reportCache.history.length - 1].userSendingData, userData._id)
                    getReports()
                } else {
                    alert('Reporte está incompleto.')
                }
            }
        }
    }

    const saveReportToDatabases = async (report) => {
        setLoadingMessage('Guardando en bases de datos')
        const {database} = await reportsDatabase.initDbReports()
        await reportsDatabase.actualizar(report, database)
        const responseDatabase = await executionReportsDatabase.initDb()
        const executionReportCache = executionReport
        executionReportCache.offLineGuard = Date.now()
        await executionReportsDatabase.actualizar(executionReportCache, responseDatabase.database)
        if (isOnline) {
            await reportsRoutes.editReportById(report)
            await executionReportsRoutes.saveExecutionReport(executionReportCache)
        }
        SocketConnection.toPDF(report, userData)
        getReports()
        alert('Orden de trabajo enviado a revisión')
        history.replace('/assignment')
    }

    const closeLoading = () => {
        setLoading(false)
    }

    const openMessages = () => {
        setOpenMessagesModal(true)
    }

    const closeMessages = () => {
        setOpenMessagesModal(false)
    }

    const closeModal = () => {
        setOpen3D(false)
    }

    const vistaPrevia = async () => {
        if (reportLevel>0) {
            const listaMateriales = []
            const db = await executionReportsDatabase.initDb()
            const data = await executionReportsDatabase.consultar(db.database)
            const executionReportFiltered = data.filter((execution) => {
                                                if(execution.reportId === reportAssigned._id) {
                                                    return execution
                                                }
                                            })
            Object.keys(executionReportFiltered[0].group).forEach((element, index) => {
                const hoja = {
                    nombre: element,
                    data: []
                }
                /* console.log(executionReportFiltered[0].group[element]) */
                executionReportFiltered[0].group[element].forEach((item, i) => {
                    if (item.unidad === '*') {

                    } else {
                        const materialData = {
                            task: item.task,
                            taskdesc: item.taskdesc,
                            obs01: item.obs01,
                            partnumberUtl: item.partnumberUtl,
                            cantidad: item.cantidad,
                            unidad: item.unidad,
                            unidadData: item.unidadData ? Number(item.unidadData) : 0,
                            diferencia: parseFloat(item.cantidad.toString()) - parseFloat(item.unidadData ? item.unidadData.toString() : '0')
                        }
                        hoja.data.push(materialData)
                    }
                    if (i === (executionReportFiltered[0].group[element].length - 1)) {
                        if (hoja.data.length > 0) {
                            listaMateriales.push(hoja)
                        }
                    }
                })
                if (index === (Object.keys(executionReportFiltered[0].group).length - 1)) {
                    setMaterialesPreview(listaMateriales)
                }
            })
            setOpenPreviewModal(true)
        } else {
            alert('Orden aún no está listo para revisar el listado de materiales o insumos.')
        }
    }

    const closePreviewModal = () => {
        setOpenPreviewModal(false)
    }

    return (
        <Box height='80vh'>
            <Grid className={'pageRoot'} container spacing={0}>
                <Grid className={classes.pageContainer} item xs={12}>
                    <Card elevation={0} className={'pageCard'}>
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
                                            Actividades Asignadas / Detalle / OT {id} <strong>{(report && report.testMode) ? 'Modo test' : ''}</strong>
                                        </h1>
                                    </Toolbar>
                                </div>
                            </div>
                            <Grid container>
                                <Grid item xl={10} md={10} sm={12}>
                                    <div style={{padding: 20}}>
                                        {
                                            (executionReport && executionReport._id) ? <PautaDetail 
                                                height={smActivated ? 'calc(100vh - 850px)' :'calc(100vh - 360px)'} 
                                                report={report} 
                                                setProgress={setProgress} 
                                                setIndexGroupToSend={setIndexGroup}
                                                resultThisItemProgress={resultThisItemProgress}
                                                selectionItem={selectionItem}
                                                setUltimoGuardadoDispositivo={setUltimoGuardadoDispositivo}
                                                canEdit={canEdit}
                                                executionReport={executionReport}
                                            /> : 
                                            <div
                                                style={{
                                                    width: '100%',
                                                    lineHeight: smActivated ? 'calc(100vh - 850px)' :'calc(100vh - 360px)',
                                                    height: smActivated ? 'calc(100vh - 850px)' :'calc(100vh - 360px)',
                                                    textAlign: 'center'
                                                }}
                                            >
                                                <p
                                                    style={{
                                                        lineHeight:' 1.5',
                                                        display: 'inline-block',
                                                        verticalAlign: 'middle',
                                                        fontSize: 25
                                                    }}
                                                >Reporte no iniciado</p>
                                            </div>
                                        }
                                    </div>
                                </Grid>
                                {
                                    report && <Grid item xl={2} md={2} sm={12}>
                                    <div style={{marginTop: 20, padding: 20, backgroundColor: '#F9F9F9', borderRadius: 10, height: '71vh', overflowY: 'auto'}}>
                                        <div style={{textAlign: 'center', width: '100%'}}>
                                            <h2 style={{margin: 0}}>OT {id}</h2>
                                            <p style={{margin: 0}}>OM SAP: {sapId && sapId}</p>
                                            <p style={{margin: 0}}>Serie Equipo: {serieEquipo && serieEquipo}</p>
                                            <p style={{margin: 0}}>Tipo de pauta: <strong>{report && report.reportType}</strong></p>
                                            <p style={{backgroundColor: 'red', color: 'white', marginBottom: 0}}><strong>{(report && report.testMode) ? 'Modo test' : ''}</strong></p>
                                            {machineData && <p style={{margin: 0}}>Modelo Máquina {machineData.model}, N°{machineData.equ}</p>}
                                            <br />
                                            {habilite3D && <Button variant="contained" disabled={!habilite3D} style={{paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10}} onClick={()=>{setOpen3D(true)}}><strong>3D</strong></Button>}
                                        </div>
                                        <h4 style={{textAlign: 'center'}}>Avance en esta hoja: {progress}%</h4>
                                        <LinearProgress variant="determinate" value={progress} style={{width: '100%'}}/>
                                        <h4 style={{textAlign: 'center'}}>Avance total: {itemProgress}%</h4>
                                        <LinearProgress variant="determinate" value={itemProgress} style={{width: '100%'}}/>
                                        <br />
                                        {(
                                            (isOperator && (!report.level || report.level === 0)) || 
                                            (isShiftManager && (report.level === 1)) || 
                                            isChiefMachinery && (report.level === 2)
                                            ) && <Button variant="contained" color='primary' style={{padding: 10, width: '100%', marginBottom: 20}} onClick={forwardReport}>
                                            <FontAwesomeIcon icon={faPaperPlane} style={{marginRight: 10}} /> Enviar OT
                                        </Button>}
                                        {((isSapExecutive && report.level===3) || admin)  && <Button variant="contained" color='primary' style={{padding: 10, width: '100%', marginBottom: 20}} onClick={forwardReport}>
                                            <FontAwesomeIcon icon={faPaperPlane} style={{marginRight: 10}} /> Cerrar OT
                                        </Button>
                                        }
                                        {((isSapExecutive && report.level===3) || admin) && <Button variant="contained" color='primary' style={{padding: 10, width: '100%', marginBottom: 20}} onClick={vistaPrevia}>
                                            <FontAwesomeIcon icon={faEye} style={{marginRight: 10}} /> Resumen Insumos/Materiales
                                        </Button>
                                        }
                                        {(
                                            (isShiftManager && (report.level === 1)) || 
                                            isChiefMachinery && (report.level === 2) || 
                                            isSapExecutive && (report.level === 3)
                                            ) &&
                                        <Button variant="contained" color='primary' style={{padding: 10, width: '100%', marginBottom: 20}} onClick={rejectReport}>
                                            <Close />
                                            Rechazar OT
                                        </Button>}
                                        {(isOperator&&(report.level===0 || !report.level)) && <Button onClick={terminarjornada} variant="contained" color='primary' style={{padding: 10, width: '100%', marginBottom: 20}}>
                                            <FontAwesomeIcon icon={faClock} style={{marginRight: 10}} /> Terminar Jornada
                                        </Button>}
                                        <Button variant="contained" color='primary' style={{padding: 10, width: '100%', marginBottom: 0}} onClick={openMessages}>
                                            <FontAwesomeIcon icon={faComment} style={{marginRight: 10}} /> Mensajes de flujo
                                        </Button>
                                    </div>
                                </Grid>
                                }
                            </Grid>
                            {
                                openReportCommitModal && <ReportCommitModal 
                                    canEdit={canEdit}
                                    open={openReportCommitModal} 
                                    closeModal={(toForward) ? closeCommitModalToForward : closeCommitModalToBack}
                                    report={report} 
                                    messageType={messageType}/>
                            }
                            {
                                openMessagesModal && <ReportMessagesModal 
                                    open={openMessagesModal} 
                                    close={closeMessages} 
                                    report={report} />
                            } 
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
            {
                openPreviewModal && <PreviewModal open={openPreviewModal} data={materialesPreview} closePreviewModal={closePreviewModal} />
            }
            {/* 
                loadingLogo && <LoadingLogoModal open={loadingLogo} />
             */}
            {/* {
                open3D && <MVAvatar subSistem={subSistem} />
            } */}
            <Modal
                open={open3D}
                //close={!open}
                //onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styleModal3D/* {height: '100%', width: '70%', backgroundColor: '#333'} */}>
                    {/* <VRAvatar machine={machine}/> */} 
                    <MVAvatar subSistem={subSistem} />
                    {/* <Test /> */}
                    <Fab onClick={() => closeModal()} style={{position: 'absolute', right: 10, top: 10, boxShadow: 'none', backgroundColor: 'transparent'}} color="primary">
                        <Close />
                    </Fab>
                </Box>
                
            </Modal>
        </Box>
    )
}

export default ActivitiesDetailPage
