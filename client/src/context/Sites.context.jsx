import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./Auth.context";
import { sitesRoutes } from "../routes";
import { sitesDatabase } from "../indexedDB";
import { useConnectionContext } from "./Connection.context";

export const SitesContext = createContext()

export const SitesProvider = props => {
    const {isAuthenticated} = useAuth()
    const {isOnline} = useConnectionContext()
    const [sites, setSites] = useState([])
    const [sitesToSelection, setSitesToSelection] = useState([])
    const [siteSelected, setSiteSelected] = useState()

    useEffect(() => {
        if (isAuthenticated) {
            if (isOnline) {
                getSites()
            } else {
                getSitesOffLine()
            }
        }
    },[isAuthenticated])

    useEffect(() => {
        if (sites.length > 0) {
            console.log(sites)
            const sitesCache = []
            sites.forEach((site) => {
                if (site.status) {
                    sitesCache.push(site)
                }
            })
            setSitesToSelection(sitesCache)
        }
    }, [sites])

    const getSites = async () => {
        const response = await sitesRoutes.getSites()
        const {database} = await sitesDatabase.initDbObras()
        response.data.data.forEach(async (site, index) => {
            site.id = index
            await sitesDatabase.actualizar(site, database)
        })
        setSites(response.data.data.sort(orderByName))
    }

    const orderByName = (a, b) => {
        if (a.descripcion > b.descripcion) {
            return 1
        }
        if (a.descripcion < b.descripcion) {
            return -1
        }
        return 0
    }

    const getSitesOffLine = async () => {
        const {database} = await sitesDatabase.initDbObras()
        const sitesResponse = await sitesDatabase.consultar(database)
        setSites(sitesResponse)
    }

    const provider = {
        sites,
        siteSelected,
        setSiteSelected,
        sitesToSelection
    }

    return (
        <SitesContext.Provider value={provider} {...props} />
    )
}

export const useSitesContext = () => useContext(SitesContext)