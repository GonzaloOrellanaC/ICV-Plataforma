const initDb = () => {
    const indexedDb = window.indexedDB;

    const conexion = indexedDb.open('ReportesListos',1)

    let db

    return new Promise(resolve => {
        conexion.onsuccess = () =>{
            db = conexion.result
            resolve(
                {
                    message: "Base de datos abierta",
                    database: db,
                    state: 'abierta'
                }
            )
        }
    
        conexion.onupgradeneeded = (e) =>{
            db = e.target.result
            const coleccionObjetos = db.createObjectStore('reportesListos',{
                keyPath: 'idIndex'
            })
            coleccionObjetos.transaction.oncomplete = (event) => {
                resolve(
                    {
                        message: "Base de datos creada / actualizada",
                        database: db,
                        state: 'actualizada'
                    }
                )
            }
            
        }
    
        conexion.onerror = (error) =>{
            resolve(error)
        }
    })
}

const agregar = (data, database) => {
    const trasaccion = database.transaction(['reportesListos'],'readwrite')
    const coleccionObjetos = trasaccion.objectStore('reportesListos')
    const conexion = coleccionObjetos.add(data)
    //consultar()
}

const obtener = (clave, database) =>{
    return new Promise(result => {
        const trasaccion = database.transaction(['reportesListos'],'readonly')
        const coleccionObjetos = trasaccion.objectStore('reportesListos')
        const conexion = coleccionObjetos.get(Number(clave))
        conexion.onsuccess = (e) =>{
            result(e.target.result)
        }
    })
}

const consultarPorDato = (dato, database) =>{
    return new Promise(result => {
        const trasaccion = database.transaction(['reportesListos'],'readonly')
        const coleccionObjetos = trasaccion.objectStore('reportesListos')
        const conexion = coleccionObjetos.openCursor()
        conexion.onsuccess = (e) =>{
        }
    })
}

const actualizar = (data, database) =>{
    return new Promise(resolve => {
        try {
            const trasaccion = database.transaction(['reportesListos'],'readwrite')
            const coleccionObjetos = trasaccion.objectStore('reportesListos')
            const conexion = coleccionObjetos.put(data)
            
            conexion.onsuccess = () =>{
                resolve(true)
            }
        
        } catch (err) {
            resolve(false)
        }
    })
}

const eliminar = (clave, database) =>{      
    return new Promise(resolve => {
        try {
            const trasaccion = database.transaction(['reportesListos'],'readwrite')
            const coleccionObjetos = trasaccion.objectStore('reportesListos')
            const conexion = coleccionObjetos.delete(Number(clave))
            conexion.onsuccess = () =>{
                resolve(true)
            }
        } catch (error) {
            resolve(false)
        }
    })
}

const consultar = (database) =>{
    const trasaccion = database.transaction(['reportesListos'],'readonly')
    const coleccionObjetos = trasaccion.objectStore('reportesListos')
    const conexion = coleccionObjetos.openCursor()
    
    return new Promise(resolve => {
        conexion.onsuccess = (e) =>{
            const cursor = e.target.result;
            const allObject = coleccionObjetos.getAll()
            allObject.onsuccess = (ev) => {
                resolve(ev.target.result)
            }
        }
    })
}

export default {
    initDb,
    agregar,
    obtener,
    actualizar,
    eliminar,
    consultar,
    consultarPorDato
}
