import { apiIvcRoutes } from "../routes";

export default (machines = new Array()) => {
    let pautas = []
    return new Promise(resolve => {
        machines.forEach(async (machine, index) => {
            let res = await reportsRoutes.getReportByIdpm(machine.idpmmantencion);
            res.data[0].typepm = encodeURIComponent(res.data[0].typepm);
            let header = await apiIvcRoutes.getHeaderPauta(res.data[0]);
            let struct = await apiIvcRoutes.getStructsPauta(res.data[0]);
            let newPauta = res.data[0];
            newPauta.header = header;
            newPauta.struct = struct;
            newPauta.action = 'Mantención';
            pautas.push(newPauta);
            if(index == (machines.length -1)) {
                resolve(pautas)
            }
        })
    })
}