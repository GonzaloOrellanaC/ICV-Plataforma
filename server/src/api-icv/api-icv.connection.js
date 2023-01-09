import fs from 'fs'
import fetch from 'node-fetch'
import https from 'https'
import { environment } from '../config'
import { SiteController } from '../controller'
import { Site, Machine, Patterns, PatternDetail } from '../models'
import { machinesOfProject } from '../files'

const myHeaders = {
    'Authorization': 'Token ' + environment.icvApi.token,
    'Content-Type': 'application/json'
}
const agentOptions = {
    rejectUnauthorized: false
}
  
const agent = new https.Agent(agentOptions)

const leerPautas = async (req, res) => {
    let listaPMsConcat = [];
    let listaPautas = []
    let i = 0;
    console.log('leer pautas')
    const machinesList = await Patterns.find()
    leerPauta2(i, machinesList, listaPautas)
    res.send({data: 'ok'})
    /* leerPauta(i, machinesList, listaPMsConcat, res); */
}

const leerPautas2 = async () => {
    let listaPautas = []
    let i = 0;
    console.log('leer pautas')
    const machinesList = await Patterns.find()
    leerPauta2(i, machinesList, listaPautas)
    res.send({data: 'ok'})
}

const leerPauta2 = async (i, machinesListPmsData, listaPMsConcat) => {
    if(i === (machinesListPmsData.length)) {
        listaPMsConcat.map(async (pauta, number) => {
            pauta.id = number
            if (!pauta.hmEstandar) {
                pauta.hhEstandar = 0
            }
            let pautaName
            if (pauta.idpm === 'Pauta%20de%20Inspecci%C3%B3n') {
                pautaName = 'Pauta de Inspección'
            } else {
                pautaName = pauta.idpm
            }
            const response2 = await fetch(`${environment.icvApi.url}PmHeader?pIDPM=${pautaName}&pTypePm=${pauta.typepm}`, {
                headers: myHeaders,
                method: 'GET',
                agent: agent
            })
            pauta.header = await response2.json();
            const response3 = await fetch(`${environment.icvApi.url}PmStruct?pIDPM=${pautaName}&pTypePm=${pauta.typepm}`, {
                headers: myHeaders,
                method: 'GET',
                agent: agent
            })
            pauta.struct = await response3.json();
            const patternFind = await PatternDetail.findOne({idpm: pauta.idpm, typepm: pauta.typepm})
            if (!patternFind) {
                await PatternDetail.create(pauta)
            } else {
                if (JSON.stringify(patternFind.struct) === JSON.stringify(pauta.struct) || JSON.stringify(patternFind.header) === JSON.stringify(pauta.header)) {
                    console.log('Estructura de pauta no cambia')
                } else {
                    console.log('Pauta ', patternFind._id, ' actualizada')
                    await PatternDetail.findByIdAndUpdate(patternFind._id, pauta)
                }
                console.log('Pauta ', pautaName, pauta.typepm, ' existe' )
            }
            if (number === (listaPMsConcat.length - 1)) {
                console.log('Guardados.')
            }
        })
    }else{
        try{
            let pIDPM = machinesListPmsData[i].pIDPM;
            console.log(environment.icvApi.url, pIDPM)
            const response = await fetch(`${environment.icvApi.url}pmtype?pIDPM=${pIDPM}`, {
                headers: myHeaders,
                method: 'GET',
                agent: agent
            })
            const listaPMs =  await response.json()
            console.log('Respuesta: ', listaPMs)
            listaPMsConcat = listaPMsConcat.concat(listaPMs.data)
            i = i + 1
            leerPauta2(i, machinesListPmsData, listaPMsConcat)
        } catch (error) {
            i = i + 1
            leerPauta2(i, machinesListPmsData, listaPMsConcat)
            console.log('ERROR ======> ', error)
        }
    }
}

const leerPauta = async (i, machinesListPmsData, listaPMsConcat, res) => {
    if(i === (machinesListPmsData.length)) {
        res.send(listaPMsConcat);
    }else{
        try{
            let pIDPM = machinesListPmsData[i].pIDPM;
            console.log(environment.icvApi.url, pIDPM)
            const response = await fetch(`${environment.icvApi.url}pmtype?pIDPM=${pIDPM}`, {
                headers: myHeaders,
                method: 'GET',
                agent: agent
            })
            const listaPMs =  await response.json()
            console.log('Respuesta: ', listaPMs)
            listaPMsConcat = listaPMsConcat.concat(listaPMs.data)
            i = i + 1
            leerPauta(i, machinesListPmsData, listaPMsConcat, res)
        } catch (error) {
            i = i + 1
            leerPauta(i, machinesListPmsData, listaPMsConcat, res)
            console.log('ERROR ======> ', error)
        }
    }
}

