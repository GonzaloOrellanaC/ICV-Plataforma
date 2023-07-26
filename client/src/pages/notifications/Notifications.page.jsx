import { Box, Button, Card, Grid, IconButton, ListItem, Toolbar, Paper, InputBase, CircularProgress } from "@mui/material"
import { ArrowBackIos } from "@mui/icons-material"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { dateWithTime, useStylesTheme } from "../../config"
import { notificationsRoutes } from "../../routes"
import { useNotificationsContext } from "../../context/Notifications.context"
import { LoadingLogoDialog } from "../../dialogs"

const NotificationsPage = () => {
    const {myNotifications, getNotifications} = useNotificationsContext()
    const [ openLoading, setOpenLoading ] = useState(false)
    const [notificationsList, setNotificationList] = useState([])
    const [notificationsListCache, setNotificationListCache] = useState([])
    const [notificationsListCacheBusqueda, setNotificationListCacheBusqueda] = useState([])
    const [totalItems, setTotalItems] = useState(20)
    const [openLogo, setOpenLogo] = useState(false)
    const [height, setHeight] = useState(0)
    const classes = useStylesTheme();
    const navigate = useNavigate();
    const divRef = useRef();

    const handleScroll = (e) => {
        const scrolledFromTop = divRef.current.scrollTop;
        if (scrolledFromTop > (height - 100)) {
            const newTotal = totalItems + 20
            setTotalItems(newTotal)
        }
    };

    useEffect(() => {
        setNotificationList((notificationsListCacheBusqueda.length > 0) ? notificationsListCacheBusqueda.slice(0, totalItems) : /* notificationsListCache */myNotifications.slice(0, totalItems))
    }, [totalItems])

    useEffect(() => {
        const el = document.getElementById('notification-container')
        if (el) {
            setHeight(el.scrollHeight - el.offsetHeight)
        }
    }, [notificationsList])

    useEffect(() => {
        if (myNotifications.length > 0) {
            setNotificationList(myNotifications.slice(0, totalItems))
            setNotificationListCache(myNotifications.slice(0, 1000))
            const el = document.getElementById('notification-container')
            if (el) {
                setHeight(el.scrollHeight - el.offsetHeight)
            }
        }
    }, [myNotifications])

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

    const buscar = (value) => {
        setOpenLogo(true)
        if (value.length > 2) {
            const newNotificationList = []
            notificationsListCache.forEach((not, i) => {
                if (
                    not.title.toLowerCase().includes(value.toLowerCase()) ||
                    not.subtitle.toLowerCase().includes(value.toLowerCase()) ||
                    not.message.toLowerCase().includes(value.toLowerCase())
                    ) {
                        newNotificationList.push(not)
                    }
            })
            setNotificationList(newNotificationList.slice(0, totalItems))
            setNotificationListCacheBusqueda(newNotificationList)
        } else {
            setNotificationList(notificationsListCache)
            setNotificationListCacheBusqueda([])
            setTotalItems(20)
        }
        setOpenLogo(false)
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
                                            navigate(-1)
                                        }, 500)}> 
                                            <ArrowBackIos style={{color: '#333', fontSize: 16}}/> 
                                        </IconButton> 
                                        <h1 style={{marginTop: 0, marginBottom: 0, fontSize: 16}}>
                                            Notificaciones
                                        </h1>
                                    </Toolbar>
                                    <Paper
                                        component="form"
                                        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400, position: 'absolute', right: 10, top: 10 }}
                                    >
                                        <InputBase
                                            onChange={(e) => {buscar(e.target.value)}}
                                            sx={{ ml: 1, flex: 1 }}
                                            placeholder="Buscar en notificaciones"
                                            inputProps={{ 'aria-label': 'search google maps' }}
                                        />
                                    </Paper>
                                </div>
                            </div>
                        </Grid>
                        <Grid alignItems='center' justifyContent='center' style={{padding: 10, borderRadius: 20}}>
                            <div >
                                <ListItem style={{backgroundColor: '#F9F9F9'}}>
                                    <div style={{marginLeft: 5, marginRight: 5, fontSize: 12}}>
                                        <p style={{margin: 0, fontSize: 18}}>N°</p>
                                    </div>
                                    <div style={{width: '30%', marginLeft: 5, fontSize: 12}}>
                                        <p style={{margin: 0, fontSize: 18}}>Titulo</p>
                                    </div>
                                    <div style={{width: '40%', marginLeft: 5, fontSize: 12}}>
                                        <p style={{fontSize: 18}}>Mensaje</p>
                                    </div>
                                    <div style={{width: '10%', marginLeft: 5, fontSize: 12}}>
                                        <p style={{fontSize: 18}}>Fecha</p>
                                    </div>
                                    <div style={{marginLeft: 5, fontSize: 18}}>
                                        <p style={{fontSize: 18}}>
                                            Acción
                                        </p>
                                    </div>
                                </ListItem>
                            </div>
                            <div style={{height: 'calc(100vh - 300px)', overflowY: 'auto'}} onScroll={handleScroll} ref={divRef} id='notification-container'>
                                {
                                    openLogo && <CircularProgress />
                                }
                                {
                                    !openLogo && notificationsList.map((item, index) => {
                                        return (
                                            <ListItem key={index} style={{backgroundColor: item.state ? '#fff' : '#F9F9F9'}}>
                                                <div style={{marginLeft: 5, marginRight: 5, fontSize: 12}}>
                                                    <h3 style={{margin: 0}}>{index + 1}</h3>
                                                </div>
                                                <div style={{width: '30%', marginLeft: 5, fontSize: 12}}>
                                                    <h3 style={{margin: 0}}>{item.title}</h3>
                                                    <h4 style={{margin: 0}}>{item.subtitle}</h4>
                                                </div>
                                                <div style={{width: '40%', marginLeft: 5, fontSize: 12}}>
                                                    <p style={{fontSize: 18}}>{item.message}</p>
                                                </div>
                                                <div style={{width: '10%', marginLeft: 5, fontSize: 12}}>
                                                    <p style={{fontSize: 18}}>{dateWithTime(item.createdAt)}</p>
                                                </div>
                                                <div style={{marginLeft: 5, fontSize: 12}}>
                                                    <p
                                                        style={{cursor: 'pointer', color: 'brown', textDecoration: 'inline', fontSize: 16, fontWeight: 'bold'}}
                                                        onClick={() => {navigate(item.url); changeState(item._id)}}
                                                    >
                                                        Ir
                                                    </p>
                                                </div>
                                            </ListItem> 
                                        )
                                    })
                                }
                            </div>
                            {
                                openLoading && <LoadingLogoDialog open={openLoading} />
                            }
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

export default NotificationsPage
