import { useState } from 'react';
import { apiIvcRoutes } from '../routes';

const [ machinesList, setMachineList ] = useState([])

const getMachinesData = () => {
    apiIvcRoutes.getMachines().then(data => {
        if(data.data) {
            setMachineList(data.data);
            if(machinesList.length > 0) {

            }
        }
    })
}

const getMachinesFilesFromServer = () => {
    
}

export default {
    getMachinesData
}