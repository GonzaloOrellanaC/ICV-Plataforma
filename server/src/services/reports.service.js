import { ExecutionReport, Reports } from "../models";
import { environment } from '../config'
const { error: errorMsg, success: successMsg } = environment.messages.services.user
import fetch from 'node-fetch'
import { EmailMailgunServices, EmailServices } from ".";

const createReport = async (req, res) => {
    const { body } = req
    //console.log(body)
    
    if (!body.report) {
        throw new Error(errorMsg.missingParameters)
    }else{
        body.report.idIndex = await countTotalReports()
        const createReportState = new Reports(body.report);
        try{
            await createReportState.save()
            res.json(createReportState);
        }catch(err) {
            res.json(err);
        } 
    }
}

const editReport = async (req, res) => {
    const { body } = req
    console.log('Edición reporte =>>>>>', body)
    
    if (!body.report) {
        throw new Error(errorMsg.missingParameters)
    }else{
        try{
            const editReportState = await Reports.findOneAndUpdate({idIndex: body.report.idIndex}, body.report, {new: false, timestamps: false}) //new Reports(body.report);
            console.log('Respuesta edición reporte =>>>>>', editReportState);
            res.json(editReportState)
        }catch(err) {
            res.json(err);
        }
    }
    
}

const editReportFromAudit = async (req, res) => {
    const { body } = req
    //'Edición reporte =>>>>>', body)
    
    if (!body.report) {
        throw new Error(errorMsg.missingParameters)
    }else{
        try{
            if(body.report.emailing) {
                if(body.report.emailing === 'termino-jornada') {
                    EmailMailgunServices.sendEmailEndOfWork('endOfWork', body.report.fullNameWorker, 'es', body.report.idIndex, body.report.emailsToSend)
                }else if(body.report.emailing === 'termino-orden-1') {
                    EmailMailgunServices.sendEmailEndOfOrder('endOfOrder', 1, body.report.fullNameWorker, 'es', body.report.idIndex, body.report.emailsToSend, '---', body.generateLink)
                }else if(body.report.emailing === 'termino-orden-2') {
                    EmailMailgunServices.sendEmailEndOfOrder('endOfOrder', 2, body.report.fullNameWorker, 'es', body.report.idIndex, body.report.emailsToSend, body.report.shiftManagerApprovedCommit, body.generateLink)
                }else if(body.report.emailing === 'termino-orden-3') {
                    EmailMailgunServices.sendEmailEndOfOrder('endOfOrder', 3, body.report.fullNameWorker, 'es', body.report.idIndex, body.report.emailsToSend, body.report.chiefMachineryApprovedCommit, body.generateLink)
                }else if(body.report.emailing === 'termino-orden-4') {
                    EmailMailgunServices.sendEmailEndOfOrder('closeOrder', 4, body.report.fullNameWorker, 'es', body.report.idIndex, body.report.emailsToSend, body.report.sapExecutiveApprovedCommit, body.generateLink)
                }
            }
            //body.report.idIndex = await countTotalReports()
            const editReportState = await Reports.findOneAndUpdate({idIndex: body.report.idIndex}, body.report, {new: false, timestamps: false}) //new Reports(body.report);
            //console.log('Respuesta edición reporte =>>>>>', editReportState);
            res.json(editReportState)
        }catch(err) {
            res.json(err);
        }
        /* try{
            await createReportState.save()
            res.json(createReportState);
        }catch(err) {
            res.json(err);
        }  */
    }
}

const deleteReport = async (req, res) => {
    //console.log(req.body)
    //console.log(req.query)
    const { id } = req.body
    //console.log(id)
    
    if (!id) {
        throw new Error(errorMsg.missingParameters)
    }else{
        try{
            const deleted = await Reports.findByIdAndDelete(id)
            if (!deleted) {
                res.json({
                    message: 'Orden no encontrada'
                })
            };
            const deleteExecution = await ExecutionReport.findOneAndDelete({reportId: id});
            if (!deleteExecution) {
                res.json({
                    message: 'Error en sistema'
                })
            };
            res.json({
                message: 'Orden eliminada'
            })
        }catch(err) {
            res.json(err);
        }
    }
    
}

const getReports = (req, res) => {
    try {
        Reports.find({}, (err, reports) => {
            //console.log('Reportes: ', reports)
            res.json(reports)
        });
    } catch (err) {
        console.log(err)
    }
}

const getReportByGuide = (req, res) => {
    const { body } = req;
    //console.log(body);
}

const getReportsByDateRange = (req, res) => {
    const { body } = req;
    console.log(body);

    //console.log(new Date(body.dateInit))
    let dateInit = body.dateInit;
    let dateEnd = body.dateEnd;
    console.log(dateInit, dateEnd)
    let reportType = body.reportType;
    try {
        Reports.find({ dateClose: { $gte: new Date(dateInit) , $lt: new Date(dateEnd) },  reportType: reportType }, (err, reports) => {
            if(err) {
                console.log('El error es: ', err)
            }
            console.log(reports);
            res.send(reports)
        })
    } catch (err) {
        console.log('ERRRRRRR',err)
    }
    
}

const getReportByIndex = (req, res) => {
    const { body } = req;
    const { indexNumber } = body;
    try {
        Reports.findOne({idIndex: indexNumber}, (err, report) => {
            //console.log('Reportes', reports);
            res.json(report)
        })
    } catch (err) {

    }
}

const getReportByType = (req, res) => {
    const { body } = req;
    //console.log(body)
    /* try {
        Reports.find({}, (err, reports) => {
            console.log('Reportes', reports);
            res.jason(reports)
        })
    } catch (err) {
        console.log(err)
    } */
}

const getReportByState = (req, res) => {
    const { body } = req;
    //console.log(body)
    try {
        Reports.find({ state: body.state, reportType: body.reportType }, (err, reports) => {

            res.json(reports)
        })
    } catch (err) {
        console.log(err)
    }
}

const getReportsByUser = (req, res) => {
    const { body } = req;

    let reportList = new Array()
    try {
        Reports.find({}, (err, reports) => {
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
    const { body } = req;
    //console.log(body);
    //let reportList = new Array()
    try {
        Reports.find({usersAssigned: [body.userId]}, (err, reports) => {
            res.json(reports)
        })
    } catch (err) {

    }
}

const getReportByIdpm = async (req, res) => {
    const { body : { idpm } } = req;
    const response = await fetch(`${environment.icvApi.url}pmtype?pIDPM=${idpm}`);
    const pmResponse =  await response.json();
    res.send(pmResponse.data)
}

const countTotalReports = () => {
    return new Promise(resolve => {
        Reports.find({}, (err, reports) => {
            resolve(reports.length)
        })
    })
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
    getReportsByDateRange
}