import { reportsRoutes } from "../../routes"

export default () => {
    return new Promise( resolve => {
        reportsRoutes.getAllReports().then(data => {
            resolve(data.data)
        })
    })
}