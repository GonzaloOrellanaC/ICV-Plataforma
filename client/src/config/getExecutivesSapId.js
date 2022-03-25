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
        let ids = new Array();
        ids = []
        admins.forEach((admin, index) => {
            ids.push(admin._id);
            if(index == (admins.length - 1)) {
                sapExecutives.forEach((user, i) => {
                    ids.push(user._id);
                    if(i == (sapExecutives.length - 1)) {
                        if(level == 1) {
                            chiefMachineries.forEach((u, n) => {
                                ids.push(u._id);
                                if(n == (chiefMachineries.length - 1)) {
                                    shiftManagers.forEach((s, x) => {
                                        ids.push(s._id)
                                    });
                                    if(n == (shiftManagers.length - 1)) {
                                        resolve(ids)
                                    }
                                }
                            })
                        }else if(level == 2) {
                            chiefMachineries.forEach((u, n) => {
                                ids.push(u._id);
                                if(n == (chiefMachineries.length - 1)) {
                                    resolve(ids)
                                }
                            })
                        }else if((level == 3) || (level == 4)){
                            resolve(ids)
                        }else{
                            resolve(ids)
                        }
                    }
                })
            }
        })
    })
}