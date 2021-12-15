import fs from 'fs';
import fetch from 'node-fetch'
import { environment } from '../config';
import { SiteController } from '../controller';
import { Site, Machine } from '../models';
import { machinesOfProject } from '../files'


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
const readMachinesByModel = ( req, res ) => {
    //console.log(req)
    const { body } = req;
    console.log(body)
    Machine.find({ model: body.model, idobra: body.idobra }, (err, sites) => {
        if(err) {
            res.status(502).json({message: 'Error de lectura en Base de Datos'})
            throw err
        }
        //console.log(sites)
        res.status(200).json(sites)
    })
}

/* Leer máquinas */
const readMachinesFromDb = () => {
    return new Promise(resolve => {
        Machine.find({}, (err, machines) => {
            if(err) {
                console.log(err)
            }
            resolve(machines)
        })
    })
}

/* Crear sitios para enviar a FRONT */
const createSiteToSend = () => {
    return new Promise(async resolve => {
        const sites = await fetch(`${environment.icvApi.url}pmobras`);
        if( sites ) {
            const body = await sites.json();
            if( body ) {
                const readSitesFromDb = await SiteController.readSites();
                let sitios = [] = body.data;
                console.log(sitios)
                if(readSitesFromDb.length == sitios.length) {
                    resolve(true)
                }else{
                    sitios.forEach(async (site, i) => {
                        console.log(site)
                        readSitesFromDb.forEach(async (siteInspector, number) => {
                            console.log(site, siteInspector);
                            if(site.idobra === siteInspector.idobra) {
                                 
                            }else{
                                await SiteController.createSite(site);
                            }
                            if(number == (readSitesFromDb.length - 1)) {
                                resolve(true)
                            }
                        })
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
                    console.log(err)
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
    //console.log(pIDOBRA)
    const machines = await fetch(`${environment.icvApi.url}PmEquipos?pIDOBRA=${pIDOBRA}`);
    if( machines ) {
        const body = await machines.json();
        if( body ) {
            const machinesOnDb = await readMachinesFromDb();
            //console.log(machinesOnDb)
            let machines = [];
            machines = body.data;
            if(machinesOnDb.length === machines.length) {
                console.log('No se requiere guardar.');
            }else{
                machines.forEach(async (machine, index) => {
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
                    let newMachine = await new Machine(machine);
                    newMachine.save();
                    if(index == (machines.length - 1)) {
                        console.log('Máquinas guardadas!');
                    }
                })
            }
        }
    }
}

/* Descargar pautas desde API ICV y guardar en archivos*/
const createPMsToSend = async ({idpm, typepm}) => {
    const response1 = await fetch(`${environment.icvApi.url}pmtype?pIDPM=${idpm}`);
    const response2 = await fetch(`${environment.icvApi.url}PmHeader?pIDPM=${idpm}&pTypePm=${typepm}`);
    const response3 = await fetch(`${environment.icvApi.url}PmStruct?pIDPM=${idpm}&pTypePm=${typepm}`);
    const body1 = await response1.json();
    const body2 = await response2.json();
    const body3 = await response3.json();
    if( body1 && body2 && body3 ) {
        let file = {
            data: body1.data.find(el => el.typepm === typepm),
            header: body2 ,
            struct: body3
        }
        fs.writeFile(`../files/GuidesToSend/file_${idpm}_${typepm}.json`, JSON.stringify(file), (err) => {
            if (err) {
                console.log('Hay un error')
            }; 
        });
    }
}

//Enviar listado de máquinas
const sendFileOfMachines = ( req, res ) => {
    try{
        res.status(200).download('../files/machines/machines.json');
    }catch(err) {
        console.log(err);
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
    readSites,
    readSitesInServer,
    readAllMachinesFromDb,
    readMachinesByModel,
    sendFileOfMachines,
    filesPetition,
    filePetition,
    readMachinesOfProject,
    createPMsToSend,
    getAllGuidesHeaderAndStruct,
    createSiteToSend,
    leerArchivo,
    createMachinesToSend
}