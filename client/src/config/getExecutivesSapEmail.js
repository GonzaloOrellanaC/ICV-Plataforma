import { usersRoutes } from "../routes"


export default async () => { 
    return new Promise(async resolve => {
        let admin = await usersRoutes.findByRole('admin');
        let data = await usersRoutes.findByRole('sapExecutive');
        let admins = new Array();
        let sapExecutives = new Array();
        admins = admin.data;
        sapExecutives = data.data;
        let emails = new Array();
        emails = []
        admins.forEach((admin, index) => {
            emails.push(admin.email);
            if(index == (admins.length - 1)) {
                sapExecutives.forEach((user, i) => {
                    emails.push(user.email);
                    if(i == (sapExecutives.length - 1)) {
                        resolve(emails.toString())
                    }
                })
            }
        })
    })
}