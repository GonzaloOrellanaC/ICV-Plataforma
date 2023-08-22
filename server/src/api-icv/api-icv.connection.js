import fs from 'fs'
import fetch from 'node-fetch'
import https from 'https'
import { environment } from '../config'
import { Site, Machine, Patterns, PatternDetail, Reports, Users } from '../models'
import { machinesOfProject } from '../files'
import { NotificationService, UserServices, Sentry } from '../services'

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
    } catch (error) {
        Sentry.captureException(error)
    }
}

const sincronizar = async (req, res) => {
    const findSites = await getSites()
    findSites.forEach(async (site, index) => {
        try {
            const response = await createMachinesToSend(site.idobra, true)
            res.send(response)
        } catch (error) {
            Sentry.captureException(error)
        }
    })
}

const leerPautas = async (req, res) => {
    let listaPMsConcat = [];
    let listaPautas = []
    let i = 0;
    /* console.log('leer pautas') */
    const machinesList = await Patterns.find()
    leerPauta2(i, machinesList, listaPautas)
    res.send({data: 'ok'})
    /* leerPauta(i, machinesList, listaPMsConcat, res); */
}

const leerPautas2 = async () => {
    let listaPautas = []
    let i = 0;
    /* console.log('leer pautas') */
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
                const patternFind = await PatternDetail.findOne({idpm: pautaName, typepm: pauta.typepm})
                if (!patternFind) {
                    await PatternDetail.create(pauta)
                } else {
                    const compareStruct = JSON.stringify(patternFind.struct).localeCompare(JSON.stringify(pauta.struct))
                    const compareHeader = JSON.stringify(patternFind.header).localeCompare(JSON.stringify(pauta.header))
                    const isOkToKeep = compareStruct + compareHeader
                    if (isOkToKeep === 0 || (pauta.header === 'error') || (patternFind.header === ["error"])) {
                        null
                    } else {
                        const pautaEditada = await PatternDetail.findByIdAndUpdate(patternFind._id, pauta, {new: true})
                        if (pautaEditada) {
                            const admins = await UserServices.getUserByRole('admin')
                            admins.map((user) => {
                                let notificationToSave = {
                                    id: user._id.toString(),
                                    from: 'Sistema de Mantención ICV',
                                    url: '/notifications',
                                    title: 'Pauta ' + pautaEditada.idpm + ', ' + pautaEditada.typepm + ', ha sido editada', 
                                    subtitle: pautaEditada.idpm + '/' + pautaEditada.typepm, 
                                    message: 'Pauta editada correctamente'
                                }
                                NotificationService.createNotification(notificationToSave)
                            })
                        }
                    }
                }
            } catch (error) {
                console.log(error)
                Sentry.captureException(error)
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
            Sentry.captureException(error)
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
            Sentry.captureException(error)
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
        Sentry.captureException(error)
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
        Sentry.captureException(error)
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
            Sentry.captureException(error)
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
            Sentry.captureException(error)
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
            Sentry.captureException(err)
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
        const admins = await UserServices.getUserByRole('admin')
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
                            sitioSap.status = true
                            if (index === (readSitesFromDb.length - 1)) {
                                if(!compareResult) {
                                    if (sitioSap.idobra.length === 4) {
                                        const response = await Site.findOne({idobra: sitioSap.idobra})
                                        if (!response) {
                                            await Site.create(sitioSap)
                                        }
                                    } else {
                                        admins.forEach((user) => {
                                            let notificationToSave = {
                                                id: user._id.toString(),
                                                from: 'Sistema Mantención ICV',
                                                url: null,
                                                title: `Sitio con ID ${sitioSap.idobra} no creado`, 
                                                subtitle: 'Error de ID', 
                                                message: `ID no se reconoce como válido. Debe contener 4 dígitos.`
                                            }
                                            NotificationService.createNotification(notificationToSave)
                                        })
                                    }
                                }
                            }
                        })
                        if (i === (sitios.length - 1)) {
                            resolve(sitios)
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
            Sentry.captureException(error)
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
const createMachinesToSend = (pIDOBRA, isSync = false) => {
    return new Promise(async (resolve) => {
        try {
            const machines = await fetch(`${environment.icvApi.url}PmEquipos?pIDOBRA=${pIDOBRA}`, {
                headers: myHeaders,
                method: 'GET',
                agent: agent
            })
            const machinesList = await (await machines.json()).data
            const response = await Machine.find({idobra: pIDOBRA})
            const data = {
                message: `Obra ${pIDOBRA}`,
                data: machinesList.length,
                maquinasEnBBDD: response.length
            }
            machinesList.forEach(async (machine, index) => {
                /* console.log(machine) */
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
                            console.log(error)
                        }
                    }
                } catch (error) {
                    console.log(index, ' ERROR ====> ', error)
                }
                if(index === (machinesList.length - 1)) {
                    if (isSync) {
                        resolve(data)
                    }
                }
            })
        } catch (error) {
            Sentry.captureException(error)
        }
    })
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
                let maquinas = [];
                maquinas = body.data;
                const index = 0
                leerMaquinas(maquinas, index)
            }
        }
    } catch (error) {
        console.log('error: ' + error)
        Sentry.captureException(error)
    }
}

