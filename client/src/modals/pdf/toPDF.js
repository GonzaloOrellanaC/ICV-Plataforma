import { date, dateSimple, dateWithTime, environment, getExecutionReportData, getSignById, getUserNameById, imageToBase64, time } from "../../config";
import { pdfMakeRoutes } from "../../routes";
import logo from '../../assets/logo_icv_gris.png';
import check from '../../assets/check.png'
import noCheck from '../../assets/no_check.png'

let imagesList = []

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
            let imgBase64
            if (e.imageUrl) {
                imgBase64 = await getImageBase64(e.imageUrl)
            }
            if(imgBase64) {
                arrayTable[i] = [
                    {
                        image: /* (e.image.length > 0) ? e.image :  */imgBase64.image,
                        width: (500*imgBase64.width)/imgBase64.height,
                        height: 500
                    }
                ]
            }
            if(i == (astList.length - 1)) {
                console.log('Tabla AST lista')
                resolve(arrayTable)
            }
        })
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
                        `${data.name ? data.name : await getUserNameById(data.userSendingData)}\n`,
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

const getImageBase64 = (imageUrl) => {
    return new Promise(resolve => {
        try {
            const img = new Image();
            img.setAttribute('crossOrigin', 'anonymous');
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                console.log(img.width, img.height)
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);
                console.log(ctx)
                const dataURL = canvas.toDataURL("image/jpeg");
                resolve({
                    image: dataURL,
                    width: img.width,
                    height: img.height
                })
            }
            img.onerror = () => {
                console.log('error')
                resolve(null)
            }
            img.src = imageUrl
        } catch (error) {
            resolve(null)
        }
    })
}

let verification = 0

const createImagesTables2 = (executionReportData) => {
    console.log('Creando tabla de imágenes')
    let arrayTable = []
    console.log(imagesList)
    try {
        return new Promise(resolve => {
            imagesList.forEach(async (e, i) => {
                console.log(e)
                let namePicture = e.namePicture.replace('Pregunta', 'Tarea')
                let imgBase64
                if (e.urlImageMessage) {
                    imgBase64 = await getImageBase64(e.urlImageMessage)
                    if (imgBase64) {
                        verification = verification + 1
                    }
                } else {
                    imgBase64 = {
                        image: e.urlBase64
                    }
                }
                arrayTable[i] = [
                    {
                        image: imgBase64.image,
                        width: (500*imgBase64.width)/imgBase64.height,
                        height: 500
                    },
                    {
                        width: 100,
                        alignment: 'center',
                        text: 'Hoja: \n\ '+ e.title + '\n\ \n\ ' + 'Descripción: \n\ '+ e.descr + '\n\ \n\ ' + 'Observaciones: \n\ '+ e.obs + '\n\ \n\ ' + 'Comentario id: \n\ ' + e.id + '\n\ \n\ "' + namePicture + '"' + '\n\ \n\  Imágen: \n\ ' + dateWithTime(e.id) + '\n\ \n\ Usuario: ' + '\n\ ' + e.name + '\n\ \n\ \n\ \n\ __________________',
                    }
                ]
                if(i == (imagesList.length - 1)) {
                    wait(i, arrayTable, resolve)
                }
            })
        })
    } catch (error) {
        console.log(error)
    }
}

const wait = (index, imageArrayColumns, result) => {
    return new Promise(resolve => {
        /* console.log(imagesCache.length, verification) */
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
    const imageCheck = await getImage(check)
    const noImageCheck = await getImage(noCheck)
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
            console.log(e)
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
            }else if(e.messages) {
                /* console.log(e.messages[0]) */
                if(e.messages.length > 0) {
                    e.messages.forEach((commitItem, index) => {
                        if(commitItem.urlBase64 || commitItem.urlImageMessage) {
                            console.log(commitItem)
                            commitItem.title = e.strpmdesc
                            commitItem.descr = e.taskdesc
                            commitItem.obs = e.obs01
                            imagesList.push(commitItem)
                        }
                    })
                }
                if(e.isWarning) {
                    commit = `Observación: -- ${e.messages[0].name}: ${e.messages[0].content}`
                    date = dateSimple(e.messages[0].id)
                    timeData = time(e.messages[0].id)
                }else{
                    commit = `${e.messages[0].name}: ${e.messages[0].content}`
                    date = dateSimple(e.messages[0].id)
                    timeData = time(e.messages[0].id)
                }
            }
            if(e.isWarning) {
                e.image = await imageToBase64(noImageCheck)
            }else{
                e.image = await imageToBase64(imageCheck)
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
                console.log(table)
                resolve(table);
            }
        })
    })
}

