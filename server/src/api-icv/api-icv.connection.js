import fs from 'fs';
import fetch from 'node-fetch'
import { environment } from '../config';

const sendFileOfMachines = ( req, res ) => {
    res.download('../files/machines/machines.json');
}

const filesPetition = ( req, res ) => {
    const files = fs.readdirSync('../files/PM_TO_SEND');
    res.send(files)
}

const filePetition = ( req, res ) => {
    console.log(req.body.fileName);
    res.download(`../files/PM_TO_SEND/${req.body.fileName}`)
}

const readSites = ( req, res ) => {
    res.download(`../files/SitesToSend/sites.json`)
}

const getAllPMList = () => {
    return new Promise( resolve => {
        fs.readFile('../files/machines/machines.json', (err, data) => {
            const machines = [] =  JSON.parse(data.toString());
            machines.forEach((machine, index) => {
                downloadPMType(machine)
            });
            resolve(machines)
        })
    })
}

const getAllPMHeaderAndStruct = (pIDPM) => {
    return new Promise( resolve => {
        fs.readFile(`../files/PM/file_${pIDPM}.json`, (err, data) => {
            const PMHeaderList  =  JSON.parse(data.toString());
            PMHeaderList.data.forEach((PMHeader, index) => {
                createPMsToSend(PMHeader);
            });
        })
    })
}

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
        fs.writeFile(`../files/PM_TO_SEND/file_${idpm}_${typepm}.json`, JSON.stringify(file), (err) => {
            if (err) {
                console.log('Hay un error')
            }; 
        });
    }
}

const createSiteToSend = async () => {
    const sites = await fetch(`${environment.icvApi.url}pmobras`);
    if(sites) {
        const body = await sites.json();
        if(body) {
            fs.writeFile(`../files/SitesToSend/sites.json`, JSON.stringify(body.data), (err) => {
                if (err) throw err; 
            })
        }
    }
}

const downloadPMType =  ({pIDPM}) => {
    return new Promise( async resolve => {
        const response = await fetch(`${environment.icvApi.url}pmtype?pIDPM=${pIDPM}`);
        const body = await response.text();
        if(body) {
            fs.writeFile(`../files/PM/file_${pIDPM}.json`, body, (err) => {
                if (err) throw err; 
            });
        }
    })
}

const downloadPMHeader =  ({idpm, typepm}) => {
    return new Promise( async resolve => {
        const response = await fetch(`${environment.icvApi.url}PmHeader?pIDPM=${idpm}&pTypePm=${typepm}`);
        const body = await response.text();
        if(body) {
            fs.writeFile(`../files/PMHeader/file_${typepm}.json`, body, (err) => {
                if (err) throw err;
            });
            //console.log(`Archivo file_${typepm}.json creado o editado`)
        }
    })
}

const downloadPMStruct =  ({idpm, typepm}) => {
    return new Promise( async resolve => {
        const response = await fetch(`${environment.icvApi.url}PmStruct?pIDPM=${idpm}&pTypePm=${typepm}`);
        const body = await response.text();
        if(body) {
            fs.writeFile(`../files/PMStruct/file_${typepm}_struct.json`, body, (err) => {
                if (err) throw err;
            });
            //console.log(`Archivo file_${typepm}_struct.json creado o editado`)
        }
    })
}

const readAllPMHeadAndStruct = () => {
    return new Promise( resolve => {
        let dir = '../files/PM/';
        let PMHeaders = [];
        let fileToSend = {
            PMHeaders : null,
            PMStstructs : null,
        }
        fs.readdir(dir, (err, data) => {
            data.forEach((file, n) => {
                console.log(n, data.length)
                fs.readFile((dir+file), (err, data) => {
                    let list = JSON.parse(data.toString()).data;
                    console.log(list.length)
                    list.forEach((item, number) => {
                        PMHeaders.push(item);
                    })
                });
                /* if(n == (data.length - 1)) {
                    console.log(PMHeaders)
                } */
            })
        })
    })
}

export default {
    sendFileOfMachines,
    filesPetition,
    filePetition,
    getAllPMList,
    createPMsToSend,
    getAllPMHeaderAndStruct,
    readAllPMHeadAndStruct,
    createSiteToSend,
    readSites
}