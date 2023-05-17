import { useState, useEffect, useContext } from 'react';
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
import { faArrowCircleLeft, faArrowUp, faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useHistory } from 'react-router-dom';
import { AuthContext, useExecutionReportContext } from '../../context';

const ReviewReportModal = ({open, report, onlyClose}) => {
    const {admin} = useContext(AuthContext)
    const {setReport} = useExecutionReportContext()
    const [ colorState, setColorState ] = useState();
    const { idIndex, guide, state, siteName, usersAssigned, sapId } = report;
    const [ userAssignedName, setUserAssignedName ] = useState('')
    const [ userShiftManagerName, setUserShiftManagerName ] = useState('')
    const [ userChiefMachineryName, setChiefMachineryName ] = useState('')
    const [ userSapExecutiveName, setUserSapExecutiveName ] = useState('')
    const [ loadingDelete, setLoadingDelete ] = useState(false)
    const [ toEditSapId, setToEditSapId ] = useState(false)
    const [ sapIdToEdit, setSapIdToEdit ] = useState(sapId)
    const history = useHistory()

    const getUsers = () => {
        console.log(usersAssigned[0])
        usersRoutes.getUser(usersAssigned[0]).then((data) => {
            const user = data.data
            if (user)
            setUserAssignedName(user.name + ' ' + user.lastName)
        })
    }

    useEffect(() => {
        console.log(report)
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

    const toReport = () => {
        setReport(report)
        history.push(`/assignment/${idIndex}`)
    }

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

    const changeInputSapId = () => {
        if (!toEditSapId) {
            setToEditSapId(true)
        } else {
            setToEditSapId(false)
        }
    }

    const saveChangesSapId = async () => {
        if (sapIdToEdit.length < 1) {
            alert('Debe agregar algún número SAP')
        } else {
            try {
                const reportToEdit = {
                    _id: report._id,
                    sapId: sapIdToEdit
                }
                const response = await reportsRoutes.editReportById(reportToEdit)
                console.log(response)
                if (response) {
                    report.sapId = sapIdToEdit
                    changeInputSapId()
                }
            } catch (error) {
                
            }
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
                        <Grid container>
                            <Grid item>
                            {
                                !toEditSapId ?
                                sapIdToEdit ? sapIdToEdit : 'N/A'
                                :
                                <input onChange={(e) => setSapIdToEdit(e.target.value)} value={sapIdToEdit} />
                            }
                            </Grid>
                            <Grid item>
                                {
                                    !toEditSapId ?
                                    <button style={{marginLeft: 10}} onClick={changeInputSapId}>
                                        <FontAwesomeIcon icon={faPen} />
                                    </button> :
                                    <button style={{marginLeft: 10}}>
                                        <FontAwesomeIcon icon={faArrowUp} onClick={saveChangesSapId}/>
                                    </button>
                                }
                            </Grid>
                        </Grid>
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
                            <label>Pauta asignada a: <b>{userAssignedName  ? userAssignedName : 'No encontrado'}</b></label>
                        </div>
                        <div style={{width: '100%', height: 59}}>
                            <label>Jefe de turno revisor: <b>{userShiftManagerName.length > 1 ? userShiftManagerName : 'No encontrado'}</b></label>
                        </div>
                        <div style={{width: '100%', height: 59}}>
                            <label>Jefe de maquinaria revisor: <b>{userChiefMachineryName.length > 1 ? userChiefMachineryName : 'No encontrado'}</b></label>
                        </div>
                        <div style={{width: '100%', height: 59}}>
                            <label>Ejecutivo SAP revisor: <b>{userSapExecutiveName.length > 1 ? userSapExecutiveName : 'No encontrado'}</b></label>
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
                            <button style={{ height: 50 , width: '100%', backgroundColor: 'green', color: '#fff', fontSize: 20 }} onClick={toReport}> <strong> <FontAwesomeIcon icon={faArrowCircleLeft} /> Revisar OT {idIndex} </strong> </button>
                        </div>
                    </Grid>
                    <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                        {admin && <div style={{padding: 10}}>
                            <button style={{ height: 50 , width: '100%', backgroundColor: 'red', color: '#fff', fontSize: 20 }} onClick={()=>{removeOt()}}> <strong> <FontAwesomeIcon icon={faTrash} /> Borrar OT {idIndex} </strong> </button>
                        </div>}
                    </Grid>
                </Grid>
                <Fab onClick={onlyClose} style={{position: 'absolute', right: 10, top: 10, boxShadow: 'none', backgroundColor: 'transparent'}}>
                    <Close style={{color: '#ccc'}} />
                </Fab>
                
            </Box>
        </Modal>
    )
}

export default ReviewReportModal