import React, {useEffect, useState} from 'react'
import { Box, Card, Grid } from '@material-ui/core'
import { useStylesTheme } from '../../config'
import { SiteButton } from '../../components/buttons'
import { sitesDatabase } from '../../indexedDB'

const SitesPage = () => {
    const classes = useStylesTheme();

    const [ sites, setSites ] = useState([])
    
    useEffect(() => {
        readData();
    }, [])

    const readData = async () => {
        sitesDatabase.initDbObras()
        .then(async db => {
            let respuestaConsulta = await sitesDatabase.consultar(db.database);
            setSites(respuestaConsulta);
        })
    }

    return (
        <Box height='100%'>
            <Grid className={classes.pageRoot} container spacing={0}>
                <Grid className={classes.pageContainer} item xs={12}>
                    <Card className={classes.pageCard}>
                        <div style={{width: '100%'}}>
                        <h1>Para navegar en la plataforma debe seleccionar una obra.</h1>
                        </div>
                        <Grid container style={{ height: '75vh' }} alignItems='center' justifyContent='center'>
                            
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