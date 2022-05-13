import '@google/model-viewer';
import './style.css'
import { Box, Button, Drawer, Fab, IconButton } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { LoadingModal } from '../../modals';
import { FilesToStringDatabase, machinesPartsDatabase } from '../../indexedDB';
import { Close, ControlCamera, Menu } from '@material-ui/icons';
import buttonSelections from './buttonSelections';

const MVAvatar = ({machine}) => {

    const [ modelViewer, setModelViewer ] = useState();
    const [ newMachine, setNewMachine ] = useState();
    const [ progress, setProgress ] = useState(0);
    const [ openLoader, setOpenLoader ] = useState(false);
    const [ open, setOpen ] = useState(false);
    const [ listaPartes, setListaPartes ] = useState([]);
    const [ title, setTitle ] = useState('');
    const [ isSelected, setIsSelected ] = useState('');
    const [ imagePath, setImagePath ] = useState('');
    const [ cameraOrbit, setCameraOrbit ] = useState("45deg 81deg 100m")
    const [ scale, setScale ] = useState("0.009 0.009 0.009")
    const [ cameraTarget, setCameraTarget ] = useState("auto auto auto")
    const [ isButton, setIsButton ] = useState(false)
    const [ buttons, setButtons ] = useState([]);
    //const [ machineModel, setMachineModel ] = useState()

    useEffect(() => {
        setButtons([])
        initModelViewer()
    }, []);

    const readFileDatabase = async () => {
        setIsSelected('primary')
        setOpenLoader(true)
        setProgress(0)
        const db = await FilesToStringDatabase.initDb3DFiles();
        if(db) {
            //let files = new Array();
            let file = await FilesToStringDatabase.buscarPorNombreModelo(`Preview_${machine.model}`, db.database);
            var json = file.data;
            var blob = new Blob([json]);
            var url = URL.createObjectURL(blob);
            setNewMachine(url);
            setTitle(changeName('Preview'))
        };
        const machinesPartsDb = await machinesPartsDatabase.initDb();
        if(machinesPartsDb) {
            let readList = new Array();
            readList = await machinesPartsDatabase.consultar(machinesPartsDb.database);
            readList.forEach((e, i) => {
                e.isSelected = '';
            })
            setListaPartes(readList.filter(item => { if((item.model === machine.model) && (item.name != 'Preview')) { return item }}));
        }
    }

    const changeName = (value) => {
        if(value === 'Preview') {
            return `Vista General ${machine.brand} ${machine.model}`
        }else if(value === 'Preview_Con_Texturas') {
            return `Vista General ${machine.brand} ${machine.model} Color`
        }else if(value === 'Sistema_direccion') {
            return `Sistema de Dirección`
        }else if(value === 'Sistema_hidraulico') {
            return `Sistema Hidraulico`
        }else if(value === 'Sistema_neumatico') {
            return `Sistema Neumatico`
        }else if(value === 'Mando_de_giro') {
            return `Mando de Giro`
        }else if(value === 'Mando_final') {
            return `Mando Final`
        }else if(value === 'Sistema_rodado') {
            return `Sistema Rodado`
        }else{
            return value
        }
    }


    const initModelViewer = async () => {
        readFileDatabase();
        setModelViewer(document.querySelector("model-viewer#machine"))
        let mv = document.querySelector("model-viewer#machine");

        mv.addEventListener('model-visibility', (e) => {
            
        })
        mv.addEventListener('load', () => {
            setOpenLoader(false)
            mv.cameraControls = true;
            document.getElementById('image').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('machine').style.opacity = '1';
                document.getElementById('image').style.height = '0px';
                document.getElementById('machine').style.height = '100%';
            }, 2000);
        })

        mv.addEventListener('click', (e) => {
        })

        mv.addEventListener('error', (err) => {
        })
    }

    const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    
    const handleDrawerClose = () => {
        setOpen(false);
    };

    const getNewElement =  (element, index) => {
        handleDrawerClose();
        setCenter();
        setButtons([])
        setTimeout(() => {
            setTitle(changeName(element.name))
            if(element.brand === 'CATERPILLAR') {
                if (element.name === 'Preview_Con_Texturas') {
                    setProgress(0)
                    setOpenLoader(true)
                }else{
                    let imagePath = `../assets/transiciones/${element.brand}/${element.model}/Pantalla_de_carga_${element.name}.png`;
                    setImagePath(imagePath);
                    
                    document.getElementById('machine').style.opacity = '0';
                    setTimeout(() => {
                        document.getElementById('machine').style.height = '0px';
                        document.getElementById('image').style.height = '80%';
                        document.getElementById('image').style.opacity = '1';
                    }, 500);
                }
            }else{
                setProgress(0)
                setOpenLoader(true)
            }
            
                
            listaPartes.forEach((e, i) => {
                if(i === index) {
                    e.isSelected = 'primary'
                }else{
                    e.isSelected = ''
                };
                if(i === (listaPartes.length - 1)) {
                    setListaPartes(listaPartes)
                }
            })
            setTimeout(async() => {
                let db = await FilesToStringDatabase.initDb3DFiles();
                let data = await FilesToStringDatabase.buscarPorNombreModelo(element.nameModel, db.database);
                var json = data.data;
                var blob = new Blob([json]);
                var url = URL.createObjectURL(blob);
                setButtons(buttonSelections(element.name, machine.model));
                setNewMachine(url);
            }, 4000);
        }, 1000);
    }

    const setCenter = () => {
        setCameraOrbit("45deg 81deg 100m")
        setScale("0.009 0.009 0.009")
        setCameraTarget("auto auto auto")
        setIsButton(false)
    }

    const setPreview = () => {
        setOpenLoader(true)
        handleDrawerClose();
        setIsSelected('primary')
        setProgress(0);
        setTimeout( () => {
            readFileDatabase();
        }, 1000);
    }
    
    return(
            
            <Box style={{height: '100%', width: '100%'}} id="box">
                <Drawer 
                    sx={{
                        width: '30%',
                        backgroundColor: 'transparent'
                    }}
                    disableBackdropTransition={!iOS} 
                    disableDiscovery={iOS} 
                    variant="persistent"
                    anchor="top"
                    open={open}
                >
                    <div style={{width: '27vw', textAlign: 'right'}}>
                        <IconButton onClick={()=>handleDrawerClose()}>
                            <Close />
                        </IconButton>
                    </div>
                    <div>
                    <div style={{width: '100%', textAlign: 'center'}}>
                                    <Button color={isSelected} style={{width: '90%', marginBottom: 10}} variant="outlined" onClick={() => {setPreview()}}>
                                        <p>{changeName('Preview')}</p>
                                    </Button>
                                </div>
                        {
                            listaPartes.map((element, index) => {
                                
                                return(
                                    <div key={index} style={{width: '100%', textAlign: 'center'}}>
                                        <Button color={element.isSelected} style={{width: '90%', marginBottom: 10}} variant="outlined" onClick={() => {getNewElement(element, index)}}>
                                            <img 
                                            src="../assets/no-image.png" 
                                            style={{
                                                width: 50, 
                                                height: 50, 
                                                borderRadius: 30, 
                                                objectFit: 'cover',
                                                position: 'absolute',
                                                left: 10
                                                }} alt="" />
                                            <p>{changeName(element.name)}</p>
                                        </Button>
                                    </div>
                                )
                            })
                        }
                    </div>

                </Drawer>  
                
                <img  src={imagePath} id="image" className='image' height={640} width={480}/>
                <model-viewer
                    id="machine"
                    src={newMachine}
                    style={{height: '100%', width: '100%', backgroundColor: '#414646', opacity: 1, transition: 'opacity 0.5s' }}
                    camera-target={cameraTarget}
                    camera-orbit={cameraOrbit}
                    scale={scale}
                    alt="A Material Picking Example"
                    touch-action="none" 
                    min-field-of-view="45deg" 
                    interpolation-decay="200" 
                    min-camera-orbit="auto auto 10%" 
                    oncontextmenu="return false;"
                >
                       {
                           buttons.map((e, i) => {
                               return (
                                <button 
                                    onClick={()=>{setCameraOrbit(e.orbit); setCameraTarget(e.target); setIsButton(true)}}
                                    key={i}
                                    className="view-button" 
                                    slot={`hotspot-${i}`} 
                                    data-position={e.position} 
                                    data-normal={e.normal}  
                                    data-orbit={e.orbit}  
                                    data-target={e.target} >
                                    {e.title}
                                </button>
                               )
                           })
                       }
                </model-viewer>
                
                <LoadingModal open={openLoader} progress={progress} loadingData={'Preparando vista 3D...'} withProgress={true}/>
                <div style={{position: 'absolute', bottom: 0, left: 0, width: '100%', backgroundColor: 'transparent', textAlign: 'center'}}>
                    <div style={{width: '60%', backgroundColor: 'transparent', textAlign: 'center', marginLeft: 'auto', marginRight: 'auto'}}>
                        {isButton && <IconButton onClick={()=>setCenter()}>
                            <ControlCamera style={{color: 'white', fontFamily: 'Raleway', marginRight: 10}} /> <p style={{color: 'white', fontFamily: 'Raleway'}}>Centrar cámara</p>
                        </IconButton>}
                        <h2 style={{color: 'white', fontFamily: 'Raleway'}}>{title}</h2>
                    </div>
                </div>
                    
                {!open && <Fab 
                    onClick={() => handleDrawerOpen()} 
                    style={{
                        position: 'absolute', 
                        left: 10, 
                        top: 10, 
                        boxShadow: 'none', 
                        backgroundColor: 'transparent'
                        }} color="primary"
                >
                    <Menu />
                </Fab>}
            </Box>
    )
}

export default MVAvatar