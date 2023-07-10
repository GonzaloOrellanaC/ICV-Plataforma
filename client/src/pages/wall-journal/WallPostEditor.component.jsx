import { Button, Grid, Input, TextareaAutosize } from "@material-ui/core"
import { useState } from "react"
import { imageToBase64 } from "../../config"

const WallPostEditorComponent = ({typePost}) => {
    const [imageSelected, setImageSelected] = useState()
    const [videoSelected, setVideoSelected] = useState()

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

    return (
        <div>
            {
                (typePost === 'only-text')
                ?
                <Grid container>
                    <Grid item xs={12}>
                        <Input placeholder="Ingrese título" style={{ width: '60%'}} />
                        <br />
                        <TextareaAutosize
                            style={{ width: '100%', height: 400, marginTop: 20, padding: 10 }}
                        />
                    </Grid>
                </Grid>
                :
                
                    (typePost === 'text-photo')
                    ?
                    <Grid container>
                        <Grid item xs={6}>
                            <Button onClick={abrirSelectorImagen}>
                                Seleccione Imágen
                            </Button>
                            <input type={'file'} id={'imageSelector'} accept="image/jpeg, image/png" style={{display: 'none'}} onChange={imagenSeleccionada} />
                            <div className="mediaContainer">
                                {imageSelected ? <img src={imageSelected} alt="image-post" className="imagePost" width={'100%'} /> : <p>Se mostrará la imágen al seleccionar</p>}
                            </div>
                        </Grid>
                        <Grid item xs={6}>
                            <Input placeholder="Ingrese título" style={{ width: '60%'}} />
                            <br />
                            <TextareaAutosize
                                style={{ width: '100%', height: 400, marginTop: 20, padding: 10, fontSize: 18 }}
                            />
                        </Grid>
                    </Grid>
                    :
                    <Grid container>
                        <Grid item xs={6}>
                            <Button onClick={abrirSelectorVideo}>
                                Seleccione Video
                            </Button>
                            <input type={'file'} id={'videoSelector'} accept="video/mp4,video/x-m4v,video/*" style={{display: 'none'}} onChange={videoSeleccionado} />
                            <div className="mediaContainer">
                                {videoSelected ? <video controls src={videoSelected} alt={'video-post'} className="videoPost" width={'100%'} /> : <p>Se mostrará el video al seleccionar</p>}
                            </div>
                        </Grid>
                        <Grid item xs={6}>
                            <Input placeholder="Ingrese título" style={{ width: '60%'}} />
                            <br />
                            <TextareaAutosize
                                style={{ width: '100%', height: 400, marginTop: 20, padding: 10, fontSize: 18 }}
                            />
                        </Grid>
                    </Grid>
            }
        </div>
    )
}

export default WallPostEditorComponent