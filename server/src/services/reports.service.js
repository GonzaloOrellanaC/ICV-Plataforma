import { ExecutionReport, Reports } from "../models"
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
            res.json(createReportState)
        }catch(err) {
            res.json(err)
        } 
    }
}

const editReport = async (req, res) => {
    const { body } = req    
    if (!body.report) {
        throw new Error(errorMsg.missingParameters)
    }else{
        try{
            const editReportState = await Reports.findOneAndUpdate({idIndex: body.report.idIndex}, body.report, {new: false, timestamps: false}) //new Reports(body.report)
            console.log('Respuesta edición reporte =>>>>>', editReportState)
            res.json(editReportState)
        }catch(err) {
            res.json(err)
        }
    }
}

const editReportByIndexIntern = (indexNumber, reportToEdit) => {
    return new Promise(resolve => {
        try {
            Reports.findOneAndUpdate({deleted: false, idIndex: indexNumber}, reportToEdit, (err, report) => {
                resolve(report)
            })
        } catch (err) {

        }
    })
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
            console.log(Object.keys(executionReportData.group))
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
    /* executionReportDataGroupKeys.forEach(async (key, index) => {
        executionReportData.group[key].forEach(item => {
            if (item.messages) {
                item.messages.forEach(async mensaje => {
                    if (mensaje.urlBase64) {
                        const imageData = await AzureServices.uploadImageFromReport(
                                                mensaje.urlBase64,
                                                body.report.idIndex,
                                                key,
                                                mensaje.id
                                            )
                        
                        mensaje.urlImageMessage = imageData.data.url
                        mensaje.urlBase64 = ''
                    }
                })
            }
        })
        if (index == (Object.keys(executionReportData.group).length - 1)) {
            console.log('Nueva data: =====>')
            const response = await executionReportsServices.saveExecutionReportInternal(executionReportData)
            if (response) {
                const editReportState = await Reports.findOneAndUpdate({idIndex: body.report.idIndex}, body.report, {new: false, timestamps: false}) //new Reports(body.report)
                res.json(editReportState)
            }
        }
    }) */
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

const getReports = (req, res) => {
    try {
        Reports.find({deleted: false}, (err, reports) => {
            res.json(reports)
        })
    } catch (err) {
        console.log(err)
    }
}

const getAllReports = () => {
    try {
        Reports.find({}, (err, reports) => {
            reports.forEach(async r => {
                r.deleted = false
                const res = await Reports.findByIdAndUpdate(r._id, r, {new: false, timestamps: false})
                console.log('Respuesta: ', res)
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
    //console.log(body)
    /* try {
        Reports.find({}, (err, reports) => {
            console.log('Reportes', reports)
            res.jason(reports)
        })
    } catch (err) {
        console.log(err)
    } */
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

const getReportsByUser = (req, res) => {
    const { body } = req

    let reportList = new Array()
    try {
        Reports.find({ deleted: false }, (err, reports) => {
            reports.forEach((report, i) => {
                if(report.usersAssigned[0] === body.userId ) {
                    reportList.push(report)
                }
                if(i == (reports.length - 1)) {
                    res.json(reportList)
                }
            })
            
        })
    } catch (err) {
        console.log(err)
    }
}

const findMyAssignations = (req, res) => {
    const { body } = req
    try {
        Reports.find({deleted: false, usersAssigned: [body.userId]}, (err, reports) => {
            res.json(reports)
        })
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

const countTotalReports = () => {
    return new Promise(resolve => {
        Reports.find({}, (err, reports) => {
            resolve(reports.length)
        })
    })
}

const getTotalReportsToIndex = (req, res) => {
    try {
        Reports.find({}, (err, reports) => {
            res.json(reports)
        })
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
    getReportByIndex,
    getReportByGuide,
    getReportByType,
    getReportByState,
    getReportsByUser,
    findMyAssignations,
    getReportByIdpm,
    getReportByEquid,
    getReportsByDateRange,
    getAllReports,
    getTotalReportsToIndex,
    countTotalReportsLength,
    countTotalActivesReportsLength,
    readIfReportIsOneDayToStart,
    editReportByIndexIntern
}