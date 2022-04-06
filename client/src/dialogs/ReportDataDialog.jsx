import { faArrowRight, faArrowUp, faCamera } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, Slide, Switch, TextField} from '@material-ui/core'
import { Close } from '@material-ui/icons';
import { useEffect, forwardRef, useState } from 'react';
import { dateSimple, dateWithTime, imageToBase64, uploadImage } from '../config';
import { LoadingModal } from '../modals';
import ImageDialog from './ImageDialog';
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const ReportDataDialog = ({open, handleClose, report, item, index, executionReport, gruposKeys, indexActivity, indexGroup, save, setChecks}) => {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [openImageDialog, setOpenImageDialog] = useState(false)
  const [imagePreview, setImagePreview] = useState('')
  const [openLoadingModal, setOpenLoadinModal] = useState(false)

  useEffect(() => {
    if(item.messages) {
      setMessages(item.messages)
      setTimeout(() => {
        document.getElementById('commits').scrollTop = document.getElementById('commits').scrollHeight
      }, 50);
    }
  }, [])

  const changeUnidad = (value) => {
    item.unidadData = value
  }

  const inputMessage = (value) => {
    setMessage(value)
  }

  const upImage = () => {
    document.getElementById('foto').click();
  }
  
  const uploadImageReport = async (file) => {
    if(file) {
      setOpenLoadinModal(true)
      let res = await imageToBase64(file)
      setTimeout(() => {
        if(res) {
          saveMessage(res, `Imagen ${Date.now()}`)
          setOpenLoadinModal(false)
        }
      }, 1000);
    }
}

  const saveMessage = (image, messagePicture) => {
    if(message !== ''||messagePicture) {
      if(image) {
        item.haveClip = true
      }
      let m
      if(messagePicture) {
        m = messagePicture
      }else{
        m = message
      }
      let messageData = {
        id: Date.now(),
        content: m,
        name: `${localStorage.getItem('name')} ${localStorage.getItem('lastName')}`,
        user: localStorage.getItem('_id'),
        urlBase64: image
      }
      console.log(messageData)
      messages.push(messageData)
      setMessages(messages)
      item.messages = messages
      setMessage('')
      setTimeout(() => {
        document.getElementById('commits').scrollTop = document.getElementById('commits').scrollHeight
      }, 50);
    }
  }

  const saveItem = (index, state, item) => {
    if(messages.length > 0) {
      save(index, state, item)
      handleClose()
    }else{
      alert('Debe dejar un comentario')
    }
  }

  const openImage = (image) => {
    setImagePreview(image)
    setOpenImageDialog(true)
  }

  const handleCloseImage = () => {
    setOpenImageDialog(false)
  }
  
  return (
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <div style={{position: 'absolute', right: 50, top: 10}}>
          <IconButton onClick={()=>handleClose()} style={{position: 'fixed'}}><Close/></IconButton>
        </div>
        <DialogTitle style={{marginTop: 30}}>{item.taskdesc}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description" style={{whiteSpace: 'pre-line'}}>
            {item.obs01} <br />
          </DialogContentText>
        </DialogContent>
        {(item.unidad !== '*') && <Grid container>
          <Grid item xl={3}>
            <div style={{marginLeft: 24, marginBottom: 16}}>
              <h3>Total utilizado</h3>
              <TextField id="standard-basic" label={item.unidad} variant="standard" type='number' value={item.unidadData} onChange={(e)=>changeUnidad(e.target.value)}/>
            </div>
          </Grid>
        </Grid>}
        <div style={{paddingLeft: 24, paddingRight: 24, marginBottom: 50}}>
          <div style={{width: '100%', height: 250, borderWidth: 2, borderStyle: 'solid', borderColor: '#ccc', borderRadius: 20, position: 'relative'}}>
            <div id='commits' style={{width: '100%', height: 190, overflowY: 'auto', scrollBehavior: 'smooth'/* borderWidth: 2, borderStyle: 'solid', borderColor: '#ccc', borderRadius: 20 */}}>
              {
                messages.map((message, index) => {
                  return(
                    <div key={index} style={
                      {
                        position: 'relative',
                        color: '#555', 
                        padding: 5, 
                        margin: 5, 
                        borderRadius: 20, 
                        borderWidth: 2, 
                        borderStyle: 'solid', 
                        borderColor: '#dddddd', 
                        backgroundColor: '#F5F5F5'
                        }
                        }>
                      <p style={{marginBottom: 0, fontSize: 10}}><strong>{message.name}</strong></p>
                      {message.urlBase64 && <img src={message.urlBase64} height={70} onClick={() => openImage(message.urlBase64)} />}
                      <p style={{marginBottom: 20, whiteSpace: 'pre-line'}}>{message.content}</p>
                      <p style={{position: 'absolute', fontSize: 10, right: 5, bottom: 0}}>{dateWithTime(message.id)}</p>
                    </div>
                  )
                })
              }
            </div>
            <div style={{width: '100%', height: 50, borderTopWidth: 2, borderTopStyle: 'solid', borderTopColor: '#ccc', position: 'absolute', bottom: 0, left: 0, paddingLeft: 10, paddingRight: 10}}>
              <form>
                <div style={{width: '70%', float: 'left'}}>
                  <textarea value={message} placeholder='Ingrese comentarios' type="text" style={{width: '100%', borderColor: 'transparent', resize: 'none'}} onChange={(e) => {inputMessage(e.target.value)}}/>
                </div>
                <div style={{width: '30%', float: 'right', textAlign: 'right'}}>
                  <IconButton onClick={() => upImage()}>
                    <FontAwesomeIcon icon={faCamera} />
                  </IconButton>
                  <IconButton onClick={() => saveMessage()}>
                    <FontAwesomeIcon icon={faArrowRight} />
                  </IconButton>
                  <input autoComplete="off" type="file" id="foto" accept="image/x-png,image/jpeg" onChange={(e)=>{uploadImageReport(e.target.files[0])}} hidden />
                  {/* <input type='button' value={'SEND'} style={{height: 40}} onClick={() => saveMessage()}/> */}
                </div>
              </form>
            </div>
          </div>
        </div>
        <DialogActions>
          {/* <Button style={{color: '#B81E05'}} onClick={}>Cancelar</Button> */}
          <Button style={{backgroundColor: '#D5CC41', color: '#fff'}} onClick={() => {saveItem(index, false, item)}}>Guardar sin ejecutar</Button>
          <Button style={{backgroundColor: '#9ACF26', color: '#fff'}} onClick={() => {saveItem(index, true, item)}}>Guardar ejecutado</Button>
        </DialogActions>
        {
          openImageDialog && <ImageDialog open={openImageDialog} image={imagePreview} handleClose={handleCloseImage}/>
        }
        {
          openLoadingModal && <LoadingModal open={openLoadingModal} withProgress={false} loadingData={'Cargando imágen'}/>
        }
      </Dialog>
      )
}

export default ReportDataDialog