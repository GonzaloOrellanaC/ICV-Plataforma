import {useState, useEffect} from 'react'
import {Grid, Toolbar, IconButton, Chip, TablePagination, Button, AppBar, Typography} from '@material-ui/core';
import { ArrowBackIos } from '@material-ui/icons';
import { Mantenciones, Inspecciones } from './ReportsListLeft';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown, faCircle, faClipboardList, faCalendar, faDownload, faPlus, faPlusSquare, faInfoCircle, faMapMarker, faChartBar } from '@fortawesome/free-solid-svg-icons';
import './reports.css'
import { ReportsList } from '../../containers';
import { useNavigate } from 'react-router-dom';
import { useAuth, useReportsContext, useSitesContext } from '../../context';
import * as XLSX from 'xlsx'
import { executionReportsRoutes, usersRoutes } from '../../routes';
import { LianearProgresDialog, LoadingLogoDialog, ReportsResumeDialog } from '../../dialogs';
import { date, dateSimple, dateWithYear } from '../../config';
import SeleccionarObraDialog from '../../dialogs/SeleccionarObraDialog';
import ReportsKPIDialog from '../../dialogs/ReportsKPIDialog';

const ReportsPage = () => {
    const {sites} = useSitesContext()
    const {admin, isSapExecutive, isShiftManager, isChiefMachinery} = useAuth()
    const {reports, setListSelected, listSelected, listSelectedCache, setListSelectedCache, getReports, loading, statusReports, pautas, siteSelected} = useReportsContext()
    const [inspeccionesTotales, setInspeccionesTotales] = useState([])
    const [mantencionesTotales, setMantencionesTotales] = useState([])
    const [ inspecciones, setInspecciones ] = useState([]);
    const [ mantenciones, setMantenciones ] = useState([]);
    const [ hableCreateReport, setHableCreateReport ] = useState(false);
    const [ inspeccionesPorAsignar, setInspeccionesPorAsignar ] = useState(0);
    const [ inspeccionesCompletadas, setInspeccionesCompletadas ] = useState(0);
    const [ mantencionesPorAsignar, setMantencionesPorAsignar ] = useState(0);
    const [ mantencionesCompletadas, setMantencionesCompletadas ] = useState(0);
    const [ list, setList ] = useState([]);
    const [ vista, setVista ] = useState(true);
    /* const {loading, setLoading} = useExecutionReportContext() */
    const [ rowsPerPage, setRowsPerPage ] = useState(10)
    const [ page, setPage]  = useState(0);
    const [ listToShow, setListToShow ] = useState([])
    const [ totalItems, setTotalItems ] = useState(0)
    const [site, setSite] = useState('nada')
    const [typeReportsSelected, setTypeReportsSelected] = useState('')
    const navigate = useNavigate()
    const [ flechaListaxOT, setFlechaListaxOT ] = useState(faArrowUp)
    const [canOpenNewReport, setCanOpenNewReport] = useState(false)
    const [loadingSpinner, setLoading] = useState(false)
    const [openReportSumary, setOpenReportSumary] = useState(false)
    const [openSeleccionarObra, setOpnSeleccionarObra] = useState(false)
    const [opnKPI, setOpnKPI] = useState(false)
    const [siteObject, setSiteObject] = useState()
    const [totalReport, setTotalReport] = useState(0)
    const [revisionNumber, setRevisionNumber] = useState(0)



    useEffect(() => {
        if (sites.length > 0 && siteSelected) {
            console.log(sites)
            const siteFiltered = sites.filter(site => {if (site.idobra === siteSelected) return site})[0]
            setSiteObject(siteFiltered)
        }
    },[siteSelected])

    useEffect(() => {
        if (pautas.length === 0) {
            setCanOpenNewReport(false)
        } else {
            setCanOpenNewReport(true)
        }
    }, [pautas])
    useEffect(() => {
        if (listSelected.length > 0) {
            initReadList()
        } else {
            setListToShow([])
        }
    }, [listSelected])
    useEffect(() => {
        if (admin || isSapExecutive) {
            setHableCreateReport(true)
        }
    }, [admin, isSapExecutive])
    useEffect(() => {
        if (reports.length > 0) {
            const inspeccionesTemp = reports.filter(report => {
                if (report.reportType === "Inspección") {
                    return report
                }
            })
            const mantencionesTemp = reports.filter(report => {
                if (report.reportType === "Mantención") {
                    return report
                }
            })
            setInspecciones(Inspecciones)
            setMantenciones(Mantenciones)
            setInspeccionesTotales(inspeccionesTemp)
            setMantencionesTotales(mantencionesTemp)
        } else {
            setInspecciones(Inspecciones)
            setMantenciones(Mantenciones)
            setInspeccionesTotales([])
            setMantencionesTotales([])
        }
    }, [reports])
    useEffect(() => {
        if (inspeccionesTotales.length > 0) {
            const inspeccionesSinAsignar = inspeccionesTotales.filter(inspeccion => {
                if(inspeccion.state==='Asignar'/* usersAssigned.length === 0 */) {
                    return inspeccion
                }
            })
            const inspeccionesEnProceso = inspeccionesTotales.filter(inspeccion => {
                if(inspeccion.usersAssigned.length > 0 && inspeccion.state==='En proceso' && (inspeccion.level < 3 && (inspeccion.level > 0 || !inspeccion.level))) {
                    return inspeccion
                }
            })
            const inspeccionesPorCerrar = inspeccionesTotales.filter(inspeccion => {
                if(inspeccion.level === 3) {
                    return inspeccion
                }
            })
            const inspeccionesCerradas = inspeccionesTotales.filter(inspeccion => {
                if(inspeccion.level === 4) {
                    return inspeccion
                }
            })
            const inspeccionesTable = [...Inspecciones]
            inspeccionesTable[0].number = inspeccionesCerradas.length
            inspeccionesTable[1].number = inspeccionesPorCerrar.length
            inspeccionesTable[2].number = inspeccionesEnProceso.length
            inspeccionesTable[3].number = inspeccionesSinAsignar.length
            inspeccionesTable[0].lista = inspeccionesCerradas
            inspeccionesTable[1].lista = inspeccionesPorCerrar
            inspeccionesTable[2].lista = inspeccionesEnProceso
            inspeccionesTable[3].lista = inspeccionesSinAsignar
            setInspecciones(inspeccionesTable)
        } else {
            const inspeccionesTable = [...Inspecciones]
            inspeccionesTable[0].number = 0
            inspeccionesTable[1].number = 0
            inspeccionesTable[2].number = 0
            inspeccionesTable[3].number = 0
            inspeccionesTable[0].lista = []
            inspeccionesTable[1].lista = []
            inspeccionesTable[2].lista = []
            inspeccionesTable[3].lista = []
            setInspecciones(inspeccionesTable)
        }
    },[inspeccionesTotales])
    useEffect(() => {
        if (mantencionesTotales.length > 0) {
            const mantencionesSinAsignar = mantencionesTotales.filter(mantencion => {
                if(mantencion.state==='Asignar'/* usersAssigned.length === 0 */) {
                    return mantencion
                }
            })
            const mantencionesEnProceso = mantencionesTotales.filter(mantencion => {
                if(mantencion.usersAssigned.length > 0 && mantencion.state==='En proceso' && (mantencion.level < 3 && (mantencion.level > 0 || !mantencion.level))) {
                    return mantencion
                }
            })
            const mantencionesPorCerrar = mantencionesTotales.filter(mantencion => {
                if(mantencion.level === 3) {
                    return mantencion
                }
            })
            const mantencionesCerradas = mantencionesTotales.filter(mantencion => {
                if(mantencion.level === 4) {
                    return mantencion
                }
            })
            const mantencionesTable = [...Mantenciones]
            mantencionesTable[0].number = mantencionesCerradas.length
            mantencionesTable[1].number = mantencionesPorCerrar.length
            mantencionesTable[2].number = mantencionesEnProceso.length
            mantencionesTable[3].number = mantencionesSinAsignar.length
            mantencionesTable[0].lista = mantencionesCerradas
            mantencionesTable[1].lista = mantencionesPorCerrar
            mantencionesTable[2].lista = mantencionesEnProceso
            mantencionesTable[3].lista = mantencionesSinAsignar
            setMantenciones(mantencionesTable)
        } else {
            const mantencionesTable = [...Mantenciones]
            mantencionesTable[0].number = 0
            mantencionesTable[1].number = 0
            mantencionesTable[2].number = 0
            mantencionesTable[3].number = 0
            mantencionesTable[0].lista = []
            mantencionesTable[1].lista = []
            mantencionesTable[2].lista = []
            mantencionesTable[3].lista = []
            setMantenciones(mantencionesTable)
        }
    },[mantencionesTotales])

    useEffect(() => {
        if ((inspecciones.length > 0)||(mantenciones.length > 0)) {
            if (localStorage.getItem('buttonSelected')) {
                document.getElementById(localStorage.getItem('buttonSelected')).click()
            }
        }
    }, [inspecciones, mantenciones])

    const selectList = (lista, idButton, index, name) => {
        setTypeReportsSelected(name)
        localStorage.setItem('buttonSelected', idButton)
        const inspecionesCache = [...inspecciones]
        inspecionesCache.forEach((el, i) => {
            document.getElementById(`button_${i}_inspecciones`).style.backgroundColor = el.buttonColor
        })
        const mantencionesCache = [...mantenciones]
        mantencionesCache.forEach((el, i) => {
            document.getElementById(`button_${i}_mantenciones`).style.backgroundColor = el.buttonColor
        })
        document.getElementById(idButton).style.backgroundColor = '#ccc'
        if (lista.length > 0) {
            if (name === 'Asignar' || name === 'En proceso') {
                setListSelected(lista.sort(compareReverse))
            } else {
                setListSelected(lista.sort(compareNumbers))
            }
            setListSelectedCache(lista)
            setVista(false)
        } else {
            setVista(true)
        }
    }

    const compareNumbers = (a, b) => {
        return b.idIndex - a.idIndex;
    }

    const compareReverse = (a, b) => {
        return a.idIndex - b.idIndex;
    }

    const reloadData = () => {
        location.reload();
    }

    const initReadList = () => {
        let lista = []
        for (let i = (0*rowsPerPage); i < (rowsPerPage+(0*rowsPerPage)); i++) {
            if (listSelected[i]) {
                lista.push(listSelected[i])
            }
            if (i === ((rowsPerPage+(0*rowsPerPage)) - 1)) {
                const listaCache = [...lista]
                const nuevaLista = listaCache.sort((typeReportsSelected === 'Asignar' || typeReportsSelected === 'En proceso') ? compareReverse : compareNumbers)/* .sort((a, b) => {
                    return b.idIndex - a.idIndex
                }) */
                setListToShow(nuevaLista)
                setTotalItems(listSelected.length)
            }
        }
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
        let lista = []
        for (let i = (newPage*rowsPerPage); i < (rowsPerPage+(newPage*rowsPerPage)); i++) {
            if (listSelected[i]) {
                lista.push(listSelected[i])
            }
            if (i === ((rowsPerPage+(newPage*rowsPerPage)) - 1)) {
                const listaCache = [...lista]
                const nuevaLista = listaCache.sort(compareNumbers)/* .sort((a, b) => {
                    return b.idIndex - a.idIndex
                }) */
                setListToShow(nuevaLista)
                /* setTotalItems(nuevaLista.length) */
            }
        }
    }
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0)
        let lista = []
        for (let i = (page*parseInt(event.target.value, 10)); i < (parseInt(event.target.value, 10) + (page*parseInt(event.target.value, 10))); i++) {
            if (listSelected[i]) {
                lista.push(listSelected[i])
            }
            if (i === ((parseInt(event.target.value, 10) + (page*parseInt(event.target.value, 10))) - 1)) {
                setListToShow(lista)
            }
        }
    }

    const ordenarPorNumeroOT = (value = new String) => {
        if (value === 'mayor') {
            setFlechaListaxOT(faArrowDown)
            const listaCache = [...listSelected]
            console.log(listaCache)
            const nuevaLista = listaCache.sort((a, b) => {
                return Number(a.idIndex) - Number(b.idIndex)
            })
            initReadList(nuevaLista)
        } else {
            setFlechaListaxOT(faArrowUp)
            const listaCache = [...listSelected]
            console.log(listaCache)
            const nuevaLista = listaCache.sort((a, b) => {
                return Number(b.idIndex) - Number(a.idIndex)
            })
            initReadList(nuevaLista)
        }
    }

