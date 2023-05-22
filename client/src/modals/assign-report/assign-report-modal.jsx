import { useState, useEffect } from 'react';
import { 
    Box, 
    Modal,
    Toolbar,
    Fab,

} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { styleModalReport } from '../../config';
import { reportsRoutes, usersRoutes } from '../../routes';
import { SocketConnection } from '../../connections';
import { useAuth, useReportsContext, useSitesContext, useUsersContext } from '../../context';

const AssignReportModal = ({open, report, closeModal, reportType, onlyClose}) => {
    const {admin, userData} = useAuth()
    const {inspectors, maitenances} = useUsersContext()
    const {sites} = useSitesContext()
    const {saveReport} = useReportsContext()
    const [ operarios, setOperarios ] = useState();
    const [ colorState, setColorState ] = useState();
    const { idIndex, guide, state/* , siteName */, usersAssigned, site } = report;
    const [ stateAssignment , setStateAssignment ] = useState(false);
    const [ data, setData ] = useState('');
    const [ closeType, setCloseType ] = useState(false)
    const [ userAssigned, setUserAssigned ] = useState()
    const [reading, setReading] = useState(true)
    const [siteName, setSiteName] = useState('')
    const [messageOperarios, setMessageOperarios] = useState('')
    useEffect(() => {
        if (open) {
            setSiteNameById()
            if (reportType === 'Inspección') {
                setOperarios(inspectors.sort((a, b) => {
                    if (a.name < b.name) {
                        return -1
                    }
                    if (a.mane > b.name) {
                        return 1
                    }
                    return 0
                }))
            } else {
                setOperarios(maitenances.sort((a, b) => {
                    if (a.name < b.name) {
                        return -1
                    }
                    if (a.mane > b.name) {
                        return 1
                    }
                    return 0
                }))
            }
        }
    },[open])
    useEffect(() => {
        if (operarios)
        if (operarios.length > 0) {
            setReading(false)
        }
    },[operarios])
    const setSiteNameById = () => {
        console.log(sites)
        const filtered = sites.filter(siteToFilter => {if (site === siteToFilter.idobra) return siteToFilter})
        setSiteName(filtered[0].descripcion)
    }
    const setUserToReport = async (userId) => {
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
            /* if (reportCache.state === 'Asignar') { */
                reportCache.state = 'En proceso'
                reportCache.level = 0
            /* } */
            saveReport(reportCache)
            SocketConnection.sendnotificationToUser(
                'nueva-asignacion',
                `${userData._id}`,
                userId,
                'Asignaciones',
                'Se ha asignado nueva OT',
                `OT ${reportCache.idIndex} asignada a usted`,
                '/assignment'
                )
        }
        close()
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
    
    return(
        <Modal
            open={open}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <Box sx={styleModalReport}>
                <Toolbar style={{width: '100%', height: 59, paddingLeft: 0}}>
                    <h2>Asignar Pauta de {reportType} {guide}</h2>
                    <div style={{ position: 'absolute', right: 65 , backgroundColor: colorState, paddingTop: 3, borderRadius: 5, width: 100, height: 20, textAlign: 'center'}}>
                        <p style={{margin: 0, fontSize: 12}}>{state.toUpperCase()}</p>
                    </div>
                </Toolbar>
                <div style={{width: '100%', height: 90}}>
                    <div style={{width: 'calc(100%/3)', float: 'left', display: 'block', margin: 0}}>
                        <strong>Faena:</strong> <br />
                        {siteName}
                    </div>
                    {/* <div style={{width: 'calc(100%/3)', float: 'left'}}>
                        <strong>Sector:</strong> <br />
                        Nombre del sector
                    </div> */}
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
                    {/* <div style={{width: 'calc(100%/3)', float: 'left', display: 'block', margin: 0}}>
                        <strong>Pauta:</strong> <br />
                        {guide}
                    </div> */}
                    {stateAssignment && <div style={{width: 'calc(100%/3)', float: 'left'}}>
                        <strong>{data}</strong> <br />
                        
                    </div>}


                </div>
                <div style={{width: '100%', height: 59}}>
                <label>Asignar Pauta a:</label>
                <br />
                <select disabled={reading} value={usersAssigned[0]} onChange={(e)=>{setUserToReport(e.target.value)/* ; setCloseType(true) */}} placeholder="Seleccionar operario" style={{height: 44, width: 274, borderStyle: 'solid', borderColor: '#C4C4C4', borderWidth: 1, borderRadius: 10}}>
                    <option value={""}>{reading ? 'Leyendo operarios. Espere...' : 'Seleccionar operario'}</option>
                    {
                        operarios && operarios.map((user, i) => {
                            if (user.obras[0].idobra === site) {
                                return(
                                    <option key={i} value={user._id}>{`${user.name} ${user.lastName}`}</option>
                                )
                            } else {
                                null
                            }
                        })
                        /* operarios.filter(user => {
                            if(reportType ==='Inspección') {
                                if(user.role==='inspectionWorker') {
                                    return user
                                }
                            }else if(reportType === 'Mantención') {
                                if(user.role==='maintenceOperator') {
                                    return user
                                }
                            }
                        }).sort((a, b)=>{ if (a.name > b.name) { return 1 } if (a.name < b.name) { return -1 } return 0 }).map((user, i) => {
                            return(
                                <option key={i} value={user._id}>{`${user.name} ${user.lastName}`}</option>
                            )
                        }) */
                    }
                </select>


                </div>

                <Fab onClick={close} style={{position: 'absolute', right: 10, top: 10, boxShadow: 'none', backgroundColor: 'transparent'}}>
                    <Close style={{color: '#ccc'}} />
                </Fab>
                
            </Box>
        </Modal>
    )
}

export default AssignReportModal