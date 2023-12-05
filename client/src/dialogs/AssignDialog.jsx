import { useState, useEffect, forwardRef } from 'react';
import { 
    Box, 
    Toolbar,
    Fab,
    Dialog,
    Slide,
    FormControl,
    InputLabel,
    MenuItem,
    Select,

} from '@material-ui/core';
import { Close } from '@material-ui/icons';
/* import { styleModalReport } from '../../config'; */
/* import { reportsRoutes, usersRoutes } from '../../routes'; */
/* import { SocketConnection } from '../../connections'; */
import { useAuth, useReportsContext, useSitesContext, useUsersContext } from '../context';
import { SocketConnection } from '../connections';
import { Button } from '@mui/material';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const AssignDialog = ({open, report, closeModal, reportType, onlyClose}) => {
    const {admin, userData} = useAuth()
    const {inspectors, maitenances} = useUsersContext()
    const {sites} = useSitesContext()
    const {saveReport} = useReportsContext()
    const [ operarios, setOperarios ] = useState([]);
    const [ colorState, setColorState ] = useState();
    const { idIndex, guide, state/* , siteName */, usersAssigned, site } = report;
    const [ stateAssignment , setStateAssignment ] = useState(false);
    const [ data, setData ] = useState('');
    const [ closeType, setCloseType ] = useState(false)
    const [ userAssigned, setUserAssigned ] = useState()
    const [reading, setReading] = useState(true)
    const [siteName, setSiteName] = useState('')
    const [messageOperarios, setMessageOperarios] = useState('')
    const [removeUserButton, setRemoveUserButton] = useState(true)
    useEffect(() => {
        if(usersAssigned.length > 0) {
            setRemoveUserButton(false)
        }
    },[usersAssigned])
    useEffect(() => {
        if (open) {
            setSiteNameById()
            if (reportType === 'Inspección') {
                const inspectorsCache = inspectors.sort((a, b) => {
                    if (a.name < b.name) {
                        return -1
                    }
                    if (a.mane > b.name) {
                        return 1
                    }
                    return 0
                })
                setOperarios(inspectorsCache)
            } else {
                const maintenancesCache = maitenances.sort((a, b) => {
                    if (a.name < b.name) {
                        return -1
                    }
                    if (a.mane > b.name) {
                        return 1
                    }
                    return 0
                })
                setOperarios(maintenancesCache)
            }
        }
    },[open])
    useEffect(() => {
        if (operarios)
        if (operarios.length > 0) {
            setReading(false)
        }
    },[operarios])
    useEffect(() => {
        console.log(report)
    },[report])
    const setSiteNameById = () => {
        console.log(sites)
        const filtered = sites.filter(siteToFilter => {if (site === siteToFilter.idobra) return siteToFilter})
        setSiteName(filtered[0].descripcion)
    }
    const setUserToReport = async (userId) => {
        if (userId.length > 0) {
            const userFiltered = operarios.filter(user => {if(userId===user._id) return user})[0]
            if (window.confirm(`Confirme que asignará a ${userFiltered.name} ${userFiltered.lastName} a la OT ${report.idIndex}`)) {
                const reportCache = report
                if (reportCache.usersAssigned) {
                    const usersAssigned = reportCache.usersAssigned
                    console.log(usersAssigned)
                    if (usersAssigned && usersAssigned.length > 0) {
                        usersAssigned.find((uid, n) => {
                            if (uid===userId) {
                                usersAssigned.splice(n, 1)
                            }
                        })
                        usersAssigned.unshift(userId)
                    } else {
                        usersAssigned.push(userId)
                    }
                    reportCache.usersAssigned = usersAssigned
                    reportCache.state = 'En proceso'
                    reportCache.level = 0
                    await saveReport(reportCache)
                    SocketConnection.sendnotificationToUser(
                        'nueva-asignacion',
                        `${userData._id}`,
                        userId,
                        'Asignaciones',
                        'Se ha asignado nueva OT',
                        `OT ${reportCache.idIndex} asignada a usted`,
                        '/assignment',
                        report._id
                        )
                }
                close()
            }
        }
    }

    const close = () => {
        if(closeType) {
            closeModal()
        }else{
            onlyClose()
        }
    }

    const getUsers = () => {
        let hableUser;
        console.log(reportType)
        if(reportType === 'Inspección') {
            hableUser === 'inspectionWorker'
            usersRoutes.getOperadores(admin).then(response => {
                const users = response.data.data.sort((a, b) => {
                    if (a.name < b.name) {
                      return -1;
                    }
                    if (a.name > b.name) {
                      return 1;
                    }
                    return 0;
                });
                const usersFiltered = users.filter(user => {
                    if (user.obras[0].idobra === site) {
                        return user
                    }
                })
                /* setOperarios(usersFiltered) */
                setReading(false)
            })
        }else if(reportType === 'Mantención') {
            hableUser === 'maintenceOperator'
            usersRoutes.getMantenedores(admin).then(response => {                
                const users = response.data.data.sort((a, b) => {
                    if (a.name < b.name) {
                      return -1;
                    }
                    if (a.name > b.name) {
                      return 1;
                    }
                    return 0;
                });
                const usersFiltered = users.filter(user => {
                    if (user.obras[0].idobra === site) {
                        return user
                    }
                })
                /* setOperarios(usersFiltered) */
                setReading(false)
            })
        }
    }

    useEffect(() => {
        /* console.log(report) */
        setUserAssigned(usersAssigned[0])
        setCloseType(false)
        if(state === 'Asignar') {
            setColorState('#DE4343');
        }else if(state === 'En proceso') {
            setColorState('#F2994A');
        }else if(state === 'Por cerrar') {
            setColorState('#F2C94C');
        }else if(state === 'Completadas') {
            setColorState('#27AE60');
        }     
    }, [guide])

    const borrarUltimaAsignacion = async () => {
        if (usersAssigned.length > 0) {
            console.log(usersAssigned)
            if (window.confirm(`Confirme que quitará a ${usersAssigned[0].name} ${usersAssigned[0].lastName} a la OT ${report.idIndex}`)) {
                const reportCache = report
                if (reportCache.usersAssigned) {
                    const usersAssigned = reportCache.usersAssigned.shift()
                    console.log(usersAssigned)
                    if (usersAssigned && usersAssigned.length > 0) {
                        usersAssigned.find((uid, n) => {
                            if (uid===userId) {
                                usersAssigned.splice(n, 1)
                            }
                        })
                        usersAssigned.unshift(userId)
                    } else {
                        usersAssigned.push(userId)
                    }
                    reportCache.usersAssigned = usersAssigned
                    reportCache.state = 'Asignar'
                    reportCache.level = 0
                    await saveReport(reportCache)
                    /* SocketConnection.sendnotificationToUser(
                        'nueva-asignacion',
                        `${userData._id}`,
                        userId,
                        'Asignaciones',
                        'Se ha asignado nueva OT',
                        `OT ${reportCache.idIndex} asignada a usted`,
                        '/assignment',
                        report._id
                        ) */
                }
                close()
            }
        }
    }
    
    return(
        <Dialog
            open={open}
            TransitionComponent={Transition}
            adaptiveHeight={true}
            >
            <div style={{padding: 30}} >
                <Toolbar style={{width: '100%', height: 70, paddingLeft: 0}}>
                    <h2>Asignar Pauta de <br /> {reportType} {guide}</h2>
                    <div style={{ position: 'absolute', right: 0 , backgroundColor: colorState, paddingTop: 3, borderRadius: 5, width: 100, height: 20, textAlign: 'center'}}>
                        <p style={{margin: 0, fontSize: 12}}>{state.toUpperCase()}</p>
                    </div>
                </Toolbar>
                <div style={{width: '100%', height: 90}}>
                    <div style={{width: 'calc(100%/3)', float: 'left', display: 'block', margin: 0}}>
                        <strong>Faena:</strong> <br />
                        {siteName}
                    </div>
                    <div style={{width: 'calc(100%/3)', float: 'left'}}>
                        <strong>Número de orden:</strong> <br />
                        {idIndex}
                    </div>
                    <div style={{width: 'calc(100%/3)', float: 'left', display: 'block', margin: 0}}>
                        <strong>Pauta:</strong> <br />
                        {guide}
                    </div>
                </div>
                <div style={{width: '100%', height: 59}}>
                    {stateAssignment && <div style={{width: 'calc(100%/3)', float: 'left'}}>
                        <strong>{data}</strong> <br />
                    </div>}
                </div>
                <FormControl fullWidth>
                    <InputLabel>Asignar Pauta a:</InputLabel>
                    <Select
                        /* labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper" */
                        value={(report.state === 'Asignar') ? null : usersAssigned[0]} onChange={(e)=>{setUserToReport(e.target.value)}}
                        label="Asignar Pauta a:"
                        disabled={reading}
                    >
                        <MenuItem style={{fontSize: 15}} >
                            {/* <p style={{margin: '0px 5px'}}> */}{reading ? 'Leyendo operarios. Espere...'.toUpperCase() : 'Seleccionar operario'.toUpperCase()}{/* </p> */}
                        </MenuItem>
                        {
                            operarios.map((user, i) => {
                                if (user.obras[0].idobra === site) {
                                    return(
                                        <MenuItem style={{fontSize: 15}} key={i} value={user._id}>
                                            {/* <p style={{margin: '0px 5px'}}> */}{`${user.name} ${user.lastName}`.toUpperCase()}{/* </p> */}
                                        </MenuItem>
                                    )
                                } else {
                                    null
                                }
                            })
                        }
                    </Select>
                    <br />
                    <Button disabled={removeUserButton} onClick={borrarUltimaAsignacion} style={{width: 150}} color='error'>
                        Quitar usuario
                    </Button>
                </FormControl>
                <Fab onClick={close} style={{position: 'absolute', right: 10, top: 10, boxShadow: 'none', backgroundColor: 'transparent'}}>
                    <Close style={{color: '#ccc'}} />
                </Fab>
            </div>
        </Dialog>
    )
}

export default AssignDialog