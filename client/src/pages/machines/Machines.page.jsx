import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Card, Grid, Toolbar, IconButton } from '@material-ui/core'
import { ArrowBackIos } from '@material-ui/icons'
import { useStylesTheme } from '../../config'
import { MachineButton } from '../../components/buttons'
import { useHistory } from 'react-router-dom'
import { useLanguage } from '../../context'
import { apiIvcRoutes } from '../../routes'
import { machinesImagesDatabase, trucksDatabase } from '../../indexedDB'
const MachinesPage = ({ route }) => {
    const classes = useStylesTheme()
    const { dictionary } = useLanguage();
    const [ machinesList, setMachineList ] = useState([]);

    useEffect(() => {
        readData();
    },[]);

    const readData = async () => {
        let dbMachinesImages = await machinesImagesDatabase.initDbMachinesImages();
        trucksDatabase.initDbMachines()
        .then(async db => {
            const respuestaConsulta = await trucksDatabase.consultar(db.database);
            if(respuestaConsulta) {
                for(let i = 0; i < respuestaConsulta.length; i++ ) {
                    let res = await machinesImagesDatabase.obtener(i, dbMachinesImages.database);
                    if(res) {
                        respuestaConsulta[i].image = res.data;
                    }
                    if(i == (respuestaConsulta.length - 1)) { 
                        console.log(respuestaConsulta)
                        setMachineList(respuestaConsulta)
                    }
                }
            }
        })
    }

    const getMachines = () => {
        return new Promise(resolve => {
            apiIvcRoutes.getMachines()
            .then(data => {
                resolve(data.data)
            })
            .catch(err => {
                console.log('Error', err)
            })
        })
    }

    let site
    const history = useHistory();

    if(localStorage.getItem('sitio')) {
        site = JSON.parse(localStorage.getItem('sitio')).descripcion;
    }else{
        history.replace('/')
    }

    let routeData;

    if(route === 'inspection') {
        routeData = 'Inspección'
    }else if(route === 'maintenance') {
        routeData = 'Mantención'
    }

    return (
        <Box height='90%'>
            <Grid className={classes.pageRoot} container spacing={0}>
                <Grid className={classes.pageContainer} item xs={12}>
                    <div className={classes.pageCard}>
                        <Grid container alignItems='flex-start' justifyContent='flex-start'>
                            <div style={{width: '100%', textAlign: 'left', padding: 10 }}>
                                <div style={{width: '100%', textAlign: 'left', color: '#333', backgroundColor: '#fff', borderRadius: 20 }}>
                                    <Toolbar style={{paddingLeft: 0, backgroundColor: '#F9F9F9', borderRadius: 10,}}>
                                        <IconButton onClick={() => setTimeout(() => {
                                            history.goBack()
                                        }, 500)}> 
                                            <ArrowBackIos style={{color: '#333', fontSize: 16}}/> 
                                        </IconButton> 
                                        <p style={{marginTop: 0, marginBottom: 0, fontSize: 16}}>
                                            {`${routeData}/${site}`}
                                        </p>
                                    </Toolbar>
                                </div>
                            </div>
                            <Grid container spacing={5} justifyContent='flex-start' style={{textAlign: 'center', height: '75vh', overflowY: 'auto'}}>
                                {
                                    machinesList/* .filter(a => a.toString()) */.map((machine) => {
                                        console.log(machine)
                                        return (
                                            <Grid item key={machine.id} style={{minWidth: '25%', margin: 10}}>
                                                <MachineButton machine={machine} image={machine.image} route={route}/>
                                            </Grid>
                                        )
                                    })
                                }
                            </Grid>
                        </Grid>
                    </div>
                </Grid>
            </Grid>
        </Box>
    )
}

MachinesPage.propTypes = {
    route: PropTypes.oneOf(['inspection', 'maintenance'])
}

export default MachinesPage
