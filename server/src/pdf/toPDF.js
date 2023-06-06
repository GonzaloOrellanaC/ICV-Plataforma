import { environment } from "../config"
import { ExecutionReport, Users } from "../models"
import { AzureServices, ReportsService } from "../services"
import pdfMake from 'pdfmake'
import fs from 'fs'
import axios from 'axios'
import path from 'path'
const {logo, check, noCheck} = environment.images
const time = (time) => {
    let hr = new Date(time).getHours();
    let min = new Date(time).getMinutes();
    if(hr < 10) {
        hr = '0' + hr;
    }
    if(min < 10) {
        min = '0' + min
    }
    if(!time) {
        return 'Sin información'
    }else{
        return(hr + ':' + min)
    }
}

const dateWithTime = (time) => {
    let toDay = Date.now();

    let hr = new Date(time).getHours();
    let min = new Date(time).getMinutes();

    if(hr < 10) {
        hr = '0'+hr;
    }

    if(min < 10) {
        min = '0'+min
    }


    let day = new Date(time).getDay();
    let dayName;
    if((day == new Date(toDay).getDay())&&(day < (toDay - 259200000))) {
        dayName = 'Hoy'
    }else if((day == (new Date(toDay).getDay() - 1))&&(day < (toDay - 259200000))){
        dayName = 'Ayer'
    }else{
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
    }
     
    let date = new Date(time).getDate();
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
    if(!time) {
        return 'Sin información'
    }else{
        if((dayName === 'Hoy')||(dayName === 'Ayer')) {
            return(dayName + ' ' + hr + ':' + min)
        }else{
            return (dayName + ' ' + date + ' DE ' + monthName + ' ' + hr + ':' + min)
        }
    }
}

const date = (time) => {
    if(!time) {
        return ('Sin información').toUpperCase()
    }else{
        let day = new Date(time).getDay() + 1
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
        }else if(day == 7) {
            dayName = 'Domingo'
        }
        let date = new Date(time).getUTCDate();
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
        return (dayName + ' ' + date + ' DE ' + monthName).toUpperCase()
    }
}

const dateSimple = (time) => {
    let date = new Date(time).getUTCDate();
    let month = new Date(time).getMonth() + 1;
    let year = new Date(time).getFullYear();
    if(month < 10) {
        month = '0' + month
    }
    if(date < 10) {
        date = '0' + date
    }
    if(!time) {
        return('No informado')
    }else{
        return (date + '/' + month +'/' + year)
    }
}

const createTable = ( groupKeys, group ) => {
    console.log('Creando Tabla')
    let arrayTable = []
    return new Promise(resolve => {
        group.forEach(async (element, index) => {
            arrayTable[index] = {
                                    style: 'title',
                                    table: {
                                        widths: [10, 50, 40, 130, 170, 50, 50, 30, '*', 35],
                                        body: 
                                            await createSubTables(element, groupKeys[index], index),
                                    }
                                }
            if(index == (group.length - 1)) {
                resolve(arrayTable)
            }
        })
    })
}

const createAstImages = (astList) => {
    console.log('Creando tabla de las AST')
    let arrayTable = []
    return new Promise(resolve => {
        console.log(astList)
        astList.forEach(async (e, i) => {
            /* let imgBase64
            if (e.imageUrl) {
                imgBase64 = await getImageBase64(e.imageUrl)
            }
            if(imgBase64) {
                
            } */
            arrayTable[i] = [
                {
                    image: e.imageUrl/* (e.image.length > 0) ? e.image :  imgBase64.image*/,
                    width: 500/* (500*imgBase64.width)/imgBase64.height */,
                    height: 400
                }
            ]
            if(i == (astList.length - 1)) {
                console.log('Tabla AST lista')
                resolve(arrayTable)
            }
        })
    })
}

const getUser = (_id) => {
    return new Promise(async resolve => {
        let user = await Users.findById(_id);
        if (user) {
            resolve(`${user.name} ${user.lastName}`)
        } else {
            resolve('Test Name')
        }
    })
}

