import React, { useState, useContext } from 'react'
import { Box, Card, Grid, Toolbar, IconButton, Button, useMediaQuery, useTheme, CircularProgress } from '@material-ui/core'
import { ArrowBackIos } from '@material-ui/icons'
import { date, useStylesTheme } from '../../config'
import { useHistory } from 'react-router-dom'
import { machinesDatabase, reportsDatabase } from '../../indexedDB'
import { AuthContext, ExecutionReportContext, ReportsContext } from '../../context'

const ActivitiesPage = () => {
    const classes = useStylesTheme();
    const history = useHistory();
    const {isOperator, isSapExecutive, isShiftManager, isChiefMachinery, admin} = useContext(AuthContext)
    const {setReport} = useContext(ExecutionReportContext)
    const {priorityAssignments, normalAssignments} = useContext(ReportsContext)
    const [showList, setShowList] = useState(true)
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'))

    const goToDetail = (element) => {
        console.log(element)
        setReport(element)
        history.push(`/assignment/${element.idIndex}`)
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
                                    {
                                    (isChiefMachinery || isShiftManager) &&
                                        <div
                                            style={{
                                                width: '100%'
                                            }}
                                        >
                                            <h3 className='item-style'>Mis actividades pendientes</h3>
                                            {priorityAssignments.reverse().map((element, i) => {
                                                return(
                                                    <div key={i}
                                                        className={`${'border-color-primary'} item-style`}
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
                                                                    <p style={{fontSize: 11}}>{element.idIndex}</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={1} xs={1}>
                                                                <div style={{textAlign: 'center', width: 50}}>
                                                                <p style={{fontSize: 11}}>{element._guide}</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xl={1} lg={1} md={1} sm={1} xs={1}>
                                                                <div style={{textAlign: 'center'}}>
                                                                    <p style={{fontSize: 11}}>{element.sapId}</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                                <div style={{width: '100%', textAlign: 'left'}}>
                                                                    <p style={{fontSize: 11, minWidth: 200}}>{date(element.datePrev)}</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                                <p style={{fontSize: 11, minWidth: 200}}>{element.init}</p>
                                                            </Grid>
                                                            { !isSmall && <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                                <p style={{fontSize: 11, minWidth: 200}}> {date(element.endPrev)} </p>
                                                            </Grid>}
                                                            { !isSmall && <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                                <p style={{fontSize: 11, minWidth: 200}}> {element.end} </p>
                                                            </Grid>}
                                                            <Grid item xl={1} lg={1} md={1} sm={1} xs={1}>
                                                                <p style={{fontSize: 11, textAlign: 'center', minWidth: 70}}> {element.machineData.type} {element.machineData.model} </p>
                                                            </Grid>
                                                            <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                                <p style={{fontSize: 11, textAlign: 'center', minWidth: 70}}> N°: {element.machineData.equ} </p>
                                                            </Grid>
                                                            <Grid item xl={2} lg={2} md={2} sm={2} xs={2} style={{width: '100%', textAlign: 'right', paddingRight: 20}}>
                                                                <Button onClick={()=>{goToDetail(element)}} color='primary' style={{borderRadius: 30}}>Ver</Button>
                                                            </Grid>
                                                        </Grid>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    }
                                    {(isChiefMachinery || isShiftManager || isSapExecutive || isOperator || admin) &&
                                        <div
                                            style={{
                                                width: '100%'
                                            }}
                                        >
                                            <h3>Otras asignaciones</h3>
                                            {
                                                (normalAssignments.length === 0 && showList)
                                                &&
                                                <div>
                                                    <p>Sin asignaciones</p>
                                                </div>
                                            }
                                            {
                                                normalAssignments.reverse().map((element, i) => {
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
                                                                        <p style={{fontSize: 11}}>{element.idIndex}</p>
                                                                    </div>
                                                                </Grid>
                                                                <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={1} xs={1}>
                                                                    <div style={{width: 50, textAlign: 'center'}}>
                                                                    <p style={{fontSize: 11}}>{element._guide}</p>
                                                                    </div>
                                                                </Grid>
                                                                <Grid item xl={1} lg={1} md={1} sm={1} xs={1}>
                                                                    <div style={{textAlign: 'center'}}>
                                                                        <p style={{fontSize: 11}}>{element.sapId}</p>
                                                                    </div>
                                                                </Grid>
                                                                <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                                    <div style={{width: '100%', textAlign: 'left'}}>
                                                                        <p style={{fontSize: 11, minWidth: 200}}>{date(element.datePrev)}</p>
                                                                    </div>
                                                                </Grid>
                                                                <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                                    <p style={{fontSize: 11, minWidth: 200}}>{element.init}</p>
                                                                </Grid>
                                                                { !isSmall && <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                                    <p style={{fontSize: 11, minWidth: 200}}> {date(element.endPrev)} </p>
                                                                </Grid>}
                                                                {!isSmall && <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                                    <div style={{width: '100%', textAlign: 'left'}}>
                                                                        <p style={{fontSize: 11, minWidth: 200}}>{date(element.endReport)}</p>
                                                                    </div>
                                                                </Grid>}
                                                                <Grid item xl={1} lg={1} md={1} sm={1} xs={1}>
                                                                    <p style={{fontSize: 11, textAlign: 'center', minWidth: 70}}> {element.machineData.type} {element.machineData.model} </p>
                                                                </Grid>
                                                                <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                                    <p style={{fontSize: 11, textAlign: 'center', minWidth: 70}}> N°: {element.machineData.equ} </p>
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
                                        </div>
                                    }
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