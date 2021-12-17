import React, { useState, useEffect } from 'react'
import { Box, Card, Grid, Typography, Modal, Button } from '@material-ui/core'
import { useStylesTheme } from '../../config'
import { CardButton } from '../../components/buttons'
import { apiIvcRoutes } from '../../routes'
import { Network } from '../../connections'
import { pmsDatabase, sitesDatabase, FilesToStringDatabase, trucksDatabase } from '../../indexedDB'


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    //transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const WelcomePage = () => {
    const classes = useStylesTheme();
    const [ date, setDate ] = useState('')
    const [ hr, setHr ] = useState('')
    const [ min, setMin ] = useState('')

    useEffect(() => {
        readData();
        getTrucksList()
    }, []);

    const readData = async () => {
        //window.
        /* let fileHandle;
        // Destructure the one-element array.
        [fileHandle] = await Window.showOpenFilePicker();
        console.log(fileHandle) */
        const networkDetect = await Network.detectNetwork();
        if(networkDetect) {
            let pms = [];
            pms = await getPMlist();
            pmsDatabase.initDbPMs()
            .then(async db => {
                pms.forEach(async (fileName, index) => {
                    apiIvcRoutes.getFiles(fileName).then(data => {
                        data.data.id = index
                        pmsDatabase.actualizar(data.data, db.database);
                    })
                    if(index === (pms.length - 1)) {
                        let respuestaConsulta = await pmsDatabase.consultar(db.database);
                    }
                });
            })
            let sites = [];
            sites = await getSitesList();
            sitesDatabase.initDbObras()
            .then(async db => {
                sites.forEach(async (fileName, index) => {
                    fileName.id = index;
                    sitesDatabase.actualizar(fileName, db.database);
                    if(index === (sites.length - 1)) {
                        let respuestaConsulta = await sitesDatabase.consultar(db.database);
                    }
                });
            })
        }
        
    }

    const transformFile3dToString = (brand, model, type) => {
        return new Promise(async resolve => {
            console.log(`../../assets/${type}/${brand}_${model}_Preview.gltf`)
            let blob = await fetch(`../../assets/${type}/${brand}_${model}_Preview.gltf`).then(r => r.blob());
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = async () => {
                console.log(reader.result);
                let data = {
                    id: 0,
                    data: reader.result
                }
                FilesToStringDatabase.initDbPMs()
                .then(async db => {
                    let response = await FilesToStringDatabase.actualizar(data, db.database);
                    console.log('response = ', response)
                    if(response) {
                        resolve(true)
                    }else{
                        resolve(false)
                    }
                })
            };
            reader.onerror = error => console.log(error);
        })
    }

    const removeAccents = (str) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    } 

    const getTrucksList = () => {
        return new Promise(resolve => {
            trucksDatabase.initDbMachines()
            .then(async db => {
                let respuestaConsulta = await trucksDatabase.consultar(db.database)
                let n = 0;
                //console.log(respuestaConsulta.length)
            })
        })
    }

    const createElement3D = async (n, respuestaConsulta) => {
        console.log(n, respuestaConsulta)
        if(n < respuestaConsulta.length) {
            let type = removeAccents(respuestaConsulta[n].type).toLowerCase();
            console.log(respuestaConsulta[n].brand, respuestaConsulta[n].model, type);
            let getResponse = await transformFile3dToString(respuestaConsulta[n].brand, respuestaConsulta[n].model, type);
            console.log(getResponse)
            if(getResponse) {
                n = n+1;
                createElement3D(n, respuestaConsulta)
            }
        }
        if(n == (respuestaConsulta.length)) {
            console.log('terminado')
        }
    }

    const getPMlist = () => {
        return new Promise(resolve => {
            apiIvcRoutes.getPMList()
            .then(data => {
                resolve(data.data)
            })
            .catch(err => {
                console.log('Error', err)
            })
        })
    }

    const getSitesList = () => {
        return new Promise(resolve => {
            apiIvcRoutes.getSites()
            .then(data => {
                resolve(data.data)
            })
            .catch(err => {
                console.log('Error', err)
            })
        })
    }
    
    useEffect(() =>{
        let time = Date.now();
        let minutes = new Date(time).getMinutes();
        let hr = new Date(time).getHours();
        let minString
        if(minutes < 10) {
            minString = '0'+minutes
        }else{
            minString = minutes
        }
        setMin(minString);
        let hrString
        if(hr < 10) {
            hrString = '0'+hr
        }else{
            hrString = hr
        }
        setHr(hrString);
        setInterval(() => {
            let newTime = Date.now()
            if(minutes != new Date(newTime).getMinutes()){
                minutes = new Date(newTime).getMinutes()
                if(minutes < 10) {
                    minString = '0'+minutes
                }else{
                    minString = minutes
                }
                setMin(minString);
            }
            if(hr != new Date(newTime).getHours()){
                hr = new Date(newTime).getHours()
                if(hr < 10) {
                    hrString = '0'+hr
                }else{
                    hrString = hr
                }
                setMin(minString);
            }
        }, 1000);
        let day = new Date(time).getDay();
        let dayName;
        if(day == 1) {
            dayName = 'Lunes'
        }else if(day == 2) {
            dayName = 'Martes'
        }else if(day == 3) {
            dayName = 'Miercoles'
        }else if(day == 4) {
            dayName = 'Jueves'
        }else if(day == 5) {
            dayName = 'Viernes'
        }else if(day == 6) {
            dayName = 'Sabado'
        }else if(day == 0) {
            dayName = 'Domingo'
        }
        let date = new Date(time).getDate()
        let month = new Date(time).getMonth();
        let monthName
        if(month == 0) {
            monthName = 'Enero'
        }else if(month == 1) {
            monthName = 'Febrero'
        }else if(month == 2) {
            monthName = 'Marzo'
        }else if(month == 3) {
            monthName = 'Abril'
        }else if(month == 4) {
            monthName = 'Mayo'
        }else if(month == 5) {
            monthName = 'Junio'
        }else if(month == 6) {
            monthName = 'Julio'
        }else if(month == 7) {
            monthName = 'Agosto'
        }else if(month == 8) {
            monthName = 'Septiembre'
        }else if(month == 9) {
            monthName = 'Octubre'
        }else if(month == 10) {
            monthName = 'Noviembre'
        }else if(month == 11) {
            monthName = 'Diciembre'
        } 
        setDate((dayName + ' ' + date + ' DE ' + monthName).toUpperCase())
    }, [])

    return (
        <Box height='100%' style={{fontFamily:'Raleway'}}>
            <Grid className={classes.pageRoot} container spacing={0}>
                <Grid className={classes.pageContainer} item xs={12}>
                    <Card className={classes.pageCard}>
                        <div style={{height: 70}}>
                            <p style={{fontSize: 24}}>Hola Admin ¿Por dónde quieres comenzar hoy?</p>
                        </div>
                        <Grid item style={{width: '100%', height: '14.5vh', margin: 'auto'}}>
                            <div 
                                style={
                                    {
                                        float: 'left',
                                        margin: 10,
                                        height: '100%',
                                        width: '35vw',
                                        padding: 30, 
                                        backgroundColor: '#F9F9F9', 
                                        borderRadius: 20, 
                                        textTransform: 'none',
                                        verticalAlign: 'middle'

                                    }
                                }>
                                <p style={{fontSize: '2vw', margin: 0}}>10 notificaciones nuevas</p>
                            </div>
                            <div 
                                style={
                                    {
                                        float: 'left',
                                        margin: 10,
                                        height: '100%',
                                        width: '20vw',
                                        padding: 30, 
                                        backgroundColor: '#F9F9F9', 
                                        borderRadius: 20, 
                                        textTransform: 'none',
                                        verticalAlign: 'middle'

                                    }
                                }>
                                <p style={{fontSize: '1.7vw', margin: 0}}>10 notificaciones nuevas</p>
                            </div>
                            <div 
                                style={
                                    {
                                        float: 'left',
                                        margin: 10,
                                        height: '100%',
                                        width: '25vw',
                                        padding: 20, 
                                        backgroundColor: '#F9F9F9', 
                                        borderRadius: 20, 
                                        textTransform: 'none',
                                        verticalAlign: 'middle',
                                        textAlign: 'center'

                                    }
                                }>
                                    <p style={{fontSize: '1vw', margin: 0}}> {date} </p>
                                    <p style={{fontSize: '3vw', margin: 0}}> {hr} <strong>:</strong> {min} hs </p>
                            </div>
                        </Grid>
                        <Grid container spacing={2}>
                                <CardButton variant='inspection'/>
                                <CardButton variant='maintenance'/>
                                <CardButton variant='reports'/>
                                <CardButton variant='administration'/>
                            {/* <Grid item>
                                <CardButton variant='maintenance'/>
                            </Grid>
                            <Grid item>
                                <CardButton variant='reports'/>
                            </Grid>
                            <Grid item>
                                <CardButton variant='administration'/>
                            </Grid> */}
                        </Grid>
                    </Card>
                </Grid>
            </Grid>            
        </Box>
    )
}

export default WelcomePage
