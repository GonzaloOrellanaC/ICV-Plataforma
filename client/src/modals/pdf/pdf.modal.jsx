import { Box, Modal } from "@material-ui/core"
import { getMachineData, styleModalReport } from '../../config';
import toPDF from './toPDF'
import './pdf.modal.css';
import { useEffect } from "react";
import { useState } from "react";
//import getMachineData from '../../config'


const PdfModal = ({open, reportData, onlyClose}) => {

    const [ machineData, setMachineData ] = useState();

    useEffect(async() => {
        setMachineData(await getMachineData(reportData.machine));
    }, [])
    


    const print = () => {
        
        toPDF(reportData, machineData[0]);

    }
    return(
        <Modal
            open={open}
        >
            <Box sx={styleModalReport} >
                <button onClick={()=>print()}>
                    imprimir
                </button>

            </Box>

        </Modal>
    )
}

export default PdfModal