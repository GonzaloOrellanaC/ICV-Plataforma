const removeDatabases = async () => {
    let databases = await window.indexedDB.databases();
    if(databases) {
        databases.forEach((database, index) => {
            window.indexedDB.deleteDatabase(database.name)
        })
    }
}

export default () => {
    window.localStorage.clear();
    window.location.reload();
    removeDatabases();
}