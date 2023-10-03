import { createContext, useContext, useEffect, useState } from "react";
import { FilesToStringDatabase, machinesPartsDatabase } from "../indexedDB";
import Files from "../config/3dFiles";
import { useAuth } from "./Auth.context";
import { environment } from "../config";

export const Machines3DContext = createContext()

export const Machine3DProvider = props => {
    const {isAuthenticated} = useAuth()
    const [downloadingData3D, setLoadingData3D] = useState('')
    const [progressDownload3D, setProgressDownload3D] = useState(0)
    const [openDownload3D, setOpenDownload3D] = useState(false)
    const [openVersion, setOpenVersion] = useState(false)
    const [todoArchivo3DListo, setTodoArchivo3DListo] = useState(false)
    const [machines3D, setMachines3D] = useState([])

    useEffect(() => {
        if (isAuthenticated) {
            obtenerModelos3D()
        }
    },[isAuthenticated])
    
    const download3DFile = async (n, files, db) => {
        setLoadingData3D(`Modelos 3D deberán ser descargados.`)
        let number = Number(n);
        let newFiles = new Array();
        newFiles = files;
        if(number === (newFiles.length)) {
            setTimeout(() => {
                setProgressDownload3D(100)
                setLoadingData3D('Recursos descargados')
                setTodoArchivo3DListo(true)
                setTimeout(() => {
                    setOpenDownload3D(false)
                    localStorage.setItem('isLoading3D', 'nok')
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
            setLoadingData3D(`Descargando modelo 3D de ${name}, ${brand} ${model}`)
            let res = await fetch(`${environment.storageURL}${files[number].url}`);
            const reader = res.body.getReader()
            /* console.log(reader) */
            const contentLength = + res.headers.get('Content-Length');
            let receivedLength = 0; // received that many bytes at the moment
            let chunks = []; // array of received binary chunks (comprises the body)
            setProgressDownload3D(0)
            setTimeout(async () => {
                while (true) {
                    const ele = await reader.read();
                    /* console.log(ele) */
                    if (ele.done) {
                        let chunksAll = new Uint8Array(receivedLength); // (4.1)
                        let position = 0;
                        for(let chunk of chunks) {
                            chunksAll.set(chunk, position); // (4.2)
                            position += chunk.length;
                        }
                        /* const reader = new FileReader()
                        let source
                        reader.onload = (ev) => {
                            source = ev.target.result
                        }
                        console.log(chunksAll)
                        let result = reader.readAsBinaryString(chunksAll) */
                        const decoder = new TextDecoder("utf-8")
                        let result = decoder.decode(chunksAll) /* new TextDecoder("utf-8").decode(chunksAll); */
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
                    setProgressDownload3D((100*receivedLength)/contentLength)
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

    const obtenerModelos3D = async () => {
        let db = await FilesToStringDatabase.initDb3DFiles();
        let consulta = await FilesToStringDatabase.consultar(db.database);
        if(consulta.length > 0) {
            setMachines3D(consulta)
            setLoadingData3D(`Modelos 3D descargados.`)
            setTodoArchivo3DListo(true)
            setTimeout(() => {
                setProgressDownload3D(100)
                setTimeout(() => {
                    setOpenDownload3D(false)
                    localStorage.setItem('isLoading3D', 'nok')
                }, 1000);
            }, 1000);
        }else {
            let files = new Array();
            files = await get3dMachines();
            let n = 0;
            download3DFile(n, files, db)
        }
    }

    const provider = {
        downloadingData3D,
        progressDownload3D,
        openDownload3D,
        openVersion,
        todoArchivo3DListo
    }

    return (
        <Machines3DContext.Provider value={provider} {...props} />
    )
}

export const useMachines3DContext = () => useContext(Machines3DContext)