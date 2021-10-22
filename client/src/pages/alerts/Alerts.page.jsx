import React from 'react'
import { Box, Card, Grid } from '@material-ui/core'
import { useStylesTheme } from '../../config'

const AlertsPage = () => {
    const classes = useStylesTheme();

    let alerts = [
        {
            id: 0,
            description: 'Actividad 1 programada',
            fecha: '12/10/2021'
        },{
            id: 1,
            description: 'Actividad 1 ejecutada',
            fecha: '13/10/2021'
        },{
            id: 2,
            description: 'Actividad 2 programada',
            fecha: '13/10/2021'
        },{
            id: 3,
            description: 'Actividad 3 programada',
            fecha: '14/10/2021'
        },{
            id: 4,
            description: 'Actividad 2 ejecutada',
            fecha: '15/10/2021'
        },{
            id: 5,
            description: 'Actividad 4 programada',
            fecha: '16/10/2021'
        },{
            id: 6,
            description: 'Actividad 3 ejecutada',
            fecha: '16/10/2021'
        },{
            id: 7,
            description: 'Actividad 4 ejecutada',
            fecha: '19/10/2021'
        },{
            id: 8,
            description: 'Actividad 5 programada',
            fecha: '20/10/2021'
        },{
            id: 9,
            description: 'Actividad 6 programada',
            fecha: '20/10/2021'
        },
    ]

    return (
        <Box height='100%'>
            <Grid className={classes.pageRoot} container spacing={0}>
                <Grid className={classes.pageContainer} item xs={12}>
                    <Card className={classes.pageCard}>
                        {
                            alerts.reverse().filter(a => a.toString()).map((alert) => {
                                return (
                                    <Grid item key={alert.id} style={{width: '100%', padding: 5}}>
                                        <div style={{borderRadius: 20, backgroundColor: '#fff', padding: 10}}>
                                            <h3>
                                                {alert.fecha} - {alert.description}
                                            </h3>
                                        </div>
                                    </Grid>
                                )
                            })
                        }
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

export default AlertsPage