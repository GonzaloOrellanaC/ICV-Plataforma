import {useState, useEffect} from 'react'
import {Box, Grid, Card, makeStyles, Toolbar, IconButton, ListItem, ListItemIcon, ListItemText, Checkbox, Button, Chip, TablePagination} from '@material-ui/core';
import { ArrowBackIos } from '@material-ui/icons';
import { Mantenciones, Inspecciones } from './ReportsListLeft';
import { machinesRoutes, reportsRoutes } from '../../routes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import './reports.css'
import { ReportsList } from '../../containers';
import { useHistory } from 'react-router-dom';
import { sitesDatabase } from '../../indexedDB';
import { getWeekReports, useStylesTheme } from '../../config';
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
    const [ cancel, setCancel ] = useState(true);
    const [ loading, setLoading ] = useState(false)
    const [ rowsPerPage, setRowsPerPage ] = useState(10)
    const [ page, setPage]  = useState(0);
    const [ listToShow, setListToShow ] = useState([])
    const history = useHistory()
    const classes = useStylesTheme();

    /* useEffect(() => {
        if(history) {
            initPage();
        }
        if(cancel) {
            setTimeout(() => {
                if(!navigator.onLine) {
                    alert('Problemas de red. Revise su conexión.');
                    history.goBack()
                }
            }, 1000);
        }
        return () => setCancel(false);
    }, [cancel]); */
    useEffect(() => {
        initPage()
    }, [])
    

    const initPage = async () => {
        setLoading(true)
        let daysOfThisWeek = getWeekReports();
        let completesInspections = await reportsRoutes.getReportsByDateRange(daysOfThisWeek[0], daysOfThisWeek[1], 'Inspección');
        let completesManteinances = await reportsRoutes.getReportsByDateRange(daysOfThisWeek[0], daysOfThisWeek[1], 'Mantención');
        setInspeccionesCompletadas(completesInspections.data.length);
        setMantencionesCompletadas(completesManteinances.data.length);
        let stateInspecciones = false
        let stateMantenciones = false
        Inspecciones.map(async (e, i) => {
            console.log(e)
            let response = await reportsRoutes.getReportByState(e.name, 'Inspección');
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
            let response = await reportsRoutes.getReportByState(e.name, 'Mantención');
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
                        setMantencionesPorAsignar(porAsignar.length)
                        stateMantenciones = true
                        //e.number = response.data.length;
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
        if(localStorage.getItem('role') === 'superAdmin' || localStorage.getItem('role') === 'admin' || localStorage.getItem('role') === 'sapExecutive') {
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

    const selectList = (list, idButton, index) => {
        Inspecciones.map((e, i) => {
            // `button_${i}_inspecciones`
            document.getElementById(`button_${i}_inspecciones`).style.backgroundColor = '#F9F9F9'
            e.buttonColor = '#F9F9F9'
            if (i === (Inspecciones.length - 1)) {
                /* setInspecciones(Inspecciones) */
                Mantenciones.map((e, n) => {
                    e.buttonColor = '#F9F9F9'
                    document.getElementById(`button_${n}_mantenciones`).style.backgroundColor = '#F9F9F9'
                    if (n === (Mantenciones.length - 1)) {
                        /* setMantenciones(Mantenciones) */
                        document.getElementById(idButton).style.backgroundColor = '#ccc'
                        localStorage.setItem('buttonReportSelected', idButton)
                        setPage(0)
                        setRowsPerPage(10)
                        console.log(list)
                        setVista(false)
                        setList(list)
                        let l = list.sort((a, b) => {
                                /* return b.idIndex - a.idIndex */
                            if (Number(a.idIndex) > Number(b.idIndex)) {
                                return -1
                            }
                            if (Number(a.idIndex) < Number(b.idIndex)) {
                                return 1
                            }
                            return 0
                            })
                        initReadList(l)
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
                setListToShow(lista)
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
                setListToShow(lista)
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
                        <div style={{height: 'calc(100% - 10px)', display: 'block', overflowY: 'auto'}}>
                            {!vista ? <ReportsList list={listToShow} reloadData={reloadData}/> : <></>}
                            {
                            (listToShow.length > 0) ? <TablePagination
                                component="div"
                                color={'primary'}
                                style={{ position: 'absolute', right: 20, bottom: 20, borderColor: '#ccc', borderWidth: 1, borderStyle: 'solid' }}
                                onPageChange={handleChangePage}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleChangeRowsPerPage}                          
                                count={list.length}
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