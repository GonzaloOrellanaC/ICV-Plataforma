import { useState, useEffect } from "react"
import { Grid} from '@material-ui/core'
import { machinesRoutes } from '../../routes'
import { AssignReportModal, PdfModal, ReviewReportModal } from '../../modals'
import './style.css'
import { dateSimple } from "../../config"
import { machinesDatabase } from "../../indexedDB"

const ReportsList = ({list, reloadData}) => {
    const [ reportData, setReportData ] = useState(null)
    const [ reportDataReview, setReportDataReview ] = useState(null)
    const [ openModalState, setOpenModalState ] = useState(false)
    const [ openReviewModalState, setOpenReviewModalState ] = useState(false)
    const [ openPdfModal , setOpenPdfModal ] = useState(false)
    const [ lista, setLista ] = useState([])

    const openModal = (report) => {
        setReportData(report)
        setOpenModalState(true)
    }

    const closeModal = () => {
        setOpenModalState(false)
        reloadData();
    }

    const onlyCloseReview = () => {
        setReportDataReview(null)
    }
    
    const onlyClose = () => {
        setOpenModalState(false)
    }

    const openPdf = (report) => {
        setReportData(report)
        setOpenPdfModal(true)
    }

    const openReviewModal = (report) => {
        setReportDataReview(report)
        setOpenReviewModalState(true)
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
    
    
    const closePdfModal = () => {
        setOpenPdfModal(false)
    }
    

    useEffect(() => {
        setLista([])
        let l = []
        list.forEach(async (item, i) => {
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
            if(i == (list.length - 1)) {
                setLista(l)
            } 
        })
    }, [list])
    

    const levelToState = (level, usersAssigned) => {
        if((level==0 || !level) && (usersAssigned.length > 0)) {
            return 'Ejecutando Operario'
        } else if((level==0 || !level) && (usersAssigned.length == 0)) {
            return 'Sin Asignar'
        } else if (level==1) {
            return 'Revisión Supervisor'
        } else if (level==2) {
            return 'Revisión J. Maquinaria'
        } else if (level==3) {
            return 'Revisión SAP'
        } else if (level==4) {
            return 'Terminado'
        }
    }


    return(
        <div style={{width: '100%', paddingLeft: 10, paddingRight: 10}} /* className='root' */>
            <Grid container style={{width: '100%', borderBottomColor: '#ccc', borderBottomStyle: 'solid', borderBottomWidth: 1}}>
                <Grid item xs={1} sm={1} md={1} lg={1} xl={1} /* style={{textAlign: 'center', width: '5%', marginLeft: 5}} */>
                    <p style={{textAlign: 'center'}}> <strong>N° OT</strong> </p>
                </Grid>
                <Grid item xs={1} sm={1} md={1} lg={1} xl={1} /* style={{textAlign: 'center', width: '5%', marginLeft: 5}} */>
                    <p style={{textAlign: 'center'}}> <strong>Pauta</strong> </p>
                </Grid>
                <Grid item xs={1} sm={1} md={1} lg={1} xl={1} /* style={{textAlign: 'center', width: '10%', marginLeft: 5}} */>
                    <p style={{textAlign: 'center'}}> <strong>Fecha <br /> Prevista</strong> </p>
                </Grid>
                <Grid item xs={1} sm={1} md={1} lg={1} xl={1} /* style={{textAlign: 'center', width: '10%', marginLeft: 5}} */>
                    <p style={{textAlign: 'center'}}> <strong>Fecha <br /> Inicio</strong> </p>
                </Grid>
                <Grid item xs={1} sm={1} md={1} lg={1} xl={1} /* style={{textAlign: 'center', width: '10%', marginLeft: 5}} */>
                    <p style={{textAlign: 'center'}}> <strong>Fecha <br /> Término</strong> </p>
                </Grid>
                <Grid item xs={1} sm={1} md={1} lg={1} xl={1} /* style={{textAlign: 'center', width: '10%', marginLeft: 5}} */>
                    <p style={{textAlign: 'center'}}> <strong>Horómetro</strong> </p>
                </Grid>
                <Grid item xs={1} sm={1} md={1} lg={1} xl={1} /* style={{textAlign: 'center', width: '5%', marginLeft: 5}} */>
                    <p style={{textAlign: 'center'}}> <strong>Estado</strong> </p>
                </Grid>
                <Grid item xs={1} sm={1} md={2} lg={1} xl={1} /* style={{textAlign: 'center', width: '15%', marginLeft: 5}} */>
                    <p style={{textAlign: 'center'}}> <strong>Responsable</strong> </p>
                </Grid>
                <Grid item xs={1} sm={1} md={1} lg={1} xl={1} /* style={{textAlign: 'center', width: '10%', marginLeft: 5}} */>
                    <p style={{textAlign: 'center'}}> <strong>Máquina</strong> </p>
                </Grid>
                <Grid item xs={1} sm={1} md={1} lg={1} xl={1} /* style={{textAlign: 'center', width: '5%', marginLeft: 5}} */>
                    <p style={{textAlign: 'left'}}> <strong>Acción</strong> </p>
                </Grid>
            </Grid>
            {
                (lista.length == 0) && <Grid container>
                        <div style={{width: '100%', textAlign: 'center', height: '50vh'}}>
                        <img style={{margin: 0, top: '50%', left: 'calc(100%/1.53)'}} src="../../assets/icons/Arrow.svg" alt="" />
                        <div style={{width: '100%', textAlign: 'center', top: '55%'}}>
                            <p>Selecciona otra opción <br /> El detalle no cuenta con lista de reportes.</p>
                        </div>
                    </div>
                </Grid>
            }
            {
                lista.map((item, i) => {
                    return(
                        <Grid container key={i} style={{width: '100%', borderBottomColor: '#ccc', borderBottomStyle: 'solid', borderBottomWidth: 1}}>
                            <Grid item xs={1} sm={1} md={1} lg={1} xl={1} /* style={{textAlign: 'center', width: '5%', marginLeft: 5}} */>
                                <p style={{textAlign: 'center'}}> {item.idIndex} </p>
                            </Grid>
                            <Grid item xs={1} sm={1} md={1} lg={1} xl={1} /* style={{textAlign: 'center', width: '5%', marginLeft: 5}} */>
                                <p style={{textAlign: 'center'}}> {item.guide} </p>
                            </Grid>
                            <Grid item xs={1} sm={1} md={1} lg={1} xl={1} /* style={{textAlign: 'center', width: '10%', marginLeft: 5}} */>
                                <p style={{textAlign: 'center'}}> {item.date} </p>
                            </Grid>
                            <Grid item xs={1} sm={1} md={1} lg={1} xl={1} /* style={{textAlign: 'center', width: '10%', marginLeft: 5}} */>
                                <p style={{textAlign: 'center'}}> {item.init} </p>
                            </Grid>
                            <Grid item xs={1} sm={1} md={1} lg={1} xl={1} /* style={{textAlign: 'center', width: '10%', marginLeft: 5}} */>
                                <p style={{textAlign: 'center'}}> {item.end} </p>
                            </Grid>
                            <Grid item xs={1} sm={1} md={1} lg={1} xl={1} /* style={{textAlign: 'center', width: '10%', marginLeft: 5}} */>
                                <p style={{textAlign: 'center'}}> {item.hourMeter} hrs </p>
                            </Grid>
                            <Grid item xs={1} sm={1} md={1} lg={1} xl={1} /* style={{textAlign: 'center', width: '5%', marginLeft: 5}} */>
                                <div style={{textAlign: 'center'}}>
                                    <p> {levelToState(item.level, item.usersAssigned)} </p>
                                </div>
                            </Grid>
                            {item.enabled ? 
                            <Grid item xs={1} sm={1} md={2} lg={1} xl={1} /* style={{textAlign: 'center', width: '15%', marginLeft: 5}} */>
                                <p style={{textAlign: 'center'}}> <button onClick={()=>openModal(item)} style={{backgroundColor: '#F9F9F9', borderRadius: 20, borderColor: '#757575', maxWidth: 130, height: 24, fontSize: 12}}>Asignar</button> </p>
                            </Grid> :
                            <Grid item xs={1} sm={1} md={1} lg={1} xl={1} /* style={{textAlign: 'center', width: '15%', marginLeft: 5}} */>
                                <p style={{textAlign: 'center'}}> <button disabled style={{backgroundColor: '#F9F9F9', borderRadius: 20, borderColor: '#757575', maxWidth: 130, height: 24, fontSize: 12}}>Terminado</button> </p>
                            </Grid>
                            }
                            <Grid item xs={1} sm={1} md={1} lg={1} xl={1} /* style={{textAlign: 'center', width: '10%', marginLeft: 5}} */>
                                <p style={{textAlign: 'center'}}> {item.model} {item.number} </p>
                            </Grid>
                    
                            <Grid item xs={1} sm={1} md={1} lg={2} xl={2} /* style={{textAlign: 'center', width: '5%', marginLeft: 5}} */>                                <Grid container>
                                    <Grid item>
                                        <p style={{textAlign: 'center'}}> <button onClick={()=>{openReviewModal(item)}} style={{backgroundColor: '#F9F9F9', borderRadius: 20, borderColor: '#757575', maxWidth: 130, height: 24, fontSize: 12}}>Ver</button> </p>  
                                    </Grid>
                                    <Grid item>
                                        {!item.enabled &&
                                            <p style={{textAlign: 'center', marginLeft: 10}}> <button  onClick={()=>{openPdf(item)}} style={{backgroundColor: '#F9F9F9', borderRadius: 20, borderColor: '#757575', maxWidth: 130, height: 24, fontSize: 12}}>PDF</button> </p>
                                        }
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    )
                })
            }
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