const crateHistoryTable = ( history ) => {
    console.log('Creando tabla de historial')
    let arrayTable = []
    return new Promise(resolve => {
        history.sort((a, b) => {
            return a.id - b.id
        })
        history.forEach(async (data, index) => {
            if (index == 0) {
                arrayTable.push(
                    {
                        pageBreak: 'before',
                        text: 'Historial de la OT\n\n',
                        fontSize: 16,
                        bold: true
                    }
                )
            }
            arrayTable.push(
                {
                    text: [
                        `${data.name ? data.name : await getUser(data.userSendingData)}\n`,
                    ],
                    bold: true,
                    fontSize: 8
                },
                {
                    text: [
                        `Fecha: ${date(data.id).toLowerCase()}\n`,
                    ],
                    fontSize: 8
                },
                {
                    text: [
                        'Estado: ' + `${(data.type === "sending-to-next-level") ? 'Enviado' : 'Rechazado'}\n`,
                    ],
                    color: `${(data.type === "sending-to-next-level") ? '#81E508' : '#852F07'}`,
                    fontSize: 8
                },
                {
                    text: 'Mensaje: \n',
                    fontSize: 8
                },
                {
                    text: [
                        {
                            text: `${data.message}\n`,
                            italics: true
                        }
                    ],
                    fontSize: 8
                },
                {
                    text: '.................................\n'
                }
            )
            if(index == (history.length - 1)) {
                console.log('Tabla historial lista')
                resolve(arrayTable)
            }
        })
    })
}

const getImage = (imageUrl) => {
    console.log('Creando imágen...')
    return new Promise(async resolve => {
        const response = await fetch(imageUrl)
        const imageBlob = await response.blob()
        resolve(imageBlob)
    })
}

const getImageBase64 = async (imageUrl) => {
    try {
        console.log('URL imágen ',imageUrl)
        const image = await axios.get(imageUrl, {responseType: 'arraybuffer'})
        const returnedB64 = Buffer.from(image.data).toString('base64')
        return `data:image/jpeg;base64,${returnedB64}`
    } catch (error) {
        
    }
}

let imagesList = []
let verification = 0

const createImagesTables2 = (executionReportData) => {
    console.log('Creando tabla de imágenes')
    let arrayTable = []
    try {
        return new Promise(resolve => {
            console.log('Listado de imagenes ', imagesList)
            imagesList.forEach(async (e, i) => {
                let namePicture = e.namePicture ? e.namePicture.replace('Pregunta', 'Tarea') : ''
                const imageData = await getImageBase64(e.urlImageMessage)
                if (imageData)
                verification = verification + 1
                arrayTable[i] = [
                    {
                        image: imageData,
                        width: 500,
                        height: 500
                    },
                    {
                        width: 100,
                        alignment: 'center',
                        text: 'Hoja: \n\ '+ e.title + '\n\ \n\ ' + 'Descripción: \n\ '+ e.descr + '\n\ \n\ ' + 'Observaciones: \n\ '+ e.obs + '\n\ \n\ ' + 'Comentario id: \n\ ' + e.id + '\n\ \n\ "' + namePicture + '"' + '\n\ \n\  Imágen: \n\ ' + dateWithTime(e.id) + '\n\ \n\ Usuario: ' + '\n\ ' + e.name + '\n\ \n\ \n\ \n\ __________________',
                    }
                ]
                if(i == (imagesList.length - 1)) {
                    const response = await wait(i, arrayTable, resolve)
                    if (response) {
                        imagesList = []
                        verification = 0
                    }
                }
            })
        })
    } catch (error) {
        console.log(error)
    }
}

const wait = (index, imageArrayColumns, result) => {
    return new Promise(resolve => {
        setTimeout(() => {
            if (imageArrayColumns.length == verification) {
                console.log('Tabla de imágenes lista')
                result(imageArrayColumns)
                resolve(true)
            } else {
                wait(index, imageArrayColumns, result)
            }
        }, 1000);
    })
} 

