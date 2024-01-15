import { Machine, MachineOfProject, Roles } from '../models'
import Marca from '../models/maquinasMarcas'
import Modelo from '../models/maquinasModelo'
import Tipo from '../models/maquinasTipo'

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
    const {type, brand, model, pIDPM, typeId, brandId, urlImagen} = req.body.machine
    /* machine.machineId = machine.id */
    const machine = {
        machineId: null, type, brand, model, pIDPM, typeId, brandId, urlImagen
    }
    try {
        const machineId = await MachineOfProject.countDocuments()
        machine.machineId = machineId
        const registreMachine = await MachineOfProject.create(machine);
        if(registreMachine) {
            res.status(200).json({data: registreMachine})
        }
    } catch (err) {
        console.error('Error al crear máquina: ', err);
        res.status(400).json({data: err})
    }
}


const agregarTipoMaquina = async (req, res) => {
    const {tipo} = req.body
    try {
        const response = await Tipo.create({tipo: tipo.toUpperCase()})
        res.status(200).json({data: response})
    } catch (error) {
        res.status(400).json({data: error})
    }
}

const agregarMarcaMaquina = async (req, res) => {
    const {marca} = req.body
    try {
        const response = await Marca.create({marca: marca.toUpperCase()})
        res.status(200).json({data: response})
    } catch (error) {
        res.status(400).json({data: error})
    }

}

const agregarModeloMaquina = async (req, res) => {
    const {marcaId, modelo} = req.body
    console.log(marcaId, modelo)
    try {
        const response = await Modelo.create({marca: marcaId, modelo: modelo.toUpperCase()})
        res.status(200).json({data: response})
    } catch (error) {
        console.log(error)
        res.status(400).json({data: error})
    }
}

const obtenerTipoMaquinas = async (req, res) => {
    try {
        const response = await Tipo.find()
        res.status(200).json({data: response})
    } catch (error) {
        res.status(400).json({data: error})
    }
}

const obtenerMarcaMaquinas = async (req, res) => {
    try {
        const response = await Marca.find()
        res.status(200).json({data: response})
    } catch (error) {
        res.status(400).json({data: error})
    }
}

const obtenerModeloMaquinas = async (req, res) => {
    try {
        const response = await Modelo.find().populate('marca')
        res.status(200).json({data: response})
    } catch (error) {
        res.status(400).json({data: error})
    }
}

export default {
    createMachine,
    readMachineByModel,
    agregarTipoMaquina,
    agregarMarcaMaquina,
    agregarModeloMaquina,
    obtenerTipoMaquinas,
    obtenerMarcaMaquinas,
    obtenerModeloMaquinas
}