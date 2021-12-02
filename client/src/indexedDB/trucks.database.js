const initDbMachines = () => {
    const indexedDb = window.indexedDB;

    const conexion = indexedDb.open('Trucks',1)

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
            const coleccionObjetos = db.createObjectStore('Machines',{
                keyPath: 'id'
            })
            resolve(
                {
                    message: "Base de datos creada / actualizada",
                    database: db,
                    state: 'actualizada'
                }
            )
        }
    
        conexion.onerror = (error) =>{
            resolve(error)
        }
    })
}

const agregar = (data, database) => {
    const trasaccion = database.transaction(['Machines'],'readwrite')
    const coleccionObjetos = trasaccion.objectStore('Machines')
    const conexion = coleccionObjetos.add(data)
    conexion.onsuccess = () =>{
        //consultar()
    }
}

const obtener = (clave, database) =>{
    const trasaccion = database.transaction(['Machines'],'readonly')
    const coleccionObjetos = trasaccion.objectStore('Machines')
    const conexion = coleccionObjetos.get(clave)

    conexion.onsuccess = (e) =>{
        
    }
    
}

const actualizar = (data, database) =>{    
    const trasaccion = database.transaction(['Machines'],'readwrite')
    const coleccionObjetos = trasaccion.objectStore('Machines')
    const conexion = coleccionObjetos.put(data)
    
    conexion.onsuccess = () =>{
        //consultar()
    }
}

const eliminar = (clave, database) =>{      
    const trasaccion = database.transaction(['Machines'],'readwrite')
    const coleccionObjetos = trasaccion.objectStore('Machines')
    const conexion = coleccionObjetos.delete(clave)

    conexion.onsuccess = () =>{
        consultar()
    }
}

const consultar = (database) =>{
    const trasaccion = database.transaction(['Machines'],'readonly')
    const coleccionObjetos = trasaccion.objectStore('Machines')
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
    initDbMachines,
    agregar,
    obtener,
    actualizar,
    eliminar,
    consultar
}