const createSubTables = async (list, index, indexNumber) => {
    console.log('Creando subtabla ' + (index + 1))
    let pageBreak;
    if(indexNumber == 0) {
        pageBreak = 'none'
    }else{
        pageBreak = 'before'
    }
    let table = [
        [
            {
                colSpan: 10, 
                border: [true, true, true, true],
                text: `${indexNumber}.- ${index}`,
                fillColor: '#DADADA',
                pageBreak: pageBreak
            },
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {}
        ]
    ];
    return new Promise(resolve => {
        list.forEach(async (e, i) => {
            let commit;
            let date;
            let timeData;
            if(e.writeCommits) {
                if(e.writeCommits.length > 0) {
                    e.writeCommits.forEach((commitItem, index) => {
                        if(commitItem.urlBase64 || commitItem.urlImageMessage) {
                            imagesList.push(commitItem)
                        }
                    })
                }
                commit = `${e.writeCommits[0].userName}: ${e.writeCommits[0].commit}`
                date = dateSimple(e.writeCommits[0].id)
                timeData = time(e.writeCommits[0].id)
            }else if(e.readCommits){
                if(e.readCommits.length > 0) {
                    e.readCommits.forEach((commitItem, index) => {
                        if(commitItem.urlBase64 || commitItem.urlImageMessage) {
                            imagesList.push(commitItem)
                        }
                    })
                }
                commit = `Observación: -- ${e.readCommits[0].userName}: ${e.readCommits[0].commit}`
                date = dateSimple(e.readCommits[0].id)
                timeData = time(e.readCommits[0].id)
            }else if(e.messages && e.messages.length > 0) {
                /* console.log(e.messages[0]) */
                if(e.messages.length > 0) {
                    e.messages.forEach((commitItem, index) => {
                        if(commitItem.urlBase64 || commitItem.urlImageMessage) {
                            commitItem.title = e.strpmdesc
                            commitItem.descr = e.taskdesc
                            commitItem.obs = e.obs01
                            imagesList.push(commitItem)
                        }
                    })
                }
                if(e.isWarning) {
                    commit = `Observación: -- ${e.messages[0].name ? e.messages[0].name : 'N/A'}: ${e.messages[0].content ? e.messages[0].content : 'N/A'}`
                    date = e.messages[0].id ? dateSimple(e.messages[0].id) : 'N/A'
                    timeData = e.messages[0].id ? time(e.messages[0].id) : 'N/A'
                }else{
                    commit = `${e.messages[0] ? e.messages[0].name : 'N/A'}: ${e.messages[0] ? e.messages[0].content : 'N/A'}`
                    date = dateSimple(e.messages[0] ? e.messages[0].id : 'N/A')
                    timeData = time(e.messages[0] ? e.messages[0].id : 'N/A')
                }
            }
            if(e.isWarning) {
                e.image = noCheck /* await getImageBase64(path.resolve(__dirname, '../assets/no_check.png')) */
            }else{
                e.image = check /* await getImageBase64(path.resolve(__dirname, '../assets/check.png')) */
            }
            
            table[i+1] = [ 
                {
                    alignment: 'center',
                    fontSize: 8,
                    text: i + 1
                },
                {
                    fontSize: 8,
                    text: `${date} \n\ ${timeData}` 
                },
                {
                    fontSize: 8,
                    text: e.workteamdesc
                },
                {
                    fontSize: 8,
                    text: e.taskdesc
                },
                {
                    fontSize: 8,
                    text: e.obs01
                },
                {
                    fontSize: 8,
                    text: (e.partnumberUtl === '*') ? 'N/A' : e.partnumberUtl
                },
                {
                    fontSize: 8,
                    text: e.unidadData ? `${e.unidadData} ${e.unidad}` : 'N/A'
                },
                {
                    fontSize: 8,
                    text: (e.idtypeutlPartnumber === '*') ? 'N/A' : `${e.idtypeutlPartnumber}`
                },
                {
                    fontSize: 8,
                    text: commit
                },
                {
                    alignment: 'center',
                    image: e.image,
                    width: 15
                }
            ]
            if(i == (list.length - 1)) {
                resolve(table);
            }
        })
    })
}

const createSignsTable = (chiefMachinerySign, shiftManagerSign, executionUserSign, chiefMachineryName, shiftManagerName, executionUser) => {
    console.log('Creando tabla de firmas')
    return [
        {
            columns: [
                {
                    pageBreak: 'before',
                    text: 'Responsables: ',
                    margin: [0, 50, 0, 0],
                },
                {
                    pageBreak: 'before',
                    alignment: 'right',
                    margin: [0, 50, 0, 0],
                    width: '*',
                    text: `Fecha: ${dateSimple(Date.now())} \n\ Hora: ${time(Date.now())}`
                }
            ]
        },
        {
            columns: [
                {
                    alignment: 'center',
                    margin: [0, 100, 0, 10],
                    width: 200,
                    height: 100,
                    image: chiefMachinerySign ? chiefMachinerySign : null
                },
                {
                    alignment: 'center',
                    margin: [0, 100, 0, 10],
                    width: 200,
                    height: 100,
                    image: shiftManagerSign ? shiftManagerSign : null
                },
                {
                    alignment: 'center',
                    margin: [0, 100, 0, 10],
                    width: 200,
                    height: 100,
                    image: executionUserSign ? executionUserSign : null
                },
            ]
        },
        {
            columns: [
                {
                    alignment: 'center',
                    margin: [0, 10, 0, 200],
                    width: 200,
                    text: `${chiefMachineryName.name} ${chiefMachineryName.lastName}` + '\n\ Jefe de Maquinaria'
                },
                {
                    alignment: 'center',
                    margin: [0, 10, 0, 200],
                    width: 200,
                    text: `${shiftManagerName.name} ${shiftManagerName.lastName}` + '\n\ Jefe de Turno'
                },
                {
                    alignment: 'center',
                    margin: [0, 10, 0, 200],
                    width: 200,
                    text: `${executionUser.name} ${executionUser.lastName}` + '\n\ Técnico Inspección o Mantenimiento'
                },
            ]
        },
    ]
}



