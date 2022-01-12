import axios from 'axios'

export default {
    getExecutionReportById: (reportData) => {
        const requestBody = {
            reportData,
        }
        return axios.post('/execution-report/getExecutionReportById', requestBody)
    }
}