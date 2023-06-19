import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Box, Card, Grid, Modal, IconButton, Fab, Toolbar } from '@material-ui/core'
import { Close, ArrowBackIos } from '@material-ui/icons'
import { useParams } from "react-router-dom";
import { imageToBase64, useStylesTheme } from '../../config'
import { useNavigate } from 'react-router-dom'
import { apiIvcRoutes, reportsRoutes } from '../../routes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faEye } from '@fortawesome/free-solid-svg-icons';
import { ImageDialog, LoadingLogoDialog, ReportDetailDialog } from '../../dialogs';
import { useConnectionContext, useExecutionReportContext, useMachineContext } from '../../context';

const AppliancePage = ({ route }) => {
    const classes = useStylesTheme();
    const {isOnline} = useConnectionContext()
    const {machineSelected} = useMachineContext()
    const {loading, setLoading} = useExecutionReportContext()
    const [open, setOpen] = useState(false);
    const [ mantenciones, setMantenciones ] = useState([])
    const [ mantencionesCache, setMantencionesCache ] = useState([])
    const [ routeData, setRouteData ] = useState('');
    const [ openDialog, setOpenDialog ] = useState(false)
    const [ report, setReport ] = useState({})
    const [ openMachineImage, setOpenMachineImage ] = useState(false)
    const [ machineImage, setMachineImage ] = useState('')
    const [ value, setValue ] = useState('Todos')
    let { id } = useParams();
    const [ machine, setMachine ] = useState({})
    let r = new String();
    r = route.toString();

    useEffect(() => {
        if(route === 'inspection') {
            setRouteData('Inspección')
        }else if(route === 'maintenance') {
            setRouteData('Mantención')
        }else if(route === 'machines') {
            setRouteData('Máquinas')
        }
    },[route])

    useEffect(() => {
        /* setLoading(true) */
        console.log(machineSelected)
        if (machineSelected) {
            setMachine(machineSelected)
            if (isOnline) {
                reportsRoutes.getReportByEquid(machineSelected.equid).then(d => {
                    if(d.data) {
                        console.log(d.data.reverse())
                        setMantenciones(d.data.reverse())
                        setMantencionesCache(d.data.reverse())
                        setTimeout(() => {
                        }, 500);
                    }
                })
            } else {
                alert('Dispoitivo sin conexión a internet. No se podrá mostrar el histórico.')
            }
        }
        setLoading(false)
    }, [machineSelected])

    const openCloseModal = () => {
        setTimeout(() => {
            setOpen(!open);
        }, 500);
    }

    const initDialog = (report) => {
        setOpenDialog(true)
        setReport(report)
    }

    const handleClose = () => {
        setOpenDialog(false)
    }

/*     useEffect( () => {
        setLoading(true)
        if(navigator.onLine) {
            machinesRoutes.getMachineByEquid(id).then(data => {
                setMachine(data.data[0])
                reportsRoutes.getReportByEquid(data.data[0].equid).then(d => {
                    if(d.data) {
                        console.log(d.data.reverse())
                        setMantenciones(d.data.reverse())
                        setMantencionesCache(d.data.reverse())
                        setTimeout(() => {
                            setLoading(false)
                        }, 500);
                    }
                })
            })
        } else {
            setLoading(false)
        }
    }, []) */

    /* let site = JSON.parse(localStorage.getItem('sitio')).descripcion;
 */
    const navigate = useNavigate()

    const filterList = (value) => {
        if (value === 'all') {
            setValue('Todos')
            setMantenciones(mantencionesCache.reverse())
        } else if ((value === 'Mantención')||(value === 'Inspección')) {
            setValue(value)
            setMantenciones(mantencionesCache.filter(mantencion => {if(mantencion.reportType===value) {return mantencion}}).reverse())
        } else {
            setValue(value)
            setMantenciones(mantencionesCache.filter(mantencion => {if(mantencion.state===value) {return mantencion}}).reverse())
        }
    }

    const openImg = (image) => {
        setMachineImage(image)
        setOpenMachineImage(true)
    }

    const closeImage = () => {
        setOpenMachineImage(false)
    }

    const upImage = () => {
        document.getElementById('fotoMaquina').click();
    }
    
    const uploadImageReport = async (file) => {
        if(file) {
            let res = await imageToBase64(file)
            setTimeout(() => {
                if(res) {
                    console.log(res)
                    machine.image = res
                    apiIvcRoutes.saveMachineDataById(machine)
                }
            }, 1000);
        }
    }
    
    return (
        <Box height='100%'>
            <Grid className={'pageRoot'} container spacing={0}>
                <Grid className={classes.pageContainer} item xs={12}>
                    <Card elevation={0} className={'pageCard'}>
                        <Grid container alignItems='center' justifyContent='center'>
                            <div style={{width: '100%', textAlign: 'left', padding: 10 }}>
                                <div style={{width: '100%', textAlign: 'left', color: '#333', backgroundColor: '#fff', borderRadius: 20 }}>
                                    <Toolbar style={{paddingLeft: 0, backgroundColor: '#F9F9F9', borderRadius: 10}}>
                                        <IconButton onClick={() => setTimeout(() => {
                                            navigate(-1)
                                        }, 500)}> 
                                            <ArrowBackIos style={{color: '#333', fontSize: 16}}/> 
                                        </IconButton> 
                                        <p style={{marginTop: 0, marginBottom: 0, fontSize: 16}}>
                                            {routeData}/{machine.type} {machine.brand} {machine.model}/Número interno: <b>{machine.equ}</b>
                                        </p>
                                    </Toolbar>
                                </div>
                            </div>
                            <Grid container>
                                <Grid item xs={12} sm={8} md={6} lg={4} xl={4} >
                                    <div style={{width: '100%', textAlign: 'left', padding: 10}}>
                                        <div style={{padding: 15, borderTopLeftRadius: 20, borderEndStartRadius: 20, backgroundColor: '#F9F9F9', borderRadius: 10, minHeight: 400}}>
                                            <h3 style={{marginTop: 5, marginBottom: 5}}>{machine.type}</h3>
                                            <div style={{/* position: 'relative', zIndex: '1',  */width: '100%', /* height: 180,  */backgroundColor: 'transparent', textAlign: 'center'}}>
                                                <img src={machine.image ? machine.image : `/assets/${machine.model}.png`} height={180} id={'imageMachine'} onClick={()=>{openImg(machine.image ? machine.image : `/assets/${machine.model}.png`)}}/>
                                                <br />
                                                <button onClick={()=>{upImage()}}>
                                                    <FontAwesomeIcon icon={faCamera} style={{marginRight: 10}} /> Cambiar imagen
                                                </button>
                                                <input autoComplete="off" type="file" id="fotoMaquina" accept="image/x-png,image/jpeg" onChange={(e)=>{uploadImageReport(e.target.files[0])}} hidden />
                                            </div>
                                            <div style={{width: '100%'}}>
                                                <p style={{marginTop: 5, marginBottom: 5}} id={'machineData'}><b>Marca: </b> {machine.brand} </p>
                                            </div>
                                            <div style={{width: '100%'}}>
                                                <p style={{marginTop: 5, marginBottom: 5}}><b>Modelo: </b> {machine.model} </p>
                                            </div>
                                            <div style={{width: '100%'}}>
                                                <p style={{marginTop: 5, marginBottom: 5}}><b>Código: </b> {machine.equid} </p>
                                            </div>
                                            <div style={{width: '100%'}}>
                                                <p style={{marginTop: 5, marginBottom: 5}}><b>Horómetro Actual: </b> {Number(machine.hourMeter)/3600000} hrs </p>
                                            </div>
                                            <div style={{width: '100%'}}>
                                                <p style={{marginTop: 5, marginBottom: 5}}><b>Número Interno: </b> {machine.equ} </p>
                                            </div>
                                            {/* <div style={{width: '100%'}}>
                                                <p style={{marginTop: 5, marginBottom: 5}}><b>Información: </b> {machineData.info} </p>
                                            </div>
                                            <div style={{width: '100%'}}>
                                                <p style={{marginTop: 5, marginBottom: 5}}><b>Última Mantención: </b> {machineData.lastMant} </p>
                                            </div>
                                            <div style={{width: '100%'}}>
                                                <p style={{marginTop: 5, marginBottom: 5}}><b>Último Inspector: </b> {machineData.lastOper} </p>
                                            </div> */}
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item sm={12} md={7} lg={8} xl={8} >
                                    <div style={{width: '100%', textAlign: 'left', padding: 10}}>
                                        <div style={{padding: 15, backgroundColor: '#F9F9F9', width: '100%', height: 'calc(100vh - 220px)', position: 'relative', borderRadius: 10}}>
                                            <div style={{position: 'absolute', top: 10, right: 10}}>
                                                <button style={{float: 'left', marginRight: 10}} onClick={()=>{filterList('Mantención')}}>
                                                    Mantenciones
                                                </button>
                                                <button style={{float: 'left', marginRight: 10}} onClick={()=>{filterList('Inspección')}}>
                                                    Inspecciones
                                                </button>
                                                <button style={{float: 'left', marginRight: 10}} onClick={()=>{filterList('all')}}>
                                                    Todos
                                                </button>
                                                <button style={{float: 'left', marginRight: 10}} onClick={()=>{filterList('Completadas')}}>
                                                    Completados
                                                </button>
                                                <button style={{float: 'left', marginRight: 10}} onClick={()=>{filterList('En proceso')}}>
                                                    En proceso
                                                </button>
                                                <button style={{float: 'left'}} onClick={()=>{filterList('Asignar')}}>
                                                    Por asignar
                                                </button>
                                            </div>
                                            <h3>Listado de mantenciones. <b style={{ color: 'red' }}>Filtro: {value}</b></h3>
                                            <div style={{overflowY: 'auto', height: 'calc(100vh - 300px)', width: '100%', padding: 20}}>
                                                {
                                                    (navigator.onLine && mantenciones.length === 0) && <p>No hay mantenciones</p>
                                                }
                                                {
                                                    (navigator.onLine && mantenciones.length > 0) && mantenciones.reverse().map((mantencion, index) => {
                                                        return(
                                                            <div key={index} style={{width: '95%', padding: 10, margin: 10, display: 'block', height: 100, borderBottomStyle: 'solid', borderBottomColor: '#ccc', borderBottomWidth: 2}}>
                                                                <div style={{float: 'left'}}>
                                                                    <h4 style={{margin: 0}}>OT N°{mantencion.idIndex}</h4>
                                                                    <p style={{margin: 0}}>Código SAP {mantencion.sapId}</p>
                                                                    <p style={{margin: 0}}>Estado: {mantencion.state}</p>
                                                                    {
                                                                        (mantencion.state === 'Completadas') && <a href={mantencion.urlPdf} target='_blank'>Imprimir OT</a>
                                                                    }
                                                                </div>
                                                                <button style={{float: 'right'}} onClick={() => initDialog(mantencion)}>
                                                                    <FontAwesomeIcon icon={faEye}/>
                                                                </button>
                                                            </div>
                                                        )
                                                    })
                                                }
                                                {
                                                    !navigator.onLine && <p>Debe contar con conexión a internet.</p>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </Grid>
                                <Modal
                                    open={open}
                                    close={!open}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                >
                                    <div style={{height: '100%', width: '100%', backgroundColor: '#333'}}>
                                        <Fab onClick={openCloseModal} style={{position: 'absolute', right: 10, top: 10, boxShadow: 'none', backgroundColor: 'transparent'}}>
                                            <Close style={{color: '#ccc'}} />
                                        </Fab>
                                    </div>
                                </Modal>
                                {
                                    openDialog && <ReportDetailDialog open={openDialog} report={report} handleClose={handleClose}/>
                                }
                                {
                                    loading && <LoadingLogoDialog open={loading} />
                                }
                                {
                                    openMachineImage && <ImageDialog open={openMachineImage} image={machineImage} handleClose={closeImage}/>
                                }
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Box>
        
    )
}

AppliancePage.propTypes = {
    route: PropTypes.oneOf(['machines/machine-detail'])
}

export default AppliancePage
