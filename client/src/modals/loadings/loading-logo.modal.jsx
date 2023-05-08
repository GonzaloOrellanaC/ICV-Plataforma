import { 
    Box, 
    Modal,
    CircularProgress

} from '@material-ui/core';
import { styleModalLogo } from '../../config';

const LoadingLogoModal = ({open}) => {
    return(
        <Modal
            open={open}
        >
            <Box sx={styleModalLogo}>
                <CircularProgress size={300} color={'primary'} />
                <img src="../../assets/logo_icv_blanco.png" width={150} style={{position: 'absolute', top: 120, right: 40}} />
            </Box>
        </Modal>
    )
}

export default LoadingLogoModal