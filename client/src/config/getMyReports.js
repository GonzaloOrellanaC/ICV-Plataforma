import { reportsRoutes } from "../routes"

export default (userId) => {
    return new Promise( resolve => {
        /* reportsRoutes.findMyAssignations(userId).then(data => {
            let res = new Array()
            if(data.data.length == 0) {
                res = []
            }else{
                res = data.data
            }
            resolve(res)
        }) */
    })
}