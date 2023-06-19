import { faEraser, faPen, faSave } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button, Dialog } from "@material-ui/core"
import { Canvas } from "../containers"

const FirmaUsuarioDialog = ({openSign, setRefCanvasFunction, getImage, clear}) => {
    return (
        <Dialog
            open={openSign}
            adaptiveHeight={true}
            maxWidth={'xl'}
        >
            <div style={{width: 400, padding: 30}}>
                <div style={{width: '100%', textAlign: 'center'}}>
                    <h2>Para continuar deje su firma para la documentación. (Obligatorio)</h2>
                </div>
                <div style={{width: '100%', textAlign: 'center', position: 'relative'}}>
                    <div style={{position: 'absolute', width: '100%', textAlign: 'right', marginTop: 10, paddingRight: 30}}>
                        <FontAwesomeIcon size='lg' icon={faPen} color={'#333'} />
                    </div>
                    <Canvas 
                        disabled={true}
                        width={300} 
                        height={300}
                        setRefCanvas={setRefCanvasFunction}
                    />
                </div>
                <div style={{width: '100%', textAlign: 'center'}}>
                    <div style={{width: '50%', textAlign: 'center', float: 'left'}}>
                        <Button 
                        onClick={()=> clear()} 
                        style={
                            {
                                borderStyle: 'solid',
                                borderWidth: 1,
                                borderColor: '#333',
                                borderRadius: 10
                                }
                            }
                        >
                            <FontAwesomeIcon 
                                size='lg' 
                                icon={faEraser} 
                                color={'#333'} 
                                style={{marginRight: 10}}
                            /> Borrar
                        </Button>
                    </div>
                    <div style={{width: '50%', textAlign: 'center', float: 'right'}}>
                        <Button 
                        onClick={()=> getImage()}
                        style={
                            {
                                borderStyle: 'solid',
                                borderWidth: 1,
                                borderColor: '#333',
                                borderRadius: 10
                                }
                            }>
                            <FontAwesomeIcon 
                                size='lg' 
                                icon={faSave} 
                                color={'#333'} 
                                style={{marginRight: 10}}
                            /> Guardar
                        </Button>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

export default FirmaUsuarioDialog