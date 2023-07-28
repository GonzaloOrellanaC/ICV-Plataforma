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
import { useAuth, useConnectionContext, useExecutionReportContext, useUsersContext } from '../context'
import { azureStorageRoutes } from '../routes'
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const ReportDataDialog = (
  {
    open,
    handleClose,
    /* report, */
    item,
    index,
    executionReport,
    gruposKeys,
    indexActivity,
    indexGroup,
    save,
    setChecks,
    canEdit
  }) => {
    const {userData, admin, isOperator, isSapExecutive, isShiftManager, isChiefMachinery} = useAuth()
    const {usersFilteredBySite} = useUsersContext()
    const {report} = useExecutionReportContext()
    const {isOnline} = useConnectionContext()
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
  const [totalMessagesWithPictures, setPicturesOfItem] = useState(0)
  const [indexKey, setIndexKey] = useState()
  const [isEdited, setIsEdited] = useState(false)
  /* const [canEdit, setCanEdit] = useState(false) */

  useEffect(() => {
    console.log(report)
  }, [report])

  useEffect(() => {
    /* if (
      isOperator ||
      isSapExecutive||
      isShiftManager||
      isChiefMachinery
    ) 
      {
        setCanEdit(true)
      } else {
        setCanEdit(false)
      } */
    gruposKeys.map((k, n) => {
      if(k.data === indexGroup) {
        setIndexKey(n)
      }
    })
    if (executionReport)
    if(executionReport.astList) {
      setAstList(executionReport.astList)
    }
    setUnidad(item.unidadData)
    if(item.messages) {
      const total = []
      item.messages.forEach(async (m, i) => {
        console.log(m)
        /* const findUser = usersFilteredBySite.filter(user =>{if (user._id === m.user) return user})[0]
        if (findUser) {
          m.name = `${findUser.name} ${findUser.lastName}`
        } */
        /* if (findUser) {
          
        } else {
          m.name = 'User Test'
        } */
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

  useEffect(() => {
    if (messages.length > 0) {
      let haveMessage = false
      let haveClip = false
      const messagesCache = [...messages]
      messagesCache.forEach(async (mess, i) => {
        if (mess.urlBase64 || mess.urlImageMessage) {
          haveClip = true
        }
        if (mess.content === 'Se indica estado ejecutado sin dejar mensajes') {

        } else {
          haveMessage = true
        }
        if (i === (messages.length - 1)) {
          item.haveMessage = haveMessage
          item.haveClip = haveClip
        }
      })
      setMessage('')
      setTimeout(() => {
        document.getElementById('commits').scrollTop = document.getElementById('commits').scrollHeight
      }, 50);
    }
  }, [messages])

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
      let res = await imageToBase64(file)
      if (isOnline) {
        const response = await azureStorageRoutes.uploadImage(
          file,
          `${new Date().getFullYear()}/${report.idIndex}/${indexGroup}/${Date.now()}`,
          'reports-test'
        )
        console.log(response.data.data.url)
        saveMessage(res, `Imagen ${Date.now()}`, response.data.data.url)
      } else {
        saveMessage(res, `Imagen ${Date.now()}`, null)
      }
    }
  }

  const saveMessage = async (image, messagePicture, url) => {
    if(message.length > 0 || messagePicture) {
      let totalImages = totalMessagesWithPictures
      if(image) {
        item.haveClip = true
        totalImages = totalImages + 1
        setPicturesOfItem(totalImages)
      }
      let m
      if(messagePicture) {
        m = messagePicture
      }else{
        m = message
      }
      let messageData = {
        id: Date.now(),
        namePicture: url ? `${indexKey}_Tarea_${index + 1}_Foto_${totalImages}` : null,
        content: m,
        name: `${userData.name} ${userData.lastName}`,
        user: userData._id,
        urlBase64: image,
        urlImageMessage: url
      }
      /* console.log(messageData) */
      const messagesCache = [...messages]
      messagesCache.push(messageData)
      setMessages(messagesCache)
      /* item.messages = messages */
      
    }
  }

  const saveItem = (index, state, item) => {
    item.messages = messages
    setIsEdited(false)
    if (item.unidad !== '*') {
      if (unidad) {
        item.unidadData = unidad
        save(index, state, item)
        executionReport.offLineGuard = Date.now()
        handleClose()
      } else {
        alert('Debe ingresar el total utilizado. Si no utilizó insumo o repuesto solicitado debe ingresar 0')
      }
    } else {
      if(messages.length > 0) {
        save(index, state, item)
        executionReport.offLineGuard = Date.now()
        handleClose()
      }else{
        alert('Debe dejar un comentario')
      }
    }
  }

/*   const desmarcar = (itemData) => {
    console.log(itemData)
    if (confirm('Confirme que desea desmarcar la tarea')) {
      itemData.isChecked = false
    }
  } */

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
          item.messages = messagesNew
          if (item.messages.length === 0) {
            item.haveMessage = false
            item.haveClip = false
          } else {
            let haveClip = false
            let haveMessage = false
            item.messages.forEach((mess, index) => {
              console.log(mess)
              if (mess.content === 'Se indica estado ejecutado sin dejar mensajes') {

              } else {
                haveMessage = true
              }
              if (mess.urlBase64 || mess.urlImageMessage) {
                haveClip = true
              }
              console.log('Clip', haveClip)
              if (index === (item.messages.length - 1)) {
                item.haveClip = haveClip
                item.haveMessage = haveMessage
              }
            })
          }
        }
      })
    }
  }

  const close = () => {
    handleClose()
    /* if (isEdited) {
      alert('Existen cambios que no se han guardado. Confirme los cambios presionando "Guardar Sin Ejecutar" o "Guardar Ejecutado"')
    } else {
      handleClose()
    } */
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
              <TextField
                id="standard-basic"
                label={item.unidad}
                variant="standard"
                type='number'
                value={unidad}
                onChange={(e)=>{changeUnidad(e.target.value)}}
              />
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
                (messages.length === 0)
                &&
                <p>No hay mensajes</p>
              }
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
                            (((userData._id === message.user && canEdit ) || admin)) &&
                            <IconButton onClick={()=>{deleteMessage(index)}} style={{position: 'absolute', top: 10, right: 10}}><Close style={{fontSize: 14, color: 'black'}}/></IconButton>
                          }
                      <p style={{marginBottom: 0, fontSize: 10}}><strong>{message.name}</strong></p>
                      {(message.urlBase64 || message.urlImageMessage) && <img src={message.urlBase64 ? message.urlBase64 : message.urlImageMessage} height={70} onClick={() => openImage((message.urlBase64.length > 0) ? message.urlBase64 : message.urlImageMessage)} />}
                      <p style={{marginBottom: 20, whiteSpace: 'pre-line'}}>{message.content}</p>
                      <p style={{position: 'absolute', fontSize: 10, right: 5, bottom: 0}}>{dateWithTime(message.id)}</p>
                    </div>
                  )
                })
              }
            </div>
            <div style={{width: '100%', height: 50, borderTopWidth: 2, borderTopStyle: 'solid', borderTopColor: '#ccc', position: 'absolute', bottom: 0, left: 0, paddingLeft: 10, paddingRight: 10}}>
              <form>
                {canEdit && <div style={{width: '70%', float: 'left'}}>
                  {
                    !isMobile && <textarea disabled={!canEdit} value={message} placeholder='Ingrese comentarios' type="text" style={{width: '100%', borderColor: 'transparent', resize: 'none'}} onChange={(e) => {inputMessage(e.target.value)}}/>
                  }
                  {
                    isMobile && <textarea disabled={!canEdit} id="mobileTextArea" value={message} placeholder='Ingrese comentarios' type="text" style={{width: '100%', borderColor: 'transparent', resize: 'none'}} onChange={(e) => {console.log(e.target.value)}} onClick={()=>{setOpenInputTextDialog(true); document.getElementById('mobileTextArea').blur()}} />
                  }
                </div>}
                <div style={{width: '30%', float: 'right', textAlign: 'right'}}>
                  {canEdit && <IconButton onClick={() => {upImage(); setAst(false)}}>
                    <FontAwesomeIcon icon={faImage} />
                  </IconButton>}
                  {canEdit && <IconButton onClick={() => saveMessage()}>
                    <FontAwesomeIcon icon={faArrowRight} />
                  </IconButton>}
                  <input autoComplete="off" type="file" id="foto" accept="image/x-png,image/jpeg" onChange={(e)=>{uploadImageReport(e.target.files[0])}} hidden />
                </div>
              </form>
            </div>
          </div>
        </div>
        {canEdit && <DialogActions style={{minWidth: 400}}>
          <Button style={{backgroundColor: '#D5CC41', color: '#fff'}} onClick={() => {saveItem(index, false, item)}}>Guardar sin ejecutar</Button>
          <Button style={{backgroundColor: '#9ACF26', color: '#fff'}} onClick={() => {saveItem(index, true, item)}}>Guardar ejecutado</Button>
        </DialogActions>}
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