import { reportsRoutes } from "../../routes"

export default () => {
    return new Promise( resolve => {
        reportsRoutes.getAllReports().then(data => {
            console.log(data.data)
            resolve(data.data)
        })
    })
}