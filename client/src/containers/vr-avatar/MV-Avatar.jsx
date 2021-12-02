import '@google/model-viewer';
import './domarrow'
import { Box, List, ListItem } from '@material-ui/core';

import {useEffect, useState} from 'react'

const loadSprite = () => {
    let state = true;
    let bee = document.getElementById('beeContent');
    if(bee) {
        if(state) {
            state = false
        }
    }
}


const MVAvatar = ({machine}) => {

    const [ modelViewer, setModelViewer ] = useState();
    const [ disable, setDisableZoom ] = useState(true)

    let newMachine;
    console.log(machine);

     if(machine.type === 'Camión') {
        newMachine = '../../../assets/camion/' + machine.brand + '_' + machine.model + '_' + 'Preview.gltf'
    }else if(machine.type === 'Pala') {
        newMachine = '../../../assets/pala/' + machine.brand + '_' + machine.model + '_' + 'Preview.gltf'
    }

    console.log(newMachine);
    /* const modelViewer = ; */

    useEffect(() => {
        setModelViewer(document.querySelector("model-viewer#machine"))
        let mv = document.querySelector("model-viewer#machine")
        mv.addEventListener('load', (e) => {
            console.log('cargado!!!');
            //console.log(e)
            //console.log(mv)
            const changeColor = async (event) => {
                console.log(event)
                let material = mv.materialFromPoint(event.clientX, event.clientY);
                
                if(material != null) {
                    //console.log(event)
                    console.log(material)
                  //material.pbrMetallicRoughness.setBaseColorFactor([0, 0, 0, 0.1]) //([Math.random(), Math.random(), Math.random(), 0.5])
                }
              }
            
            mv.addEventListener("click", changeColor);
            setTimeout(() => {
                mv.cameraControls = true;
            }, 2000);
        })
    }, []);

    

    const terminar = () => {
        let previo = document.getElementById('letrero');
        if(previo) {
            previo.remove()
        }
        modelViewer.cameraOrbit = '45deg 90deg 2.5m';
        modelViewer.disableZoom = false;
        modelViewer.cameraControls = true;
    }

    const cabinaPosition = () => {
        let previo = document.getElementById('letrero');
        if(previo) {
            previo.remove()
        }
        modelViewer.cameraOrbit = '45deg 55deg -4m';
        modelViewer.disableZoom = true;
        modelViewer.cameraControls = false;
        let element = document.createElement('div');
        element.innerHTML = 'Cabina';
        element.id = 'letrero';
        let box = document.getElementById('box')
        //console.log(box)
        let styleEdit = {
            //2,
            position: 'absolute',
            top: '50%',
            left: '20%',
            color: '#000',
            backgroundColor: '#fff',
            fontSize: '30px',
            padding: '40px',
            borderRadius: '30px'
        }

        Object.assign(element.style, styleEdit)
        box.appendChild(element);
        //console.log(element)
    }

    const palaPosition = () => {
        let previo = document.getElementById('letrero');
        if(previo) {
            previo.remove()
        }
        modelViewer.cameraOrbit = '10deg 120deg 3m';
        modelViewer.disableZoom = true;
        modelViewer.cameraControls = false;
        let element = document.createElement('div');
        element.innerHTML = 'Balde';
        element.id = 'letrero';
        let box = document.getElementById('box')
        //console.log(box)
        let styleEdit = {
            //2,
            position: 'absolute',
            top: '50%',
            left: '45%',
            color: '#000',
            backgroundColor: '#fff',
            fontSize: '30px',
            padding: '40px',
            borderRadius: '30px'
        }

        Object.assign(element.style, styleEdit)
        box.appendChild(element);
    }

    const brazoPosition = () => {
        let previo = document.getElementById('letrero');
        if(previo) {
            previo.remove()
        }
        modelViewer.cameraOrbit = '-40deg 80deg 2m'
        modelViewer.disableZoom = true;
        modelViewer.cameraControls = false;
        let element = document.createElement('div');
        element.innerHTML = 'Brazo';
        element.id = 'letrero';
        let box = document.getElementById('box')
        //console.log(box)
        let styleEdit = {
            //2,
            position: 'absolute',
            top: '50%',
            left: '40%',
            color: '#000',
            backgroundColor: '#fff',
            fontSize: '30px',
            padding: '40px',
            borderRadius: '30px'
        }

        Object.assign(element.style, styleEdit)
        box.appendChild(element);

    }

    const cuerpoPosition = () => {
        let previo = document.getElementById('letrero');
        if(previo) {
            previo.remove()
        }
        modelViewer.cameraOrbit = '90deg 90deg 2m'
        modelViewer.disableZoom = true;
        modelViewer.cameraControls = false;
        let element = document.createElement('div');
        element.innerHTML = 'Cuerpo';
        element.id = 'letrero';
        let box = document.getElementById('box')
        //console.log(box)
        let styleEdit = {
            //2,
            position: 'absolute',
            top: '50%',
            left: '25%',
            color: '#000',
            backgroundColor: '#fff',
            fontSize: '30px',
            padding: '40px',
            borderRadius: '30px'
        }

        Object.assign(element.style, styleEdit)
        box.appendChild(element);

    }

    const orugaPosition = () => {
        let previo = document.getElementById('letrero');
        if(previo) {
            previo.remove()
        }
        modelViewer.cameraOrbit = '-120deg 120deg 2m'
        modelViewer.disableZoom = true;
        modelViewer.cameraControls = false;
        let element = document.createElement('div');
        element.innerHTML = 'Orugas';
        element.id = 'letrero';
        let box = document.getElementById('box')
        //console.log(box)
        let styleEdit = {
            //2,
            position: 'absolute',
            top: '35%',
            left: '45%',
            color: '#000',
            backgroundColor: '#fff',
            fontSize: '30px',
            padding: '40px',
            borderRadius: '30px'
        }

        Object.assign(element.style, styleEdit)
        box.appendChild(element);

    }
    
    return(
            
            <Box style={{height: '100%', width: '100%'}} id="box">
                    <model-viewer
                        id="machine"
                        src={newMachine}
                        style={{height: '100%', width: '80%', float: 'left'}}
                        //camera-controls
                        
                        loading="eager"
                        camera-orbit="45deg 90deg 2.5m"
                        //autoplay
                        //ar 
                        //ar-modes="webxr scene-viewer"
                        scale="0.001 0.001 0.001"
                        alt="A Material Picking Example"
                    >
                    

                    </model-viewer>
                <div style={{float: 'right' ,height: '100%', width: '20%', textAlign: 'center', backgroundColor: 'transparent', paddingTop: 70 }}>
                <button onClick={() => terminar()}style={{
                        minWidth: 170, 
                        margin: 10, 
                        padding: 20, 
                        fontSize: 20,
                        borderRadius: 30
                    }}>Terminar</button>
                    <button onClick={() => cabinaPosition()}style={{
                        minWidth: 170, 
                        margin: 10, 
                        padding: 20, 
                        fontSize: 20,
                        borderRadius: 30
                    }}>Cabina</button>
                    <button onClick={() => palaPosition()} style={{
                        minWidth: 170, 
                        margin: 10, 
                        padding: 20, 
                        fontSize: 20,
                        borderRadius: 30
                    }}>Balde</button>
                    <button onClick={() => brazoPosition()} style={{
                        minWidth: 170, 
                        margin: 10, 
                        padding: 20, 
                        fontSize: 20,
                        borderRadius: 30
                    }}>Brazo</button>
                    <button onClick={() => cuerpoPosition()} style={{
                        minWidth: 170, 
                        margin: 10, 
                        padding: 20, 
                        fontSize: 20,
                        borderRadius: 30
                    }}>Cuerpo</button>
                    <button onClick={() => orugaPosition()} style={{
                        minWidth: 170, 
                        margin: 10, 
                        padding: 20, 
                        fontSize: 20,
                        borderRadius: 30
                    }}>Oruga</button>

                </div>
            
            </Box>
            
        
    )
}

export default MVAvatar