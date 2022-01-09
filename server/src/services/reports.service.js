import { Reports } from "../models";
import { environment } from '../config'
const { error: errorMsg, success: successMsg } = environment.messages.services.user

const createReport = async (req, res) => {
    const { body } = req
    console.log(body)
    
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
    console.log(body)
    
    if (!body.report) {
        throw new Error(errorMsg.missingParameters)
    }else{
        try{
            //body.report.idIndex = await countTotalReports()
            const editReportState = await Reports.findOneAndUpdate({idIndex: body.report.idIndex}, body.report, {new: false, timestamps: false}) //new Reports(body.report);
            console.log(editReportState);
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

const getReports = (req, res) => {
    try {
        Reports.find({}, (err, reports) => {
            console.log('Reportes: ', reports)
            res.json(reports)
        });
    } catch (err) {
        console.log(err)
    }
}

const getReportByGuide = (req, res) => {
    const { body } = req;
    console.log(body)
    /* try {
        Reports.find({}, (err, reports) => {
            console.log('Reportes', reports);
            res.jason(reports)
        })
    } catch (err) {
        console.log(err)
    } */
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
        console.log(err)
    }
}

const getReportByType = (req, res) => {
    const { body } = req;
    console.log(body)
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
    console.log(body)
    try {
        Reports.find({ state: body.state, reportType: body.reportType }, (err, reports) => {
            console.log('Reportes', reports);
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


export default {
    createReport,
    editReport,
    getReports,
    getReportByIndex,
    getReportByGuide,
    getReportByType,
    getReportByState
}