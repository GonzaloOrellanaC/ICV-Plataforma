import React, { createContext, useContext, useEffect, useState } from 'react'
// import { faHome, faTools, faUserCog } from '@fortawesome/free-solid-svg-icons'
import { useLocation } from 'react-router-dom'
// import { faChartBar, faClipboard } from '@fortawesome/free-regular-svg-icons'
// import { useLanguage } from './Language.context'

const NavigationContext = createContext()

export const NavigationProvider = (props) => {
    const [navBarOpen, setNavBarOpen] = useState(false)
    // const { dictionary } = useLanguage()
    const [locationData, setLocationData] = useState('')

    const location = useLocation()

    useEffect(() => {
        const splitLocation = location?.pathname?.split('/')[1]

        setLocationData(splitLocation)
        /* switch (splitLocation) {
        case 'inspection':
            return setLocationData({
                icon: faClipboard,
                title: dictionary.location.inspection
            })
        case 'maintenance':
            return setLocationData({
                icon: faTools,
                title: dictionary.location.maintenance
            })
        case 'reports':
            return setLocationData({
                icon: faChartBar,
                title: dictionary.location.reports
            })
        case 'configuration':
            return setLocationData({
                icon: faUserCog,
                title: dictionary.location.configuration
            })
        default:
            return setLocationData({
                icon: faHome,
                title: dictionary.location.start
            })
        } */
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
