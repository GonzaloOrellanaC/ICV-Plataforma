import { ApiIcv } from '../api-icv';
import { Machine } from '../models';
import { machinesOfProject } from '../files';
import { MachinesController } from '../controller';

export default async () => {

    const sitesCreated = await ApiIcv.createSiteToSend();
    console.log('Sitios creados: ', sitesCreated)
    if(sitesCreated) {
        
        /* Leer obras (sitios) */
        const sites = await ApiIcv.readSitesInServer();
        console.log('Sitios: ', sites);
        sites.forEach((site, index) => {
            
            /* Leer todas las máquinas */
            ApiIcv.createMachinesToSend(site.idobra);

            if(index == (sites.lenght - 1)) {

                /* Se crean las guías, las que deberán ser guardadas como archivos JSON por falta de tiempo. */
                /* machinesOfProject.forEach(async(e, i) => {
                    const guidesCreated = await ApiIcv.getAllGuidesHeaderAndStruct(e.pIDPM);
                    if(guidesCreated) {
                        console.log('Pautas de trabajo ICV creadas');
                    }
                }) */
            }
        })

        
    }
    
}