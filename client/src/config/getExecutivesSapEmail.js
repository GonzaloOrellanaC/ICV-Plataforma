import { usersRoutes } from "../routes"


export default async (level) => { 
    return new Promise(async resolve => {
        let admin = await usersRoutes.findByRole('admin');
        let data = await usersRoutes.findByRole('sapExecutive');
        let data1 = await usersRoutes.findByRole('shiftManager');
        let data2 = await usersRoutes.findByRole('chiefMachinery');
        let admins = new Array();
        let sapExecutives = new Array();
        admins = admin.data;
        sapExecutives = data.data;
        let chiefMachineries = data1.data;
        let shiftManagers = data2.data;
        let emails = new Array();
        emails = []
        admins.forEach((admin, index) => {
            emails.push(admin.email);
            if(index == (admins.length - 1)) {
                sapExecutives.forEach((user, i) => {
                    emails.push(user.email);
                    if(i == (sapExecutives.length - 1)) {
                        if(level == 1) {
                            chiefMachineries.forEach((u, n) => {
                                emails.push(u.email);
                                if(n == (chiefMachineries.length - 1)) {
                                    shiftManagers.forEach((s, x) => {
                                        emails.push(s.email)
                                    });
                                    if(n == (shiftManagers.length - 1)) {
                                        resolve(emails.toString())
                                    }
                                }
                            })
                        }else if(level == 2) {
                            chiefMachineries.forEach((u, n) => {
                                emails.push(u.email);
                                if(n == (chiefMachineries.length - 1)) {
                                    resolve(emails.toString())
                                }
                            })
                        }else if((level == 3) || (level == 4)){
                            resolve(emails.toString())
                        }
                    }
                })
            }
        })
    })
}