const createPdfBinary = ( pdfContent, resp, callback ) => {
    console.log(pdfContent)
    var fonts = {
        Roboto: {
            normal: path.resolve(__dirname, "../fonts/Roboto-Regular.ttf"),
            bold: path.resolve(__dirname, "../fonts/Roboto-Medium.ttf"),
            italics: path.resolve(__dirname, "../fonts/Roboto-Italic.ttf"),
            bolditalics: path.resolve(__dirname, "../fonts/Roboto-MediumItalic.ttf"),
        }
    }
    resp+='Fonts OK!'
    /* console.log(fonts) */
    const doc = new pdfMake(fonts)
    console.log(doc)
    resp+='Doc OK!'
    const pdf = doc.createPdfKitDocument(pdfContent)
    /* console.log(pdf) */
    if (pdf) {
        console.log('Ok')
        resp+='PDF OK!'
    }
    var chunks = []
    var result
    pdf.on('data', (chunk) => {
        //console.log(chunk)
        chunks.push(chunk)
    }, err => {
        Sentry.captureException(err)
    })
    pdf.on('end', () => {
        result = Buffer.concat(chunks)
        if(result) {
            console.log('Listo a guardar en Nube')
            resp+='Listo a guardar en Nube!'
        }
        console.log('PDF Listo')
        callback(result, resp)
    }, err => {
        Sentry.captureException(err)
    })
    pdf.end()
}

