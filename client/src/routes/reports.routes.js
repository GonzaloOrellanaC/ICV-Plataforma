import axios from 'axios'

export default {
    createReport: (report) => {
        const requestBody = {
            report,
        }
        return axios.post('/reports/createReport', requestBody)
    },
    getAllReports: () => {
        return axios.get('/reports/getAllReports')
    },
    getReportByGuide: (guideNumber) => {
        const requestBody = {
            guideNumber,
        }
        return axios.post('/reports/getReportByGuide', requestBody)
    },
    getReportByType: (type) => {
        const requestBody = {
            type
            
        }
        return axios.post('/reports/getReportByType', requestBody)
    },
    getReportByState: (state, reportType) => {
        const requestBody = {
            state,
            reportType
        }
        return axios.post('/reports/getReportByState', requestBody)
    }
}