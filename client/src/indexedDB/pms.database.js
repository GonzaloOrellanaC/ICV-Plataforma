const initDbPMs = () => {
    const indexedDb = window.indexedDB;

    const conexion = indexedDb.open('PMs',1)

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
            const coleccionObjetos = db.createObjectStore('ItemList',{
                keyPath: 'id'
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
    const trasaccion = database.transaction(['ItemList'],'readwrite')
    const coleccionObjetos = trasaccion.objectStore('ItemList')
    const conexion = coleccionObjetos.add(data)
    //consultar()
}

const obtener = (clave, database) =>{
    return new Promise(result => {
    const trasaccion = database.transaction(['ItemList'],'readonly')
    const coleccionObjetos = trasaccion.objectStore('ItemList')
    const conexion = coleccionObjetos.get(Number(clave))
    conexion.onsuccess = (e) =>{
        result(e.target.result)
    }
    })
    
    
}

const actualizar = (data, database) =>{    
    const trasaccion = database.transaction(['ItemList'],'readwrite')
    const coleccionObjetos = trasaccion.objectStore('ItemList')
    const conexion = coleccionObjetos.put(data)
    
    conexion.onsuccess = () =>{
        //consultar()
    }
}

const eliminar = (clave, database) =>{      
    const trasaccion = database.transaction(['ItemList'],'readwrite')
    const coleccionObjetos = trasaccion.objectStore('ItemList')
    const conexion = coleccionObjetos.delete(clave)

    conexion.onsuccess = () =>{
        consultar()
    }
}

const consultar = (database) =>{
    const trasaccion = database.transaction(['ItemList'],'readonly')
    const coleccionObjetos = trasaccion.objectStore('ItemList')
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
    consultar
}
