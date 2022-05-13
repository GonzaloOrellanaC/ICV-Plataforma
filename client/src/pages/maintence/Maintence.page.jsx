import { Box } from "@material-ui/core";
import { useState, useEffect } from "react";
import { apiIvcRoutes } from '../../routes'


const MaintencePage = () => {

    const [ fileList, setFileList ] = useState([]);
    const [ machineList, setMachineList ] = useState([]);

    useEffect(() => {
        apiIvcRoutes.getMachines().then(data => {
            if(data.data) {
                setMachineList(data.data)
            }
        })
    }, [])

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