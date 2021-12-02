import React from 'react'
import { useStylesTheme } from '../../config'
import { Grid, Button, Box, Item } from '@material-ui/core'

import 'aframe';
import 'aframe-environment-component';
import './model-viewer';
import './hide-on-enter-ar';
import './background-gradient';
import './ar-hit-test';
import './ar-shadows';
import './info-message';
import {Entity, Scene} from 'aframe-react';

const loadSprite = () => {
    let state = true;
    let bee = document.getElementById('beeContent');
    if(bee) {
        if(state) {
            state = false
        }
    }
}

const VRAvatar = ({machine}) => {
    const classes = useStylesTheme();
    
    loadSprite()
    let newMachine;
    console.log(machine);

    if(machine.type === 'Camión') {
        newMachine = '../../../assets/camion/' + machine.brand + '_' + machine.model + '_' + 'Preview.glb'
    }else if(machine.type === 'Pala') {
        newMachine = '../../../assets/pala/' + machine.brand + '_' + machine.model + '_' + 'Preview.gltf'
    }{
        newMachine = "../../../assets/camion/camion.glb"
    }
    console.log(machine.type)
    
    return(
        
        <Box container style={{ padding: 5, height: '100%', width: '100%' }} alignItems='center' justifyContent='center'>
            <Scene
                model-viewer="gltfModel: #tree;"
                embedded
                vr-mode-ui="enabled: false"
                cursor="rayOrigin: mouse"
            >
                <Entity 
                        id="tree"
                        src={machine}
                        response-type="arraybuffer"
                        crossorigin="anonymous"
                        animation="property: rotation;" 
                        
                    >
                </Entity>
                {/* <Entity open-rueda>
                    <p>Hello!!</p>
                </Entity> */}
            </Scene>
            <div style={{
                position: 'absolute', 
                width: 150, 
                height: '100%', 
                padding: 20, 
                top: 0, 
                right: 0,
                paddingTop: 100
            }}>
                <Button id="ruedas-id">
                    <p style={{color: '#fff'}}>Ruedas</p>
                </Button>
                <Button>
                    <p style={{color: '#fff'}}>Motor</p>
                </Button>
                <Button>
                    <p style={{color: '#fff'}}>Cabina</p>
                </Button>
            </div>
        </Box>
    
    )
}

export default VRAvatar