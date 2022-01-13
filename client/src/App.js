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
import { 
    AppliancePage, 
    LoadingPage, 
    LoginPage, 
    MachinesPage, 
    WelcomePage, 
    ResetPasswordPage, 
    DivisionsPage, 
    ReportsPage, 
    AlertPage, 
    InfoPage, 
    ConfigurationPage, 
    SitesPage,
    AdminPage,
    MaintencePage,
    PmsPage,
    PautaDetailPage,
    MachinesListPage,
    AdminUsersPage,
    AdminNewUserPage,
    CreateReports,
    NoPermissionPage,
    RestorePasswordPage,
    ActivitiesDetailPage,
    ActivitiesPage
} from './pages';

const errorLink = onError(({ graphQLErrors, networkError, response }) => {
    if (networkError?.statusCode === 401) {
        /* console.log(networkError)
        console.log(`[Network error]: ${networkError.statusCode}`)
        console.log(graphQLErrors)
        console.log(response) */
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
});
    

const OnApp = () => {
    const { isAuthenticated, loading, admin } = useAuth();
    return (
        <div style={{fontFamily: 'Roboto'}}>
            {isAuthenticated && <Route path={['/']}>
                    {isAuthenticated && !loading && <Navbar/>} {isAuthenticated && !loading && <Header />}
                </Route>}
            <Switch>
                {!isAuthenticated && <Route exact path={['/reset-password']} render={() => (<ResetPasswordPage />)}/>}
                {!isAuthenticated && <Route exact path={['/restore-password/:id']} render={() => (<RestorePasswordPage />)}/>}
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
                            <ReportsPage route='reports'/>
                        </Route>
                        <Route exact path='/reports/create-report'>
                            <CreateReports route='reports'/>
                        </Route>
                        <Route exact path='/reports/edit-report/:id'>
                            <CreateReports route='reports'/>
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
                {((localStorage.getItem('role') === 'inspectionWorker')||(localStorage.getItem('role') === ('admin') || (localStorage.getItem('role') === 'sapExecutive') || (localStorage.getItem('role') === 'superAdmin'))
                ) && <Route path={['/inspection']}>
                    <Switch>
                        <Route exact path='/inspection'>
                            <MachinesPage route={'inspection'}/>
                        </Route>
                        <Route exact path='/inspection/:id'>
                            <MachinesListPage route='inspection'/>
                        </Route>
                        <Route exact path='/inspection/machine-detail/:id'>
                            <AppliancePage route={'inspection/machine-detail'}/>
                        </Route>
                    </Switch>
                </Route>}
                { !(localStorage.getItem('role') === 'inspectionWorker') && <Route path={['/inspection']}>
                    <Switch>
                        <Route exact path='/inspection'>
                            <NoPermissionPage route={'inspection'}/>
                        </Route>
                    </Switch>
                </Route>}
                {((localStorage.getItem('role') === 'maintenceOperator') ||(localStorage.getItem('role') === ('admin') || (localStorage.getItem('role') === 'sapExecutive') || (localStorage.getItem('role') === 'superAdmin')))
                 && <Route path={['/maintenance']}>
                    <Switch>
                        <Route exact path='/maintenance'>
                            <MachinesPage route={'maintenance'}/>
                        </Route>
                        <Route exact path='/maintenance/:id'>
                            <MachinesListPage route='maintenance'/>
                        </Route>
                        <Route exact path='/maintenance/machine-detail/:id'>
                            <AppliancePage route={'maintenance/machine-detail'}/>
                        </Route>
                    </Switch>
                </Route>}
                { !(localStorage.getItem('role') === 'maintenceOperator') && <Route path={['/maintenance']}>
                    <Switch>
                        <Route exact path='/maintenance'>
                            <NoPermissionPage route={'maintenance'}/>
                        </Route>
                    </Switch>
                </Route>}
                {(localStorage.getItem('role') === ('admin') || (localStorage.getItem('role') === 'sapExecutive') || (localStorage.getItem('role') === 'superAdmin')) &&<Route path={['/sites']}>
                    <Switch>
                        <Route exact path='/sites'>
                            <SitesPage route={'sites'}/>
                        </Route>
                    </Switch>
                </Route>}
                {(localStorage.getItem('role') !== ('admin') || localStorage.getItem('role') !== 'sapExecutive') &&<Route path={['/sites']}>
                    <Switch>
                        <Route exact path='/sites'>
                            <NoPermissionPage route={'sites'}/>
                        </Route>
                    </Switch>
                </Route>}
                <Route path={['/maintance']}>
                    <Switch>
                        <Route exact path='/maintance'>
                            <MaintencePage route={'maintance'}/>
                        </Route>
                    </Switch>
                </Route>
                <Route path={['/configuration']}>
                    <Switch>
                        <Route exact path='/configuration'>
                            <ConfigurationPage route={'configuration'}/>
                        </Route>
                    </Switch>
                </Route>
                {/* <Route path={['/pms']}>
                    <Switch>
                        <Route exact path='/pms'>
                            <PmsPage route={'pms'}/>
                        </Route>
                    </Switch>
                </Route> */}
                <Route path={['/pauta-detail']}>
                    <Switch>
                        <Route exact path='/pauta-detail/:id'>
                            <PautaDetailPage route={'pauta-detail'}/>
                        </Route>
                    </Switch>
                </Route>
                {(localStorage.getItem('role') === ('admin') || (localStorage.getItem('role') === 'sapExecutive') || (localStorage.getItem('role') === 'superAdmin')) && <Route path={['/administration']}>
                    <Switch>
                        <Route exact path='/administration'>
                            <AdminPage route={'administration'}/>
                        </Route>
                    </Switch>
                </Route> }
                {((localStorage.getItem('role') !== ('admin')) ||  (localStorage.getItem('role') !== 'sapExecutive') || (localStorage.getItem('role') !== 'superAdmin') ) && <Route path={['/administration']}>
                    <Switch>
                        <Route exact path='/administration'>
                            <NoPermissionPage route={'administration'}/>
                        </Route>
                    </Switch>
                </Route>}
                {(localStorage.getItem('role') === ('admin') || (localStorage.getItem('role') === 'sapExecutive') || (localStorage.getItem('role') === 'superAdmin')) && <Route path={['/users']}>
                    <Switch>
                        <Route exact path='/users'>
                            <AdminUsersPage route={'users'}/>
                        </Route>
                    </Switch>
                </Route>}
                {(localStorage.getItem('role') !== ('admin') ||  (localStorage.getItem('role') !== 'sapExecutive') || (localStorage.getItem('role') !== 'superAdmin')) && <Route path={['/users']}>
                    <Switch>
                        <Route exact path='/users'>
                            <NoPermissionPage route={'users'}/>
                        </Route>
                    </Switch>
                </Route>}
                {(localStorage.getItem('role') === ('admin') || (localStorage.getItem('role') === 'sapExecutive') || (localStorage.getItem('role') === 'superAdmin')) && <Route path={['/new-users']}>
                    <Switch>
                        <Route exact path='/new-users'>
                            <AdminNewUserPage route={'new-users'}/>
                        </Route>
                    </Switch>
                </Route>}
                {(localStorage.getItem('role') !== ('admin') ||  (localStorage.getItem('role') !== 'sapExecutive') || (localStorage.getItem('role') !== 'superAdmin') ) && <Route path={['/new-users']}>
                    <Switch>
                        <Route exact path='/new-users'>
                            <NoPermissionPage route={'new-users'}/>
                        </Route>
                    </Switch>
                </Route>}
                <Route path={['/edit-user']}>
                    <Switch>
                        <Route exact path='/edit-user/:id'>
                            <AdminNewUserPage route={'edit-user'}/>
                        </Route>
                    </Switch>
                </Route>
                <Route path={['/activities']}>
                    <Switch>
                        <Route exact path='/activities/:id'>
                            <ActivitiesDetailPage route={'activities'}/>
                        </Route>
                    </Switch>
                    <Switch>
                        <Route exact path='/activities'>
                            <ActivitiesPage route={'activities'}/>
                        </Route>
                    </Switch>
                </Route>
            </Switch>
        </div>
    )
}

/*  Main app component, activates providers for the whole app (Theme, Snackbar, Apollo and AuthContext) */
const App = () => {   

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
    );
    
}

export default App
