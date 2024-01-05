import { Modal, ListItem, Fab, Switch, Box, TextField, Paper,
    InputBase,
    IconButton,
    Divider,CustomButton, Button
     } from '@mui/material';
import { ArrowRight, Close } from '@mui/icons-material';
import { Directions, Search } from '@mui/icons-material';
import { useState } from 'react';
import { imageToBase64, styleModalActivity, uploadImage } from '../../config';
import { useEffect } from 'react'
import { dateWithTime } from '../../config';

const WriteActivityModal = ({open, closeWriteModal, activity, onlyClose, reportId, reportAssignment, reportLevel}) => {

    const [ commit, addCommit ] = useState('');
    const [ commits, setCommits ] = useState([]);
    const [ commitsLength, setCommitsLength ] = useState(0);
    const [ canEdit, setCanEdit ] = useState(false)
    const isOperator = Boolean(localStorage.getItem('isOperator'))

    
    useEffect(() => {
        let myReportLevel;
        if(isOperator||(localStorage.getItem('role') === 'inspectionWorker')||(localStorage.getItem('role') === 'maintenceOperator')) {
            myReportLevel = 0;
        }else if(localStorage.getItem('role') === 'shiftManager') {
            myReportLevel = 1;
        }else if(localStorage.getItem('role') === 'chiefMachinery') {
            myReportLevel = 2;
        }else if(localStorage.getItem('role') === 'sapExecutive') {
            myReportLevel = 3;
        };
        if(myReportLevel == Number(reportLevel)) {
            setCanEdit(true)
        }
        if(activity.writeCommits) {
            if(activity.writeCommits.length > 0) {
                setCommitsLength(activity.writeCommits.length);
            }
            setCommits(activity.writeCommits);
        }else{
            setCommits([]);
        }
    }, []);

    const sendCommit = () => {
        let obj = {
            user: localStorage.getItem('_id'),
            userName: `${localStorage.getItem('name')} ${localStorage.getItem('lastName')}`,
            id: Date.now(),
            commit: commit
        }
        
        if(commit.length > 0) {
            let arr = commits;
            arr.push(obj)
            setCommits(arr);
            setTimeout(() => {
                activity.writeCommits = commits
                addCommit('');
                document.getElementById('commits').scrollTop = document.getElementById('commits').scrollHeight
            }, 500);
        }
    }

    const deleteCommit = (id) => {
        if(confirm('Se borrará mensaje. Confirme.')) {
            let arr = new Array();
            arr = commits;
            let newArr = arr.filter((item) => {if(item.id !== id) {return item}});
            activity.writeCommits = newArr;
            setCommits(newArr);
        }
    }

    const uploadImageReport = async (file) => {
        if(file) {
            let arr = new Array();
            arr = commits;
            setCommits([])
            let obj = {
                user: localStorage.getItem('_id'),
                userName: `${localStorage.getItem('name')} ${localStorage.getItem('lastName')}`,
                id: Date.now(),
                commit: 'Se ha cargado una imágen',
                url: null,
                urlBase64: null
            }
            if(navigator.onLine) {
                let res = await imageToBase64(file);
                let imageUploaded = await uploadImage(file, 'reports', `${reportId}/image_report_eje_${activity.strpmdesc}_${activity.task}_${arr.length}`);
                if(imageUploaded.data.status) {
                    obj.url = imageUploaded.data.data.url;
                    obj.urlBase64 = res;
                    arr.push(obj);
                    setCommits(arr);
                    activity.readCommits = commits
                    addCommit('');
                    document.getElementById('commits').scrollTop = document.getElementById('commits').scrollHeight
                }
            }else{
                let res = await imageToBase64(file);
                obj.urlBase64 = res;
                arr.push(obj);
                setCommits(arr);
                activity.readCommits = commits
                addCommit('');
                document.getElementById('commits').scrollTop = document.getElementById('commits').scrollHeight
            }
            
        }
    }

    const openPicture = () => {
        if(activity.observationsImages) {
            if(activity.observationsImages.length = 5) {
                alert('Máximo de 5 imágenes cargadas.')
            }else{
                document.getElementById('foto').click();
            }
        }else{
            document.getElementById('foto').click();
        }
        
    }

    const openImage = (src) => {
        window.open(src, '_blank')
    }

    const saveSate = () => {
        if(commits.length > commitsLength) {
            if(confirm('Guardar avance')) {
                activity.isChecked = true;
                closeWriteModal();
                onlyClose();
            }
        }else{
            alert('Debe dejar algún nuevo comentario.')
        }
    }

    return(
        <Modal
            onClose={() => setCommits([])}
            keepMounted={false}
            open={open}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            container={() => {
                setTimeout(() => {
                    document.getElementById('commits').scrollTop = document.getElementById('commits').scrollHeight
                }, 50);
            }}
        >
            <Box sx={styleModalActivity}>
                
                <div style={{width: '100%', overflowY: 'auto'}}>
                    <div style={{width: '100%', borderBottomStyle: 'solid', borderBottomColor: '#BDBDBD', borderBottomWidth: 0.5}}>
                        <h2 style={{marginBottom: 0}}>{activity.strpmdesc}</h2>
                        <p style={{marginTop: 0}}>ID: {activity.secexec} </p>
                    </div>
                    <div style={{width: '100%'}}>
                        <div style={{width: '30%', float: 'left'}}>
                            <p> <b>Equipo responsable</b> </p>
                            <p> {activity.workteam} {activity.workteamdesc} </p>
                        </div>
                        <div style={{width: '70%', float: 'right'}}>
                            <p> <b>Descripción de la tarea</b> </p>
                            <p> {activity.taskdesc} </p>
                        </div>
                    </div>
                    <div style={{width: '100%', height: '15vh', overflowY: 'auto'}}>
                        <p> <b>Observaciones</b> </p>
                        <p> {activity.obs01} </p>
                    </div>
                    <div>
                        <p> <b>Comentarios</b> </p>
                        <div style={{borderRadius: 20, zIndex: 1, backgroundColor: '#fff', borderStyle: 'solid', borderWidth: 0.5, borderColor: '#BDBDBD', height: '20vh', padding: 0}}>
                            <div id='commits' style={{width: '100%', borderBottomStyle: 'solid', borderBottomColor: '#BDBDBD', borderBottomWidth: 0.5, height: '14vh', maxHeight: '14vh', overflowY: 'auto'}}>
                                {
                                    commits.reverse().map((element, n) => {
                                        return(
                                            <div key={n} id={`message_${n+1}`} style={{width: '100%', display: 'inline-block', paddingLeft: 20, paddingRight: 20}}>
                                                <div style={{padding: 5, margin: 5, maxWidth: '80%', backgroundColor: '#F9F9F9', borderRadius: 20}}>
                                                    <div style={{float: 'right'}}>
                                                    {((reportAssignment === localStorage.getItem('_id'))&&canEdit) && <Fab onClick={() => deleteCommit(element.id)} style={{boxShadow: 'none', backgroundColor: 'transparent'}}>
                                                        <Close style={{color: '#ccc', fontSize: 14}} />
                                                    </Fab>}
                                                    </div>
                                                    <p> <b>{element.userName}</b> </p>
                                                    <p>{element.commit}</p>
                                                    {
                                                        (element.url || element.urlBase64) && <div style={{width: '100%', textAlign: 'left', paddingRight: 10}}>
                                                            <button onClick={() => openImage(element.url || element.urlBase64)}> <img src={element.url || element.urlBase64} width={50} height={50} style={{objectFit: 'cover'}} alt="" /> </button>
                                                        </div>
                                                    }
                                                    <div style={{width: '100%', textAlign: 'right', paddingRight: 10}}>
                                                        <p style={{margin: 0, fontSize: 10}}>{dateWithTime(element.id)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div style={{width: '100%', paddingLeft: 10, paddingRight: 10}}>
                                <div style={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%' }}>
                                    <InputBase
                                        style={{ width: '100%' }}
                                        placeholder="Ingrese un comentario sobre la tarea"
                                        onChange={(e)=>{addCommit(e.target.value)}}
                                        value={commit}
                                    />
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                    {(/* (reportAssignment === localStorage.getItem('_id'))&& */canEdit) && <div style={{width: '100%', paddingTop: 10, display: 'inline-block'}}>
                        <div style={{width: '50%', float: 'left'}}>
                            <Button variant="contained" color={'primary'} style={{ borderRadius: 50 }} onClick={()=>{openPicture()}}>
                                Subir foto
                            </Button>
                            <input autoComplete="off" type="file" id="foto" accept="image/x-png,image/jpeg" onChange={(e)=>{uploadImageReport(e.target.files[0])}} hidden />
                        </div>
                        <div style={{width: '50%', float: 'right', textAlign: 'right'}}>
                            <Button variant="contained" color={'primary'} style={{ borderRadius: 50 }} onClick={()=>{sendCommit()}}>
                                Guardar mensaje
                            </Button>
                        </div>
                    </div>}
                    {(/* (reportAssignment === localStorage.getItem('_id'))&& */canEdit) && <div style={{width: '100%', paddingTop: 10, display: 'inline-block', textAlign: 'center'}}>
                        <Button variant="contained" color={'primary'} style={{ borderRadius: 50 }} onClick={()=>{saveSate()}}>
                            Indicar tarea terminada
                        </Button>
                    </div>}
                    {
                        /* (reportAssignment !== localStorage.getItem('_id'))*/ !canEdit && 
                        <div style={{width: '100%', textAlign: 'center'}}>
                            <p>Mientras no se termine la ejecución de la orden por parte del usuario asignado, usted solo podrá supervisar.</p>
                        </div>
                    }
                    {
                        ((isOperator||(localStorage.getItem('role') === 'inspectionWorker')||(localStorage.getItem('role') === 'maintenceOperator'))&& !canEdit) &&
                        <div style={{width: '100%', textAlign: 'center'}}>
                            <p style={{fontSize: 18}}><b>Usted ya ha enviado la orden a revisión.</b></p>
                        </div>
                    }
                </div>
                <Fab onClick={() => {onlyClose()}} style={{position: 'absolute', right: 10, top: 10, boxShadow: 'none', backgroundColor: 'transparent'}}>
                    <Close style={{color: '#ccc'}} />
                </Fab>
            </Box>  
        </Modal>
    )
}

export default WriteActivityModal