import React, { useEffect, useState } from 'react'
import { Box, Card, Grid, ListItem, Button, Toolbar, IconButton } from '@material-ui/core'
import { useStylesTheme } from '../../config'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css'
import { useNavigate } from 'react-router-dom';
import { ArrowBackIos } from '@material-ui/icons';
import { useReportsContext } from '../../context';
import { ReviewReportDialog } from '../../dialogs';
const CalendarPage = () => {
    const {reports} = useReportsContext()
    const classes = useStylesTheme()
    const [reportesIniciados, setReportesIniciados] = useState([])
    const [reportesProgramados, setReportesProgramados] = useState([])
    const [reportesSeleccionados, setReportesSeleccionados] = useState([])
    const [value, onChange] = useState(new Date())
    const [datesCalendar, setDatesCalendar] = useState([])
    const [loading, setLoading] = useState(false)
    const [dateSelected, setDateSelected] = useState('')
    const [ reportDataReview, setReportDataReview ] = useState(null)
    const [ openReviewModalState, setOpenReviewModalState ] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        if (reports.length > 0) {
            const reportesIniciadosCache = []
            const reportesProgramadosCache = []
            reports.forEach((reporte) => {
                if (reporte.dateInit) {
                    reportesIniciadosCache.push(reporte)
                } else {
                    reportesProgramadosCache.push(reporte)
                }
            })
            setReportesIniciados(reportesIniciadosCache)
            setReportesProgramados(reportesProgramadosCache)
        }
    }, [reports])

    useEffect(() => {
            const dates = []
            reportesIniciados.forEach((reporte, i) => {
                dates.push(reporte.dateInit.split('T')[0])
            })
            reportesProgramados.forEach((reporte, i) => {
                dates.push(reporte.datePrev.split('T')[0])
            })
            const datesOrders = dates.sort((a, b) => {
                if (a > b) {
                    return -1
                }
                if (a < b) {
                    return 1
                }
                return 0
            })
            const datesFiltered = removeDuplicates(datesOrders)
            console.log(datesFiltered)
            setDatesCalendar(datesFiltered)
    },[reportesIniciados, reportesProgramados])

    const removeDuplicates = (arr) => {
        return arr.filter((item,
            index) => arr.indexOf(item) === index);
    }

    const traduceDia = (num) => {
        if (num === 0) {
            return 'Dom'
        } else if (num === 1) {
            return 'Lun'
        } else if (num === 2) {
            return 'Mar'
        } else if (num === 3) {
            return 'Mie'
        } else if (num === 4) {
            return 'Jue'
        } else if (num === 5) {
            return 'Vie'
        } else if (num === 6) {
            return 'Sab'
        } 
    }

    useEffect(() => {
        setDateSelected(` ${traduceDia(value.getDay())} ${value.toLocaleDateString("es-CL")}`)
        setLoading(true)
        console.log(value)
        const newDate = new Date(value).toISOString().split('T')[0]
        encontrarReportesPorDia(newDate)
    }, [value])

    const encontrarReportesPorDia = (date) => {
        const resportesFiltradosPorDia = reports.filter(report => {
            report.isActive = false
            if (report.dateInit) {
                if (report.dateInit.split('T')[0] === date) {
                    return report
                }
            } else {
                if (report.datePrev.split('T')[0] === date) {
                    return report
                }
            }
        })
        setReportesSeleccionados(resportesFiltradosPorDia)
        setLoading(false)
    }

    const selectOT = (i) => {
        const reportsSelectedCache = [...reportesSeleccionados]
        reportsSelectedCache.forEach((reporte) => {
            reporte.isActive = false
        })
        reportsSelectedCache[i].isActive = true
        setReportesSeleccionados(reportsSelectedCache)
        openReviewModal(reportsSelectedCache[i])
    }

    const ordenarPorOT = (a, b) => {
        if (a.idIndex > b.idIndex) {
            return 1
        }
        if (a.idIndex < b.idIndex) {
            return -1
        }
        return 0
    }

    const onlyCloseReview = () => {
        setReportDataReview(null)
    }

    const openReviewModal = (report) => {
        setReportDataReview(report)
        setOpenReviewModalState(true)
    }    
 
    return (
        <Box height='100%'>
            {
                reportDataReview && <ReviewReportDialog open={openReviewModalState} report={reportDataReview} onlyClose={onlyCloseReview}/>
            }
            <Grid className={'pageRoot'} container spacing={0}>
                <Grid className={classes.pageContainer} item xs={12}>
                    <Card elevation={0} className={'pageCard'}>
                        <Grid style={{flexShrink: 0}}>
                            <div style={{width: '100%', textAlign: 'left', padding: 10 }}>
                                <div style={{width: '100%', textAlign: 'left', color: '#333', backgroundColor: '#fff', borderRadius: 20 }}>
                                    <Toolbar style={{paddingLeft: 0, backgroundColor: '#F9F9F9', borderRadius: 10}}>
                                        <IconButton onClick={() => setTimeout(() => {
                                            navigate(-1)
                                        }, 500)}> 
                                            <ArrowBackIos style={{color: '#333', fontSize: 16}}/> 
                                        </IconButton> 
                                        <p style={{marginTop: 0, marginBottom: 0, fontSize: 16}}>
                                            Calendario
                                        </p>
                                    </Toolbar>
                                </div>
                            </div>
                        </Grid>
                        <Grid container spacing={1} style={{padding: '5px 10px 0px 10px'}}>
                            <Grid item sm={10}>
                                <Calendar
                                    style={{width: '100%'}}
                                    onChange={onChange}
                                    value={value}
                                    tileClassName={({date}) => {
                                        const newDate = new Date(date)
                                        if(
                                            datesCalendar.find( x => 
                                                newDate.toISOString().split('T')[0] === x
                                            )
                                        )   {
                                                return  'highlight'
                                            }
                                    }}
                                />
                            </Grid>
                            <Grid item sm={2}>
                                <div className='text-container'>
                                    <p className='text-container-date'>
                                        {dateSelected}
                                    </p>
                                    {
                                        loading ?
                                        <div>
                                            <p>Buscando reportes...</p>
                                        </div>
                                        :
                                        (reportesSeleccionados.length > 0) ?
                                        reportesSeleccionados.sort(ordenarPorOT).map((reporte, index) => {
                                            return (
                                                <div>
                                                    <p className={reporte.isActive ? 'otLinkActive' : 'otLink'} onClick={() => {selectOT(index)}}>
                                                        OT N° {reporte.idIndex} {(reporte.level === 4) ? 'terminado' : ((reporte.dateInit) ? 'iniciado' : 'programado')}
                                                    </p>
                                                </div>
                                            )
                                        })
                                        :
                                        <div>
                                            <p>Fecha no tiene reportes</p>
                                        </div>
                                    }
                                </div>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

export default CalendarPage
