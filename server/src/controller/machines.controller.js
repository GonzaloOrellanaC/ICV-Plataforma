import { Machine, MachineOfProject, Roles } from '../models'

const readMachineByModel = (model) => {
    return new Promise(resolve => {
        try{
            MachineOfProject.find({model: model}, (err, machine) => {
                if(err) {
                    resolve(false)
                }
                if(machine.length > 0) {
                    resolve(true)
                }else{
                    resolve(false)
                }
            })
        } catch (err) {
            console.error('Error al buscar')
            resolve(false)
        }
    })
}

const createMachine = (machine) => {
    machine.machineId = machine.id
    return new Promise(async resolve => {
        try {
            const registreMachine = await new MachineOfProject(machine);
            registreMachine.save();
            if(registreMachine) {
                resolve(true)
            }
        } catch (err) {
            console.error('Error al crear máquina: ', err);
            resolve(true)
        }
    })
}

export default {
    createMachine,
    readMachineByModel
}