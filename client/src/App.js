/*  React */
import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

/* GraphQL */
import { ApolloClient, ApolloProvider, ApolloLink, InMemoryCache } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { createUploadLink } from 'apollo-upload-client'

/* Material UI */
import { CircularProgress, CssBaseline, IconButton, LinearProgress, ThemeProvider } from '@material-ui/core'
import { theme, download3DFiles, detectExecutionState } from './config'
import './App.css'
import { AuthProvider, ConnectionProvider, CreateUserProvider, ExecutionReportProvider, LanguageProvider, MachineProvider, NavigationProvider, ReportsProvider, SitesProvider, TimeProvider, UsersProvider, useAuth } from './context'
import { Header, Navbar } from './containers'
import { 
    AppliancePage, 
    LoadingPage, 
    LoginPage, 
    MachinesPage, 
    WelcomePage, 
    ResetPasswordPage, 
    /* DivisionsPage, */
    ReportsPage, 
    AlertPage, 
    InfoPage, 
    ConfigurationPage, 
    SitesPage,
    AdminPage,
    MaintencePage,
    PautaDetailPage,
    MachinesListPage,
    AdminUsersPage,
    AdminNewUserPage,
    CreateReports,
    NoPermissionPage,
    RestorePasswordPage,
    ActivitiesDetailPage,
    ActivitiesPage,
    InternalMessagesPage,
    NotificationsPage,
    OptionsPage
} from './pages';
import { PatternsPage, RolesPage, UserProfilePage } from './pages/administration'
import { Notifications } from 'react-push-notification';
import { SocketConnection } from './connections'
import { Close } from '@material-ui/icons'
import { NotificationsProvider } from './context/Notifications.context'

