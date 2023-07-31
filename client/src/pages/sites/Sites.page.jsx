import React, {useEffect, useState} from 'react'
import { Box, Button, Card, Grid } from '@material-ui/core'
import { useStylesTheme } from '../../config'
import { SiteButton } from '../../components/buttons'
import { sitesDatabase } from '../../indexedDB'
import { useAuth, useSitesContext } from '../../context'

const SitesPage = () => {
    const [obras, setObras] = useState([])
    const [filtroPorObra, setFiltroPorObra] = useState(true)
    const [filtroPorNombre, setFiltroPorNombre] = useState(true)
    const [filtroPorEstado, setFiltroPorEstado] = useState(true)
    const {setSite} = useAuth()
    const {sites} = useSitesContext()
    const classes = useStylesTheme()

    const seleccionarSitio = (site) => {
        if (window.confirm('Confirme que cambiará la obra de navegación')) {
            console.log(site)
            setSite(site)
            /* localStorage.setItem('sitio', JSON.stringify(site)); */
            alert(site.descripcion+' seleccionado.')
        }
    }

    useEffect(() => {
        if (sites.length > 0) {
            setObras(sites)
        }
    },[sites])

    useEffect(() => {
        const obrasCache = [...sites]
        if (filtroPorObra) {
            obrasCache.sort((a, b) => {
                if (a.idobra > b.idobra) {
                    return 1
                }
                if (a.idobra < b.idobra) {
                    return -1
                }
                return 0
            })
        } else {
            obrasCache.sort((a, b) => {
                if (a.idobra < b.idobra) {
                    return 1
                }
                if (a.idobra > b.idobra) {
                    return -1
                }
                return 0
            })
        }
        setObras(obrasCache)
    },[filtroPorObra])

    useEffect(() => {
        const obrasCache = [...sites]
        if (filtroPorNombre) {
            obrasCache.sort((a, b) => {
                if (a.descripcion > b.descripcion) {
                    return 1
                }
                if (a.descripcion < b.descripcion) {
                    return -1
                }
                return 0
            })
        } else {
            obrasCache.sort((a, b) => {
                if (a.descripcion < b.descripcion) {
                    return 1
                }
                if (a.descripcion > b.descripcion) {
                    return -1
                }
                return 0
            })
        }
        setObras(obrasCache)
    },[filtroPorNombre])

    useEffect(() => {
        const obrasCache = [...sites]
        if (filtroPorEstado) {
            obrasCache.sort((a, b) => {
                if (a.status > b.status) {
                    return 1
                }
                if (a.status < b.status) {
                    return -1
                }
                return 0
            })
        } else {
            obrasCache.sort((a, b) => {
                if (a.status < b.status) {
                    return 1
                }
                if (a.status > b.status) {
                    return -1
                }
                return 0
            })
        }
        setObras(obrasCache)
    },[filtroPorEstado])

    const filtrarPorIDObra = () => {
        setFiltroPorObra(!filtroPorObra)
    }

    const filtrarPorNombreObra = () => {
        setFiltroPorNombre(!filtroPorNombre)
    }

    const filtrarPorEstadoObra = () => {
        setFiltroPorEstado(!filtroPorEstado)
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
                            <div item xs={12} style={{borderBottom: '1px solid #ccc', width: '100%'}}>
                                <Grid container>
                                    <Grid item xs={1} className='selectionType' onClick={filtrarPorIDObra}>
                                        <p>ID de Obra</p>
                                    </Grid>
                                    <Grid item xs={6} className='selectionType' onClick={filtrarPorNombreObra}>
                                        <p>Nombre de Obra</p>
                                    </Grid>
                                    <Grid item xs={1} className='selectionType' onClick={filtrarPorEstadoObra}>
                                        <p>Estado</p>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <p style={{marginLeft: 10}}>Acción</p>
                                    </Grid>
                                </Grid>
                            </div>
                            <div style={{overflowY: 'auto', height: 'calc(100vh - 280px)', width: '100%'}}>
                                {
                                    obras.filter(a => a.toString()).map((site, i) => {
                                        return (
                                            <div key={i} item xs={12} style={{borderBottom: '1px solid #ccc', width: '100%'}}>
                                                <Grid container>
                                                    <Grid item xs={1}>
                                                        <p style={{color: !site.status && '#ccc'}}>{site.idobra}</p>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <p style={{color: !site.status && '#ccc'}}>{site.descripcion}</p>
                                                    </Grid>
                                                    <Grid item xs={1}>
                                                        <p>{site.status ? 'Disponible' : 'Removido'}</p>
                                                    </Grid>
                                                    <Grid item xs={4}>
                                                        <Button disabled={!site.status} style={{marginTop: 5, marginLeft: 10, color: 'green', borderColor: 'green'}} variant={'outlined'}>
                                                            Información
                                                        </Button>
                                                        <Button disabled={!site.status} style={{marginTop: 5, marginLeft: 10}} onClick={() => { seleccionarSitio(site) }} variant={'outlined'} color={'primary'}>
                                                            Seleccionar
                                                        </Button>
                                                        <Button disabled style={{marginTop: 5, marginLeft: 10}} onClick={() => { seleccionarSitio(site) }} variant={'outlined'} color={'secondary'}>
                                                            Remover
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

export default SitesPage