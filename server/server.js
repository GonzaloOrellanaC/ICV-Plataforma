import express from 'express'
import path from 'path'
import { ApiIcv } from './src/api-icv'

import { environment } from './src/config'
import { databaseLoader, expressLoader } from './src/loaders'
import { AccessControlServices } from './src/services'

const startServer = async () => {
    await databaseLoader()
    await AccessControlServices.initAccessControl();

    const machines = await ApiIcv.getAllPMList();
    //console.log(machines)
    if(machines) {
        machines.forEach(async (machine, index) => {
            const PMHeaderList = await ApiIcv.getAllPMHeaderAndStruct(machine.pIDPM);
            //console.log(PMHeaderList)
        });
    };

    /* const machinesToSend = await ApiIcv.downloadMachineBySite({pIDOBRA: '0372'});
    console.log(machinesToSend)*/

    const sitesCreated = await ApiIcv.createSiteToSend(); 
    if(sitesCreated) {
        console.log('Sitios creados!', sitesCreated);
        const readFileSites = await ApiIcv.leerArchivo('sitios');
        readFileSites.data.forEach(async(sitio, index) => {
            ApiIcv.createMachinesToSend(sitio.idobra);
            if(index == (readFileSites.data.length - 1)) {
                const readMachines = await ApiIcv.leerArchivo('maquinas');
                if(readMachines.state) {
                    console.log(readMachines.data)
                    readMachines.data.forEach((machine, i) => {
                        if(machine.modelo.includes('793')) {
                            console.log('Incluye Camión')
                        }else if(machine.modelo.includes('PC5500')) {
                            console.log('Incluye Pala')
                        }else{
                            console.log('No se detecta modelo')
                        }
                    })
                }
            }
        })
    }

    const app = await expressLoader();

    if(app) {
        console.log('Ok APP')
    }

    if (environment.env === 'production') {
        /* Solo se ejecuta en producción */
        console.info('The server is in production mode')
        app.use(express.static(path.resolve(__dirname, '../client/build')))

        app.get('/*', (req, res) => {
            res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'))
        })
    }else{
        console.info('The server is in development mode')
    }

    app.listen(environment.port, (err) => {
        if (err) {
            console.error('Express startup error: ', err)
            throw err
        }

        console.info(`Express server started in port: ${environment.port}`)
    })
}

startServer()
