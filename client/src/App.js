/*  React */
import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

/* GraphQL */
import { ApolloClient, ApolloProvider, ApolloLink, InMemoryCache } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { createUploadLink } from 'apollo-upload-client'

/* Material UI */
import { Box, CssBaseline, ThemeProvider } from '@material-ui/core'
import { theme } from './config'

import './App.css'
import { AuthProvider, LanguageProvider } from './context'
import { Header } from './containers/header'
import { LoginPage } from './pages/login'

/* GraphQL Configuration */
const errorLink = onError(({ graphQLErrors, networkError, response }) => {
    if (networkError?.statusCode === 401) {
        console.log(`[Network error]: ${networkError.statusCode}`)
        window.location.href = '/'
    }
})

const httpLink = createUploadLink({
    uri: '/graphql',
    credentials: 'include'
})

const link = ApolloLink.from([
    errorLink,
    httpLink
])

const client = new ApolloClient({
    link: link,
    cache: new InMemoryCache()
})

/*  Main app component, activates providers for the whole app (Theme, Snackbar, Apollo and AuthContext) */
function App () {
    return (
        <Router>
            <AuthProvider>
                <LanguageProvider>
                    <ThemeProvider theme={theme} >
                        <CssBaseline />
                        <ApolloProvider client={client}>
                            <Box height='100vh' display='flex' flexDirection='column'>
                                <Header />
                                <Switch>
                                    <Route
                                        path={[
                                            '/'
                                        ]}
                                        render={() => (
                                            <LoginPage />
                                        )}
                                    />
                                </Switch>
                            </Box>
                        </ApolloProvider>
                    </ThemeProvider>
                </LanguageProvider>
            </AuthProvider>
        </Router>
    )
}

export default App
