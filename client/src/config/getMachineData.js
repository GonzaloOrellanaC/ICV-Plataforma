import { machinesDatabase } from "../indexedDB"
import { getMachineByEquid } from "../routes/machines.routes"


export default (equid) => {
    return new Promise(async resolve => {
        if (navigator.onLine) {
            const data = await getMachineByEquid(equid)
            resolve (data.data)
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