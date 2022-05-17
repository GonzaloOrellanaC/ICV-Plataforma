/* import { environment } from "../../config"; */
/* import { FilesToStringDatabase, machinesPartsDatabase } from "../indexedDB"; */
import { machinesPartsDatabase, FilesToStringDatabase } from "../indexedDB";
import Files from "./3dFiles";
import environment from "./environment.config";

export default async (setProgressDownload3D, setOpenDownload3D, setLoadingData3D, setOpenVersion) => {

    const download3DFile = async (n, files, db) => {
            if(setLoadingData3D) {
                setLoadingData3D(`Modelos 3D deberán ser descargados.`)
            }
            let number = Number(n);
            let newFiles = new Array();
            newFiles = files;
            if(number == (newFiles.length)) {
                setTimeout(() => {
                    if(setProgressDownload3D) {
                        setProgressDownload3D(100)
                    }
                    if(setLoadingData3D) {
                        setLoadingData3D('Recursos descargados')
                    }
                    setTimeout(() => {
                        if(setOpenDownload3D) {
                            setOpenDownload3D(false)
                            localStorage.setItem('isLoading3D', 'nok')
                        }
                        setTimeout(() => {
                            if(!localStorage.getItem('version')) {
                                if(setOpenVersion) {
                                    setOpenVersion(true)
                                }
                                localStorage.setItem('version', environment.version);
                            }
                        }, 500);
                    }, 1000);
                }, 1000);
            }else{
                const { model, brand, type, name } = files[number];
                if(setLoadingData3D) {
                    setLoadingData3D(`Descargando modelo 3D de ${name}, ${brand} ${model}`)
                }
                let res = await fetch(`${environment.storageURL}${files[number].url}`);
                const reader = res.body.getReader();
                const contentLength = + res.headers.get('Content-Length');
                let receivedLength = 0; // received that many bytes at the moment
                let chunks = []; // array of received binary chunks (comprises the body)
                if(setProgressDownload3D) {
                    setProgressDownload3D(0)
                }
                setTimeout(async () => {
                    while (true) {
                        const ele = await reader.read();
                        if (ele.done) {
                            let chunksAll = new Uint8Array(receivedLength); // (4.1)
                            let position = 0;
                            for(let chunk of chunks) {
                                chunksAll.set(chunk, position); // (4.2)
                                position += chunk.length;
                            }
                            let result = new TextDecoder("utf-8").decode(chunksAll);
                            if(db) {
                                let actualizado = await FilesToStringDatabase.actualizar({id: number, model: model, brand: brand, type: type, name: name, nameModel: `${name}_${model}`, data: result}, db.database);
                                if(actualizado) {
                                    let dbMachinesParts = await machinesPartsDatabase.initDb();
                                    machinesPartsDatabase.actualizar({id: number, model: model, brand: brand, type: type, name: name, nameModel: `${name}_${model}`}, dbMachinesParts.database)
                                    number = number + 1;
                                    download3DFile(number, files, /* setProgressDownload3D, setOpenDownload3D, setLoadingData3D, setOpenVersion, */ db)
                                }
                            }
                            break;
                        }
                        chunks.push(ele.value);
                        receivedLength += ele.value.length;
                        if(setProgressDownload3D) {
                            setProgressDownload3D((100*receivedLength)/contentLength)
                        }
                    }
                }, 1000);
            }
        
    }

    const get3dMachines = () => {
        return new Promise( resolve => {
            let files = new Array();
            files = Files;
            let filesList = new Array();
            filesList = [];
            files.forEach((file, index) => {
                file.files.forEach((f, i) => {
                    let url = `maquinas/${file.group}/${file.brand.toUpperCase()}/${file.brand.toUpperCase()}_${file.model}_${f.name}.gltf`
                    filesList.push({
                        name: f.name,
                        brand: file.brand,
                        model: file.model,
                        type: file.type,
                        url: url,
                    })
                })
                if(index === (files.length - 1)) {
                    resolve(filesList);
                }
            })
        })
    }

    let db = await FilesToStringDatabase.initDb3DFiles();
    let consulta = await FilesToStringDatabase.consultar(db.database);
    if(consulta.length > 0) {
        if(setLoadingData3D) {
            setLoadingData3D(`Modelos 3D descargados.`)
        }
        setTimeout(() => {
            if(setProgressDownload3D) {
                setProgressDownload3D(100)
            }
            setTimeout(() => {
                if(setOpenDownload3D) {
                    setOpenDownload3D(false)
                }
            }, 1000);
        }, 1000);
    }else {
        let files = new Array();
        files = await get3dMachines();
        let n = 0;
        download3DFile(n, files, db)
    }
    
}