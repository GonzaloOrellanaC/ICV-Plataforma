import axios from 'axios'

export default {
    uploadImageProfile: (image, idUser) => {
        const formData = new FormData();
        formData.append('image', image, image.name);
        formData.append('idUser', idUser)
        const config = {
            headers: { "Content-Type": "multipart/form-data" },
        }
        return axios.post('/azure-storage/uploadImageProfile', formData, config)
    },
    uploadImageReport: (image, id, reportData, number) => {
        const formData = new FormData();
        formData.append('image', image, image.name);
        formData.append('id', id);
        formData.append('reportData', reportData);
        formData.append('number', number);
        const config = {
            headers: { "Content-Type": "multipart/form-data" },
        }
        return axios.post('/azure-storage/uploadImageReport', formData, config)
    },
    uploadMachineImage: (image, path, containerName, name) => {
        const formData = new FormData();
        formData.append('image', image, image.name);
        formData.append('path', path);
        formData.append('containerName', containerName);
        formData.append('name', name);
        const config = {
            headers: { "Content-Type": "multipart/form-data" },
        }
        return axios.post('/azure-storage/uploadMachineImage', formData, config)
    },
    uploadImage: (image, path, containerName) => {
        const formData = new FormData();
        formData.append('image', image, image.name);
        formData.append('path', path);
        formData.append('containerName', containerName);
        const config = {
            headers: { "Content-Type": "multipart/form-data" },
        }
        return axios.post('/azure-storage/uploadImage', formData, config)
    },
    uploadVideo: (video, path, containerName) => {
        const formData = new FormData();
        formData.append('video', video, video.name);
        formData.append('path', path);
        formData.append('containerName', containerName);
        const config = {
            headers: { "Content-Type": "multipart/form-data" },
        }
        return axios.post('/azure-storage/uploadVideo', formData, config)
    }
}
