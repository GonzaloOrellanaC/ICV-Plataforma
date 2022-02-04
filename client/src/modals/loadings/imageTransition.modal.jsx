import { 
    Box, 
    Modal,
    CircularProgress

} from '@material-ui/core';
import { styleImageTransitionModal } from '../../config';

const ImageTransitiongModal = ({open, imagePath}) => {

    console.log(imagePath)

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