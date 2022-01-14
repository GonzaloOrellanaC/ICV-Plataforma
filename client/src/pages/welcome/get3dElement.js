import { environment } from "../../config";
import { FilesToStringDatabase } from "../../indexedDB";

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

const get3dElement = async (number, trucks, setProgress, setOpenLoader, setLoadingData, setOpenVersion) => {
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

export default get3dElement