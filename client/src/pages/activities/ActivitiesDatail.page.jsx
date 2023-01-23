import React, { useState, useEffect } from 'react'
import { Box, Card, Grid, Toolbar, IconButton, LinearProgress, Button, Modal, Fab } from '@material-ui/core'
import { ArrowBackIos, Close } from '@material-ui/icons'
import { getExecutionReport, getExecutivesSapEmail, getExecutivesSapId, getMachineData, useStylesTheme, detectIf3DModelExist, translateSubSystem, styleModal3D, dateSimple, dateWithTime, saveExecutionReport } from '../../config'
import { useHistory, useParams } from 'react-router-dom'
import { pautasDatabase, reportsDatabase, readyToSendReportsDatabase, executionReportsDatabase } from '../../indexedDB'
import { MVAvatar, PautaDetail } from '../../containers'
import { executionReportsRoutes, reportsRoutes } from '../../routes'
import { LoadingLogoModal, LoadingModal, ReportCommitModal, ReportMessagesModal } from '../../modals'
import { SocketConnection } from '../../connections'
import sendnotificationToManyUsers from './sendnotificationToManyUsers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faPaperPlane, faComment, faEye } from '@fortawesome/free-solid-svg-icons'
import toPDF from '../../modals/pdf/toPDF'
import PreviewModal from '../../modals/preview/Preview.modal'

