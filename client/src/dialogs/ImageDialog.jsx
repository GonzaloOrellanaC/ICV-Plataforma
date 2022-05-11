import { Button, Dialog, IconButton, Slide } from "@material-ui/core"
import { Close } from "@material-ui/icons"
import { forwardRef } from "react";
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ImageDialog = ({handleClickOpen, open, handleClose, image}) => {

    return (
        <div>
            <Button variant="outlined" onClick={handleClickOpen}>
                Open full-screen dialog
            </Button>
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <IconButton
                    style={{position: 'absolute', top: 20, right: 20, backgroundColor: '#fff'}}
                    onClick={handleClose}
                    >
                    <Close />
                    </IconButton>
                <div style={{padding: 30, textAlign: 'center', height: '100vh'}}>
                    <img src={image} height={'100%'} /* style={{maxWidth: '100%', maxHeight: '100%'}} */  />
                </div>
            </Dialog>
        </div>
    )
}

export default ImageDialog