const errorLink = onError(({ networkError }) => {
    if (networkError?.statusCode === 401) {
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
    const [ openDownload3D, setOpenDownload3D ] = useState(false)
    const [ progressDownload3D, setProgressDownload3D ] = useState(0)
    const [ loadingData3D, setLoadingData3D ] = useState('')
    const { userData, loading, admin, isOperator, isSapExecutive, isShiftManager, isChiefMachinery, isAuthenticated } = useAuth()
    const readyToLoad = () => {
        initLoad3D()
    }
    const initLoad3D = () => {
        console.log('Iniciado 3D')
        iniciarDescarga3D()
    }
    useEffect(() => {
        console.log(isAuthenticated)
        if(isAuthenticated) {
            SocketConnection.sendIsActive(userData)
            /* detectExecutionState() */
        }
    }, [isAuthenticated])
    const iniciarDescarga3D = () => {
        setOpenDownload3D(true)
        localStorage.setItem('isLoading3D', 'ok')
        download3DFiles(setProgressDownload3D, setOpenDownload3D, setLoadingData3D, null)
    }
    const closeLoader = () => {
        if(confirm('Confirme cierre de carga de elementos 3D. Posiblemente no pueda verlos. Para volver a cargarlos vuelva a iniciar sesión.')){
            setOpenDownload3D(false)
        }
    }
    return (
        <div style={{fontFamily: 'Roboto'}}>
            {isAuthenticated && <Route path={['/']}>
            {isAuthenticated && !loading && <Navbar/>} {isAuthenticated && !loading && <Header/>}
                </Route>}
            <Switch>
                {!isAuthenticated && <Route exact path={['/reset-password']} render={() => (<ResetPasswordPage />)}/>}
                {!isAuthenticated && <Route exact path={['/restore-password/:id']} render={() => (<RestorePasswordPage />)}/>}
                {!isAuthenticated && <Route path={['/']} render={() => (<LoginPage />)}/>}
                {loading && <Route path={['/']} render={() => (<LoadingPage />)}/>}
                <Route exact path={['/', '/welcome']} render={() => (
                    <WelcomePage readyToLoad={readyToLoad} />
                )}/>
                {/* <Route path={['/divisions']}>
                    <Switch>
                        <Route exact path='/divisions'>
                            <DivisionsPage route={'divisions'}/>
                        </Route>
                    </Switch>
                </Route> */}
                {(
                    admin ||
                    (localStorage.getItem('role') === 'superAdmin') ||
                    isSapExecutive) && <Route path={['/internal-messages']}>
                    <Switch>
                        <Route exact path='/internal-messages'>
                            <InternalMessagesPage route={'internal-messages'}/>
                        </Route>
                    </Switch>
                </Route>}
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
                <Route path={['/user-profile']}>
                    <Switch>
                        <Route exact path='/user-profile'>
                            <UserProfilePage route={'user-profile'}/>
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
                <Route path={['/machines']}>
                    <Switch>
                        <Route exact path='/machines'>
                            <MachinesPage route={'machines'}/>
                        </Route>
                        <Route exact path='/machines/:id'>
                            <MachinesListPage route='machines'/>
                        </Route>
                        <Route exact path='/machines/machine-detail/:id'>
                            <AppliancePage route={'machines/machine-detail'}/>
                        </Route>
                    </Switch>
                </Route>
                {!isOperator && <Route path={['/maintenance']}>
                    <Switch>
                        <Route exact path='/maintenance'>
                            <NoPermissionPage route={'maintenance'}/>
                        </Route>
                    </Switch>
                </Route>}
                {(
                    isSapExecutive ||
                    admin ||
                    (localStorage.getItem('role') === 'superAdmin')
                    ) && <Route path={['/sites']}>
                    <Switch>
                        <Route exact path='/sites'>
                            <SitesPage route={'sites'}/>
                        </Route>
                    </Switch>
                </Route>}
                {(
                    /* isOperator ||
                    isShiftManager ||
                    isChiefMachinery || */
                    /* localStorage.getItem('role') !== ('admin') || */
                    !isSapExecutive
                    ) && <Route path={['/sites']}>
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
                <Route path={['/options']}>
                    <Switch>
                        <Route exact path='/options'>
                            <OptionsPage route={'options'}/>
                        </Route>
                    </Switch>
                </Route>
                <Route path={['/pauta-detail']}>
                    <Switch>
                        <Route exact path='/pauta-detail/:id'>
                            <PautaDetailPage route={'pauta-detail'}/>
                        </Route>
                    </Switch>
                </Route>
                <Route path={['/administration']}>
                    <Switch>
                        <Route exact path='/administration'>
                            {
                                admin ?
                                <AdminPage route={'administration'} />
                                :
                                <NoPermissionPage route={'administration'}/>
                            }
                        </Route>
                    </Switch>
                </Route>
                {(
                    isSapExecutive ||
                    admin ||
                    (localStorage.getItem('role') === 'sapExecutive') ||
                    (localStorage.getItem('role') === 'superAdmin')
                    ) && <Route path={['/users']}>
                    <Switch>
                        <Route exact path='/users'>
                            <AdminUsersPage route={'users'}/>
                        </Route>
                    </Switch>
                </Route>}
                {(
                    isOperator ||
                    isShiftManager ||
                    isChiefMachinery ||
                    localStorage.getItem('role') !== ('admin') ||
                    (localStorage.getItem('role') !== 'sapExecutive') || (localStorage.getItem('role') !== 'superAdmin')) && <Route path={['/users']}>
                    <Switch>
                        <Route exact path='/users'>
                            <NoPermissionPage route={'users'}/>
                        </Route>
                    </Switch>
                </Route>}
                {(
                    isSapExecutive ||
                    admin ||
                    (localStorage.getItem('role') === 'sapExecutive') ||
                    (localStorage.getItem('role') === 'superAdmin')
                    ) && <Route path={['/new-users']}>
                    <Switch>
                        <Route exact path='/new-users'>
                            <AdminNewUserPage route={'new-users'}/>
                        </Route>
                    </Switch>
                </Route>}
                {(
                    isOperator ||
                    isShiftManager ||
                    isChiefMachinery ||
                    localStorage.getItem('role') !== ('admin') ||
                    (localStorage.getItem('role') !== 'sapExecutive') ||
                    (localStorage.getItem('role') !== 'superAdmin')
                    ) && <Route path={['/new-users']}>
                    <Switch>
                        <Route exact path='/new-users'>
                            <NoPermissionPage route={'new-users'}/>
                        </Route>
                    </Switch>
                </Route>}
                {(
                    admin ||
                    (localStorage.getItem('role') === 'superAdmin')
                    ) && <Route path={['/roles']}>
                    <Switch>
                        <Route exact path='/roles'>
                            <RolesPage route={'roles'}/>
                        </Route>
                    </Switch>
                </Route>}
                <Route path={['/patterns']}>
                    <Switch>
                        <Route exact path='/patterns'>
                            <PatternsPage route={'roles'}/>
                        </Route>
                    </Switch>
                </Route>
                <Route path={['/edit-user']}>
                    <Switch>
                        <Route exact path='/edit-user/:id'>
                            <AdminNewUserPage route={'edit-user'}/>
                        </Route>
                    </Switch>
                </Route>
                <Route path={['/assignment']}>
                    <Switch>
                        <Route path='/assignment/:id'>
                            <ActivitiesDetailPage route={'assignment'}/>
                        </Route>
                    </Switch>
                    <Switch>
                        <Route exact path='/assignment'>
                            <ActivitiesPage route={'assignment'}/>
                        </Route>
                    </Switch>
                </Route>
                <Route path={['/notifications']}>
                    <Switch>
                        <Route exact path='/notifications'>
                            <NotificationsPage route={'notifications'}/>
                        </Route>
                    </Switch>
                </Route>
            </Switch>
            {
                (navigator.onLine && openDownload3D) && 
                <div style={
                    {
                        position: 'absolute', 
                        bottom: 20, 
                        right: 20, 
                        width: 300, 
                        paddingTop: 50, 
                        paddingBottom: 40, 
                        paddingLeft: 20, 
                        paddingRight: 20,
                        borderRadius: 20,
                        backgroundColor: '#fff',
                        borderColor: '#ccc',
                        borderWidth: 1,
                        borderStyle: 'solid',
                        textAlign: 'center',
                        zIndex: 2
                    }
                }>
                    <IconButton style={{ position: 'absolute', top: 10, right: 10 }} onClick={() => {closeLoader()}}>
                        <Close />
                    </IconButton>
                    {
                        !loadingData3D && <CircularProgress color='primary' />
                    }
                    {
                        !loadingData3D && <p style={{margin: 0, marginTop: 10}}>Cargando datos...</p>
                    }
                    {
                        loadingData3D && <LinearProgress variant="determinate" value={progressDownload3D} />
                    }
                    {
                        loadingData3D && <p style={{margin: 0, marginTop: 10}}>{loadingData3D}</p>
                    }
                </div>
            }
        </div>
    )
}

/*  Main app component, activates providers for the whole app (Theme, Snackbar, Apollo and AuthContext) */
const App = () => {   
    return (
        <Router>
            <Notifications />
            <ApolloProvider client={client}>
                <ConnectionProvider>
                    <AuthProvider>
                        <SitesProvider>
                            <LanguageProvider>
                                <NavigationProvider>
                                    <UsersProvider>
                                        <ReportsProvider>
                                            <ExecutionReportProvider>
                                                <CreateUserProvider>
                                                    <TimeProvider>
                                                        <MachineProvider>
                                                            <NotificationsProvider>
                                                                <ThemeProvider theme={theme} >
                                                                    <CssBaseline />
                                                                    <OnApp />
                                                                </ThemeProvider>
                                                            </NotificationsProvider>
                                                        </MachineProvider>
                                                    </TimeProvider>
                                                </CreateUserProvider>
                                            </ExecutionReportProvider>
                                        </ReportsProvider>
                                    </UsersProvider>
                                </NavigationProvider>
                            </LanguageProvider>
                        </SitesProvider>
                    </AuthProvider>
                </ConnectionProvider>
            </ApolloProvider>
        </Router>
    )
}

export default App
