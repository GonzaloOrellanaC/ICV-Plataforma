import { useState, useEffect } from 'react';
import { 
    Box, 
    Modal,
    Toolbar,
    Fab,
    Grid,
    Button,

} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { getUserNameById, styleModalReport } from '../../config';
import { reportsRoutes, usersRoutes } from '../../routes';
import { dateWithTime } from '../../config';
import { LoadingLogoModal } from '../loadings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useHistory } from 'react-router-dom';

const ReviewReportModal = ({open, report, closeModal, onlyClose}) => {
    //console.log(report);
    const [ operarios, setOperarios ] = useState([]);
    const [ colorState, setColorState ] = useState();
    const { idIndex, guide, state, siteName, usersAssigned, sapId } = report;
    const [ stateAssignment , setStateAssignment ] = useState(false);
    const [ data, setData ] = useState('');
    const [ userAssignedName, setUserAssignedName ] = useState('')
    const [ userShiftManagerName, setUserShiftManagerName ] = useState('')
    const [ userChiefMachineryName, setChiefMachineryName ] = useState('')
    const [ userSapExecutiveName, setUserSapExecutiveName ] = useState('')
    const [ loadingDelete, setLoadingDelete ] = useState(false)
    const history = useHistory()

    const setUserToReport = async (userId) => {
        if(userId === '') {
            let usersAssigned = new Array();
            usersAssigned[0] = userId;
            setData('Reporte sin asignación.');
            const reportState = await reportsRoutes.editReport({idIndex: idIndex, state: 'Asignar', usersAssigned: usersAssigned});
            if(reportState) {
                report.usersAssigned = usersAssigned;
                setStateAssignment(true);
                setTimeout(() => {
                    setStateAssignment(false)
                }, 1000);
            }
        }else{
            setData('Pauta asignada.')
            let usersAssigned = new Array();
            usersAssigned.push(userId);
            const reportState = await reportsRoutes.editReport({idIndex: idIndex, state: 'En proceso', usersAssigned: usersAssigned});
            if(reportState) {
                report.usersAssigned = usersAssigned;
                setStateAssignment(true);
                setTimeout(() => {
                    setStateAssignment(false)
                }, 1000);
            }
        }
    }

    const getUsers = () => {
        usersRoutes.getAllUsers().then(response => {
            let userList = new Array();
            let users = new Array();
            userList = response.data;
            userList.forEach((user, index) => {
                let permissionsReports = new Array();
                permissionsReports = user.permissionsReports
                if(permissionsReports.length > 0) {
                    if(permissionsReports[1].isChecked) {
                        users.push(user);
                    }
                }
                if(index == (userList.length - 1)) {
                    //console.log(users);
                    //console.log(usersAssigned);
                    users.forEach((u, i) => {
                        if(u._id === usersAssigned[0]) {
                            setUserAssignedName(u.name + ' ' + u.lastName);
                        }
                    })
                    setOperarios(users)
                }
            })

        })
    }

    useEffect(() => {
        let ok = true
        getUserNameById(report.chiefMachineryApprovedBy).then(user => {
            setChiefMachineryName(user)
        })
        getUserNameById(report.shiftManagerApprovedBy).then(user => {
            setUserShiftManagerName(user)
        })
        getUserNameById(report.sapExecutiveApprovedBy).then(user => {
            setUserSapExecutiveName(user)
        })
        getUsers();
        //console.log(report)
        if(state === 'Asignar') {
            setColorState('#DE4343');
        }else if(state === 'En proceso') {
            setColorState('#F2994A');
        }else if(state === 'Por cerrar') {
            setColorState('#F2C94C');
        }else if(state === 'Completadas') {
            setColorState('#27AE60');
        }   

        return ok = false
    }, [])

    const removeOt = () => {
        if(confirm(`Se borrará la OT ${report.idIndex}. Su eliminación será permanente. ¿Desea continuar?`)) {
            setLoadingDelete(true)
            report.deleted = true
            reportsRoutes.editReport(report).then(() => {
                setLoadingDelete(false)
                location.reload()
            })
        }
    }
    
    return(
        <Modal
            open={open}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <Box sx={styleModalReport}>
                <Toolbar style={{width: '100%', height: 59, paddingLeft: 0}}>
                    <h2>{ (report.reportType === 'Mantención') ? `Pauta de ${report.reportType}` : ''} {guide} SAP {sapId ? sapId : 'N/A'}</h2>
                    <div style={{ position: 'absolute', right: 65 , backgroundColor: colorState, paddingTop: 3, borderRadius: 5, width: 100, height: 20, textAlign: 'center'}}>
                        <p style={{margin: 0, fontSize: 12}}>{state.toUpperCase()}</p>
                    </div>
                </Toolbar>
                <Grid container>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <strong>Faena:</strong> <br />
                        {siteName}
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <strong>Número de orden:</strong> <br />
                        {idIndex}
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <strong>ID de SAP:</strong> <br />
                        {sapId ? sapId : 'N/A'}
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                    <div style={{marginTop: 30, width: '100%'}}>

                        <strong>Pauta:</strong> <br />
                        {guide}
                        </div>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item md={6} xs={12} sm={12} lg={6} >
                        <div style={{marginTop: 30, width: '100%'}}>

                        <div style={{width: '100%', height: 59}}>
                            <label>Pauta asignada a: <b>{userAssignedName.length > 1 ? userAssignedName : 'Sin asignación'}</b></label>
                        </div>
                        <div style={{width: '100%', height: 59}}>
                            <label>Jefe de turno revisor: <b>{userShiftManagerName.length > 1 ? userShiftManagerName : 'Sin información'}</b></label>
                        </div>
                        <div style={{width: '100%', height: 59}}>
                            <label>Jefe de maquinaria revisor: <b>{userChiefMachineryName.length > 1 ? userChiefMachineryName : 'Sin información'}</b></label>
                        </div>
                        <div style={{width: '100%', height: 59}}>
                            <label>Ejecutivo SAP revisor: <b>{userSapExecutiveName.length > 1 ? userSapExecutiveName : 'Sin información'}</b></label>
                        </div>
                        </div>

                    </Grid>
                    <Grid item>
                        <div style={{marginTop: 30, width: '100%'}}>
                            <div style={{width: '100%', height: 59}}>
                                <label>Creado: <b>{dateWithTime(report.createdAt)}</b></label>
                            </div>
                            <div style={{width: '100%', height: 59}}>
                                <label>Inicio: <b>{(dateWithTime(report.dateInit) === 'Sin información') ? 'No inicado' : dateWithTime(report.dateInit)}</b></label>
                            </div>
                            <div style={{width: '100%', height: 59}}>
                                <label>Finalizado: <b>{(dateWithTime(report.endReport) === 'Sin información') ? 'No finalizado' : dateWithTime(report.endReport)}</b></label>
                            </div>
                            <div style={{width: '100%', height: 59}}>
                                <label>Cerrado: <b>{(dateWithTime(report.dateClose) === 'Sin información') ? 'No cerrado' : dateWithTime(report.dateClose)}</b></label>
                            </div>
                        </div>
                    </Grid>

                    <div style={{width: '100%', textAlign: 'right'}}>
                        
                    </div>
                    {
                        loadingDelete && <LoadingLogoModal open={loadingDelete} />
                    }

                </Grid>
                <Grid container>
                    <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                        <div style={{padding: 10}}>
                            <button style={{ height: 50 , width: '100%', backgroundColor: 'green', color: '#fff', fontSize: 20 }} onClick={()=>{history.push(`/assignment/${idIndex}`)}}> <strong> <FontAwesomeIcon icon={faArrowCircleLeft} /> Revisar OT {idIndex} </strong> </button>
                        </div>
                    </Grid>
                    <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                        <div style={{padding: 10}}>
                            <button style={{ height: 50 , width: '100%', backgroundColor: 'red', color: '#fff', fontSize: 20 }} onClick={()=>{removeOt()}}> <strong> <FontAwesomeIcon icon={faTrash} /> Borrar OT {idIndex} </strong> </button>
                        </div>
                    </Grid>
                </Grid>
                {/* <Grid container>
                    <div>
                        <button>X Borrar pauta</button>
                    </div>
                </Grid> */}

                <Fab onClick={onlyClose} style={{position: 'absolute', right: 10, top: 10, boxShadow: 'none', backgroundColor: 'transparent'}}>
                    <Close style={{color: '#ccc'}} />
                </Fab>
                
            </Box>
        </Modal>
    )
}

export default ReviewReportModal