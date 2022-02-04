import { Box, Modal } from "@material-ui/core"
import { styleModalReport } from '../../config';
import jspdf from "jspdf";
import html2canvas from 'html2canvas'

import './pdf.modal.css'


const PdfModal = ({open, reportData, onlyClose}) => {
    const doc = new jspdf('p', 'px', 'letter');

    console.log(reportData);

    const print = () => {
        const specialElementHandlers = {
            '#editor': function (element, renderer) {
              return true;
            }
        };
        const pdfTable = document.getElementById('pdfTable');

        doc.html(pdfTable.innerHTML,{callback: (document) => {
            document.save()
        },
        x: 0,
        y: 0,
        });

        /* html2canvas(pdfTable).then(canvas=>{
            console.log(canvas); 
            
        }) */

        

        


        /* doc.html(pdfTable.innerHTML, 15, 15, {
        width: 190,
        'elementHandlers': specialElementHandlers
        });

        doc.save('tableToPdf.pdf'); */

    }
    return(
        <Modal
            open={open}
        >
            <Box sx={styleModalReport} >
                <button onClick={()=>print()}>
                    imprimir
                </button>
                <div id="pdfTable" style={{width:'100%', padding: 10, margin: 10}}>
                    <table style={{width:'100%'}}>
                            <tr>
                                <th>Company</th>
                                <th>Contact</th>
                                <th>Country</th>
                            </tr>
                            <tr>
                                <td>Alfreds Futterkiste</td>
                                <td>Maria Anders</td>
                                <td>Germany</td>
                            </tr>
                            <tr>
                                <td>Centro comercial Moctezuma</td>
                                <td>Francisco Chang</td>
                                <td>Mexico</td>
                            </tr>
                            <tr>
                                <td>Alfreds Futterkiste</td>
                                <td>Maria Anders</td>
                                <td>Germany</td>
                            </tr>
                            <tr>
                                <td>Centro comercial Moctezuma</td>
                                <td>Francisco Chang</td>
                                <td>Mexico</td>
                            </tr>
                            <tr>
                                <td>Alfreds Futterkiste</td>
                                <td>Maria Anders</td>
                                <td>Germany</td>
                            </tr>
                            <tr>
                                <td>Centro comercial Moctezuma</td>
                                <td>Francisco Chang</td>
                                <td>Mexico</td>
                            </tr>
                            <tr>
                                <td>Alfreds Futterkiste</td>
                                <td>Maria Anders</td>
                                <td>Germany</td>
                            </tr>
                            <tr>
                                <td>Centro comercial Moctezuma</td>
                                <td>Francisco Chang</td>
                                <td>Mexico</td>
                            </tr>
                            <tr>
                                <td>Alfreds Futterkiste</td>
                                <td>Maria Anders</td>
                                <td>Germany</td>
                            </tr>
                            <tr>
                                <td>Centro comercial Moctezuma</td>
                                <td>Francisco Chang</td>
                                <td>Mexico</td>
                            </tr>
                            <tr>
                                <td>Alfreds Futterkiste</td>
                                <td>Maria Anders</td>
                                <td>Germany</td>
                            </tr>
                            
                        </table>
                </div>
            </Box>

        </Modal>
    )
}

export default PdfModal