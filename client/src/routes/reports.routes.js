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
    editReportFromAudit: (report, generateLink) => {
        const requestBody = {
            report,
            generateLink
        }
        return axios.post('/reports/editReportFromAudit', requestBody);
    },
    deleteReport: (id) => {
        const requestBody = {
            id,
        }
        return axios.post('/reports/deleteReport', requestBody);
    },
    getReportById: (_id) => {
        const requestBody = {
            _id
        }
        return axios.post('/reports/getReportById', requestBody);
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
    getReportByEquid: (equid) => {
        const requestBody = {
            equid
        };
        return axios.post('/reports/getReportByEquid', requestBody);
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
    },
    getTotalReportsToIndex: () => {
        return axios.get('/reports/getTotalReportsToIndex')
    }
}