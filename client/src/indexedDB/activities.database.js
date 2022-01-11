const initDbActivities = () => {
    const indexedDb = window.indexedDB;

    const conexion = indexedDb.open('Activities',1)

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
            db = e.target.result;
            const coleccionObjetos = db.createObjectStore('Activity',{
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
    const trasaccion = database.transaction(['Activity'],'readwrite')
    const coleccionObjetos = trasaccion.objectStore('Activity')
    const conexion = coleccionObjetos.add(data)
    //consultar()
}

const obtener = (clave, database) =>{
    const trasaccion = database.transaction(['Activity'],'readonly')
    const coleccionObjetos = trasaccion.objectStore('Activity')
    const conexion = coleccionObjetos.get(clave)

    conexion.onsuccess = (e) =>{

    }
    
}

const actualizar = (data, database) =>{  
    return new Promise(resolve => {
        try {
            const trasaccion = database.transaction(['Activity'],'readwrite')
            const coleccionObjetos = trasaccion.objectStore('Activity')
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
    const trasaccion = database.transaction(['Activity'],'readwrite')
    const coleccionObjetos = trasaccion.objectStore('Activity')
    const conexion = coleccionObjetos.delete(clave)

    conexion.onsuccess = () =>{
        consultar()
    }
}

const consultar = (database) =>{
    const trasaccion = database.transaction(['Activity'],'readonly')
    const coleccionObjetos = trasaccion.objectStore('Activity')
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
    initDbActivities,
    agregar,
    obtener,
    actualizar,
    eliminar,
    consultar
}
