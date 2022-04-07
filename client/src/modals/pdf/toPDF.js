import { dateSimple, dateWithTime, environment, getExecutionReportData, getSignById, getUserNameById, time } from "../../config";
import { pdfMakeRoutes } from "../../routes";
import logo from '../../assets/logo_icv_gris.png';

let imagesList = new Array;

const createTable = ( groupKeys = new Array, group = new Array) => {
    let arrayTable = []
    return new Promise(resolve => {
        group.forEach(async (element, index) => {
            arrayTable.push(
                {
                    style: 'title',
                    table: {
                        widths: [50, 50, 100, 100, '*'],
                        body: 
                            await createSubTables(element, groupKeys[index], index),
                    }
                },
            );
            if(index == (group.length - 1)) {
                resolve(arrayTable)
            }
        })
    })
}

const createImagesTables = () => {
    let imageArrayColumns = [
        {
            alignment: 'center',
            width: '*',
            pageBreak: 'before',
            text: 'Imágenes de la OT'
        },
        {
            style: 'imageTables',
            table: {},
            layout: 'noBorders'
        }
    ];
    let imageColumns = [];
    let textColumns = [];
    let table = {
        widths: [250, 250],
        height: [200, 200],
        body: []
    }
    let number = 0;
    let numberTop = 2;
    return new Promise(resolve => {
        imagesList.forEach((element, index) => {
            if((index) == numberTop) {
                table.body[number] = imageColumns;
                table.body[number + 1] = textColumns;
                imageColumns = [];
                textColumns = [];            
                number = numberTop
                numberTop = numberTop + numberTop
            }
            let imageContent = {
                width: 150,
                alignment: 'center',
                image: element.urlBase64
            }
            let textContent = {
                width: 150,
                alignment: 'center',
                text: 'Comentario id: ' + element.id + '\n\ "' + element.commit + '"' + '\n\ Imágen: ' + dateWithTime(element.id) + '\n\ Usuario: ' + element.userName + '\n\ ',
            }
            
            imageColumns.push(imageContent);
            textColumns.push(textContent);
            
            if(index == (imagesList.length - 1)) {
                if( (imagesList.length%2) == 1 ) {
                    imageColumns.push({})
                    textColumns.push({})
                }
                table.body[number] = imageColumns;
                table.body[number + 1] = textColumns;
                //console.log(table)
                imageArrayColumns[1].table = table;
                imageColumns = [];
                textColumns = [];
                table = {
                    widths: [250, 250],
                    height: [200, 200],
                    body: []
                }
                number = 0;
                numberTop = 2;
                imagesList = [];
                resolve(imageArrayColumns)
            }
        })
    })
}

