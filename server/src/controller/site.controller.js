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

const detectSiteIfExist = async (site) => {
    try {
        const siteExist = await Site.findOne({idobra: site.idobra})
        console.log(siteExist)
        if (siteExist) {
            return true
        } else {
            return false
        }
    } catch (error) {
        return false
    }
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
    detectSiteIfExist,
    createSite
}
