import { 
    Box, 
    Modal,
    CircularProgress

} from '@material-ui/core';
import { styleModal } from '../../config';

const LoadingModal = ({open, progress, loadingData, withProgress}) => {

    
    
    return(
        <Modal
            open={open}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={styleModal}>
                <div style={{height: 300, textAlign: 'center'}}>
                    {
                        withProgress &&
                        <CircularProgress variant="determinate" size={200} value={Number(progress)}/>
                    }
                    {
                        !withProgress &&
                        <CircularProgress size={200} />
                    }
                    <h2>{loadingData}</h2>
                </div>
            </Box>
        </Modal>
    )
}

export default LoadingModal