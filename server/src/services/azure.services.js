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

const uploadPdfFile = (pdfFile, nroOT, sapId, numEquip, guide) => {
    return new Promise(async resolve => {
        const containerName = environment.storageApi.pdfContainer
        const date = Date.now()
        const year = new Date(date).getFullYear()
        const createContainer = await createContainerIfNotExist(containerName)
        if (createContainer) {

        } else {

        }
        const blobName = `${sapId}/${numEquip}/${guide}.pdf`
        const data = Buffer.from(pdfFile, "base64");
        const containerClient = blobServiceClient.getContainerClient(containerName)
        const blockBlobClient = containerClient.getBlockBlobClient(blobName)
        const uploadBlobResponse = await blockBlobClient.upload(data, data.byteLength)
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

const uploadImageFromReport = (imageFile, nroOT, task, mensajeId) => {
    return new Promise(async resolve => {
        const containerName = environment.storageApi.reportImagesContainer
        const date = Date.now()
        const year = new Date(date).getFullYear()
        const createContainer = await createContainerIfNotExist(containerName)
        if (createContainer) {

        } else {

        }
        const blobName = `${year}/${nroOT}/${task}/${mensajeId}.jpg`
        const imageBase64 = imageFile.replace('data:image/jpeg;base64,', '')
        const data = Buffer.from(imageBase64, "base64");
        const containerClient = blobServiceClient.getContainerClient(containerName)
        const blockBlobClient = containerClient.getBlockBlobClient(blobName)
        const uploadBlobResponse = await blockBlobClient.upload(data, data.byteLength)
        if(uploadBlobResponse) {
            const blobClient = containerClient.getBlobClient(blobName)
            const downloadBlockBlobResponse = blobClient.url
            resolve({
                status: true,
                message: 'Image is uploaded',
                data: {
                    url: downloadBlockBlobResponse
                }
            })
        }
    })
}

const uploadImageAstFromReport = (imageFile, nroOT, id) => {
    return new Promise(async resolve => {
        const containerName = environment.storageApi.reportImagesContainer
        const date = Date.now()
        const year = new Date(date).getFullYear()
        const createContainer = await createContainerIfNotExist(containerName)
        if (createContainer) {

        } else {

        }
        const blobName = `${year}/${nroOT}/AST/${id}.jpg`
        const imageBase64 = imageFile.replace('data:image/jpeg;base64,', '')
        const data = Buffer.from(imageBase64, "base64");
        const containerClient = blobServiceClient.getContainerClient(containerName)
        const blockBlobClient = containerClient.getBlockBlobClient(blobName)
        const uploadBlobResponse = await blockBlobClient.upload(data, data.byteLength)
        if(uploadBlobResponse) {
            const blobClient = containerClient.getBlobClient(blobName)
            const downloadBlockBlobResponse = blobClient.url
            resolve({
                status: true,
                message: 'Image is uploaded',
                data: {
                    url: downloadBlockBlobResponse
                }
            })
        }
    })
}

const uploadVideo = async (req, res) => {
    const { path, containerName } = req.body;
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            let video = req.files.video;
            const createContainer = await createContainerIfNotExist(containerName);
            if(createContainer) {

            }else{

            };
            let stream = video.data;
            let mimetype = video.mimetype.replace('video/', '.');
            /* if(mimetype === '.jpeg') {
                mimetype = '.jpg'
            }  */
            /* console.log(video) */
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

const uploadMachineImage = async (req, res) => {
    const { path, containerName, name } = req.body;
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
            /* let mimetype = image.mimetype.replace('image/', '.');
            if(mimetype === '.jpeg') {
                mimetype = '.jpg'
            }  */
            const blobName = `${path}/${name}`;
            const containerClient = blobServiceClient.getContainerClient(containerName);
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            const blobOptions = { blobHTTPHeaders: { blobContentType: 'image/png' } };
            const uploadBlobResponse = await blockBlobClient.upload(stream, stream.byteLength, blobOptions);
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

export default {
    uploadImageProfile,
    uploadImageReport,
    uploadImage,
    uploadVideo,
    uploadPdfFile,
    uploadImageFromReport,
    uploadImageAstFromReport,
    uploadMachineImage
}