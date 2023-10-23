import { useState, useEffect, useContext, forwardRef } from 'react';
import { 
    Toolbar,
    Fab,
    Grid,
    Dialog,
    Slide,

} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { getUserNameById, styleModalReport } from '../config';
import { reportsRoutes, usersRoutes } from '../routes';
import { dateWithTime } from '../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft, faArrowUp, faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom';
import { AuthContext, useExecutionReportContext } from '../context';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const ReviewReportDialog = ({open, report, onlyClose}) => {
    const {admin, isSapExecutive} = useContext(AuthContext)
    const {setReport} = useExecutionReportContext()
    const [ colorState, setColorState ] = useState();
    const { idIndex, guide, state, siteName, usersAssigned, sapId, machineData, description } = report;
    const [ userAssignedName, setUserAssignedName ] = useState('')
    const [ userShiftManagerName, setUserShiftManagerName ] = useState('')
    const [ userChiefMachineryName, setChiefMachineryName ] = useState('')
    const [ userSapExecutiveName, setUserSapExecutiveName ] = useState('')
    const [ loadingDelete, setLoadingDelete ] = useState(false)
    const [ toEditSapId, setToEditSapId ] = useState(false)
    const [ sapIdToEdit, setSapIdToEdit ] = useState(sapId)
    const [tiempoDesarrollo, setTiempoDesarrollo] = useState(0)
    const [tiempoAprobacionSup, setTiempoAprobacionSup] = useState(0)
    const [tiempoJMaquinaria, setTiempoJMaquinaria] = useState(0)
    const [tiempoCierreOt, setTiempoCierreOt] = useState(0)
    const [tiempoTotal, setTiempoTotal] = useState(0)
    const navigate = useNavigate()

    const getUsers = () => {
        console.log(usersAssigned[0])
        usersRoutes.getUser(usersAssigned[0]).then((data) => {
            const user = data.data
            if (user)
            setUserAssignedName(user.name + ' ' + user.lastName)
        })
    }

    useEffect(() => {
        init()
        if (report) {
            setTiempoDesarrollo(Number((((((new Date(report.endReport) - new Date(report.createdAt)) / 1000) / 60) / 60) / 24).toFixed(2)))
            setTiempoAprobacionSup(Number((((((new Date(report.shiftManagerApprovedDate) - new Date(report.endReport)) / 1000) / 60) / 60) / 24).toFixed(2)))
            setTiempoJMaquinaria(Number((((((new Date(report.chiefMachineryApprovedDate) - new Date(report.shiftManagerApprovedDate)) / 1000) / 60) / 60) / 24).toFixed(2)))
            setTiempoCierreOt(Number((((((new Date(report.dateClose) - new Date(report.chiefMachineryApprovedDate)) / 1000) / 60) / 60) / 24).toFixed(2)))
        }
    }, [report])

    useEffect(() => {
        let number = tiempoDesarrollo + tiempoAprobacionSup + tiempoJMaquinaria + tiempoCierreOt
        setTiempoTotal(number.toFixed(2))
    },[
        tiempoDesarrollo,
        tiempoAprobacionSup,
        tiempoJMaquinaria,
        tiempoCierreOt
    ])

    const init = async () => {
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
    }

    const toReport = () => {
        setReport(report)
        navigate(`/assignment/${idIndex}`)
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
        <Dialog
            open={open}
            TransitionComponent={Transition}
            adaptiveHeight={true}
            maxWidth={'xl'}
            >
            <div style={{padding: 30, /* textAlign: 'center', */ /* height: '50vh' */ width: 1000}}>
                <Toolbar style={{width: '100%', height: 59, paddingLeft: 0}}>
                    <h2>{ (report.reportType === 'Mantención') ? `Pauta de ${report.reportType}` : ''} Equ: {machineData.equid.replace('00000000', '')} / {machineData.model}{/* SAP {sapId ? sapId : 'N/A'} */}</h2>
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
                            <strong>N° SAP:</strong> <br />
                        <Grid container>
                            <Grid item>
                            {
                                !toEditSapId ?
                                sapIdToEdit ? sapIdToEdit : 'N/A'
                                :
                                <input onChange={(e) => setSapIdToEdit(e.target.value)} value={sapIdToEdit} />
                            }
                            </Grid>
                            {(isSapExecutive || admin) && <Grid item>
                                {
                                    !(toEditSapId) ?
                                    <button style={{marginLeft: 10}} onClick={changeInputSapId}>
                                        <FontAwesomeIcon icon={faPen} />
                                    </button> :
                                    <button style={{marginLeft: 10}}>
                                        <FontAwesomeIcon icon={faArrowUp} onClick={saveChangesSapId}/>
                                    </button>
                                }
                            </Grid>}
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
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <div style={{marginTop: 30, width: '100%'}}>
                            <strong>Descripción:</strong> <br />
                            {description ? description : 'Sin descripción'}
                        </div>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item md={6} xs={12} sm={12} lg={4} xl={4} >
                        <div style={{marginTop: 30, width: '100%'}}>
                            <label>Revisores: </label>
                            {/* <div style={{width: '100%', height: 59}}> */}
                                <p>Pauta asignada a: <br /> <b>{userAssignedName  ? userAssignedName : 'No encontrado'}</b></p>
                            {/* </div> */}
                            {/* <div style={{width: '100%', height: 59}}> */}
                                <p>Jefe de turno: <br /> <b>{userShiftManagerName.length > 1 ? userShiftManagerName : 'No encontrado'}</b></p>
                            {/* </div> */}
                            {/* <div style={{width: '100%', height: 59}}> */}
                                <p>Jefe de maquinaria: <br /> <b>{userChiefMachineryName.length > 1 ? userChiefMachineryName : 'No encontrado'}</b></p>
                            {/* </div> */}
                            {/* <div style={{width: '100%', height: 59}}> */}
                                <p>Ejecutivo SAP: <br /> <b>{userSapExecutiveName.length > 1 ? userSapExecutiveName : 'No encontrado'}</b></p>
                            {/* </div> */}
                        </div>

                    </Grid>
                    <Grid item lg={4} xl={4} >
                        <div style={{marginTop: 30, width: '100%'}}>
                            <p>Registro horario: </p>
                            {/* <div style={{width: '100%', height: 44.5}}> */}
                                <p>Creado: <br /> <b>{dateWithTime(report.createdAt)}</b></p>
                            {/* </div> */}
                            {/* <div style={{width: '100%', height: 44.5}}> */}
                                <p>Programado: <br /> <b>{(dateWithTime(report.datePrev) === 'Sin información') ? 'Faltan datos' : dateWithTime(report.datePrev)}</b></p>
                            {/* </div>
                            <div style={{width: '100%', height: 44.5}}> */}
                                <p>Inicio: <br /> <b>{(dateWithTime(report.dateInit) === 'Sin información') ? 'No inicado' : dateWithTime(report.dateInit)}</b></p>
                            {/* </div>
                            <div style={{width: '100%', height: 44.5}}> */}
                                <p>Finalizado: <br /> <b>{(dateWithTime(report.endReport) === 'Sin información') ? 'No finalizado' : dateWithTime(report.endReport)}</b></p>
                            {/* </div>
                            <div style={{width: '100%', height: 44.5}}> */}
                                <p>Aprobado Jefe Turno: <br /> <b>{(dateWithTime(report.shiftManagerApprovedDate) === 'Sin información') ? 'No cerrado' : dateWithTime(report.shiftManagerApprovedDate)}</b></p>
                                <p>Aprobado Jefe maquinaria: <br /> <b>{(dateWithTime(report.chiefMachineryApprovedDate) === 'Sin información') ? 'No cerrado' : dateWithTime(report.chiefMachineryApprovedDate)}</b></p>
                                <p>Cerrado: <br /> <b>{(dateWithTime(report.dateClose) === 'Sin información') ? 'No cerrado' : dateWithTime(report.dateClose)}</b></p>
                            {/* </div> */}
                        </div>
                    </Grid>

                    <Grid item lg={4} xl={4} >
                        <div style={{marginTop: 30, width: '100%'}}>
                            <p>Tiempo de Desarrollo de OT: <b>{isNaN(tiempoDesarrollo) ? 0 : tiempoDesarrollo} días</b></p>
                            <p>Aprobación de supervisor: <b>{isNaN(tiempoAprobacionSup) ? 0 : tiempoAprobacionSup} días</b></p>
                            <p>Aprobación de jefe maquinaria: <b>{isNaN(tiempoJMaquinaria) ? 0 : tiempoJMaquinaria} días</b></p>
                            <p>Cierre de la OT: <b>{isNaN(tiempoCierreOt) ? 0 : tiempoCierreOt} días</b></p>
                            <p>Tiempo Total: <b>{isNaN(tiempoTotal) ? 0 : tiempoTotal} días</b></p>
                        </div>
                    </Grid>

                    {/* <div style={{width: '100%', textAlign: 'right'}}>
                        
                    </div> */}

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
                
            </div>
        </Dialog>
    )
}

export default ReviewReportDialog