const ActivitiesDetailPage = () => {
    const classes = useStylesTheme()
    const history = useHistory()
    const isOperator = Boolean(localStorage.getItem('isOperator'))
    const isSapExecutive = Boolean(localStorage.getItem('isSapExecutive'))
    const isShiftManager = Boolean(localStorage.getItem('isShiftManager'))
    const isChiefMachinery = Boolean(localStorage.getItem('isChiefMachinery'))
    const {id} = useParams()
    const [ pauta, setPauta ] = useState()
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
    const [ machineData, setMachineDtaa ] = useState()
    const [ habilite3D, setHabilite3D ] = useState(false)
    const [ subSistem, setSubSistem ] = useState()
    const [ open3D, setOpen3D ] = useState(false)
    const [ ultimoGuardadoDispositivo, setUltimoGuardadoDispositivo ] = useState()
    const [openPreviewModal, setOpenPreviewModal] = useState(false)
    const [materialesPreview, setMaterialesPreview] = useState()

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
        if(isOperator || (localStorage.getItem('role') === 'inspectionWorker')||(localStorage.getItem('role') === 'maintenceOperator')) {
            setCanSendReport(false)
        }else{
            setCanSendReport(true)
        }
        setLoadingLogo(true)
        if(navigator.onLine) {
            initData()
        }else{
            const db = await reportsDatabase.initDbReports()
            const {database} = db
            const list = await reportsDatabase.consultar(database)
            const reportFiltered = list.filter(item => {if(Number(item.idIndex) == id){return item}})
            let report = reportFiltered[0]
            getPauta(report)
            if(!report.level) {
                report.level = 0
            }
            getMachineData(report.machine)
            .then(data => {
                console.log(data[0])
                setMachineDtaa(data[0])
            })
            setReportAssigned(report)
            setReportLevel(report.level)
            let myReportLevel
            if((isOperator && report.level===0) || (localStorage.getItem('role') === 'inspectionWorker')||(localStorage.getItem('role') === 'maintenceOperator')) {
                myReportLevel = 0
            }else if(localStorage.getItem('role') === 'shiftManager'||(isShiftManager && report.level===1)) {
                myReportLevel = 1
            }else if(localStorage.getItem('role') === 'chiefMachinery'||(isChiefMachinery && report.level===2)) {
                myReportLevel = 2
            }else if(localStorage.getItem('role') === 'sapExecutive'||(isSapExecutive && report.level===3)) {
                myReportLevel = 3
            }
            if(myReportLevel === report.level) {
                setCanEdit(true)
            }
            console.log(report)
        }
    }, [])

    const initData = () => {
        reportsRoutes.getReportByIndex(id).then(r => {
            let report = r.data
            console.log(report)
            getPauta(report)
            if(!report.level) {
                report.level = 0
            }
            getMachineData(report.machine)
            .then(data => {
                console.log(data[0])
                setMachineDtaa(data[0])
            })
            setReportAssigned(report)
            setReportLevel(report.level)
            console.log(report)
            let myReportLevel
            if((isOperator && report.level===0) || (localStorage.getItem('role') === 'inspectionWorker')||(localStorage.getItem('role') === 'maintenceOperator')) {
                myReportLevel = 0
            }else if(localStorage.getItem('role') === 'shiftManager'||(isShiftManager && report.level===1)) {
                myReportLevel = 1
            }else if(localStorage.getItem('role') === 'chiefMachinery'||(isChiefMachinery && report.level===2)) {
                myReportLevel = 2
            }else if((isSapExecutive && report.level===3) || localStorage.getItem('role') === 'sapExecutive' || localStorage.getItem('role') === 'admin' || localStorage.getItem('role') === 'superAdmin') {
                myReportLevel = 3
            }
            console.log(myReportLevel)
            if(myReportLevel === report.level) {
                setCanEdit(true)
                setCanRejectReport(true)
            }
        })
    }

    const getPauta = async (report) => {
        let db = await pautasDatabase.initDbPMs()
        /* let report = r */
        let pautaIdpm = report.idPm
        setReportAssignment(report.usersAssigned[0])
        let pautas = await pautasDatabase.consultar(db.database)
        let pautaFiltered = pautas.filter((info) => { 
            if(
                (info.typepm === report.guide)&&(report.idPm===info.idpm)||
                (info.typepm === report.guide)&&(pautaIdpm===info.idpm)
                ) {
                    return info
                }})
        console.log('Pauta: ', pautaFiltered[0])
        setPauta(pautaFiltered[0])
        if (pautaFiltered[0]) {
            setTimeout(() => {
                setLoadingLogo(false)
            }, 1000)
        }
    }

    const setProgress = (value) => {
        resutProgress(value)
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
        setLoading(true)
        setLoadingMessage('Espere...')
        let group = new Array()
        let state = true
        const db = await executionReportsDatabase.initDb()
        const data = await executionReportsDatabase.consultar(db.database)
        const executionReportFiltered = data.filter((execution) => {
                                            if(execution.reportId === reportAssigned._id) {
                                                return execution
                                            }
                                        })
        let executionReportData = {
            data: null,
            state: null
        }
        if(
            isOperator ||
            localStorage.getItem('role')==='inspectionWorker' || 
            localStorage.getItem('role')==='maintenceOperator'
        ) {
            executionReportData.data = executionReportFiltered[0]
            executionReportData.state = true
            await executionReportsRoutes.saveExecutionReport(executionReportFiltered[0])
        } else {
            executionReportData = await getExecutionReport(reportAssigned._id)
        }
        group = Object.values(executionReportData.data.group)
        if(navigator.onLine) {
            syncData(true).then(() => {
                if(
                    (isSapExecutive && (reportLevel===3)) ||
                    (localStorage.getItem('role') === 'sapExecutive')||
                    (localStorage.getItem('role') === 'admin')||
                    (localStorage.getItem('role') === 'superAdmin')
                ) {
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
            })
        }else{
            /* setLoadingLogo(true) */
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
                if(!i.isChecked) {
                    state = false
                }
                if(reportAssigned.testMode) {

                }
                if(n == (item.length - 1)) {
                    if(index == (group.length - 1)) {
                        if (state) {
                            if( send ) {
                                responseMessage()
                            } else {
                                saveDataLocal()
                            }
                        } else {
                            alert('Debe completar la pauta totalmente para enviar a revisión.')
                            setLoading(false)
                        }
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
        setOpenReportCommitModal(true)
    }

    const sendToNext = async (okToSend, reportData) => {
        if(okToSend) {
            if(confirm('Se enviará información. ¿Desea confirmar?')) {
                setLoading(true)
                let report
                if(reportData) {
                    report = reportData
                }else{
                    report = JSON.parse(id)
                }
                let db = await readyToSendReportsDatabase.initDb()
                let response = await readyToSendReportsDatabase.eliminar(report.idIndex, db.database)
                report.level = report.level + 1
                report.fullNameWorker = `${localStorage.getItem('name')} ${localStorage.getItem('lastName')}`
                if(
                    (isSapExecutive && (reportLevel===3)) ||
                    (localStorage.getItem('role') === 'sapExecutive')||
                    (localStorage.getItem('role') === 'admin')||
                    (localStorage.getItem('role') === 'superAdmin')
                ) {
                    setTimeout(async () => {
                        setLoadingMessage('Generando documento...')
                        const response = await toPDF(report, machineData, setLoadingMessage)
                        if (response.state) {
                            setTimeout(() => {
                                setLoadingMessage('Guardando base de datos...')
                                setTimeout(() => {
                                    /* setLoading(false) */
                                    continueToSendReport(report)
                                }, 1000);
                            }, 1000);
                        } else {
                            if (response.message) {
                                setLoading(false)
                                alert(response.message)
                            } else {
                                setLoading(false)
                                alert('Error al generar documento PDF. Intente nuevamente. De lo contrario contacte al administrador de la plataforma. OT se cerrará de todas formas.')
                                continueToSendReport(report)
                            }
                        }
                    }, 1000);
                } else {
                    continueToSendReport(report)
                }
            }else{
                setLoading(false)
            }
        }else{
            alert('Orden no se encuantra finalizada. Revise e intente nuevamente.')
            setLoadingMessage('Retrocediendo...')
            setTimeout(() => {
                setLoading(false)
            }, 1000)
        }
    }

    const continueToSendReport = async (report) => {
        if(report.level === 1) {
            report.emailing = "termino-orden-1"
            report.endReport = Date.now()
            report.endReport = report.endReport
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
            report.emailing = "termino-orden-2"
            report.shiftManagerApprovedBy = localStorage.getItem('_id')
            report.shiftManagerApprovedDate = Date.now()
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
            report.emailing = "termino-orden-3"
            report.state = 'Por cerrar'
            report.chiefMachineryApprovedBy = localStorage.getItem('_id')
            report.chiefMachineryApprovedDate = Date.now()
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
            report.emailing = "termino-orden-4"
            report.state = 'Completadas'
            report.enabled = false
            report.dateClose = Date.now()
            report.sapExecutiveApprovedBy = localStorage.getItem('_id')
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
    }

    const sendToBack = async (report) => {
        setLoading(true)
        let ejecutor = new String()
        if(isShiftManager || localStorage.getItem('role')==='shiftManager') {
            ejecutor = 'ejecutor'
        }else if(isChiefMachinery || localStorage.getItem('role')==='chiefMachinery') {
            ejecutor = 'jefe de turno'
        }else if((isSapExecutive && reportLevel === 3) || localStorage.getItem('role')==='sapExecutive') {
            ejecutor = 'jefe de maquinaria'
        }
        if(confirm(`Devolverá la información al ${ejecutor}. ¿Desea confirmar?`)) {
            report.level = report.level - 1
            report.fullNameWorker = `${localStorage.getItem('name')} ${localStorage.getItem('lastName')}`
            if(report.level === 0) {
                report.emailing = "rechazo-orden-0"
                sendnotificationToManyUsers(report.emailing, report.idIndex, report.history[report.history.length - 1].userSendingData)
                let res = await reportsRoutes.editReport(report)
                if(res) {
                    setTimeout(() => {
                        setLoading(false)
                        history.goBack()
                    }, 1000)
                }
            }else if(report.level === 1) {
                report.emailing = "rechazo-orden-1"
                sendnotificationToManyUsers(report.emailing, report.idIndex, report.history[report.history.length - 1].userSendingData)
                let res = await reportsRoutes.editReport(report)
                if(res) {
                    setTimeout(() => {
                        setLoading(false)
                        history.goBack()
                    }, 1000)
                }
            }else if(report.level === 2) {
                report.emailing = "rechazo-orden-2"
                sendnotificationToManyUsers(report.emailing, report.idIndex, report.history[report.history.length - 1].userSendingData)
                let res = await reportsRoutes.editReport(report)
                if(res) {
                    setTimeout(() => {
                        setLoading(false)
                        history.goBack()
                    }, 1000)
                }
            } else {
                alert('Error al leer los niveles del reporte. Debe ser reparado por el administrador del servicio.')
            }
        }
    }

    const nextActivity =  (report) => {
        return new Promise(async resolve => {
            const emails = await getExecutivesSapEmail(report.level)
            report.emailsToSend = emails
            setTimeout(async () => {
                const generateLink=`/activities/${id}`
                const r = await reportsRoutes.editReportFromAudit(report, generateLink)
                if(r) {
                    alert('Información enviada')
                    setTimeout(() => {
                        resolve(true)
                    }, 500)
                }else{
                    resolve(false)
                }
            }, 1000)
        })
    }
 
    const terminarjornada = () => {
        if(navigator.onLine) {
            syncData(true).then(async () => {
                setLoading(true)
                setLoadingMessage('Terminando su jornada')
                const report = reportAssigned
                const emails = await getExecutivesSapEmail(reportLevel)
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
                    )
                    if(index == (ids.length - 1)) {
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
            })
        }else{
            alert('Dispositivo no está conectado a internet. Conecte a una red e intente nuevamente')
        }
    }

    const syncData = (execution) => {
        return new Promise(async resolve => {
            try {
                if (!execution) {
                    setLoadingLogo(true)
                }
                const db = await executionReportsDatabase.initDb()
                const data = await executionReportsDatabase.consultar(db.database)
                const executionReportFiltered = data.filter((execution) => {
                                                    if(execution.reportId === reportAssigned._id) {
                                                        return execution
                                                    }
                                                })
                const restore = await executionReportsRoutes.saveExecutionReport(executionReportFiltered[0])
                console.log(restore)
                if (restore) {
                    setLoadingLogo(false)
                    resolve('ok')
                    if (navigator.onLine) {
                        initData()
                    }
                }
            } catch (error) {
                setLoadingLogo(false)
            }
        })
    }

    const closeCommitModal = () => {
        setOpenReportCommitModal(false)
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
        if (reportLevel>3) {
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
                                                height={smActivated ? 'calc(100vh - 850px)' :'55vh'} 
                                                reportAssigned={reportAssigned} 
                                                pauta={pauta} 
                                                reportLevel={reportLevel} 
                                                reportAssignment={reportAssignment} 
                                                setProgress={setProgress} 
                                                setIndexGroupToSend={setIndexGroup}
                                                resultThisItemProgress={resultThisItemProgress}
                                                selectionItem={selectionItem}
                                                setUltimoGuardadoDispositivo={setUltimoGuardadoDispositivo}
                                                />
                                        }
                                    </div>
                                </Grid>
                                <Grid item xl={2} md={2} sm={12}>
                                    <div style={{marginTop: 20, padding: 20, backgroundColor: '#F9F9F9', borderRadius: 10, height: '71vh', overflowY: 'auto'}}>
                                        <div style={{textAlign: 'center', width: '100%'}}>
                                            <h2 style={{margin: 0}}>OT {id}</h2>
                                            <p style={{margin: 0}}>Último guardado en dispositivo: {dateWithTime(ultimoGuardadoDispositivo)}</p>
                                            <p style={{margin: 0}}>Tipo de pauta: <strong>{pauta && pauta.typepm}</strong></p>
                                            <p style={{backgroundColor: 'red', color: 'white', marginBottom: 0}}><strong>{reportAssigned && reportAssigned.testMode ? 'Modo test' : ''}</strong></p>
                                            {machineData && <p style={{margin: 0}}>Máquina: {machineData.brand}, modelo {machineData.model}, N°{machineData.equ}</p>}
                                            <br />
                                            {habilite3D && <Button variant="contained" disabled={!habilite3D} style={{paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10}} onClick={()=>{setOpen3D(true)}}><strong>3D</strong></Button>}
                                        </div>
                                        <h4 style={{textAlign: 'center'}}>Avance en esta hoja: {progress.toFixed(0)}%</h4>
                                        <LinearProgress variant="determinate" value={progress} style={{width: '100%'}}/>
                                        <h4 style={{textAlign: 'center'}}>Avance total: {itemProgress.toFixed(0)}%</h4>
                                        <LinearProgress variant="determinate" value={itemProgress} style={{width: '100%'}}/>
                                        <br />
                                        {(isOperator || isShiftManager || isChiefMachinery || (localStorage.getItem('role') === 'inspectionWorker')||(localStorage.getItem('role') === 'maintenceOperator')||(localStorage.getItem('role') === 'shiftManager')||(localStorage.getItem('role') === 'chiefMachinery')) && <Button disabled={!canEdit} variant="contained" color='primary' style={{padding: 10, width: '100%', marginBottom: 20}} onClick={()=>{endReport()}}>
                                            <FontAwesomeIcon icon={faPaperPlane} style={{marginRight: 10}} /> Enviar OT
                                        </Button>}
                                        {((isSapExecutive && reportLevel===3) || localStorage.getItem('role') === 'sapExecutive' || localStorage.getItem('role') === 'admin' || localStorage.getItem('role') === 'superAdmin') && <Button disabled={!canEdit} variant="contained" color='primary' style={{padding: 10, width: '100%', marginBottom: 20}} onClick={()=>{endReport()}}>
                                            <FontAwesomeIcon icon={faPaperPlane} style={{marginRight: 10}} /> Cerrar OT
                                        </Button>
                                        }
                                        {((isSapExecutive && reportLevel===3) || localStorage.getItem('role') === 'sapExecutive' || localStorage.getItem('role') === 'admin' || localStorage.getItem('role') === 'superAdmin') && <Button /* disabled={!canEdit} */ variant="contained" color='primary' style={{padding: 10, width: '100%', marginBottom: 20}} onClick={vistaPrevia}>
                                            <FontAwesomeIcon icon={faEye} style={{marginRight: 10}} /> Resumen Insumos/Materiales
                                        </Button>
                                        }
                                        {(localStorage.getItem('role') === 'admin' || localStorage.getItem('role') === 'superAdmin') && <Button /* disabled={!canEdit}  */variant="contained" color='primary' style={{padding: 10, width: '100%', marginBottom: 20}} onClick={()=>{syncData()}}>
                                            <FontAwesomeIcon icon={faPaperPlane} style={{marginRight: 10}} /> Sincronizar
                                        </Button>
                                        }
                                        {!(isOperator || (localStorage.getItem('role') === 'inspectionWorker')||(localStorage.getItem('role') === 'maintenceOperator')) && 
                                        <Button disabled={!canSendReport || !canRejectReport} variant="contained" color='primary' style={{padding: 10, width: '100%', marginBottom: 20}} onClick={()=>{rejectReport()}}>
                                            <Close />
                                            Rechazar OT
                                        </Button>}
                                        {((isOperator || (localStorage.getItem('role') === 'inspectionWorker')||(localStorage.getItem('role') === 'maintenceOperator'))&&(reportLevel===0)) && <Button onClick={()=>{terminarjornada()}} variant="contained" color='primary' style={{padding: 10, width: '100%', marginBottom: 20}}>
                                            <FontAwesomeIcon icon={faClock} style={{marginRight: 10}} /> Terminar Jornada
                                        </Button>}
                                        <Button variant="contained" color='primary' style={{padding: 10, width: '100%', marginBottom: 0}} onClick={()=>{openMessages()}}>
                                            <FontAwesomeIcon icon={faComment} style={{marginRight: 10}} /> Mensajes de flujo
                                        </Button>
                                    </div>
                                </Grid>
                            </Grid>
                            {
                                openReportCommitModal && <ReportCommitModal open={openReportCommitModal} closeLoading={closeLoading} closeModal={closeCommitModal} report={reportAssigned} getResponseState={getResponseState} messageType={messageType}/>
                            }
                            {
                                openMessagesModal && <ReportMessagesModal open={openMessagesModal} close={closeMessages} report={reportAssigned} />
                            }
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
            {
                openPreviewModal && <PreviewModal open={openPreviewModal} data={materialesPreview} closePreviewModal={closePreviewModal} />
            }
            {
                <LoadingModal open={loading} withProgress={false} loadingData={loadingMessage} />
            }
            {
                loadingLogo && <LoadingLogoModal open={loadingLogo} />
            }
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