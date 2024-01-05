import { 
    Box, 
    Dialog, 
    Fab, 
} from '@mui/material';
import { Close } from '@mui/icons-material';

const PreviewDialog = ({open, data, closePreviewModal}) => {
    console.log(data)
    return(
        <Dialog
            open={open}
        >
            <div style={{ width: 600, padding: 10}}>
                <div>
                    <h2>Resumen de Insumos y Materiales</h2>
                </div>
                <div style={{height: 'calc(100vh - 290px)', overflowY: 'auto', borderColor: '#ccc', borderWidth: 1, borderStyle: 'solid', borderRadius: 20, padding: 10, marginTop: 50 }}>
                    {
                        (data.length === 0) ?
                        <div>
                            <h3><strong>OT no registra uso de insumos y materiales para resumir</strong></h3>
                        </div>
                        :
                        data.map((element, i) => {
                            return (
                                <div key={i} style={{ width: '100%' }}>
                                    <h2>
                                        {element.nombre}
                                    </h2>
                                    {
                                        element.data.map((item, index) => {
                                            return (
                                                <div key={index} style={{ fontSize: 16, marginLeft: 20, borderBottomColor: '#ccc', borderBottomWidth: 1, borderBottomStyle: 'solid' }}>
                                                    <p>
                                                        <strong>{item.taskdesc}</strong>
                                                    </p>
                                                    <p>
                                                        Observación:
                                                        <br />
                                                        <strong>{item.obs01}</strong>
                                                    </p>
                                                    <p>
                                                        Unidad de medida: <strong>{item.unidad}</strong>
                                                    </p>
                                                    <p>
                                                        Cantidad proyectada: <strong>{item.cantidad}</strong>
                                                    </p>
                                                    <p>
                                                        Cantidad usada: <strong>{item.unidadData}</strong>
                                                    </p>
                                                    <p>
                                                        Diferencia: <strong>{item.diferencia}</strong>
                                                    </p>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            )
                        })
                    }
                </div>
                <Fab onClick={closePreviewModal} style={{position: 'absolute', right: 10, top: 10, boxShadow: 'none', backgroundColor: 'transparent'}}>
                    <Close style={{color: '#ccc'}} />
                </Fab>
            </div>
        </Dialog>
    )
}

export default PreviewDialog