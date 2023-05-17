import { SocketConnection } from "../../connections"

export default (emailing, idIndex, uid, userData) => {
    let message;
    let url;
    let subtitle;
    if(emailing === 'termino-orden-1') {
        message = `OT ${idIndex} deberá ser revisada por Jefe de Turno`
        url = '/assignment'
        subtitle = `Se ha terminado de ejecutar OT ${idIndex}`
    }else if(emailing === 'termino-orden-2') {
        message = `OT ${idIndex} deberá ser revisada por Jefe de Maquinaria`
        url = '/assignment'
        subtitle = `Se ha terminado de ejecutar OT ${idIndex}`
    }else if(emailing === 'termino-orden-3') {
        message = `OT ${idIndex} deberá ser revisada por Ejecutivo SAP`
        url = '/assignment'
        subtitle = `Se ha terminado de ejecutar OT ${idIndex}`
    }else if(emailing === 'termino-orden-4') {
        message = `OT ${idIndex} Ha sido cerrada por Ejecutivo SAP`
        url = '/reports'
        subtitle = `Se ha terminado de ejecutar OT ${idIndex}`
    }else if(emailing === 'rechazo-orden-0') {
        message = `OT ${idIndex} rechazada`
        url = '/assignment'
        subtitle = `Se ha rechazado ejecución de OT ${idIndex}`
    }else if(emailing === 'rechazo-orden-1') {
        message = `OT ${idIndex} rechazada`
        url = '/assignment'
        subtitle = `Se requiere ajuste de OT ${idIndex}`
    }else if(emailing === 'rechazo-orden-2') {
        message = `OT ${idIndex} rechazada`
        url = '/assignment'
        subtitle = `Se requiere ajuste de OT ${idIndex}`
    }
    SocketConnection.sendnotificationToManyUsers(
        emailing,
        `${userData._id}`,
        'Ejecuciones OT',
        subtitle,
        message,
        url,
        uid
        )
}