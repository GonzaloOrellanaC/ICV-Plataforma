import { Box, Button, CircularProgress, Modal } from "@material-ui/core"
import { getMachineData, styleModal, styleModalReport } from '../../config';
/* import toPDF from './toPDF' */
import './pdf.modal.css';
import { useEffect } from "react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClosedCaptioning, faPrint } from "@fortawesome/free-solid-svg-icons";
import { Close } from "@material-ui/icons";
import toPDF from "./toPDF";
//import getMachineData from '../../config'


const PdfModal = ({open, reportData, close, setUrlPdf}) => {

    const [ machineData, setMachineData ] = useState();
    const [ fileName, setFileName ] = useState(null);
    const [ printing, setPrinting ] = useState(false)

    useEffect(async() => {
        setMachineData(await getMachineData(reportData.machine));
        setFileName(`Orden_de_trabajo_${reportData.idIndex}_aprobado`)
    }, [reportData])

    const stopPrintingLoad = () => {
        setPrinting(false);
        close()
        setFileName(null)
    }

    const changeName = (value) => {
        setFileName(value);
    }
    
    const print = () => {
        setPrinting(true)
        try{
            toPDF(reportData, machineData[0]/* , stopPrintingLoad, fileName */)
            .then(data => {
                console.log(data)
                setPrinting(false)
                alert('PDF Generado.')
                close()
            })
        }catch (err) {
            alert('Error al descargar. Cerrando ventana.')
            setPrinting(false)
            close()
            setFileName(null)
        }
    }
    return(
        <Modal
            open={open}
        >
            <Box sx={styleModal} >
                <div style={{width: '100%', position: 'absolute', top: 0, left: 0, textAlign: 'right'}}>
                    <Button style={{borderRadius: '50%', width: 36, height: 36}} onClick={() => close()}>
                        <Close />
                    </Button>
                </div>
                {/* <div style={{width: '100%', height: 60}}>
                    <p style={{marginTop: 0}}>Editar nombre:</p>
                    <input 
                        style={{width: '80%', float: 'left', textAlign: 'right'}} 
                        width={'100%'} 
                        type="text"
                        value={fileName}
                        onChange={(e) => {changeName(e.target.value)}} />
                    <p style={{width: '10%', float: 'left', margin: 0, textAlign: 'left'}}>
                        .pdf
                    </p>
                </div> */}
                <div style={{width: '100%', marginTop: 10, textAlign: 'center'}}>
                    <button disabled={printing} onClick={()=>print()} style={{textAlign: 'center'}}>
                    {!printing && <FontAwesomeIcon icon={faPrint} size='5x' style={{color: '#888'}}/>}
                    {printing && <CircularProgress style={{height: 66, width: 66, color: '#888'}} />}
                    {!printing && <p style={{marginTop: 10, marginBottom: 0, fontSize: 26, color: '#888'}}>Generar PDF</p>}
                    {printing && <p style={{marginTop: 10, marginBottom: 0, fontSize: 26, color: '#888'}}>Generando...</p>}
                    </button>
                </div>

            </Box>

        </Modal>
    )
}

export default PdfModal