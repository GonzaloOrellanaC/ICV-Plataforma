import React, { useEffect, useState } from 'react'
import { Box, Card, Grid, IconButton, List, Toolbar } from '@material-ui/core'
import { useNavigate } from 'react-router-dom'
import { ArrowBackIos } from '@material-ui/icons';
import { internalMessagesRoutes } from '../../routes';
import { getUserNameById, useStylesTheme } from '../../config';

const InternalMessagesPage = () => {
    const navigate = useNavigate();
    const classes = useStylesTheme();
    const [ messages, setMessages ] = useState([])

    useEffect(() => {
        internalMessagesRoutes.getAllMessages().then(data => {
            data.data.forEach(async(message, i) => {
                message.fullName = await getUserNameById(message.from);
                message.index = i
                if(i == (data.data.length - 1)) {
                    setMessages(data.data.reverse());
                }
            })
        })
    }, [])

    return(
        <Box height='100%'>
            <Grid className={'pageRoot'} container spacing={0}>
                <Grid className={classes.pageContainer} item xs={12}>
                    <Card elevation={0} className={'pageCard'}>
                        <Grid container alignItems='center' justifyContent='center'>
                            <div style={{width: '100%', textAlign: 'center', padding: 10 }}>
                                <div style={{width: '100%', textAlign: 'center', color: '#333', backgroundColor: '#fff', borderRadius: 20 }}>
                                    <Toolbar style={{paddingLeft: 0, backgroundColor: '#F9F9F9', borderRadius: 10,}}>
                                        <IconButton onClick={() => setTimeout(() => {
                                            navigate(-1)
                                        }, 500)}> 
                                            <ArrowBackIos style={{color: '#333', fontSize: 16}}/> 
                                        </IconButton> 
                                        <p style={{marginTop: 0, marginBottom: 0, fontSize: 16}}>
                                            {`Mensajes Internos`}
                                        </p>
                                    </Toolbar>
                                </div>
                            </div>
                            <div style={{width: '100vw', marginRight: 11, overflowY: 'scroll', maxHeight: '70vh', paddingLeft: 20, paddingRight: 20}}>
                                <List>
                                    {
                                        (messages.length > 0) && messages.map((element, index) => {
                                            return (
                                                <div key={index}>
                                                    <h2>{element.index + 1}.- {element.fullName}:</h2>
                                                    <p>{element.message}</p>
                                                    <br />
                                                </div>
                                            )
                                        })
                                    }
                                </List>
                            </div>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

export default InternalMessagesPage