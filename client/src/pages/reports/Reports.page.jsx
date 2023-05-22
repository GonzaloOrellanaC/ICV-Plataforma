import {useState, useEffect} from 'react'
import {Grid, Toolbar, IconButton, Chip, TablePagination, Button} from '@material-ui/core';
import { ArrowBackIos } from '@material-ui/icons';
import { Mantenciones, Inspecciones } from './ReportsListLeft';
/* import { machinesRoutes, reportsRoutes } from '../../routes'; */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown, faCircle, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import './reports.css'
import { ReportsList } from '../../containers';
import { useHistory } from 'react-router-dom';
/* import { machinesDatabase, sitesDatabase } from '../../indexedDB';
import { dateSimple, getWeekReports } from '../../config'; */
import { LoadingLogoModal } from '../../modals';
import { useAuth, useExecutionReportContext, useReportsContext, useSitesContext } from '../../context';

const ReportsPage = () => {
    const {sites} = useSitesContext()
    const {admin, isSapExecutive, isShiftManager, isChiefMachinery} = useAuth()
    const {reports, setListSelected, listSelected, listSelectedCache, setListSelectedCache, getReports, loading, statusReports} = useReportsContext()
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
    const history = useHistory()
    const [ flechaListaxOT, setFlechaListaxOT ] = useState(faArrowUp)
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
                if(inspeccion.usersAssigned.length > 0 && (inspeccion.level < 3 && inspeccion.level > 0)) {
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
            setListSelected(lista.sort(compareNumbers))
            setListSelectedCache(lista)
            setVista(false)
        } else {
            setVista(true)
        }
    }

    const compareNumbers = (a, b) => {
        return b.idIndex - a.idIndex;
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
                const nuevaLista = listaCache.sort(compareNumbers)/* .sort((a, b) => {
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

    return(
        <div className='container-width' >
            <div style={{width: '100%', textAlign: 'left', padding: 10 }}>
                <div style={{width: '100%', textAlign: 'left', color: '#333', backgroundColor: '#fff', borderRadius: 20 }}>
                    <Toolbar style={{paddingLeft: 0, backgroundColor: '#F9F9F9', borderRadius: 10}}>
                        <IconButton onClick={() => setTimeout(() => {
                            history.goBack()
                        }, 500)}>
                            <ArrowBackIos style={{color: '#333', fontSize: 16}}/> 
                        </IconButton>
                        <h1 style={{marginTop: 0, marginBottom: 0, fontSize: 16}}>
                            Ordenes
                        </h1>
                        <button 
                            hidden={!hableCreateReport}
                            onClick={()=>{history.push('/reports/create-report')}} 
                            title='Nuevo reporte' 
                            style={
                                {
                                    position: 'absolute', 
                                    right: 10, 
                                    color: '#fff',
                                    backgroundColor: '#be2e26',
                                    paddingTop: 10,
                                    paddingBottom: 10,
                                    paddingLeft: 20,
                                    paddingRight: 20,
                                    borderRadius: 20,
                                    borderColor: 'transparent'
                                }
                            }
                        >
                            <FontAwesomeIcon icon={faClipboardList} style={{marginRight: 10}}/> Nueva orden
                        </button>
                    </Toolbar>
                </div>
            </div>
            <Grid container>
                <Grid item xs={12} sm={12} md={4} lg={3} xl={3}>
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
                                    {admin && <>
                                        <Grid item xl={'auto'}>
                                            <p style={{ width: 80 }}>Obra: </p>
                                        </Grid>
                                        <Grid item xl={2}>
                                            <select style={{ marginRight: 10, marginTop: 14, marginBottom: 14, width: 300 }} name="select"  onChange={(e) => { seleccionFiltrada(e.target.value) }}>
                                                <option value={'nada'}>SELECCIONE OBRA...</option>
                                                {
                                                    sites.map((site, i) => {
                                                        return (
                                                            <option key={i} value={site.idobra}>{site.descripcion}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </Grid>                                    
                                    </>}
                                    <Grid item sm={'auto'}>
                                        <button disabled={loading} style={
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
                                        </button>
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
