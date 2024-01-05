import { 
    Box, 
    Modal,
    CircularProgress

} from '@mui/material';
import { styleImageTransitionModal } from '../../config';

const ImageTransitiongModal = ({open, imagePath}) => {
    return(
        <Modal
            open={open}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box  sx={styleImageTransitionModal}>
                <img src={imagePath} />
            </Box>
        </Modal>
    )
}

export default ImageTransitiongModal