const leerMaquinas = async (maquinas, index) => {
    if (maquinas.length === index) {
        console.log('Lectura terminada')
    } else {
        const machine = maquinas[index]
        machine.idpminspeccion = null;
        machine.idpmmantencion = null;
        machine.idpminspeccion = await getIdPmInspection(machine.equid);
        machine.idpmmantencion = await getIdPmMaintenance(machine.equid);    
        machine.hourMeter = machine.horometro;
        /* if (machine.equ === '726') {
            console.log(machine.equid, await getIdPmMaintenance(machine.equid))
        } */
        try {
            const response = await Machine.findOneAndUpdate(
                {equid: machine.equid},
                {hourMeter: machine.hourMeter, idpminspeccion: machine.idpminspeccion, idpmmantencion: machine.idpmmantencion},
                {new: true, timestamps: false}
            )
            if (response) {
                index = index + 1
                leerMaquinas(maquinas, index)
            }
        } catch (error) {
            Sentry.captureException(error)
            index = index + 1
            leerMaquinas(maquinas, index)
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
    } catch (error) {
        res.status(500).json({message: 'Error al enviar la petición'})
        Sentry.captureException(error)
    }
}

/* Leer las máquinas del proyecto */
const filePetition = ( req, res ) => {
    try{
        res.status(200).download(`../files/GuidesToSend/${req.body.fileName}`)
    } catch (error) {
        res.status(500).json({message: 'Error al enviar la petición'})
        Sentry.captureException(error)
    } 
}

/* Leer las máquinas del proyecto */
const readMachinesOfProject = ( req, res ) => {
    try{
        res.status(200).send(machinesOfProject)
    } catch (error) {
        res.status(500).json({message: 'Error al enviar la petición'})
        Sentry.captureException(error)
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

const getOMSap = async (year, month) => {
    console.log(year, month)
    try {
        const OMSapList = await fetch(`${environment.icvApi.url}OMSap?pYEAR=${year}&pMONTH=${month}`, {
            headers: myHeaders,
            method: 'GET',
            agent: agent
        })
        const body = await OMSapList.json();
        const index = 0
        crearPautasDesdeSAP(body.data, index)
    } catch (error) {
        Sentry.captureException(error)
    }
}

const crearPautasDesdeSAP = async (pautas, index) => {
    /* const admins = await UserServices.getUserByRole('admin') */
    if (index === (pautas.length)) {
        console.log(`se han gestionado ${pautas.length} pautas.`)
    } else {
        const om = pautas[index]
        if (om.estado === "0") {
            const findReport = await Reports.findOne({sapId: om.om })
            if (!findReport) {
                const findEquip = await Machine.findOne({equid: `00000000${om.equipo}`})
                if (findEquip) {
                    const findSite = await Site.findOne({idobra: om.faena})
                    if (findSite) {
                        const totalOT = await Reports.find()
                        const newOt = {
                            sapId: om.om,
                            site: om.faena,
                            reportType: 'Mantención',
                            machine: `00000000${om.equipo}`,
                            guide: om.pauta.replace('-', ''),
                            datePrev: new Date(om.fechA_INICIO.replace(/(\d+)(\d{2})(\d{2})/g, '$1-$2-$3')),
                            endPrev: new Date(om.fechA_TERMINO.replace(/(\d+)(\d{2})(\d{2})/g, '$1-$2-$3')),
                            idIndex: totalOT.length - 1,
                            idPm: findEquip.idpmmantencion,
                            description: om.texto,
                            state: 'Asignar',
                            isAutomatic: true
                        }
                        const reportCreated = await Reports.create(newOt)
                        if (reportCreated) {
                            index = index + 1
                            crearPautasDesdeSAP(pautas, index)
                        }
                    } else {
                        console.log(`Pauta OM ${om.om} no creada por no encontrar la obra.`)
                        /* admins.forEach((user) => {
                            let notificationToSave = {
                                id: user._id.toString(),
                                from: 'Sistema Mantención ICV',
                                url: null,
                                title: `OT de OM ${om.om} no creado`, 
                                subtitle: 'No se se encuentra obra', 
                                message: `La base de datos no encuentra la obra asociada al id ${om.faena}.`
                            }
                            NotificationService.createNotification(notificationToSave)
                        }) */
                        index = index + 1
                        crearPautasDesdeSAP(pautas, index)
                    }
                } else {
                    console.log(`Pauta OM ${om.om} no creada por no encontrar el equipo.`)
                    /* admins.forEach((user) => {
                        let notificationToSave = {
                            id: user._id.toString(),
                            from: 'Sistema Mantención ICV',
                            url: null,
                            title: `OT de OM ${om.om} no creado`, 
                            subtitle: 'No se se encuentra equipo', 
                            message: `La base de datos no encuentra el equipo asociado al id 00000000${om.equipo}.`
                        }
                        NotificationService.createNotification(notificationToSave)
                    }) */
                    index = index + 1
                    crearPautasDesdeSAP(pautas, index)
                }
            } else {
                console.log(`Pauta OM ${om.om} no creada porque ya se encuentra en BBDD.`)
                index = index + 1
                crearPautasDesdeSAP(pautas, index)
            }
        } else {
            console.log(`Pauta OM ${om.om} está cerrada.`)
            /* admins.forEach((user) => {
                let notificationToSave = {
                    id: user._id.toString(),
                    from: 'Sistema Mantención ICV',
                    url: null,
                    title: `OT de OM ${om.om} no creado`, 
                    subtitle: 'OM ya ejecutada', 
                    message: `La OM ${om.om} se indica como ya realizada en APM`
                }
                NotificationService.createNotification(notificationToSave)
            }) */
            index = index + 1
            crearPautasDesdeSAP(pautas, index)
        }
    }
}

const getOMs = async (req, res) => {
    try {
        const {year, month} = req.body
        const OMSapList = await fetch(`${environment.icvApi.url}OMSap?pYEAR=${year}&pMONTH=${month}`, {
            headers: myHeaders,
            method: 'GET',
            agent: agent
        })
        const body = await OMSapList.json();
        res.status(200).json(body.data)
    } catch (error) {
        Sentry.captureException(error)
        res.status(200).json(error)
    }
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
    sincronizar,
    getOMSap,
    getOMs
}