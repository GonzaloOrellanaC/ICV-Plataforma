import { forwardRef, useEffect, useState } from 'react';
import { 
    Toolbar,
    Fab,
    Grid,
    Dialog,
    Slide,

} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { dateWithTime } from '../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft, faArrowUp, faPen, faTrash } from '@fortawesome/free-solid-svg-icons'

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const ReportsKPIDialog = ({open, reports, handleClose}) => {
    const [conDesarrolloTerminado, setConDesarrolloTerminado] = useState([])
    const [conTiempoAprobacionSupTerminado, setConTiempoAprobacionSupTerminado] = useState([])
    const [conTiempoJMaquinariaTerminado, setConTiempoJMaquinariaTerminado] = useState([])
    const [conTiempoCierreOtTerminado, setConTiempoCierreOtTerminado] = useState([])
    const [tiemposDeDesarrollo, setTiemposDeDesarrollo] = useState(0)
    const [tiemposAprobacionSup, setTiemposAprobacionSup] = useState(0)
    const [tiemposJMaquinaria, setTiemposJMaquinaria] = useState(0)
    const [tiemposCierreOt, setTiemposCierreOt] = useState(0)
    const [promedioDesarrolloTerminado, setPromedioDesarrolloTerminado] = useState(0)
    const [promedioTiempoAprobacionSup, setPromedioTiempoAprobacionSup] = useState(0)
    const [promedioTiempoJMaquinaria, setPromedioTiempoJMaquinaria] = useState(0)
    const [promedioTiempoCierreOt, setPromedioTiempoCierreOt] = useState(0)
    useEffect(() => {
        if (reports.length > 0) {
            const conDesarrolloTerminadoCache = []
            const conTiempoAprobacionSupTerminadoCache = []
            const conTiempoJMaquinariaTerminadoCache = []
            const conTiempoCierreOtTerminadoCache = []
            const conDesarrolloTerminadoCacheNone = []
            const conTiempoAprobacionSupTerminadoCacheNone = []
            const conTiempoJMaquinariaTerminadoCacheNone = []
            const conTiempoCierreOtTerminadoCacheNone = []
            let tiemposDeDesarrolloCache = 0
            let tiemposAprobacionSupCache = 0
            let tiemposJMaquinariaCache = 0
            let tiemposCierreOtCache = 0
            reports.forEach((report, i) => {
                if (report) {
                    if (!report.chiefMachineryApprovedDate && report.dateClose) {
                        console.log(report.idIndex, report.chiefMachineryApprovedDate, report.dateClose)
                    } else {
                        console.log(report.idIndex, ' todo bien')
                    }
                    const tiempoDesarrollo = Number((((((new Date(report.endReport) - new Date(report.dateInit)) / 1000) / 60) / 60) / 24).toFixed(2))
                    const tiempoAprobacionSup = Number((((((new Date(report.shiftManagerApprovedDate) - new Date(report.endReport)) / 1000) / 60) / 60) / 24).toFixed(2))
                    const tiempoJMaquinaria = Number((((((new Date(report.chiefMachineryApprovedDate) - new Date(report.shiftManagerApprovedDate)) / 1000) / 60) / 60) / 24).toFixed(2))
                    const tiempoCierreOt = Number((((((new Date(report.dateClose) - new Date(report.chiefMachineryApprovedDate)) / 1000) / 60) / 60) / 24).toFixed(2))
                    if ((!isNaN(tiempoDesarrollo) && Math.sign(tiempoDesarrollo) > 0)) {
                        conDesarrolloTerminadoCache.push(report)
                        tiemposDeDesarrolloCache = tiemposDeDesarrolloCache + tiempoDesarrollo
                    } else {
                        conDesarrolloTerminadoCacheNone.push(report)
                    }
                    if ((!isNaN(tiempoAprobacionSup) && Math.sign(tiempoAprobacionSup) > 0) && (!isNaN(tiempoDesarrollo) && Math.sign(tiempoDesarrollo) > 0)) {
                        conTiempoAprobacionSupTerminadoCache.push(report)
                        tiemposAprobacionSupCache = tiemposAprobacionSupCache + tiempoAprobacionSup
                    } else {
                        conTiempoAprobacionSupTerminadoCacheNone.push(report)
                    }
                    if ((!isNaN(tiempoJMaquinaria) && Math.sign(tiempoJMaquinaria) > 0) && (!isNaN(tiempoAprobacionSup) && Math.sign(tiempoAprobacionSup) > 0) && (!isNaN(tiempoDesarrollo) && Math.sign(tiempoDesarrollo) > 0)) {
                        conTiempoJMaquinariaTerminadoCache.push(report)
                        tiemposJMaquinariaCache = tiemposJMaquinariaCache + tiempoJMaquinaria
                    } else {
                        conTiempoJMaquinariaTerminadoCacheNone.push(report)
                    }
                    if ((!isNaN(tiempoCierreOt) && Math.sign(tiempoCierreOt) > 0) && (!isNaN(tiempoJMaquinaria) && Math.sign(tiempoJMaquinaria) > 0) && (!isNaN(tiempoAprobacionSup) && Math.sign(tiempoAprobacionSup) > 0) && (!isNaN(tiempoDesarrollo) && Math.sign(tiempoDesarrollo) > 0)) {
                        conTiempoCierreOtTerminadoCache.push(report)
                        tiemposCierreOtCache = tiemposCierreOtCache + tiempoCierreOt
                    } else {
                        conTiempoCierreOtTerminadoCacheNone.push(report)
                        console.log(report.idIndex, tiempoCierreOt, tiempoJMaquinaria, tiempoAprobacionSup, tiempoDesarrollo)
                    }
                }
                if (i === (reports.length - 1)) {
                    setConDesarrolloTerminado(conDesarrolloTerminadoCache)
                    setConTiempoAprobacionSupTerminado(conTiempoAprobacionSupTerminadoCache)
                    setConTiempoJMaquinariaTerminado(conTiempoJMaquinariaTerminadoCache)
                    setConTiempoCierreOtTerminado(conTiempoCierreOtTerminadoCache)
                    setTiemposDeDesarrollo(tiemposDeDesarrolloCache)
                    setTiemposAprobacionSup(tiemposAprobacionSupCache)
                    setTiemposJMaquinaria(tiemposJMaquinariaCache)
                    setTiemposCierreOt(tiemposCierreOtCache)
                }
            })
            console.log(conDesarrolloTerminadoCacheNone.length)
            console.log(conTiempoAprobacionSupTerminadoCacheNone.length)
            console.log(conTiempoJMaquinariaTerminadoCacheNone.length)
            console.log(conTiempoCierreOtTerminadoCacheNone.length)
        }
    }, [reports])

    useEffect(() => {
        /* console.log(conDesarrolloTerminado)
        console.log(conTiempoAprobacionSupTerminado)
        console.log(conTiempoJMaquinariaTerminado)
        console.log(conTiempoCierreOtTerminado) */
        const promedioDesarrolloTerminadoCache = tiemposDeDesarrollo / conDesarrolloTerminado.length
        /* console.log(promedioDesarrolloTerminadoCache.toFixed(2), ' días promedio.') */
        const promedioTiempoAprobacionSupCache = tiemposAprobacionSup / conTiempoAprobacionSupTerminado.length
        const promedioTiempoJMaquinariaCache = tiemposJMaquinaria / conTiempoJMaquinariaTerminado.length
        const promedioTiempoCierreOtCache = tiemposCierreOt / conTiempoCierreOtTerminado.length
        setPromedioDesarrolloTerminado(promedioDesarrolloTerminadoCache)
        setPromedioTiempoAprobacionSup(promedioTiempoAprobacionSupCache)
        setPromedioTiempoJMaquinaria(promedioTiempoJMaquinariaCache)
        setPromedioTiempoCierreOt(promedioTiempoCierreOtCache)
    },[
        conDesarrolloTerminado,
        conTiempoAprobacionSupTerminado,
        conTiempoJMaquinariaTerminado,
        conTiempoCierreOtTerminado,
        tiemposDeDesarrollo,
        tiemposAprobacionSup,
        tiemposJMaquinaria,
        tiemposCierreOt,
    ])
    return(
        <Dialog
            open={open}
            TransitionComponent={Transition}
            adaptiveHeight={true}
            maxWidth={'xl'}
            >
            <div style={{padding: 30, /* textAlign: 'center', */ /* height: '50vh' */ width: 1000}}>
                <Grid container>
                    <Grid item xs={12}>
                        <h2>Datos generales.</h2>
                        <Grid container>
                            <Grid item xs={6}>
                                <p>Reportes</p>
                            </Grid>
                            <Grid item xs={6}>
                                <p>Promedio</p>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={6}>
                                <p>Desarrollo Terminado: {conDesarrolloTerminado.length}</p>
                            </Grid>
                            <Grid item xs={6}>
                                <p>{isNaN(promedioDesarrolloTerminado) ? 0 : promedioDesarrolloTerminado.toFixed(2)} días</p>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={6}>
                                <p>Aprobados Por Jefe Turno: {conTiempoAprobacionSupTerminado.length}</p>
                            </Grid>
                            <Grid item xs={6}>
                                <p>{isNaN(promedioTiempoAprobacionSup) ? 0 : promedioTiempoAprobacionSup.toFixed(2)} días</p>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={6}>
                                <p>Aprobados Por Jefe Maquinaria: {conTiempoJMaquinariaTerminado.length}</p>
                            </Grid>
                            <Grid item xs={6}>
                                <p>{isNaN(promedioTiempoJMaquinaria) ? 0 : promedioTiempoJMaquinaria.toFixed(2)} días</p>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={6}>
                                <p>Reportes Cerrados: {conTiempoCierreOtTerminado.length}</p>
                            </Grid>
                            <Grid item xs={6}>
                                <p>{isNaN(promedioTiempoCierreOt) ? 0 : promedioTiempoCierreOt.toFixed(2)} días</p>
                            </Grid>
                        </Grid>
                    </Grid>
                    
                </Grid>
                
                <Fab onClick={handleClose} style={{position: 'absolute', right: 10, top: 10, boxShadow: 'none', backgroundColor: 'transparent'}}>
                    <Close style={{color: '#ccc'}} />
                </Fab>
                
            </div>
        </Dialog>
    )
}

export default ReportsKPIDialog