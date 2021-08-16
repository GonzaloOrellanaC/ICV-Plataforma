import React, { createContext, useContext, useEffect, useState } from 'react'
import { faHome, faTools, faUserCog } from '@fortawesome/free-solid-svg-icons'
import { useLocation } from 'react-router-dom'
import { faChartBar, faClipboard } from '@fortawesome/free-regular-svg-icons'

const NavigationContext = createContext()

export const NavigationProvider = (props) => {
    const [navBarOpen, setNavBarOpen] = useState(false)
    const [locationData, setLocationData] = useState({
        icon: null,
        title: ''
    })

    const location = useLocation()

    useEffect(() => {
        const splitLocation = location?.pathname?.split('/')[1]

        switch (splitLocation) {
        case 'inspection':
            return setLocationData({
                icon: faClipboard,
                title: 'Inspección'
            })
        case 'maintenance':
            return setLocationData({
                icon: faTools,
                title: 'Mantención'
            })
        case 'reports':
            return setLocationData({
                icon: faChartBar,
                title: 'Reportes'
            })
        case 'configuration':
            return setLocationData({
                icon: faUserCog,
                title: 'Configuración'
            })
        default:
            return setLocationData({
                icon: faHome,
                title: 'Inicio'
            })
        }
    }, [location])

    const provider = {
        locationData,
        navBarOpen,
        handleNavBar: () => setNavBarOpen(!navBarOpen)
    }

    return (
        <NavigationContext.Provider value={provider} {...props} />
    )
}

export const useNavigation = () => useContext(NavigationContext)
