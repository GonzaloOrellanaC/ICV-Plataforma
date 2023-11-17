import { ExecutionReport, Machine, Reports } from "../models"
import { environment } from '../config'
const { error: errorMsg, success: successMsg } = environment.messages.services.user
import fetch from 'node-fetch'
import https from 'https'
import { AzureServices, EmailMailgunServices, EmailServices, ExecutionReportsServices } from "."
import executionReportsServices from "./executionReports.services"

const myHeaders = {
    'Authorization': 'Token ' + environment.icvApi.token,
    'Content-Type': 'application/json'
}
const agentOptions = {
    rejectUnauthorized: false
}
  
const agent = new https.Agent(agentOptions)

const createReport = async (req, res) => {
    const { body } = req
    if (!body.report) {
        throw new Error(errorMsg.missingParameters)
    }else{
        body.report.idIndex = await countTotalReports()
        const createReportState = new Reports(body.report)
        try{
            await createReportState.save()
            const machineData = await Machine.findOne({equid: createReportState.machine})
            if (machineData) {
                let newReport = {
                    _id: createReportState._id,
                    level: createReportState.level,
                    createdAt: createReportState.createdAt,
                    createdBy: createReportState.createdBy,
                    datePrev: createReportState.datePrev,
                    deleted: createReportState.deleted,
                    enabled: createReportState.enabled,
                    endPrev: createReportState.endPrev,
                    guide: createReportState.guide,
                    history: createReportState.history,
                    idIndex: createReportState.idIndex,
                    idPm: createReportState.idPm,
                    machine: createReportState.machine,
                    reportType: createReportState.reportType,
                    sapId: createReportState.sapId,
                    site: createReportState.site,
                    state: createReportState.state,
                    testMode: createReportState.testMode,
                    updatedAt: createReportState.updatedAt,
                    updatedBy: createReportState.updatedBy,
                    usersAssigned: createReportState.usersAssigned,
                    machineData: machineData,
                    urlPdf:createReportState.urlPdf,
                    sapExecutiveApprovedBy:createReportState.sapExecutiveApprovedBy,
                    dateClose:createReportState.dateClose,
                    chiefMachineryApprovedDate:createReportState.chiefMachineryApprovedDate,
                    chiefMachineryApprovedBy:createReportState.chiefMachineryApprovedBy,
                    shiftManagerApprovedDate:createReportState.shiftManagerApprovedDate,
                    shiftManagerApprovedBy:createReportState.shiftManagerApprovedBy,
                    endReport: createReportState.endReport,
                    dateInit: createReportState.dateInit,
                    isAutomatic: false,
                    origen: true
                }
                res.json(newReport)
            }
        }catch(err) {
            res.json(err)
        } 
    }
}

const editReport = async (req, res) => {
    /* console.log(req.body) */
    const { body } = req    
    if (!body.report) {
        throw new Error(errorMsg.missingParameters)
    }else{
        try{
            const editReportState = await Reports.findOneAndUpdate({idIndex: body.report.idIndex}, body.report, {new: false, timestamps: false}) //new Reports(body.report)
            res.json(editReportState)
        }catch(err) {
            res.json(err)
        }
    }
}

const editReportById = async (req, res) => {
    const { body } = req    
    if (!body.report) {
        throw new Error(errorMsg.missingParameters)
    }else{
        try{
            const editReportState = await Reports.findByIdAndUpdate(body.report._id, body.report, {new: false, timestamps: false}) //new Reports(body.report)
            res.json(editReportState)
        }catch(err) {
            res.json(err)
        }
    }
}

const editReportByIndexIntern = async (indexNumber, reportToEdit) => {
    const response = await Reports.findOneAndUpdate({deleted: false, idIndex: indexNumber}, reportToEdit)
    return response
    /* return new Promise(resolve => {
        try {
            Reports.findOneAndUpdate({deleted: false, idIndex: indexNumber}, reportToEdit, (err, report) => {
                resolve(report)
            })
        } catch (err) {

        }
    }) */
}

