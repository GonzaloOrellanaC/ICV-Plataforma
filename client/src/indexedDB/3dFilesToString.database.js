const initDbPMs = () => {
    const indexedDb = window.indexedDB;

    const conexion = indexedDb.open('3Ds', 1)

    let db

    return new Promise(resolve => {
        conexion.onsuccess = () =>{
            console.log('conectado')
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
            console.log('actualizado')
            db = e.target.result
            const coleccionObjetos = db.createObjectStore('3dFilesList',{
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
    return new Promise(resolve => {
        const trasaccion = database.transaction(['3dFilesList'],'readwrite')
        const coleccionObjetos = trasaccion.objectStore('3dFilesList')
        const conexion = coleccionObjetos.add(data);
        conexion.onsuccess = async () =>{
            let consultarData = await consultar(database);
            if(consultarData) {
                console.log(consultarData);
                resolve(true)
            }
        }

        conexion.onerror = (err) => {
            console.log(err)
            resolve(false)
        }
    })
    
}

const obtener = (clave, database) =>{
    return new Promise(result => {
    const trasaccion = database.transaction(['3dFilesList'],'readonly')
    const coleccionObjetos = trasaccion.objectStore('3dFilesList')
    const conexion = coleccionObjetos.get(Number(clave))
    conexion.onsuccess = (e) =>{
        result(e.target.result)
    }
    })
    
    
}

const actualizar = (data, database) =>{    
    return new Promise(resolve => {
        const trasaccion = database.transaction(['3dFilesList'],'readwrite')
        const coleccionObjetos = trasaccion.objectStore('3dFilesList')
        const conexion = coleccionObjetos.put(data)
        
        conexion.onsuccess = async () =>{
            let consultarData = await consultar(database);
            if(consultarData) {
                console.log(consultarData);
                resolve(true)
            }
        }

        conexion.onerror = () => {
            resolve(false)
        }
        
    })
}

const eliminar = (clave, database) =>{      
    const trasaccion = database.transaction(['3dFilesList'],'readwrite')
    const coleccionObjetos = trasaccion.objectStore('3dFilesList')
    const conexion = coleccionObjetos.delete(clave)

    conexion.onsuccess = () =>{
        consultar()
    }
}

const consultar = (database) =>{
    const trasaccion = database.transaction(['3dFilesList'],'readonly')
    const coleccionObjetos = trasaccion.objectStore('3dFilesList')
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
