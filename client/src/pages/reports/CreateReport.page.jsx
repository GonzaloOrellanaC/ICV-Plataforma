
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
import { useHistory, useParams } from 'react-router-dom';
import { trucksDatabase, pautasDatabase, machinesDatabase } from '../../indexedDB'
import { apiIvcRoutes, reportsRoutes } from '../../routes';

const CreateReports = () => {

    const [ trucks, setTrucks ] = useState([])
    const [ pautas, setPautas ] = useState([])
    const [ maquinas, setMaquinas ] = useState([])
    const [ machineModel, setMachineModel ] = useState('')
    const [ pauta, setPauta ] = useState()
    const [ pautaIndex, setPautaIndex ] = useState()
    const [ reportType, setReportType ] = useState()
    const [ truckSelected, setTruck ] = useState()
    const [ machineSelected, setMachineSelected ] = useState()
    const [ disablePautas, setDisablePautas ] = useState(true);
    const [ changed, setChanged ] = useState(false);
    const [ disableMaquinas, setDisableMaquinas ] = useState(true);
    const [ idIndex, setIdIndex ] = useState(0);
    const [ date, setDate ] = useState('');
    const [ hourMeter, setHourMeter ] = useState('')
    const [ equID, setEqID ] = useState('')
    const [ toDay, setToDay ] = useState('')

    const classes = useStylesTheme();

    const history = useHistory();

    const {id} = useParams()

    const saveReportData = async (activate) => {
        if(activate) {
            setDisablePautas(true)
            setChanged(true)
            const pts = await readPautas();
            let pautasLista = pts.filter((item, i) => {if((item.header[3].typeDataDesc === machineModel) && (item.typepm.includes(pautaIndex)) ) {  return item }})
            setPautas(pautasLista)
            setTimeout(() => {
                setDisablePautas(false)
                setChanged(false)
            }, 500);
        }
    }

    const settingTypePauta = (type) => {
        if(type === 'Inspección') {
            setPautaIndex('PI')
        }else if(type === 'Mantención') {
            setPautaIndex('PM')
        }
    }

    const settingTypePautaWithReturn = (type) => {
        if(type === 'Inspección') {
            return 'PI'
        }else if(type === 'Mantención') {
            return 'PM'
        }
    }

    const getMachine = async (machineModel) => {
        setMachineModel(machineModel)
        let db = await machinesDatabase.initDbMachines();
        if(db) {
            machinesDatabase.consultar(db.database).then((machines) => {
                let m = new Array()
                m = machines.filter(machine => {if(machine.model === machineModel) {return machine}});
                const allMachines = m.sort((a, b) => {return Number(a.equ) - Number(b.equ)})
                setMaquinas(allMachines)
            })
        }
    }

    const saveReport = async () => {
        let report = {
            createdBy: localStorage.getItem('_id'),
            updatedBy: localStorage.getItem('_id'),
            state: 'Asignar',
            datePrev: Date.parse(date),
            machine: truckSelected,
            guide: pauta,
            reportType: reportType,
            machine: JSON.parse(machineSelected).equid,
            site: JSON.parse(localStorage.getItem('sitio')).idobra
        }
        if(!report.machine || (!report.guide || report.guide === "Selección no cuenta con pautas.") || (!report.reportType || report.reportType === 'Seleccione...')) {
            alert('Falta información')
        }else{
            let reportState = await reportsRoutes.createReport(report);
            if(reportState) {
                alert(`Reporte ${reportState.data.idIndex}, para máquina modelo ${reportState.data.machine} creado satisfactoriamente.`)
                history.goBack();
            }
        }
    }

    const editReport = async () => {
        let report = {
            idIndex: idIndex,
            updatedBy: localStorage.getItem('_id'),
            state: 'Asignar',
            datePrev: Date.parse(date),
            machine: truckSelected,
            guide: pauta,
            reportType: reportType,
            machine: JSON.parse(machineSelected).equid,
            site: JSON.parse(localStorage.getItem('sitio')).idobra
        }
        console.log(report)
        if(!report.machine || (!report.guide || report.guide === "Selección no cuenta con pautas.") || (!report.reportType || report.reportType === 'Seleccione...')) {
            alert('Falta información')
        }else{
            let reportState = await reportsRoutes.editReport(report);
            if(reportState) {
                alert(`Reporte ${reportState.data.idIndex}, para máquina modelo ${reportState.data.machine} editado satisfactoriamente.`)
                history.goBack();
            }
        }
    }

    const readTrucks = () => {
        trucksDatabase.initDbMachines().then(async res => {
            let respuestaConsulta = await trucksDatabase.consultar(res.database);
            setTrucks(respuestaConsulta);
        })
    }

    const readPautas = () => {
        return new Promise(resolve => {
            pautasDatabase.initDbPMs().then(async res => {
                let respuestaPautas = await pautasDatabase.consultar(res.database);
                resolve(respuestaPautas)
            })
        })
    }

    const habilitaPauta = () => {
        setDisablePautas(false)
    }

    const readReports = async () => {
        let reports = await reportsRoutes.getAllReports();
        setIdIndex(reports.data.length)
    }

    useEffect(() => {
        readTrucks();
        activateIfEdit(id);
        formatDateToDay();
    }, [])

    const formatDateToDay = () => { 
        let dtToday = new Date(Date.now());
    
        let month = dtToday.getMonth() + 1;
        let day = dtToday.getDate();
        let year = dtToday.getFullYear();
    
        if(month < 10)
            month = '0' + month.toString();
        if(day < 10)
            day = '0' + day.toString();
    
        let minDate = year + '-' + month + '-' + day;    
        setToDay(minDate)
    }

    const well = {
        height: 70,
        borderRadius: 10,
        boxShadow: '4px 4px 12px rgba(0, 0, 0, 0.08)'
    }

    const activateIfEdit = async (id) => {
        const pautasData = await readPautas();
        if((id)) {
            const report = JSON.parse(id);
            let pIndex = settingTypePautaWithReturn(report.reportType);
            setPautaIndex(pIndex)
            setIdIndex(report.idIndex);
            console.log(report.datePrev)
            const newDate = report.datePrev.toString().replace('T00:00:00.000Z', '')
            setDate(newDate)
            setReportType(report.reportType);
            settingTypePauta(report.reportType);
            setDisablePautas(false);
            setDisableMaquinas(false)
            machinesDatabase.initDbMachines().then(db => {
                if(db) {
                    machinesDatabase.consultar(db.database).then(async list => {
                        habilitaPauta();
                        let listaMaquinas = new Array();
                        listaMaquinas = list;
                        let machine = listaMaquinas.filter((machine) => {if(machine.equid === report.machine) { return machine } });
                        setMachineModel(machine[0].model)
                        let machinesList = listaMaquinas.filter((m) => {if(m.model === machine[0].model) { return machine } });
                        const p = pautasData.filter((item, i) => {if((item.header[3].typeDataDesc === machine[0].model) && (item.typepm.includes(pIndex)) ) {  return item }});
                        const machineFromDb = await apiIvcRoutes.getMachineByEquid(machine[0].equid);
                        setHourMeter((Number(machineFromDb.data[0].hourMeter))/3600000);
                        setEqID(machine[0].equid);
                        setMaquinas(machinesList);
                        setTruck(machine[0].model);
                        setMachineSelected(JSON.stringify(machine[0]));
                        setPautas(p);
                        setPauta(report.guide);
                        setMaquinas(machinesList);
                    })
                }
            })
        }else{
            readReports();
        }
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
                                            {
                                                id && 'Reportes / Editar reporte'
                                            }
                                            {
                                                !id && 'Reportes / Crear nuevo reporte'
                                            }
                                        </h1>
                                    </Toolbar>
                                </div>
                            </div>
                            <Grid item lg={6}>
                                <div style={{width: '100%'}}>
                                    <FormControl>
                                        <p>#ID</p>
                                        <input 
                                        disabled 
                                        value={idIndex} 
                                        maxLength={12} 
                                        onBlur={()=>saveReportData()} 
                                        className={classes.inputsStyle} 
                                        type="text" 
                                        style={{width: "100%", height: 44, borderRadius: 10, fontSize: 20}} />
                                    </FormControl>
                                </div>
                                <div style={{width: '100%'}}>
                                    <FormControl>
                                        <p>Fecha Prevista</p>
                                        <input 
                                        value={date} 
                                        onChange={(e)=>{setDate(e.target.value)}} 
                                        maxLength={12} 
                                        onBlur={()=>saveReportData()} 
                                        className={classes.inputsStyle} 
                                        type="date"
                                        min={toDay}
                                        style={{width: "100%", height: 44, borderRadius: 10, fontSize: 20}} />
                                    </FormControl>
                                </div>
                                <div style={{width: '100%'}}>
                                    <FormControl>
                                        <p>Seleccionar tipo de reporte</p>
                                        <select 
                                            onBlur={()=>saveReportData(true)}
                                            className={classes.inputsStyle} 
                                            name="userType" 
                                            id="userType" 
                                            style={{width: '100%', minWidth: 250, height: 44, borderRadius: 10, fontSize: 20}}
                                            onChange={(e)=> {setReportType(e.target.value); settingTypePauta(e.target.value)}}
                                            value={reportType}
                                        >
                                            <option value={null}>Seleccione...</option>
                                            <option>Inspección</option>
                                            <option>Mantención</option>
                                        </select>
                                    </FormControl>
                                </div>
                                <div style={{width: '100%'}}>
                                    <FormControl >
                                        <p>Seleccionar modelo de máquina</p>
                                        <select 
                                            onBlur={()=>saveReportData(true)}
                                            className={classes.inputsStyle} 
                                            name="userType" 
                                            id="userType" 
                                            style={{width: '100%', minWidth: 250, height: 44, borderRadius: 10, fontSize: 20}}
                                            onChange={(e)=> {setTruck(e.target.value); habilitaPauta(); getMachine(e.target.value);}}
                                            value={truckSelected}
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
                                
                            </Grid>
                            <Grid item lg={6}>
                                <div style={{width: '100%'}}>
                                    <FormControl >
                                        <p>Seleccionar Pauta  {(disablePautas && changed) && <b>ESPERE...</b>}</p>
                                        <select 
                                            disabled={disablePautas}
                                            onBlur={()=>saveReportData()} 
                                            className={classes.inputsStyle} 
                                            name="userType" 
                                            id="userType" 
                                            style={{width: '100%', minWidth: 250, height: 44, borderRadius: 10, fontSize: 20}}
                                            onChange={(e)=>{setPauta(e.target.value), setDisableMaquinas(false)}}
                                            value={pauta}
                                        >
                                            <option value={null}>Seleccione...</option>
                                                {
                                                    (pautas.length > 0) && pautas.map((pauta, index) => {
                                                        return(
                                                            <option key={index} value={pauta.typepm}> {pauta.idpm} - {pauta.typepm} / {pauta.header[1].typeDataDesc} </option>
                                                        )
                                                    })
                                                }
                                                {
                                                    (pautas.length == 0) && <option> Selección no cuenta con pautas. </option>
                                                }

                                            
                                        </select>
                                    </FormControl>
                                </div>
                                <div style={{width: '100%'}}>
                                    <FormControl >
                                        <p>Seleccionar máquina de obra</p>
                                        <select 
                                            onBlur={()=>saveReportData()} 
                                            className={classes.inputsStyle} 
                                            disabled={disableMaquinas}
                                            name="userType" 
                                            id="userType" 
                                            style={{width: '100%', minWidth: 250, height: 44, borderRadius: 10, fontSize: 20}}
                                            onChange={(e)=> { if(e.target.value === 'no-select') {setHourMeter(''); setEqID(''); setMachineSelected('')} else{setMachineSelected(e.target.value); setEqID(JSON.parse(e.target.value).equid); setHourMeter((JSON.parse(e.target.value).hourMeter / 3600000))} }}
                                            value={machineSelected}
                                        >
                                            <option value={'no-select'}>Seleccione...</option>
                                            {
                                                maquinas.sort((a, b) => {return Number(a.equ) - Number(b.equ)}).map((maquina, index) => {
                                                    return(
                                                        <option key={index} value={JSON.stringify(maquina)}> {maquina.equ} / {maquina.type} {maquina.brand} - {maquina.model} </option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </FormControl>
                                </div>
                                <div style={{width: '100%'}}>
                                    <FormControl>
                                        <p>Horas de operación</p>
                                        <input disabled value={hourMeter} maxLength={12} onBlur={()=>saveReportData()} className={classes.inputsStyle} type="text" style={{width: "100%", height: 44, borderRadius: 10, fontSize: 20}} />
                                    </FormControl>
                                </div>
                                <div style={{width: '100%'}}>
                                    <FormControl>
                                        <p>Equipo ID</p>
                                        <input disabled value={equID} maxLength={12} onBlur={()=>saveReportData()} className={classes.inputsStyle} type="text" style={{width: "100%", height: 44, borderRadius: 10, fontSize: 20}} />
                                    </FormControl>
                                </div>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item lg={6} md={6} sm={false} xs={false}>

                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                <div style={{width: "100%", paddingTop: 30, textAlign: 'center'}}>
                                    {
                                        id && <button onClick={()=>editReport()} style={{width: 189, height: 48, marginRight: 17, borderRadius: 23, fontSize: 20, color: '#fff',  backgroundColor: '#BB2D2D', borderColor: '#BB2D2D'}}>
                                            Editar reporte
                                        </button>
                                    }
                                    {
                                        !id && <button onClick={()=>saveReport()} style={{width: 189, height: 48, marginRight: 17, borderRadius: 23, fontSize: 20, color: '#fff',  backgroundColor: '#BB2D2D', borderColor: '#BB2D2D'}}>
                                            Agregar reporte
                                        </button>
                                    }
                                    
                                </div> 
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )

}

export default CreateReports