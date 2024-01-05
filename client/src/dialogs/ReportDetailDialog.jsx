import { Button, Dialog, IconButton, Slide } from "@mui/material"
import { Close } from "@mui/icons-material"
import { forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import { dateWithTime } from "../config";
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ReportDetailDialog = ({handleClickOpen, open, handleClose, report}) => {
    const navigate = useNavigate()
    return (
        <div>
            <Button variant="outlined" onClick={handleClickOpen}>
                Open full-screen dialog
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <IconButton
                    style={{position: 'absolute', top: 20, right: 20, backgroundColor: '#fff'}}
                    onClick={handleClose}
                    >
                    <Close />
                    </IconButton>
                <div style={{padding: 30, textAlign: 'center', height: '50vh'}}>
                    <h1>N° de OT: {report.idIndex}</h1>
                    <h2>N° SAP{report.sapId}</h2>
                    <h3>Tipo de reporte: {report.reportType}</h3>
                    <h3>Pauta: {report.guide}</h3>
                    {report.testMode && <p style={{width: '100%', backgroundColor: 'red', color: 'white'}}>OT creada para testing.</p>}
                    <div style={{textAlign: 'justify'}}>
                        <p>
                            Fecha programado: {dateWithTime(report.datePrev)} 
                            <br /> 
                            Fecha de inicio: {dateWithTime(report.dateInit)}
                            <br />
                            Fecha última actualización: {dateWithTime(report.updatedAt)}
                        </p>
                    </div>
                    <div style={{width: '100%', textAlign: 'center'}}>
                        <button onClick={()=>navigate(`/assignment/${report.idIndex}`)}>
                            Abrir reporte
                        </button>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}

export default ReportDetailDialog