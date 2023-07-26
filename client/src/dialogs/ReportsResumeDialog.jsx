import { useState, useEffect, forwardRef } from 'react';
import { 
    Box, 
    Dialog,
    Slide
} from '@mui/material';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ReportsResumeDialog = ({open, reports, handleClose}) => {
    const [automaticReports, setAutomaticReports] = useState([])
    const [manualReports, setManualReports] = useState([])

    useEffect(() => {
        if (reports.length > 0) {
            const automaticReportsCache = []
            const manualReportsCache = []
            reports.forEach((report, i) => {
                if (report.description) {
                    automaticReportsCache.push(report)
                } else {
                    manualReportsCache.push(report)
                }
            })
            setAutomaticReports(automaticReportsCache)
            setManualReports(manualReportsCache)
        }
    }, [reports])

    return(
        <Dialog
            open={open}
            TransitionComponent={Transition}
            onClose={handleClose}
        >
            <Box>
                <div style={{padding: 20}}>
                    <h2 style={{marginTop: 5}}>Resumen de Ordenes de Trabajo</h2>
                    <p> <strong>Total OTs: </strong> {reports.length} </p>
                    <p style={{marginBottom: 0}}> <strong>OTs Automáticos: </strong> {automaticReports.length} </p>
                    <p style={{margin: 0, fontSize: 10}}>OT generadas desde el sistema</p>
                    <p style={{marginBottom: 0}}> <strong>OTs Manuales: </strong> {manualReports.length} </p>
                    <p style={{margin: 0, fontSize: 10}}>OT generadas por un usuario</p>
                </div>
            </Box>
        </Dialog>
    )
}

export default ReportsResumeDialog