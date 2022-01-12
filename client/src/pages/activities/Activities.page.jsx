import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Box, Card, Grid, Toolbar, IconButton, Button } from '@material-ui/core'
import { ArrowBackIos } from '@material-ui/icons'
import { date, useStylesTheme } from '../../config'
import { CardButton } from '../../components/buttons'
import { useHistory } from 'react-router-dom'
import { useLanguage } from '../../context'
import { machinesDatabase, reportsDatabase } from '../../indexedDB'

const ActivitiesPage = () => {
    const classes = useStylesTheme();
    const history = useHistory();

    const [ assignments, setAssignments ] = useState([]);

    useEffect(() => {
        getReports()
    }, [])

    const getReports = async () => {
        let db = await reportsDatabase.initDbReports();
        if(db) {
            const reports = await reportsDatabase.consultar(db.database);
            if(reports) {
                reports.forEach(async (report, i) => {
                    report.getMachine = await getMachineTypeByEquid(report.machine);
                    if(report.getMachine.model === 'PC5500') {
                        report.machineType = 'Pala'
                    }else if(report.getMachine.model === '793-F') {
                        report.machineType = 'Camión'
                    }
                    if(i == (reports.length - 1)) {
                        setAssignments(reports);
                    }
                })
                
            }
        }
    }

    const goToDetail = (element) => {
        history.push(`/activities/${JSON.stringify(element)}`)
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
                                <Grid container>
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
                                            <Grid item lg={1}>
                                                <div style={{width: '100%', textAlign: 'center'}}>
                                                <h2>Guía</h2>
                                                </div>
                                            </Grid>
                                            <Grid item lg={2}>
                                                <h2>Fecha de ejecución</h2>
                                            </Grid>
                                            <Grid item lg={1}>
                                                <h2>ID</h2>
                                            </Grid>
                                            <Grid item lg={3}>
                                                <h2>Máquina</h2>
                                            </Grid>
                                            <Grid item lg={2}>
                                                
                                            </Grid>
                                            <Grid item lg={3}>
                                                <div style={{width: '100%', textAlign: 'right', paddingRight: 20}}>
                                                    <h2>Acción</h2>
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
                                        element.dateFormat = date(element.datePrev);
                                        console.log(element)
                                        //element.machineType = await getMachineTypeByEquid(element.machine)
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
                                                    <Grid item lg={1}>
                                                        <div style={{width: '100%', textAlign: 'center'}}>
                                                        <h2>{element.guide}</h2>
                                                        </div>
                                                    </Grid>
                                                    <Grid item lg={2}>
                                                        <h4>{element.dateFormat}</h4>
                                                    </Grid>
                                                    <Grid item lg={1}>
                                                        <h4>{element.idIndex}</h4>
                                                    </Grid>
                                                    <Grid item lg={3}>
                                                        <h4> {element.machineType} {element.getMachine.model} Número interno: {element.getMachine.number} </h4>
                                                    </Grid>
                                                    <Grid item lg={2}>
                                                        
                                                    </Grid>
                                                    <Grid item lg={3}>
                                                        <div style={{width: '100%', textAlign: 'right', paddingRight: 20}}>
                                                            <Button onClick={()=>{goToDetail(element)}} color='primary' style={{borderRadius: 30}}>Ver</Button>
                                                        </div>
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