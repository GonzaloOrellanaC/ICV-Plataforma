import { environment } from '../config'

// Enter your storage account name
const storageURL = environment.storageApi.url;
const account = environment.storageApi.account;
const accountKey = environment.storageApi.accessKeys;



const listContainers = async () => {
    /* let containers = blobServiceClient.listContainers();
    const data = await containers.next();
    const data2 = containers.byPage() */
}

const uploadProfileImage = async (file, userId, imageFormat) => {
    //console.log(req)
    let format = imageFormat.replace('image/', '');
    if(format === 'jpeg') {
        format = 'jpg'
    }
    const blobName = `profiles/profile_image_${userId}.${format}`;
    /* let bufferSize = await urltoFile(file);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    console.log('\nUploading to Azure storage as blob:\n\t', blobName);
    const uploadBlobResponse = await blockBlobClient.uploadStream(file, bufferSize, {
        blobHTTPHeaders: {
          blobContentType: imageFormat
        }
      });
    console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId); */
}

const urltoFile = (url) => {
    return new Promise(resolve => {
        const buffer = Buffer.from(url, 'base64');
        resolve(buffer.length)
        /* Jimp.read(buffer, (err, res) => {
            if(err) throw new Error(err);
            const image = res.quality(100).write(filename);
            resolve(image)
        }) */
    })
}

export default {
    listContainers,
    uploadProfileImage
}