const editReportFromAudit = async (req, res) => {
    const { body } = req
    if (!body.report) {
        throw new Error(errorMsg.missingParameters)
    }else{
        try{
            if(body.report.emailing) {
                if(body.report.emailing === 'termino-jornada') {
                    EmailMailgunServices.sendEmailEndOfWork('endOfWork', body.report.fullNameWorker, 'es', body.report.idIndex, body.report.emailsToSend)
                }else if(body.report.emailing === 'termino-orden-1') {
                    EmailMailgunServices.sendEmailEndOfOrder('endOfOrder', 1, body.report.fullNameWorker, 'es', body.report.idIndex, body.report.emailsToSend, '---', `${environment.mailApi.domain}${body.generateLink}`)
                }else if(body.report.emailing === 'termino-orden-2') {
                    EmailMailgunServices.sendEmailEndOfOrder('endOfOrder', 2, body.report.fullNameWorker, 'es', body.report.idIndex, body.report.emailsToSend, body.report.shiftManagerApprovedCommit, `${environment.mailApi.domain}${body.generateLink}`)
                }else if(body.report.emailing === 'termino-orden-3') {
                    EmailMailgunServices.sendEmailEndOfOrder('endOfOrder', 3, body.report.fullNameWorker, 'es', body.report.idIndex, body.report.emailsToSend, body.report.chiefMachineryApprovedCommit, `${environment.mailApi.domain}${body.generateLink}`)
                }else if(body.report.emailing === 'termino-orden-4') {
                    EmailMailgunServices.sendEmailEndOfOrder('closeOrder', 4, body.report.fullNameWorker, 'es', body.report.idIndex, body.report.emailsToSend, body.report.sapExecutiveApprovedCommit, `${environment.mailApi.domain}${body.generateLink}`)
                }
            }
            /* console.log(body.report) */
            const executionReportData = await ExecutionReportsServices.getExecutionReportByIdInternal(body.report._id)
            /* console.log(Object.keys(executionReportData.group)) */
            Object.keys(executionReportData.group).forEach(async (key, index) => {
                executionReportData.group[key].forEach(item => {
                    if (item.messages) {
                        item.messages.forEach(async (mensaje, i) => {
                            if (mensaje.urlBase64) {
                                if (mensaje.urlBase64.length > 0) {
                                    const imageData = await AzureServices.uploadImageFromReport(
                                        mensaje.urlBase64,
                                        body.report.idIndex,
                                        key,
                                        mensaje.id
                                    )
                                    mensaje.urlImageMessage = imageData.data.url
                                    mensaje.urlBase64 = ''
                                }
                            }
                            await executionReportsServices.saveExecutionReportInternal(executionReportData)
                            if (i === (item.messages.length - 1)) {
                                /* const response =  */
                            }
                        })
                    }
                })
                if (index == (Object.keys(executionReportData.group).length - 1)) {
                    console.log('Nueva data: =====>')
                    /* res.json({state: true}) */
                    const editReportState = await Reports.findOneAndUpdate({idIndex: body.report.idIndex}, body.report, {new: false, timestamps: false}) //new Reports(body.report)
                    res.json(editReportState)
                }
            })
        }catch(err) {
            res.json(err)
        }
    }
}

const saveExecutionReportData = (
    executionReportDataGroupKeys = new Array(), 
    executionReportDataGroup = new Array(), 
    n = new Number(), 
    report = new Object(), 
    res) => {
        if (n === (executionReportDataGroupKeys.length - 1)) {

        } else {
            executionReportDataGroup[executionReportDataGroupKeys[n]].messages.forEach()
        }
}

const deleteReport = async (req, res) => {
    const { id } = req.body
    if (!id) {
        throw new Error(errorMsg.missingParameters)
    }else{
        try{
            const deleted = await Reports.findByIdAndDelete(id)
            if (!deleted) {
                res.json({
                    message: 'Orden no encontrada'
                })
            }
            const deleteExecution = await ExecutionReport.findOneAndDelete({reportId: id})
            if (!deleteExecution) {
                res.json({
                    message: 'Error en sistema'
                })
            }
            res.json({
                message: 'Orden eliminada'
            })
        }catch(err) {
            res.json(err)
        }
    }
    
}

const getReports = async (req, res) => {
    try {
        const reports = await Reports.find({deleted: false})
        if (reports.length > 0) {
            const reportsToSend = []
            const n = 0
            addMachineData(reports, reportsToSend, n, res)
        }
    } catch (err) {
        console.log(err)
    }
}



