import { reportsRoutes } from "../../routes"

export default (userId) => {
    return new Promise( resolve => {
        reportsRoutes.findMyAssignations(userId).then(data => {
            resolve(data.data)
        })
    })
}