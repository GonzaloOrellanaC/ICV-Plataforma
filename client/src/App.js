/*  React */
import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

/* GraphQL */
import { ApolloClient, ApolloProvider, ApolloLink, InMemoryCache } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { createUploadLink } from 'apollo-upload-client'

/* Material UI */
import { Backdrop, Box, CssBaseline, ThemeProvider } from '@material-ui/core'
import { theme, useStylesTheme } from './config'

import './App.css'
import { AuthProvider, LanguageProvider, NavigationProvider, useAuth, useNavigation } from './context'
import { Header, Navbar } from './containers'
import { AppliancePage, LoadingPage, LoginPage, MachinesPage, WelcomePage } from './pages'

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
    const { navBarOpen, handleNavBar } = useNavigation()
    const classes = useStylesTheme()

    console.log(isAuthenticated)

    return (
        <Box height='100vh' display='flex' flexDirection='column'>
            {isAuthenticated && <Route path={['/']}>
                <Header /> {isAuthenticated && !loading && <Navbar />}
            </Route>}
            <Backdrop className={classes.backDrop} open={navBarOpen} onClick={handleNavBar}/>
            <Switch>
                {!isAuthenticated && <Route path={['/']} render={() => (<LoginPage />)}/>}
                {loading && <Route path={['/']} render={() => (<LoadingPage />)}/>}
                <Route exact path={['/', '/welcome']} render={() => (<WelcomePage />)}/>
                <Route path={['/inspection']}>
                    <Switch>
                        <Route exact path='/inspection'>
                            <MachinesPage route={'inspection'}/>
                        </Route>
                        <Route exact path='/inspection/:id'>
                            <AppliancePage route='inspection'/>
                        </Route>
                    </Switch>
                </Route>
                <Route path={['/maintenance']}>
                    <Switch>
                        <Route exact path='/maintenance'>
                            <MachinesPage route={'maintenance'}/>
                        </Route>
                        <Route exact path='/maintenance/:id'>
                            <AppliancePage route='maintenance'/>
                        </Route>
                    </Switch>
                </Route>
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
