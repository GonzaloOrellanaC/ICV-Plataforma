import { Site } from '../models'


const readSites = () => {
    return new Promise(resolve => {
        try{
            Site.find({}, (err, sites) => {
                if(err) {
                    console.log('Error', err)
                }
                resolve(sites)
            })
        } catch (err) {
            console.error('Error al buscar')
            resolve({
                state: false
            })
        }
    })
}

const createSite = (site) => {
    return new Promise(async resolve => {
        try{
            const siteCreated = await new Site(site);
            siteCreated.save();
            resolve(true)
        } catch (err) {
            throw err
        }
    })
}

export default {
    readSites,
    createSite
}