const getHeaderPauta = async (req, res) => {
    const {body} = req;
    let pautaName
    if (body.idpm === 'Pauta%20de%20Inspecci%C3%B3n') {
        pautaName = 'Pauta de Inspección'
    } else {
        pautaName = body.idpm
    }
    const response2 = await fetch(`${environment.icvApi.url}PmHeader?pIDPM=${pautaName}&pTypePm=${body.typepm}`, {
        headers: myHeaders,
        method: 'GET',
        agent: agent
    })
    const headers = await response2.json();
    if(headers) {
        res.send(headers)
    }
}

const getStructsPauta = async (req, res) => {
    const {body} = req;
    let pautaName
    if (body.idpm === 'Pauta%20de%20Inspecci%C3%B3n') {
        pautaName = 'Pauta de Inspección'
    } else {
        pautaName = body.idpm
    }
    console.log(`${environment.icvApi.url}PmStruct?pIDPM=${pautaName}&pTypePm=${body.typepm}`)
    const response3 = await fetch(`${environment.icvApi.url}PmStruct?pIDPM=${pautaName}&pTypePm=${body.typepm}`, {
        headers: myHeaders,
        method: 'GET',
        agent: agent
    })
    const structs = await response3.json();
    /* console.log(structs) */
    res.send(structs)
}

const getIdPmInspection = (equi) => {
    return new Promise(async resolve => {
        try {
            const response4 = await fetch(`${environment.icvApi.url}Pm?pIdEqui=${equi}&pPmClass=I`, {
                headers: myHeaders,
                method: 'GET',
                agent: agent
            })
            let res = await response4.json();
            console.log(res.data)
            if (res.data && res.data.idpm) {
                resolve(res.data.idpm)
            } else {
                resolve(null)
            }
        } catch (error) {
            resolve(null)
        }
    })
}

const getIdPmMaintenance = (equi) => {
    return new Promise(async resolve => {
        const response5 = await fetch(`${environment.icvApi.url}Pm?pIdEqui=${equi}&pPmClass=M`, {
            headers: myHeaders,
            method: 'GET',
            agent: agent
        })
        let res = await response5.json();
        if (res.data && res.data.idpm) {
            resolve(res.data.idpm)
        } else {
            resolve(null)
        }
    })
}

/* Leer sitios GET - POST */
const readSites = ( req, res ) => {
    Site.find({}, (err, sites) => {
        if(err) {
            res.status(502).json({message: 'Error de lectura en Base de Datos'})
            throw err;
        }
        res.status(200).json(sites)
    })
}

/* Leer sitios en servicio */
const readSitesInServer = () => {
    return new Promise(resolve => {
        Site.find({}, (err, sites) => {
            if(err) {
                throw err
            }
            resolve(sites)
        })
    })
}

/* Leer máquinas GET - POST */
const readAllMachinesFromDb = ( req, res ) => {
    Machine.find({}, (err, sites) => {
        if(err) {
            res.status(502).json({message: 'Error de lectura en Base de Datos'})
            throw err
        }
        res.status(200).json(sites)
    })
}

/* Leer máquinas por modelo GET - POST */
const readMachinesByEquid = ( req, res ) => {
    const { body } = req;
    Machine.find({ equid: body.equid }, (err, machine) => {
        if(err) {
            res.status(502).json({message: 'Error de lectura en Base de Datos'})
            throw err
        }
        res.status(200).json(machine)
    })
}

/* Leer máquinas por modelo GET - POST */
const readMachinesByModel = ( req, res ) => {
    const { body } = req;
    Machine.find({ model: body.model, idobra: body.idobra }, (err, sites) => {
        if(err) {
            res.status(502).json({message: 'Error de lectura en Base de Datos'})
            throw err
        }
        res.status(200).json(sites)
    })
}

const getMachineByEquid = ( req, res ) => {
    const {body} = req;
}

const getMachineBySiteId = async (req, res) => {
    const machines = await Machine.find({idobra: req.body.siteId})
    return res.status(200).json(machines)
}

