import { faArrowRight, faImage } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, Slide, TextField } from '@material-ui/core'
import { Close } from '@material-ui/icons'
import { useEffect, forwardRef, useState } from 'react'
import { dateWithTime, imageToBase64 } from '../config'
import { CameraModal, LoadingModal } from '../modals'
import ImageDialog from './ImageDialog'
import ImageAstDialog from './ImageAstDialog'
import {isMobile} from 'react-device-detect'
import InputTextDialog from './InputTextDialog'
import { usersRoutes } from '../routes'
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const ReportDataDialog = (
  {
    open,
    handleClose,
    report,
    item,
    index,
    executionReport,
    gruposKeys,
    indexActivity,
    indexGroup,
    save,
    setChecks
  }
  ) => {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [unidad, setUnidad] = useState()
  const [openImageDialog, setOpenImageDialog] = useState(false)
  const [openImageAstDialog, setOpenImageAstDialog] = useState(false)
  const [imagePreview, setImagePreview] = useState('')
  const [openLoadingModal, setOpenLoadinModal] = useState(false)
  const [openInputTextDialog, setOpenInputTextDialog] = useState(false)
  const [openCamera, setOpenCamera] = useState(false)
  const [astList, setAstList] = useState([])
  const [ast, setAst] = useState(false)
  const [totalMessagesWithPictures, setPicturesOfItem] = useState(1)
  const [indexKey, setIndexKey] = useState()
  const [isEdited, setIsEdited] = useState(false)
  const [canEdit, setCanEdit] = useState(false)
  const isOperator = Boolean(localStorage.getItem('isOperator'))

  useEffect(() => {
    if (
      isOperator ||
      (localStorage.getItem('role') === 'inspectionWorker')||
      (localStorage.getItem('role') === 'maintenceOperator')||
      (localStorage.getItem('role') === 'shiftManager')
    ) 
      {
        setCanEdit(true)
      }
    gruposKeys.map((k, n) => {
      if(k.data === indexGroup) {
        setIndexKey(n)
      }
    })
    if(executionReport.astList) {
      setAstList(executionReport.astList)
    }
    setUnidad(item.unidadData)
    if(item.messages) {
      const total = []
      item.messages.forEach(async (m, i) => {
        const user = await usersRoutes.getUser(m.user)
        console.log(user)
        m.name = `${user.data.name} ${user.data.lastName}`
        if (m.urlBase64) {
          total.push(m)
        }
        if (i == (item.messages.length - 1)) {
          setPicturesOfItem(total.length + 1)
          setMessages(item.messages)
        }
      })

      setTimeout(() => {
        document.getElementById('commits').scrollTop = document.getElementById('commits').scrollHeight
      }, 100);
    }
  }, [])

  const changeUnidad = (value) => {
    setUnidad(value)
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
          if (ast) {
            astList.push({
              id: Date.now(),
              image: res
            })
            executionReport.astList = astList
          } else {
            saveMessage(res, `Imagen ${Date.now()}`)
          }
          setOpenLoadinModal(false)
          setIsEdited(true)
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
        namePicture: image ? `${indexKey}_Tarea_${index + 1}_Foto_${totalMessagesWithPictures}` : null,
        content: m,
        name: `${localStorage.getItem('name')} ${localStorage.getItem('lastName')}`,
        user: localStorage.getItem('_id'),
        urlBase64: image
      }
      messages.push(messageData)
      setMessages(messages)
      item.messages = messages
      setMessage('')
      setTimeout(() => {
        document.getElementById('commits').scrollTop = document.getElementById('commits').scrollHeight
        if(image) {
          setPicturesOfItem(totalMessagesWithPictures + 1)
        }
      }, 50);
    }
  }

  const saveItem = (index, state, item) => {
    item.messages = messages
    setIsEdited(false)
    item.unidadData = unidad
    if(messages.length > 0) {
      save(index, state, item)
      executionReport.offLineGuard = Date.now()
      handleClose()
    }else{
      alert('Debe dejar un comentario')
    }
  }

  const openImage = (image) => {
    setImagePreview(image)
    setOpenImageDialog(true)
  }

  const openCameraToAst = () => {
    setOpenCamera(true)
  }

  const closeCamera = () => {
    setOpenCamera(false)
  }

  const handleCloseImage = () => {
    setOpenImageDialog(false)
  }

  const handleCloseText = () => {
    setOpenInputTextDialog(false)
  }

  const handleCloseAstImage = () => {
    setOpenImageAstDialog(false)
  }

  const disable = () => {
    document.onkeydown =  (e) =>
      {
        return false
      }
  }

  const deleteMessage = (index) => {
    if (confirm('¿Confirma borrar el mensaje?')) {
      setIsEdited(true)
      const messagesNew = []
      messages.forEach((m, i) => {
        if (index === i) {
          null
        } else {
          messagesNew.push(m)
        }
        if (i === (messages.length - 1)) {
          setMessages(messagesNew)
        }
      })
    }
  }

  const close = () => {
    if (isEdited) {
      alert('Existen cambios que no se han guardado. Confirme los cambios presionando "Guardar Sin Ejecutar" o "Guardar Ejecutado"')
    } else {
      handleClose()
    }
  }
  
  return (
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        disableEscapeKeyDown
        aria-describedby="alert-dialog-slide-description"
      >
        <div style={{position: 'absolute', right: 50, top: 10}}>
          <IconButton onClick={()=>close()} style={{position: 'fixed'}}><Close/></IconButton>
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
              <TextField id="standard-basic" label={item.unidad} variant="standard" type='number' value={unidad} onChange={(e)=>{changeUnidad(e.target.value)}}/>
            </div>
          </Grid>
          <Grid item xl={2} lg={2} md={2} sm={2}>
            <div>
              <p>Nro Parte: {item.partnumberUtl}</p>
            </div>
          </Grid>
          <Grid item xl={4} lg={4} md={4} sm={4}>
            <Grid container>
              <Grid item xl={6} lg={6} md={6} sm={6}>
                <div>
                  <p>Cant. Utilizar: <br /> {item.cantidad} {item.unidad}</p>
                </div>
              </Grid>
              <Grid item xl={6} lg={6} md={6} sm={6}>
                <div>
                  <p>Tipo Rpto: {item.idtypeutlPartnumber}</p>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>}
        <div style={{paddingLeft: 24, paddingRight: 24, marginBottom: 50}}>
          <div style={{width: '100%', height: 250, borderWidth: 2, borderStyle: 'solid', borderColor: '#ccc', borderRadius: 20, position: 'relative'}}>
            <div id='commits' style={{width: '100%', height: 190, overflowY: 'auto', scrollBehavior: 'smooth'/* borderWidth: 2, borderStyle: 'solid', borderColor: '#ccc', borderRadius: 20 */}}>
              {
                messages.map((message, index) => {
                  console.log(message)
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
                          {
                            ((localStorage.getItem('_id' === message.user) || (localStorage.getItem('role') === 'superAdmin' || localStorage.getItem('role') === 'admin' || localStorage.getItem('role') === 'sapExecutive' || localStorage.getItem('role')==='shiftManager' ))) &&
                            <IconButton onClick={()=>{deleteMessage(index)}} style={{position: 'absolute', top: 10, right: 10}}><Close style={{fontSize: 14, color: 'black'}}/></IconButton>
                          }
                      <p style={{marginBottom: 0, fontSize: 10}}><strong>{message.name}</strong></p>
                      {(message.urlBase64 || message.urlImageMessage) && <img src={(message.urlBase64.length > 0) ? message.urlBase64 : message.urlImageMessage} height={70} onClick={() => openImage((message.urlBase64.length > 0) ? message.urlBase64 : message.urlImageMessage)} />}
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
                  {
                    !isMobile && <textarea disabled={!canEdit} value={message} placeholder='Ingrese comentarios' type="text" style={{width: '100%', borderColor: 'transparent', resize: 'none'}} onChange={(e) => {inputMessage(e.target.value)}}/>
                  }
                  {
                    isMobile && <textarea disabled={!canEdit} id="mobileTextArea" value={message} placeholder='Ingrese comentarios' type="text" style={{width: '100%', borderColor: 'transparent', resize: 'none'}} onChange={(e) => {console.log(e.target.value)}} onClick={()=>{setOpenInputTextDialog(true); document.getElementById('mobileTextArea').blur()}} />
                  }
                </div>
                <div style={{width: '30%', float: 'right', textAlign: 'right'}}>
                  <IconButton onClick={() => {upImage(); setAst(false)}}>
                    <FontAwesomeIcon icon={faImage} />
                  </IconButton>
                  <IconButton onClick={() => saveMessage()}>
                    <FontAwesomeIcon icon={faArrowRight} />
                  </IconButton>
                  <input autoComplete="off" type="file" id="foto" accept="image/x-png,image/jpeg" onChange={(e)=>{uploadImageReport(e.target.files[0])}} hidden />
                </div>
              </form>
            </div>
          </div>
        </div>
        <DialogActions style={{minWidth: 400}}>
          <Button style={{backgroundColor: '#D5CC41', color: '#fff'}} onClick={() => {saveItem(index, false, item)}}>Guardar sin ejecutar</Button>
          <Button style={{backgroundColor: '#9ACF26', color: '#fff'}} onClick={() => {saveItem(index, true, item)}}>Guardar ejecutado</Button>
        </DialogActions>
        {
          openImageDialog && <ImageDialog open={openImageDialog} image={imagePreview} handleClose={handleCloseImage}/>
        }
        {
          openImageAstDialog && <ImageAstDialog open={openImageAstDialog} images={astList} handleClose={handleCloseAstImage} setIsEdited={setIsEdited}/>
        }
        {
          openInputTextDialog && <InputTextDialog open={openInputTextDialog} handleClose={handleCloseText} saveMessage={saveMessage} message={message} inputMessage={inputMessage}/>
        }
        {
          openLoadingModal && <LoadingModal open={openLoadingModal} withProgress={false} loadingData={'Cargando imágen'}/>
        }
        {
          openCamera && <CameraModal open={openCamera} handleClose={closeCamera} astList={astList} />
        }
      </Dialog>
      )
}

export default ReportDataDialog