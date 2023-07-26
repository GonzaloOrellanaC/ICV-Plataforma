import { Router } from 'express';
import { Users } from '../models';
const router = new Router()

router.post('/createNewsText', async (req, res) => {
    const {news: {titulo, comentairo, roles, obras}} = req.body
    if (roles.length > 0) {
        console.log(roles)
        const findUsers = await Users.find({roles: { $in: roles }, obras: { $in: obras}})
        console.log(findUsers.length)
        console.log(removeUsersDuplicated(findUsers).length)
    }
})

const removeUsersDuplicated = (users) => {
    return users.filter((user, index) => users.indexOf(user) === index)
}

export default router