/* Leer máquinas */
const readMachinesFromDb = () => {
    return new Promise(resolve => {
        Machine.find({}, (err, machines) => {
            if(err) {
            }
            resolve(machines)
        })
    })
}

/* Guardar datos de máquina */
const saveMachineDataById = ( req, res ) => {
    const { body } = req;
    const machine = body.machine
    console.log(machine)
    Machine.findByIdAndUpdate(machine._id, machine, {new: false, timestamps: false}, (err, response) => {
        console.log(response)
        if(err) {
            res.status(502).json({message: 'Error de lectura en Base de Datos'})
            throw err
        }
        res.status(200).json(response)
    })
}

const findSitesToActualiceMachines = async () => {
    const sitios = await Site.find()
    sitios.forEach((site, index) => {

    })
}

/* Crear sitios para enviar a FRONT */
const createSiteToSend = () => {
    return new Promise(async resolve => {
        const sites = await fetch(`${environment.icvApi.url}pmobras`, {
            headers: myHeaders,
            method: 'GET',
            agent: agent
        });
        if( sites ) {
            const body = await sites.json();
            if( body ) {
                const readSitesFromDb = await SiteController.readSites();
                let sitios = [] = body.data;
                if(readSitesFromDb.length == sitios.length) {
                    resolve(true)
                }else{
                    sitios.forEach(async (site, i) => {
                        await createMachinesToSend(site.idobra);
                        await SiteController.createSite(site);
                        if(i == (sitios.length - 1)) {
                            resolve(true)
                        }
                        
                    })
                }
            }else{
                resolve(false)
            }
        }else{
            resolve(false)
        }
    })
}

/* Borrar archivo */
const borrarArchivo = (path) => {
    return new Promise(resolve => {
        fs.rm(path, (err) => {
            if(err) {
                resolve(false)
            }
            resolve(true)
        })
    })
}

/* Guardar archivo */
const guardarArchivo = (body) => {
    return new Promise(resolve => {
        fs.writeFile(`../files/SitesToSend/sites.json`, JSON.stringify(body.data), (err) => {
            if (err) {
                resolve(false)
            }
            resolve(true)
        });
    })
}

/* Leer archivo */
const leerArchivo = (type) => {
    let path;
    if(type === 'sitios') {
        path = '../files/SitesToSend/sites.json'
    }else if(type === 'maquinas') {
        path = '../files/SitesToSend/allMachines.json'
    }
    return new Promise(resolve => {
        if(fs.existsSync(path)) {
            fs.readFile(path, (err, data) => {
                if(err) {
                    resolve({
                        state: false,
                        data: {
                            message: 'Error de lectura. Revisar consola'
                        }
                    })
                }
                resolve({
                    state: true,
                    data: JSON.parse(data.toString())
                })
            })
        }
    })
}

/* Descargar máquinas por obra desde API ICV y guardar en base de datos*/
const createMachinesToSend = async (pIDOBRA) => {
    console.log(`${environment.icvApi.url}PmEquipos?pIDOBRA=${pIDOBRA}`)
    const machines = await fetch(`${environment.icvApi.url}PmEquipos?pIDOBRA=${pIDOBRA}`, {
        /* myHeaders */
        headers: myHeaders,
        method: 'GET',
        agent: agent
    })
    /* console.log(await machines.json()) */
    let b = await machines.json();
    /* const machinesOnDb = await readMachinesFromDb(); */
    let machinesData = []
    machinesData = b.data
    machinesData.forEach(async (machine, index) => {
        console.log(machine)
        machine.idpminspeccion = await getIdPmInspection(machine.equid);
        machine.idpmmantencion = await getIdPmMaintenance(machine.equid);
        if (machine.modelo.includes('D10-T2')) {
            console.log(machine.modelo, machine.idpminspeccion, machine.idpmmantencion, machine.equid)
        }
        if(machine.modelo.includes('793-F')){
            machine.modelo='793-F';
            machine.type = 'Camión'
        }else if(machine.modelo.includes('pc5500')||machine.modelo.includes('PC5500')) {
            machine.modelo='PC5500';
            machine.type = 'Pala'
        }else if(machine.modelo.includes('793-D')) {
            machine.modelo='793-D';
            machine.type = 'Camión'
        }else if(machine.modelo.includes('789-D')) {
            machine.modelo='789-D';
            machine.type = 'Camión'
        }else if(machine.modelo.includes('994-K')) {
            machine.modelo='994-K';
            machine.type = 'Cargador Frontal'
        }else if(machine.modelo === 'D10-T') {
            machine.modelo='D10-T';
            machine.type = 'Bulldozer'
        }else if(machine.modelo === 'D10-T2') {
            machine.modelo='D10-T2';
            machine.type = 'Bulldozer'
        }

        machine.brand = machine.marca;
        machine.model = machine.modelo;
        machine.hourMeter = machine.horometro;
        try {
            const findMachine = await Machine.findOne({equid: machine.equid})
            if (findMachine) {
                console.log('Machine ', machine.equ, ' founded')
            } else {
                console.log('Machine not founded')
                console.log(machine)
                try {
                    const newMachine = await Machine.create(machine);
                    console.log(newMachine)
                } catch (error) {
                    console.log(error)
                }
            }
        } catch (error) {
            console.log(index, ' ERROR ====> ', error)
        }
        if(index == (machines.length - 1)) {

        }
    })
    
}

