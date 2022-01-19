import '@google/model-viewer';
//import './domarrow'
import { Box, Button, Drawer, Fab, IconButton, SwipeableDrawer } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { LoadingModal } from '../../modals';
import { FilesToStringDatabase, machinesPartsDatabase } from '../../indexedDB';
import { BottomNavbar } from '../../containers';
import { Close, Menu } from '@material-ui/icons';

const MVAvatar = ({machine}) => {

    const [ modelViewer, setModelViewer ] = useState();
    const [ newMachine, setNewMachine ] = useState();
    const [ progress, setProgress ] = useState(0);
    const [ openLoader, setOpenLoader ] = useState(false);
    const [ open, setOpen ] = useState(false);
    const [ listaPartes, setListaPartes ] = useState([]);
    const [ title, setTitle ] = useState('');
    const [ isSelected, setIsSelected ] = useState('');

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
        //console.log(mv)
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

        mv.addEventListener('error', (err) => {
            console.log(err)
        })
    }

    useEffect(() => {
        initModelViewer()
    }, []);

    const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    
    const handleDrawerClose = () => {
        setOpen(false);
    };

    const getNewElement =  (element, index) => {
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
        setIsSelected('')
        setOpenLoader(true)
        setProgress(0)
        handleDrawerClose()
        setTimeout(async() => {
            let db = await FilesToStringDatabase.initDb3DFiles();
            let data = await FilesToStringDatabase.buscarPorNombreModelo(element.nameModel, db.database);
            var json = data.data;
            var blob = new Blob([json]);
            var url = URL.createObjectURL(blob);
            setTitle(changeName(element.name))
            setNewMachine(url);
        }, 1000);
    }

    const setPreview = () => {
        handleDrawerClose();
        setIsSelected('primary')
        setOpenLoader(true)
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
                        flexShrink: 0,
                        backgroundColor: 'transparent'
                        /* '& .MuiDrawer-paper': {
                        width: '30%',
                        boxSizing: 'border-box',
                        }, */
                    }}
                    disableBackdropTransition={!iOS} 
                    disableDiscovery={iOS} 
                    variant="persistent"
                    anchor="left"
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
                    <model-viewer
                        id="machine"
                        src={newMachine}
                        style={{height: '100%', width: '100%', float: 'left'}}
                        camera-orbit="45deg 90deg 2.5m"
                        scale="0.001 0.001 0.001"
                        alt="A Material Picking Example"
                        //auto-rotate
                    >

                    </model-viewer>
                    <LoadingModal open={openLoader} progress={progress} loadingData={'Preparando vista 3D...'} withProgress={true}/>
                    <div style={{position: 'absolute', bottom: 0, left: 0, width: '100%', backgroundColor: 'transparent', textAlign: 'center'}}>
                        <div style={{width: '60%', backgroundColor: 'transparent', textAlign: 'center', marginLeft: 'auto', marginRight: 'auto'}}>
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