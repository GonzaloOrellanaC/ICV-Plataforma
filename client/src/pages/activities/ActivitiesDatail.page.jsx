import React, { useState, useEffect } from 'react'
import { Box, Card, Grid, Toolbar, IconButton, LinearProgress, Button } from '@material-ui/core'
import { ArrowBackIos } from '@material-ui/icons'
import { useStylesTheme } from '../../config'
import { useHistory, useParams } from 'react-router-dom'
import { pautasDatabase, executionReportsDatabase, reportsDatabase } from '../../indexedDB'
import { PautaDetail } from '../../containers'
import { reportsRoutes } from '../../routes'

const ActivitiesDetailPage = () => {
    const classes = useStylesTheme();
    const history = useHistory();
    const {id} = useParams();
    const [ pauta, setPauta ] = useState();
    const [ executionReport, setExecutionReport ] = useState()
    const [ progress, resutProgress ] = useState(0)
    const [ reportAssignment, setReportAssignment ] = useState()
    const [ reportLevel, setReportLevel ] = useState()
    const [ canEdit, setCanEdit ] = useState()
    const [ reportAssigned, setReportAssigned ] = useState()

    useEffect(() => {
        let report = JSON.parse(id);
        setReportAssigned(report)
        getPauta();
        let level = 0;
        if(!report.level) {
            level = 0
        }else{
            level = report.level
        }
        setReportLevel(level);
        let myReportLevel;
        if((localStorage.getItem('role') === 'inspectionWorker')||(localStorage.getItem('role') === 'maintenceOperator')) {
            myReportLevel = 0;
        }else if(localStorage.getItem('role') === 'shiftManager') {
            myReportLevel = 1;
        }else if(localStorage.getItem('role') === 'chiefMachinery') {
            myReportLevel = 2;
        }else if(localStorage.getItem('role') === 'sapExecutive') {
            myReportLevel = 3;
        };
        if(myReportLevel === level) {
            setCanEdit(true)
        }
    }, [])

    const getPauta = async () => {
        let db = await pautasDatabase.initDbPMs();
        if(db) {
            let pautaIdpm = getIdpm(JSON.parse(id).getMachine.model);
            setReportAssignment(JSON.parse(id).usersAssigned[0]);

            let pautas = await pautasDatabase.consultar(db.database);
            if(pautas) {
                let pautaFiltered = pautas.filter((info) => {if((info.typepm === JSON.parse(id).guide)&&(pautaIdpm===info.idpm)) {return info}});
                let exDb = await executionReportsDatabase.initDb();
                if( exDb ) {
                    let responseDatabase = await executionReportsDatabase.consultar(exDb.database);
                    if( responseDatabase ) {
                        let executionReportResponse = responseDatabase.filter((res) => { if(JSON.parse(id)._id === res.reportId) {return res}})
                        setExecutionReport(executionReportResponse[0])
                        setPauta(pautaFiltered[0]);
                    }
                }
                
            }
        }
    }

    const getIdpm = (model) => {
        if(model === '793-F') {
            return 'SPM000787';
        }else if(model === 'PC5500') {
            return 'SPM000445'
        }
    }

    const setProgress = (value) => {
        resutProgress(value)
    }

    const endReport = () => {
        let group = new Array();
        group = Object.values(executionReport.group);
        let state = true;
        group.map((item, index) => {
            item.map((i, n) => {
                if(!i.isChecked) {
                    state = false;
                };
                if(n == (item.length - 1)) {
                    if(index == (group.length - 1)) {
                        sendToNext(state)
                    }
                }
            })
        })
    }

    const sendToNext = async (okToSend) => {
        if(okToSend) {
            if(confirm('Se enviará información. ¿Desea confirmar?')) {
                let report = JSON.parse(id);
                reportsDatabase.initDbReports().then(db => {
                    reportsDatabase.consultar(db.database).then(response => {
                        let r = new Array()
                        r = response;
                        let filtered = response.filter(item => {if(report._id === item._id) {return item}});
                        let reportToLoad = filtered[0]
                        reportToLoad.level = reportLevel + 1;
                        if(reportToLoad.level == 1) {
                            reportToLoad.endReport = Date.now();
                            report.endReport = reportToLoad.endReport;
                        }else if(reportToLoad.level == 3) {
                            report.state = 'Por cerrar'
                        }else if(reportToLoad.level == 4) {
                            report.state = 'Completadas';
                            report.enabled = false;
                            report.dateClose = Date.now();
                            reportToLoad.dateClose = report.dateClose;
                        }
                        reportToLoad.state = report.state;
                        reportToLoad.enabled = report.enabled;
                        report.level = reportToLoad.level;
                        //console.log(report)
                        reportsDatabase.actualizar(reportToLoad, db.database).then(async res => {
                            if(navigator.onLine) {
                                if(res) {
                                    let r = await reportsRoutes.editReport(report);
                                    if(r) {
                                        alert('Información enviada');
                                        history.goBack();
                                    }
                                }
                            }else{
                                alert('Información actualizada en browser. Lista a enviar una vez cuente con conexión a internet.')
                            }
                        })
                    })
                })
            }
        }else{
            alert('Orden no se encuantra finalizada. Revise e intente nuevamente.')
        }
    }

    return (
        <Box height='80vh'>
            <Grid className={classes.pageRoot} container spacing={0}>
                <Grid className={classes.pageContainer} item xs={12}>
                    <Card className={classes.pageCard}>
                        <Grid container alignItems='center' justifyContent='center'>
                            <div style={{width: '100%', textAlign: 'left', padding: 10 }}>
                                <div style={{width: '100%', textAlign: 'left', color: '#333', backgroundColor: '#fff', borderRadius: 20 }}>
                                    <Toolbar style={{paddingLeft: 0, backgroundColor: '#F9F9F9', borderRadius: 10, width: '100%'}}>
                                        <IconButton onClick={() => setTimeout(() => {
                                            history.goBack()
                                        }, 500)}> 
                                            <ArrowBackIos style={{color: '#333', fontSize: 16}}/> 
                                        </IconButton> 
                                        <h1 style={{marginTop: 0, marginBottom: 0, fontSize: 16}}>
                                            Actividades Asignadas / Detalle
                                        </h1>
                                        
                                        <div style={{position: 'absolute', right: 10, width: '50%', textAlign: 'right'}}>
                                            <div style={{width: '100%', position: 'relative', right: 10, display: 'block'}}>
                                                <div style={{float: 'right', width: '40%', marginTop: 10, textAlign: 'left'}}>
                                                    <LinearProgress variant="determinate" value={progress} style={{width: '100%'}}/>
                                                    <p>{progress.toFixed(0)}%</p>
                                                </div>
                                                {
                                                    (localStorage.getItem('role') != 'sapExecutive') && <div style={{float: 'right', width: '40%', marginTop: 10, textAlign: 'right', marginRight: 20}}>
                                                        {canEdit && <Button variant="contained" color={'primary'} style={{ borderRadius: 50 }} onClick={()=>{endReport()}}>
                                                            Enviar
                                                        </Button>}
                                                        {!canEdit && <Button disabled={true} variant="contained" color={'primary'} style={{ borderRadius: 50 }}>
                                                            Enviar
                                                        </Button>}
                                                    </div>
                                                }
                                                {
                                                    (localStorage.getItem('role') === 'sapExecutive') && <div style={{float: 'right', width: '40%', marginTop: 10, textAlign: 'right', marginRight: 20}}>
                                                        {canEdit && <Button variant="contained" color={'primary'} style={{ borderRadius: 50 }} onClick={()=>{endReport()}}>
                                                            Cerrar Orden
                                                        </Button>}
                                                        {!canEdit && <Button disabled={true} variant="contained" color={'primary'} style={{ borderRadius: 50 }}>
                                                            Cerrar Orden
                                                        </Button>}
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </Toolbar>
                                </div>
                            </div>
                            <div style={{width: '98%'}}>
                                {
                                    pauta && <PautaDetail height={'calc(100vh - 300px)'} reportAssigned={reportAssigned} pauta={pauta} executionReport={executionReport} reportLevel={reportLevel} reportAssignment={reportAssignment} setProgress={setProgress}/>
                                }
                            </div>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

export default ActivitiesDetailPage