import {useState, useEffect} from 'react'
import {Grid, Toolbar, IconButton, Chip, TablePagination} from '@material-ui/core';
import { ArrowBackIos } from '@material-ui/icons';
import { Mantenciones, Inspecciones } from './ReportsListLeft';
import { machinesRoutes, reportsRoutes } from '../../routes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown, faCircle, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import './reports.css'
import { ReportsList } from '../../containers';
import { useHistory } from 'react-router-dom';
import { machinesDatabase, sitesDatabase } from '../../indexedDB';
import { dateSimple, getWeekReports } from '../../config';
import { LoadingLogoModal } from '../../modals';

const ReportsPage = () => {
    const [ inspecciones, setInspecciones ] = useState([]);
    const [ mantenciones, setMantenciones ] = useState([]);
    const [ hableCreateReport, setHableCreateReport ] = useState(false);
    const [ inspeccionesPorAsignar, setInspeccionesPorAsignar ] = useState(0);
    const [ inspeccionesCompletadas, setInspeccionesCompletadas ] = useState(0);
    const [ mantencionesPorAsignar, setMantencionesPorAsignar ] = useState(0);
    const [ mantencionesCompletadas, setMantencionesCompletadas ] = useState(0);
    const [ list, setList ] = useState([]);
    const [ vista, setVista ] = useState(true);
    const [ loading, setLoading ] = useState(false)
    const [ rowsPerPage, setRowsPerPage ] = useState(10)
    const [ page, setPage]  = useState(0);
    const [ listToShow, setListToShow ] = useState([])
    const [ totalItems, setTotalItems ] = useState(0)
    const history = useHistory()
    const isSapExecutive = Boolean(localStorage.getItem('isSapExecutive'))
    const [ flechaListaxOT, setFlechaListaxOT ] = useState(faArrowUp)
    const [sites, setSites] = useState([])
    useEffect(() => {
        initPage()
        getSites()
    }, [])
    useEffect(() => {
        console.log(list)
    }, [list])
    useEffect(() => {
        console.log(totalItems)
    },[totalItems])
    const initPage = async () => {
        let isAdmin = false
        const role = (localStorage.getItem('role') === 'undefined') ? null : localStorage.getItem('role')
        const roles = JSON.parse(localStorage.getItem('roles'))
        const site = JSON.parse(localStorage.getItem('sitio'))
        if (role) {
            if (role === 'superAdmin' || role === 'admin') {
                isAdmin = true
            }
        } else {
            roles.forEach(role => {
                if (role === 'superAdmin' || role === 'admin') {
                    isAdmin = true
                }
            })
        }
        setLoading(true)
        let daysOfThisWeek = getWeekReports();
        console.log(role, site)
        let completesInspections = isAdmin 
        ? 
        await reportsRoutes.getReportsByDateRange(daysOfThisWeek[0], daysOfThisWeek[1], 'Inspección')
        :
        await reportsRoutes.getReportsByDateRangeAndSite(daysOfThisWeek[0], daysOfThisWeek[1], 'Inspección', site.idobra)
        let completesManteinances = isAdmin
        ?
        await reportsRoutes.getReportsByDateRange(daysOfThisWeek[0], daysOfThisWeek[1], 'Mantención')
        :
        await reportsRoutes.getReportsByDateRangeAndSite(daysOfThisWeek[0], daysOfThisWeek[1], 'Mantención', site.idobra)
        console.log(completesInspections.data.length, completesManteinances.data.length)
        setInspeccionesCompletadas(completesInspections.data.length);
        setMantencionesCompletadas(completesManteinances.data.length);
        let stateInspecciones = false
        let stateMantenciones = false
        Inspecciones.map(async (e, i) => {
            console.log(e)
            let response = isAdmin ? await reportsRoutes.getReportByState(e.name, 'Inspección') : await reportsRoutes.getReportByStateAndSite(e.name, 'Inspección', site.idobra)
            let porAsignar = []
            if(response.data.length > 0) {
                e.number = response.data.length;
                response.data.map(async (item, i) => {
                    if(item.state === 'Asignar') {
                        porAsignar.push(item)
                    }
                    item.siteName = await getSiteName(item.site)
                    machinesRoutes.getMachineByEquid(item.machine).then(data => {
                        item.hourMeter = (Number(data.data[0].hourMeter)/3600000);
                    })
                    if(i == (response.data.length - 1)) {
                        e.lista = response.data.reverse();
                        setInspeccionesPorAsignar(porAsignar.length)
                        stateInspecciones = true
                    }
                })
            }else{
                e.lista = [];
                e.number = 0;
                stateInspecciones = true
            }
            if(i == (Inspecciones.length - 1)) {
                setInspecciones(Inspecciones)
            }
        });
        Mantenciones.map(async (e, i) => {
            let response =  isAdmin ? await reportsRoutes.getReportByState(e.name, 'Mantención') : await reportsRoutes.getReportByStateAndSite(e.name, 'Mantención', site.idobra)
            let porAsignar = []
            console.log(response.data)
            if(response.data.length > 0) {
                e.number = response.data.length;
                response.data.map(async (item, i) => {
                    if(item.state === 'Asignar') {
                        porAsignar.push(item)
                    }
                    item.siteName = await getSiteName(item.site)
                    machinesRoutes.getMachineByEquid(item.machine).then(data => {
                        item.hourMeter = (Number(data.data[0].hourMeter)/3600000);
                    })
                    if(i == (response.data.length - 1)) {
                        e.lista = response.data.reverse();
                        setMantencionesPorAsignar(porAsignar.length)
                        stateMantenciones = true
                    }
                })
            }else{
                e.lista = [];
                e.number = 0;
                stateMantenciones = true
            }
            if(i == (Mantenciones.length - 1)) {
                setMantenciones(Mantenciones)
                waiting(stateInspecciones, stateMantenciones)
            }
        })
        if(localStorage.getItem('role') === 'superAdmin' || localStorage.getItem('role') === 'admin' || localStorage.getItem('role') === 'sapExecutive' || isSapExecutive) {
            setHableCreateReport(true);
        }
    }

    const waiting = (state1, state2) => {
        if (state1 && state2) {
            if (localStorage.getItem('buttonReportSelected')) {
                var elementExists = document.getElementById(localStorage.getItem('buttonReportSelected'))
                if (elementExists) {
                    setLoading(false)
                    elementExists.click()
                } else {
                    setTimeout(() => {
                        waiting(state1, state2)
                    }, 1000);
                }
            } else {
                setLoading(false)
            }
        } else {
            setTimeout(() => {
                waiting(state1, state2)
            }, 1000);
        }
    }

    const getSiteName = (itemSite) => {
        return new Promise(resolve => {
            sitesDatabase.initDbObras().then(db => {
                sitesDatabase.consultar(db.database).then(sites => {
                    sites.forEach((site) => {
                        if(site.idobra === itemSite) {
                            resolve(site.descripcion)
                        }
                    })
                })
            })
        })
    }

    const getSites = () => {
        sitesDatabase.initDbObras().then(db => {
            sitesDatabase.consultar(db.database).then(sites => {
                setSites(sites)
            })
        })
    }

    const getMachineTypeByEquid = (item) => {
        return new Promise(async  resolve => {
            let db = await machinesDatabase.initDbMachines();
            const machines = await machinesDatabase.consultar(db.database);
            let machineFiltered = machines.filter(m => { if(item === m.equid) {return m}});
            resolve(
                {
                    number: machineFiltered[0].equ,
                    model: machineFiltered[0].model
                }
            ) 
        })
    }

    const selectList = (lista, idButton, index) => {
        Inspecciones.map((e, i) => {
            document.getElementById(`button_${i}_inspecciones`).style.backgroundColor = '#F9F9F9'
            e.buttonColor = '#F9F9F9'
            if (i === (Inspecciones.length - 1)) {
                Mantenciones.map((e, n) => {
                    e.buttonColor = '#F9F9F9'
                    /* console.log(document.getElementById(`button_${n}_mantenciones`)) */
                    if (document.getElementById(`button_${n}_mantenciones`))
                    document.getElementById(`button_${n}_mantenciones`).style.backgroundColor = '#F9F9F9'
                    if (n === (Mantenciones.length - 1)) {
                        document.getElementById(idButton).style.backgroundColor = '#ccc'
                        localStorage.setItem('buttonReportSelected', idButton)
                        setPage(0)
                        setRowsPerPage(10)
                        setVista(false)
                        let l = []
                        lista.forEach(async (item, i) => {
                            item.date = dateSimple(item.datePrev)
                            item.end = dateSimple(item.endReport)
                            item.init = dateSimple(item.dateInit)
                            machinesRoutes.getMachineByEquid(item.machine).then(data => {
                                item.hourMeter = (Number(data.data[0].hourMeter)/3600000)
                            })
                            let data = await getMachineTypeByEquid(item.machine)
                            item.number = data.number
                            item.model = data.model
                            l.push(item)
                            if(i == (lista.length - 1)) {
                                setList(l)
                                console.log(list.length)
                                setTotalItems(list.length)
                                let li = l.sort((a, b) => {
                                    if (Number(a.idIndex) > Number(b.idIndex)) {
                                        return -1
                                    }
                                    if (Number(a.idIndex) < Number(b.idIndex)) {
                                        return 1
                                    }
                                    return 0
                                    })
                                initReadList(li)
                            } 
                        })
                    }
                })
            }
        })
    }

    const reloadData = () => {
        location.reload();
    }

    const initReadList = (list) => {
        let lista = []
        for (let i = (0*rowsPerPage); i < (rowsPerPage+(0*rowsPerPage)); i++) {
            if (list[i]) {
                lista.push(list[i])
            }
            if (i === ((rowsPerPage+(0*rowsPerPage)) - 1)) {
                const listaCache = [...lista]
                console.log(listaCache)
                const nuevaLista = listaCache.sort((a, b) => {
                    return b.idIndex - a.idIndex
                })
                setListToShow(nuevaLista)
                /* setTotalItems(nuevaLista.length) */
            }
        }
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
        let lista = []
        for (let i = (newPage*rowsPerPage); i < (rowsPerPage+(newPage*rowsPerPage)); i++) {
            if (list[i]) {
                lista.push(list[i])
            }
            if (i === ((rowsPerPage+(newPage*rowsPerPage)) - 1)) {
                const listaCache = [...lista]
                console.log(listaCache)
                const nuevaLista = listaCache.sort((a, b) => {
                    return b.idIndex - a.idIndex
                })
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
            if (list[i]) {
                lista.push(list[i])
            }
            if (i === ((parseInt(event.target.value, 10) + (page*parseInt(event.target.value, 10))) - 1)) {
                setListToShow(lista)
            }
        }
    }

    const ordenarPorNumeroOT = (value = new String) => {
        if (value === 'mayor') {
            setFlechaListaxOT(faArrowDown)
            const listaCache = [...list]
            console.log(listaCache)
            const nuevaLista = listaCache.sort((a, b) => {
                return Number(a.idIndex) - Number(b.idIndex)
            })
            initReadList(nuevaLista)
        } else {
            setFlechaListaxOT(faArrowUp)
            const listaCache = [...list]
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
        const listaCache = [...list]
        if (value.length > 0) {
            const lista = []
            listaCache.forEach((element, index) => {
                console.log(element.number, value)
                if (element.idIndex === Number(value) || element.model === value || element.number === value || element.sapId === value) {
                    lista.push(element)
                }
                if (index === (listaCache.length - 1)) {
                    console.log(lista)
                    initReadList(lista)
                    setTotalItems(lista.length)
                }
            })
        } else {
            initReadList(list)
            setTotalItems(list.length)
        }
    }

    const seleccionFiltrada = (value) => {
        const listaCache = [...list]
        if (value === 'nada') {
            initReadList(list)
            setTotalItems(list.length)
        } else {
            const lista = []
            listaCache.forEach((element, index) => {
                console.log(element.number, value)
                if (element.site === value.toString()) {
                    lista.push(element)
                }
                if (index === (listaCache.length - 1)) {
                    console.log(lista)
                    initReadList(lista)
                    setTotalItems(lista.length)
                }
            })
        }
    }

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
                                <p style={{fontSize: 32, margin: 0}}>{inspeccionesPorAsignar}</p>
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
                                                onClick={()=>selectList(e.lista, `button_${i}_inspecciones`, i)}
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
                                <p style={{fontSize: 32, margin: 0}}>{mantencionesPorAsignar}</p>
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
                                                onClick={()=>selectList(e.lista, `button_${i}_mantenciones`, i)}
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
                                        <input style={{ marginRight: 10, marginTop: 14, marginBottom: 14, width: 300 }} placeholder={'Ingrese N° OT, Máquina, Flota o Cód. SAP'} onChange={(e) => { textoFiltrado(e.target.value) }}  />
                                    </Grid>
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
                                </Grid>
                            </div>
                            {!vista ? 
                            <ReportsList 
                                list={listToShow} 
                                reloadData={reloadData} 
                                ordenarPorNumeroOT={ordenarPorNumeroOT}
                                flechaListaxOT={flechaListaxOT}
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
                    
                    {
                        loading && <LoadingLogoModal open={loading} />
                    }
                </Grid>
            </Grid>
        </div>
    )
}

export default ReportsPage