import fs from 'fs';
import fetch from 'node-fetch'
import https from 'https'
import { environment } from '../config';
import { SiteController } from '../controller';
import { Site, Machine } from '../models';
import { machinesOfProject, machinesListPms } from '../files'

const myHeaders = {
    'Authorization': 'Token ' + environment.icvApi.token,
    'Content-Type': 'application/json'
}
const agentOptions = {
    rejectUnauthorized: false
}
  
const agent = new https.Agent(agentOptions)

const leerPautas = (req, res) => {
    let listaPMsConcat = [];
    let i = 0;
    console.log('leer pautas')
    leerPauta(i, machinesListPms, listaPMsConcat, res);
}

const leerPauta = async (i, machinesListPms, listaPMsConcat, res) => {
    if(i == (machinesListPms.length)) {
        res.send(listaPMsConcat);
    }else{
        try{
            let pIDPM = machinesListPms[i].pIDPM;
            const response = await fetch(`${environment.icvApi.url}pmtype?pIDPM=${pIDPM}`, {
                /* myHeaders */
                headers: myHeaders,
                method: 'GET',
                agent: agent
            })
            const listaPMs =  await response.json()
            console.log('Respuesta: ', listaPMs)
            listaPMsConcat = listaPMsConcat.concat(listaPMs.data)
            i = i + 1
            leerPauta(i, machinesListPms, listaPMsConcat, res)
        } catch (error) {
            console.log('ERROR ======> ', error)
        }
    }
}

const getHeaderPauta = async (req, res) => {
    const {body} = req;
    const response2 = await fetch(`${environment.icvApi.url}PmHeader?pIDPM=${body.idpm}&pTypePm=${body.typepm}`, {
        /* myHeaders */
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
    console.log(body)
    const response3 = await fetch(`${environment.icvApi.url}PmStruct?pIDPM=${body.idpm}&pTypePm=${body.typepm}`, {
        /* myHeaders */
        headers: myHeaders,
        method: 'GET',
        agent: agent
    })
    const headers = await response3.json();
    if(headers) {
        res.send(headers)
    }
}

const getIdPmInspection = (equi) => {
    return new Promise(async resolve => {
        const response4 = await fetch(`${environment.icvApi.url}Pm?pIdEqui=${equi}&pPmClass=I`, {
            /* myHeaders */
            headers: myHeaders,
            method: 'GET',
            agent: agent
        })
        let res = await response4.json();
        resolve(res.data.idpm);
    })
}

const getIdPmMaintenance = (equi) => {
    return new Promise(async resolve => {
        const response5 = await fetch(`${environment.icvApi.url}Pm?pIdEqui=${equi}&pPmClass=M`, {
            /* myHeaders */
            headers: myHeaders,
            method: 'GET',
            agent: agent
        })
        let res = await response5.json();
        resolve(res.data.idpm);
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
    const machines = await fetch(`${environment.icvApi.url}PmEquipos?pIDOBRA=${pIDOBRA}`, {
        /* myHeaders */
        headers: myHeaders,
        method: 'GET',
        agent: agent
    })
    console.log(await machines.json())
    if( machines ) {
        let body = await machines.json();
        if( body ) {
            const machinesOnDb = await readMachinesFromDb();
            let machines = [];
            machines = body.data;
            if(machinesOnDb.length === machines.length) {
            }else{
                machines.forEach(async (machine, index) => { 
                    machine.idpminspeccion = await getIdPmInspection(machine.equid);
                    machine.idpmmantencion = await getIdPmMaintenance(machine.equid);
                    if(machine.modelo.includes('793-F')){
                        machine.modelo='793-F';
                        machine.type = 'Camión'
                    }else if(machine.modelo.includes('pc5500')||machine.modelo.includes('PC5500')) {
                        machine.modelo='PC5500';
                        machine.type = 'Pala'
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
                        }
                    } catch (error) {
                        console.log(index, ' ERROR ====> ', error)
                    }
                    /* let newMachine = await new Machine(machine);
                    newMachine.save(); */
                    if(index == (machines.length - 1)) {

                    }
                })
            }
        }
    }
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
    getHeaderPauta,
    getStructsPauta,
    saveMachineDataById,
    findSitesToActualiceMachines
}