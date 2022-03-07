import React, { useState, useEffect } from 'react'
import { Box, Card, Grid, Toolbar, IconButton, Button, useMediaQuery, useTheme } from '@material-ui/core'
import { ArrowBackIos } from '@material-ui/icons'
import { date, useStylesTheme } from '../../config'
import { useHistory, useParams } from 'react-router-dom'
import { machinesDatabase, reportsDatabase } from '../../indexedDB'
import getAssignments from './getAssignemt'

const ActivitiesPage = () => {
    const classes = useStylesTheme();
    const history = useHistory();

    const {id} = useParams();


    const [ assignments, setAssignments ] = useState([]);
    const theme = useTheme();

    const isLarge = useMediaQuery(theme.breakpoints.down('lg')) 
    const isMedium = useMediaQuery(theme.breakpoints.down('md')) 
    const isSmall = useMediaQuery(theme.breakpoints.down('sm')) 

    useEffect(() => {
        let go = true;
        if(navigator.onLine) {
            getAssignments().then((data) => {
                data.forEach(async (report, i) => {
                    if(report.level) {
                        if(report.level > 0) {
                            report.infoState = 'Terminado'
                        }
                    }
                    report.dateFormat = date(report.datePrev);
                    report.end = date(report.endReport);
                    report.init = date(report.dateInit);
                    report.getMachine = await getMachineTypeByEquid(report.machine);
                    if(report.getMachine.model === 'PC5500') {
                        report.machineType = 'Pala'
                    }else if(report.getMachine.model === '793-F') {
                        report.machineType = 'Camión'
                    }
                    if(i == (data.length - 1)) {
                        let rs = data.filter((report) => {if(report.enabled) {return report}});
                        setAssignments(rs);
                    }
                })
            })
        }else{
            reportsDatabase.initDbReports().then(db => {
                if(go) {
                    reportsDatabase.consultar(db.database).then(reports => {
                        reports.forEach(async (report, i) => {
                            report.getMachine = await getMachineTypeByEquid(report.machine);
                            report.end = date(report.endReport);
                            report.init = date(report.dateInit);
                            if(report.getMachine.model === 'PC5500') {
                                report.machineType = 'Pala'
                            }else if(report.getMachine.model === '793-F') {
                                report.machineType = 'Camión'
                            }
                            if(i == (reports.length - 1)) {
                                setAssignments(reports);
                            }
                        })
                    })
                }
            })
        }
        return () => go = false;
    }, [])

    const goToDetail = (element) => {
        /* history.push(`/activities/${JSON.stringify(element)}`) */
        history.push(`/assignment/${element.idIndex}`)
    }

    const getMachineTypeByEquid = (machine) => {
        return new Promise(async  resolve => {
            let db = await machinesDatabase.initDbMachines();
            if(db) {
                const machines = await machinesDatabase.consultar(db.database);
                if(machines) {
                    let machineFiltered = machines.filter(m => { if(machine === m.equid) {return m}});
                    resolve({
                        number: machineFiltered[0].equ,
                        model: machineFiltered[0].model
                    })
                }
            }
        })
    }

    return (
        <Box height='100%'>
            <Grid className={classes.pageRoot} container spacing={0}>
                <Grid className={classes.pageContainer} item xs={12}>
                    <Card className={classes.pageCard}>
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
                                            Actividades Asignadas
                                        </h1>
                                    </Toolbar>
                                </div>
                            </div>
                            <div style={{width: '100%', padding: 10}}>
                                <Grid container direction='column'>
                                    <div style={
                                        {
                                            width: '100%', 
                                            borderRadius: 10, 
                                            borderStyle: 'solid', 
                                            borderWidth: 1, 
                                            borderColor: '#CCC',
                                            backgroundColor: '#CCC',
                                            marginBottom: 10
                                        }
                                    }>
                                        <Grid container>
                                            <Grid item lg={1} md={1} sm={1} xs={2}>
                                                <div style={{width: '100%', textAlign: 'center'}}>
                                                <p style={{fontSize: 12, fontWeight: 'bold'}}>Guía</p>
                                                </div>
                                            </Grid>
                                            <Grid item lg={2} md={1} sm={6} xs={6}>
                                                <p style={{fontSize: 12, fontWeight: 'bold'}}>Inicio programado</p>
                                            </Grid>
                                            <Grid item lg={1} md={1} sm={1} xs={1}>
                                                <div style={{width: '100%', textAlign: 'center'}}>
                                                    <p style={{fontSize: 12, fontWeight: 'bold'}}>ID</p>
                                                </div>
                                            </Grid>
                                            {!isSmall && <Grid item lg={2} md={1} sm={3}>
                                                <p style={{fontSize: 12, fontWeight: 'bold'}}>Inicio ejecución</p>
                                            </Grid>}
                                            {(!isSmall || !isMedium || !isLarge)  && <Grid item xl={1} lg={2} md={2}>
                                                <p style={{fontSize: 12, fontWeight: 'bold'}}>Máquina</p>
                                            </Grid>}
                                            {!isSmall && <Grid item lg={2} md={1} sm={3}>
                                                <p style={{fontSize: 12, fontWeight: 'bold'}}>Término ejecución</p>
                                            </Grid>}
                                            <Grid item lg={1} md={1} sm={4} xs={3}>
                                                <div style={{width: '100%', textAlign: 'center', paddingRight: 20}}>
                                                    <p style={{fontSize: 12, fontWeight: 'bold'}}>Acción</p>
                                                </div>
                                            </Grid>
                                        </Grid>
                                    </div>
                                </Grid>
                                <Grid container style={
                                    {
                                        overflowY: 'auto',
                                        maxHeight: 'calc(100vh - 295px)'
                                    }
                                }
                                >
                                    {assignments.map((element, i) => {
                                        return(
                                            <div key={i} style={
                                                {
                                                    width: '100%', 
                                                    borderRadius: 10, 
                                                    borderStyle: 'solid', 
                                                    borderWidth: 1, 
                                                    borderColor: '#CCC',
                                                    marginBottom: 10
                                                }
                                            }>
                                                <Grid container>
                                                    <Grid item lg={1} md={1} sm={1} xs={2}>
                                                        <div style={{width: '100%', textAlign: 'center'}}>
                                                        <p style={{fontSize: 12}}>{element.guide}</p>
                                                        </div>
                                                    </Grid>
                                                    <Grid item lg={2} md={1} sm={6} xs={6}>
                                                        <div style={{width: '100%', textAlign: 'left'}}>
                                                            <p style={{fontSize: 12}}>{element.dateFormat}</p>
                                                        </div>
                                                    </Grid>
                                                    <Grid item lg={1} md={1} sm={1} xs={1}>
                                                        <div style={{width: '100%', textAlign: 'center'}}>
                                                            <p style={{fontSize: 12}}>{element.idIndex}</p>
                                                        </div>
                                                    </Grid>
                                                    {!isSmall && <Grid item lg={2} md={1} sm={3}>
                                                        <p style={{fontSize: 12}}>{element.init}</p>
                                                    </Grid>}
                                                    {(!isSmall || !isMedium || !isLarge)  && <Grid item xl={2} lg={2} md={2}>
                                                        <p style={{fontSize: 12}}> {element.machineType} {element.getMachine.model} N°: {element.getMachine.number} </p>
                                                    </Grid>}
                                                    {/* <Grid item lg={2} sm={false}>
                                                        <p style={{fontSize: 12}}> {element.machineType} {element.getMachine.model} N°: {element.getMachine.number} </p>
                                                    </Grid> */}
                                                    { !isSmall && <Grid item lg={2} md={1} sm={3}>
                                                        <p style={{fontSize: 12}}> {element.end} </p>
                                                    </Grid>}
                                                    <Grid item lg={1} md={1} sm={4} xs={3}>
                                                        {element.infoState && 
                                                            <div style={{width: '100%',}}>
                                                            <div style={{float: 'left', width: '50%', textAlign: 'center', paddingRight: 20, marginTop: 0}}>
                                                                <Button onClick={()=>{goToDetail(element)}} color='primary' style={{borderRadius: 30}}>Ver</Button>
                                                            </div>
                                                            <div style={{float: 'left', width: '50%', textAlign: 'center', paddingRight: 20, marginTop: 10}}>
                                                                <p style={{marginBottom: 0, marginTop: 0, marginLeft: 10}}><strong>{element.infoState}</strong></p>
                                                            </div>
                                                            </div>
                                                        }
                                                        {!element.infoState && <div style={{width: '100%', textAlign: 'center', paddingRight: 20, marginTop: 10}}>
                                                            <Button onClick={()=>{goToDetail(element)}} color='primary' style={{borderRadius: 30}}>Ver</Button>
                                                        </div>}
                                                    </Grid>
                                                </Grid>
                                            </div>
                                        )
                                    })}
                                </Grid>
                            </div>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

export default ActivitiesPage