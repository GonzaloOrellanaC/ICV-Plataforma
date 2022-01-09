import { reportsRoutes } from "../../routes"

export default (userId) => {
    return new Promise( resolve => {
        reportsRoutes.getReportsByUser(userId).then(data => {
            resolve(data.data)
        })
    })
}