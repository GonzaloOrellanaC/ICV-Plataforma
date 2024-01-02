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

const createMachine = async (req, res) => {
    const {id, type, brand, model, pIDPM} = req.body
    /* machine.machineId = machine.id */
    const machine = {
        machineId: id, type, brand, model, pIDPM
    }
    try {
        const registreMachine = await MachineOfProject.create(machine);
        if(registreMachine) {
            res.status(200).json({data: registreMachine})
        }
    } catch (err) {
        console.error('Error al crear máquina: ', err);
        res.status(400).json({data: err})
    }
}

export default {
    createMachine,
    readMachineByModel
}