/*     const ordenarPorNumeroMaquina = (value = new String) => {
        if (value === 'mayor') {
            setFlechaListaxMaquina(faArrowDown)
            const listaCache = [...list]
            console.log(listaCache)
            const nuevaLista = listaCache.sort((a, b) => {
                return Number(a.number) - Number(b.number)
            })
            initReadList(nuevaLista)
        } else {
            setFlechaListaxMaquina(faArrowUp)
            const listaCache = [...list]
            console.log(listaCache)
            const nuevaLista = listaCache.sort((a, b) => {
                return Number(b.number) - Number(a.number)
            })
            initReadList(nuevaLista)
        }
    } */

    const textoFiltrado = (value) => {
        console.log(value)
        const listaCache = [...listSelectedCache]
        if (value.length > 0) {
            const lista = []
            listaCache.forEach((element, index) => {
                if (index === 0) {
                    console.log(element)
                }
                if (element.idIndex.toString().match((Number(value)).toString()) /* === Number(value) */ || 
                    element.machineData.model.match(value)/*  === value */ || 
                    element.machineData.equ.match(value) /* === value */ || 
                    element.sapId.match(value)/*  === value */) {
                        if (site === 'nada') {
                            lista.push(element)
                        } else {
                            if (admin && (element.idobra === site)) {
                                lista.push(element)
                            }
                        }
                }
                if (index === (listaCache.length - 1)) {
                    setListSelected(lista.sort(compareNumbers))
                    setTotalItems(lista.length)
                }
            })
        } else {
            setListSelected(listSelectedCache.sort(compareNumbers))
            setTotalItems(listSelected.length)
        }
    }

    const seleccionFiltrada = (value) => {
        setSite(value)
        /* const listaCache = [...listSelectedCache]
        if (value === 'nada') {
            setListSelected(listSelectedCache)
            setTotalItems(listSelectedCache.length)
        } else {
            const lista = []
            listaCache.forEach((element, index) => {
                if (element.site === value.toString()) {
                    lista.push(element)
                }
                if (index === (listaCache.length - 1)) {
                    setListSelected(lista)
                    setTotalItems(lista.length)
                }
            })
        } */
    }

    useEffect(() => {
        const listaCache = [...listSelectedCache]
        if (site === 'nada') {
            setListSelected(listSelectedCache)
            setTotalItems(listSelectedCache.length)
        } else {
            const lista = []
            listaCache.forEach((element, index) => {
                if (element.site === site) {
                    lista.push(element)
                }
                if (index === (listaCache.length - 1)) {
                    setListSelected(lista)
                    setTotalItems(lista.length)
                }
            })
        }
    }, [site])

    const downloadFile = async () => {
        if (reports.length > 0) {
            setLoading(true)
            console.log('download')
            setTotalReport(reports.length)
            const reportsCache = [...reports]
            const reportsToDownload = []
            const materials = []
            const users = []
            reportsCache.forEach(async (report, i)=>{
                let groupList = []
                let newVariables = {}
                const response = await executionReportsRoutes.getExecutionReportById(report)
                report.commitWarning = ''
                report.isWarning = false
                const operators = report.usersAssigned
                const operatorsList = []
                operators.forEach(async operator => {
                    const res = await usersRoutes.getUser(operator)
                    operatorsList.push(res.data)
                })
                const shiftManager = await usersRoutes.getUser(report.shiftManagerApprovedBy)
                const chiefMachinery = await usersRoutes.getUser(report.chiefMachineryApprovedBy)
                const sapExecutive = await usersRoutes.getUser(report.sapExecutiveApprovedBy)
                const usersData = {
                    'N° OT': report.idIndex,
                    'Ejecutivo SAP': sapExecutive.data && sapExecutive.data.name ? `${sapExecutive.data.name} ${sapExecutive.data.lastName}` : 'Sin Cierre SAP',
                    'Fecha de aprobación SAP': report.dateClose ? dateWithYear(report.dateClose) : 'Sin Cierre SAP',
                    'Jefe de Maquinaria': chiefMachinery.data && chiefMachinery.data.name ? `${chiefMachinery.data.name} ${chiefMachinery.data.lastName}` : 'Sin Aprobación Maquinaria',
                    'Fecha de aprobación Maquinaria': report.chiefMachineryApprovedDate ? dateWithYear(report.chiefMachineryApprovedDate) : 'Sin Aprobación Maquinaria',
                    'Jefe de Turno': shiftManager.data && shiftManager.data.name ? `${shiftManager.data.name} ${shiftManager.data.lastName}` : 'Sin Aprobación Jefe de Turno',
                    'Fecha de aprobación Jefe de Turno': report.shiftManagerApprovedDate ? dateWithYear(report.shiftManagerApprovedDate) : 'Sin Aprobación Jefe de Turno',
                }
                console.log(usersData)
                users.push(usersData)
                const reporteDescarga = {
                    'N° OT': report.idIndex,
                    'Número OM': report.sapId,
                    'Fecha de creación': dateWithYear(report.createdAt),
                    'Fecha de inicio previsto': dateWithYear(report.datePrev),
                    'Fecha de término previsto': dateWithYear(report.endPrev),
                    'Fecha de inicio reporte': dateWithYear(report.dateInit),
                    'Fecha de término reporte': dateWithYear(report.endReport),
                    'Fecha de cierre': dateWithYear(report.dateClose),
                    'Guía': report.guide,
                    'ID PM': report.idPm,
                    'N° máquina': report.machine,
                    'Tipo de reporte': report.reportType,
                    'Código de obra': report.site,
                    'Estado de orden': report.state,
                    'Modo Test': report.testMode ? 'SI' : 'NO',
                    'Ultima actualización': dateWithYear(report.updatedAt),
                    'URL documento PDF': report.urlPdf,
                    'Creado por sistema': report.isAutomatic ? 'SI' : 'NO',
                    'Progreso de avance': report.progress,
                    'Tiene alerta': 'NO',
                    'Comentario a considerar': ''
                }
                const reportTemp = reporteDescarga
                if (response) {
                    if (response.data && response.data.data && response.data.data.group) {
                        const group = Object.values(response.data.data.group)
                        const material = {
                            'N° OT': report.idIndex
                        }
                        group.forEach((el, n) => {
                            el.forEach((item, i) => {
                                if (item.isWarning) {
                                    reportTemp['Tiene alerta'] = 'SI'
                                    if (!reportTemp['Comentario a considerar']) {
                                        reportTemp['Comentario a considerar'] = 'Se detecta tareas pendientes:\n'
                                    }
                                    reportTemp['Comentario a considerar'] += `- Apartado ${item.strpmdesc}, pregunta ${i + 1};\n`
                                }
                                if (item.unidad !== '*') {
                                    groupList.push(item)
                                    if (!material[`${item.partnumberUtl}/${item.unidad} proyectada`]) {
                                        material[`${item.partnumberUtl}/${item.unidad} proyectada`] = 0
                                    }
                                    material[`${item.partnumberUtl}/${item.unidad} proyectada`] = material[`${item.partnumberUtl}/${item.unidad} proyectada`] + item.cantidad

                                    if (!material[`${item.partnumberUtl}/${item.unidad} usada`]) {
                                        material[`${item.partnumberUtl}/${item.unidad} usada`] = 0
                                    }
                                    material[`${item.partnumberUtl}/${item.unidad} usada`] = material[`${item.partnumberUtl}/${item.unidad} usada`] + (item.unidadData ? parseFloat(item.unidadData) : 0)
                                }
                            })
                            if (n === (group.length - 1)) {
                                if (!material['Tiene alerta'] && (material['Comentario a considerar'] && material['Comentario a considerar'].length === 0)) {
                                    material['Comentario a considerar'] = 'Reporte ha sido completado.'
                                }
                            }
                        })
                        materials.push(material)
                        reportsToDownload.push(reportTemp)
                    } else {
                        reportsToDownload.push(reportTemp)
                    }
                } else {
                    reportsToDownload.push(reportTemp)
                }
                setRevisionNumber((100 * (i + 1))/reportsCache)
                if (i === (reportsCache.length - 1)) {
                    console.log(reportsToDownload)
                    console.log(materials)
                    console.log(users)
                    const workbook = XLSX.utils.book_new();
                    const worksheet = XLSX.utils.json_to_sheet(reportsToDownload);
                    const material = XLSX.utils.json_to_sheet(materials);
                    const userDataXLS = XLSX.utils.json_to_sheet(users);
                    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos de reporte");
                    XLSX.utils.book_append_sheet(workbook, material, "Datos de material");
                    XLSX.utils.book_append_sheet(workbook, userDataXLS, "Datos de usuarios");
                    XLSX.writeFile(workbook, `${Date.now()}.xlsx`)
                    setLoading(false)
                }
            })
        } else {
            alert('Debe contar con al menos una OT creada.')
        }
    }

    const openToReportSumary = () => {
        setOpenReportSumary(true)
    }

    const closeToReportSumary = () => {
        setOpenReportSumary(false)
    }

    const closeSeleccionarObra = () => {
        setOpnSeleccionarObra(false)
    }

    const closeKPI = () => {
        setOpnKPI(false)
    }

    return(
        <div className='container-width' >
            <LoadingLogoDialog
                open={loadingSpinner}
            />
            <LianearProgresDialog open={loadingSpinner} progress={revisionNumber} />
            {openReportSumary && <ReportsResumeDialog
                open={openReportSumary}
                handleClose={closeToReportSumary}
                reports={reports}
            />}
            {opnKPI && <ReportsKPIDialog 
                open={opnKPI}
                handleClose={closeKPI}
                reports={reports}
            />
            }
            {
            openSeleccionarObra && <SeleccionarObraDialog open={openSeleccionarObra} handleClose={closeSeleccionarObra} />
            }
            <div style={{width: '100%', textAlign: 'left', padding: 10 }}>
                <div style={{width: '100%', textAlign: 'left', color: '#333', backgroundColor: '#fff', borderRadius: 20, flexGrow: 1}}>
                    {/* <AppBar position="static"> */}
                        <Toolbar style={{paddingLeft: 0, backgroundColor: '#F9F9F9', borderRadius: 10}}>
                            <IconButton onClick={() => setTimeout(() => {
                                navigate(-1)
                            }, 500)}>
                                <ArrowBackIos style={{color: '#333', fontSize: 16}}/> 
                            </IconButton>
                            <Typography variant='h1' style={{marginTop: 0, marginBottom: 0, fontSize: 16, width: '100%'}}>
                                Ordenes de trabajo
                            </Typography>
                            {
                                (admin && siteObject) && <p style={{ position: 'absolute',right: 320, textAlign: 'right', maxWidth: 300, borderColor: '#ccc' }}>
                                    Obra seleccionada: <br />{`${siteObject && siteObject.descripcion}`}
                                </p>
                            }
                            {admin && <IconButton
                                color={'primary'} 
                                style={{ marginRight: 5 }}
                                edge={'end'}
                                hidden={!hableCreateReport}
                                onClick={() => setOpnSeleccionarObra(true)}
                                title='Seleccionar Obra'
                            >
                                <FontAwesomeIcon icon={faMapMarker}/>
                            </IconButton>}
                            {admin && <IconButton
                                color={'primary'} 
                                style={{ marginRight: 5 }}
                                edge={'end'}
                                hidden={!hableCreateReport}
                                onClick={() => setOpnKPI(true)}
                                title='KPI'
                            >
                                <FontAwesomeIcon icon={faChartBar}/>
                            </IconButton>}
                            <IconButton
                                color={'primary'} 
                                style={{ marginRight: 5 }}
                                edge={'end'}
                                hidden={!hableCreateReport}
                                onClick={downloadFile}
                                title='Exportar Información de Reportes'
                            >
                                <FontAwesomeIcon icon={faDownload}/>
                            </IconButton>
                            <IconButton
                                color={'primary'} 
                                style={{ marginRight: 5 }}
                                edge={'end'}
                                hidden={!hableCreateReport}
                                onClick={openToReportSumary}
                                title='Información de Reportes'
                            >
                                <FontAwesomeIcon icon={faInfoCircle}/>
                            </IconButton>
                            <IconButton
                                color={'primary'} 
                                style={{ marginRight: 5 }}
                                edge={'end'}
                                onClick={()=>{navigate('/calendar')}} 
                                title='Calendario'
                            >
                                <FontAwesomeIcon icon={faCalendar}/>
                            </IconButton>
                            <IconButton
                                style={{position: 'relative'}}
                                color={'primary'} 
                                edge={'end'}
                                hidden={!hableCreateReport}
                                onClick={()=>{canOpenNewReport ? navigate('/reports/create-report') : alert('Espere a que las pautas estén descargadas')}} 
                                title='Nuevo reporte'
                            >
                                <FontAwesomeIcon style={{position: 'absolute', zIndex: 100, fontSize: 12, top: 10, right: 10, color: '#F78E63', fontWeight: 600}} icon={faPlus}/>
                                <FontAwesomeIcon style={{zIndex: 10}} icon={faClipboardList}/>
                            </IconButton>
                        </Toolbar>
                </div>
            </div>
            <Grid container>
                <Grid item xs={12} sm={12} md={4} lg={'auto'} xl={'auto'}>
                    <div className='menu-card'>
                        <h3>Inspecciones</h3>
                        <div style={{float: 'left', width: 'calc(45%)', marginRight: 5, padding: 10, backgroundColor: '#fff', borderRadius: 10}}>
                            <div style={{float: 'left', width: '30%'}}>
                                <p style={{fontSize: 32, margin: 0}}>{Inspecciones[3].number}</p>
                            </div>
                            <div style={{float: 'left', right: 5, width: '60%'}}>
                                <p style={{fontSize: 10, margin: 0}}>Inspecciones por asignar</p>
                            </div>
                        </div>
                        <div style={{float: 'right', width: 'calc(45%)', marginLeft: 5, padding: 10, backgroundColor: '#fff', borderRadius: 10}}>
                            <div style={{float: 'left', width: '30%'}}>
                                <p style={{fontSize: 32, margin: 0}}>{inspeccionesCompletadas} </p>
                            </div>
                            <div style={{float: 'left', right: 5, width: '60%'}}>
                                <p style={{fontSize: 10, margin: 0}}>Inspecciones completadas en la semana</p>
                            </div>
                        </div>
                        <div style={{paddingLeft: 10, paddingRight: 10,  marginTop: '10vh'}}>
                        {
                            inspecciones.map((e, i) => {
                                return(
                                    <Grid key={i} container style={{height: '5vh'}}>
                                        <Grid item style={{width: '15%'}}>
                                            <FontAwesomeIcon icon={faCircle} size='2x' style={{marginRight: 10}} color={e.color}/>
                                        </Grid>
                                        <Grid item style={{width: '30%'}}>
                                            <p style={{margin: 0, fontSize: 12}}>{e.name}</p>
                                        </Grid>
                                        <Grid item style={{width: '15%'}}>
                                            <Chip label={e.number} style={{marginLeft: 10, marginRight: 10}} />
                                        </Grid>
                                        <Grid item style={{width: '40%', textAlign: 'right'}}>
                                            <button
                                                id={`button_${i}_inspecciones`}
                                                onClick={()=>selectList(e.lista, `button_${i}_inspecciones`, i, e.name)}
                                                style={
                                                    {
                                                        position: 'relative',
                                                        right: 5,
                                                        width: 80,
                                                        height: 30,
                                                        borderRadius: 20,
                                                        backgroundColor: e.buttonColor
                                                    }
                                                }
                                            >
                                                {e.button}
                                            </button>
                                        </Grid>
                                    </Grid>
                                )
                            })
                        }
                        </div>
                    </div>
                    <div className='menu-card'>
                        <h3>Mantenciones</h3>
                        <div style={{float: 'left', width: 'calc(45%)', marginRight: 5, padding: 10, backgroundColor: '#fff', borderRadius: 10}}>
                            <div style={{float: 'left', width: '30%'}}>
                                <p style={{fontSize: 32, margin: 0}}>{Mantenciones[3].number}</p>
                            </div>
                            <div style={{float: 'left', right: 5, width: '60%'}}>
                                <p style={{fontSize: 10, margin: 0}}>Mantenciones por asignar</p>
                            </div>
                        </div>
                        <div style={{float: 'right', width: 'calc(45%)', marginLeft: 5, padding: 10, backgroundColor: '#fff', borderRadius: 10}}>
                            <div style={{float: 'left', width: '30%'}}>
                                <p style={{fontSize: 32, margin: 0}}>{mantencionesCompletadas} </p>
                            </div>
                            <div style={{float: 'left', right: 5, width: '60%'}}>
                                <p style={{fontSize: 10, margin: 0}}>Mantenciones completadas en la semana</p>
                            </div>
                        </div>
                        <div style={{paddingLeft: 10, paddingRight: 10,  marginTop: '10vh'}}>
                        {
                            mantenciones.map((e, i) => {
                                return(
                                    <Grid key={i} container style={{height: '5vh'}}>
                                        <Grid item style={{width: '15%'}}>
                                            <FontAwesomeIcon icon={faCircle} size='2x' style={{marginRight: 10}} color={e.color}/>
                                        </Grid>
                                        <Grid item style={{width: '30%'}}>
                                            <p style={{margin: 0, fontSize: 12}}>{e.name}</p>
                                        </Grid>
                                        <Grid item style={{width: '15%'}}>
                                            <Chip label={e.number} style={{marginLeft: 10, marginRight: 10}} />
                                        </Grid>
                                        <Grid item style={{width: '40%', textAlign: 'right'}}>
                                            <button
                                                id={`button_${i}_mantenciones`} 
                                                onClick={()=>selectList(e.lista, `button_${i}_mantenciones`, i, e.name)}
                                                style={
                                                    {
                                                        position: 'relative',
                                                        right: 5,
                                                        width: 80,
                                                        height: 30,
                                                        borderRadius: 20,
                                                        backgroundColor: e.buttonColor
                                                    }
                                                }
                                            >
                                                {e.button}
                                            </button>
                                        </Grid>
                                    </Grid>
                                )
                            })
                        }
                        </div>
                    </div>
                </Grid>
                <Grid item xs={12} sm={12} md={8} lg={9} xl={9}>
                    {
                        vista ? <div>
                            <img style={{margin: 0, position: 'absolute', top: '50%', left: 'calc(100%/1.53)', msTransform: 'translateY(-50%)', transform: 'translateY(-50%)'}} src="../../assets/icons/Arrow.svg" alt="" />
                            <div style={{textAlign: 'center', position: 'absolute', top: '55%', left: 'calc(100%/1.6)'}}>
                                <p>Selecciona una opción <br /> para ver el detalle</p>
                            </div>
                        </div>
                        :
                        <div style={{height: 'calc(100vh - 240px)', display: 'block', overflowY: 'auto'}}>
                            <div style={{width: '100%', paddingLeft: 10, paddingRight: 10}}>
                                <Grid container style={{width: '100%', borderBottomColor: '#ccc', borderBottomStyle: 'solid', borderBottomWidth: 1, paddingBottom: 10}}>
                                    <Grid item xl={'auto'}>
                                        <p style={{ width: 80 }}>Filtros: </p>
                                    </Grid>
                                    <Grid item xl={3}>
                                        <input
                                            style={{ marginRight: 10, marginTop: 14, marginBottom: 14, width: 300 }}
                                            placeholder={'Ingrese N° OT, Máquina, Flota o Cód. SAP'}
                                            onChange={(e) => { textoFiltrado(e.target.value) }}  />
                                    </Grid>
                                    {/* {admin && <>
                                        <Grid item xl={'auto'}>
                                            <p style={{ width: 80 }}>Obra: </p>
                                        </Grid>
                                        <Grid item xl={2}>
                                            <select style={{ marginRight: 10, marginTop: 14, marginBottom: 14, width: 300 }} name="select"  onChange={(e) => { seleccionFiltrada(e.target.value) }}>
                                                <option value={'nada'}>SELECCIONE OBRA...</option>
                                                {
                                                    sitesToSelection.map((site, i) => {
                                                        return (
                                                            <option key={i} value={site.idobra}>{site.descripcion}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </Grid>                                    
                                    </>} */}
                                    <Grid item sm={'auto'}>
                                        {/* <button disabled={loading} style={
                                            {
                                                position: 'absolute', 
                                                right: 10, 
                                                color: '#fff',
                                                backgroundColor: !loading ? '#be2e26' : '#ccc',
                                                paddingTop: 10,
                                                paddingBottom: 10,
                                                paddingLeft: 20,
                                                paddingRight: 20,
                                                borderRadius: 20,
                                                borderColor: 'transparent',
                                                marginRight: 10
                                            }
                                        } onClick={getReports}>
                                            Actualizar Listado
                                        </button> */}
                                    </Grid>
                                </Grid>
                            </div>
                            {!vista ? 
                            <ReportsList 
                                list={listToShow}
                                typeReportsSelected={typeReportsSelected}
                                statusReports={statusReports}
                                getReports={getReports}
                                /* reloadData={reloadData}  */
                                /* ordenarPorNumeroOT={ordenarPorNumeroOT} */
                                /* flechaListaxOT={flechaListaxOT} */
                            /> : <></>}
                            {
                            (listToShow.length > 0) ? <TablePagination
                                component="div"
                                color={'primary'}
                                style={{ position: 'absolute', right: 20, bottom: 10, borderColor: '#ccc', borderWidth: 1, borderStyle: 'solid' }}
                                onPageChange={handleChangePage}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleChangeRowsPerPage}                          
                                count={totalItems}
                                page={page}
                            />
                                :
                            <></>
                        }
                        </div>
                    }
                </Grid>
            </Grid>
        </div>
    )
}

export default ReportsPage
