import { ExecutionReport, Reports } from "../models"
import { environment } from '../config'
import { AzureServices } from "."
const { error: errorMsg, success: successMsg } = environment.messages.services.user

const getExecutionReportById = (req, res) => {
    const { body } = req
    console.log(body);

    try{
        ExecutionReport.find({reportId: body.reportData._id}, async (err, doc) => {
            console.log('Report!!', doc)
            if(err) {
                res.json({
                    state: false,
                    message: "Error"
                })
            }
            if(doc.length == 0) {
                const newDoc = await createNewExecutionReport(body.reportData);
                console.log(newDoc)
                if(newDoc) {
                    res.json(newDoc);
                }
            }else{
                res.json(doc)
            }
        })
    }catch(err) {
        res.json(err);
    }
}
const getExecutionReportByIdInternal = async (reportId) => {
    const report = await ExecutionReport.find({reportId: reportId})
    return report[0].toJSON()
}

const createNewExecutionReport = async (executionReport) => {
    return new Promise(async resolve => {
        const createExecutionReportState = new ExecutionReport(executionReport);
        try{
            await createExecutionReportState.save()
            resolve(createExecutionReportState);
        }catch(err) {
            resolve(err);
        } 
    })
}

const saveExecutionReport = async (req, res) => {
    const { body } = req
    console.log(body);
    const executionReportData = body.reportData
    const response = await Reports.findById(executionReportData.reportId)
    const report = response.toJSON()
    console.log(report.idIndex)
    Object.keys(executionReportData.group).forEach(async (key, index) => {
        executionReportData.group[key].forEach(item => {
            if (item.messages) {
                item.messages.forEach(async (mensaje, i) => {
                    if (mensaje.urlBase64) {
                        if (mensaje.urlBase64.length > 0) {
                            const imageData = await AzureServices.uploadImageFromReport(
                                mensaje.urlBase64,
                                report.idIndex,
                                key,
                                mensaje.id
                            )
                            console.log(imageData)
                            mensaje.urlImageMessage = imageData.data.url
                            mensaje.urlBase64 = ''
                        }
                    }
                    await saveExecutionReportInternal(executionReportData)
                    if (i === (item.messages.length - 1)) {
                    }
                })
            }
        })
        if (index == (Object.keys(executionReportData.group).length - 1)) {
            try{
                const updated = await ExecutionReport.findByIdAndUpdate(executionReportData._id, executionReportData, { new: true })
                res.json(updated)
            }catch(err) {
                res.json(err);
            }
        }
    })
}

const saveExecutionReportInternal = async (executionReportData) => {
    try{
        const updated = await ExecutionReport.findByIdAndUpdate(executionReportData._id, executionReportData, { new: true })
        /* console.log(updated) */
        return updated
    }catch(err) {
        return err
    }
}

export default {
    getExecutionReportById,
    saveExecutionReport,
    getExecutionReportByIdInternal,
    saveExecutionReportInternal
}