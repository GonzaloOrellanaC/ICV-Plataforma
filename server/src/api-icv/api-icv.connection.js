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

const getSites = () => {
    try{
        return new Promise(resolve => {
            Site.find({}, (err, sites) => {
                resolve(sites)
            });
            
        })
    } catch (err) {
    }
}

const sincronizar = async (req, res) => {
    const findSites = await getSites()
    findSites.forEach(async (site, index) => {
        try {
            const response = await createMachinesToSend(site.idobra, true)
            res.send(response)
        } catch (error) {
        }
    })
}

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
    /* res.send({data: 'ok'}) */
}

const leerPauta2 = async (i, machinesListPmsData, listaPMsConcat) => {
    if(i === (machinesListPmsData.length)) {
        listaPMsConcat.map(async (pauta, number) => {
            try {
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
                    if (JSON.stringify(patternFind.struct) === JSON.stringify(pauta.struct)||
                        JSON.stringify(patternFind.header) === JSON.stringify(pauta.header)) {

                    } else {
                        await PatternDetail.findByIdAndUpdate(patternFind._id, pauta)
                    }
                }
            } catch (error) {
                console.log(error)
            }
        })
    }else{
        try{
            let pIDPM = machinesListPmsData[i].pIDPM;
            const response = await fetch(`${environment.icvApi.url}pmtype?pIDPM=${pIDPM}`, {
                headers: myHeaders,
                method: 'GET',
                agent: agent
            })
            const listaPMs =  await response.json()
            if (listaPMs) {
                listaPMs.data.forEach(l => {
                    l.zone = machinesListPmsData[i].zone
                })
                let dataToSend = {}
                dataToSend = listaPMs.data
                listaPMsConcat = listaPMsConcat.concat(dataToSend)
            }
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
            /* console.log(environment.icvApi.url, pIDPM) */
            const response = await fetch(`${environment.icvApi.url}pmtype?pIDPM=${pIDPM}`, {
                headers: myHeaders,
                method: 'GET',
                agent: agent
            })
            const listaPMs =  await response.json()
            /* console.log('Respuesta: ', listaPMs) */
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
    try {
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
    } catch (error) {
        res.send({error: 'error'})
    }
}

const getStructsPauta = async (req, res) => {
    try {
        const {body} = req;
        let pautaName
        if (body.idpm === 'Pauta%20de%20Inspecci%C3%B3n') {
            pautaName = 'Pauta de Inspección'
        } else {
            pautaName = body.idpm
        }
        /* console.log(`${environment.icvApi.url}PmStruct?pIDPM=${pautaName}&pTypePm=${body.typepm}`) */
        const response3 = await fetch(`${environment.icvApi.url}PmStruct?pIDPM=${pautaName}&pTypePm=${body.typepm}`, {
            headers: myHeaders,
            method: 'GET',
            agent: agent
        })
        const structs = await response3.json();
        /* console.log(structs) */
        res.send(structs)
    } catch (error) {
        res.send([])
    }
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
            /* console.log(res.data) */
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
        try {
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
        } catch (error) {
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
    Machine.find({}, (err, machine) => {
        if(err) {
            res.status(502).json({message: 'Error de lectura en Base de Datos'})
            throw err
        }
        res.status(200).json(machine)
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
    /* console.log(machine) */
    Machine.findByIdAndUpdate(machine._id, machine, {new: false, timestamps: false}, (err, response) => {
        /* console.log(response) */
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
        try {
            const sites = await fetch(`${environment.icvApi.url}pmobras`, {
                headers: myHeaders,
                method: 'GET',
                agent: agent
            });
            if( sites ) {
                const body = await sites.json();
                if( body ) {
                    const readSitesFromDb = await Site.find()
                    let sitios = body.data
                    sitios.forEach((sitioSap, i) => {
                        let compareResult = false
                        readSitesFromDb.forEach(async (sitioLocal, index) => {
                            if (sitioLocal.idobra === sitioSap.idobra) {
                                compareResult = true
                            }
                            if (index === (readSitesFromDb.length - 1)) {
                                if(!compareResult) {
                                    const response = await Site.findOne({idobra: sitioSap.idobra})
                                    if (!response) {
                                        await Site.create(sitioSap)
                                    }
                                }
                            }
                        })
                        if (i === (sitios.length - 1)) {
                            resolve(true)
                        }
                    })
                }else{
                    resolve(false)
                }
            }else{
                resolve(false)
            }
        } catch (error) {
            resolve(false)
        }
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
const createMachinesToSend = async (pIDOBRA, isSync = false) => {
    try {
        const machines = await fetch(`${environment.icvApi.url}PmEquipos?pIDOBRA=${pIDOBRA}`, {
            headers: myHeaders,
            method: 'GET',
            agent: agent
        })
        let b = await machines.json();
        let machinesData = []
        machinesData = b.data
        machinesData.forEach(async (machine, index) => {
            machine.idpminspeccion = await getIdPmInspection(machine.equid);
            machine.idpmmantencion = await getIdPmMaintenance(machine.equid);
            if(machine.modelo[0]==='7'){
                machine.type = 'Camión'
            }else if(machine.modelo[0] === 'P') {
                machine.type = 'Pala'
            }else if(machine.modelo[0] === '9') {
                machine.type = 'Cargador Frontal'
            }else if(machine.modelo[0] === 'D') {
                machine.type = 'Bulldozer'
            }
            machine.brand = machine.marca;
            machine.model = machine.modelo;
            machine.hourMeter = machine.horometro;
            try {
                const findMachine = await Machine.findOne({equid: machine.equid})
                if (findMachine) {
                    await Machine.findByIdAndUpdate(findMachine._id, machine)
                } else {
                    console.log('Machine not found')
                    try {
                        await Machine.create(machine);
                    } catch (error) {
                        /* console.log(error) */
                    }
                }
                if (isSync) {
                    return {
                        message: 'Máquinas sincronizadas.'
                    }
                }
            } catch (error) {
                /* console.log(index, ' ERROR ====> ', error) */
            }
            if(index == (machines.length - 1)) {
    
            }
        })
    } catch (error) {
        
    }    
}

const editMachineToSend = async (pIDOBRA) => {
    try {
        const machines = await fetch(`${environment.icvApi.url}PmEquipos?pIDOBRA=${pIDOBRA}`, {
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
                    machine.hourMeter = machine.horometro;
                    let machineEdit = await Machine.findOneAndUpdate({equid: machine.equid},{hourMeter: machine.hourMeter}, { new: true, timestamps: false })
                    if( machineEdit ) {
    
                    }
                    if(index == (machines.length - 1)) {
    
                    }
                })
            }
        }
    } catch (error) {
        console.log('error: ' + error)
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
    findSitesToActualiceMachines,
    sincronizar
}