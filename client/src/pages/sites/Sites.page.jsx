import React, {useEffect, useState} from 'react'
import { Box, Button, Card, Grid } from '@material-ui/core'
import { useStylesTheme } from '../../config'
import { SiteButton } from '../../components/buttons'
import { sitesDatabase } from '../../indexedDB'
import { useAuth } from '../../context'

const SitesPage = () => {

    const {setSite} = useAuth()
    const classes = useStylesTheme();

    const [ sites, setSites ] = useState([])
    
    useEffect(() => {
        readData();
    }, [])

    const readData = async () => {
        sitesDatabase.initDbObras()
        .then(async db => {
            let respuestaConsulta = await sitesDatabase.consultar(db.database);
            console.log(respuestaConsulta)
            setSites(respuestaConsulta);
        })
    }

    const seleccionarSitio = (site) => {
        if (window.confirm('Confirme que cambiará la obra de navegación')) {
            console.log(site)
            setSite(site)
            /* localStorage.setItem('sitio', JSON.stringify(site));
            alert(site.descripcion+' seleccionado.') */
        }
    }

    return (
        <Box height='100%'>
            <Grid className={'pageRoot'} container spacing={0}>
                <Grid className={classes.pageContainer} item xs={12}>
                    <Card elevation={0} className={'pageCard'}>
                        <div style={{width: '100%'}}>
                        <h1>Para navegar en la plataforma debe seleccionar una obra.</h1>
                        </div>
                        <Grid container style={{ height: '75vh', overflowY: 'auto' }} alignItems='center' justifyContent='center'>
                            
                            {
                                sites.filter(a => a.toString()).map((site) => {
                                    return (
                                        <Grid item xl={3} lg={3} md={4} key={site.id} style={{width: '100%', padding: 20}}>
                                            <div
                                                style={{
                                                    padding: 10,
                                                    borderRadius: 20,
                                                    borderWidth: 1,
                                                    borderColor: 'red',
                                                    borderStyle: 'solid',
                                                    textAlign: 'center'
                                                }}
                                            >
                                                <img src={site.image ? site.image : '/logo_icv.png'} width={100} />
                                                <br />
                                                <p>{site.descripcion}</p>
                                                <br />
                                                <Button onClick={() => { seleccionarSitio(site) }} variant={'contained'} color={'primary'}>
                                                    Seleccionar
                                                </Button>
                                                <br />
                                            </div>
                                            {/* <SiteButton site={site} /> */}
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