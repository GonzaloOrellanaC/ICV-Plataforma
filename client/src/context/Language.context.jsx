import React, { createContext, useContext, useState } from 'react'
import { dictionaryList, languageOptions } from '../language'

const LanguageContext = createContext({
    userLanguage: 'es',
    dictionary: dictionaryList.es,
    languageOptions
})

export const LanguageProvider = (props) => {
    const defaultLanguage = window.localStorage.getItem('rcml-lang')
    const [userLanguage, setUserLanguage] = useState(defaultLanguage || 'es')

    const provider = {
        userLanguage,
        dictionary: dictionaryList[userLanguage],
        languageOptions,
        userLanguageChange: (selected) => {
            const newLanguage = languageOptions[selected] ? selected : 'es'
            setUserLanguage(newLanguage)
            window.localStorage.setItem('rcml-lang', newLanguage)
        }
    }

    return (
        <LanguageContext.Provider value={provider} {...props} />
    )
}

export const useLanguage = () => useContext(LanguageContext)
