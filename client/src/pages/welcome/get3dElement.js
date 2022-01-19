import { environment } from "../../config";
import { FilesToStringDatabase } from "../../indexedDB";
import Files from "./3dFiles";

const get3dMachines = (machine) => {
    let newMachine;
    return new Promise(resolve => {
        if(machine.type === 'Camión') {
            newMachine = environment.storageURL + 'maquinas/camiones/' + machine.brand.toUpperCase() + '/' + machine.brand.toUpperCase() + '_' + machine.model + '_' + 'Preview.gltf'
        }else if(machine.type === 'Pala') {
            newMachine = environment.storageURL + 'maquinas/palas/' + machine.brand.toUpperCase() + '/' + machine.brand + '_' + machine.model + '_' + 'Preview.gltf'
        }
        resolve(newMachine)
    })
}

const get3dMachines_ = () => {
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

const download3DFiles = async (setProgress, setOpenLoader, setLoadingData, setOpenVersion) => {
    let files = new Array();
    files = await get3dMachines_();
    let n = 0;
    download3DFile(n, files, setProgress, setOpenLoader, setLoadingData, setOpenVersion)
}

const download3DFile = async (n, files, setProgress, setOpenLoader, setLoadingData, setOpenVersion) => {
    let number = Number(n);
    let newFiles = new Array();
    newFiles = files;
    if(number == (newFiles.length)) {
        setTimeout(async () => {
            setProgress(100);
            setLoadingData('Recursos descargados');
            /* let db = await FilesToStringDatabase.initDb3DFiles();
            if(db) {
                await FilesToStringDatabase.consultar(db.database);
            } */
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
        console.log(files[number]);
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
                    let db = await FilesToStringDatabase.initDb3DFiles();
                    if(db) {
                        let actualizado = await FilesToStringDatabase.actualizar({id: number, info: {model: model, brand: brand, type: type}, data: result}, db.database);
                        if(actualizado) {
                            number = number + 1;
                            download3DFile(number, files, setProgress, setOpenLoader, setLoadingData, setOpenVersion)
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

const get3dElement = async (number, trucks, setProgress, setOpenLoader, setLoadingData, setOpenVersion) => {
    download3DFiles()
        if(number == (trucks.length)) {
            setTimeout(async () => {
                setProgress(100);
                setLoadingData('Recursos descargados');
                let db = await FilesToStringDatabase.initDb3DFiles();
                if(db) {
                    await FilesToStringDatabase.consultar(db.database);
                }
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
            setLoadingData('Descargando Modelo 3D ' + (number + 1))
            const url3dTruck = await get3dMachines(trucks[number]);
            const { id, model, brand, type } = trucks[number];
            let res = await fetch(url3dTruck);
            const reader = res.body.getReader();
            const contentLength = +res.headers.get('Content-Length');
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
                        let db = await FilesToStringDatabase.initDb3DFiles();
                        if(db) {
                            let actualizado = await FilesToStringDatabase.actualizar({id: id, info: {model: model, brand: brand, type: type}, data: result}, db.database);
                            if(actualizado) {
                                number = number + 1;
                                get3dElement(number, trucks, setProgress, setOpenLoader, setLoadingData, setOpenVersion);
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

export default download3DFiles