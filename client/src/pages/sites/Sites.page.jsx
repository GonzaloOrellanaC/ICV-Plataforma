import React from 'react'
import { Box, Card, Grid, List, ListItem, Toolbar, IconButton, Button } from '@material-ui/core'
import { Close, ArrowBackIos } from '@material-ui/icons'
import { useStylesTheme } from '../../config'
import { CardButton, SiteButton } from '../../components/buttons'



const SitesPage = () => {
    const classes = useStylesTheme();

    
    const sites = [
        {
            id: 0,
            name: `Sitio Minero 1`,
            image: 'https://movimientom4.org/wp-content/uploads/2019/02/minera-derrame-800x450.jpg'
        },
        {
            id: 1,
            name: `Sitio Minero 2`,
            image: 'https://cdn77.pressenza.com/wp-content/uploads/2019/02/rtpc.jpeg'
        },
        {
            id: 2,
            name: `Sitio Minero 3`,
            image: 'https://pm.portalminero.com/images/noticias/5c2df6117a843.jpg'
        },
        {
            id: 3,
            name: `Sitio Minero 4`,
            image: 'https://suez.azureedge.net/-/media/suez-global/images/header/e-secteurs/mining-industry.jpg?h=806&la=es&w=1433&v=1&d=20170328T081947Z&crop=1&hash=7C1EEF0E80C637CDD2CAE2573851133C1C2D5404'
        },
    ]

    //console.log(sites)

    return (
        <Box height='100%'>
            <Grid className={classes.pageRoot} container spacing={0}>
                <Grid className={classes.pageContainer} item xs={12}>
                    <Card className={classes.pageCard}>
                        <Grid container style={{ height: '100%' }} alignItems='center' justifyContent='center'>
                            {
                                sites.filter(a => a.toString()).map((site) => {
                                    return (
                                        <Grid item key={site.id} style={{width: '100%', padding: 20}}>
                                            <SiteButton site={site} />
                                        </Grid>
                                    )
                                })
                            }
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

export default SitesPage