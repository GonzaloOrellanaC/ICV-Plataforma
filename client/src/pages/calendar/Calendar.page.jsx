import React, { useEffect, useState } from 'react'
import { Box, Card, Grid, ListItem, Button, Toolbar, IconButton } from '@mui/material'
import { useStylesTheme } from '../../config'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css'
import { useNavigate } from 'react-router-dom';
import { ArrowBackIos } from '@mui/icons-material';
import { useReportsContext } from '../../context';
import { ReviewReportDialog } from '../../dialogs';
const CalendarPage = () => {
    const {reports, reportsResume} = useReportsContext()
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
        const buttons = document.querySelector('.react-calendar__navigation')
        if (buttons) {
            buttons.addEventListener('click', (event) => {
                reloadData()
            })
        }
    },[])

    useEffect(() => {
        if (reportsResume.length > 0) {
            const reportesIniciadosCache = []
            const reportesProgramadosCache = []
            reportsResume.forEach((reporte) => {
                if (reporte.dateInit) {
                    reportesIniciadosCache.push(reporte)
                } else {
                    reportesProgramadosCache.push(reporte)
                }
            })
            setReportesIniciados(reportesIniciadosCache)
            setReportesProgramados(reportesProgramadosCache)
            reloadData()
        }
    }, [reportsResume])

    const reloadData = () => {
        setTimeout(() => {
            const el = document.getElementsByClassName('react-calendar__month-view__days')
            if (el) {
                for (let i = 0; i < el[0].children.length; i++) {
                    const date = el[0].children[i].childNodes[0].ariaLabel
                    if (date) {
                        createOTDiv(date, el[0].children[i])
                    }
                }
            }
        }, 1000);
    }

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

    const diaANumero = (date) => {
        let newDate
        /* console.log(Number(date[2])) */
        if (isNaN(Number(date[2]))) {
            newDate = '0' + `${date}`
        } else {
            newDate = `${date}`
        }
        let day = `${newDate[0]}${newDate[1]}`
        let month 
        if (newDate.includes('enero')) {
            month = '01'
        } else if (newDate.includes('febrero')) {
            month = '02'
        } else if (newDate.includes('marzo')) {
            month = '03'
        } else if (newDate.includes('abril')) {
            month = '04'
        } else if (newDate.includes('mayo')) {
            month = '05'
        } else if (newDate.includes('junio')) {
            month = '06'
        } else if (newDate.includes('julio')) {
            month = '07'
        } else if (newDate.includes('agosto')) {
            month = '08'
        } else if (newDate.includes('septiembre')) {
            month = '09'
        } else if (newDate.includes('octubre')) {
            month = '10'
        } else if (newDate.includes('noviembre')) {
            month = '11'
        } else if (newDate.includes('diciembre')) {
            month = '12'
        }
        let year = `${newDate[newDate.length - 4]}${newDate[newDate.length - 3]}${newDate[newDate.length - 2]}${newDate[newDate.length - 1]}`
        return (`${year}/${month}/${day}`)
    }

    useEffect(() => {
        console.log(value)
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

    const createOTDiv = (date, element) => {
        reportsResume.forEach((report, i) => {
            let ul = document.getElementById(`${date}`)
            if (!ul) {
                ul = document.createElement('ul')
                ul.setAttribute('id', `${date}`)
                ul.style.position = 'absolute'
                ul.style.overflowY = 'auto'
                ul.style.maxHeight = 'calc((100vh - 280px)/7)'
                ul.style.minWidth = '150px'
                ul.style.right = '5px'
                ul.style.bottom = '0px'
                ul.style.padding = '0px 5px'
                ul.style.margin = '0px'
                ul.style.backgroundColor = '#e9e9e9'
                ul.style.color = 'black'
                ul.style.fontSize = '10px'
                ul.style.textAlign = 'left'
            }
            element.style.position = 'relative'
            element.appendChild(ul)
            if (removeTime(new Date(report.dateInit ? report.dateInit : report.datePrev)).toLocaleDateString() === new Date(diaANumero(date)).toLocaleDateString()) {
                const el2 = document.getElementById(`${i}-${report.idIndex}`)
                if (!el2) {
                    let newElement = document.createElement("li")
                    newElement.className = report.isAutomatic ? 'itemListAutomatic' :'itemList'
                    newElement.setAttribute('id', `${i}-${report.idIndex}`)
                    newElement.innerText = `OT ${report.idIndex} - E ${report.equ} - ${(report.guide === 'Pauta de Inspección') ? 'P. Insp' : report.guide} - ${report.dateInit ? 'Inic.' : 'Progr.'}`
                    newElement.onclick = () => {
                        const reportFiltered = reports.filter(r => {if (report._id === r._id) return r})
                        if (reportFiltered[0]) {
                            setReportDataReview(reportFiltered[0])
                            setOpenReviewModalState(true)
                        }
                    }
                    ul.appendChild(newElement)
                }
            } 
        })
    }
    

    const removeTime = (date) => {
        if (date) {
            return new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate()
            );
        }
    }

    const changeView = (e) => {
        console.log('Cambio vista ', e)
    }

    const traduceFecha = (date) => {
        const newDate = traduceDia(date)
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
                            <Grid item sm={12}>
                                <Calendar
                                    style={{width: '100%'}}
                                    onChange={onChange}
                                    onViewChange={changeView}
                                    value={value}
                                    locale="es-US"
                                    tileClassName={(e) => {
                                        const newDate = new Date(e.date)
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
                            {/* <Grid item sm={2}>
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
                                                <div key={index}>
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
                            </Grid> */}
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

export default CalendarPage
