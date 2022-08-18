import { usersRoutes } from "../routes"


export default  (_id) => {
    if(_id) {
        return new Promise(async resolve => {
            let sign = await usersRoutes.getUserSign(_id)
            if (sign) {
                resolve(sign.data)
            } else {
                resolve('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAIAAAAmKNuZAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAADBSURBVEhL7dKxDcMgEIVhl4zBOC4pPQYbuGQMxmA0SvJkHxHChzmII6XIX1kgfzqwl/Rof26+L3MhBK31coQH7z1tyKq5t3WmlKINWTXnnCOpSD4mc3esiDElIv8pYox4n6Sc5OA8h9gZ932n7UZN7sxaS1LuXuxwOPW6riTlbsQOh9h7bIl9DsnvUcQhoSjlECtikbaPBjh0FaufcYxDV7EccJhDlVgOOMOhSqTVaQ7hf9y2DZYxhpY+4dh+mUvpBZXHrV++CN4SAAAAAElFTkSuQmCC')
            }
        })
    }else{
        return new Promise(resolve => {
            resolve('Sin información')
        })
    }
}