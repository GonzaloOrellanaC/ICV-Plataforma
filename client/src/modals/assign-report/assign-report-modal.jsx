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

const AssignReportModal = ({open, report, closeModal}) => {
    const [ operarios, setOperarios ] = useState([]);
    const [ colorState, setColorState ] = useState();
    const { reportType, idIndex, guide, state, siteName, usersAssigned } = report;
    const [ stateAssignment , setStateAssignment ] = useState(false);
    const [ data, setData ] = useState('')

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
            console.log(response.data);
            let userList = new Array();
            let users = new Array();
            userList = response.data;
            userList.forEach((user, index) => {
                console.log(user);
                let permissionsReports = new Array();
                permissionsReports = user.permissionsReports
                if(permissionsReports.length > 0) {
                    if(permissionsReports[1].isChecked) {
                        users.push(user);
                    }
                }
                if(index == (userList.length - 1)) {
                    setOperarios(users)
                }
            })

        })
    }

    useEffect(() => {
        getUsers();
        console.log(report)
        if(state === 'Por asignar') {
            setColorState('#E99797');
        }else if(state === 'En proceso') {
            setColorState('#F5C69C');
        }   
    }, [])
    
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
                <select value={usersAssigned[0]} onChange={(e)=>{setUserToReport(e.target.value)}} placeholder="Seleccionar operario" style={{height: 44, width: 274, borderStyle: 'solid', borderColor: '#C4C4C4', borderWidth: 1, borderRadius: 10}}>
                    <option value={""}>Seleccionar operario</option>
                    {
                        operarios.map((user, i) => {
                            return(
                                <option key={i} value={user._id}>{`${user.name} ${user.lastName}`}</option>
                            )
                        })
                    }
                </select>


                </div>

                <Fab onClick={closeModal} style={{position: 'absolute', right: 10, top: 10, boxShadow: 'none', backgroundColor: 'transparent'}}>
                    <Close style={{color: '#ccc'}} />
                </Fab>
                
            </Box>
        </Modal>
    )
}

export default AssignReportModal