import React, { useState, useEffect, useContext } from 'react'
import { Box, Card, Grid, Toolbar, IconButton, Button, useMediaQuery, useTheme, CircularProgress } from '@material-ui/core'
import { ArrowBackIos } from '@material-ui/icons'
import { date, reportPriority, saveReport, useStylesTheme } from '../../config'
import { useHistory } from 'react-router-dom'
import { machinesDatabase, readyToSendReportsDatabase, reportsDatabase } from '../../indexedDB'
import getAssignments from './getAssignemt'
import { AuthContext, ExecutionReportContext, ReportsContext } from '../../context'

const ActivitiesPage = () => {
    const classes = useStylesTheme();
    const history = useHistory();
    const {isOperator} = useContext(AuthContext)
    const {setReport} = useContext(ExecutionReportContext)
    const {assignments} = useContext(ReportsContext)
    /* const [ assignments, setAssignments ] = useState([]); */
    const [ prioritaryAssignments, setPrioritaryAssignments ] = useState([]);
    const [ assignmentsReadyToSend, setAssignmentsReadyToSend ] = useState([])
    const [showList, setShowList] = useState(true)
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'))
    /* const isOperator = Boolean(localStorage.getItem('isOperator')) */
    /* const isSapExecutive = Boolean(localStorage.getItem('isSapExecutive'))
    const isShiftManager = Boolean(localStorage.getItem('isShiftManager'))
    const isChiefMachinery = Boolean(localStorage.getItem('isChiefMachinery')) */
    useEffect(async () => {
        /* console.log(isShiftManager,isChiefMachinery) */
        let db = await  readyToSendReportsDatabase.initDb()
        let dataToSend = await readyToSendReportsDatabase.consultar(db.database)
        setAssignmentsReadyToSend(dataToSend)
        if(navigator.onLine) {
            getAssignments().then((data) => {
                if (data.length === 0) {
                    setShowList(true)
                }
                if(data) {
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
                        if (report.getMachine) {
                            report.modelMachine = report.getMachine.model
                            report.numberMachine = report.getMachine.number
                            if(report.getMachine.model === 'PC5500') {
                                report.machineType = 'Pala'
                            }else if(report.getMachine.model === '793-F') {
                                report.machineType = 'Camión'
                            }
                        } else {
                            report.modelMachine = 'Sin asignar'
                            report.numberMachine = ''
                            report.machineType = 'Sin asignar'
                        }
                        if(i == (data.length - 1)) {
                            let rs = data.filter((report) => {if(report.enabled) {return report}});
                            let assign = []
                            let prioritaryAssign = []
                            rs.map((element, index) => {
                                saveReport(element)
                                if(element.priority) {
                                    prioritaryAssign.push(element)
                                }else{
                                    assign.push(element)
                                }
                                if(index == (rs.length - 1)) {
                                    writeDatabaseReports(assign.concat(prioritaryAssign))
                                    /* setAssignments(assign.reverse()) */
                                    setPrioritaryAssignments(prioritaryAssign)
                                }
                            })
                            setShowList(true)
                        }
                    })
                }
            })
        }else{
            const db = await reportsDatabase.initDbReports()
            const {database} = db
            let dataList = []
            dataList = await reportsDatabase.consultar(database)
            /* setAssignments(dataList.reverse()) */
            setShowList(true)
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
        console.log(element)
        setReport(element)
        history.push(`/assignment/${element.idIndex}`)
    }

    const getMachineTypeByEquid = (machine) => {
        /* console.log(machine) */
        return new Promise(async resolve => {
            let db = await machinesDatabase.initDbMachines();
            if(db) {
                const machines = await machinesDatabase.consultar(db.database);
                if(machines) {
                    let machineFiltered = machines.filter(m => { if(machine === m.equid) {return m}});
                    /* console.log(machineFiltered) */
                    if (machineFiltered.length > 0) {
                        resolve({
                            number: machineFiltered[0].equ,
                            model: machineFiltered[0].model
                        })
                    } else {
                        /* console.log(machine) */
                        resolve(null)
                    }
                }
            } else {
                resolve(null)
            }
        })
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
                                            <Grid item xl={1} lg={1} md={1} sm={1} xs={1}>
                                                <div style={{width: '100%', textAlign: 'center'}}>
                                                    <p style={{fontSize: 12, fontWeight: 'bold'}}>SAP ID</p>
                                                </div>
                                            </Grid>
                                            <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                <p style={{fontSize: 12, fontWeight: 'bold', minWidth: 200}}>Inicio programado</p>
                                            </Grid>
                                            <Grid item l={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                <p style={{fontSize: 12, fontWeight: 'bold', minWidth: 200}}>Inicio ejecución</p>
                                            </Grid>
                                            {!isSmall && <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                <p style={{fontSize: 12, fontWeight: 'bold', minWidth: 200}}>Término programado</p>
                                            </Grid>}
                                            {!isSmall && <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                <p style={{fontSize: 12, fontWeight: 'bold', minWidth: 200}}>Término ejecución</p>
                                            </Grid>}
                                            <Grid item xl={1} lg={1} md={1} sm={1} xs={1}>
                                                <p style={{fontSize: 12, fontWeight: 'bold', textAlign: 'center', minWidth: 70}}>Flota</p>
                                            </Grid>
                                            <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                <p style={{fontSize: 12, fontWeight: 'bold', textAlign: 'center', minWidth: 70}}>Nro Máquina</p>
                                            </Grid>
                                            <Grid item xl={2} lg={2} md={2} sm={2} xs={2} style={{width: '100%', textAlign: 'right', paddingRight: 20}}>
                                                {/* <div style={{width: '100%', textAlign: 'center', paddingRight: 20}}> */}
                                                    <p style={{fontSize: 12, fontWeight: 'bold'}}>Acción</p>
                                                {/* </div> */}
                                            </Grid>
                                        </Grid>
                                    </div>
                                </Grid>
                                {showList && <Grid container style={
                                    {
                                        overflowY: 'auto',
                                        maxHeight: 'calc(100vh - 295px)'
                                    }
                                }
                                >
                                    {/* {
                                    (isChiefMachinery || isShiftManager || localStorage.getItem('role')==='shiftManager' || localStorage.getItem('role')==='chiefMachinery') &&
                                        <div>
                                            <h3 className='item-style'>Mis actividades pendientes</h3>
                                        </div>
                                    } */}
                                    {prioritaryAssignments && prioritaryAssignments.reverse().map((element, i) => {
                                        return(
                                            <div key={i}
                                                className='border-color-primary item-style'
                                                style={
                                                    {
                                                        width: '100%',
                                                        borderRadius: 10,
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
                                                    <Grid item xl={1} lg={1} md={1} sm={1} xs={1}>
                                                        <div style={{textAlign: 'center'}}>
                                                            <p style={{fontSize: 12}}>{element.sapId}</p>
                                                        </div>
                                                    </Grid>
                                                    <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                        <div style={{width: '100%', textAlign: 'left'}}>
                                                            <p style={{fontSize: 12, minWidth: 200}}>{element.dateFormat}</p>
                                                        </div>
                                                    </Grid>
                                                    <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                        <p style={{fontSize: 12, minWidth: 200}}>{element.init}</p>
                                                    </Grid>
                                                    { !isSmall && <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                        <p style={{fontSize: 12, minWidth: 200}}> {date(element.endPrev)} </p>
                                                    </Grid>}
                                                    { !isSmall && <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                        <p style={{fontSize: 12, minWidth: 200}}> {element.end} </p>
                                                    </Grid>}
                                                    <Grid item xl={1} lg={1} md={1} sm={1} xs={1}>
                                                        {element.modelMachine && <p style={{fontSize: 12, textAlign: 'center', minWidth: 70}}> {element.machineType} {element.modelMachine} </p>}
                                                    </Grid>
                                                    <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                        {element.modelMachine && <p style={{fontSize: 12, textAlign: 'center', minWidth: 70}}> N°: {element.numberMachine} </p>}
                                                    </Grid>
                                                    <Grid item xl={2} lg={2} md={2} sm={2} xs={2} style={{width: '100%', textAlign: 'right', paddingRight: 20}}>
                                                        <Button onClick={()=>{goToDetail(element)}} color='primary' style={{borderRadius: 30}}>Ver</Button>
                                                    </Grid>
                                                </Grid>
                                            </div>
                                        )
                                    })}
                                    {/* {
                                        (isChiefMachinery || isShiftManager || (localStorage.getItem('role')==='shiftManager' || localStorage.getItem('role')==='chiefMachinery') && prioritaryAssignments.length == 0) && <Grid container><p className='item-style'>Sin Asignación pendiente</p></Grid>
                                    }
                                    {
                                    (isChiefMachinery || isShiftManager || localStorage.getItem('role')==='shiftManager' || localStorage.getItem('role')==='chiefMachinery') &&
                                        <div>
                                            <h3>Otras asignaciones</h3>
                                            {
                                                (assignments.length === 0 && showList)
                                                &&
                                                <p>Sin asignaciones</p>
                                            }
                                        </div>
                                    } */}
                                    {assignments && assignments.map((element, i) => {
                                        /* console.log(element) */
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
                                                    <Grid item xl={1} lg={1} md={1} sm={1} xs={1}>
                                                        <div style={{textAlign: 'center'}}>
                                                            <p style={{fontSize: 12}}>{element.sapId}</p>
                                                        </div>
                                                    </Grid>
                                                    <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                        <div style={{width: '100%', textAlign: 'left'}}>
                                                            <p style={{fontSize: 12, minWidth: 200}}>{element.dateFormat}</p>
                                                        </div>
                                                    </Grid>
                                                    <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                        <p style={{fontSize: 12, minWidth: 200}}>{element.init}</p>
                                                    </Grid>
                                                    { !isSmall && <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                        <p style={{fontSize: 12, minWidth: 200}}> {date(element.endPrev)} </p>
                                                    </Grid>}
                                                    { !isSmall && <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                        <p style={{fontSize: 12, minWidth: 200}}> {element.end} </p>
                                                    </Grid>}
                                                    <Grid item xl={1} lg={1} md={1} sm={1} xs={1}>
                                                        {element.modelMachine && <p style={{fontSize: 12, textAlign: 'center', minWidth: 70}}> {element.machineType} {element.modelMachine} </p>}
                                                    </Grid>
                                                    <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                        {element.modelMachine && <p style={{fontSize: 12, textAlign: 'center', minWidth: 70}}> N°: {element.numberMachine} </p>}
                                                    </Grid>
                                                    <Grid item xl={2} lg={2} md={2} sm={2} xs={2} style={{width: '100%', textAlign: 'right', paddingRight: 20}}>
                                                        <Button onClick={()=>{goToDetail(element)}} color='primary' style={{borderRadius: 30}}>
                                                            {
                                                                (element.level && (element.level > 0))
                                                                ? 
                                                                'Ver'
                                                                : 
                                                                (isOperator||(localStorage.getItem('role') === 'inspectionWorker' || localStorage.getItem('role') === 'maintenceOperator') ? (element.readyToSend ? 'Listo a enviar' : 'Ejecutar') : 'Ver')
                                                            }
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </div>
                                        )
                                    })}
                                </Grid>}
                                <Grid>
                                    {
                                        /* ((assignments.length == 0) && (prioritaryAssignments.length == 0)) */!showList && 
                                        <div style={{ width: '100%', textAlign: 'center', height: 100 }}>
                                            <CircularProgress size={50} />
                                        </div>
                                    }
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