const createSignsTable = (chiefMachinerySign, shiftManagerSign, executionUserSign, chiefMachineryName, shiftManagerName, executionUser) => {
    console.log('Creando tabla de firmas')
    console.log(chiefMachinerySign, shiftManagerSign, executionUserSign, chiefMachineryName, shiftManagerName)
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
                    text: chiefMachineryName + '\n\ Jefe de Maquinaria'
                },
                {
                    alignment: 'center',
                    margin: [0, 10, 0, 200],
                    width: 200,
                    text: shiftManagerName + '\n\ Jefe de Turno'
                },
                {
                    alignment: 'center',
                    margin: [0, 10, 0, 200],
                    width: 200,
                    text: executionUser + '\n\ Técnico Inspección o Mantenimiento'
                },
            ]
        },
    ]
}

export default (reportData, machineData, setLoadingMessage/* , stopPrintingLoad */) => {
    console.log(reportData)
    return new Promise(async resolve => {
        if (setLoadingMessage){
            setLoadingMessage('Detectando firmas de los usuarios')
        }
        const admin = await getUserNameById(reportData.createdBy)
        const chiefMachineryName = await getUserNameById(reportData.chiefMachineryApprovedBy)
        const chiefMachinerySign = await getSignById(reportData.chiefMachineryApprovedBy)
        const shiftManagerName = await getUserNameById(reportData.shiftManagerApprovedBy)
        const shiftManagerSign = await getSignById(reportData.shiftManagerApprovedBy)
        const executionUser = await getUserNameById(reportData.usersAssigned[0])
        const executionUserSign = await getSignById(reportData.usersAssigned[0])
        const executionReportData = await getExecutionReportData(reportData)
        console.log(executionReportData)
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
            let filteredKeys = Object.keys(executionReportData[0].group)
            let filteredValues = Object.values(executionReportData[0].group)
            groupKeys = [filteredKeys[0], filteredKeys[1]]
            group = [filteredValues[0], filteredValues[1]]
        }else{
            groupKeys = Object.keys(executionReportData[0].group)
            group = Object.values(executionReportData[0].group)
        }
        if (setLoadingMessage){
            setLoadingMessage('Generando Tablas')
        }
        let docDefinition = {
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
                                    ['Tipo', `${machineData.type}`],
                                    ['Marca', `${machineData.brand}`],
                                    ['Modelo', `${machineData.model}`],
                                    ['N°', `${machineData.equ}`]
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
                                            ['Creado por: ', `${admin}`]
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
                (executionReportData[0].astList && (executionReportData[0].astList.length > 0)) ? 
                {
                    style: 'title',
                    table: {
                        alignment: 'center',
                        widths: ['*'],
                        body: 
                            await createAstImages(executionReportData[0].astList),
                    }
                } : {},
                (imagesList.length > 0) ? {
                    style: 'title',
                    table: {
                        widths: ['*', 100],
                        body: 
                            await createImagesTables2(executionReportData),
                    }
                } : {},
                /* await createImagesTables2() */
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
        };

        console.log(docDefinition)

        if (setLoadingMessage){
            setLoadingMessage('Detectando problemas en el documento')
        }

        if (docDefinition.content.length > 6) {
            if(docDefinition.content[6].table) {
                docDefinition
            } else {
                docDefinition.content.splice(6, 1)
            }
        } else {
            docDefinition
        }

        console.log(docDefinition)

        if (setLoadingMessage){
            setLoadingMessage('Enviando documento compilado al servidor...')
        }
        
        pdfMakeRoutes.createPdf(docDefinition, reportData.idIndex, reportData.sapId, (reportData.guide === 'Pauta de Inspección') ? 'PI' : reportData.guide, reportData.number).then(data=> {
            console.log(data)
            setTimeout(() => {
                if (setLoadingMessage){
                    setLoadingMessage('Documento creado y guardado.')
                }
                setTimeout(() => {
                    resolve({
                        url: data.data.state.data.url,
                        state: true
                    })
                }, 1000);
            }, 1000);
        }).catch(err => {
            alert('Error al descargar PDF');
            console.log(err)
            if (setLoadingMessage){
                setLoadingMessage('Error al crear el documento.')
            }
            setTimeout(() => {
                resolve({
                    state: false
                })
            }, 1000);
        })
    })
    
}
