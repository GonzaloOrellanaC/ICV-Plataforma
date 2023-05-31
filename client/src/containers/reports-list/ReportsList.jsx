import { useState, useEffect } from "react"
import { Button, Grid, Popover } from '@material-ui/core'
import { pdfMakeRoutes } from '../../routes'
import { AssignReportModal, PdfModal, ReviewReportModal } from '../../modals'
import './style.css'
import { dateSimple } from "../../config"
import { reportsDatabase } from "../../indexedDB"

const ReportsList = ({list, typeReportsSelected, statusReports, getReports}) => {
    const [ reportData, setReportData ] = useState(null)
    const [ reportDataReview, setReportDataReview ] = useState(null)
    const [ openModalState, setOpenModalState ] = useState(false)
    const [ openReviewModalState, setOpenReviewModalState ] = useState(false)
    const [ openPdfModal , setOpenPdfModal ] = useState(false)
    const [ siteName, setSiteName ] = useState([])
    const [ isAdmin, setIsAdmin ] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    useEffect(() => {
        let isAdminCache = false
        setIsAdmin(isAdminCache)
    }, [])
    
    const handleClick = (event, siteName) => {
        setSiteName(siteName)
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
        /* reloadData(); */
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

    const closePdfModal = () => {
        setOpenPdfModal(false)
    }

    const getPDF = async (doc) => {
        const response = await pdfMakeRoutes.createPdfDoc(doc)
        console.log(response)
        const reportCache = doc
        reportCache.urlPdf = response.data.url
        const {database} = await reportsDatabase.initDbReports()
        await reportsDatabase.actualizar(reportCache, database)
        getReports()
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
        <div style={{width: '100%', paddingLeft: 10, paddingRight: 10}} /* className='root' */>
            <Grid container style={{width: '100%', borderBottomColor: '#ccc', borderBottomStyle: 'solid', borderBottomWidth: 1}}>
                <Grid item xs={'auto'} sm={'auto'} md={'auto'} lg={'auto'} xl={'auto'} >
                    <p style={{textAlign: 'center', width: 50}}>
                        <strong>N° OT</strong></p>
                </Grid>
                <Grid item xs={'auto'} sm={'auto'} md={'auto'} lg={'auto'} xl={'auto'}  >
                    <p style={{textAlign: 'center', minWidth: 70}}> <strong>Máquina</strong> </p>
                </Grid>
                <Grid item xs={1} sm={1} md={1} lg={1} xl={1} >
                    <p style={{textAlign: 'center'}}> <strong>Pauta</strong> </p>
                </Grid>
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
                {(typeReportsSelected !== 'Completadas') ? <Grid item xs={1} sm={1} md={2} lg={1} xl={1} >
                    <p style={{textAlign: 'center'}}> <strong>Responsable</strong> </p>
                </Grid> : <Grid item xs={1} sm={1} md={2} lg={1} xl={1} >
                    <p style={{textAlign: 'center'}}> <strong>OM SAP</strong> </p>
                </Grid>}
                {isAdmin && <Grid item xs={1} sm={1} md={1} lg={1} xl={1}  >
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
            <div style={{ height: 'calc(100vh - 370px)', overflowY: 'auto' }}>
                {
                    list.map((item, i) => {
                            return(
                                <Grid container key={i} style={{width: '100%', borderBottomColor: '#ccc', borderBottomStyle: 'solid', borderBottomWidth: 1}}>
                                    <Grid item xs={'auto'} sm={'auto'} md={'auto'} lg={'auto'} xl={'auto'} >
                                        <p style={{textAlign: 'center', width: 50}}> {item.idIndex} </p>
                                    </Grid>
                                    <Grid item xs={'auto'} sm={'auto'} md={'auto'} lg={'auto'} xl={'auto'}  >
                                        <p style={{textAlign: 'center', minWidth: 70}}> {item.machineData && item.machineData.equ} </p>
                                    </Grid>
                                    <Grid item xs={1} sm={1} md={1} lg={1} xl={1} >
                                        <p style={{textAlign: 'center'}}> {item.guide} </p>
                                    </Grid>
                                    <Grid item xs={1} sm={1} md={1} lg={1} xl={1}  >
                                        <p style={{textAlign: 'center'}}> {dateSimple(item.datePrev)} </p>
                                    </Grid>
                                    <Grid item xs={1} sm={1} md={1} lg={1} xl={1}  >
                                        <p style={{textAlign: 'center'}}> {dateSimple(item.dateInit)} </p>
                                    </Grid>
                                    <Grid item xs={1} sm={1} md={1} lg={1} xl={1}  >
                                        <p style={{textAlign: 'center'}}> {dateSimple(item.endPrev)} </p>
                                    </Grid>
                                    <Grid item xs={1} sm={1} md={1} lg={1} xl={1}  >
                                        <p style={{textAlign: 'center'}}> {parseInt(item.machineData.hourMeter / 1000/*  / 1000 / 60 / 60 */).toLocaleString()} hrs </p>
                                    </Grid>
                                    <Grid item xs={1} sm={1} md={1} lg={1} xl={1} >
                                        <div style={{textAlign: 'center'}}>
                                            <p> <strong>{levelToState(item.level, item.usersAssigned, item.state)}</strong> </p>
                                        </div>
                                    </Grid>
                                    {
                                        (typeReportsSelected !== 'Completadas') ? ((item.enabled) ? 
                                            <Grid item xs={1} sm={1} md={2} lg={1} xl={1} >
                                                <p style={{textAlign: 'center'}}> <button onClick={()=>openModal(item)} style={{backgroundColor: '#F9F9F9', borderRadius: 20, borderColor: '#757575', maxWidth: 130, height: 24, fontSize: 12}}>Asignar</button> </p>
                                            </Grid> :
                                            <Grid item xs={1} sm={1} md={1} lg={1} xl={1} >
                                                <p style={{textAlign: 'center'}}> <button disabled style={{backgroundColor: '#F9F9F9', borderRadius: 20, borderColor: '#757575', maxWidth: 130, height: 24, fontSize: 12}}>Terminado</button> </p>
                                            </Grid>
                                        ) : <Grid item xs={1} sm={1} md={1} lg={1} xl={1} >
                                        <p style={{textAlign: 'center'}}> {item.sapId} </p>
                                    </Grid>
                                    }
                                    {
                                        isAdmin &&
                                        
                                        <Grid item xs={1} sm={1} md={1} lg={1} xl={1} style={{ textAlign: 'center' }} >
                                            <Button aria-describedby={id} style={{textAlign: 'center', minWidth: 70, marginTop: 5}} onClick={(e) => {handleClick(e, item.siteName)}}> {item.site} </Button>
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
                reportData && <AssignReportModal open={openModalState} report={reportData} reportType={reportData.reportType} onlyClose={onlyClose} closeModal={closeModal}/>
            }
            {
                reportDataReview && <ReviewReportModal open={openReviewModalState} report={reportDataReview} onlyClose={onlyCloseReview}/>
            }
            {
                reportData && <PdfModal open={openPdfModal} reportData={reportData} close={closePdfModal}/>
            }
        </div>
    )
}

export default ReportsList