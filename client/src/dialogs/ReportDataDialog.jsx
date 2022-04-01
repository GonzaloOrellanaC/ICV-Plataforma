import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Slide, Switch, TextField} from '@material-ui/core'
import { useEffect, forwardRef } from 'react';
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const ReportDataDialog = ({open, handleClose, report, item, index}) => {
  useEffect(() => {
    
  }, [])
  
  return (
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        style={{minWidth: '40%'}}
      >
        <DialogTitle>{item.taskdesc}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <p>Ejecutado: <Switch /></p> 
            {item.obs01}
          </DialogContentText>
        </DialogContent>
        {(item.unidad !== '*') && <Grid container>
          <Grid item xl={3}>
            <div style={{marginLeft: 24}}>
              <TextField id="standard-basic" label={item.unidad} variant="standard" type='number'/>
            </div>
          </Grid>
        </Grid>}
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={() => {handleClose()}}>Guardar</Button>
        </DialogActions>
      </Dialog>
      )
}

export default ReportDataDialog