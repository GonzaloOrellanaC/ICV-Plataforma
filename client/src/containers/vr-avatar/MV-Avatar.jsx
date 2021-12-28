import '@google/model-viewer';
//import './domarrow'
import { Box } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { LoadingModal } from '../../modals';
import { FilesToStringDatabase } from '../../indexedDB';

const MVAvatar = ({machine}) => {

    const [ modelViewer, setModelViewer ] = useState();
    const [ newMachine, setNewMachine ] = useState();
    const [ progress, setProgress ] = useState(0);
    const [ openLoader, setOpenLoader ] = useState(false);

    const readFileDatabase = async () => {
        setOpenLoader(true)
        const db = await FilesToStringDatabase.initDb3DFiles();
        if(db) {
            const files = await FilesToStringDatabase.consultar(db.database);
            if(files) {
                var json = files[machine.id].data;
                var blob = new Blob([json]);
                var url = URL.createObjectURL(blob);
                setNewMachine(url);
            }
        }
    }

    const initModelViewer = async () => {
        readFileDatabase();
        setModelViewer(document.querySelector("model-viewer#machine"))
        let mv = document.querySelector("model-viewer#machine")
        mv.addEventListener('load', (e) => {
            setOpenLoader(false)
            const changeColor = async (event) => {
                let material = mv.materialFromPoint(event.clientX, event.clientY);
                if(material != null) {

                }
            }
            mv.addEventListener("click", changeColor);
            setTimeout(() => {
                mv.cameraControls = true;
            }, 2000);
        })
        mv.addEventListener('progress', (e) => {
            setProgress(e.detail.totalProgress * 130)
            if(e.detail.totalProgress == 1) {
                setProgress(100)
                setTimeout(() => {
                    setOpenLoader(false)
                }, 2000);
            }
        })
    }

    useEffect(() => {
        initModelViewer()
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
        let styleEdit = {
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
        let styleEdit = {
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
        let styleEdit = {
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
                        camera-orbit="45deg 90deg 2.5m"
                        scale="0.001 0.001 0.001"
                        alt="A Material Picking Example"
                    >

                    </model-viewer>
                    <LoadingModal open={openLoader} progress={progress} loadingData={'Preparando vista 3D...'} withProgress={true}/>


                {
                     (machine.type === 'Pala') && <div style={{float: 'right' ,height: '100%', width: '20%', textAlign: 'center', backgroundColor: 'transparent', paddingTop: 70 }}>
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
                }
            
            </Box>
            
        
    )
}

export default MVAvatar