const createSubTables = (list = new Array, index = new String, indexNumber = new Number) => {
    let pageBreak;
    if(indexNumber == 0) {
        pageBreak = 'none'
    }else{
        pageBreak = 'before'
    }
    let table = [
        [
            {
                colSpan: 5, 
                border: [true, true, true, true],
                text: index,
                fillColor: '#DADADA',
                pageBreak: pageBreak
            },
            {},
            {},
            {},
            {}
        ]
    ];
    return new Promise(resolve => {
        list.forEach((e, i) => {
            let commit;
            let date;
            let timeData;
            if(e.writeCommits) {
                //console.log(e.writeCommits);
                if(e.writeCommits.length > 0) {
                    e.writeCommits.forEach((commitItem, index) => {
                        if(commitItem.urlBase64) {
                            imagesList.push(commitItem)
                        }
                    })
                }
                commit = `${e.writeCommits[0].userName}: ${e.writeCommits[0].commit}`
                date = dateSimple(e.writeCommits[0].id)
                timeData = time(e.writeCommits[0].id)
            }else if(e.readCommits){
                //console.log(e.readCommits);
                if(e.readCommits.length > 0) {
                    e.readCommits.forEach((commitItem, index) => {
                        if(commitItem.urlBase64) {
                            imagesList.push(commitItem)
                        }
                    })
                }
                commit = `Observación: -- ${e.readCommits[0].userName}: ${e.readCommits[0].commit}`
                date = dateSimple(e.readCommits[0].id)
                timeData = time(e.readCommits[0].id)
            }else if(e.messages) {
                if(e.messages.length > 0) {
                    e.messages.forEach((commitItem, index) => {
                        if(commitItem.urlBase64) {
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
            
            table.push([ 
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
                    text: commit
                }
            ])
            if(i == (list.length - 1)) {
                resolve(table);
            }
        })
    })
}

export default async (reportData, machineData, stopPrintingLoad, fileName) => {
    const admin = await getUserNameById(reportData.createdBy)
    const adminSign = await getSignById(reportData.createdBy)
    const chiefMachineryName = await getUserNameById(reportData.chiefMachineryApprovedBy)
    const chiefMachinerySign = await getSignById(reportData.chiefMachineryApprovedBy)
    const shiftManagerName = await getUserNameById(reportData.shiftManagerApprovedBy)
    const shiftManagerSign = await getSignById(reportData.shiftManagerApprovedBy)
    const executionUser = await getUserNameById(reportData.usersAssigned[0])
    const executionUserSign = await getSignById(reportData.usersAssigned[0])
    const executionReportData = await getExecutionReportData(reportData)
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
                        text: `ORDEN DE TRABAJO ${reportData.idIndex} \n PAUTA DE ${reportData.reportType}`.toUpperCase() , 
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
                        width: 150,
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
                        width: 170,
                        columns: [
                            {
                                width: '*',
                                text: ''
                            },
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
                        width: 170,
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
                            }
                        ]
                    }
                ]
            },
            {
                style: 'title',
                table: {
                    widths: [50, 50, 100, 100, '*'],
                    body: [
                        ['Fecha', 'Personal Necesario', 'Descripción de la tarea', 'Observaciones', 'Comentarios']
                    ]
                },
                layout: {
                    fillColor: '#DADADA'
                }
            },
            await createTable(groupKeys, group),
            {
                columns: [
                    {
                        text: 'Responsables: ',
                        margin: [0, 50, 0, 0],
                    },
                    {
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
                        width: 125,
			            height: 100,
                        image: adminSign
                    },
                    {
                        alignment: 'center',
                        margin: [0, 100, 0, 10],
                        width: 125,
			            height: 100,
                        image: chiefMachinerySign
                    },
                    {
                        alignment: 'center',
                        margin: [0, 100, 0, 10],
                        width: 125,
			            height: 100,
                        image: shiftManagerSign
                    },
                    {
                        alignment: 'center',
                        margin: [0, 100, 0, 10],
                        width: 125,
			            height: 100,
                        image: executionUserSign
                    },
                ]
            },
            {
                columns: [
                    {
                        alignment: 'center',
                        margin: [0, 10, 0, 200],
                        width: '*',
                        text: admin + '\n\ Ejecutivo SAP'
                    },
                    {
                        alignment: 'center',
                        margin: [0, 10, 0, 200],
                        width: '*',
                        text: chiefMachineryName + '\n\ Jefe de Maquinaria'
                    },
                    {
                        alignment: 'center',
                        margin: [0, 10, 0, 200],
                        width: '*',
                        text: shiftManagerName + '\n\ Jefe de Turno'
                    },
                    {
                        alignment: 'center',
                        margin: [0, 10, 0, 200],
                        width: '*',
                        text: executionUser + '\n\ Técnico Inspección o Mantenimiento'
                    },
                ]
            },
            {
                margin: [0, 10, 0, 200],
                text: `Descargado desde https://mantencion.icv.cl`
            },
             await createImagesTables()
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
                fontSize: 10,
                bold: 'true',
                alignment: 'center'
            },
            tableHeader: {
                bold: true,
                fontSize: 13,
                color: 'black'
            }
        },
    };

    
    pdfMakeRoutes.createPdf(docDefinition).then(data=> {
        const linkSource = data.data;
        let a = document.createElement("a");
        a.href = linkSource;
        a.download = `${fileName}.pdf`
        a.click();
        stopPrintingLoad()
    }).catch(err => {
        alert('Error al descargar PDF');
        stopPrintingLoad()
    })
    
}
