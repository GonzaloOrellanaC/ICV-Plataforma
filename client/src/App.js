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
import { AuthProvider, LanguageProvider, NavigationProvider, useAuth } from './context'
import { Header, Navbar } from './containers'
import { InspectionPage, LoadingPage, LoginPage, WelcomePage } from './pages'

/* GraphQL Configuration */
const errorLink = onError(({ graphQLErrors, networkError, response }) => {
    if (networkError?.statusCode === 401) {
        console.log(`[Network error]: ${networkError.statusCode}`)
        // window.location.href = '/'
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

const OnApp = () => {
    const { isAuthenticated, loading } = useAuth()

    return (
        <Box height='100vh' display='flex' flexDirection='column'>
            <Header />
            {
                isAuthenticated && !loading &&
                <Navbar />
            }
            <Switch>
                {
                    !isAuthenticated &&
                    <Route
                        path={[
                            '/'
                        ]}
                        render={() => (
                            <LoginPage />
                        )}
                    />
                }
                {
                    loading &&
                    <Route
                        path={[
                            '/'
                        ]}
                        render={() => (
                            <LoadingPage />
                        )}
                    />
                }
                <Route
                    exact path={[
                        '/', '/welcome'
                    ]}
                    render={() => (
                        <WelcomePage />
                    )}
                />
                <Route
                    path={[
                        '/inspection'
                    ]}
                    render={() => (
                        <InspectionPage />
                    )}
                />
            </Switch>
        </Box>
    )
}

/*  Main app component, activates providers for the whole app (Theme, Snackbar, Apollo and AuthContext) */
function App () {
    return (
        <Router>
            <ApolloProvider client={client}>
                <AuthProvider>
                    <LanguageProvider>
                        <NavigationProvider>
                            <ThemeProvider theme={theme} >
                                <CssBaseline />
                                <OnApp />
                            </ThemeProvider>
                        </NavigationProvider>
                    </LanguageProvider>
                </AuthProvider>
            </ApolloProvider>
        </Router>
    )
}

export default App
