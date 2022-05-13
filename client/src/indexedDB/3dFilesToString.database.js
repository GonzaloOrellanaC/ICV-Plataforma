const initDb3DFiles = () => {
    const indexedDb = window.indexedDB;

    const conexion = indexedDb.open('3Ds', 1)

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
            const coleccionObjetos = db.createObjectStore('3dFilesList',{
                keyPath: 'id'
            });
            coleccionObjetos.createIndex("model", "model", {unique: false});
            coleccionObjetos.createIndex("name", "name", {unique: false});
            coleccionObjetos.createIndex("type", "type", {unique: false});
            coleccionObjetos.createIndex("brand", "brand", {unique: false});
            coleccionObjetos.createIndex("nameModel", "nameModel", {unique: false});

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
        const trasaccion = database.transaction(['3dFilesList'],'readwrite')
        const coleccionObjetos = trasaccion.objectStore('3dFilesList')
        const conexion = coleccionObjetos.add(data);
        conexion.onsuccess = async () =>{
            let consultarData = await consultar(database);
            if(consultarData) {
                resolve(true)
            }
        }

        conexion.onerror = (err) => {
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

const buscarPorNombreModelo = (value, database) =>{
    return new Promise(resolve => {
    const trasaccion = database.transaction(['3dFilesList'],'readonly')
    const objectStore = trasaccion.objectStore('3dFilesList')
    const myIndex = objectStore.index('nameModel');
    const conexion = myIndex.get(value)
    conexion.onsuccess = (e) =>{
        resolve(e.target.result)
    }
    })    
}

const actualizar = (data, database) =>{   
    return new Promise(resolve => {
        try {
            const trasaccion = database.transaction(['3dFilesList'],'readwrite')
            const coleccionObjetos = trasaccion.objectStore('3dFilesList')
            const conexion = coleccionObjetos.put(data)
            
            conexion.onsuccess = async () =>{
                resolve(true)
            } 
        } catch (err) {
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
    initDb3DFiles,
    agregar,
    obtener,
    actualizar,
    eliminar,
    consultar,
    buscarPorNombreModelo
}
