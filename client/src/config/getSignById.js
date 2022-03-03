import { usersRoutes } from "../routes"


export default  (_id) => {
    if(_id) {
        return new Promise(async resolve => {
            let sign = await usersRoutes.getUserSign(_id);
            resolve(sign.data)
        })
    }else{
        return new Promise(resolve => {
            resolve('Sin información')
        })
    }
}