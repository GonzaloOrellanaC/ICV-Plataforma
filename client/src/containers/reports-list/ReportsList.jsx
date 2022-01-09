import { useState, useEffect } from "react";
import {Box, Grid, Card, makeStyles, Toolbar, IconButton, ListItem, ListItemIcon, ListItemText, Checkbox, Chip} from '@material-ui/core';
import { machinesRoutes } from '../../routes';
import { AssignReportModal } from '../../modals'
import { useHistory } from "react-router-dom";
import { useStylesTheme } from '../../config';


const ReportsList = ({list}) => {
    const classes = useStylesTheme();
    const [ reportData, setReportData ] = useState(null);
    const [ openModalState, setOpenModalState ] = useState(false);
    const history = useHistory();

    const openModal = (report) => {
        console.log(report)
        setReportData(report);
        setOpenModalState(true);
    }

    const closeModal = () => {
        setOpenModalState(false);
    }

    list.forEach(item => {
        item.date = item.datePrev.replace('T00:00:00.000Z', '');
        machinesRoutes.getMachineByEquid(item.machine).then(data => {
            item.hourMeter = (Number(data.data[0].hourMeter)/3600000);
        })
    });

    const lista = list.reverse()

    return(
        <div style={{width: '100%'}} className={classes.pageRoot}>
            <Grid container style={{width: '100%'}}>
                {/* <Grid item style={{textAlign: 'center', width: '5%', marginLeft: 5}}>
                    <Checkbox defaultChecked />
                </Grid> */}
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
                <Grid item style={{textAlign: 'center', width: '20%', marginLeft: 5}}>
                    <p > <strong>Obra</strong> </p>
                </Grid>
                {/* <Grid item style={{textAlign: 'center', width: '10%', marginLeft: 5}}>
                    <p > <strong>Descargar</strong> </p>
                </Grid> */}
                <Grid item style={{textAlign: 'center', width: '10%', marginLeft: 5}}>
                    <p > <strong>Ver</strong> </p>
                </Grid>
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
                            <Grid item style={{textAlign: 'center', width: '10%', marginLeft: 5}}>
                                <p> {item.date} </p>
                            </Grid>
                            <Grid item style={{textAlign: 'center', width: '10%', marginLeft: 5}}>
                                <p>  </p>
                            </Grid>
                            <Grid item style={{textAlign: 'center', width: '10%', marginLeft: 5}}>
                                <p>  </p>
                            </Grid>
                            <Grid item style={{textAlign: 'center', width: '10%', marginLeft: 5}}>
                                <p> {item.hourMeter} </p>
                            </Grid>
                            <Grid item style={{textAlign: 'center', width: '5%', marginLeft: 5}}>
                                <p> {item.idIndex} </p>
                            </Grid>
                            <Grid item style={{textAlign: 'center', width: '15%', marginLeft: 5}}>
                                <p> <button onClick={()=>openModal(item)} style={{backgroundColor: '#F9F9F9', borderRadius: 20, borderColor: '#757575', maxWidth: 130, height: 24, fontSize: 12}}>Asignar</button> </p>
                            </Grid>
                            <Grid item style={{textAlign: 'center', width: '20%', marginLeft: 5}}>
                                <p> {item.siteName} </p>
                            </Grid>
                            {/* <Grid item style={{textAlign: 'center', width: '10%', marginLeft: 5}}>
                                <p>  </p>
                            </Grid> */}
                            <Grid item style={{textAlign: 'center', width: '10%', marginLeft: 5}}>
                                <p> <button onClick={()=>{history.push(`/reports/edit-report/${JSON.stringify(item)}`)}} style={{backgroundColor: '#F9F9F9', borderRadius: 20, borderColor: '#757575', maxWidth: 130, height: 24, fontSize: 12}}>Ver</button> </p>
                            </Grid>
                        </Grid>
                    )
                })
            }
            {
                
                reportData && <AssignReportModal open={openModalState} report={reportData} closeModal={closeModal}/>
                
            }
        </div>
    )
}

export default ReportsList