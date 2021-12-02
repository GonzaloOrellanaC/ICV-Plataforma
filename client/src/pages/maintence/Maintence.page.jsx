import { Box } from "@material-ui/core";
import { useState, useEffect } from "react";
import { apiIvcRoutes } from '../../routes'


const MaintencePage = () => {

    const [ fileList, setFileList ] = useState([]);
    const [ machineList, setMachineList ] = useState([]);

    useEffect(() => {
        apiIvcRoutes.getMachines().then(data => {
            console.log(data.data);
            if(data.data) {
                setMachineList(data.data)
            }
        })
        /* apiIvcRoutes.getFiles().then(data => {
            console.log(data)
            if(data.data) {
                setFileList(data.data);
                console.log(fileList);
                if(fileList.length > 0) {
                    fileList.forEach(file => {
                        apiIvcRoutes.getPMs(file)
                        .then(data => {
                            console.log(data)
                        })
                    })
                } 
            }
        }) */
    }, [])

    const readingData = () => {
        console.log('leyendo archivos')
        /* apiIvcRoutes.getFiles().then(data => {
            setFileList(data.data);
            if(data.data) {
                console.log(fileList);
                fileList.forEach(file => {
                    apiIvcRoutes.getPMs(file)
                    .then(data => {
                        console.log(data)
                    })
                }) 
            }
        }) */
    }

    return(
        <Box>
            <div>
                <h1>
                    Hello!!
                </h1>
            </div>
        </Box>
    )
}

export default MaintencePage