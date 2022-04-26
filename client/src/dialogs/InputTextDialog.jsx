import { Button, Dialog, IconButton, Slide, TextField } from "@material-ui/core"
import { ArrowForward, Close } from "@material-ui/icons"
import { forwardRef } from "react";
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const InputTextDialog = ({handleClickOpen, open, handleClose, message, inputMessage, saveMessage}) => {
    setTimeout(() => {
        document.getElementById('textField').focus()
    }, 100);
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
                    style={{position: 'absolute', top: 20, left: 20, backgroundColor: '#fff'}}
                    onClick={handleClose}
                    >
                    <Close />
                </IconButton>
                <IconButton
                    style={{position: 'absolute', top: 20, right: 20, backgroundColor: '#fff'}}
                    onClick={() => {saveMessage(); handleClose()}}
                    >
                    Enviar <ArrowForward />
                </IconButton>
                <div style={{padding: 30, textAlign: 'center', height: '100vh'}}>
                    <TextField style={{width: '70%'}} id="textField" value={message} onChange={(e) => {inputMessage(e.target.value)}}/>
                </div>
            </Dialog>
        </div>
    )
}

export default InputTextDialog