import { 
    Box, 
    CircularProgress,
    Dialog

} from '@material-ui/core';

const LoadingLogoDialog = ({open}) => {
    return(
        <Dialog
            open={open}
            PaperProps={{
                style: {
                  backgroundColor: 'transparent',
                  boxShadow: 'none',
                  height: 300,
                  width: 300
                },
            }}
        >
            <div style={{backgroundColor: 'transparent', position: 'relative', height: 300, width: 300, overflow: 'hidden'}}>
                <CircularProgress size={300} color={'primary'} />
                <img src="../assets/logo_icv_blanco.png" width={150} style={{position: 'absolute', top: 90, right: 70}} />
            </div>
        </Dialog>
    )
}

export default LoadingLogoDialog