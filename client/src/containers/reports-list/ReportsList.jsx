import { useState, useEffect } from "react"
import { Button, Grid, Popover } from '@material-ui/core'
import './style.css'
import { dateSimple } from "../../config"
import { AssignDialog, ReviewReportDialog } from "../../dialogs"
import { useAuth, useSitesContext } from "../../context"
/* import { pdfMakeRoutes } from "../../routes" */

const ReportsList = ({list, typeReportsSelected, statusReports}) => {
    const {admin} = useAuth()
    const {sites} = useSitesContext()
    const [ reportData, setReportData ] = useState(null)
    const [ reportDataReview, setReportDataReview ] = useState(null)
    const [ openModalState, setOpenModalState ] = useState(false)
    const [ openReviewModalState, setOpenReviewModalState ] = useState(false)
    const [ siteName, setSiteName ] = useState([])
    /* const [ admin, setIsAdmin ] = useState(false) */
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    useEffect(() => {
        console.log(admin)
    }, [])
    
    const handleClick = (event, siteName) => {
        console.log(siteName)
        console.log(sites)
        const siteFiltered = sites.filter((site) => {if (siteName===site.idobra) return site})
        setSiteName(siteFiltered[0].descripcion)
        setAnchorEl(event.currentTarget);
    };
    
    const handleClose = () => {
        setAnchorEl(null);
    };

    const openModal = (report) => {
        setReportData(report)
        setOpenModalState(true)
    }

    const closeModal = () => {
        setOpenModalState(false)
    }

    const onlyCloseReview = () => {
        setReportDataReview(null)
    }
    
    const onlyClose = () => {
        setOpenModalState(false)
    }

    const openReviewModal = (report) => {
        setReportDataReview(report)
        setOpenReviewModalState(true)
    }    

    const levelToState = (level, usersAssigned, state) => {
        if (level === 0 || !level) {
            if (usersAssigned.length > 0) {
                if (state==='En proceso') {
                    return 'Ejecutando por operador'
                } else if (state==='Asignar') {
                    return 'Reasignar'
                }
            } else {
                return 'Asignar'
            }
        } else if (level===1) {
            return 'Revisión Supervisor'
        } else if (level===2) {
            return 'Revisión J. Maquinaria'
        } else if (level===3) {
            return 'Revisión SAP'
        } else if (level===4) {
            return 'Terminado'
        }
    }

    return(
        <div style={{width: '100%', paddingLeft: 10, paddingRight: 10, fontSize: 12}} /* className='root' */>
            <Grid container style={{width: '100%', borderBottomColor: '#ccc', borderBottomStyle: 'solid', borderBottomWidth: 1}}>
                <Grid item xs={'auto'} sm={'auto'} md={'auto'} lg={'auto'} xl={'auto'} >
                    <p style={{textAlign: 'center', width: 40}}>
                        <strong>N° OT</strong></p>
                </Grid>
                <Grid item xs={'auto'} sm={'auto'} md={'auto'} lg={'auto'} xl={'auto'}  >
                    <p style={{textAlign: 'center', minWidth: 60}}> <strong>Máquina</strong> </p>
                </Grid>
                <Grid item xs={'auto'} sm={'auto'} md={'auto'} lg={'auto'} xl={'auto'} >
                    <p style={{textAlign: 'center', width: 20}}> <strong>Pauta</strong> </p>
                </Grid>
                {
                    (typeReportsSelected !== 'Completadas') && <Grid item xs={1} sm={1} md={1} lg={1} xl={1} >
                    <p style={{textAlign: 'center'}}> <strong>Progreso</strong> </p>
                </Grid>
                }
                <Grid item xs={1} sm={1} md={1} lg={1} xl={1}  >
                    <p style={{textAlign: 'center'}}> <strong>Fecha <br /> Prevista</strong> </p>
                </Grid>
                <Grid item xs={1} sm={1} md={1} lg={1} xl={1}  >
                    <p style={{textAlign: 'center'}}> <strong>Fecha <br /> Inicio</strong> </p>
                </Grid>
                <Grid item xs={1} sm={1} md={1} lg={1} xl={1}  >
                    <p style={{textAlign: 'center'}}> <strong>Fecha <br /> Término</strong> </p>
                </Grid>
                <Grid item xs={1} sm={1} md={1} lg={1} xl={1}  >
                    <p style={{textAlign: 'center'}}> <strong>Horómetro</strong> </p>
                </Grid>
                <Grid item xs={1} sm={1} md={1} lg={1} xl={1} >
                    <p style={{textAlign: 'center'}}> <strong>Estado</strong> </p>
                </Grid>
                <Grid item xs={1} sm={1} md={2} lg={1} xl={1} >
                    <p style={{textAlign: 'center'}}> <strong>OM SAP</strong> </p>
                </Grid>
                {(typeReportsSelected !== 'Completadas') && <Grid item xs={1} sm={1} md={2} lg={1} xl={1} >
                    <p style={{textAlign: 'center'}}> <strong>Responsable</strong> </p>
                </Grid> /* : <Grid item xs={1} sm={1} md={2} lg={1} xl={1} >
                    <p style={{textAlign: 'center'}}> <strong>OM SAP</strong> </p>
                </Grid> */}
                {admin && <Grid item xs={1} sm={1} md={1} lg={1} xl={1}  >
                    <p style={{textAlign: 'center', minWidth: 70}}> <strong>Obra</strong> </p>
                </Grid>}
                {(typeReportsSelected === 'Completadas') && <Grid item xs={1} sm={1} md={1} lg={1} xl={1}  >
                    <p style={{textAlign: 'center', minWidth: 70}}> <strong>Download</strong> </p>
                </Grid>}
                <Grid item xs={'auto'} sm={'auto'} md={'auto'} lg={'auto'} xl={'auto'}  >
                    <p style={{textAlign: 'center', minWidth: 70}}> <strong>Flota</strong> </p>
                </Grid>
                <Grid item xs={1} sm={1} md={1} lg={1} xl={1} >
                    <p style={{textAlign: 'left'}}> <strong>Acción</strong> </p>
                </Grid>
            </Grid>
            <div>
                {
                    (list.length == 0) && <Grid container>
                            <div style={{width: '100%', textAlign: 'center', height: '50vh'}}>
                            <img style={{margin: 0, top: '50%', left: 'calc(100%/1.53)'}} src={statusReports ? "../../assets/icons/Arrow.svg" : "../../assets/icons/Arrow.svg"} alt="" />
                            <div style={{width: '100%', textAlign: 'center', top: '55%'}}>
                                {
                                    statusReports
                                    ?
                                    <p>Descargando la información <br /> Espere un momento.</p>
                                    :
                                    <p>Selecciona otra opción <br /> El detalle no cuenta con lista de reportes.</p>
                                }
                            </div>
                        </div>
                    </Grid>
                }
            </div>
            <div style={{ height: 'calc(100vh - 370px)', overflowY: 'auto', fontSize: 12 }}>
                {
                    list.map((item, i) => {
                            return(
                                <Grid /* onClick={async () => ((process.env.NODE_ENV === 'development') && await pdfMakeRoutes.createPdfDoc(item))} */ container key={i} style={{width: '100%', borderBottomColor: '#ccc', borderBottomStyle: 'solid', borderBottomWidth: 1}}>
                                    <Grid item xs={'auto'} sm={'auto'} md={'auto'} lg={'auto'} xl={'auto'} >
                                        <p style={{textAlign: 'center', width: 40}}> {item.idIndex} </p>
                                    </Grid>
                                    <Grid item xs={'auto'} sm={'auto'} md={'auto'} lg={'auto'} xl={'auto'}  >
                                        <p style={{textAlign: 'center', minWidth: 60}}> {item.machineData && item.machineData.equ} </p>
                                    </Grid>
                                    <Grid item xs={'auto'} sm={'auto'} md={'auto'} lg={'auto'} xl={'auto'} >
                                        <p style={{textAlign: 'center', width: 20}}> {item.guide === 'Pauta de Inspección' ? 'P.I.' : item.guide} </p>
                                    </Grid>
                                    {
                                        (typeReportsSelected !== 'Completadas') && <Grid item xs={1} sm={1} md={1} lg={1} xl={1} >
                                        <p style={{textAlign: 'center'}}> {item.progress ? `${item.progress}%` : 'S/I'} </p>
                                    </Grid>
                                    }
                                    <Grid item xs={1} sm={1} md={1} lg={1} xl={1}  >
                                        <p style={{textAlign: 'center'}}> {dateSimple(item.datePrev)} </p>
                                    </Grid>
                                    <Grid item xs={1} sm={1} md={1} lg={1} xl={1}  >
                                        <p style={{textAlign: 'center'}}> {dateSimple(item.dateInit)} </p>
                                    </Grid>
                                    <Grid item xs={1} sm={1} md={1} lg={1} xl={1}  >
                                        <p style={{textAlign: 'center'}}> {dateSimple(item.dateClose)} </p>
                                    </Grid>
                                    <Grid item xs={1} sm={1} md={1} lg={1} xl={1}  >
                                        <p style={{textAlign: 'center'}}> {(item.machineData.hourMeter / 3600).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} hrs </p>
                                    </Grid>
                                    <Grid item xs={1} sm={1} md={1} lg={1} xl={1} >
                                        <div style={{textAlign: 'center'}}>
                                            <p> <strong>{levelToState(item.level, item.usersAssigned, item.state)}</strong> </p>
                                        </div>
                                    </Grid>
                                    <Grid item xs={1} sm={1} md={1} lg={1} xl={1} >
                                        <p style={{textAlign: 'center'}}> {item.sapId} </p>
                                    </Grid>
                                    {
                                        (typeReportsSelected !== 'Completadas') && ((item.enabled) ? 
                                            <Grid item xs={1} sm={1} md={2} lg={1} xl={1} >
                                                <p style={{textAlign: 'center'}}> <button onClick={()=>{openModal(item)}} style={{backgroundColor: '#F9F9F9', borderRadius: 20, borderColor: '#757575', maxWidth: 130, height: 24, fontSize: 12}}>Asignar</button> </p>
                                            </Grid> :
                                            <Grid item xs={1} sm={1} md={1} lg={1} xl={1} >
                                                <p style={{textAlign: 'center'}}> <button disabled style={{backgroundColor: '#F9F9F9', borderRadius: 20, borderColor: '#757575', maxWidth: 130, height: 24, fontSize: 12}}>Terminado</button> </p>
                                            </Grid>
                                        )/*  : <Grid item xs={1} sm={1} md={1} lg={1} xl={1} >
                                        <p style={{textAlign: 'center'}}> {item.sapId} </p>
                                    </Grid> */
                                    }
                                    {
                                        admin &&
                                        
                                        <Grid item xs={1} sm={1} md={1} lg={1} xl={1} style={{ textAlign: 'center' }} >
                                            <Button aria-describedby={id} style={{textAlign: 'center', minWidth: 70, marginTop: 5}} onClick={(e) => {handleClick(e, item.site)}}> {item.site} </Button>
                                            <Popover
                                                id={id}
                                                open={open}
                                                anchorEl={anchorEl}
                                                onClose={handleClose}
                                                anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'center',
                                                }}
                                                transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'center',
                                                }}
                                            >
                                                <div style={{padding: 5}}><p>{siteName}</p></div>
                                            </Popover>
                                        </Grid>
                                    }
                                    {(typeReportsSelected==='Completadas') && <Grid item xs={1} sm={1} md={1} lg={1} xl={1}  >
                                        {item.urlPdf ? <p style={{textAlign: 'center', minWidth: 70}}><a href={`${item.urlPdf}`}>Link</a></p> : <p style={{textAlign: 'center', minWidth: 70}}> Sin URL </p>}
                                    </Grid>}
                                    <Grid item xs={'auto'} sm={'auto'} md={'auto'} lg={'auto'} xl={'auto'}  >
                                        <p style={{textAlign: 'center', minWidth: 70}}> {item.machineData && item.machineData.model} </p>
                                    </Grid>
                            
                                    <Grid item xs={1} sm={1} md={1} lg={1} xl={1} >                                
                                        <Grid container>
                                            <Grid item>
                                                <p style={{textAlign: 'center'}}> <button onClick={()=>{openReviewModal(item)}} style={{backgroundColor: '#F9F9F9', borderRadius: 20, borderColor: '#757575', maxWidth: 130, height: 24, fontSize: 12}}>Ver</button> </p>  
                                            </Grid>
                                            {/* <Grid item>
                                                {item.enabled &&
                                                    <p style={{textAlign: 'center', marginLeft: 10}}> <button onClick={()=>{getPDF(item)}} style={{backgroundColor: '#F9F9F9', borderRadius: 20, borderColor: '#757575', maxWidth: 130, height: 24, fontSize: 12}}>PDF</button> </p>
                                                }
                                            </Grid> */}
                                        </Grid>
                                    </Grid>
                                </Grid>
                            )
                        })
                    }
            </div>
            {
                reportData && <AssignDialog open={openModalState} report={reportData} reportType={reportData.reportType} onlyClose={onlyClose} closeModal={closeModal}/>
            }
            {
                reportDataReview && <ReviewReportDialog open={openReviewModalState} report={reportDataReview} onlyClose={onlyCloseReview}/>
            }
        </div>
    )
}

export default ReportsList