import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Box, Card, Grid, makeStyles, Modal, Button, IconButton, Fab, Toolbar, LinearProgress } from '@material-ui/core'
import { Close, ArrowBackIos } from '@material-ui/icons'
import { useParams } from "react-router-dom";
import { useStylesTheme } from '../../config'
import { useHistory } from 'react-router-dom'
import { pautasDatabase, reportsDatabase } from '../../indexedDB';
import { MVAvatar, PautaDetail } from '../../containers';

const AppliancePage = ({ route }) => {
    const classes = useStylesTheme();
    const [open, setOpen] = useState(false);
    const [ pauta, setPauta ] = useState();
    const [ reportLocatioToPublish, setReportLocatioToPublish ] = useState('');
    const [ progress, setProgress ] = useState(0)
    let { id } = useParams();
    const machine = JSON.parse(id);
    const machineData = JSON.parse(machine.machineData);
    let r = new String();
    r = route.toString();
    let pautaType = new String();
    if(r.includes('inspection')) {
        pautaType = 'PI'
    }else if(r.includes('maintenance')) {
        pautaType = 'PM'
    }
    if(!machineData.info) {
        machineData.info = 'Sin información.'
    }
    if(!machineData.lastMant) {
        machineData.lastMant = 'Sin información'
    }
    if(!machineData.lastOper) {
        machineData.lastOper = 'Sin información'
    }
    const machineTo3D = {
        id: machine.id, 
        brand: machine.brand, 
        model: machine.model, 
        pIDPM: machine.pIDPM, 
        type: machine.type
    }

    const openCloseModal = () => {
        setTimeout(() => {
            setOpen(!open);
        }, 500);
    }

    useEffect( () => {
        reportsDatabase.initDbReports().then(async db => {
            let reports = new Array();
            reports = await reportsDatabase.consultar(db.database);
            pautasDatabase.initDbPMs().then(async database => {
                let pautas = new Array();
                pautas = await pautasDatabase.consultar(database.database);
                reports.forEach((report, i) => {
                    if(machineData.equid === report.machine) {
                        if(pautas.length > 0) {
                            pautas.forEach((pauta, n) => {
                                if(pauta.typepm === report.guide) {
                                    if(pauta.typepm.includes(pautaType)) {
                                        setPauta(pauta)
                                    }
                                }
                            })
                        }
                    }
                })
            })
        })
        
    }, [])

    let site = JSON.parse(localStorage.getItem('sitio')).descripcion;

    const history = useHistory()

    if(!site) {
        history.goBack()
    }

    let routeData;

    if(route === 'inspection/machine-detail') {
        routeData = 'Inspección'
    }else if(route === 'maintenance/machine-detail') {
        routeData = 'Mantención'
    }

    const setReportLocation = (location) => {
        setReportLocatioToPublish(location)
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
                                        <p style={{marginTop: 0, marginBottom: 0, fontSize: 16}}>
                                            {routeData}/{site}/{machine.type} {machine.brand} {machine.model}/Número interno: <b>{machineData.equ}</b>
                                        </p>
                                    </Toolbar>
                                </div>
                            </div>
                            <Grid container>
                                <Grid item xl={2} lg={4}>
                                    <div style={{width: '100%', textAlign: 'left', padding: 10}}>
                                        <div style={{padding: 15, borderTopLeftRadius: 20, borderEndStartRadius: 20, backgroundColor: '#F9F9F9', borderRadius: 10, minHeight: 400}}>
                                            <h3 style={{marginTop: 5, marginBottom: 5}}>{machine.type}</h3>
                                            <div style={{position: 'relative', zIndex: '1', width: '100%', height: 180, backgroundColor: 'transparent', textAlign: 'center'}}>
                                                <img src={`/assets/${machine.model}.png`} height={'100%'} />
                                            </div>
                                            <div style={{width: '100%'}}>
                                                <p style={{marginTop: 5, marginBottom: 5}}><b>Marca: </b> {machine.brand} </p>
                                            </div>
                                            <div style={{width: '100%'}}>
                                                <p style={{marginTop: 5, marginBottom: 5}}><b>Modelo: </b> {machine.model} </p>
                                            </div>
                                            <div style={{width: '100%'}}>
                                                <p style={{marginTop: 5, marginBottom: 5}}><b>Código: </b> {machineData.id} </p>
                                            </div>
                                            <div style={{width: '100%'}}>
                                                <p style={{marginTop: 5, marginBottom: 5}}><b>Horómetro Actual: </b> {(((machineData.hourMeter)/3600000).toFixed(2)).toString().replace('.', ',')} hrs </p>
                                            </div>
                                            <div style={{width: '100%'}}>
                                                <p style={{marginTop: 5, marginBottom: 5}}><b>Número Interno: </b> {machineData.equ} </p>
                                            </div>
                                            <div style={{width: '100%'}}>
                                                <p style={{marginTop: 5, marginBottom: 5}}><b>Información: </b> {machineData.info} </p>
                                            </div>
                                            <div style={{width: '100%'}}>
                                                <p style={{marginTop: 5, marginBottom: 5}}><b>Última Mantención: </b> {machineData.lastMant} </p>
                                            </div>
                                            <div style={{width: '100%'}}>
                                                <p style={{marginTop: 5, marginBottom: 5}}><b>Último Inspector: </b> {machineData.lastOper} </p>
                                            </div>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item xl={10} lg={8} style={{height: 'calc(100vh - 200px)', display: 'block'}}>
                                    <div style={{height: 'calc(100vh - 210px)', width: '100%', padding: 5}}>
                                        <div style={{height: '100%', padding: 5, borderEndEndRadius: 20, borderTopRightRadius: 20, backgroundColor: '#fff'}}>
                                            <Grid container>
                                                <Grid item lg={6} md={6}>
                                                    {pauta && <h2>Pauta de {(pautaType==='PM') && 'Mantención'} {(pautaType==='PI') && 'Inspección'} {pauta.typepm}</h2>}
                                                    {!pauta && <h2>Sin asignación.</h2>}
                                                </Grid>
                                                <Grid item lg={6} md={6}>
                                                    <div style={{float: 'left', width: '50%', textAlign: 'right'}}>
                                                        <p>{reportLocatioToPublish}</p>
                                                    </div>
                                                    <div style={{float: 'left', width: '30%', padding: 10}}>
                                                        <p><LinearProgress variant="determinate" value={progress} style={{width: '100%'}}/></p>
                                                    </div>
                                                    <div style={{float: 'left', width: '20%', padding: 5}}>
                                                        <p>{progress}%</p>
                                                    </div>
                                                </Grid>
                                            </Grid>
                                            {
                                                pauta && <PautaDetail height={'calc(100vh - 420px)'} pauta={pauta} setReportLocation={setReportLocation} />
                                            }
                                        </div>
                                        <div style={{position: 'relative', bottom: 20, width: '100%'}}>
                                            <div style={{float: 'left', width: '50%', textAlign: 'left'}}>
                                                <button onClick={openCloseModal} style={{color: '#BB2D2D', borderColor: '#BB2D2D', height: 48, width: 160, borderRadius: 23, borderWidth: 2, fontSize: 20}}>
                                                    <strong>Ver 3D</strong>
                                                </button>
                                            </div>
                                            <div style={{float: 'left', width: '50%', textAlign: 'right'}}>
                                                <button onClick={()=>{alert('En desarrollo')}} style={{borderColor: '#BB2D2D', backgroundColor: '#BB2D2D', color: '#fff', height: 48, width: 210, borderRadius: 23, borderWidth: 2, fontSize: 20}}>
                                                    Finalizar Jornada
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Grid>
                                <div>
                                    <Modal
                                        open={open}
                                        close={!open}
                                        aria-labelledby="modal-modal-title"
                                        aria-describedby="modal-modal-description"
                                    >
                                        <div style={{height: '100%', width: '100%', backgroundColor: '#333'}}>
                                            <MVAvatar machine={machineTo3D}/>
                                            <Fab onClick={openCloseModal} style={{position: 'absolute', right: 10, top: 10, boxShadow: 'none', backgroundColor: 'transparent'}}>
                                                <Close style={{color: '#ccc'}} />
                                            </Fab>
                                        </div>
                                        
                                    </Modal>
                                </div>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Box>
        
    )
}

AppliancePage.propTypes = {
    route: PropTypes.oneOf(['inspection/machine-detail', 'maintenance/machine-detail'])
}

export default AppliancePage
