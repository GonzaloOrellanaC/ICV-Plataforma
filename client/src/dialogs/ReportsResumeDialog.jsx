import { useState, useEffect, forwardRef } from 'react';
import { 
    Box, 
    Dialog,
    Slide,
} from '@mui/material';
import {Close} from '@mui/icons-material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faClosedCaptioning } from '@fortawesome/free-solid-svg-icons';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ReportsResumeDialog = ({open, reports, handleClose}) => {
    const [automaticReports, setAutomaticReports] = useState([])
    const [manualReports, setManualReports] = useState([])
    const [mostrarAlertasAutomaticas, setMostrarAlertasAutomaticas] = useState(false)
    const [mostrarAlertasManuales, setMostrarAlertasManuales] = useState(false)

    useEffect(() => {
        if (reports.length > 0) {
            const automaticReportsCache = []
            const manualReportsCache = []
            reports.forEach((report, i) => {
                console.log(report.description)
                if (report.description) {
                    automaticReportsCache.push(report)
                } else {
                    manualReportsCache.push(report)
                }
            })
            setAutomaticReports(automaticReportsCache.sort(ordenarPorNumeroOt))
            setManualReports(manualReportsCache.sort(ordenarPorNumeroOt))
        }
    }, [reports])

    const ordenarPorNumeroOt = (a, b) => {
        if (a.idIndex < b.idIndex) {
            return 1
        }
        if (a.idIndex > b.idIndex) {
            return -1
        }
        return 0
    }

    return(
        <Dialog
            open={open}
            TransitionComponent={Transition}
            onClose={handleClose}
        >
            <Box
            sx={{
                height: 700,
                width: '100%',
                position: 'relative'
            }}>
                <Close onClick={handleClose} style={{position: 'absolute', top: 10, right: 10, cursor: 'pointer'}} />
                <div style={{padding: 20}}>
                    <h2 style={{marginTop: 15}}>Resumen de Ordenes de Trabajo</h2>
                    <p> <strong>Total OTs: </strong> {reports.length} </p>
                    <p style={{marginBottom: 0, cursor: 'pointer', width: '100%'}} onClick={() => {
                        setMostrarAlertasAutomaticas(!mostrarAlertasAutomaticas)
                    }}> <strong>OTs Automáticos: </strong> {automaticReports.length} <FontAwesomeIcon style={{marginLeft: 10}} icon={mostrarAlertasAutomaticas ? faChevronUp : faChevronDown} /> </p>
                    <p style={{margin: 0, fontSize: 10}}>OT generadas desde el sistema</p>
                    {mostrarAlertasAutomaticas && <div style={{ maxHeight: 200, overflowY: 'auto', border: '1px solid #ccc', borderRadius: 8, padding: 10 }}>
                        {
                            automaticReports.map((report, i) => {
                                return (
                                    <p key={i}>
                                        OT {report.idIndex}
                                    </p>
                                )
                            })
                        }
                    </div>}
                    <p style={{marginBottom: 0, cursor: 'pointer'}} onClick={() => {
                        setMostrarAlertasManuales(!mostrarAlertasManuales)
                    }}> <strong>OTs Manuales: </strong> {manualReports.length} <FontAwesomeIcon style={{marginLeft: 10}} icon={mostrarAlertasManuales ? faChevronUp : faChevronDown} /> </p>
                    <p style={{margin: 0, fontSize: 10}}>OT generadas por un usuario</p>
                    {mostrarAlertasManuales && <div style={{ maxHeight: 200, overflowY: 'auto', border: '1px solid #ccc', borderRadius: 8, padding: 10 }}>
                        {
                            manualReports.map((report, i) => {
                                return (
                                    <p key={i}>
                                        OT {report.idIndex}
                                    </p>
                                )
                            })
                        }
                    </div>}
                </div>
            </Box>
        </Dialog>
    )
}

export default ReportsResumeDialog