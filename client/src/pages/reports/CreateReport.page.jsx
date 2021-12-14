
import { useState, useEffect } from 'react';
import { useStylesTheme } from '../../config';
import { 
    Box, 
    Grid, 
    Card,
    Toolbar, 
    IconButton,
    FormControl
} from '@material-ui/core'
import { ArrowBackIos } from '@material-ui/icons'
import { useHistory } from 'react-router-dom';
import { trucksDatabase, pmsDatabase } from '../../indexedDB'
import { reportsRoutes } from '../../routes';

const CreateReports = () => {

    const [ trucks, setTrucks ] = useState([])
    const [ pautas, setPautas ] = useState([])
    const [ pauta, setPauta ] = useState()
    const [ pautaIndex, setPautaIndex ] = useState()
    const [ reportType, setReportType ] = useState()
    const [ truckSelected, setTruck ] = useState()
    const [ disablePautas, setDisablePautas ] = useState(true);
    const [ idIndex, setIdIndex ] = useState(0);
    const [ date, setDate ] = useState('');

    const classes = useStylesTheme();

    const history = useHistory();

    const saveReportData = () => {
        
    }

    const settingTypePauta = (type) => {
        if(type === 'Inspección') {
            setPautaIndex('PI')
        }else if(type === 'Mantención') {
            setPautaIndex('PM')
        }
    }

    const saveReport = async () => {
        let report = {
            createdBy: localStorage.getItem('_id'),
            updatedBy: localStorage.getItem('_id'),
            state: 'Asignar',
            datePrev: date,
            machine: truckSelected,
            guide: pauta,
            reportType: reportType
        }
        if(!report.machine || !report.guide || !report.reportType) {
            alert('Falta información')
        }else{
            let reportState = await reportsRoutes.createReport(report);
            if(reportState) {
                alert(`Reporte ${reportState.data.idIndex}, para máquina modelo ${reportState.data.machine} creado satisfactoriamente.`)
                history.goBack();
            }
        }
        
    }

    const readTrucks = () => {
        trucksDatabase.initDbMachines().then(async res => {
            let respuestaConsulta = await trucksDatabase.consultar(res.database);
            setTrucks(respuestaConsulta);
            readPautas()
        })
    }

    const readPautas = () => {
        pmsDatabase.initDbPMs().then(async res => {
            let respuestaPautas = await pmsDatabase.consultar(res.database);
            setPautas(respuestaPautas)
        })
    }

    const habilitaPauta = () => {
        setDisablePautas(false)
    }

    const readReports = async () => {
        let reports = await reportsRoutes.getAllReports();
        console.log(reports.data);
        setIdIndex(reports.data.length)
    }

    useEffect(() => {
        readTrucks();
        readReports()
    }, [])

    const well = {
        height: 70,
        borderRadius: 10,
        boxShadow: '4px 4px 12px rgba(0, 0, 0, 0.08)'
    }

    return(
        <Box height='100%'>
            <Grid className={classes.pageRoot} container spacing={0}>
                <Grid className={classes.pageContainer} item xs={12}>
                    <Card className={classes.pageCard} >
                        <Grid container alignItems='center' justifyContent='center'>
                            <div style={{width: '100%', textAlign: 'left', padding: 10 }}>
                                <div style={{width: '100%', textAlign: 'left', color: '#333', backgroundColor: '#fff', borderRadius: 20}}>
                                    <Toolbar style={{paddingLeft: 0, backgroundColor: '#F9F9F9', borderRadius: 10}}>
                                        <IconButton onClick={() => setTimeout(() => {
                                            history.goBack()
                                        }, 500)}>
                                            <ArrowBackIos style={{color: '#333', fontSize: 16}}/> 
                                        </IconButton>
                                        <h1 style={{marginTop: 0, marginBottom: 0, fontSize: 16}}>
                                            Reportes / Crear nuevo reporte
                                        </h1>
                                    </Toolbar>
                                </div>
                            </div>
                            <div style={{float: 'left', width:"75%", marginRight: 10, marginTop: 0}}>
                                <div style={{width: '70vw', height: '12vh'}}>
                                    <div style={{float: 'left', marginRight: 10, width: 200}}>
                                        <FormControl>
                                            <p>#ID</p>
                                            <input disabled value={idIndex} maxLength={12} onBlur={()=>saveReportData()} className={classes.inputsStyle} type="text" style={{width: "100%", height: 44, borderRadius: 10, fontSize: 20}} />
                                        </FormControl>
                                    </div>
                                </div>
                                <div style={{width: '70vw', height: '12vh'}}>
                                    <div style={{float: 'left', marginRight: 10, width: 300}}>
                                        <FormControl>
                                            <p>Fecha Prevista</p>
                                            <input value={date} onChange={(e)=>{setDate(e.target.value)}} maxLength={12} onBlur={()=>saveReportData()} className={classes.inputsStyle} type="date" style={{width: "100%", height: 44, borderRadius: 10, fontSize: 20}} />
                                        </FormControl>
                                    </div>
                                </div>
                                <div style={{width: '70vw', height: '12vh'}}>
                                    <div style={{float: 'left'}}>
                                        <FormControl fullWidth>
                                            <p>Seleccionar tipo de reporte</p>
                                            <select 
                                                onBlur={()=>saveReportData()} 
                                                className={classes.inputsStyle} 
                                                name="userType" 
                                                id="userType" 
                                                style={{width: 400, height: 44, borderRadius: 10, fontSize: 20}}
                                                onChange={(e)=> {setReportType(e.target.value); settingTypePauta(e.target.value)}}
                                            >
                                            <option>Seleccione...</option>
                                            <option>Inspección</option>
                                            <option>Mantención</option>
                                                
                                            </select>
                                        </FormControl>
                                    </div>
                                </div>
                                <div style={{width: '70vw', height: '12vh'}}>
                                    <div style={{float: 'left'}}>
                                        <FormControl fullWidth>
                                            <p>Seleccionar máquina</p>
                                            <select 
                                                onBlur={()=>saveReportData()} 
                                                className={classes.inputsStyle} 
                                                name="userType" 
                                                id="userType" 
                                                style={{width: 400, height: 44, borderRadius: 10, fontSize: 20}}
                                                onChange={(e)=> {setTruck(e.target.value); habilitaPauta()}}
                                            >
                                                <option value={''}>Seleccione...</option>
                                                {
                                                    trucks.map((truck, index) => {
                                                        return(
                                                            <option key={index} value={truck.model}>{truck.type} {truck.brand} {truck.model}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </FormControl>
                                    </div>
                                </div>
                                <div style={{width: '70vw', height: '12vh'}}>
                                    <div style={{float: 'left'}}>
                                        <FormControl fullWidth>
                                            <p>Seleccionar Pauta</p>
                                            <select 
                                                disabled={disablePautas}
                                                onBlur={()=>saveReportData()} 
                                                className={classes.inputsStyle} 
                                                name="userType" 
                                                id="userType" 
                                                style={{width: 500, height: 44, borderRadius: 10, fontSize: 20}}
                                                onChange={(e)=>{setPauta(e.target.value)}}
                                            >
                                                <option value={null}>Seleccione...</option>
                                                {
                                                    //console.log(item.data.typepm.includes(pauta))
                                                }
                                                {
                                                    pautas.filter((item, i) => {if((item.header[3].typeDataDesc === truckSelected) && (item.data.typepm.includes(pautaIndex)) ) { /* console.log(item.data.typepm); console.log(pautaIndex); */ return item }}).map((pauta, index) => {
                                                        return(
                                                            <option key={index} value={pauta.data.typepm}> {pauta.data.idpm} - {pauta.data.typepm} / {pauta.header[1].typeDataDesc} </option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </FormControl>
                                    </div>
                                </div>            
                            </div>
                            <div style={{position: 'absolute', right: 40, bottom: 40}}>
                                <div style={{width: "100%"}}>
                                    <div style={{float: 'right'}}>
                                        <button onClick={()=>saveReport()} style={{width: 189, height: 48, marginRight: 17, borderRadius: 23, fontSize: 20, color: '#fff',  backgroundColor: '#BB2D2D', borderColor: '#BB2D2D'}}>
                                            Agregar reporte
                                        </button>
                                    </div>
                                </div> 
                            </div>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )

}

export default CreateReports