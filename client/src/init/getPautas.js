import { apiIvcRoutes } from "../routes"


export default () => {
    return new Promise(async resolve => {
        let list = new Array() 
        list = await apiIvcRoutes.getPautas()
        resolve(list.data)
    })
}