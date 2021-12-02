
const indexedDB = window.indexedDB

const readMachines = () => {
    const openDB = indexedDB.open('ICV_DB', 1);
    return new Promise(resolve => {
        openDB.onsuccess = (ev) => {
            const db = openDB.result;
            console.log(db)
            const tx = db.transaction("Machines", "readwrite");
            var store = tx.objectStore("Machines");
            var alldata =  store.getAll()//store.getAll();
            alldata.onsuccess = (ev) => {
                let machinesList = [];
                machinesList = alldata.result;
                resolve(machinesList)
            }
        }
        openDB.onerror = () => {
            //console.log('Error!!!')
        }
    })
}

export default {
    readMachines
}