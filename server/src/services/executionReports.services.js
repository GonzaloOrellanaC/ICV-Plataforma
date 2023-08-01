import { ExecutionReport, Reports } from "../models"
import { AzureServices } from "."

const getExecutionReportById = async (req, res) => {
    const { body } = req
    /* console.log(body.reportData._id) */
    try{
        const executionReport = await ExecutionReport.findOne({reportId: body.reportData._id}).populate('report').populate('createdBy')
        /* console.log('Excution: ', executionReport._id) */
        res.json(executionReport)
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
        try{
            const response = await ExecutionReport.findOne({reportId: executionReport.reportId})
            if (!response) {
                const executionReportCreated = await ExecutionReport.create(executionReport)
                resolve(executionReportCreated)
            } else {
                resolve(response)
            }
        }catch(err) {
            resolve(err);
        } 
    })
}

let numberVerification1 = 0
let numberVerification2 = 0

const saveExecutionReport = async (req, res) => {
    const { body } = req
    const executionReportData = body.reportData
    const response = await Reports.findById(executionReportData.reportId)
    const report = response.toJSON()
    Object.keys(executionReportData.group).forEach(async (key, index) => {
        executionReportData.group[key].forEach((item) => {
            if (item.messages) {
                item.messages.forEach(async (mensaje, i) => {
                    if (mensaje)
                    if (mensaje.urlBase64) {
                        if (mensaje.urlBase64.length > 0) {
                            numberVerification1 = numberVerification1 + 1
                            const imageData = await AzureServices.uploadImageFromReport(
                                mensaje.urlBase64,
                                report.idIndex,
                                key,
                                mensaje.id
                            )
                            if (imageData) {
                                numberVerification2 = numberVerification2 + 1
                            }
                            mensaje.urlImageMessage = imageData.data.url
                            mensaje.urlBase64 = ''
                        }
                    }
                    if (i === (item.messages.length - 1)) {
                    }
                })
            }
        })
        if (index == (Object.keys(executionReportData.group).length - 1)) {
            if (executionReportData.astList && (executionReportData.astList.length > 0)) {
                executionReportData.astList.forEach(async (ast, i) => {
                    numberVerification1 = numberVerification1 + 1
                    if (ast.image.length > 0) {
                        const imageAstData = await AzureServices.uploadImageAstFromReport(
                            ast.image,
                            report.idIndex,
                            ast.id
                        )
                        if (imageAstData) {
                            numberVerification2 = numberVerification2 + 1
                        }
                        ast.image = ''
                        ast.imageUrl = imageAstData.data.url
                    } else {
                        numberVerification2 = numberVerification2 + 1
                    }
                    if (i == (executionReportData.astList.length - 1)) {
                        timeout(executionReportData, res)
                    }
                })
            } else {
                timeout(executionReportData, res)
            }
        }
    })
}

const timeout = (executionReportData, res) => {
    setTimeout(async() => {
        if (numberVerification1 == numberVerification2) {
            let response = await saveExecutionReportInternal(executionReportData)
            if (response) {
                res.json({data: 'ok'})
            } else {
                const newDoc = await createNewExecutionReport(executionReportData);
                if(newDoc) {
                    res.json(newDoc);
                } else {
                    res.json({data: 'error'})
                }
            }
        } else {
            timeout(executionReportData, res)
        }
    }, 1000);
}

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
    getExecutionReportByIdInternal,
    saveExecutionReportInternal
}