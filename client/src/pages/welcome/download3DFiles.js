import { environment } from "../../config";
import { FilesToStringDatabase, machinesPartsDatabase } from "../../indexedDB";
import Files from "./3dFiles";

export default async (setProgress, setOpenLoader, setLoadingData, setOpenVersion) => {

    const download3DFile = async (n, files, db) => {
            setLoadingData(`Modelos 3D deberán ser descargados.`)
            let number = Number(n);
            let newFiles = new Array();
            newFiles = files;
            if(number == (newFiles.length)) {
                setTimeout(() => {
                    setProgress(100);
                    setLoadingData('Recursos descargados');
                    setTimeout(() => {
                        setOpenLoader(false);
                        setTimeout(() => {
                            if(!localStorage.getItem('version')) {
                                setOpenVersion(true)
                                localStorage.setItem('version', environment.version);
                            }
                        }, 500);
                    }, 1000);
                }, 1000);
            }else{
                const { model, brand, type, name } = files[number];
                setLoadingData(`Descargando modelo 3D de ${name}, ${brand} ${model}`)
                let res = await fetch(`${environment.storageURL}${files[number].url}`);
                const reader = res.body.getReader();
                const contentLength = + res.headers.get('Content-Length');
                let receivedLength = 0; // received that many bytes at the moment
                let chunks = []; // array of received binary chunks (comprises the body)
                setProgress(0);
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
                                    download3DFile(number, files, /* setProgress, setOpenLoader, setLoadingData, setOpenVersion, */ db)
                                }
                            }
                            break;
                        }
                        chunks.push(ele.value);
                        receivedLength += ele.value.length;
                        setProgress((100*receivedLength)/contentLength)
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
        setLoadingData(`Modelos 3D descargados.`)
        setTimeout(() => {
            setProgress(100);
            setTimeout(() => {
                setOpenLoader(false)
            }, 1000);
        }, 1000);
    }else {
        let files = new Array();
        files = await get3dMachines();
        let n = 0;
        download3DFile(n, files, db)
    }
    
}