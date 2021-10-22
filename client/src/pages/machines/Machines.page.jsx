import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Card, Grid, Toolbar, IconButton } from '@material-ui/core'
import { ArrowBackIos } from '@material-ui/icons'
import { useStylesTheme } from '../../config'
import { MachineButton } from '../../components/buttons'
import { useHistory } from 'react-router-dom'
import { useLanguage } from '../../context'

const MachinesPage = ({ route }) => {
    const classes = useStylesTheme()
    const { dictionary } = useLanguage()
    const machinesList = [
        {
            id: 0,
            model: '793F',
            type: 'Camión',
            brand: 'Caterpillar'
        },
        {
            id: 1,
            model: 'PC5500',
            type: 'Pala',
            brand: 'Komatsu'
        }
    ]

    let site = localStorage.getItem('sitio');

    const history = useHistory()

    if(!site) {
        history.goBack()
    }


    let routeData;

    //console.log(route);

    if(route === 'inspection') {
        routeData = 'Inspección'
    }else if(route === 'maintenance') {
        routeData = 'Mantención'
    }

    return (
        <Box height='100%'>
            <Grid className={classes.pageRoot} container spacing={0}>
                <Grid className={classes.pageContainer} item xs={12}>
                    <Card className={classes.pageCard}>
                        <Grid container alignItems='center' justifyContent='center'>
                            <div style={{width: '100%', textAlign: 'left', padding: 10 }}>
                                <div style={{width: '100%', textAlign: 'left', color: '#333', backgroundColor: '#fff', borderRadius: 20 }}>
                                    <Toolbar style={{paddingLeft: 0}}>
                                        <IconButton onClick={() => setTimeout(() => {
                                            history.goBack()
                                        }, 500)}> 
                                            <ArrowBackIos style={{color: '#333', fontSize: 35}}/> 
                                        </IconButton> 
                                        <h1 style={{marginTop: 0, marginBottom: 0}}> {`${routeData}/${site}`} </h1>
                                    </Toolbar>
                                </div>
                            </div>
                            <Grid container item spacing={5} justifyContent='center'>
                                {
                                    machinesList.filter(a => a.toString()).map((machine) => {
                                        return (
                                            <Grid item key={machine.id}>
                                                <MachineButton machine={machine} image={`/assets/${machine.model}.png`} route={route}/>
                                            </Grid>
                                        )
                                    })
                                }
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

MachinesPage.propTypes = {
    route: PropTypes.oneOf(['inspection', 'maintenance'])
}

export default MachinesPage
