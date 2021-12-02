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
