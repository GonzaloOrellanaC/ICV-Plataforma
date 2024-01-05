import React, { useEffect, useState } from 'react'
import { Box, Card, IconButton, Toolbar, Grid } from "@mui/material"
import { ArrowBackIos, ChevronRight } from "@mui/icons-material"
import { useNavigate } from 'react-router-dom'
import './Wall.css'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'
import WallSelectTypePost from './WallSelectTypePost.component'
import WallPostEditorComponent from './WallPostEditor.component'
import { azureStorageRoutes, newsRoutes, rolesRoutes, sitesRoutes } from '../../routes'
import LoadingLogoDialog from '../../dialogs/LoadingLogoDialog'
import { useNotificationsContext } from '../../context/Notifications.context'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { dateWithTime } from '../../config'
import { Divider } from '@mui/material'

const MyWallPage = () => {
    const navigate = useNavigate()
    const {noticias, listaLectura} = useNotificationsContext()

    const [noticiasParaMostrar, setNoticiasParaMostrar] = useState([])

    const [noticiaSeleccionada, setNoticiaSeleccionada] = useState()

    useEffect(() => {
        setNoticiasParaMostrar(noticias)
    }, [noticias])

    useEffect(() => {
        console.log(noticiaSeleccionada)
    }, [noticiaSeleccionada])

    const seleccionarNoticia = (noticia) => {
        setNoticiaSeleccionada(noticia)
    }

    return (
        <Box height='100%'>
            <Grid className={'pageRoot'} container spacing={0}>
                <Grid item xs={12}>
                    <Card elevation={0} className={'pageCard'}>
                        <Grid style={{flexShrink: 0}}>
                            <div style={{width: '100%', textAlign: 'left', padding: 10 }}>
                                <div style={{width: '100%', textAlign: 'left', color: '#333', backgroundColor: '#fff', borderRadius: 20 }}>
                                    <Toolbar style={{paddingLeft: 0, backgroundColor: '#F9F9F9', borderRadius: 10}}>
                                        <IconButton onClick={() => setTimeout(() => {
                                            navigate(-1)
                                        }, 500)}> 
                                            <ArrowBackIos style={{color: '#333', fontSize: 16}}/> 
                                        </IconButton> 
                                        <p style={{marginTop: 0, marginBottom: 0, fontSize: 16}}>
                                            Mi Mural
                                        </p>
                                    </Toolbar>
                                </div>
                            </div>
                        </Grid>
                        <Grid container spacing={1} style={{padding: '5px 10px 0px 10px'}}>
                            <Grid item xs={3}>
                                <div style={{padding: 10, border: '1px solid #ccc', borderRadius: 8, width: '100%', height: 'calc(100vh - 220px)', overflowY: 'auto'}}>
                                    {
                                        listaLectura ?
                                        ((noticiasParaMostrar.length > 0) ? noticiasParaMostrar.map((noticia, i) => {
                                            return (
                                                <div key={i} className='item-mywall' onClick={() => {seleccionarNoticia(noticia)}}>
                                                    <p style={{maxWidth: '80%'}}>{noticia.titulo}</p>
                                                    <ChevronRight className='icon-right' />
                                                </div>
                                            )
                                        })
                                        :
                                        <div className='item-mywall'>
                                            <p style={{maxWidth: '80%'}}>No tiene noticias en su muro</p>
                                        </div>)
                                        :
                                        <div className='item-mywall'>
                                            <p style={{maxWidth: '80%'}}>Cargando noticias</p>
                                        </div>
                                    }
                                </div>
                            </Grid>
                            <Grid item xs={9}>
                                <div style={{padding: 10, border: '1px solid #ccc', borderRadius: 8, width: '100%', height: 'calc(100vh - 220px)'}}>
                                    {
                                        noticiaSeleccionada && 
                                        <Grid container style={{width: '100%', padding: 10}}>
                                            {
                                                (noticiaSeleccionada.urlVideo || noticiaSeleccionada.urlFoto)
                                                &&
                                                <Grid item xs={6} style={{width: '100%', padding: 10}}>
                                                    {
                                                        noticiaSeleccionada.urlVideo &&
                                                        <video controls src={noticiaSeleccionada.urlVideo} width={'100%'}></video>
                                                    }
                                                    {
                                                        noticiaSeleccionada.urlFoto &&
                                                        <img src={noticiaSeleccionada.urlFoto} width={'100%'} />
                                                    }
                                                </Grid>
                                            }
                                            <Grid item xs={(noticiaSeleccionada.urlVideo || noticiaSeleccionada.urlFoto) ? 6 : 12} style={{width: '100%', padding: 10}}>
                                                <h1>
                                                    {noticiaSeleccionada.titulo}
                                                </h1>
                                                <p style={{whiteSpace: 'pre-line'}}>
                                                    {noticiaSeleccionada.comentario}
                                                </p>
                                                <Divider />
                                                <br />
                                                <p>
                                                    Creada: {dateWithTime(noticiaSeleccionada.createdAt)}
                                                </p>
                                            </Grid>
                                        </Grid>
                                    }
                                </div>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

export default MyWallPage