export default (value, machineModel) => {
    if(machineModel === '793-F') {
        if(value === 'Sistema_direccion') {
            return [
                {
                    title: 'Acumuladores',
                    position: '1.3 3.5 3.3',
                    normal: '0 0.05 0.69',
                    orbit: '225deg 45deg 3m',
                    target: '1.3m 2.7m 3.3m'
                },
                {
                    title: 'Sistema Hidraulico Dirección',
                    position: '0 1.93 2.5',
                    normal: '0.73 0.05 0.69',
                    orbit: '45deg 45deg 2.5m',
                    target: '0m 1.7m 2.5m'
                },
                {
                    title: 'Cilindro Hidraulico 1',
                    position: '-0.6 1.7 2.5',
                    normal: '0.73 0.05 0.69',
                    orbit: '45deg 45deg 2m',
                    target: '-0.6m 1.5m 2.5m'
                },
                {
                    title: 'Cilindro Hidraulico 2',
                    position: '0.6 1.7 2.5',
                    normal: '0.73 0.05 0.69',
                    orbit: '45deg 45deg 2m',
                    target: '0.6m 1.5m 2.5m'
                },
                {
                    title: 'Bomba Dirección',
                    position: '-0.5 2.25 1',
                    normal: '0.73 0.05 0.69',
                    orbit: '10deg 80deg 2m',
                    target: '-0.5m 1.9m 1m'
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
        }else if(value === 'Sistema_hidraulico') {
            return [
                {
                    title: 'Filtros de Malla',
                    position: '-0.4 2.7 -0.2',
                    normal: '0 -0.05 -0.69',
                    orbit: '200deg 90deg 1.5m',
                    target: '-0.4m 2.4m -0.2m'
                },
                {
                    title: 'Cilindro de levante 1',
                    position: '1.1 3.5 -0.7',
                    normal: '0 -0.05 -0.69',
                    orbit: '180deg 65deg 3m',
                    target: '1.1m 2.8m -0.7m'
                },
                {
                    title: 'Cilindro de levante 2',
                    position: '-1.1 3.5 -0.7',
                    normal: '0 -0.05 -0.69',
                    orbit: '240deg 65deg 3m',
                    target: '-1.1m 2.8m -0.7m'
                },
                {
                    title: 'Enfriadores de aceite',
                    position: '0.36 3 0.55',
                    normal: '0 0.05 0.5',
                    orbit: '20deg 65deg 3m',
                    target: '0.36m 2m 0.55m'
                },
                {
                    title: 'Bomba de levante',
                    position: '-0.4 2.35 0.55',
                    normal: '0 0.05 0.5',
                    orbit: '20deg 90deg 1.5m',
                    target: '-0.4m 2.1m 0.55m'
                }
            ]
        }else if(value === 'Estructura') {
            return [
                {
                    title: 'Filtro de Aire 4',
                    position: '2.1 3 5.1',
                    normal: '0.73 0.05 0.69',
                    orbit: '45deg 90deg 2m',
                    target: '2.1m 3.3m 5.2m'
                },
                {
                    title: 'Filtro de Aire 3',
                    position: '1.6 3 5.1',
                    normal: '0.73 0.05 0.69',
                    orbit: '45deg 90deg 2m',
                    target: '1.6m 3.3m 5.2m'
                },
                {
                    title: 'Filtro de Aire 2',
                    position: '-1.6 3 5.1',
                    normal: '0.73 0.05 0.69',
                    orbit: '330deg 90deg 2m',
                    target: '-1.6m 3.3m 5.2m'
                },
                {
                    title: 'Filtro de Aire 1',
                    position: '-2.1 3 5.1',
                    normal: '0.73 0.05 0.69',
                    orbit: '330deg 90deg 2m',
                    target: '-2.1m 3.3m 5.2m'
                }
            ]
        }else if(value === 'Chasis') {
            return [
                {
                    title: 'Articulación Eje Trasero',
                    position: '0 0.7 -0.5',
                    normal: '0 -0.05 -0.69',
                    orbit: '250deg 100deg 3m',
                    target: '0m 1m -0.5m'
                },
                {
                    title: 'Eslabones de suspención trasera',
                    position: '0 1.5 -2',
                    normal: '0 -0.05 -0.69',
                    orbit: '225deg 100deg 2m',
                    target: '0m 1.5m -2m'
                },
                {
                    title: 'Cross tube',
                    position: '0 2.1 0',
                    normal: '0 -0.05 -0.69',
                    orbit: '0deg 180deg 3m',
                    target: '0m 2.1m 0m'
                },
                {
                    title: 'Steering box',
                    position: '0 1.8 2.6',
                    normal: '0 0.05 0.69',
                    orbit: '0deg 20deg 1.5m',
                    target: '0m 1.7m 2.6m'
                },
                {
                    title: 'Pad tolva',
                    position: '0.8 2.7 -1.5',
                    normal: '0 -0.05 0.69',
                    orbit: '0deg 20deg 2m',
                    target: '0.8m 2.7m -1.5m'
                }/* ,
                {
                    title: 'Chasis',
                    position: '1 1.93 2.5',
                    normal: '0 0.05 0.69',
                    orbit: '45.94862deg 45.56856deg 0.06545582m',
                    target: '-0.04384604m 0.07348397m -0.1213202m'
                } */
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
                    title: 'Condensador de aire',
                    position: '-0.05 2.4 4.65',
                    normal: '0 0.05 1',
                    orbit: '0deg 90deg 4m',
                    target: '-0.05m 2.35m 4.65m'
                },
                {
                    title: 'Compresor de aire acondocionado',
                    position: '-0.7 2.15 4',
                    normal: '0 0.05 -1',
                    orbit: '-145deg 90deg 0.7m',
                    target: '-0.7m 2.3m 4m',
                },
                {
                    title: 'Compresor de aire',
                    position: '-0.45 2.2 4.2',
                    normal: '0 0.05 -1',
                    orbit: '125deg 75deg 1m',
                    target: '-0.45m 2.35m 4.2m',
                }
            ]
        }else if(value === 'Suspension') {
            return [
                {
                    title: 'Suspensión delantera 1',
                    position: '-1.6 4 2.7',
                    normal: '0 0.05 1',
                    orbit: '0deg 55deg 4m',
                    target: '-1.6m 3m 2.7m'
                },
                {
                    title: 'Suspensión delantera 2',
                    position: '1.6 4 2.7',
                    normal: '0 0.05 1',
                    orbit: '60deg 55deg 4m',
                    target: '1.6m 3m 2.7m'
                },
                {
                    title: 'Suspensión trasera 1',
                    position: '-0.6 3 -3.2',
                    normal: '0 0.05 1',
                    orbit: '0deg 55deg 3m',
                    target: '-0.6m 2m -3.2m'
                },
                {
                    title: 'Suspensión trasera 2',
                    position: '0.6 3 -3.25',
                    normal: '0 0.05 1',
                    orbit: '60deg 55deg 3m',
                    target: '0.6m 2m -3.25m'
                },
            ]
        }else if(value === 'Transmision') {
            return [
                {
                    title: 'Caja de transferencia',
                    position: '0 2.4 -1.2',
                    normal: '0 -0.05 -1',
                    orbit: '300deg 55deg 1.5m',
                    target: '0m 2.2m -1.2m'
                },
                {
                    title: 'Transmisión',
                    position: '0 2.2 -2',
                    normal: '0 -0.05 -1',
                    orbit: '300deg 55deg 3m',
                    target: '0m 1.7m -2m'
                },
                {
                    title: 'Unión deslizante',
                    position: '0 1.67 0',
                    normal: '0 -0.05 -1',
                    orbit: '10deg 55deg 3m',
                    target: '0m 1.8m 0m'
                },
                {
                    title: 'Respiradero convertidor de torque',
                    position: '0.5 3.5 1.4',
                    normal: '0 0.05 1',
                    orbit: '60deg 55deg 1m',
                    target: '0.5m 3.2m 1.4m'
                },
                {
                    title: 'Convertidor de torque',
                    position: '0 1.4 1.4',
                    normal: '0 0.05 1',
                    orbit: '60deg 120deg 3m',
                    target: '0m 2m 1.4m'
                },
                {
                    title: 'P.T.O.',
                    position: '-0.45 2.5 0.85',
                    normal: '0 -0.05 -1',
                    orbit: '240deg 50deg 1m',
                    target: '-0.45m 2.25m 0.85m'
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
                },
                {
                    title: 'Filtro centrífugo',
                    position: '-0.3 3.1 1.5',
                    normal: '-1 0.05 -1',
                    orbit: '180deg 45deg 2m',
                    target: '-0.3m 2.9m 1.5m'
                },
                {
                    title: 'Respiradero Motor 1',
                    position: '0.3 3.1 2',
                    normal: '-1 0.05 -1',
                    orbit: '180deg 90deg 2m',
                    target: '0.3m 2.9m 2m'
                },
                {
                    title: 'Respiradero Motor 2',
                    position: '-0.3 3.1 2',
                    normal: '-1 0.05 -1',
                    orbit: '225deg 90deg 2m',
                    target: '-0.3m 2.9m 2m'
                },
                {
                    title: 'Silenciadores',
                    position: '-2.3 3.5 2',
                    normal: '-1 0.05 -1',
                    orbit: '225deg 90deg 2.5m',
                    target: '-2.3m 4m 2m'
                },
                {
                    title: 'Ductos de escape',
                    position: '-1.2 3.5 2',
                    normal: '-1 0.05 -1',
                    orbit: '180deg 90deg 2.5m',
                    target: '-1.2m 4m 2m'
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
                    title: 'Monitor Vims',
                    position: '1.7 4.5 3.5',
                    normal: '0 0.05 1',
                    orbit: '180deg 55deg 0.7m',
                    target: '1.7m 4.5m 3.5m',
                },
                {
                    title: 'Selector de Marcha',
                    position: '1.8 4.25 3.25',
                    normal: '0 0.05 1',
                    orbit: '180deg 55deg 0.7m',
                    target: '1.8m 4.25m 3.25m',
                },
                {
                    title: 'Control de Levante',
                    position: '1.6 4.25 3.25',
                    normal: '0 0.05 1',
                    orbit: '180deg 55deg 0.7m',
                    target: '1.6m 4.25m 3.25m',
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