const addMachineData = async (reports, reportsToSend, n, res) => {
    if ((reports.length) === n) {
        console.log('Total reportes: ', reports.length)
        res.json(reportsToSend)
    } else {
        const machineData = await Machine.findOne({equid: reports[n].machine})
        if (machineData) {
            let newReport = {
                _id: reports[n]._id,
                level: reports[n].level,
                createdAt: reports[n].createdAt,
                createdBy: reports[n].createdBy,
                datePrev: reports[n].datePrev,
                deleted: reports[n].deleted,
                enabled: reports[n].enabled,
                endPrev: reports[n].endPrev,
                guide: reports[n].guide,
                history: reports[n].history,
                idIndex: reports[n].idIndex,
                idPm: reports[n].idPm,
                machine: reports[n].machine,
                reportType: reports[n].reportType,
                sapId: reports[n].sapId,
                site: reports[n].site,
                state: reports[n].state,
                testMode: reports[n].testMode,
                updatedAt: reports[n].updatedAt,
                updatedBy: reports[n].updatedBy,
                usersAssigned: reports[n].usersAssigned,
                machineData: machineData,
                urlPdf:reports[n].urlPdf,
                sapExecutiveApprovedBy:reports[n].sapExecutiveApprovedBy,
                dateClose:reports[n].dateClose,
                chiefMachineryApprovedDate:reports[n].chiefMachineryApprovedDate,
                chiefMachineryApprovedBy:reports[n].chiefMachineryApprovedBy,
                shiftManagerApprovedDate:reports[n].shiftManagerApprovedDate,
                shiftManagerApprovedBy:reports[n].shiftManagerApprovedBy,
                endReport: reports[n].endReport,
                dateInit: reports[n].dateInit,
                description: reports[n].description,
                isAutomatic: reports[n].isAutomatic,
                progress: reports[n].progress,
                origen: reports[n].origen
            }
            reportsToSend.push(newReport)
            n = n + 1
            addMachineData(reports, reportsToSend, n, res)
        }
    }
}

const getAllReports = () => {
    try {
        Reports.find({}, (err, reports) => {
            reports.forEach(async r => {
                r.deleted = false
                const res = await Reports.findByIdAndUpdate(r._id, r, {new: false, timestamps: false})
                /* console.log('Respuesta: ', res) */
            })
        })
    } catch (err) {
        console.log(err)
    }
}

const getReportByGuide = (req, res) => {
    const { body } = req
}

const readIfReportIsOneDayToStart = () => {
    return new Promise(async resolve => {
        const dateNow = Date.now()
        const dateMax = Date.now() - (86400000 * 1)
        const response = await Reports.find({deleted: false, enabled: true, datePrev: { $gte: new Date(dateMax), $lt: new Date(dateNow) }})
        resolve(
            response
        )
    })
}

const readIfReportIsStartingLate = () => {
    return new Promise(async resolve => {
        const dateNow = Date.now()
        const dateMax = Date.now() + (86400000 * 1)
        const response = await Reports.find({deleted: false, enabled: true, datePrev: { $gte: new Date(dateNow) , $lt: new Date(dateNow) }})
        resolve(
            response
        )
    })
}

const getReportsByDateRange = (req, res) => {
    const { body } = req
    let dateInit = body.dateInit
    let dateEnd = body.dateEnd
    let reportType = body.reportType
    try {
        Reports.find({ deleted: false, dateClose: { $gte: new Date(dateInit) , $lt: new Date(dateEnd) },  reportType: reportType }, (err, reports) => {
            if(err) {
                console.log('El error es: ', err)
            }
            res.send(reports)
        })
    } catch (err) {
        console.log('ERRRRRRR',err)
    }   
}

const getReportsByDateRangeAndSite = (req, res) => {
    const { body } = req
    let dateInit = body.dateInit
    let dateEnd = body.dateEnd
    let reportType = body.reportType
    let idobra = body.site
    try {
        Reports.find({ site: idobra, deleted: false, dateClose: { $gte: new Date(dateInit) , $lt: new Date(dateEnd) },  reportType: reportType }, (err, reports) => {
            if(err) {
                console.log('El error es: ', err)
            }
            res.send(reports)
        })
    } catch (err) {
        console.log('ERRRRRRR',err)
    }   
}

const getReportById = (req, res) => {
    const { body } = req
    const { _id } = body
    console.log('El id: ', _id)
    try {
        Reports.findById(_id, (err, report) => {
            /* console.log(report) */
            res.json(report)
        })
    } catch (err) {

    }
}

const getReportByIndex = (req, res) => {
    const { body } = req
    const { indexNumber } = body
    try {
        Reports.findOne({deleted: false, idIndex: indexNumber}, (err, report) => {
            res.json(report)
        })
    } catch (err) {

    }
}

const getReportByType = (req, res) => {
    const { body } = req
    
}

const getReportByState = (req, res) => {
    const { body } = req
    try {
        Reports.find({ deleted: false, state: body.state, reportType: body.reportType }, (err, reports) => {

            res.json(reports)
        })
    } catch (err) {
        console.log(err)
    }
}

