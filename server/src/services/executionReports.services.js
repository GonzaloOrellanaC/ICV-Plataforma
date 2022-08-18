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
    if (report) {
        res.json({data: 'ok'})
    } else {
        res.json({data: 'error'})
    }
    /* let imagesList = [] */
    Object.keys(executionReportData.group).forEach(async (key, index) => {
        console.log(index, Object.keys(executionReportData.group).length)
        executionReportData.group[key].forEach(item => {
            if (item.messages) {
                item.messages.forEach(async (mensaje, i) => {
                    if (mensaje.urlBase64) {
                        /* const imageData = {
                            urlBase64: mensaje.urlBase64,
                            reportIdIndex: report.idIndex,
                            key: key,
                            id: mensaje.id
                        }
                        imagesList.push(imageData)
                        mensaje.urlImageMessage = imageData.data.url
                        mensaje.urlBase64 = '' */
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
                    /* await saveExecutionReportInternal(executionReportData) */
                    if (i === (item.messages.length - 1)) {
                    }
                })
            }
        })
        if (index == (Object.keys(executionReportData.group).length - 1)) {
            /* if (imagesList.length > 0) {

            } */
            if (executionReportData.astList.length > 0) {
                executionReportData.astList.forEach(async (ast, i) => {
                    const imageAstData = await AzureServices.uploadImageAstFromReport(
                        ast.image,
                        report.idIndex,
                        ast.id
                    )
                    console.log(imageAstData)
                    ast.image = ''
                    ast.imageUrl = imageAstData.data.url
                    /* await saveExecutionReportInternal(executionReportData) */
                    if (i == (executionReportData.astList.length - 1)) {
                        await saveExecutionReportInternal(executionReportData)
                    }
                })
            } else {
                await saveExecutionReportInternal(executionReportData)
            }
        }
    })
}

const saveDataOne = (executionReportData, report) => {
    return new Promise(resolve => {
        executionReportData.group[key].forEach(item => {
            if (item.messages) {
                item.messages.forEach(async (mensaje, i) => {
                    if (mensaje.urlBase64) {
                        /* const imageData = {
                            urlBase64: mensaje.urlBase64,
                            reportIdIndex: report.idIndex,
                            key: key,
                            id: mensaje.id
                        }
                        imagesList.push(imageData)
                        mensaje.urlImageMessage = imageData.data.url
                        mensaje.urlBase64 = '' */
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
                    /* await saveExecutionReportInternal(executionReportData) */
                    if (i === (item.messages.length - 1)) {
                    }
                })
            }
        })
    })
}

/* const saveByOne = (n, imagesList) => {
    if (n == (imagesList.length - 1)) {

    } else {
        imagesList[n]
        const imageData = await AzureServices.uploadImageFromReport(
            imagesList[n].urlBase64,
            imagesList[n].reportIdIndex,
            imagesList[n].key,
            imagesList[n].id
        )
    }

} */

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