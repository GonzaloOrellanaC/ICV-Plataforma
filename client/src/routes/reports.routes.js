import axios from 'axios'

export default {
    createReport: (report) => {
        const requestBody = {
            report,
        }
        return axios.post('/reports/createReport', requestBody);
    },
    editReport: (report) => {
        const requestBody = {
            report,
        }
        return axios.post('/reports/editReport', requestBody);
    },
    deleteReport: (id) => {
        const requestBody = {
            id,
        }
        return axios.post('/reports/deleteReport', requestBody);
    },
    getAllReports: () => {
        return axios.get('/reports/getAllReports')
    },
    getReportByIndex: (indexNumber) => {
        const requestBody = {
            indexNumber,
        }
        return axios.post('/reports/getReportByIndex', requestBody);
    },
    getReportByGuide: (guideNumber) => {
        const requestBody = {
            guideNumber,
        }
        return axios.post('/reports/getReportByGuide', requestBody);
    },
    getReportByType: (type) => {
        const requestBody = {
            type
            
        }
        return axios.post('/reports/getReportByType', requestBody);
    },
    getReportByState: (state, reportType) => {
        const requestBody = {
            state,
            reportType
        }
        return axios.post('/reports/getReportByState', requestBody);
    },
    getReportsByUser: (userId) => {
        const requestBody = {
            userId
        }
        return axios.post('/reports/getReportsByUser', requestBody);
    },
    findMyAssignations: (userId) => {
        const requestBody = {
            userId
        };
        return axios.post('/reports/findMyAssignations', requestBody);
    },
    getReportByIdpm: (idpm) => {
        const requestBody = {
            idpm
        };
        return axios.post('/reports/getReportByIdpm', requestBody);
    },
    getReportsByDateRange: (dateInit, dateEnd, reportType) => {
        const requestBody = {
            dateInit,
            dateEnd,
            reportType
        };
        return axios.post('/reports/getReportsByDateRange', requestBody);
    }
}