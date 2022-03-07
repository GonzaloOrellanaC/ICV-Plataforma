const removeDatabases = async () => {
    let databases = await window.indexedDB.databases();
    if(databases.length > 0) {
        databases.forEach((database, index) => {
            if(database.name === '3Ds' || database.name === 'MachinesParts') {

            }else{
                window.indexedDB.deleteDatabase(database.name)
            }
        })
    }
}

export default () => {
    window.localStorage.clear();
    window.location.reload();
    removeDatabases();
}