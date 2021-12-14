import { useState, useEffect } from "react";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { Toolbar, ListItem, Checkbox, Modal, Box } from "@material-ui/core";
import { changeTypeUser } from '../../config'
import { AssignReportModal } from '../../modals'

const styleModal = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    borderRadius: 20,
    boxShadow: 24,
    p: 4,
};

const ReportsList = ({height, reportsList, reportType}) => {

    const [ reportData, setReportData ] = useState(null);
    const [ openModalState, setOpenModalState ] = useState(false)

    const openModal = (report) => {
        setReportData(report);
        setOpenModalState(true);
    }

    const closeModal = () => {
        setOpenModalState(false)
    }

    useEffect(() => {
        
    }, []);


    const well = {
        height: 70,
        borderRadius: 10,
        boxShadow: '4px 4px 12px rgba(0, 0, 0, 0.08)'
    }

    return (
        <div style={{height: height}}>
            <div style={{height: height}}>
                <Toolbar style={{width: '100%'}}>
                    <h1> {reportType} </h1>
                </Toolbar>
                <div>
                    <ListItem>
                        <div style={{textAlign: 'center', width: '5%', marginLeft: 5}}>
                            <Checkbox defaultChecked />
                        </div>
                        <div style={{textAlign: 'center', width: '10%', marginLeft: 5}}>
                            <p style={{margin: 0}}> <strong>Fecha <br /> Prevista</strong> </p>
                        </div>
                        <div style={{textAlign: 'center', width: '10%', marginLeft: 5}}>
                            <p style={{margin: 0}}> <strong>Fecha <br /> Inicio</strong> </p>
                        </div>
                        <div style={{textAlign: 'center', width: '10%', marginLeft: 5}}>
                            <p style={{margin: 0}}> <strong>Fecha <br /> Término</strong> </p>
                        </div>
                        <div style={{textAlign: 'center', width: '10%', marginLeft: 5}}>
                            <p style={{margin: 0}}> <strong>Horómetro</strong> </p>
                        </div>
                        <div style={{textAlign: 'center', width: '5%', marginLeft: 5}}>
                            <p style={{margin: 0}}> <strong>ID#</strong> </p>
                        </div>
                        <div style={{textAlign: 'center', width: '15%', marginLeft: 5}}>
                            <p style={{margin: 0}}> <strong>Responsable</strong> </p>
                        </div>
                        <div style={{textAlign: 'center', width: '5%', marginLeft: 5}}>
                            <p style={{margin: 0}}> <strong>Ver</strong> </p>
                        </div>
                        <div style={{textAlign: 'center', width: '10%', marginLeft: 5}}>
                            <p style={{margin: 0}}> <strong>Descargar</strong> </p>
                        </div>
                        <div style={{textAlign: 'center', width: '10%', marginLeft: 5}}>
                            <p style={{margin: 0}}> <strong>Estado</strong> </p>
                        </div>
                    </ListItem>
                </div>

                <div style={{overflowY: 'auto'}}>
                    {
                        (reportsList.length > 0) && reportsList.map((e, n) => {
                            e.roleTranslated = changeTypeUser(e.role);
                            console.log(e)
                            return(
                                <ListItem key={n} style={well}>
                                    <div style={{textAlign: 'center', width: '5%', marginLeft: 5}}>
                                        <Checkbox defaultChecked />
                                    </div>
                                    <div style={{textAlign: 'center', width: '10%', marginLeft: 5}}>
                                        <p style={{margin: 0}}> <strong>{new Date(e.datePrev).getDate() + 1}/{new Date(e.datePrev).getMonth() + 1}/{new Date(e.datePrev).getFullYear()}</strong> </p>
                                    </div>
                                    <div style={{textAlign: 'center', width: '10%', marginLeft: 5}}>
                                        <p style={{margin: 0}}> <strong></strong> </p>
                                    </div>
                                    <div style={{textAlign: 'center', width: '10%', marginLeft: 5}}>
                                        <p style={{margin: 0}}> <strong></strong> </p>
                                    </div>
                                    <div style={{textAlign: 'center', width: '10%', marginLeft: 5}}>
                                        <p style={{margin: 0}}> <strong></strong> </p>
                                    </div>
                                    <div style={{textAlign: 'center', width: '5%', marginLeft: 5}}>
                                        <p style={{margin: 0}}> <strong>{e.idIndex}</strong> </p>
                                    </div>
                                    <div style={{textAlign: 'center', width: '15%', marginLeft: 5}}>
                                        <p style={{margin: 0}}> <button onClick={()=>openModal(e)} style={{backgroundColor: '#F9F9F9', borderRadius: 20, borderColor: '#757575', maxWidth: 130, height: 24, fontSize: 12}}>Asignar</button> </p>
                                    </div>
                                    <div style={{textAlign: 'center', width: '5%', marginLeft: 5}}>
                                        <p style={{margin: 0}}> Link </p>
                                    </div>
                                    <div style={{textAlign: 'center', width: '10%', marginLeft: 5}}>
                                        <p style={{margin: 0}}>  </p>
                                    </div>
                                    <div style={{textAlign: 'center', width: '10%', marginLeft: 5}}>
                                        <p style={{margin: 0}}>  </p>
                                    </div>
                                </ListItem>
                            )
                        })
                    }
                    {
                        
                        reportData && <AssignReportModal open={openModalState} report={reportData} closeModal={closeModal}/>
                        
                    }
                </div>
            </div>
        </div>
    )
}

export default ReportsList