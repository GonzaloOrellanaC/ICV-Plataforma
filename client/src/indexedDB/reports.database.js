const initDbReports = () => {
    const indexedDb = window.indexedDB;

    const conexion = indexedDb.open('Documentation', 1)

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
            const coleccionObjetos = db.createObjectStore('Reports',{
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
    return new Promise(resolve => {
        const trasaccion = database.transaction(['Reports'],'readwrite')
        const coleccionObjetos = trasaccion.objectStore('Reports')
        const conexion = coleccionObjetos.add(data)
        conexion.onsuccess = () =>{
            resolve(true)
        }
        conexion.onerror = (err) => {
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

            conexion.onerror = (err) => {
                console.log(err) 
                resolve(true)
            }
        
        } catch (err) {
            console.log(err) 
            resolve(false)
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

        conexion.onerror = () => {
            resolve(false)
        }
    })
}

const removerTodo = (databaseName) => {
    return new Promise(resolve => {
        let req = indexedDB.deleteDatabase(databaseName)
        req.onsuccess = function () {
            resolve(true)
        };
        req.onerror = function () {
            resolve(false)
        };
        req.onblocked = function () {
            resolve(false)
        };
    })
}

const consultar = (database) =>{
    const trasaccion = database.transaction(['Reports'],'readonly')
    const coleccionObjetos = trasaccion.objectStore('Reports')
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
    initDbReports,
    agregar,
    obtener,
    actualizar,
    eliminar,
    removerTodo,
    consultar
}
