import { Modal, ListItem, Fab, Switch, Box, TextField, Paper,
    InputBase,
    IconButton,
    Divider,CustomButton, Button
     } from '@material-ui/core';
import { ArrowRight, Close } from '@material-ui/icons';
import { Directions, Search } from '@material-ui/icons';
import { useState } from 'react';
import { styleModalActivity } from '../../config';
import { useEffect } from 'react'


const WriteActivityModal = ({open, closeWriteModal, activity, comm}) => {

    const [ commit, addCommit ] = useState('');
    const [ commits, setCommits ] = useState([]);


    useEffect(() => {
        if(comm) {
            setCommits(comm);
        }else{
            setCommits([]);
        }
    }, [comm]);

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
            setCommits(arr)
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

    const saveSate = () => {
        if(commits.length > 0) {
            if(confirm('Guardar avance')) {
                activity.isChecked = true;
                closeWriteModal()
            }
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
                                                    <Fab onClick={() => deleteCommit(element.id)} style={{boxShadow: 'none', backgroundColor: 'transparent'}}>
                                                        <Close style={{color: '#ccc', fontSize: 14}} />
                                                    </Fab>
                                                    </div>
                                                    <p> <b>{element.userName}</b> </p>
                                                    <p>{element.commit}</p>
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
                    <div style={{width: '100%', paddingTop: 10, display: 'inline-block'}}>
                        <div style={{width: '50%', float: 'left'}}>
                            {/* <Button variant="contained">
                                Ver foto
                            </Button> */}
                        </div>
                        <div style={{width: '50%', float: 'right', textAlign: 'right'}}>
                            <Button variant="contained" color={'primary'} style={{ borderRadius: 50 }} onClick={()=>{sendCommit()}}>
                                Guardar mensaje
                            </Button>
                        </div>
                    </div>
                    <div style={{width: '100%', paddingTop: 10, display: 'inline-block', textAlign: 'center'}}>
                        <Button variant="contained" color={'primary'} style={{ borderRadius: 50 }} onClick={()=>{saveSate()}}>
                            Indicar tarea terminada
                        </Button>
                    </div>
                </div>
                <Fab onClick={() => {closeWriteModal()}} style={{position: 'absolute', right: 10, top: 10, boxShadow: 'none', backgroundColor: 'transparent'}}>
                    <Close style={{color: '#ccc'}} />
                </Fab>
            </Box>  
        </Modal>
    )
}

export default WriteActivityModal