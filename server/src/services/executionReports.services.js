import { ExecutionReport } from "../models"
import { environment } from '../config'
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
    try{
        const updated = await ExecutionReport.findByIdAndUpdate(body.reportData._id, body.reportData, { new: true })
        res.json(updated)
    }catch(err) {
        res.json(err);
    }
}

const saveExecutionReportInternal = async (reportData) => {
    try{
        const updated = await ExecutionReport.findByIdAndUpdate(reportData._id, reportData, { new: true })
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