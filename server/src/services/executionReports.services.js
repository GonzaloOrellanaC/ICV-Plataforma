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
    const executionReportData = body.reportData
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
                    await saveExecutionReportInternal(executionReportData)
                    if (i === (item.messages.length - 1)) {
                        /* const response =  */
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
            /* console.log('Nueva data: =====>')
            const editReportState = await Reports.findOneAndUpdate({idIndex: body.report.idIndex}, body.report, {new: false, timestamps: false}) //new Reports(body.report)
            res.json(editReportState) */
        }
    })
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