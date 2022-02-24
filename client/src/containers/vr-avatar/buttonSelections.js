export default (value) => {
    console.log(value)
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
                orbit: '45.94862deg 45.56856deg 0.06545582m',
                target: '-0.04384604m 0.07348397m -0.1213202m'
            },
            {
                title: 'Aro',
                position: '2.6 1.93 2.5',
                normal: '0.5 0.05 0.69',
                orbit: '45.94862deg 45.56856deg 0.06545582m',
                target: '-0.04384604m 0.07348397m -0.1213202m'
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
                orbit: '45.94862deg 45.56856deg 0.06545582m',
                target: '-0.04384604m 0.07348397m -0.1213202m'
            },
            {
                title: 'Maza izquierda',
                position: '1 1.93 2.5',
                normal: '0 0.05 1',
                orbit: '45.94862deg 45.56856deg 0.06545582m',
                target: '-0.04384604m 0.07348397m -0.1213202m'
            }
        ]
    }else if(value === 'Sistema_neumatico') {
        return [
            {
                title: 'Compresor de aire',
                position: '-0.35 2.5 4',
                normal: '0 0.05 -1',
                orbit: '45.94862deg 45.56856deg 0.06545582m',
                target: '-0.04384604m 0.07348397m -0.1213202m'
            },
            {
                title: 'Secador de aire',
                position: '-0.05 2.35 4.65',
                normal: '0 0.05 1',
                orbit: '45.94862deg 45.56856deg 0.06545582m',
                target: '-0.04384604m 0.07348397m -0.1213202m'
            },
            {
                title: 'Tanque de aire',
                position: '-0.7 2.45 4',
                normal: '0 0.05 -1',
                orbit: '45.94862deg 45.56856deg 0.06545582m',
                target: '-0.04384604m 0.07348397m -0.1213202m'
            }
        ]
    }else{
        return []
    }
}