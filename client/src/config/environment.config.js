
const environment = {
    storageURL: process.env.URL_STORAGE || 'https://icvmantencion.blob.core.windows.net/plataforma-mantencion/',
    version: 'versión 1.2',
    storageApi: {
        account: process.env.AZURE_ACCOUNT,
        accountKey: process.env.TOKEN_SAS_BLOB,
        url: process.env.STORAGE_URL,
        urlWithKey: process.env.URL_SAS_BLOB,
        accessKeys: process.env.ACCESS_KEYS
    },
}

export default environment