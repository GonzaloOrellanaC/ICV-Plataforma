/*  React */
import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom'

/* GraphQL */
import { ApolloClient, ApolloProvider, ApolloLink, InMemoryCache } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { createUploadLink } from 'apollo-upload-client'

/* Material UI */
import { CssBaseline, ThemeProvider } from '@material-ui/core'
import { theme } from './config'
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
    const navigate = useNavigate()
    /* download3DFiles: Archivo para descargar los modelos 3D */
    
    const { userData, loading, admin, isOperator, isSapExecutive, isShiftManager, isChiefMachinery, isAuthenticated } = useAuth()
    useEffect(() => {
        console.log(isAuthenticated)
        /* if(!isAuthenticated) {
            navigate('/')
        } */
        if(isAuthenticated && userData) {
            SocketConnection.sendIsActive(userData)
        }
    }, [isAuthenticated])

    return (
        <div style={{fontFamily: 'Roboto'}}>
            {isAuthenticated && !loading && <Navbar/>} {isAuthenticated && !loading && <Header/>}
            <Routes>
                {!isAuthenticated && <Route exact path={'/reset-password'} element={<ResetPasswordPage />}/>}
                {!isAuthenticated && <Route exact path={'/restore-password/:id'} element={<RestorePasswordPage />}/>}
                <Route path={'/login'} element={<LoginPage />} />
                <Route path='/welcome' element={<WelcomePage />} />
                <Route path='/' element={<Navigate to={!isAuthenticated ? '/login' : '/welcome'} />} />
                <Route path={'/internal-messages'} element={(admin || isSapExecutive) && <InternalMessagesPage route={'internal-messages'}/>} />
                <Route exact path='/reports' element={<ReportsPage route='reports'/>} />
                <Route exact path='/reports/create-report' element={<CreateReports route='reports'/>} />
                <Route exact path='/reports/edit-report/:id' element={<CreateReports route='reports'/>} />
                <Route exact path='/alerts' element={<AlertPage route={'alerts'}/>} />
                <Route exact path='/user-profile' element={<UserProfilePage route={'user-profile'}/>} />
                <Route exact path='/info' element={<InfoPage route={'info'}/>}/>
                <Route exact path='/machines' element={<MachinesPage route={'machines'}/>} />
                <Route exact path='/machines/:id' element={<MachinesListPage route='machines'/>} />
                <Route exact path='/machines/:el/machine-detail/:id' element={<AppliancePage route={'machines/machine-detail'}/>} />
                {!isOperator && <Route exact path='/maintenance' element={<NoPermissionPage route={'maintenance'}/>} /> }
                {(
                    isSapExecutive ||
                    admin ||
                    (localStorage.getItem('role') === 'superAdmin')
                    ) && <Route exact path='/sites' element={<SitesPage route={'sites'}/>} /> }
                {(
                    !isSapExecutive
                    ) && <Route exact path='/sites' element={<NoPermissionPage route={'sites'}/>} /> }
                <Route exact path='/maintance' element={<MaintencePage route={'maintance'}/>} />
                <Route exact path='/configuration' element={<ConfigurationPage route={'configuration'}/>}/>
                <Route exact path='/options' element={<OptionsPage route={'options'}/>} />
                <Route exact path='/pauta-detail/:id' element={<PautaDetailPage route={'pauta-detail'}/>} />
                <Route exact path='/administration' element={admin ? <AdminPage route={'administration'} /> : <NoPermissionPage route={'administration'}/>} />
                {(
                    isSapExecutive ||
                    admin ||
                    (localStorage.getItem('role') === 'sapExecutive') ||
                    (localStorage.getItem('role') === 'superAdmin')
                    ) && <Route exact path='/users' element={<AdminUsersPage route={'users'}/>} />
                    }
                {(
                    isOperator ||
                    isShiftManager ||
                    isChiefMachinery ||
                    localStorage.getItem('role') !== ('admin') ||
                    (localStorage.getItem('role') !== 'sapExecutive') || (localStorage.getItem('role') !== 'superAdmin')) && 
                        <Route exact path='/users' element={<NoPermissionPage route={'users'}/>} />
                    }
                {(
                    isSapExecutive ||
                    admin ||
                    (localStorage.getItem('role') === 'sapExecutive') ||
                    (localStorage.getItem('role') === 'superAdmin')
                    ) && <Route exact path='/new-users' element={<AdminNewUserPage route={'new-users'}/>} />
                }
                {(
                    isOperator ||
                    isShiftManager ||
                    isChiefMachinery ||
                    localStorage.getItem('role') !== ('admin') ||
                    (localStorage.getItem('role') !== 'sapExecutive') ||
                    (localStorage.getItem('role') !== 'superAdmin')
                    ) && <Route exact path='/new-users' element={<NoPermissionPage route={'new-users'}/>} />
                    }
                {(
                    admin ||
                    (localStorage.getItem('role') === 'superAdmin')
                    ) && <Route exact path='/roles' element={<RolesPage route={'roles'}/>} />
                    }
                <Route exact path='/patterns' element={<PatternsPage route={'roles'}/>}/>
                <Route exact path='/edit-user/:id' element={<AdminNewUserPage route={'edit-user'}/>} />
                <Route path='/assignment/:id' element={<ActivitiesDetailPage route={'assignment'}/>} />
                <Route exact path='/assignment' element={<ActivitiesPage route={'assignment'}/>} />
                <Route exact path='/notifications' element={<NotificationsPage route={'notifications'}/>} />
            </Routes>
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
                        <NotificationsProvider>
                            <SitesProvider>
                                <LanguageProvider>
                                    <NavigationProvider>
                                        <UsersProvider>
                                            <ReportsProvider>
                                                <ExecutionReportProvider>
                                                    <CreateUserProvider>
                                                        <TimeProvider>
                                                            <MachineProvider>
                                                                <ThemeProvider theme={theme} >
                                                                    <CssBaseline />
                                                                    <OnApp />
                                                                </ThemeProvider>
                                                            </MachineProvider>
                                                        </TimeProvider>
                                                    </CreateUserProvider>
                                                </ExecutionReportProvider>
                                            </ReportsProvider>
                                        </UsersProvider>
                                    </NavigationProvider>
                                </LanguageProvider>
                            </SitesProvider>
                        </NotificationsProvider>
                    </AuthProvider>
                </ConnectionProvider>
            </ApolloProvider>
        </Router>
    )
}

export default App


{/* {
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
            } */}