const initDbPMs = () => {
    const indexedDb = window.indexedDB;

    const conexion = indexedDb.open('Pautas',1)

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
            const coleccionObjetos = db.createObjectStore('pautas',{
                keyPath: '_id'
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
    return new Promise(resolve => {
        const trasaccion = database.transaction(['pautas'],'readwrite')
        const coleccionObjetos = trasaccion.objectStore('pautas')
        const conexion = coleccionObjetos.add(data)
        conexion.onsuccess = () => {
            resolve({state: true, data: 'Ok'})
        }
        conexion.onerror = (e) => {
            resolve({stata: false, data: e})
        }
    })
    //consultar()
}

const obtener = (clave, database) =>{
    return new Promise(result => {
        const trasaccion = database.transaction(['pautas'],'readonly')
        const coleccionObjetos = trasaccion.objectStore('pautas')
        const conexion = coleccionObjetos.get(Number(clave))
        conexion.onsuccess = (e) =>{
            result(e.target.result)
        }
    })
}

const consultarPorDato = (dato, database) =>{
    return new Promise(result => {
        const trasaccion = database.transaction(['pautas'],'readonly')
        const coleccionObjetos = trasaccion.objectStore('pautas')
        const conexion = coleccionObjetos.openCursor()
        conexion.onsuccess = (e) =>{
        }
    })
}

const actualizar = (data, database) =>{
    return new Promise(resolve => {
        const trasaccion = database.transaction(['pautas'],'readwrite')
        const coleccionObjetos = trasaccion.objectStore('pautas')
        const conexion = coleccionObjetos.put(data)
        conexion.onsuccess = () => {
            resolve({state: true, data: 'Ok'})
        }
        conexion.onerror = (e) => {
            resolve({stata: false, data: e})
        }
    })
}

const eliminar = (clave, database) =>{      
    const trasaccion = database.transaction(['pautas'],'readwrite')
    const coleccionObjetos = trasaccion.objectStore('pautas')
    const conexion = coleccionObjetos.delete(clave)

    conexion.onsuccess = async () =>{
        const res = await consultar()
        console.log(res)
    }
}

const borrarDb = () =>{      
    const deleted = indexedDB.deleteDatabase('Pautas')
    console.log(deleted)
}

const consultar = (database) =>{
    const trasaccion = database.transaction(['pautas'],'readonly')
    const coleccionObjetos = trasaccion.objectStore('pautas')
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
    initDbPMs,
    agregar,
    obtener,
    actualizar,
    eliminar,
    borrarDb,
    consultar,
    consultarPorDato
}
