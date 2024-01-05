import React, { useEffect, useState } from 'react'
import { Box, Card, IconButton, Toolbar, Grid } from "@mui/material"
import { ArrowBackIos } from "@mui/icons-material"
import { useNavigate } from 'react-router-dom'
import './Wall.css'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'
import WallSelectTypePost from './WallSelectTypePost.component'
import WallPostEditorComponent from './WallPostEditor.component'
import { azureStorageRoutes, newsRoutes, rolesRoutes, sitesRoutes } from '../../routes'
import LoadingLogoDialog from '../../dialogs/LoadingLogoDialog'

const WallJournalPage = () => {
    const navigate = useNavigate()
    const [typePost, setTypePost] = useState('')
    const [positionSelection, setPositionSelection] = useState(0)
    const [roles, setRoles] = useState([])
    const [titulo, setTitulo] = useState('')
    const [comentario, setComentario] = useState('')
    const [rolesSeleccionadosAenvio, setRolesSeleccionadosAenvio] = useState([])
    const [obrasSeleccionadasAenvio, setObrasSeleccionadasAenvio] = useState([])
    const [obras, setObras] = useState([])
    const [video, setVideo] = useState()
    const [imagen, setImagen] = useState()
    const [loadingData, setLoadingData] = useState(false)

    useEffect(() => {
        getRolesInit()
        getObrasInit()
    },[])

    const getRolesInit = async () => {
        const response = await rolesRoutes.getRoles()
        console.log(response.data)
        setRoles(response.data)
    }

    const getObrasInit = async () => {
        const response = await sitesRoutes.getSites()
        console.log(response.data)
        setObras(response.data.data)
    }
    
    useEffect(() => {
        console.log(typePost)
    },[typePost])
    
    const selectTypePost = (typePost) => {
        const types = ['only-text','text-photo','title-video']
        types.forEach((type) => {
            const el = document.getElementById(type)
            if (el) {
                el.className = 'postExampleContainer'
            } 
        })
        setTypePost(typePost)
        const el = document.getElementById(typePost)
        if (el) {
            el.className = 'postExampleContainerSelected'
        }
    }

    const siguienteAction = () => {
        if (typePost.length > 0) {
            next()
        } else {
            alert('Debe seleccionar una opción')
        }
    }

    const next = () => {
        const el = document.getElementById('wallEditor')
        if (el) {
            el.swiper.slideNext()
            setPositionSelection(1)
        }
    }

    const back = () => {
        const el = document.getElementById('wallEditor')
        if (el) {
            el.swiper.slidePrev()
            setPositionSelection(0)
        }
    }

    const rolesSeleccionados = async (roles, titulo, comentario, obras) => {
        console.log(roles, titulo, comentario)
        setTitulo(titulo)
        setComentario(comentario)
        setRolesSeleccionadosAenvio(roles)
        setObrasSeleccionadasAenvio(obras)
    }

    const enviarPost = async () => {
        if (rolesSeleccionadosAenvio.length > 0) {
            if (titulo.length > 0) {
                if (comentario.length > 0) {
                    if (typePost === 'only-text') {
                        setLoadingData(true)
                        const newsData = {
                            titulo: titulo,
                            comentario: comentario,
                            roles: rolesSeleccionadosAenvio,
                            obras: obrasSeleccionadasAenvio
                        }
                        const response = await newsRoutes.createNewText(newsData)
                        setLoadingData(false)
                        if (response) {
                            back()
                        }
                    } else if (typePost === 'text-photo') {
                        if (imagen) {
                            setLoadingData(true)
                            const nombreImagen = Date.now()
                            const responseImagen = await azureStorageRoutes.uploadImage(imagen, nombreImagen.toString(), `news/${nombreImagen}` )
                            console.log(responseImagen)
                            const newsData = {
                                titulo: titulo,
                                comentario: comentario,
                                roles: rolesSeleccionadosAenvio,
                                obras: obrasSeleccionadasAenvio,
                                nombreFoto: nombreImagen,
                                urlFoto: responseImagen.data.data.url
                            }
                            const response = await newsRoutes.createNewWithImage(newsData)
                            setLoadingData(false)
                            if (response) {
                                back()
                            }
                        } else {
                            alert('Imagen no seleccionada')
                        }
                    } else if (typePost === 'title-video') {
                        if (video) {
                            setLoadingData(true)
                            console.log(video)
                            const nombreVideo = Date.now()
                            const respondeVideo = await azureStorageRoutes.uploadVideo(video, nombreVideo.toString(), `news/${nombreVideo}` )
                            console.log(respondeVideo)
                            const newsData = {
                                titulo: titulo,
                                comentario: comentario,
                                roles: rolesSeleccionadosAenvio,
                                obras: obrasSeleccionadasAenvio,
                                nombreVideo: nombreVideo,
                                urlVideo: respondeVideo.data.data.url
                            }
                            const response = await newsRoutes.createNewWithVideo(newsData)
                            setLoadingData(false)
                            if (response) {
                                back()
                            }
                        }
                    }
                } else {
                    alert('Debe agregar un comentario')
                }
            } else {
                alert('Debe agregar un título')
            }
        } else {
            alert('Debe seleccionar al menos un rol')
        }
    }

    return (
        <Box height='100%'>
            <LoadingLogoDialog
                open={loadingData}
            />
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
                                            Administración Mural
                                        </p>
                                    </Toolbar>
                                </div>
                            </div>
                        </Grid>
                        <Grid container spacing={1} style={{padding: '5px 10px 0px 10px'}}>
                            <Swiper
                                id={'wallEditor'}
                                spaceBetween={50}
                                slidesPerView={1}
                                className="mySwiper"
                                pagination={{ clickable: true }}
                                allowTouchMove={false}                             
                            >
                                <SwiperSlide>
                                    <WallSelectTypePost selectTypePost={selectTypePost}/>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <WallPostEditorComponent typePost={typePost} roles={roles} rolesSeleccionados={rolesSeleccionados} obras={obras} setVideo={setVideo} setImagen={setImagen} />
                                </SwiperSlide>
                            </Swiper>
                            <Grid item xs={12} >
                                <div style={{textAlign: 'right'}}>
                                    {(positionSelection === 0) && <button className="buttonNextWall" onClick={siguienteAction}>
                                        Siguiente
                                    </button>}
                                    {(positionSelection === 1) && <button className="buttonNextWall" onClick={back}>
                                        Atrás
                                    </button>}
                                    {(positionSelection === 1) && <button className="buttonNextWall sendButton" onClick={enviarPost}>
                                        Enviar
                                    </button>}
                                </div>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

export default WallJournalPage