const editMachineToSend = async (pIDOBRA) => {
    const machines = await fetch(`${environment.icvApi.url}PmEquipos?pIDOBRA=${pIDOBRA}`, {
        /* myHeaders */
        headers: myHeaders,
        method: 'GET',
        agent: agent
    })
    if( machines ) {
        const body = await machines.json();
        if( body ) {
            let machines = [];
            machines = body.data;
            machines.forEach(async (machine, index) => {
                /* if(machine.modelo.includes('793-F')){
                    machine.modelo='793-F';
                    machine.type = 'Camión'
                }else if(machine.modelo.includes('pc5500')||machine.modelo.includes('PC5500')) {
                    machine.modelo='PC5500';
                    machine.type = 'Pala'
                }
                machine.brand = machine.marca;
                machine.model = machine.modelo; */
                machine.hourMeter = machine.horometro;
                let machineEdit = await Machine.findOneAndUpdate({equid: machine.equid},{hourMeter: machine.hourMeter}, { new: true, timestamps: false })
                if( machineEdit ) {

                }
                /* let newMachine = await new Machine(machine);
                newMachine.save(); */
                if(index == (machines.length - 1)) {

                }
            })
            
        }
    }
}

//Enviar listado de máquinas
const sendFileOfMachines = ( req, res ) => {
    try{
        res.status(200).download('../files/machines/machines.json');
    }catch(err) {
        res.status(500).json({
            message: 'Error en la lectura del servidor.'
        })
    }
}

/* Peticiones GET / POST */
const filesPetition = ( req, res ) => {
    try{
        const files = fs.readdirSync('../files/GuidesToSend');
        res.status(200).send(files)
    } catch (err) {
        res.status(500).json({message: 'Error al enviar la petición'})
    }
}

/* Leer las máquinas del proyecto */
const filePetition = ( req, res ) => {
    try{
        res.status(200).download(`../files/GuidesToSend/${req.body.fileName}`)
    } catch (err) {
        res.status(500).json({message: 'Error al enviar la petición'})
    } 
}

/* Leer las máquinas del proyecto */
const readMachinesOfProject = ( req, res ) => {
    try{
        res.status(200).send(machinesOfProject)
    } catch (err) {
        res.status(500).json({message: 'Error al enviar la petición'})
    } 
}

const getAllGuidesHeaderAndStruct = (pIDPM) => {
    return new Promise( resolve => {
        fs.readFile(`../files/SPM/file_${pIDPM}.json`, (err, data) => {
            const GuideHeaderList  =  JSON.parse(data.toString());
            GuideHeaderList.data.forEach((PMHeader, index) => {
                createPMsToSend(PMHeader);
                if(index == (GuideHeaderList.data - 1)) {
                    resolve(true)
                }
            });
        })
    })
}

export default {
    /* Leer sitios */
    readSites,
    readSitesInServer,
    readAllMachinesFromDb,
    readMachinesByModel,
    readMachinesByEquid,
    getMachineByEquid,
    getMachineBySiteId,
    sendFileOfMachines,
    filesPetition,
    filePetition,
    readMachinesOfProject,
    //createPMsToSend,
    getAllGuidesHeaderAndStruct,
    createSiteToSend,
    leerArchivo,
    createMachinesToSend,
    editMachineToSend,
    leerPautas,
    leerPautas2,
    getHeaderPauta,
    getStructsPauta,
    saveMachineDataById,
    findSitesToActualiceMachines
}