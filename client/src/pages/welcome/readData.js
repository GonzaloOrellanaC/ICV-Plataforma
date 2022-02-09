import getInfo from './getInfo';
import download3DFiles from './download3DFiles';

export default async (
    setOpenLoader,
    setLoadingData,
    getTrucksList,
    setProgress,
    getMachinesList,
    setLastActualization,
    setDisableButtons, 
    setNotificaciones1,
    setOpenVersion,
    network
) => {
    const revisarData = await getInfo.setIfNeedReadDataAgain(setDisableButtons, setNotificaciones1);
        const userRole = localStorage.getItem('role');
        if(revisarData.state) {
            if(revisarData.data === 'full') {
                setOpenLoader(true);
                if(userRole==='admin'||userRole==='superAdmin'||userRole==='sapExecutive') {
                    setLoadingData('Descargando pautas de mantenimiento e inspección.');
                    const estadoDescargaPautas = await getInfo.descargarPautas(setProgress);
                    //console.log(estadoDescargaPautas)
                    if(estadoDescargaPautas.state) {
                        setTimeout( async () => {
                            setLoadingData('Descargando datos de las obras.');
                            const responseSites = await getInfo.getSites(setProgress, setDisableButtons, setNotificaciones1);
                            //console.log(responseSites)
                            setTimeout(async () => {
                                if(responseSites) {
                                    setLoadingData('Descargando datos de las máquinas.')
                                    setProgress(65)
                                    const responseTrucks = await getTrucksList();
                                    console.log(responseTrucks)
                                    setTimeout(async() => {
                                        if(responseTrucks) {
                                            setLoadingData('Descargando lista de las máquinas de las obras.')
                                            setProgress(100)
                                            const getMachines = await getMachinesList();
                                            if(getMachines) {
                                                download3DFiles(setProgress, setOpenLoader, setLoadingData, setOpenVersion);
                                                setLastActualization()
                                            }
                                        }else{
                                            setOpenLoader(false)
                                        }
                                    }, 1000);
                                }else{
                                    setOpenLoader(false)
                                }
                            }, 1000);
                        }, 1000);
                    }
                }else{
                    setLoadingData('Actualizando asignaciones.');
                    const assignMentResolve = await getInfo.getAssignments(setProgress);
                    console.log(assignMentResolve)
                    if(assignMentResolve) {
                        setLoadingData('Descargando pautas de mantenimiento e inspección.');
                        const estadoDescargaPautas = await getInfo.descargarPautas(setProgress);
                        console.log(estadoDescargaPautas)
                        if(estadoDescargaPautas.state) {
                            setTimeout( async () => {
                                setLoadingData('Descargando datos de las obras.');
                                const responseSites = await getInfo.getSites(setProgress, setDisableButtons, setNotificaciones1);
                                setTimeout(async () => {
                                    if(responseSites) {
                                        setLoadingData('Descargando datos de las máquinas.')
                                        setProgress(65)
                                        const responseTrucks = await getTrucksList();
                                        console.log(responseTrucks)
                                        setTimeout(async() => {
                                            if(responseTrucks) {
                                                setLoadingData('Descargando lista de las máquinas de las obras.')
                                                setProgress(100)
                                                const getMachines = await getMachinesList();
                                                if(getMachines) {
                                                    download3DFiles(setProgress, setOpenLoader, setLoadingData, setOpenVersion);
                                                    setLastActualization()
                                                }
                                            }else{
                                                setOpenLoader(false)
                                            }
                                        }, 1000);
                                    }else{
                                        setOpenLoader(false)
                                    }
                                }, 1000);
                            }, 1000);
                        }
                    }
                }
            }else if(revisarData.data === 'reload') {
                /*if(userRole==='admin'||userRole==='superAdmin'||userRole==='sapExecutive') {
                    setLastActualization()
                }else{
                    if(localStorage.getItem('timeOffline') && !localStorage.getItem('revisado')) {
                        if(network && (Number(localStorage.getItem('timeOffline')) < (Date.now() - 21600000))) {
                            if(confirm('Más de 6 horas de desconexión. ¿Desea actualizar el servicio?')) {
                                setOpenLoader(true)
                                setLoadingData('Actualizando asignaciones.');
                                const assignMentResolve = await getInfo.getAssignments(setProgress);
                                console.log(assignMentResolve)
                                if(assignMentResolve) {
                                    setLoadingData('Descargando pautas de mantenimiento e inspección.');
                                    const estadoDescargaPautas = await getInfo.descargarPautas(setProgress);
                                    if(estadoDescargaPautas.state) {
                                        setTimeout( async () => {
                                            setLoadingData('Descargando datos de las obras.');
                                            const responseSites = await getInfo.getSites(setProgress, setDisableButtons, setNotificaciones1);
                                            setTimeout(async () => {
                                                if(responseSites) {
                                                    setLoadingData('Descargando datos de las máquinas.')
                                                    setProgress(65)
                                                    const responseTrucks = await getTrucksList();
                                                    console.log(responseTrucks)
                                                    setTimeout(async() => {
                                                        if(responseTrucks) {
                                                            setLoadingData('Descargando lista de las máquinas de las obras.')
                                                            setProgress(100)
                                                            const getMachines = await getMachinesList();
                                                            if(getMachines) {
                                                                setLoadingData('Recursos actualizados.');
                                                                setLastActualization()
                                                                setTimeout(() => {
                                                                    setOpenLoader(false);
                                                                    localStorage.setItem('revisado', true);
                                                                    localStorage.removeItem('timeOffline');
                                                                }, 1000);
                                                            }
                                                        }else{
                                                            setOpenLoader(false)
                                                        }
                                                    }, 1000);
                                                }else{
                                                    setOpenLoader(false)
                                                }
                                            }, 1000);
                                        }, 1000);
                                    }
                                }
                            }
                        }
                    }else{
                        if(network && (Number(localStorage.getItem('ultimaActualizacion')) + 28800000) < Date.now()) {
                            if(confirm('Han pasado más de 8 horas desde la última sincronización. Confirme para registrar datos actualizados.')) {
                                setOpenLoader(true)
                                setLoadingData('Actualizando asignaciones.');
                                const assignMentResolve = await getInfo.getAssignments(setProgress);
                                console.log(assignMentResolve)
                                if(assignMentResolve) {
                                    setLoadingData('Descargando pautas de mantenimiento e inspección.');
                                    const estadoDescargaPautas = await getInfo.descargarPautas(setProgress);
                                    if(estadoDescargaPautas.state) {
                                        setTimeout( async () => {
                                            setLoadingData('Descargando datos de las obras.');
                                            const responseSites = await getInfo.getSites(setProgress, setDisableButtons, setNotificaciones1);
                                            setTimeout(async () => {
                                                if(responseSites) {
                                                    setLoadingData('Descargando datos de las máquinas.')
                                                    setProgress(65)
                                                    const responseTrucks = await getTrucksList();
                                                    console.log(responseTrucks)
                                                    setTimeout(async() => {
                                                        if(responseTrucks) {
                                                            setLoadingData('Descargando lista de las máquinas de las obras.')
                                                            setProgress(100)
                                                            const getMachines = await getMachinesList();
                                                            if(getMachines) {
                                                                setLoadingData('Recursos actualizados.');
                                                                setLastActualization()
                                                                setTimeout(() => {
                                                                    setOpenLoader(false);
                                                                    localStorage.setItem('revisado', true);
                                                                    localStorage.removeItem('timeOffline');
                                                                }, 1000);
                                                            }
                                                        }else{
                                                            setOpenLoader(false)
                                                        }
                                                    }, 1000);
                                                }else{
                                                    setOpenLoader(false)
                                                }
                                            }, 1000);
                                        }, 1000);
                                    }
                                }
                            }
                        }
                    }
                }*/
            }
        }else{
            setOpenLoader(false)
        }
}