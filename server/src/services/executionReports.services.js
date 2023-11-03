import { ExecutionReport, Reports } from "../models"
import { AzureServices } from "."

const getExecutionReportById = async (req, res) => {
    const { body: {reportId} } = req
    try{
        const executionReport = await ExecutionReport.findOne({reportId: reportId}).populate('report').populate('createdBy')
        console.log(executionReport)
        if (executionReport) {
            res.status(200).json({data: executionReport, state: true})
        } else {
            res.status(200).json({state: false})
        }
    }catch(err) {
        res.status(400).json(err);
    }
}
const getExecutionReportByIdInternal = async (reportId) => {
    const report = await ExecutionReport.findOne({reportId: reportId})
    return report[0].toJSON()
}

const createExecutionReport = async (req, res) => {
    const { body } = req
    const executionReportData = body.reportData
    const findReport = await ExecutionReport.findOne({reportId: executionReportData.reportId})
    if (!findReport) {
        const newDoc = await ExecutionReport.create(executionReportData)
        if(newDoc) {
            res.status(200).json({data: newDoc, state: true, message: 'Elemento creado'});
        } else {
            res.status(400).json({data: 'error'})
        }
    } else {
        res.status(200).json({data: findReport, state: true, message: 'Elemento ya ha sido creado'});
    }
}
const saveExecutionReport = async (req, res) => {
    const { body } = req
    const executionReportData = body.reportData
    const response = await Reports.findById(executionReportData.reportId)
    const report = response.toJSON()
    const keys = Object.keys(executionReportData.group)
    const group = executionReportData.group
    const messages = []
    keys.forEach(async (key, index) => {
        group[key].forEach((item) => {
            if (item.messages) {
                item.messages.forEach((mensaje, i) => {
                    if (mensaje) {
                        messages.push({key: key, message: mensaje})
                    }
                })
            }
        })
        if (index == (Object.keys(executionReportData.group).length - 1)) {
            const index = 0
            revisarMensajes(messages, index, report, res, executionReportData, keys)
        }
    })
}

const revisarMensajes = async (messages, index, report, res, executionReportData) => {
    if (messages.length === index) {
        await ExecutionReport.findByIdAndUpdate(executionReportData._id, executionReportData)
        res.status(200).json({state: true, message: 'Elemento actualizado'})
    } else {
        if (messages[index].message) {
            if (messages[index].message.urlBase64) {
                if (messages[index].message.urlBase64.length > 0) {
                    const imageData = await AzureServices.uploadImageFromReport(
                        messages[index].message.urlBase64,
                        report.idIndex,
                        messages[index].key,
                        messages[index].message.id
                    )
                    if (imageData) {
                        messages[index].message.urlImageMessage = imageData.data.url
                        messages[index].message.urlBase64 = ''
                    }
                    index = index + 1
                    revisarMensajes(messages, index, report, res, executionReportData)
                } else {
                    index = index + 1
                    revisarMensajes(messages, index, report, res, executionReportData)
                }
            } else {
                index = index + 1
                revisarMensajes(messages, index, report, res, executionReportData)
            }
        } else {
            index = index + 1
            revisarMensajes(messages, index, report, res, executionReportData)
        }
    }
}

/* const timeout = (executionReportData, res, numberVerification1, numberVerification2) => {
    setTimeout(async() => {
        if (numberVerification1 === numberVerification2) {
            await ExecutionReport.findByIdAndUpdate(executionReportData._id, executionReportData)
            console.log('Actualizado!')
            res.status(200).json({state: true, message: 'Elemento actualizado'})
            const responseExecution = await ExecutionReport.findOne({reportId: executionReportData.reportId})
            console.log('Response: ', responseExecution)
            if (responseExecution) {
                const response = await ExecutionReport.findByIdAndUpdate(executionReportData._id, executionReportData)
                console.log('Actualizado!')
                res.status(200).json({data: response, state: true, message: 'Elemento actualizado'})
            } else {
                const newDoc = await ExecutionReport.create(executionReportData)
                if(newDoc) {
                    res.status(200).json({data: newDoc, state: true, message: 'Elemento creado'});
                } else {
                    res.status(400).json({data: 'error'})
                }
            }
        } else {
            timeout(executionReportData, res, numberVerification1, numberVerification2)
        }
    }, 1000);
} */

const saveExecutionReportInternal = async (executionReportData) => {
    try{
        const updated = await ExecutionReport.findByIdAndUpdate(executionReportData._id, executionReportData)
        return updated
    }catch(err) {
        return err
    }
}

export default {
    getExecutionReportById,
    saveExecutionReport,
    createExecutionReport,
    getExecutionReportByIdInternal,
    saveExecutionReportInternal
}