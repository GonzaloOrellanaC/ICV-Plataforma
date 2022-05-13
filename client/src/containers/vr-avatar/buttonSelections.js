export default (value, machineModel) => {
    if(machineModel === '793-F') {
        if(value === 'Sistema_direccion') {
            return [
                /* {
                    title: 'Varillaje dirección',
                    position: '-0.54 0.93 0.1',
                    normal: '-0.73 0.05 0.69',
                    orbit: '45.94862deg 45.56856deg 0.06545582m',
                    target: '-0.04384604m 0.07348397m -0.1213202m'
                }, */
                {
                    title: 'Sistema Hidraulico Dirección',
                    position: '0 1.93 2.5',
                    normal: '0m 0m 0m',
                    orbit: '45.94862deg 45.56856deg 0.06545582m',
                    target: '-0.04384604m 0.07348397m -0.1213202m'
                }
            ]
        }else if(value === 'Neumaticos') {
            return [
                {
                    title: 'Neumático',
                    position: '2.6 2.5 2.5',
                    normal: '0.73 0.05 0.69',
                    orbit: '125deg 90deg 6m',
                    target: '2.3m 1.45m 2.8m'
                },
                {
                    title: 'Aro',
                    position: '2.6 1.93 2.5',
                    normal: '0.73 0.05 0.69',
                    orbit: '125deg 90deg 3m',
                    target: '2.3m 1.45m 2.6m'
                }
            ]
        }else if(value === 'Chasis') {
            return [
                {
                    title: 'Articulación Eje Trasero',
                    position: '0 0.5 -0.5',
                    normal: '0 -0.05 -0.69',
                    orbit: '45.94862deg 45.56856deg 0.06545582m',
                    target: '-0.04384604m 0.07348397m -0.1213202m'
                },
                {
                    title: 'Chasis',
                    position: '1 1.93 2.5',
                    normal: '0 0.05 0.69',
                    orbit: '45.94862deg 45.56856deg 0.06545582m',
                    target: '-0.04384604m 0.07348397m -0.1213202m'
                }
            ]
        }else if(value === 'Maza') {
            return [
                {
                    title: 'Maza derecha',
                    position: '-1 1.93 2.5',
                    normal: '0 0.05 -1',
                    orbit: '-125deg 90deg 4m',
                    target: '-2.3m 1.45m 2.6m'
                },
                {
                    title: 'Maza izquierda',
                    position: '1 1.93 2.5',
                    normal: '0 0.05 1',
                    orbit: '125deg 90deg 4m',
                    target: '2.3m 1.45m 2.6m'
                }
            ]
        }else if(value === 'Sistema_neumatico') {
            return [
                {
                    title: 'Secador de aire',
                    position: '-0.05 2.35 4.65',
                    normal: '0 0.05 1',
                    orbit: '0deg 90deg 4m',
                    target: '-0.05m 2.35m 4.65m'
                },
                {
                    title: 'Tanque de aire',
                    position: '-0.7 2.45 4',
                    normal: '0 0.05 -1',
                    orbit: '-145deg 90deg 1m',
                    target: '-0.7m 2.3m 4m',
                },
                {
                    title: 'Compresor de aire',
                    position: '-0.35 2.5 4',
                    normal: '0 0.05 -1',
                    orbit: '125deg 90deg 1m',
                    target: '-0.45m 2.5m 4.2m',
                }
            ]
        }else if(value === 'Motor') {
            return [
                {
                    title: 'Motor',
                    position: '1 2.5 2',
                    normal: '0 -0.05 2',
                    orbit: '90deg 90deg 5m',
                    target: '1 2.5 2'
                },
                {
                    title: 'Radiador',
                    position: '0 4.5 4.7',
                    normal: '0 0.05 1',
                    orbit: '45deg 90deg 7m',
                    target: '0m 3m 4.5m',
                },
                {
                    title: 'Tanque de Combustible',
                    position: '2.3 3.5 0.5',
                    normal: '-1 0.05 -1',
                    orbit: '125deg 90deg 5m',
                    target: '2.3m 2.5m 0.5m'
                }
            ]
        }else if(value === 'Cabina') {
            return [
                {
                    title: 'Cinturón de seguridad',
                    position: '2.45 4.5 2.7',
                    normal: '0 -0.05 2',
                    orbit: '-45deg 90deg 0.7m',
                    target: '2.45m 4.5m 2.7m'
                },
                {
                    title: 'Plumilla 1',
                    position: '2.45 5 4',
                    normal: '0 0.05 1',
                    orbit: '45deg 90deg 1m',
                    target: '2.45m 4.7m 4m',
                },
                {
                    title: 'Plumilla 2',
                    position: '1.1 5 4',
                    normal: '0 0.05 1',
                    orbit: '-45deg 90deg 1m',
                    target: '1.1m 4.7m 4m',
                },
                {
                    title: 'Manubrio',
                    position: '2.2 4.5 3.5',
                    normal: '0 0.05 1',
                    orbit: '180deg 55deg 0.7m',
                    target: '2.2m 4.5m 3.5m',
                },
                {
                    title: 'Asiento chofer',
                    position: '2.2 4.45 3',
                    normal: '0 0.05 1',
                    orbit: '0deg 55deg 0.7m',
                    target: '2.2m 4.45m 3m',
                },
                {
                    title: 'Asiento copiloto',
                    position: '1.3 4.45 3',
                    normal: '0 0.05 1',
                    orbit: '0deg 55deg 0.7m',
                    target: '1.3m 4.45m 3m',
                }
            ]
        }else{
            return []
        }
    }else{
        return []
    }
}