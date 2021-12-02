import { Search, Box, Grid, Card, Toolbar, IconButton, ListItem, FormControl, InputLabel, Select, MenuItem  } from "@material-ui/core";
import { ArrowBackIos } from '@material-ui/icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom';
import { useState, useEffect, } from "react";
import { pmsDatabase, trucksDatabase } from '../../indexedDB';
import { useStylesTheme } from '../../config'
import { useHistory } from "react-router";
import { Network } from '../../connections';
import { apiIvcRoutes } from '../../routes';
import { faArrowRight, faChevronRight, faEye } from "@fortawesome/free-solid-svg-icons";

const PmsPage = () => {
    const classes = useStylesTheme();
    const history = useHistory();
    const [ pmList, setPmList ] = useState([]);
    const [ machinesList, setMachineList ] = useState([]);
    const [ pType, setAge] = useState('');
    const [ idProgram, toProgram ] = useState()

    const handleChange = (event) => {
        setAge(event.target.value);
    };

    /* const getIdProgram = (id) => {
        history.push(`pauta-detail/${id}`)
    } */

    useEffect(() => {
        readData();
    },[])

    const readData = async () => {
        console.log('Hello!!!!')
        const networkDetect = await Network.detectNetwork();
        console.log(networkDetect);
        if(networkDetect) {
            const machines = await getMachines();
            trucksDatabase.initDbMachines()
            .then(async db => {
                machines.forEach(async (machine, index) => {
                    trucksDatabase.actualizar(machine, db.database);
                    if(index === (machines.length - 1)) {
                        let respuestaConsulta = await trucksDatabase.consultar(db.database);
                        setMachineList(respuestaConsulta)
                    }
                })
            })
        }else{
            let respuestaConsulta = await trucksDatabase.consultar(db.database);
            setMachineList(respuestaConsulta) 
        }
    }

    const getMachines = () => {
        return new Promise(resolve => {
            apiIvcRoutes.getMachines()
            .then(data => {
                console.log(data.data)
                resolve(data.data)
            })
            .catch(err => {
                console.log('Error', err)
            })
        })
    }
    useEffect(() => {
        pmsDatabase.initDbPMs().then(db => {
            pmsDatabase.consultar(db.database).then(data => {
                console.log(data)
                setPmList(data);
            })
        })
        
    }, []);

    return (
        <Box>
            <Grid className={classes.pageRoot} container spacing={0}>
                <Grid className={classes.pageContainer} item xs={12}>
                    <Card className={classes.pageCard}>
                        <Grid container alignItems='center' justifyContent='center'>
                            <div style={{width: '100%', textAlign: 'left', padding: 10 }}>
                                <div style={{width: '100%', textAlign: 'left', color: '#333', backgroundColor: '#fff', borderRadius: 20 }}>
                                    <div style={{paddingLeft: 0, }}>
                                        <Toolbar style={{paddingLeft: 0, width: '100%', backgroundColor: '#F9F9F9', borderRadius: 10,}}>
                                            <IconButton onClick={() => setTimeout(() => {
                                                history.goBack()
                                            }, 500)}> 
                                                <ArrowBackIos style={{color: '#333', fontSize: 16}} /> 
                                            </IconButton> 
                                            <p style={{marginTop: 0, marginBottom: 0, fontSize: 16}}> 
                                                Listado Pautas
                                            </p>
                                        </Toolbar>
                                        
                                    </div>
                                </div>
                            </div>
                            <Grid container item spacing={5} justifyContent='center'>
                                <div style={{marginLeft: '20px', width: '40%', float: 'left'}}>
                                    <FormControl fullWidth>
                                        <InputLabel >Tipo Máquina</InputLabel>
                                        <Select 
                                            id="demo-simple-select"
                                            value={pType}
                                            label="Tipo Máquina"
                                            onChange={handleChange}
                                        >
                                            {
                                                machinesList.map((item, number) => {
                                                    console.log(item)
                                                    return(
                                                        <MenuItem key={number} value={10}>
                                                            {item.type} {item.brand} {item.model}
                                                        </MenuItem>
                                                    )
                                                })
                                            }
                                        </Select>
                                    </FormControl>
                                </div>        
                                <div style={{marginLeft: '20px', width: '40%', float: 'right'}}>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Tipo Pauta</InputLabel>
                                        <Select
                                            id="demo-simple-select"
                                            value={pType}
                                            label="Tipo Pauta"
                                            onChange={handleChange}
                                        >
                                        <MenuItem value={10}>
                                            Inspección
                                        </MenuItem>
                                        <MenuItem value={10}>
                                            Mantención
                                        </MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                <Grid style={{margin: 20, height: '65vh', overflowY: 'scroll'}}>
                                
                                    <h2><strong>Pautas de Inspección</strong></h2>
                                {
                                    pmList.filter(a => {
                                        a.toString();
                                        if(a.data.typepm.includes('PI') ) {
                                            return a
                                        }
                                    }).map((pm) => {
                                        return (
                                            <ListItem key={pm.id} style={{width: '100%'}}>
                                                <div style={{width: '100%'}}>
                                                    <div>
                                                        <h3 style={{margin: 0}}>{pm.data.typepm} {pm.header[2].typeDataDesc} {pm.header[3].typeDataDesc}</h3>
                                                    </div>
                                                    <div>
                                                        <h4 style={{margin: 0}}>{pm.header[1].typeData}: {pm.header[1].typeDataDesc} {pm.data.idpm} {pm.header[4].typeData}: {pm.header[4].typeDataDesc}</h4>
                                                    </div>
                                                </div>
                                                <IconButton edge="end" component={Link} to={`/pauta-detail/${JSON.stringify(pm.id)}`} /* onClick={() => getIdProgram(pm.id)} */>
                                                    <FontAwesomeIcon icon={faChevronRight} />
                                                </IconButton>
                                            </ListItem>
                                        )
                                    })
                                }
                                    <h2><strong>Pautas de Mantenimiento</strong></h2>
                                {
                                    pmList.filter(a => {
                                        a.toString();
                                        if(a.data.typepm.includes('PM') ) {
                                            return a
                                        }
                                    }).map((pm) => {
                                        return (
                                            <ListItem key={pm.id} style={{width: '100%'}}>
                                                <div style={{width: '100%'}}>
                                                    <div>
                                                        <h3 style={{margin: 0}}>{pm.data.typepm} {pm.header[2].typeDataDesc} {pm.header[3].typeDataDesc}</h3>
                                                    </div>
                                                    <div>
                                                        <h4 style={{margin: 0}}>{pm.header[1].typeData}: {pm.header[1].typeDataDesc} {pm.data.idpm} {pm.header[4].typeData}: {pm.header[4].typeDataDesc}</h4>
                                                    </div>
                                                </div>
                                                <IconButton edge="end" component={Link} to={`/pauta-detail/${JSON.stringify(pm.id)}`}>
                                                    <FontAwesomeIcon icon={faChevronRight} />
                                                </IconButton>
                                            </ListItem>
                                        )
                                    })
                                }
                                </Grid>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

export default PmsPage