
import { useState, useEffect } from 'react';
import { useStylesTheme } from '../../config';
import { 
    Box, 
    Grid, 
    Card,
    Toolbar, 
    IconButton,
    FormControl,
    Switch
} from '@mui/material'
import { ArrowBackIos } from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom';
import { trucksDatabase, pautasDatabase, machinesDatabase, sitesDatabase } from '../../indexedDB'
import { patternsRoutes, reportsRoutes } from '../../routes';
import './reports.css'
import {useAuth, useReportsContext, useSitesContext} from '../../context'
import { LoadingLogoDialog } from '../../dialogs';

const CreateReports = () => {
    const {userData, admin} = useAuth()
    const {pautas, createReport} = useReportsContext()
    const {sitesToSelection} = useSitesContext()
    const [ trucks, setTrucks ] = useState([])
    const [ pautasParaMostrar, setPautas ] = useState([])
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
    const [ dateEnd, setDateEnd ] = useState('');
    const [ hourMeter, setHourMeter ] = useState('')
    const [ equID, setEqID ] = useState('')
    const [ toDay, setToDay ] = useState('')
    const [ sapId, setSapId ] = useState('')
    const [ iDPM, setIDPM ] = useState('')
    const [ isTest, setIsTest ] = useState(false)
    const [ idObra, setIdObra ] = useState('')
    const [ sites, setSites ] = useState([])
    const [openLoadingLogo, setOpenLoadingLogo] = useState(false)
    const classes = useStylesTheme();
    const navigate = useNavigate();
    const {id} = useParams();

    useEffect(() => {
        if(machineSelected) {
            setPautas([])
            const machineCache = JSON.parse(machineSelected)
            getPautas(machineCache)
        }
    }, [machineSelected])

    const getPautas = async (machineCache) => {
        let idpm;
        if (reportType==='Inspección') {
            idpm = machineCache.idpminspeccion
        } else {
            idpm = machineCache.idpmmantencion
        }
        setIDPM(idpm)
        const response = await patternsRoutes.getPatternsDetailByIdpm(idpm)
        setPautas(response.data.data)
    }

    const orderType = (a, b) => {
        if (a.idpm > b.idpm) return 1
        if (a.idpm < b.idpm) return -1
        if (a.typepm > b.typepm) return 1
        if (a.typepm < b.typepm) return -1
    }

    useEffect(() => {
        if (machineModel) {
            getMachine(machineModel)
        }
    }, [machineModel])
    
    const saveReportData = async (activate) => {
        /* if(activate) {
            setDisablePautas(true)
            setChanged(true)
            let pautasLista = pautas.filter((item, i) => {
                if (item.header != 'error')
                if(((item.header[3].typeDataDesc === machineModel)||(item.header[2].typeDataDesc === machineModel)||(item.header[5].typeDataDesc === machineModel))) {
                    return item 
                }})
            setPautas(pautasLista)
            setTimeout(() => {
                setDisablePautas(false)
                setChanged(false)
            }, 500);
        } */
    }

    const settingTypePauta = (type) => {
        setPautaIndex(type)
    }

    const settingTypePautaWithReturn = (type) => {
        if(type === 'Inspección') {
            return 'PI'
        }else if(type === 'Mantención') {
            return 'PM'
        }
    }

    const getMachine = async (machineModel) => {
        setMachineModel(machineModel);
        let db = await machinesDatabase.initDbMachines();
        if(db) {
            const response = await machinesDatabase.consultar(db.database)
            const machinesFiltered = await response.filter((machine) => {if ((machine.model === machineModel)&&(machine.idobra === idObra )) return machine})
            setMaquinas(machinesFiltered)
        }
    }

    const saveReport = async () => {
        setOpenLoadingLogo(true)
        let report = {
            createdBy: userData._id,
            updatedBy: userData._id,
            state: 'Asignar',
            datePrev: Date.parse(date),
            endPrev: Date.parse(dateEnd),
            /* machine: truckSelected, */
            guide: pauta,
            reportType: reportType,
            machine: JSON.parse(machineSelected).equid,
            site: idObra,
            sapId: sapId,
            idPm: iDPM,
            testMode: isTest
        }
        if(!report.machine || !report.sapId || (!report.guide || report.guide === "Selección no cuenta con pautas.") || (!report.reportType || report.reportType === 'Seleccione...')) {
            alert('Falta información')
            setOpenLoadingLogo(false)
        }else{
            createReport(report, setOpenLoadingLogo)
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
            site: idObra/* JSON.parse(localStorage.getItem('sitio')).idobra */
        }
        if(!report.machine || (!report.guide || report.guide === "Selección no cuenta con pautas.") || (!report.reportType || report.reportType === 'Seleccione...')) {
            alert('Falta información')
        }else{
            let reportState = await reportsRoutes.editReport(report);
            if(reportState) {
                alert(`Reporte ${reportState.data.idIndex}, para máquina modelo ${reportState.data.machine} editado satisfactoriamente.`)
                navigate(-1);
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
        let reports = await reportsRoutes.getTotalReportsToIndex();
        setIdIndex(reports.data)
    }

    useEffect(() => {
        readReports()
        /* let isAdminCache = false
        const role = (localStorage.getItem('role') === 'undefined') ? null : localStorage.getItem('role')
        const roles = JSON.parse(localStorage.getItem('roles')) */
        /* if (role) {
            if (role === 'superAdmin' || role === 'admin') {
                isAdminCache = true
            }
        } else {
            
        } */
        if (admin) {
            sitesDatabase.initDbObras()
            .then(async db => {
                let respuestaConsulta = await sitesDatabase.consultar(db.database);
                setSites(respuestaConsulta);
            })
        } else {
            setIdObra(userData.obras[0].idobra)
        }
        /* setIsAdmin(isAdminCache) */
        readTrucks()
        /* activateIfEdit(id) */
        formatDateToDay()
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

    /* const activateIfEdit = async (id) => {
        const pautasData = await readPautas();
        console.log(pautasData)
        if((id)) {
            console.log(id)
            const report = JSON.parse(id);
            let pIndex = settingTypePautaWithReturn(report.reportType);
            setPautaIndex(pIndex)
            setIdIndex(report.idIndex);
            const newDate = report.datePrev.toString().replace('T00:00:00.000Z', '')
            setDate(newDate)
            setReportType(report.reportType);
            settingTypePauta(report.reportType);
            setDisableMaquinas(false);
            if(navigator.onLine) {
                apiIvcRoutes.getPautas().then(data => {
                })
            }
            let db = await machinesDatabase.initDbMachines();
            let list = await machinesDatabase.consultar(db.database)
            let listaMaquinas = new Array();
            listaMaquinas = list;
            console.log(listaMaquinas)
            let machine = listaMaquinas.filter((machine) => {if(machine.equid === report.machine) { return machine } });
            setMachineModel(machine[0].model);
            let pautasLista = pautasData.filter((item, i) => {if((item.header[3].typeDataDesc === machine[0].model) && (item.action === report.reportType) ) { return item }})
            setPautas(pautasLista);
            if(!report.guide.testMode) {
                report.guide.testMode = false
            }
            setPauta(report.guide);
            setDisablePautas(false);
            let machinesList = listaMaquinas.filter((m) => {if(m.model === machine[0].model) { return machine } });
            const machineFromDb = await apiIvcRoutes.getMachineByEquid(machine[0].equid);
            setHourMeter((Number(machineFromDb.data[0].hourMeter))/3600000);
            setEqID(machine[0].equid);
            console.log(machinesList)
            setMaquinas(machinesList);
            setTruck(machine[0].model);
            setMachineSelected(JSON.stringify(machine[0]));
        }else{
            readReports();
        }
    } */

    const deleteReport = () => {
        if(id) {
            if(confirm('Se borrará el reporte permanentemente. ¿Desea continuar?')) {
                reportsRoutes.deleteReport(JSON.parse(id)._id).then(res=>{
                    alert('Reporte eliminado.')
                    navigate(-1);
                })
            }
        }
    }

    return(
        <Box height='100%'>
            <Grid className='root' container spacing={0}>
                <Grid className={classes.pageContainer} item xs={12}>
                    <Card elevation={0} className={'pageCard'} >
                        <Grid container alignItems='center' justifyContent='center'>
                            <div className='navigation-bar' /* style={{width: '100%', textAlign: 'left' }} */>
                                <div style={{width: '100%', textAlign: 'left', color: '#333', backgroundColor: '#fff', borderRadius: 20}}>
                                    <Toolbar style={{paddingLeft: 0, backgroundColor: '#F9F9F9', borderRadius: 10}}>
                                        <IconButton onClick={() => setTimeout(() => {
                                            navigate(-1)
                                        }, 500)}>
                                            <ArrowBackIos style={{color: '#333', fontSize: 16}}/> 
                                        </IconButton>
                                        <h1 style={{marginTop: 0, marginBottom: 0, fontSize: 16}}>
                                            {
                                                id && 'Ordenes / Editar orden de trabajo'
                                            }
                                            {
                                                !id && 'Ordenes / Crear nueva orden de trabajo'
                                            }
                                        </h1>
                                    </Toolbar>
                                </div>
                            </div>
                            <Grid container>
                                <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                                    {admin && <div style={{width: '100%'}}>
                                        <FormControl >
                                            <p style={{margin: 5}}>Seleccionar Obra</p>
                                            <select 
                                                onBlur={()=>saveReportData(true)}
                                                className={classes.inputsStyle} 
                                                name="userType" 
                                                id="userType" 
                                                style={{width: '100%', minWidth: 250, height: 44, borderRadius: 10, fontSize: 20}}
                                                onChange={(e)=> {setIdObra(e.target.value)}}
                                                value={idObra}
                                            >
                                                <option>Seleccione...</option>
                                                {
                                                    (sitesToSelection.length > 0) && sitesToSelection.map((site, index) => {
                                                        return(
                                                            <option key={index} value={site.idobra}>{site.descripcion}</option>
                                                        )
                                                    })
                                                } 
                                            </select>
                                        </FormControl>
                                    </div>}
                                    <div style={{width: '100%'}}>
                                        <FormControl>
                                            <p style={{margin: 5}}>N° OT</p>
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
                                            <p style={{margin: 5}}>ID SAP</p>
                                            <input 
                                            value={sapId} 
                                            onChange={(e)=>{setSapId(e.target.value)}} 
                                            maxLength={12} 
                                            onBlur={()=>saveReportData()} 
                                            className={classes.inputsStyle} 
                                            type="text"
                                            style={{width: "100%", height: 44, borderRadius: 10, fontSize: 20}} />
                                        </FormControl>
                                    </div>
                                    <div style={{width: '100%'}}>
                                        <FormControl>
                                            <p style={{margin: 5}}>Fecha Inicio Programado</p>
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
                                            <p style={{margin: 5}}>Fecha Término Programado</p>
                                            <input 
                                            value={dateEnd} 
                                            onChange={(e)=>{setDateEnd(e.target.value)}} 
                                            maxLength={12} 
                                            onBlur={()=>saveReportData()} 
                                            className={classes.inputsStyle} 
                                            type="date"
                                            min={date}
                                            disabled={!date}
                                            style={{width: "100%", height: 44, borderRadius: 10, fontSize: 20}} />
                                        </FormControl>
                                    </div>
                                    <div style={{width: '100%'}}>
                                    <p style={{margin: 5}}>Seleccionar tipo de reporte</p>
                                        <FormControl>
                                            <select 
                                                /* onBlur={()=>saveReportData(true)} */
                                                className={classes.inputsStyle} 
                                                name="userType" 
                                                id="userType" 
                                                style={{width: '100%', minWidth: 250, height: 44, borderRadius: 10, fontSize: 20}}
                                                onChange={(e)=> {setReportType(e.target.value); settingTypePauta(e.target.value)}}
                                                value={reportType}
                                                >
                                                <option>Seleccione...</option>  
                                                <option>Inspección</option>
                                                <option>Mantención</option>
                                            </select>
                                        </FormControl>
                                    </div>
                                    <div style={{width: '100%'}}>
                                        <FormControl >
                                            <p style={{margin: 5}}>Seleccionar modelo de máquina</p>
                                            <select 
                                                /* onBlur={()=>saveReportData(true)} */
                                                className={classes.inputsStyle} 
                                                name="userType" 
                                                id="userType" 
                                                style={{width: '100%', minWidth: 250, height: 44, borderRadius: 10, fontSize: 20}}
                                                onChange={(e)=> {setTruck(e.target.value); setDisableMaquinas(false); getMachine(e.target.value);}}
                                                value={truckSelected}
                                            >
                                                <option>Seleccione...</option>
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
                                <Grid item xl={6} lg={6} md={6} sm={12} xs={12} >
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
                                                onChange={(e)=> { if(e.target.value === 'init') {setHourMeter(''); setEqID(''); setMachineSelected('')} else{setMachineSelected(e.target.value); setEqID(JSON.parse(e.target.value).equid); setHourMeter((JSON.parse(e.target.value).hourMeter / 3600000))} }}
                                                value={machineSelected}
                                                defaultValue={'init'}
                                            >
                                                <option value={'init'} selected>Seleccione...</option>
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
                                            <p>SPM</p>
                                            <input disabled value={iDPM ? iDPM : 'SIN SPM'} maxLength={12} onBlur={()=>saveReportData()} className={classes.inputsStyle} type="text" style={{width: "100%", height: 44, borderRadius: 10, fontSize: 20}} />
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
                                    <br />
                                    <div style={{width: '100%'}}>
                                        <FormControl >
                                            <p style={{margin: 0}}>Seleccionar Pauta  {(disablePautas && changed) && <b>ESPERE...</b>}</p>
                                            <select 
                                                disabled={(pautasParaMostrar.length === 0) ? true : false}
                                                /* onBlur={()=>saveReportData()}  */
                                                className={classes.inputsStyle} 
                                                name="userType" 
                                                id="userType" 
                                                style={{width: '100%', minWidth: 250, height: 44, borderRadius: 10, fontSize: 20}}
                                                onChange={(e)=>{setPauta(e.target.value)}}
                                                value={pauta}
                                            >
                                                <option>Seleccione...</option>
                                                {
                                                    (pautasParaMostrar.length > 0) && pautasParaMostrar.map((pauta, index) => {
                                                        return(
                                                            <option key={index} value={[pauta.typepm]}> {(pauta.idpm === 'SPM000787') ? 'Motor LMR' : 'Motor Estándar'} - {pauta.typepm} / {pauta.header[1].typeDataDesc} {pauta.zone === 'Genérico' ? '' : `${[pauta.zone]}`} </option>
                                                        )
                                                    })
                                                }
                                                {
                                                    (pautasParaMostrar.length == 0) && <option> Selección no cuenta con pautas. </option>
                                                } 
                                            </select>
                                        </FormControl>
                                    </div>
                                    <div style={{width: '100%'}}>
                                        <p>Test: <Switch checked={isTest} onChange={(e) => setIsTest(e.target.checked)}/></p>
                                    </div>
                                </Grid>
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
                                        id && <button onClick={()=>deleteReport()} style={{width: 189, height: 48, marginRight: 17, borderRadius: 23, fontSize: 20, color: '#fff',  backgroundColor: '#BB2D2D', borderColor: '#BB2D2D'}}>
                                            Borrar reporte
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
            <LoadingLogoDialog open={openLoadingLogo} />
        </Box>
    )

}

export default CreateReports