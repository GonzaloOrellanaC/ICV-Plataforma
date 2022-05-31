import React, { useState, useEffect } from 'react'
import { Box, Card, Grid, Toolbar, IconButton, Button, useMediaQuery, useTheme } from '@material-ui/core'
import { ArrowBackIos } from '@material-ui/icons'
import { date, reportPriority, saveReport, useStylesTheme } from '../../config'
import { useHistory } from 'react-router-dom'
import { machinesDatabase, readyToSendReportsDatabase, reportsDatabase } from '../../indexedDB'
import getAssignments from './getAssignemt'

const ActivitiesPage = () => {
    const classes = useStylesTheme();
    const history = useHistory();

    const [ assignments, setAssignments ] = useState([]);
    const [ prioritaryAssignments, setPrioritaryAssignments ] = useState([]);
    const [ assignmentsReadyToSend, setAssignmentsReadyToSend ] = useState([])
    const theme = useTheme();

    /* const isLarge = useMediaQuery(theme.breakpoints.down('lg'))
    const isMedium = useMediaQuery(theme.breakpoints.down('md')) */
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'))

    useEffect(async () => {
        let go = true;
        let db = await  readyToSendReportsDatabase.initDb()
        let data = await readyToSendReportsDatabase.consultar(db.database)
        setAssignmentsReadyToSend(data)
        if(navigator.onLine) {
            getAssignments().then((data) => {
                data.forEach(async (report, i) => {
                    if(report.guide === 'Pauta de Inspección') {
                        report._guide = 'PI' 
                    }else{
                        report._guide = report.guide
                    }
                    report.priority = reportPriority(report.level, localStorage.getItem('role'))
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
                        let assign = new Array()
                        let prioritaryAssign = new Array()
                        rs.map((element, index) => {
                            saveReport(element)
                            if(element.priority) {
                                prioritaryAssign.push(element)
                            }else{
                                assign.push(element)
                            }
                            if(index == (rs.length - 1)) {
                                writeDatabaseReports(assign.concat(prioritaryAssign))
                                setAssignments(assign.reverse())
                                setPrioritaryAssignments(prioritaryAssign)
                            }
                        })
                    }
                })
            })
        }else{
            const db = await reportsDatabase.initDbReports()
            const {database} = db
            let dataList = new Array()
            dataList = await reportsDatabase.consultar(database)
            setAssignments(dataList.reverse())
        }
        return () => go = false;
    }, [])

    const writeDatabaseReports = async (assign = new Array()) => {
        const db = await reportsDatabase.initDbReports()
        const {database} = db
        let dataList = new Array()
        dataList = await reportsDatabase.consultar(database)
        dataList.map(async (e, i) => {
            await reportsDatabase.eliminar(e.idDatabase, database)
            if(i == (dataList.length - 1)) {
                assign.map(async (a, i) => {
                    await reportsDatabase.actualizar(a, database)
                })
            }
        })
    }

    const goToDetail = (element) => {
        history.push(`/assignment/${element.idIndex}`)
    }

    const getMachineTypeByEquid = (machine) => {
        return new Promise(async resolve => {
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
                    <Card elevation={0} className={classes.pageCard}>
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
                                            <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={1} xs={1}>
                                                <div style={{width: 50, textAlign: 'center'}}>
                                                    <p style={{fontSize: 12, fontWeight: 'bold'}}>N° OT</p>
                                                </div>
                                            </Grid>
                                            <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={1} xs={1}>
                                                <div style={{width: 50, textAlign: 'center'}}>
                                                <p style={{fontSize: 12, fontWeight: 'bold'}}>Guía</p>
                                                </div>
                                            </Grid>
                                            <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={1} xs={1}>
                                                <div style={{width: 70, textAlign: 'center'}}>
                                                    <p style={{fontSize: 12, fontWeight: 'bold'}}>SAP ID</p>
                                                </div>
                                            </Grid>
                                            <Grid item xl={2} lg={2} md={2} sm={2} xs={3}>
                                                <p style={{fontSize: 12, fontWeight: 'bold'}}>Inicio programado</p>
                                            </Grid>
                                            <Grid item l={2} lg={2} md={2} sm={2} xs={2}>
                                                <p style={{fontSize: 12, fontWeight: 'bold'}}>Inicio ejecución</p>
                                            </Grid>
                                            {!isSmall && <Grid item xl={2} lg={2} md={2} sm={1} xs={1}>
                                                <p style={{fontSize: 12, fontWeight: 'bold'}}>Término programado</p>
                                            </Grid>}
                                            {!isSmall && <Grid item xl={2} lg={2} md={2} sm={1} xs={1}>
                                                <p style={{fontSize: 12, fontWeight: 'bold'}}>Término ejecución</p>
                                            </Grid>}
                                            <Grid item xl={1} lg={1} md={1} sm={1} xs={1}>
                                                <p style={{fontSize: 12, fontWeight: 'bold', textAlign: 'center'}}>Máquina</p>
                                            </Grid>
                                            <Grid item xl={1} lg={1} md={1} sm={1} xs={1}>
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
                                    {
                                    (localStorage.getItem('role')==='shiftManager' || localStorage.getItem('role')==='chiefMachinery') &&
                                        <div>
                                            <h3 className='item-style'>Mis actividades pendientes</h3>
                                        </div>
                                    }
                                    {(prioritaryAssignments.length > 0) && prioritaryAssignments.map((element, i) => {
                                        return(
                                            <div key={i}
                                                className='border-color-primary item-style'
                                                style={
                                                    {
                                                        width: '100%', 
                                                        borderRadius: 10, 
                                                        //borderStyle: 'solid', 
                                                        //borderWidth: 1, 
                                                        //borderColor: theme.palette.warning,
                                                        marginBottom: 10
                                                    }
                                            }>
                                                <Grid container>
                                                    <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={1} xs={1}>
                                                        <div style={{width: 50, textAlign: 'center'}}>
                                                            <p style={{fontSize: 12}}>{element.idIndex}</p>
                                                        </div>
                                                    </Grid>
                                                    <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={1} xs={1}>
                                                        <div style={{textAlign: 'center', width: 50}}>
                                                        <p style={{fontSize: 12}}>{element._guide}</p>
                                                        </div>
                                                    </Grid>
                                                    <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={1} xs={1}>
                                                        <div style={{width: 70, textAlign: 'center'}}>
                                                            <p style={{fontSize: 12}}>{element.sapId}</p>
                                                        </div>
                                                    </Grid>
                                                    <Grid item xl={2} lg={2} md={2} sm={2} xs={3}>
                                                        <div style={{width: '100%', textAlign: 'left'}}>
                                                            <p style={{fontSize: 12}}>{element.dateFormat}</p>
                                                        </div>
                                                    </Grid>
                                                    <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                                                        <p style={{fontSize: 12}}>{element.init}</p>
                                                    </Grid>
                                                    { !isSmall && <Grid item xl={2} lg={2} md={2} sm={1} xs={1}>
                                                        <p style={{fontSize: 12}}> {date(element.endPrev)} </p>
                                                    </Grid>}
                                                    { !isSmall && <Grid item xl={2} lg={2} md={2} sm={1} xs={1}>
                                                        <p style={{fontSize: 12}}> {element.end} </p>
                                                    </Grid>}
                                                    <Grid item xl={1} lg={1} md={1} sm={2} xs={2}>
                                                        {element.getMachine.model && <p style={{fontSize: 12, textAlign: 'center'}}> {element.machineType} {element.getMachine.model} N°: {element.getMachine.number} </p>}
                                                    </Grid>
                                                    <Grid item xl={1} lg={1} md={1} sm={1} xs={1} style={{width: '100%', textAlign: 'center', paddingRight: 20}}>
                                                        <Button onClick={()=>{goToDetail(element)}} color='primary' style={{borderRadius: 30}}>Ver</Button>
                                                    </Grid>
                                                </Grid>
                                            </div>
                                        )
                                    })}
                                    {
                                        ((localStorage.getItem('role')==='shiftManager' || localStorage.getItem('role')==='chiefMachinery') && prioritaryAssignments.length == 0) && <Grid container><h3 className='item-style'>Sin Asignación pendiente</h3></Grid>
                                    }
                                    {
                                    (localStorage.getItem('role')==='shiftManager' || localStorage.getItem('role')==='chiefMachinery') &&
                                        <div>
                                            <h3>Otras asignaciones</h3>
                                        </div>
                                    }
                                    {assignments.map((element, i) => {
                                        console.log(element)
                                        element.readyToSend = false
                                        assignmentsReadyToSend.forEach((data) => {
                                            if(data.idIndex === element.idIndex) {
                                                element.readyToSend = true
                                            }
                                        })
                                        return(
                                            <div key={i} style={
                                                {
                                                    width: '100%', 
                                                    borderRadius: 10, 
                                                    borderStyle: 'solid', 
                                                    borderWidth: 1, 
                                                    borderColor: element.readyToSend ? '#be2e26' : '#CCC',
                                                    marginBottom: 10,
                                                    backgroundColor: element.endReport ? '#f2f2f2' : '#fff'
                                                }
                                            }>
                                                <Grid container>
                                                    <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={1} xs={1}>
                                                        <div style={{width: 50, textAlign: 'center'}}>
                                                            <p style={{fontSize: 12}}>{element.idIndex}</p>
                                                        </div>
                                                    </Grid>
                                                    <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={1} xs={1}>
                                                        <div style={{width: 50, textAlign: 'center'}}>
                                                        <p style={{fontSize: 12}}>{element._guide}</p>
                                                        </div>
                                                    </Grid>
                                                    <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={1} xs={1}>
                                                        <div style={{width: 70, textAlign: 'center'}}>
                                                            <p style={{fontSize: 12}}>{element.sapId}</p>
                                                        </div>
                                                    </Grid>
                                                    <Grid item xl={2} lg={2} md={2} sm={2} xs={3}>
                                                        <div style={{width: '100%', textAlign: 'left'}}>
                                                            <p style={{fontSize: 12}}>{element.dateFormat}</p>
                                                        </div>
                                                    </Grid>
                                                    <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                                                        <p style={{fontSize: 12}}>{element.init}</p>
                                                    </Grid>
                                                    { !isSmall && <Grid item xl={2} lg={2} md={2} sm={1} xs={1}>
                                                        <p style={{fontSize: 12}}> {date(element.endPrev)} </p>
                                                    </Grid>}
                                                    { !isSmall && <Grid item xl={2} lg={2} md={2} sm={1} xs={1}>
                                                        <p style={{fontSize: 12}}> {element.end} </p>
                                                    </Grid>}
                                                    <Grid item xl={1} lg={1} md={1} sm={1} xs={1}>
                                                        {element.getMachine.model && <p style={{fontSize: 12, textAlign: 'center'}}> {element.machineType} {element.getMachine.model} <br /> N°: {element.getMachine.number} </p>}
                                                    </Grid>
                                                    <Grid item xl={1} lg={1} md={1} sm={1} xs={1} style={{width: '100%', textAlign: 'center', paddingRight: 20}}>
                                                        <Button onClick={()=>{goToDetail(element)}} color='primary' style={{borderRadius: 30}}>
                                                            {
                                                                (element.level && (element.level > 0))
                                                                ? 
                                                                'Ver'
                                                                : 
                                                                ((localStorage.getItem('role') === 'inspectionWorker' || localStorage.getItem('role') === 'maintenceOperator') ? (element.readyToSend ? 'Listo a enviar' : 'Ejecutar') : 'Ver')
                                                            }
                                                        </Button>
                                                    </Grid>
                                                    {/* <Grid item xl={1} lg={1} md={1} sm={4} xs={3}>
                                                        <div style={{width: '100%', textAlign: 'center', paddingRight: 20, marginTop: 10}}>
                                                            <Button onClick={()=>{goToDetail(element)}} color='primary' style={{borderRadius: 30}}>Ver</Button>
                                                        </div>
                                                    </Grid> */}
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