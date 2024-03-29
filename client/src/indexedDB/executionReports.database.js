const initDb = () => {
    const indexedDb = window.indexedDB;

    const conexion = indexedDb.open('Executions',1)

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
            const coleccionObjetos = db.createObjectStore('Reports',{
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
        console.log('guardando en base de datos')
        const trasaccion = database.transaction(['Reports'],'readwrite')
        const coleccionObjetos = trasaccion.objectStore('Reports')
        const conexion = coleccionObjetos.add(data)
        console.log(conexion)
        conexion.onsuccess = () =>{
            console.log('success')
            resolve(true)
        }
        
        conexion.onerror = () =>{
            console.log('error')
            resolve(false)
        }
    })
}

const obtener = (clave, database) =>{
    return new Promise(resolve => {
        const trasaccion = database.transaction(['Reports'],'readonly')
        const coleccionObjetos = trasaccion.objectStore('Reports')
        const conexion = coleccionObjetos.get(clave)
        conexion.onsuccess = (e) =>{
            resolve(e.target.result)
        }
        conexion.onerror = (err) => {
            resolve(false)
        }
    })
    
}

const actualizar = (data, database) =>{    
    return new Promise(resolve => {
        try {
            const trasaccion = database.transaction(['Reports'],'readwrite')
            const coleccionObjetos = trasaccion.objectStore('Reports')
            const conexion = coleccionObjetos.put(data)
            
            conexion.onsuccess = () =>{
                resolve(true)
            }

            conexion.onerror = () => {
                resolve(false)
            }
        
        } catch (err) {
            resolve(err)
        }
    }) 
}

const eliminar = (clave, database) =>{      
    return new Promise(resolve => {
        const trasaccion = database.transaction(['Reports'],'readwrite')
        const coleccionObjetos = trasaccion.objectStore('Reports')
        const conexion = coleccionObjetos.delete(clave)

        conexion.onsuccess = () =>{
            resolve(true)
        }
    })
}

const consultar = (database) => {
    return new Promise(resolve => {
        const trasaccion = database.transaction(['Reports'],'readonly')
        const coleccionObjetos = trasaccion.objectStore('Reports')
        const conexion = coleccionObjetos.openCursor()

    
        conexion.onsuccess = (e) =>{
            const cursor = e.target.result;
            const allObject = coleccionObjetos.getAll()
            allObject.onsuccess = (ev) => {
                let result = new Array()
                result = ev.target.result
                resolve(result)
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
    consultar
}
