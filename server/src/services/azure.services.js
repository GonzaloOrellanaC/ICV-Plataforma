import { BlobServiceClient  } from '@azure/storage-blob';
import { environment } from '../config';

const blobServiceClient = BlobServiceClient.fromConnectionString(environment.storageApi.accessKeys);

const createContainerIfNotExist = (containerName) => {
    return new Promise(resolve => {
        blobServiceClient.createContainer(containerName)
        .then(ele=>{

            resolve(true)
        },err => {
            resolve(false)
        })
    })
}

const uploadImageProfile = async (req, res) => {
    const { idUser } = req.body;
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            let image = req.files.image;
            const containerName = `users`;
            const createContainer = await createContainerIfNotExist(containerName);
            if(createContainer) {

            }else{

            };
            let stream = image.data;
            let mimetype = image.mimetype.replace('image/', '.');
            if(mimetype === '.jpeg') {
                mimetype = '.jpg'
            } 
            const blobName = `perfiles/${idUser}/foto_perfil${mimetype}`;
            const containerClient = blobServiceClient.getContainerClient(containerName);
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            const uploadBlobResponse = await blockBlobClient.upload(stream, stream.byteLength);
            if(uploadBlobResponse) {
                const blobClient = containerClient.getBlobClient(blobName);
                const downloadBlockBlobResponse = blobClient.url

                res.send({
                    status: true,
                    message: 'File is uploaded',
                    data: {
                        url: downloadBlockBlobResponse
                    }
                });
            }
        }
    } catch(err) {

        res.status(500).send(err);
    }
}

const uploadImageReport = async (req, res) => {
    const { id, reportData, number } = req.body;
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            let image = req.files.image;
            const containerName = `reports`;
            const createContainer = await createContainerIfNotExist(containerName);
            if(createContainer) {

            }else{

            };
            let stream = image.data;
            let mimetype = image.mimetype.replace('image/', '.');
            if(mimetype === '.jpeg') {
                mimetype = '.jpg'
            } 
            const blobName = `${reportData}/${id}_${number}${mimetype}`;
            const containerClient = blobServiceClient.getContainerClient(containerName);
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            const uploadBlobResponse = await blockBlobClient.upload(stream, stream.byteLength);
            if(uploadBlobResponse) {
                const blobClient = containerClient.getBlobClient(blobName);
                const downloadBlockBlobResponse = blobClient.url

                res.send({
                    status: true,
                    message: 'File is uploaded',
                    data: {
                        url: downloadBlockBlobResponse
                    }
                });
            }
        }
    } catch(err) {

        res.status(500).send(err);
    }
}

const uploadImage = async (req, res) => {
    const { path, containerName } = req.body;
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            let image = req.files.image;
            const createContainer = await createContainerIfNotExist(containerName);
            if(createContainer) {

            }else{

            };
            let stream = image.data;
            let mimetype = image.mimetype.replace('image/', '.');
            if(mimetype === '.jpeg') {
                mimetype = '.jpg'
            } 
            const blobName = path + mimetype;
            const containerClient = blobServiceClient.getContainerClient(containerName);
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            const uploadBlobResponse = await blockBlobClient.upload(stream, stream.byteLength);
            if(uploadBlobResponse) {
                const blobClient = containerClient.getBlobClient(blobName);
                const downloadBlockBlobResponse = blobClient.url

                res.send({
                    status: true,
                    message: 'File is uploaded',
                    data: {
                        url: downloadBlockBlobResponse
                    }
                });
            }
        }
    } catch(err) {

        res.status(500).send(err);
    }
}

const uploadPdfFile = async (pdfFile, nroOT) => {
    return new Promise(resolve => {
        const containerName = `pdf`
        const date = Date.now()
        const year = new Date(date).getFullYear()
        /* const createContainer =  */await createContainerIfNotExist(containerName)
        const blobName = `${year}/${nroOT}.pdf`
        const containerClient = blobServiceClient.getContainerClient(containerName)
        const blockBlobClient = containerClient.getBlockBlobClient(blobName)
        const uploadBlobResponse = await blockBlobClient.upload(pdfFile, pdfFile.byteLength)
        if(uploadBlobResponse) {
            const blobClient = containerClient.getBlobClient(blobName)
            const downloadBlockBlobResponse = blobClient.url
            resolve({
                status: true,
                message: 'File is uploaded',
                data: {
                    url: downloadBlockBlobResponse
                }
            })
        }
    })
}

export default {
    uploadImageProfile,
    uploadImageReport,
    uploadImage,
    uploadPdfFile
}