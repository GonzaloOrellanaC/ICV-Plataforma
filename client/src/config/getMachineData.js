import { machinesDatabase } from "../indexedDB"
import { machinesRoutes } from "../routes"


export default (equid) => {
    return new Promise(resolve => {
        if (navigator.onLine) {
            machinesRoutes.getMachineByEquid(equid).then(data => {
                resolve(data.data)
            })
        } else {
            machinesDatabase.initDbMachines().then(db => {
                machinesDatabase.consultar(db.database).then(data => {
                    let machinesList = new Array()
                    machinesList = data
                    const machineFiltered = machinesList.filter(machine => { if (machine.equid === equid) {return machine }})
                    resolve(machineFiltered)
                })
            })
        }
    })
}