const getReportByStateAndSite = (req, res) => {
    const { body } = req
    try {
        Reports.find({ site: body.site, deleted: false, state: body.state, reportType: body.reportType }, (err, reports) => {

            res.json(reports)
        })
    } catch (err) {
        console.log(err)
    }
}

const getReportsByUser = async (req, res) => {
    const { body } = req

    let reportList = new Array()
    try {
        Reports.find({ deleted: false }, (err, reports) => {
            reports.forEach((report, i) => {
                if(report.usersAssigned[0] === body.userId ) {
                    reportList.push(report)
                }
                if(i == (reports.length - 1)) {
                    /* res.json(reportList) */
                    const reportsToSend = []
                    const n = 0
                    addMachineData(reportList, reportsToSend, n, res)        
                }
            })
        })
    } catch (err) {
        console.log(err)
    }
}

const findMyAssignations = async (req, res) => {
    const { body: {site, userId} } = req
    /* console.log(site, userId) */
    try {
        const response = await Reports.find({
            site: site,
            deleted: false,
            usersAssigned: {
                $in: [userId]
            },
            state: 'En proceso'
        }).populate('usersAssigned').populate('createdBy').populate('updatedBy')
        const reportsToSend = []
        const n = 0
        addMachineData(response, reportsToSend, n, res)  
        /* console.log(response)
        res.json(response) */
        /* Reports.find({site: body.site, deleted: false, usersAssigned: [body.userId]}, (err, reports) => {
            res.json(reports)
        }) */
    } catch (err) {

    }
}

const getReportByIdpm = async (req, res) => {
    const { body : { idpm } } = req
    const response = await fetch(`${environment.icvApi.url}pmtype?pIDPM=${idpm}`, {
        /* myHeaders */
        headers: myHeaders,
        method: 'GET',
        agent: agent
    })
    const pmResponse =  await response.json()
    res.send(pmResponse.data)
}

/* 

ljedcbnkjsde cbjklcsbkjds ckjsd cksj ckjsd cjks ckjds
*/

const getAllReportsbySite = async (req, res) => {
    const { body : { site } } = req
    try {
        const reports = await Reports.find({deleted: false, site: site})
        if (reports.length > 0) {
            const reportsToSend = []
            const n = 0
            addMachineData(reports, reportsToSend, n, res)
        }
    } catch (err) {
        console.log(err)
    }
}

const getReportByEquid = async (req, res) => {
    const { body : { equid } } = req
    try {
        Reports.find({ deleted: false, machine: equid }, (err, reports) => {
            res.json(reports)
        })
    } catch (err) {
        console.log(err)
    }
}

const countTotalReports = async () => {
    /* return new Promise(resolve => { */
        const response = await Reports.find({})
        const order = response.sort((a, b) => {
            return b.idIndex - a.idIndex
        })
        /* console.log(order[0].idIndex) */
        return order[0].idIndex + 1
        /* Reports.find({}, (err, reports) => {
            reports.sort((a, b) => {
                return new Date(b.updatedAt) - new Date(a.updatedAt)
            })
            resolve(reports.length)
        })
    }) */
}

const getTotalReportsToIndex = async (req, res) => {
    try {
        const response = await Reports.find({})
        const order = response.sort((a, b) => {
            return b.idIndex - a.idIndex
        })
        /* console.log(order[0].idIndex) */
        res.json(order[0].idIndex + 1)
        /* Reports.find({}, (err, reports) => {
            res.json(reports.length)
        }) */
    } catch (err) {
        console.log(err)
    }
}

const countTotalReportsLength = (req, res) => {
    try {
        Reports.count({}, (err, result) => {
            res.json(result)
        })
    } catch (err) {
        console.log(err)
    }
}

const countTotalActivesReportsLength = (req, res) => {
    try {
        Reports.count({deleted: false}, (err, result) => {
            res.json(result)
        })
    } catch (err) {
        console.log(err)
    }
}


export default {
    createReport,
    editReport,
    editReportFromAudit,
    deleteReport,
    getReports,
    getReportById,
    getReportByIndex,
    getReportByGuide,
    getReportByType,
    getReportByState,
    getReportByStateAndSite,
    getReportsByUser,
    findMyAssignations,
    getAllReportsbySite,
    getReportByIdpm,
    getReportByEquid,
    getReportsByDateRange,
    getReportsByDateRangeAndSite,
    getAllReports,
    getTotalReportsToIndex,
    countTotalReports,
    countTotalReportsLength,
    countTotalActivesReportsLength,
    readIfReportIsOneDayToStart,
    editReportByIndexIntern,
    editReportById
}