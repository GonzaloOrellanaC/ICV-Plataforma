import { /* useState, */ useEffect } from 'react';
import { 
    Box, 
    Modal,
    CircularProgress
    /* 
    Toolbar,
    Fab, */

} from '@material-ui/core';
/* import { Close } from '@material-ui/icons'; */
import { styleModal } from '../../config';

const LoadingModal = ({open, progress, loadingData}) => {
    /* const [ operarios, setOperarios ] = useState([]);
    const [ colorState, setColorState ] = useState();
    const { reportType, idIndex, guide, state } = report; */

    useEffect(() => {
          
    }, [])
    
    return(
        <Modal
            open={open}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={styleModal}>
                <div style={{height: 300, textAlign: 'center'}}>
                    <CircularProgress variant="determinate" size={200} value={progress}/>
                    <h1>{loadingData}</h1>
                </div>
            </Box>
        </Modal>
    )
}

export default LoadingModal