const toPDF = (reportData) => {
    return new Promise(async resolve => {
        const admin = await Users.findById(reportData.createdBy)
        const chiefMachineryName = await Users.findById(reportData.chiefMachineryApprovedBy)
        const chiefMachinerySign = chiefMachineryName.sign
        const shiftManagerName = await Users.findById(reportData.shiftManagerApprovedBy)
        const shiftManagerSign = shiftManagerName.sign
        const executionUser = await Users.findById(reportData.usersAssigned[0])
        const executionUserSign = executionUser.sign
        const executionReportData = await ExecutionReport.findOne({reportId: reportData._id})
        if (chiefMachinerySign) {
            console.log('Firma de jefe maquinaria')
        }
        if (shiftManagerSign) {
            console.log('Firma de jefe de turno')
        }
        if (executionUserSign) {
            console.log('Firma de operario')
        }
        let groupKeys
        let group
        if(reportData.testMode) {
            let filteredKeys = Object.keys(executionReportData.group)
            let filteredValues = Object.values(executionReportData.group)
            groupKeys = [filteredKeys[0], filteredKeys[1]]
            group = [filteredValues[0], filteredValues[1]]
        }else{
            groupKeys = Object.keys(executionReportData.group)
            group = Object.values(executionReportData.group)
        }
        let pdfContent = {
            pageOrientation: 'landscape',
            content: [
                {
                    columns: [
                        {
                            alignment: 'left',
                            text: 'DEPTO DE CONTROL Y GESTIÓN DE MAQUINARIA',
                            style: 'deptoInfo',
                            width: 100,
                        },
                        {
                            alignment: 'center',
                            text: `ORDEN DE TRABAJO ${reportData.idIndex} \n PAUTA DE ${reportData.reportType} ${reportData.guide}`.toUpperCase() , 
                            style: 'subheader',
                            width: '*'
                        },
                        {
                            width: 100,
                            columns: [
                                {
                                    width: '*',
                                    text: ''
                                },
                                {
                                    alignment: 'right',
                                    image: logo,
                                    width: 60
                                }
                            ]
                        }
                    ]
                },
                {
                    columns: [
                        {
                            width: 200,
                            style: 'table',
                            table: {
                                body: [
                                    ['Tipo', `${reportData.machineData.type}`],
                                    ['Marca', `${reportData.machineData.brand}`],
                                    ['Modelo', `${reportData.machineData.model}`],
                                    ['N°', `${reportData.machineData.equ}`]
                                ]
                            }
                        },
                        {
                            width: 200,
                            columns: [
                                {
                                    width: 50,
                                    style: 'table',
                                    table: {
                                        body: [
                                            ['Equipos', `TODOS`],
                                            ['Pauta', `${reportData.idPm}`]
                                        ]
                                    }
                                },
                                {
                                    width: '*',
                                    text: ''
                                },
                            ]
                        },
                        {
                            width: 200,
                            columns: [
                                {
                                    width: '*',
                                    text: ''
                                },
                                {
                                    width: 70,
                                    style: 'table',
                                    table: {
                                        body: [
                                            ['Fecha Creación: ', `${dateSimple(reportData.createdAt)}`],
                                            ['Creado por: ', `${admin.name} ${admin.lastName}`]
                                        ]
                                    }
                                },
                                {
                                    width: '*',
                                    text: ''
                                },
                            ]
                        },
                        {
                            width: 250,
                            columns: [
                                {
                                    width: '*',
                                    text: ''
                                },
                                {
                                    width: 200,
                                    style: 'table',
                                    table: {
                                        body: [
                                            ['ID Documento: ', `${reportData.idPm}-${reportData.guide}`]
                                        ]
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    style: 'title',
                    table: {
                        widths: [10, 50, 40, 130, 170, 50, 50, 30, '*', 35],
                        body: [
                            ['N°', 'Fecha', 'Personal Necesario', 'Descripción de la tarea', 'Observaciones', 'N° Parte Utilizado', 'Cantidad Utilizada', 'Tipo Rpto', 'Comentarios', 'Trabajo Realizado']
                        ]
                    },
                    layout: {
                        fillColor: '#DADADA'
                    }
                },
                await createTable(groupKeys, group),
                (reportData.history.length > 0) ? await crateHistoryTable(reportData.history) : {},
                createSignsTable(chiefMachinerySign, shiftManagerSign, executionUserSign, chiefMachineryName, shiftManagerName, executionUser),
                /* (executionReportData.astList && (executionReportData.astList.length > 0)) ? 
                {
                    style: 'title',
                    table: {
                        alignment: 'center',
                        widths: ['*'],
                        body: 
                            await createAstImages(executionReportData.astList),
                    }
                } : {},
                (imagesList.length > 0) ? {
                    style: 'title',
                    table: {
                        widths: ['*', 100],
                        body: 
                            await createImagesTables2(executionReportData),
                    }
                } : {}, */
                (imagesList.length > 0) ? {
                    style: 'title',
                    table: {
                        widths: ['*', 100],
                        body: 
                            await createImagesTables2(executionReportData)
                    }
                } : {}
            ],
            styles: {
                imageTables: {
                    fontSize: 8,
                    margin: [0, 50, 0, 50]
                },
                header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 0, 0, 10]
                },
                deptoInfo: {
                    fontSize: 8,
                    bold: false,
                    margin: [10, 10, 10, 10]
                },
                subheader: {
                    fontSize: 16,
                    bold: true,
                    margin: [0, 10, 0, 5]
                },
                table: {
                    margin: [0, 5, 0, 15],
                    fontSize: 6
                },
                title: {
                    margin: [0, 5, 0, 15],
                    fontSize: 8,
                    bold: 'true',
                    alignment: 'center'
                },
                historial: {
                    margin: [0, 5, 0, 15],
                    fontSize: 10,
                    bold: true,
                    alignment: 'justify'
                },
                tableHeader: {
                    bold: true,
                    fontSize: 13,
                    color: 'black'
                }
            },
        }

        if (pdfContent.content.length > 6) {
            if(pdfContent.content[6].table) {
                pdfContent
            } else {
                pdfContent.content.splice(6, 1)
            }
        } else {
            pdfContent
        }

        let resp = ''

        if(pdfContent) {
            console.log('Contenido descargado')
            resp+='PDF descargado'
        } else {
            Sentry.captureMessage('Contenido para crear PDF no cargado', 'warning')
        }
    
        createPdfBinary(pdfContent, resp, async (binary, resp) => {
            console.log('Enviando...')
            const state = await AzureServices.uploadPdfFile(binary, reportData.idIndex, reportData.sapId, reportData.machine, (reportData.guide === 'Pauta de Inspección') ? 'PI' : reportData.guide)
            const data = await ReportsService.editReportByIndexIntern(reportData.idIndex, {urlPdf: state.data.url})
            resolve({state: state, url: state.data.url})
        }, (error) => {
            resolve({state: state, url: state.data.url})
            Sentry.captureException(error)
        })
    })
    
}

export default toPDF