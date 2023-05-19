import { Box, Button, Card, Grid, IconButton, ListItem, makeStyles, Toolbar } from "@material-ui/core"
import { ArrowBackIos } from "@material-ui/icons"
import { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { dateWithTime, useStylesTheme } from "../../config"
import LoadingLogoModal from "../../modals/loadings/loading-logo.modal"
import { notificationsRoutes } from "../../routes"
import { useNotificationsContext } from "../../context/Notifications.context"
import { useAuth } from "../../context"
/* const useStyles = makeStyles(theme => ({
    root: {
        display: 'inline-block',
        textAlign: 'center',
        padding: 10,
        width: '25%',
        //minWidth: 280,
        backgroundColor: 'transparent'
    },
    icon: {
        padding: 20,
        width: '100%',
    },
    button: {
        minWidth: '100%'
    },
    buttonSelection: {
        backgroundColor: '#F9F9F9',
        color: '#505050',
        width: '100%',
        //minWidth: 285,
        minHeight: 340,
        borderRadius: 20,
        fontFamily:'Raleway',
        textTransform: 'none',
        margin: 10
    },
    iconButton: {
        color: '#BE2E26',
    }
})) */

const NotificationsPage = () => {
    const {myNotifications, getNotifications} = useNotificationsContext()
    const [ openLoading, setOpenLoading ] = useState(false)
    const classes = useStylesTheme();
    const history = useHistory();

    /* useEffect(() => {
        let cancel = true;
        if(cancel) {
            notificationsRoutes.getNotificationsById(localStorage.getItem('_id')).then(data => {
                if(cancel) setNotifications(data.data.reverse())
            })
        }
        return () => {cancel = false}
    }, []) */

    const changeState = (notificationId) => {
        notificationsRoutes.actualiceNotificationState(notificationId)
    }
    
    const todoLeido = () => {
        setOpenLoading(true)
        setTimeout(() => {
            const notifications = [...myNotifications]
            notifications.forEach((not, index) => {
                notificationsRoutes.actualiceNotificationState(not._id)
                if(index == (notifications.length - 1)) {
                    getNotifications()
                    setOpenLoading(false)
                }
            })
        }, 1000);
    }

    return (
        <Box height='100%'>
            <Grid className={'pageRoot'} container spacing={0}>
                <Grid className={classes.pageContainer} item xs={12}>
                    <Card elevation={0} className={'pageCard'}>
                        <Grid container alignItems='center' justifyContent='center'>
                            <div style={{width: '100%', textAlign: 'left', padding: 10 }}>
                                <div style={{width: '100%', position: 'relative', textAlign: 'left', color: '#333', backgroundColor: '#fff', borderRadius: 20 }}>
                                    <Toolbar style={{paddingLeft: 0, backgroundColor: '#F9F9F9', borderRadius: 10}}>
                                        <IconButton onClick={() => setTimeout(() => {
                                            history.goBack()
                                        }, 500)}> 
                                            <ArrowBackIos style={{color: '#333', fontSize: 16}}/> 
                                        </IconButton> 
                                        <h1 style={{marginTop: 0, marginBottom: 0, fontSize: 16}}>
                                            Notificaciones
                                        </h1>
                                    </Toolbar>
                                    <Button onClick={()=>{todoLeido()}} style={{position: 'absolute', right: 10, top: 10}}>Indicar Todo Leído</Button>
                                </div>
                            </div>
                        </Grid>
                        <Grid alignItems='center' justifyContent='center' style={{padding: 10, borderRadius: 20}}>
                            <div style={{height: 'calc(100vh - 220px)', overflowY: 'auto'}}>
                            {
                                myNotifications.slice(0, 20).map((item, index) => {
                                    return (
                                        <ListItem key={index} style={{backgroundColor: item.state ? '#fff' : '#F9F9F9'}}>
                                            <div style={{width: '15%', marginLeft: 5, fontSize: 12}}>
                                                <h1>{item.title}</h1>
                                                <h2>{item.subtitle}</h2>
                                            </div>
                                            <div style={{width: '20%', marginLeft: 5, fontSize: 12}}>
                                                <p style={{fontSize: 18}}>{item.message}</p>
                                            </div>
                                            <div style={{width: '10%', marginLeft: 5, fontSize: 12}}>
                                                <p style={{fontSize: 18}}>{dateWithTime(item.createdAt)}</p>
                                            </div>
                                            <div style={{width: '20%', marginLeft: 5, fontSize: 12}}>
                                                <button 
                                                    style={{
                                                        width: 50, 
                                                        height: 40, 
                                                        borderRadius: 20, 
                                                        fontSize: 20
                                                    }} 
                                                    onClick={() => {history.push(item.url); changeState(item._id)}}>Ir</button>
                                            </div>
                                        </ListItem> 
                                    )
                                })
                            }
                            </div>
                            {
                                openLoading && <LoadingLogoModal open={openLoading} />
                            }
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
    
}

export default NotificationsPage
