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
import { AppliancePage, LoadingPage, LoginPage, MachinesPage, WelcomePage, ResetPasswordPage, DivisionsPage, ReportsPage, AlertPage, InfoPage, ConfigurationPage, SitesPage } from './pages'

/* GraphQL Configuration */
const errorLink = onError(({ graphQLErrors, networkError, response }) => {
    if (networkError?.statusCode === 401) {
        console.log(`[Network error]: ${networkError.statusCode}`)
        // window.location.href = '/'
    }else{

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

    //console.log(isAuthenticated, loading)

    return (
        <Box height='100vh' display='flex' flexDirection='column' style={{fontFamily: 'Roboto'}}>
            {isAuthenticated && <Route path={['/']}>
                    {isAuthenticated && !loading && <Navbar />} {isAuthenticated && !loading && <Header />}
                </Route>}
            {/* <Backdrop className={classes.backDrop} open={navBarOpen} onClick={handleNavBar}/> */}
            <Switch>
                {!isAuthenticated && <Route exact path={['/reset-password']} render={() => (<ResetPasswordPage />)}/>}
                {!isAuthenticated && <Route path={['/']} render={() => (<LoginPage />)}/>}
                {loading && <Route path={['/']} render={() => (<LoadingPage />)}/>}
                <Route exact path={['/', '/welcome']} render={() => (
                    <WelcomePage />
                )}/>
                <Route path={['/divisions']}>
                    <Switch>
                        <Route exact path='/divisions'>
                            <DivisionsPage route={'divisions'}/>
                        </Route>
                    </Switch>
                </Route>
                <Route path={['/reports']}>
                    <Switch>
                        <Route exact path='/reports'>
                            <ReportsPage route={'reports'}/>
                        </Route>
                    </Switch>
                </Route>
                <Route path={['/alerts']}>
                    <Switch>
                        <Route exact path='/alerts'>
                            <AlertPage route={'alerts'}/>
                        </Route>
                    </Switch>
                </Route>
                <Route path={['/info']}>
                    <Switch>
                        <Route exact path='/info'>
                            <InfoPage route={'info'}/>
                        </Route>
                    </Switch>
                </Route>
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
                <Route path={['/sites']}>
                    <Switch>
                        <Route exact path='/sites'>
                            <SitesPage route={'sites'}/>
                        </Route>
                        {/* <Route exact path='/sites/:id'>
                            <AppliancePage route='sites'/>
                        </Route> */}
                    </Switch>
                </Route>
                <Route path={['/configuration']}>
                    <Switch>
                        <Route exact path='/configuration'>
                            <ConfigurationPage route={'configuration'}/>
                        </Route>
                    </Switch>
                </Route>
            </Switch>
            {/* <Route exact path='/vista-3d'>
                <Vista3D route='vista-3d' />
            </Route> */}
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
