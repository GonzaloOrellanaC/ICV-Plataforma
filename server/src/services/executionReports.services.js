import { ExecutionReport } from "../models"
import { environment } from '../config'
const { error: errorMsg, success: successMsg } = environment.messages.services.user

const getExecutionReportById = (req, res) => {
    const { body } = req
    console.log(body);

    try{
        ExecutionReport.find({reportId: body.reportData.reportId}, async (err, doc) => {
            console.log(doc)
            if(err) {
                res.json({
                    state: false,
                    message: "Error"
                })
            }
            if(doc.length == 0) {
                const newDoc = await createNewExecutionReport(body.reportData);
                if(newDoc) {
                    console.log( 'Nuevo_:', newDoc)
                    res.json(newDoc);
                }
            }else{
                console.log('Existe_:', doc)
                res.json(doc)
            }
            
            
            
        })
    }catch(err) {
        res.json(err);
    }
    
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

export default {
    getExecutionReportById,
}