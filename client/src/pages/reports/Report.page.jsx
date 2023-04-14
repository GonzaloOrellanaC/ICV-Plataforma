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
    Checkbox,
    Chip} from '@material-ui/core';
import { ArrowBackIos } from '@material-ui/icons';
import { Link, useHistory } from 'react-router-dom';
import { useStylesTheme } from '../../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { reportsRoutes } from '../../routes';
import { Mantenciones, Inspecciones } from './ReportsListLeft';

const ReportsPage = () => {
    const [ inspecciones, setInspecciones ] = useState([]);
    const [ mantenciones, setMantenciones ] = useState([]);
    const [ inspeccionesPorAsignar, setInspeccionesPorAsignar ] = useState(0);
    const [ inspeccionesCompletadas, setInspeccionesCompletadas ] = useState(0);
    const [ mantencionesPorAsignar, setMantencionesPorAsignar ] = useState(0);
    const [ mantencionesCompletadas, setMantencionesCompletadas ] = useState(0);
    const [ reportType, setReportType ] = useState('')
    const [ hableCreateReport, setHableCreateReport ] = useState(false)
    const classes = useStylesTheme()
    const history = useHistory();
    const [ reports, setReports ] = useState([])

    const getReportesPorEstado = async (state, reportType) => {
        try{
            const res = await reportsRoutes.getReportByState(state, reportType);
            let arr = res.data;
            setReports(arr);
        } catch (err) {

        }
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
        if(localStorage.getItem('role') === 'admin' || localStorage.getItem('role') === 'sapExecutive') {
            setHableCreateReport(true);
        }
    }, [])

    return (
        <Box height='100%'>
            <Grid className={'pageRoot'} container spacing={0}>
                <Grid className={classes.pageContainer} item xs={12}>
                    <Card elevation={0} className={'pageCard'} >
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
                        <div style={{display: 'block', float: 'left', width: '30%'}}>
                            <Grid style={{margin: 0, height: '70vh'}} container spacing={1}  >
                                <div style={{
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
                                <div style={{height: '100%'}}>
                                    <div style={{height: '100%'}}>
                                        <Toolbar style={{width: '100%'}}>
                                            <h1> {reportType} </h1>
                                        </Toolbar>
                                        <div>
                                            <ListItem>
                                                <div style={{textAlign: 'center', width: '5%', marginLeft: 5}}>
                                                    <Checkbox defaultChecked />
                                                </div>
                                                <div style={{textAlign: 'center', width: '10%', marginLeft: 5}}>
                                                    <p style={{margin: 0}}> <strong>Fecha <br /> Prevista</strong> </p>
                                                </div>
                                                <div style={{textAlign: 'center', width: '10%', marginLeft: 5}}>
                                                    <p style={{margin: 0}}> <strong>Fecha <br /> Inicio</strong> </p>
                                                </div>
                                                <div style={{textAlign: 'center', width: '10%', marginLeft: 5}}>
                                                    <p style={{margin: 0}}> <strong>Fecha <br /> Término</strong> </p>
                                                </div>
                                                <div style={{textAlign: 'center', width: '10%', marginLeft: 5}}>
                                                    <p style={{margin: 0}}> <strong>Horómetro</strong> </p>
                                                </div>
                                                <div style={{textAlign: 'center', width: '5%', marginLeft: 5}}>
                                                    <p style={{margin: 0}}> <strong>ID#</strong> </p>
                                                </div>
                                                <div style={{textAlign: 'center', width: '15%', marginLeft: 5}}>
                                                    <p style={{margin: 0}}> <strong>Responsable</strong> </p>
                                                </div>
                                                <div style={{textAlign: 'center', width: '5%', marginLeft: 5}}>
                                                    <p style={{margin: 0}}> <strong>Ver</strong> </p>
                                                </div>
                                                <div style={{textAlign: 'center', width: '10%', marginLeft: 5}}>
                                                    <p style={{margin: 0}}> <strong>Descargar</strong> </p>
                                                </div>
                                                <div style={{textAlign: 'center', width: '10%', marginLeft: 5}}>
                                                    <p style={{margin: 0}}> <strong>Ver</strong> </p>
                                                </div>
                                            </ListItem>
                                        </div>
                                        <div style={{overflowY: 'auto'}}>
                                            {
                                                (reports.length > 0) && reports.map(async (e, n) => {
                                                    e.roleTranslated = changeTypeUser(e.role);
                                                    return(
                                                        <ListItem key={n} style={well}>
                                                            <div style={{textAlign: 'center', width: '5%', marginLeft: 5}}>
                                                                <Checkbox defaultChecked />
                                                            </div>
                                                            <div style={{textAlign: 'center', width: '10%', marginLeft: 5}}>
                                                                <p style={{margin: 0}}> <strong>{new Date(e.datePrev).getDate() + 1}/{new Date(e.datePrev).getMonth() + 1}/{new Date(e.datePrev).getFullYear()}</strong> </p>
                                                            </div>
                                                            <div style={{textAlign: 'center', width: '10%', marginLeft: 5}}>
                                                                <p style={{margin: 0}}> <strong></strong> </p>
                                                            </div>
                                                            <div style={{textAlign: 'center', width: '10%', marginLeft: 5}}>
                                                                <p style={{margin: 0}}> <strong></strong> </p>
                                                            </div>
                                                            <div style={{textAlign: 'center', width: '10%', marginLeft: 5}}>
                                                                <p style={{margin: 0}}> 
                                                                    <strong>
                                                                        {
                                                                            e.hourMeter
                                                                        }
                                                                    </strong>  
                                                                </p>
                                                            </div>
                                                            <div style={{textAlign: 'center', width: '5%', marginLeft: 5}}>
                                                                <p style={{margin: 0}}> <strong>{e.idIndex}</strong> </p>
                                                            </div>
                                                            <div style={{textAlign: 'center', width: '15%', marginLeft: 5}}>
                                                                <p style={{margin: 0}}> <button onClick={()=>openModal(e)} style={{backgroundColor: '#F9F9F9', borderRadius: 20, borderColor: '#757575', maxWidth: 130, height: 24, fontSize: 12}}>Asignar</button> </p>
                                                            </div>
                                                            <div style={{textAlign: 'center', width: '5%', marginLeft: 5}}>
                                                                <p style={{margin: 0}}> Link </p>
                                                            </div>
                                                            <div style={{textAlign: 'center', width: '10%', marginLeft: 5}}>
                                                                <p style={{margin: 0}}>  </p>
                                                            </div>
                                                            <div style={{textAlign: 'center', width: '10%', marginLeft: 5}}>
                                                                <p style={{margin: 0}}> <button onClick={()=>{history.push(`/reports/edit-report/${JSON.stringify(e)}`)}} style={{backgroundColor: '#F9F9F9', borderRadius: 20, borderColor: '#757575', maxWidth: 130, height: 24, fontSize: 12}}>Ver</button> </p>
                                                            </div>
                                                        </ListItem>
                                                    )
                                                })
                                                }
                                            </div>
                                        </div>
                                    </div>
                                }
                        </div>
                        {hableCreateReport && <div style={{height: '10vh', width: '60%', position: 'absolute', bottom: 10, right: 10, textAlign: 'right'}}>
                            <Link to={'/reports/create-report'}>
                                <button style={{ fontSize: 20, color: '#BB2D2D', width: 210, height: 48, borderRadius: 23, borderWidth: 2, borderStyle: 'solid', borderColor: '#BB2D2D', backgroundColor: '#F9F9F9' }}>
                                    Crear Reporte
                                </button>
                            </Link>
                        </div>}
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

export default ReportsPage
