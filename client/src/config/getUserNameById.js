import { usersRoutes } from "../routes"


export default  (_id) => {
    if(_id) {
        return new Promise(async resolve => {
            let user = await usersRoutes.getUser(_id);
            if (user.data) {
                resolve(`${user.data.name} ${user.data.lastName}`)
            } else {
                resolve('Test Name')
            }
        })
    }else{
        return new Promise(resolve => {
            resolve('Sin información')
        })
    }
}