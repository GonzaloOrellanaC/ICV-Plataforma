import getInfo from './getInfo';
import download3DFiles from './download3DFiles';
import { FilesToStringDatabase } from '../../indexedDB';

const readData = (
    setOpenLoader,
    setLoadingData,
    getTrucksList,
    setProgress,
    getMachinesList,
    setLastActualization,
    setDisableButtons, 
    setOpenVersion,
    network,
    readyToLoad
) => {
    return new Promise(async resolve => {
        const revisarData = await getInfo.setIfNeedReadDataAgain(setDisableButtons);
        const userRole = localStorage.getItem('role');
        if(revisarData.state) {
            if(revisarData.data === 'full') {
                setOpenLoader(true);
                if(userRole==='admin'||userRole==='superAdmin'||userRole==='sapExecutive') {
                    setTimeout(async () => {
                        setLoadingData('Descargando pautas de mantenimiento e inspección.');
                        const estadoDescargaPautas = await getInfo.descargarPautas(setProgress);
                        if(estadoDescargaPautas.state) {
                            setTimeout( async () => {
                                setLoadingData('Descargando datos de las obras.');
                                const responseSites = await getInfo.getSites(setProgress, setDisableButtons);
                                setTimeout(async () => {
                                    if(responseSites) {
                                        setLoadingData('Descargando datos de las máquinas.')
                                        setProgress(65)
                                        const responseTrucks = await getTrucksList();
                                        setTimeout(async() => {
                                            if(responseTrucks) {
                                                setLoadingData('Descargando lista de las máquinas de las obras.')
                                                setProgress(100)
                                                const getMachines = await getMachinesList();
                                                if(getMachines) {
                                                    setTimeout(() => {
                                                        setOpenLoader(false)
                                                        resolve(true)
                                                        readyToLoad()
                                                    }, 1000);
                                                    //download3DFiles(setProgress, setOpenLoader, setLoadingData, setOpenVersion);
                                                    setLastActualization()
                                                } 
                                            }else{
                                                setOpenLoader(false)
                                                resolve(true)
                                                readyToLoad()
                                            }
                                        }, 1000);
                                    }else{
                                        setOpenLoader(false)
                                        resolve(true)
                                        readyToLoad()
                                    }
                                }, 1000);
                            }, 1000);
                        }
                    }, 500);
                }else{
                        setLoadingData('Descargando pautas de mantenimiento e inspección.');
                        const estadoDescargaPautas = await getInfo.descargarPautas(setProgress);
                        if(estadoDescargaPautas.state) {
                            setTimeout( async () => {
                                setLoadingData('Descargando datos de las obras.');
                                const responseSites = await getInfo.getSites(setProgress, setDisableButtons);
                                setTimeout(async () => {
                                    if(responseSites) {
                                        setLoadingData('Descargando datos de las máquinas.')
                                        setProgress(65)
                                        const responseTrucks = await getTrucksList();
                                        setTimeout(async() => {
                                            
                                            setLastActualization()
                                            setProgress(100)
                                            if(responseTrucks) {
                                                setLoadingData('Descargando lista de las máquinas de las obras.')
                                                setProgress(100)
                                                const getMachines = await getMachinesList();
                                                 if(getMachines) {
                                                    //download3DFiles(setProgress, setOpenLoader, setLoadingData, setOpenVersion);
                                                    setLastActualization()
                                                    setTimeout(() => {
                                                        setOpenLoader(false)
                                                        resolve(true)
                                                        readyToLoad()
                                                    }, 1000);
                                                } 
                                                setLastActualization()
                                            }else{
                                                setOpenLoader(false)
                                                resolve(true)
                                                readyToLoad()
                                            }
                                        }, 1000);
                                    }else{
                                        setOpenLoader(false)
                                        resolve(true)
                                        readyToLoad()
                                    }
                                }, 1000);
                            }, 1000);
                        }
                    /* } */
                }
            }else if(revisarData.data === 'reload') {
                
            }
        }else{
            resolve(true)
            setOpenLoader(false)
            readyToLoad()
        }
    })
}

export default readData
