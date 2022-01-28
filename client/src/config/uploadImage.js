import { azureStorageRoutes } from "../routes";

export default (file, containerName, path) => {
    if(file) {
        return new Promise(async resolve => {
            let imageLoaded = await azureStorageRoutes.uploadImage(file, path, containerName);
            if(imageLoaded) {
                resolve(imageLoaded);
            }
        })
    }else{
        alert('Imágen no se carga o no se reconoce')
    }
}