import { useState } from "react";
import {Box, Grid, Card, makeStyles, Toolbar, IconButton, ListItem, ListItemIcon, ListItemText, Checkbox, Chip} from '@material-ui/core';
import { machinesRoutes } from '../../routes';
import { AssignReportModal, PdfModal, ReviewReportModal } from '../../modals'
import { useHistory } from "react-router-dom";
import './style.css';
import { date, dateSimple } from "../../config";

const ReportsList = ({list, reloadData}) => {
    const [ reportData, setReportData ] = useState(null);
    const [ reportDataReview, setReportDataReview ] = useState(null);
    const [ openModalState, setOpenModalState ] = useState(false);
    const [ openReviewModalState, setOpenReviewModalState ] = useState(false);
    const [ openPdfModal , setOpenPdfModal ] = useState(false);
    //const [ lista , setLista ] = useState();
    const history = useHistory();

    console.log(list)

    const openModal = (report) => {
        setReportData(report);
        setOpenModalState(true);
    }

    const closeModal = () => {
        setOpenModalState(false);
        reloadData();
    }

    const onlyCloseReview = () => {
        setReportDataReview(null);
    }
    
    const onlyClose = () => {
        setOpenModalState(false);
    }

    const openPdf = (report) => {
        setReportData(report);
        setOpenPdfModal(true);
    }

    const openReviewModal = (report) => {
        setReportDataReview(report);
        setOpenReviewModalState(true)
    }
    

    list.forEach((item, i) => {
        console.log(item)
        item.date = dateSimple(item.datePrev);
        item.end = dateSimple(item.endReport);
        item.init = dateSimple(item.dateInit);
        //item.date = item.datePrev.replace('T00:00:00.000Z', '');
        machinesRoutes.getMachineByEquid(item.machine).then(data => {
            item.hourMeter = (Number(data.data[0].hourMeter)/3600000);
        })
    });



    const lista = list.reverse()

    return(
        <div style={{width: '100%'}} /* className='root' */>
            <Grid container style={{width: '100%'}}>
                {/* <Grid item style={{textAlign: 'center', width: '5%', marginLeft: 5}}>
                    <Checkbox defaultChecked />
                </Grid> */}
                <Grid item style={{textAlign: 'center', width: '5%', marginLeft: 5}}>
                    <p > <strong>Pauta</strong> </p>
                </Grid>
                <Grid item style={{textAlign: 'center', width: '10%', marginLeft: 5}}>
                    <p > <strong>Fecha <br /> Prevista</strong> </p>
                </Grid>
                <Grid item style={{textAlign: 'center', width: '10%', marginLeft: 5}}>
                    <p > <strong>Fecha <br /> Inicio</strong> </p>
                </Grid>
                <Grid item style={{textAlign: 'center', width: '10%', marginLeft: 5}}>
                    <p > <strong>Fecha <br /> Término</strong> </p>
                </Grid>
                <Grid item style={{textAlign: 'center', width: '10%', marginLeft: 5}}>
                    <p > <strong>Horómetro</strong> </p>
                </Grid>
                <Grid item style={{textAlign: 'center', width: '5%', marginLeft: 5}}>
                    <p > <strong>ID#</strong> </p>
                </Grid>
                <Grid item style={{textAlign: 'center', width: '15%', marginLeft: 5}}>
                    <p > <strong>Responsable</strong> </p>
                </Grid>
                <Grid item style={{textAlign: 'center', width: '10%', marginLeft: 5}}>
                    <p > <strong>Obra</strong> </p>
                </Grid>
                <Grid item style={{textAlign: 'center', width: '10%', marginLeft: 5}}>
                    <p > <strong>Acción</strong> </p>
                </Grid>
                {/* <Grid item style={{textAlign: 'center', width: '10%', marginLeft: 5}}>
                    <p > <strong>Ver</strong> </p>
                </Grid> */}
            </Grid>
            {
                (lista.length == 0) && <Grid container>
                        <div style={{width: '100%', textAlign: 'center', height: '50vh'}}>
                        <img style={{margin: 0, /* position: 'absolute',  */top: '50%', left: 'calc(100%/1.53)', /* msTransform: 'translateY(-50%)', transform: 'translateY(-50%)' */}} src="../../assets/icons/Arrow.svg" alt="" />
                        <div style={{width: '100%', textAlign: 'center', /* position: 'absolute',  */top: '55%', /* left: 'calc(100%/1.6)' */}}>
                            <p>Selecciona otra opción <br /> El detalle no cuenta con lista de reportes.</p>
                        </div>
                    </div>
                </Grid>
            }
            {
                lista.map((item, i) => {
                    return(
                        <Grid container key={i} style={{width: '100%'}}>
                            {/* <Grid item style={{textAlign: 'center', width: '5%', marginLeft: 5}}>
                                <Checkbox defaultChecked />
                            </Grid> */}
                            <Grid item style={{textAlign: 'center', width: '5%', marginLeft: 5}}>
                                <p> {item.guide} </p>
                            </Grid>
                            <Grid item style={{textAlign: 'center', width: '10%', marginLeft: 5}}>
                                <p> {item.date} </p>
                            </Grid>
                            <Grid item style={{textAlign: 'center', width: '10%', marginLeft: 5}}>
                                <p> {item.init} </p>
                            </Grid>
                            <Grid item style={{textAlign: 'center', width: '10%', marginLeft: 5}}>
                                <p> {item.end} </p>
                            </Grid>
                            <Grid item style={{textAlign: 'center', width: '10%', marginLeft: 5}}>
                                <p> {item.hourMeter} </p>
                            </Grid>
                            <Grid item style={{textAlign: 'center', width: '5%', marginLeft: 5}}>
                                <p> {item.idIndex} </p>
                            </Grid>
                            {item.enabled ? 
                            <Grid item style={{textAlign: 'center', width: '15%', marginLeft: 5}}>
                                <p> <button onClick={()=>openModal(item)} style={{backgroundColor: '#F9F9F9', borderRadius: 20, borderColor: '#757575', maxWidth: 130, height: 24, fontSize: 12}}>Asignar</button> </p>
                            </Grid> :
                            <Grid item style={{textAlign: 'center', width: '15%', marginLeft: 5}}>
                                <p> <button disabled style={{backgroundColor: '#F9F9F9', borderRadius: 20, borderColor: '#757575', maxWidth: 130, height: 24, fontSize: 12}}>Terminado</button> </p>
                            </Grid>
                            }
                            <Grid item style={{textAlign: 'center', width: '10%', marginLeft: 5}}>
                                <p> <a title={item.siteName}>{item.site}</a> </p>
                            </Grid>
                    
                            <Grid item style={{textAlign: 'center', width: '15%', marginLeft: 5}}>
                                <p> <button onClick={()=>{openReviewModal(item)}} style={{backgroundColor: '#F9F9F9', borderRadius: 20, borderColor: '#757575', maxWidth: 130, height: 24, fontSize: 12}}>Ver</button> </p>
                                {!item.enabled &&
                                    <p> <button disabled onClick={()=>{openPdf(item)}} style={{backgroundColor: '#F9F9F9', borderRadius: 20, borderColor: '#757575', maxWidth: 130, height: 24, fontSize: 12}}>Imprimr</button> </p>
                                }
                            </Grid> 
                            {/* <Grid item style={{textAlign: 'center', width: '15%', marginLeft: 5}}>
                                <p> <button disabled onClick={()=>{openPdf(item)}} style={{backgroundColor: '#F9F9F9', borderRadius: 20, borderColor: '#757575', maxWidth: 130, height: 24, fontSize: 12}}>Imprimr</button> </p>
                            </Grid> */}
                            
                            {/* <Grid item style={{textAlign: 'center', width: '10%', marginLeft: 5}}>
                                <p>  </p>
                            </Grid> */}
                            {/* <Grid item style={{textAlign: 'center', width: '10%', marginLeft: 5}}>
                                <p> <button onClick={()=>{setReportDataReview(JSON.stringify(item))}} style={{backgroundColor: '#F9F9F9', borderRadius: 20, borderColor: '#757575', maxWidth: 130, height: 24, fontSize: 12}}>Ver</button> </p>
                            </Grid> */}
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
                
                reportData && <PdfModal open={openPdfModal} reportData={reportData} onlyClose={onlyCloseReview}/>
                
            }
        </div>
    )
}

export default ReportsList