import {useState, useEffect} from 'react'
import { 
    Box, 
    Grid, 
    Card, 
    makeStyles, 
    Toolbar, 
    IconButton, 
    ListItem, 
    ListItemIcon,
    ListItemText,
    Chip} from '@material-ui/core';
import { ArrowBackIos } from '@material-ui/icons';
import { Link, useHistory } from 'react-router-dom';
import { useStylesTheme } from '../../config';
import { useLanguage } from '../../context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { ReportsList } from '../../containers';
import { reportsRoutes } from '../../routes';
import { Mantenciones, Inspecciones } from './ReportsListLeft';
import { AssignReportModal } from '../../modals';

const useStyles = makeStyles((theme) => ({
    paper: {
      padding: theme.spacing(1),
      textAlign: "center",
      color: theme.palette.text.secondary
    }
}));

const ReportsPage = () => {
    const [ vista, setVista ] = useState(true);
    const [ inspecciones, setInspecciones ] = useState([]);
    const [ mantenciones, setMantenciones ] = useState([]);
    const [ inspeccionesPorAsignar, setInspeccionesPorAsignar ] = useState(0);
    const [ inspeccionesCompletadas, setInspeccionesCompletadas ] = useState(0);
    const [ mantencionesPorAsignar, setMantencionesPorAsignar ] = useState(0);
    const [ mantencionesCompletadas, setMantencionesCompletadas ] = useState(0);
    const [ reportList, setReportList ] = useState([])
    const [ reportType, setReportType ] = useState('')
    const classes = useStylesTheme()
    const { dictionary } = useLanguage();
    //const [ openAssignModal, setOpenAssignModal ] = useState(false)
    const history = useHistory();

    

    const openDetail = () => {
        setVista(false)
    }

    const getReportesPorGuia = (guide) => {
        reportsRoutes.getReportByGuide(guide).then(reports => {
            console.log(reports)
        })
    }

    const getReportesPorTipo = (type) => {
        reportsRoutes.getReportByType(type).then(reports => {
            console.log(reports)
        })
    }

    const getReportesPorEstado = (state, reportType) => {
        reportsRoutes.getReportByState(state, reportType).then(reports => {
            setReportList(reports.data);
            setVista(false);
            setReportType(reportType)
        })
    }
    

    useEffect(() => {
        Inspecciones.forEach(async (e, i) => {
            let response = await reportsRoutes.getReportByState(e.name, 'Inspección');
            e.number = response.data.length;
            if(i == (Inspecciones.length - 1)) {
                setInspecciones(Inspecciones)
            }
        })
        Mantenciones.forEach(async (e, i) => {
            let response = await reportsRoutes.getReportByState(e.name, 'Mantención');
            e.number = response.data.length;
            if(i == (Mantenciones.length - 1)) {
                setMantenciones(Mantenciones)
            }
        })
    }, [])
    

    return (
        <Box height='100%'>
            <Grid className={classes.pageRoot} container spacing={0}>
                <Grid className={classes.pageContainer} item xs={12}>
                    <Card className={classes.pageCard} >
                        <Grid container alignItems='center' justifyContent='center'>
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
                                    </Toolbar>
                                </div>
                            </div>
                        </Grid>
                        <div /* id="containerData" */ style={{display: 'block', float: 'left', width: '30%'}}>
                            <Grid style={{margin: 0, height: '70vh'}} container spacing={1}  >
                                <div style={{
                                    /* width: 'calc(100%/3.5)', 
                                    height: 'calc(100%)',  */
                                    backgroundColor: '#F9F9F9', 
                                    marginLeft: 10,
                                    borderRadius: 20
                                }}>
                                    <div style={{height: 'calc(45%)', margin: 10}}>
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
                                                <p style={{fontSize: 32, margin: 0}}>{inspeccionesCompletadas}</p>
                                            </div>
                                            <div style={{float: 'left', right: 5, width: '40%'}}>
                                                <p style={{fontSize: 8}}>Inspecciones completadas en la semana</p>
                                            </div>
                                        </div>

                                        <div style={{paddingTop: 80, width: '100%'}}>
                                            {
                                                inspecciones.map((e, i) => {
                                                    return(
                                                        <ListItem key={i} style={{width: '100%', paddingTop: 0, paddingBottom: 2}}>
                                                            <ListItemIcon>
                                                            <FontAwesomeIcon icon={faCircle} size='2x' style={{marginRight: 10}} color={e.color}/>
                                                            </ListItemIcon>
                                                            <ListItemText primary={e.name} />
                                                            <Chip label={e.number} style={{marginLeft: 10, marginRight: 10}} />
                                                            <button onClick={()=>getReportesPorEstado(e.name, 'Inspección')} style={{position: 'relative', right: 5, width: 80, height: 30, borderRadius: 20}}>{e.button}</button>
                                                        </ListItem>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                    <div style={{height: 'calc(45%)', margin: 10}}>
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

                                        <div style={{paddingTop: 80, width: '100%'}}>
                                            {
                                                mantenciones.map((e, i) => {
                                                    return(
                                                        <ListItem key={i} style={{width: '100%', paddingTop: 0, paddingBottom: 2}}>
                                                            <ListItemIcon>
                                                            <FontAwesomeIcon icon={faCircle} size='2x' style={{marginRight: 10}} color={e.color}/>
                                                            </ListItemIcon>
                                                            <ListItemText primary={e.name} />
                                                            <Chip label={e.number} style={{marginLeft: 10, marginRight: 10}} />
                                                            <button onClick={()=>getReportesPorEstado(e.name, 'Mantención')} style={{position: 'relative', right: 5, width: 80, height: 30, borderRadius: 20}}>{e.button}</button>
                                                        </ListItem>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                            </Grid>
                        </div>
                        <div style={{height: 'calc(100%/1.2)', width: '68%', float: 'right'}}>
                            {
                                !vista && <ReportsList height={'100%'} reportsList={reportList} reportType={reportType}/>
                            }
                            {
                                vista && <div>
                                    <img style={{margin: 0, position: 'absolute', top: '50%', left: 'calc(100%/1.53)', msTransform: 'translateY(-50%)', transform: 'translateY(-50%)'}} src="../../assets/icons/Arrow.svg" alt="" />
                                    <div style={{textAlign: 'center', position: 'absolute', top: '55%', left: 'calc(100%/1.6)'}}>
                                        <p>Selecciona una opción <br /> para ver el detalle</p>
                                    </div>
                                </div>
                            }
                        </div>
                        <div style={{height: '10vh', width: '60%', position: 'absolute', bottom: 10, right: 10, textAlign: 'right'}}>
                            <Link to={'/reports/create-report'}>
                                <button style={{ fontSize: 20, color: '#BB2D2D', width: 210, height: 48, borderRadius: 23, borderWidth: 2, borderStyle: 'solid', borderColor: '#BB2D2D', backgroundColor: '#F9F9F9' }}>
                                    Crear Reporte
                                </button>
                            </Link>
                        </div>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

export default ReportsPage
