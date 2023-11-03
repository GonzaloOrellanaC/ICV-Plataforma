import axios from 'axios'

export default {
    getExecutionReportById: (reportId, setPercentDownload) => {
        const requestBody = {
            reportId,
        }
        return axios.post('/execution-report/getExecutionReportById', requestBody, {
            onDownloadProgress: progressEvent => {
                const total = 50000
                const current = progressEvent.loaded
            
                const percentCompleted = Math.floor(current / total * 100)
                if (setPercentDownload) {
                    setPercentDownload(percentCompleted)
                }
            }
        })
    },
    saveExecutionReport: (reportData) => {
        const requestBody = {
            reportData,
        }
        return axios.post('/execution-report/saveExecutionReport', requestBody)
    },
    createExecutionReport: (reportData) => {
        const requestBody = {
            reportData,
        }
        return axios.post('/execution-report/createExecutionReport', requestBody)
    }
}