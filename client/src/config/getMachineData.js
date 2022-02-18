import { machinesRoutes } from "../routes"


export default (equid) => {
    return new Promise(resolve => {
        machinesRoutes.getMachineByEquid(equid).then(data => {
            resolve(data.data)
        })
    })
}