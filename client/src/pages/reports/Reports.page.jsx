import {useState, useEffect} from 'react'
import {Box, Grid, Card, makeStyles, Toolbar, IconButton, ListItem, ListItemIcon, ListItemText, Checkbox, Button, Chip} from '@material-ui/core';
import { ArrowBackIos } from '@material-ui/icons';
import { Mantenciones, Inspecciones } from './ReportsListLeft';
import { machinesRoutes, reportsRoutes } from '../../routes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import './reports.css'
import { ReportsList } from '../../containers';
import { useHistory } from 'react-router-dom';
import { sitesDatabase } from '../../indexedDB';
import { useStylesTheme } from '../../config';

const ReportsPage = () => {
    const [ inspecciones, setInspecciones ] = useState([]);
    const [ mantenciones, setMantenciones ] = useState([]);
    const [ hableCreateReport, setHableCreateReport ] = useState(false);
    const [ inspeccionesPorAsignar, setInspeccionesPorAsignar ] = useState(0);
    const [ inspeccionesCompletadas, setInspeccionesCompletadas ] = useState(0);
    const [ mantencionesPorAsignar, setMantencionesPorAsignar ] = useState(0);
    const [ mantencionesCompletadas, setMantencionesCompletadas ] = useState(0);
    const [ list, setList ] = useState([]);
    const [ vista, setVista ] = useState(true)

    const history = useHistory()
    const classes = useStylesTheme();

    useEffect(() => {
        initPage();
    }, [])

    const initPage = () => {
        Inspecciones.forEach(async (e, i) => {
            let response = await reportsRoutes.getReportByState(e.name, 'Inspección');
            if(response.data.length > 0) {
                response.data.forEach(async (item, i) => {
                    item.siteName = await getSiteName(item.site)
                    machinesRoutes.getMachineByEquid(item.machine).then(data => {
                        item.hourMeter = (Number(data.data[0].hourMeter)/3600000);
                    })
                    if(i == (response.data.length - 1)) {
                        console.log(response.data)
                        e.lista = response.data.reverse();
                        e.number = response.data.length;
                    }
                })
            }else{
                e.lista = [];
                e.number = 0;
            }
            if(i == (Inspecciones.length - 1)) {
                setInspecciones(Inspecciones)
            }
        })
        Mantenciones.forEach(async (e, i) => {
            let response = await reportsRoutes.getReportByState(e.name, 'Mantención');
            if(response.data.length > 0) {
                response.data.forEach(async (item, i) => {
                    item.siteName = await getSiteName(item.site)
                    machinesRoutes.getMachineByEquid(item.machine).then(data => {
                        item.hourMeter = (Number(data.data[0].hourMeter)/3600000);
                    })
                    if(i == (response.data.length - 1)) {
                        e.lista = response.data.reverse();
                        e.number = response.data.length;
                    }
                })
            }else{
                e.lista = [];
                e.number = 0;
            }
            if(i == (Mantenciones.length - 1)) {
                setMantenciones(Mantenciones)
            }
        })
        if(localStorage.getItem('role') === 'admin' || localStorage.getItem('role') === 'sapExecutive') {
            setHableCreateReport(true);
        }
    }

    const getSiteName = (itemSite) => {
        return new Promise(resolve => {
            sitesDatabase.initDbObras().then(db => {
                sitesDatabase.consultar(db.database).then(sites => {
                    sites.forEach((site) => {
                        console.log(site.idobra, itemSite)
                        if(site.idobra === itemSite) {
                            resolve(site.descripcion)
                        }
                    })
                })
            })
        })
    }

    const selectList = (list) => {
        setVista(false)
        setList(list)
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
                            Reportes
                        </h1>
                        <Button onClick={()=>{history.push('/reports/create-report')}} title='Nuevo reporte' style={{position: 'absolute', right: 10, color: '#333'}}>
                            Nuevo reporte
                        </Button>
                    </Toolbar>
                </div>
            </div>
            <Grid container>
                <Grid item xs={12} sm={12} md={5} lg={3}>
                    <div className='menu-card' /* style={{width: '100%'}} */>
                        <h2>Inspecciones</h2>
                        <div style={{float: 'left', width: 'calc(45%)', marginRight: 5, padding: 10, backgroundColor: '#fff', borderRadius: 10}}>
                            <div style={{float: 'left', width: '40%'}}>
                                <p style={{fontSize: 32, margin: 0}}>{inspeccionesPorAsignar}</p>
                            </div>
                            <div style={{float: 'left', right: 5, width: '40%'}}>
                                <p style={{fontSize: 8}}>Inspecciones por asignar</p>
                            </div>
                        </div>
                        <div style={{float: 'right', width: 'calc(45%)', marginLeft: 5, padding: 10, backgroundColor: '#fff', borderRadius: 10}}>
                            <div style={{float: 'left', width: '40%'}}>
                                <p style={{fontSize: 32, margin: 0}}>{inspeccionesCompletadas} </p>
                            </div>
                            <div style={{float: 'left', right: 5, width: '40%'}}>
                                <p style={{fontSize: 8}}>Inspecciones completadas en la semana</p>
                            </div>
                        </div>
                        {
                            inspecciones.map((e, i) => {
                                return(
                                    <Grid key={i} container>
                                        <Grid item style={{width: '15%'}}>
                                            <FontAwesomeIcon icon={faCircle} size='2x' style={{marginRight: 10}} color={e.color}/>
                                        </Grid>
                                        <Grid item style={{width: '30%'}}>
                                            <p style={{margin: 0}}>{e.name}</p>
                                        </Grid>
                                        <Grid item style={{width: '15%'}}>
                                            <Chip label={e.number} style={{marginLeft: 10, marginRight: 10}} />
                                        </Grid>
                                        <Grid item style={{width: '40%', textAlign: 'right'}}>
                                            <button onClick={()=>selectList(e.lista)} style={{position: 'relative', right: 5, width: 80, height: 30, borderRadius: 20}}>{e.button}</button>
                                        </Grid>
                                    </Grid>
                                )
                            })
                        }
                    </div>
                    <div className='menu-card'>
                        <h2>Mantenciones</h2>
                        <div style={{float: 'left', width: 'calc(45%)', marginRight: 5, padding: 10, backgroundColor: '#fff', borderRadius: 10}}>
                            <div style={{float: 'left', width: '40%'}}>
                                <p style={{fontSize: 32, margin: 0}}>{mantencionesPorAsignar}</p>
                            </div>
                            <div style={{float: 'left', right: 5, width: '40%'}}>
                                <p style={{fontSize: 8}}>Mantenciones por asignar</p>
                            </div>
                        </div>
                        <div style={{float: 'right', width: 'calc(45%)', marginLeft: 5, padding: 10, backgroundColor: '#fff', borderRadius: 10}}>
                            <div style={{float: 'left', width: '40%'}}>
                                <p style={{fontSize: 32, margin: 0}}>{mantencionesCompletadas} </p>
                            </div>
                            <div style={{float: 'left', right: 5, width: '40%'}}>
                                <p style={{fontSize: 8}}>Mantenciones completadas en la semana</p>
                            </div>
                        </div>
                        {
                            mantenciones.map((e, i) => {
                                return(
                                    <Grid key={i} container>
                                        <Grid item style={{width: '15%'}}>
                                            <FontAwesomeIcon icon={faCircle} size='2x' style={{marginRight: 10}} color={e.color}/>
                                        </Grid>
                                        <Grid item style={{width: '30%'}}>
                                            <p style={{margin: 0}}>{e.name}</p>
                                        </Grid>
                                        <Grid item style={{width: '15%'}}>
                                            <Chip label={e.number} style={{marginLeft: 10, marginRight: 10}} />
                                        </Grid>
                                        <Grid item style={{width: '40%', textAlign: 'right'}}>
                                            <button onClick={()=>selectList(e.lista)} style={{position: 'relative', right: 5, width: 80, height: 30, borderRadius: 20}}>{e.button}</button>
                                        </Grid>
                                    </Grid>
                                )
                            })
                        }
                    </div>
                </Grid>
                <Grid item xs={12} sm={12} md={7} lg={9}>
                    {
                        vista && <div>
                            <img style={{margin: 0, position: 'absolute', top: '50%', left: 'calc(100%/1.53)', msTransform: 'translateY(-50%)', transform: 'translateY(-50%)'}} src="../../assets/icons/Arrow.svg" alt="" />
                            <div style={{textAlign: 'center', position: 'absolute', top: '55%', left: 'calc(100%/1.6)'}}>
                                <p>Selecciona una opción <br /> para ver el detalle</p>
                            </div>
                        </div>
                    }
                    {
                        !vista && <ReportsList list={list}/>
                    }
                </Grid>
            </Grid>
        </div>
    )
}

export default ReportsPage