import React, { useEffect, useState } from 'react'
import { Box, Card, IconButton, Toolbar, Grid } from "@material-ui/core"
import { ArrowBackIos } from "@material-ui/icons"
import { useNavigate } from 'react-router-dom'
import './Wall.css'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'
import WallSelectTypePost from './WallSelectTypePost.component'
import WallPostEditorComponent from './WallPostEditor.component'

const WallJournalPage = () => {
    const navigate = useNavigate()
    const [typePost, setTypePost] = useState('')
    const [positionSelection, setPositionSelection] = useState(0)
    
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

    const enviarPost = () => {
        alert('Envío de noticias en proceso de desarrollo.')
    }

    return (
        <Box height='100%'>
            <Grid className={'pageRoot'} container spacing={0}>
                <Grid /* className={classes.pageContainer} */ item xs={12}>
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
                                    <WallPostEditorComponent typePost={typePost} />
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