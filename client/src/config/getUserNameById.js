import { usersRoutes } from "../routes"


export default  (_id) => {
    console.log(_id)
    if(_id) {
        return new Promise(async resolve => {
            let user = await usersRoutes.getUser(_id);
            console.log(user)
            resolve(`${user.data.name} ${user.data.lastName}`)
        })
    }else{
        return new Promise(resolve => {
            resolve('Sin información')
        })
    }
}