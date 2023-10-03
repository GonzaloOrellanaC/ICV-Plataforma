import React, { useState, useContext, useEffect } from 'react'
import { Box, Card, Grid, Toolbar, IconButton, Button, useMediaQuery, useTheme, CircularProgress } from '@material-ui/core'
import { ArrowBackIos } from '@material-ui/icons'
import { date, useStylesTheme } from '../../config'
import { useNavigate } from 'react-router-dom'
/* import { machinesDatabase, reportsDatabase } from '../../indexedDB' */
import { AuthContext, ExecutionReportContext, useReportsContext } from '../../context'
import { FormControl, InputLabel, ListItemButton, MenuItem, Select } from '@mui/material'
import SeleccionarObraDialog from '../../dialogs/SeleccionarObraDialog'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarker } from '@fortawesome/free-solid-svg-icons'

const ActivitiesPage = () => {
    const classes = useStylesTheme();
    const navigate = useNavigate();
    const {isOperator, isSapExecutive, isShiftManager, isChiefMachinery, admin, userData} = useContext(AuthContext)
    const {setReport} = useContext(ExecutionReportContext)
    const {priorityAssignments, normalAssignments} = useReportsContext()
    const [showList, setShowList] = useState(true)
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'))
    const [asignaciones, setAsignaciones] = useState('only')
    const [listadoReportes, setListadoReportes] = useState([])
    const [listadoReportesCache, setListadoReportesCache] = useState([])
    const [openSeleccionarObra, setOpnSeleccionarObra] = useState(false)
    const [loading, setLoading] = useState(false)
    const [order, setOrder] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            console.log(priorityAssignments.length, normalAssignments.length)
            setListadoReportes(priorityAssignments)
            setListadoReportesCache(priorityAssignments)
            setLoading(false)
        },[500])
    },[priorityAssignments, normalAssignments])

    /* useEffect(() => {
        listadoReportes.map(report => {
            if (report) {
                console.log(report.datePrev)
                console.log(Date.now(report.datePrev))
            }
        })
    },[listadoReportes]) */

    const goToDetail = (element) => {
        /* setReport(element) */
        navigate(`/assignment/${element.idIndex}`)
    }

    const compareBy = (value) => {
        console.log(value)
        const listadoReportesCache2 = [...listadoReportesCache]
        if (value === 'ot') {
            setListadoReportes(listadoReportesCache2.sort(compareByOt))
        } else if (value === 'dateInit') {
            setListadoReportes(listadoReportesCache2.sort(compareInicio))
        } else if (value === 'datePrev') {
            setListadoReportes(listadoReportesCache2.sort(compareInicioProgramado))
        }
    }

    const compareByOt = (a, b) => {
        if (order) {
            setOrder(false)
            return a.idIndex - b.idIndex
        } else {
            setOrder(true)
            return b.idIndex - a.idIndex
        }
    }

    const compareInicio = (a, b) => {
        console.log(a.dateInit)
        if (order) {
            setOrder(false)
            return Date.now(a.dateInit) - Date.now(b.dateInit)
        } else {
            setOrder(true)
            return Date.now(b.dateInit) - Date.now(a.dateInit)
        }
    }

    const compareInicioProgramado = (a, b) => {
        console.log(a.datePrev)
        if (order) {
            setOrder(false)
            return new Date(a.datePrev) - new Date(b.datePrev)
        } else {
            setOrder(true)
            return new Date(b.datePrev) - new Date(a.datePrev)
        }
    }

    useEffect(() => {
        if (asignaciones === 'only') {
            setListadoReportes(priorityAssignments)
        } else {
            setListadoReportes(normalAssignments)
        }
    },[asignaciones])

    const closeSeleccionarObra = () => {
        setLoading(true)
        setListadoReportes([])
        setOpnSeleccionarObra(false)
    }

    return (
        <Box height='100%'>
            {
            openSeleccionarObra && <SeleccionarObraDialog open={openSeleccionarObra} handleClose={closeSeleccionarObra} />
            }
            <Grid className={'pageRoot'} container spacing={0}>
                <Grid className={classes.pageContainer} item xs={12}>
                    <Card elevation={0} className={'pageCard'}>
                        <Grid container alignItems='center' justifyContent='center'>
                            <div style={{width: '100%', textAlign: 'left', padding: 10 }}>
                                <div style={{width: '100%', textAlign: 'left', color: '#333', backgroundColor: '#fff', borderRadius: 20 }}>
                                    <Toolbar style={{paddingLeft: 0, backgroundColor: '#F9F9F9', borderRadius: 10, width:'100%'}}>
                                        <IconButton onClick={() => setTimeout(() => {
                                            navigate(-1)
                                        }, 500)}> 
                                            <ArrowBackIos style={{color: '#333', fontSize: 16}}/> 
                                        </IconButton> 
                                        <h1 style={{marginTop: 0, marginBottom: 0, fontSize: 16}}>
                                            Actividades Asignadas
                                        </h1>
                                        {!admin && <FormControl fullWidth style={{ position: 'absolute',right: 5, width: 180, borderColor: '#ccc' }}>
                                            <InputLabel id="demo-simple-select-label" color={'error'}>Lista</InputLabel>
                                            <Select
                                                color={'error'}
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={asignaciones}
                                                label="Age"
                                                onChange={(e) => {setAsignaciones(e.target.value)}}
                                            >
                                                <MenuItem value={'only'}>Mis Asignaciones</MenuItem>
                                                <MenuItem value={'all'}>Otras</MenuItem>
                                            </Select>
                                        </FormControl>}
                                        {admin && <IconButton
                                            color={'primary'} 
                                            style={{ position: 'absolute',right: 5, marginRight: 5 }}
                                            edge={'end'}
                                            /* hidden={!hableCreateReport} */
                                            onClick={() => setOpnSeleccionarObra(true)}
                                            title='Seleccionar Obra'
                                        >
                                            <FontAwesomeIcon icon={faMapMarker}/>
                                        </IconButton>}
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
                                                <ListItemButton onClick={() => {compareBy('ot')}} style={{width: 50, textAlign: 'center', padding: 0, margin: '12px 0px'}}>
                                                    <p style={{width: 50, fontSize: 12, fontWeight: 'bold'}}>N° OT</p>
                                                </ListItemButton>
                                            </Grid>
                                            <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={1} xs={1}>
                                                <ListItemButton onClick={() => {compareBy('')}} style={{width: 50, textAlign: 'center', padding: 0, margin: '12px 0px'}}>
                                                    <p style={{width: 50, fontSize: 12, fontWeight: 'bold'}}>Guía</p>
                                                </ListItemButton>
                                            </Grid>
                                            <Grid item xl={'auto'} lg={'auto'} md={'auto'}>
                                                <ListItemButton onClick={() => {compareBy('')}} style={{minWidth: 100, textAlign: 'center', padding: 0, margin: '12px 0px'}}>
                                                    <p style={{width: 100, fontSize: 12, fontWeight: 'bold'}}>SAP ID</p>
                                                </ListItemButton>
                                            </Grid>
                                            <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                <ListItemButton onClick={() => {compareBy('datePrev')}} style={{minWidth: 170, padding: 0, margin: '12px 0px'}}>
                                                <p style={{fontSize: 12, fontWeight: 'bold', minWidth: 170}}>Inicio programado</p>
                                                </ListItemButton>
                                            </Grid>
                                            <Grid item l={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                <ListItemButton onClick={() => {compareBy('dateInit')}} style={{minWidth: 170, padding: 0, margin: '12px 0px'}}>
                                                <p style={{fontSize: 12, fontWeight: 'bold', minWidth: 170}}>Inicio ejecución</p>
                                                </ListItemButton>
                                            </Grid>
                                            {!isSmall && <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                <ListItemButton style={{minWidth: 170, padding: 0, margin: '12px 0px'}}>
                                                <p style={{fontSize: 12, fontWeight: 'bold', minWidth: 170}}>Término programado</p>
                                                </ListItemButton>
                                            </Grid>}
                                            {!isSmall && <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                <ListItemButton style={{minWidth: 170, padding: 0, margin: '12px 0px'}}>
                                                <p style={{fontSize: 12, fontWeight: 'bold', minWidth: 170}}>Término ejecución</p>
                                                </ListItemButton>
                                            </Grid>}
                                            <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                <ListItemButton style={{minWidth: 150, textAlign: 'center', padding: 0, margin: '12px 0px'}}>
                                                <p style={{fontSize: 12, fontWeight: 'bold', textAlign: 'left', minWidth: 150}}>Flota</p>
                                                </ListItemButton>
                                            </Grid>
                                            <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                <ListItemButton style={{minWidth: 70, textAlign: 'center', padding: 0, margin: '12px 0px'}}>
                                                <p style={{fontSize: 12, fontWeight: 'bold', textAlign: 'left', minWidth: 70}}> Progreso </p>
                                                </ListItemButton>
                                            </Grid>
                                            <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                <ListItemButton style={{minWidth: 70, textAlign: 'center', padding: 0, margin: '12px 0px'}}>
                                                <p style={{fontSize: 12, fontWeight: 'bold', textAlign: 'center', minWidth: 70}}>Nro Máquina</p>
                                                    </ListItemButton>
                                            </Grid>
                                            <Grid item xl={1} lg={1} md={1} sm={1} xs={1}>
                                                <ListItemButton disabled style={{textAlign: 'right', padding: 0, margin: '12px 0px', color: 'black', opacity: 1}}>
                                                    <p style={{fontSize: 12, fontWeight: 'bold', textAlign: 'right', width: '100%', marginRight: 0, color: 'black'}}>Acción</p>
                                                </ListItemButton>
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
                                        (listadoReportes.length === 0 && showList)
                                        &&
                                        <div>
                                            <p>Sin asignaciones</p>
                                        </div>
                                    } */}
                                    {
                                        loading && <div style={{width: '100%', textAlign: 'center', minHeight: 100}}>
                                            <CircularProgress />
                                        </div>
                                    }
                                    {
                                        listadoReportes./* sort(compareNumbers). */map((element, i) => {
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
                                                        <Grid item xl={'auto'} lg={'auto'} md={'auto'}>
                                                            <div style={{textAlign: 'center', minWidth: 100}}>
                                                                <p style={{fontSize: 11}}>{element.sapId}</p>
                                                            </div>
                                                        </Grid>
                                                        <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                            <div style={{width: '100%', textAlign: 'left'}}>
                                                                <p style={{fontSize: 11, minWidth: 170}}>{date(element.datePrev)}</p>
                                                            </div>
                                                        </Grid>
                                                        <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                            <p style={{fontSize: 11, minWidth: 170}}>{date(element.dateInit)}</p>
                                                        </Grid>
                                                        { !isSmall && <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                            <p style={{fontSize: 11, minWidth: 170}}> {date(element.endPrev)} </p>
                                                        </Grid>}
                                                        {!isSmall && <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                            <div style={{width: '100%', textAlign: 'left'}}>
                                                                <p style={{fontSize: 11, minWidth: 170}}>{date(element.endReport)}</p>
                                                            </div>
                                                        </Grid>}
                                                        <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                            <p style={{fontSize: 11, textAlign: 'left', minWidth: 150}}> {element.machineData && element.machineData.type} {element.machineData && element.machineData.model} </p>
                                                        </Grid>
                                                        <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                            <p style={{fontSize: 11, textAlign: 'left', minWidth: 70}}> {element.progress ? `${element.progress}%` : 'S/I'} </p>
                                                        </Grid>
                                                        <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                            <p style={{fontSize: 11, textAlign: 'center', minWidth: 70}}> N°: {element.machineData && element.machineData.equ} </p>
                                                        </Grid>
                                                        <Grid item xl={1} lg={1} md={1} sm={1} xs={1} style={{width: '100%', textAlign: 'right', paddingRight: 0}}>
                                                            <Button onClick={()=>{goToDetail(element)}} color='primary' style={{borderRadius: 30, paddingRight: 0}}>
                                                                <p style={{margin:0}}>{
                                                                    (!isOperator && element.level && (element.level > 0))
                                                                    ? 
                                                                    'Ver'
                                                                    : 
                                                                    ((isOperator && ((element.usersAssigned && (element.usersAssigned[0] && (element.usersAssigned[0]._id === userData._id))) )) ? (element.readyToSend ? 'Listo a enviar' : 'Ejecutar') : 'Ver')
                                                                }</p>
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </div>
                                            )
                                        })
                                    }
                                    {/* {
                                    (isChiefMachinery || isShiftManager) &&
                                        <div
                                            style={{
                                                width: '100%'
                                            }}
                                        >
                                            <h3 className='item-style'>Mis actividades pendientes</h3>
                                            {priorityAssignments.sort(compareNumbers).map((element, i) => {
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
                                                            <Grid item xl={'auto'} lg={'auto'} md={'auto'}>
                                                                <div style={{textAlign: 'center', minWidth: 100}}>
                                                                    <p style={{fontSize: 11}}>{element.sapId}</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                                <div style={{width: '100%', textAlign: 'left'}}>
                                                                    <p style={{fontSize: 11, minWidth: 170}}>{date(element.datePrev)}</p>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                                <p style={{fontSize: 11, minWidth: 170}}>{date(element.dateInit)}</p>
                                                            </Grid>
                                                            { !isSmall && <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                                <p style={{fontSize: 11, minWidth: 170}}> {date(element.endPrev)} </p>
                                                            </Grid>}
                                                            { !isSmall && <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                                <p style={{fontSize: 11, minWidth: 170}}> {date(element.endReport)} </p>
                                                            </Grid>}
                                                            <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                                <p style={{fontSize: 11, textAlign: 'left', minWidth: 150}}> {element.machineData && element.machineData.type} {element.machineData && element.machineData.model} </p>
                                                            </Grid>
                                                            <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                                <p style={{fontSize: 11, textAlign: 'left', minWidth: 70}}> {element.progress ? `${element.progress}%` : 'S/I'} </p>
                                                            </Grid>
                                                            <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                                <p style={{fontSize: 11, textAlign: 'center', minWidth: 70}}> N°: {element.machineData && element.machineData.equ} </p>
                                                            </Grid>
                                                            <Grid item xl={1} lg={1} md={1} sm={1} xs={1} style={{width: '100%', textAlign: 'right', paddingRight: 0}}>
                                                                <Button onClick={()=>{goToDetail(element)}} color='primary' style={{borderRadius: 30}}>Ver</Button>
                                                            </Grid>
                                                        </Grid>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    } */}
                                    {/* {(isChiefMachinery || isShiftManager || isSapExecutive || isOperator || admin) &&
                                        <div
                                            style={{
                                                width: '100%'
                                            }}
                                        >
                                            {
                                                (listadoReportes.length === 0 && showList)
                                                &&
                                                <div>
                                                    <p>Sin asignaciones</p>
                                                </div>
                                            }
                                            {
                                                listadoReportes.sort(compareNumbers).map((element, i) => {
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
                                                                <Grid item xl={'auto'} lg={'auto'} md={'auto'}>
                                                                    <div style={{textAlign: 'center', minWidth: 100}}>
                                                                        <p style={{fontSize: 11}}>{element.sapId}</p>
                                                                    </div>
                                                                </Grid>
                                                                <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                                    <div style={{width: '100%', textAlign: 'left'}}>
                                                                        <p style={{fontSize: 11, minWidth: 170}}>{date(element.datePrev)}</p>
                                                                    </div>
                                                                </Grid>
                                                                <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                                    <p style={{fontSize: 11, minWidth: 170}}>{date(element.dateInit)}</p>
                                                                </Grid>
                                                                { !isSmall && <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                                    <p style={{fontSize: 11, minWidth: 170}}> {date(element.endPrev)} </p>
                                                                </Grid>}
                                                                {!isSmall && <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                                    <div style={{width: '100%', textAlign: 'left'}}>
                                                                        <p style={{fontSize: 11, minWidth: 170}}>{date(element.endReport)}</p>
                                                                    </div>
                                                                </Grid>}
                                                                <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                                    <p style={{fontSize: 11, textAlign: 'left', minWidth: 150}}> {element.machineData && element.machineData.type} {element.machineData && element.machineData.model} </p>
                                                                </Grid>
                                                                <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                                    <p style={{fontSize: 11, textAlign: 'left', minWidth: 70}}> {element.progress ? `${element.progress}%` : 'S/I'} </p>
                                                                </Grid>
                                                                <Grid item xl={'auto'} lg={'auto'} md={'auto'} sm={'auto'} xs={'auto'}>
                                                                    <p style={{fontSize: 11, textAlign: 'center', minWidth: 70}}> N°: {element.machineData && element.machineData.equ} </p>
                                                                </Grid>
                                                                <Grid item xl={1} lg={1} md={1} sm={1} xs={1} style={{width: '100%', textAlign: 'right', paddingRight: 0}}>
                                                                    <Button onClick={()=>{goToDetail(element)}} color='primary' style={{borderRadius: 30, paddingRight: 0}}>
                                                                        <p style={{margin:0}}>{
                                                                            (!isOperator && element.level && (element.level > 0))
                                                                            ? 
                                                                            'Ver'
                                                                            : 
                                                                            ((isOperator && ((element.usersAssigned && (element.usersAssigned[0] && (element.usersAssigned[0]._id === userData._id))) )) ? (element.readyToSend ? 'Listo a enviar' : 'Ejecutar') : 'Ver')
                                                                        }</p>
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    } */}
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