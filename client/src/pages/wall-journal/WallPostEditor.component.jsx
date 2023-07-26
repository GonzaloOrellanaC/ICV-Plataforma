import { Grid, Button, Input, TextareaAutosize, Checkbox, FormGroup, FormControlLabel } from '@mui/material'
import { useEffect, useState } from "react"
import { imageToBase64 } from "../../config"

const WallPostEditorComponent = ({typePost, roles, rolesSeleccionados, obras}) => {
    const [imageSelected, setImageSelected] = useState()
    const [videoSelected, setVideoSelected] = useState()
    const [rolesSelection, setRolesSelection] = useState([])
    const [obrasSelection, setObrasSelection] = useState([])
    const [todosRolesSeleccionados, setTodosRolesSeleccionados] = useState(false)
    const [todasObrasSeleccionadas, setTodasObrasSeleccionadas] = useState(false)
    const [titulo, setTitulo] = useState('')
    const [comentario, setComentario] = useState('')

    useEffect(() => {
        if (roles.length > 0) {
            const rolesCache = [...roles]
            rolesCache.forEach((rol) => {
                rol.selected = false
            })
            setRolesSelection(rolesCache)
        }
    }, [roles])

    useEffect(() => {
        if (obras.length > 0) {
            const obrasCache = [...obras]
            obrasCache.forEach((obra) => {
                obra.selected = false
            })
            setObrasSelection(obrasCache)
        }
    }, [obras])

    useEffect(() => {
        console.log(todosRolesSeleccionados)
        if (todosRolesSeleccionados) {
            const rolesSelectionCache = [...rolesSelection]
            rolesSelectionCache.forEach((rol) => {
                rol.selected = true
            })
            setRolesSelection(rolesSelectionCache)
        } else {
            const rolesSelectionCache = [...rolesSelection]
            rolesSelectionCache.forEach((rol) => {
                rol.selected = false
            })
            setRolesSelection(rolesSelectionCache)
        }
    },[todosRolesSeleccionados])

    useEffect(() => {
        if (todasObrasSeleccionadas) {
            const obrasSelectionCache = [...obrasSelection]
            obrasSelectionCache.forEach((obra) => {
                obra.selected = true
            })
            setObrasSelection(obrasSelectionCache)
        } else {
            const obrasSelectionCache = [...obrasSelection]
            obrasSelectionCache.forEach((obra) => {
                obra.selected = false
            })
            setObrasSelection(obrasSelectionCache)
        }
    }, [todasObrasSeleccionadas])

    useEffect(() => {
        const rolesSeleccionadosParaEnviar = []
        rolesSelection.forEach(rol => {
            if (rol.selected) {
                rolesSeleccionadosParaEnviar.push(rol.dbName)
            }
        })
        const obrasSeleccionadasParaEnviar = []
        obrasSelection.forEach(obra => {
            if (obra.selected) {
                obrasSeleccionadasParaEnviar.push(obra._id)
            }
        })
        rolesSeleccionados(rolesSeleccionadosParaEnviar, titulo, comentario, obrasSeleccionadasParaEnviar)
    }, [rolesSelection, titulo, comentario, obrasSelection])

    const abrirSelectorImagen = () => {
        console.log('imageSelector')
        const el = document.getElementById('imageSelector')
        el?.click()
        console.log(el)
    }

    const abrirSelectorVideo = () => {
        const el = document.getElementById('videoSelector')
        if (el) {
            el.click()
        }
    }

    const imagenSeleccionada = async (e) => {
        const response = await imageToBase64(e.target.files[0])
        setImageSelected(response)
    }

    const videoSeleccionado = async (e) => {
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = function () {
            setVideoSelected(reader.result);
        }
        reader.onerror = function (error) {
            console.log('Error: ', error);
        }
    }

    const selectRol = (event, index) => {
        const rolesCache = [...rolesSelection]
        rolesCache.forEach((rol, i) => {
            if (index === i) {
                rol.selected = event.target.checked
            }
        })
        setRolesSelection(rolesCache)
    }

    const selectObra = (event, index) => {
        const obrasCache = [...obrasSelection]
        obrasCache.forEach((obra, i) => {
            if (index === i) {
                obra.selected = event.target.checked
            }
        })
        setObrasSelection(obrasCache)
    }

    return (
        <Grid container>
            <Grid item xs={7}>
                {
                    (typePost === 'only-text')
                    ?
                    <Grid container style={{padding: '0% 10%'}}>
                        <Grid item xs={12}>
                            <Input 
                                onChange={(e) => {setTitulo(e.target.value)}}
                                placeholder="Ingrese título" style={{ width: '60%'}} />
                            <br />
                            <TextareaAutosize
                                onChange={(e) => {setComentario(e.target.value)}}
                                style={{ width: '100%', height: 400, marginTop: 20, padding: 10 }}
                            />
                        </Grid>
                    </Grid>
                    :
                    
                        (typePost === 'text-photo')
                        ?
                        <Grid container style={{padding: '0% 10%'}}>
                            <Grid item xs={6}>
                                <Button style={{backgroundColor: 'brown', color: 'white'}} onClick={abrirSelectorImagen}>
                                    Seleccione Imágen
                                </Button>
                                <input type={'file'} id={'imageSelector'} accept="image/jpeg, image/png" style={{display: 'none'}} onChange={imagenSeleccionada} />
                                <div className="mediaContainer">
                                    {imageSelected ? <img src={imageSelected} alt="image-post" className="imagePost" width={'100%'} style={{ maxWidth: 500, maxHeight: 500 }} /> : <p>Se mostrará la imágen al seleccionar</p>}
                                </div>
                            </Grid>
                            <Grid item xs={6}>
                                <Input
                                    onChange={(e) => {setTitulo(e.target.value)}}
                                    placeholder="Ingrese título" style={{ width: '60%'}} />
                                <br />
                                <TextareaAutosize
                                    onChange={(e) => {setComentario(e.target.value)}}
                                    style={{ width: '100%', height: 400, marginTop: 20, padding: 10, fontSize: 18 }}
                                />
                            </Grid>
                        </Grid>
                        :
                        <Grid container style={{padding: '0% 10%'}}>
                            <Grid item xs={6}>
                                <Button style={{backgroundColor: 'brown', color: 'white'}} onClick={abrirSelectorVideo}>
                                    Seleccione Video
                                </Button>
                                <input type={'file'} id={'videoSelector'} accept="video/mp4,video/x-m4v,video/*" style={{display: 'none'}} onChange={videoSeleccionado} />
                                <div className="mediaContainer">
                                    {videoSelected ? <video controls src={videoSelected} alt={'video-post'} className="videoPost" height={'100%'} /> : <p>Se mostrará el video al seleccionar</p>}
                                </div>
                            </Grid>
                            <Grid item xs={6}>
                                <Input 
                                    onChange={(e) => {setTitulo(e.target.value)}}
                                    placeholder="Ingrese título" style={{ width: '60%'}} />
                                <br />
                                <TextareaAutosize
                                    onChange={(e) => {setComentario(e.target.value)}}
                                    style={{ width: '100%', height: 400, marginTop: 20, padding: 10, fontSize: 18 }}
                                />
                            </Grid>
                        </Grid>
                }
            </Grid>
            <Grid item xs={5} style={{padding: '10px'}}>
                <Grid container>
                    <Grid item xs={6} style={{padding: '0px 10px'}}>
                        <h2>
                            Seleccione los roles.
                        </h2>
                        <FormGroup>
                            <FormControlLabel style={{fontSize: 12}} control={<Checkbox style={{color: 'brown'}} checked={todosRolesSeleccionados} onChange={(e) => {setTodosRolesSeleccionados(e.target.checked)}} />} label={'Todos'} />
                            {
                                rolesSelection.map((rol, i) => {
                                    return (
                                        <FormControlLabel style={{fontSize: 12}} key={i} control={<Checkbox style={{color: 'brown'}} checked={rol.selected} onChange={(e) => {selectRol(e, i)}} />} label={rol.name} />
                                    )
                                })
                            }
                        </FormGroup>
                    </Grid>
                    <Grid item xs={6} style={{padding: '0px 10px'}}>
                        <h2>
                            Seleccione obras.
                        </h2>
                        <FormGroup>
                            <FormControlLabel style={{fontSize: 12}} control={<Checkbox style={{color: 'brown'}} checked={todasObrasSeleccionadas} onChange={(e) => {setTodasObrasSeleccionadas(e.target.checked)}} />} label={'Todos'} />
                            {
                                obrasSelection.map((obra, i) => {
                                    return (
                                        <FormControlLabel style={{fontSize: 12}} key={i} control={<Checkbox style={{color: 'brown'}} checked={obra.selected} onChange={(e) => {selectObra(e, i)}} />} label={obra.descripcion} />
                                    )
                                })
                            }
                        </FormGroup>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default WallPostEditorComponent