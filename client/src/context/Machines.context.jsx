import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./Auth.context";
import { apiIvcRoutes } from "../routes";
import { machinesDatabase, trucksDatabase } from "../indexedDB";
import { useConnectionContext } from "./Connection.context";

export const MachineContext = createContext()

export const MachineProvider = props => {
    const {isAuthenticated, site, admin} = useAuth()
    const [machines, setMachines] = useState([])
    const [machinesBySite, setMachinesBySite] = useState([])
    const [machineSelected, setMachineSelected] = useState()
    const {isOnline} = useConnectionContext()

    useEffect(() => {
        if(isAuthenticated) {
            if (isOnline) {
                getMachines()
            } else {
                console.log('Machines offline')
                getMachinesOffLine()
            }
        }
    },[isAuthenticated, isOnline])

    useEffect(() => {
        if (machines.length > 0) {
            console.log(machines)
            if (isOnline) {
                if (site)
                getMachinesBySite()
            } else {
                getMachinesBySiteOffLine()
            }
        }
    },[machines, isOnline, site])

    const getMachinesBySite = async () => {
        let response
        if (site && !admin) {
            response = await apiIvcRoutes.getMachineBySiteId(site.idobra)
        }
        if (admin) {
            response = await apiIvcRoutes.getAllMachines()
        }
        /* .then(machines => { */
        console.log(response)
        const {database} = await machinesDatabase.initDbMachines()
        response.data.forEach(async (machine, index) => {
            machine.id = index
            await machinesDatabase.actualizar(machine, database)
        })
        setMachinesBySite(response.data)
    }

    const getMachinesBySiteOffLine = async () => {
        const {database} = await machinesDatabase.initDbMachines()
        const machinesBySite = await machinesDatabase.consultar(database)
        setMachinesBySite(machinesBySite)
    }

    const getMachinesOffLine = async () => {
        const {database} = await trucksDatabase.initDbMachines()
        const response = await trucksDatabase.consultar(database)
        setMachines(response)
    }

    const getMachines = async () => {
        const response = await apiIvcRoutes.getMachines()
        const {database} = await trucksDatabase.initDbMachines()
        const machinesCache = [...response.data]
        machinesCache.forEach(async (fileName, index) => {
            fileName.id = index
            const xhr = new XMLHttpRequest()
            xhr.onload = async () => {
                let reader = new FileReader()
                reader.onload = async () => {
                    let image = {
                        id: index,
                        data: reader.result.replace("data:", "")
                    }
                    fileName.image = image
                    await trucksDatabase.actualizar(fileName, database)
                }
                reader.readAsDataURL(xhr.response)
            }
            xhr.open('GET', `/assets/${fileName.model}.png`)
            xhr.responseType = 'blob'
            xhr.send()
        })
        setMachines(machinesCache)
    }

    const provider = {
        setMachines,
        machines,
        machinesBySite,
        machineSelected,
        setMachineSelected
    }

    return (
        <MachineContext.Provider value={provider} {...props} />
    )
}

export const useMachineContext = () => useContext(MachineContext)