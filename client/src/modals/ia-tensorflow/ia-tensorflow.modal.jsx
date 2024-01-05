import './style.css'
import { 
    Box, 
    Modal,
    Fab
} from '@mui/material';
import { Close } from '@mui/icons-material';
import MagicDropzone from "react-magic-dropzone";
import * as tf from '@tensorflow/tfjs';
import { styleModalIA } from '../../config';
import { useEffect } from 'react';
import { useState } from 'react';
import { LoadingModal } from '../';


const IAModal = ({open, closeModal}) => {
    const weights = '/icv_web_model/model.json';
    const names = ['Pala', 'Cuerpo', 'Cabina_Pala', 'Oruga', 'Brazo', 'Balde', 'Trasero_Pala', 
    'Camion', 'Neumaticos', 'Tolva', 'Cabina_Camion', 'Parrilla', 'Trasero_Camion']

    const [modelWeight, modelHeight] = [640, 640];

    const [ stateModel, setStateModel ] = useState(null);
    const [ statePreview, setStatePreview ] = useState("")
    const [ openLoader, setOpen ] = useState(false);
    const [ ready, setReady ] = useState(false);

    useEffect(() => {
        let cancel = false;
        if(cancel) return;
        tf.loadGraphModel(weights).then(m => {
            if(cancel) return;
            setStateModel(m);
        });
        return () => {
            cancel = true;
        }
    }, [])

    const onDrop = (accepted, rejected, links) => {
        if(ready) {
            setOpen(true)
            tf.loadGraphModel(weights).then(m => {
                //if(cancel) return;
                setStateModel(m);
                setTimeout(() => {
                    setStatePreview(accepted[0].preview || links[0]);
                }, 2000);
            });
        }else{
            setOpen(true)
            setTimeout(() => {
                setStatePreview(accepted[0].preview || links[0]);
            }, 2000);
        }
        
    };

    const closeModalLoading = () => {
        setOpen(false)
    }

    const cropToCanvas = (image, canvas, ctx) => {
        const naturalWidth = image.naturalWidth;
        const naturalHeight = image.naturalHeight;    
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const ratio = Math.min(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight);
        const newWidth = Math.round(naturalWidth * ratio);
        const newHeight = Math.round(naturalHeight * ratio);
        ctx.drawImage(
            image,
            0,
            0,
            naturalWidth,
            naturalHeight,
            (canvas.width - newWidth) / 2,
            (canvas.height - newHeight) / 2,
            newWidth,
            newHeight,
        );
    };

    const onImageChange = async (e)=> {
        const c = document.getElementById("canvas");
        const ctx = c.getContext("2d");
        
        cropToCanvas(e.target, c, ctx);
        const input = tf.tidy(() => {
          return tf.image.resizeBilinear(tf.browser.fromPixels(c), [modelWeight, modelHeight])
            .div(255.0).expandDims(0);
        });
        if(stateModel) {
            if(input) {
                stateModel.executeAsync(input).then(res => {
                    closeModalLoading();
                    setReady(true);
                    const font = "16px sans-serif";
                    ctx.font = font;
                    ctx.textBaseline = "top";
                    const [boxes, scores, classes, valid_detections] = res;
                    const boxes_data = boxes.dataSync();
                    const scores_data = scores.dataSync();
                    const classes_data = classes.dataSync();
                    const valid_detections_data = valid_detections.dataSync()[0];
                    tf.dispose(res)
                    var i;
                    for (i = 0; i < valid_detections_data; ++i){
                        let [x1, y1, x2, y2] = boxes_data.slice(i * 4, (i + 1) * 4);
                        x1 *= c.width;
                        x2 *= c.width;
                        y1 *= c.height;
                        y2 *= c.height;
                        const width = x2 - x1;
                        const height = y2 - y1;
                        const klass = names[classes_data[i]];
                        const score = scores_data[i].toFixed(2);
                        // Draw the bounding box.
                        ctx.strokeStyle = "#00FFFF";
                        ctx.lineWidth = 4;
                        ctx.strokeRect(x1, y1, width, height);
                        // Draw the label background.
                        ctx.fillStyle = "#00FFFF";
                        const textWidth = ctx.measureText(klass + ":" + score).width;
                        const textHeight = parseInt(font, 10); // base 10
                        ctx.fillRect(x1, y1, textWidth + 4, textHeight + 4);
                    }
                    for (i = 0; i < valid_detections_data; ++i){
                        let [x1, y1, , ] = boxes_data.slice(i * 4, (i + 1) * 4);
                        x1 *= c.width;
                        y1 *= c.height;
                        const klass = names[classes_data[i]];
                        const score = scores_data[i].toFixed(2);
                        // Draw the text last to ensure it's on top.
                        ctx.fillStyle = "#000000";
                        ctx.fillText(klass + ":" + score, x1, y1);
                    }
                }).catch(err=> {
                    setOpen(false);
                    alert('Se detecta que la máquina no está completa en la imágen. Por favor aléjese de la máquina para que el sistema logre identificar todas las partes.')
                })
            }
        }
    };

    return(
        <Modal
            open={open}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={styleModalIA}>
                <div className="Dropzone-page">
                    <h3>Inserte su imágen. <br /> Para cambiar solo vuelva a tocar el cuadrado.</h3>
                    {
                    stateModel ? ( 
                        <MagicDropzone
                            className="Dropzone"
                            accept="image/jpeg, image/png, .jpg, .jpeg, .png"
                            multiple={false}
                            onDrop={onDrop}
                        >
                            {statePreview ? (
                            <img
                                alt="upload preview"
                                onLoad={onImageChange}
                                className="Dropzone-img"
                                src={statePreview}
                            />
                            ) : (
                            <h2>Presione para elegir una foto desde el archivo</h2>
                            )}
                            <canvas id="canvas" width="640" height="640" />
                        </MagicDropzone> 
                    ) : (
                        <div className="Dropzone">Cargando modelo...</div>
                    )}
                </div>
                <LoadingModal open={openLoader} withProgress={false} loadingData={'Cargando datos...'}/>
                <Fab onClick={() => {closeModal()}} style={{position: 'absolute', right: 10, top: 10, boxShadow: 'none', backgroundColor: 'transparent'}}>
                    <Close style={{color: '#ccc'}} />
                </Fab>
            </Box>
            
        </Modal>
        
    )
}

export default IAModal