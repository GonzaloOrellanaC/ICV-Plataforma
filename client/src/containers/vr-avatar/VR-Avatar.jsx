import React from 'react'
import { useStylesTheme } from '../../config'
import { Box, Card, Grid, Button } from '@material-ui/core'

import 'aframe';
//import AFRAME from 'aframe';
import 'aframe-environment-component';
//import 'aframe-extras';
//import 'aframe-core';
import './model-viewer';
import './hide-on-enter-ar';
import './background-gradient';
import './ar-hit-test';
import './ar-shadows';
import './info-message';
/* import 'aframe-particle-system-component';
import 'aframe-mountain-component';
import 'aframe-particle-system-component'; */
//import 'aframe-animation-component';
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
    //console.log(machine);

    if(machine.type === 'Camión') {
        newMachine = '../../../assets/camion/' + machine.brand + '_' + machine.model + '_' + 'Preview.glb'
    }else{
        newMachine = "../../../assets/camion/camion.glb"
    }
    
    return(
        <Grid container style={{ padding: 5, height: '100%' }} alignItems='center' justifyContent='center'>
            <Scene
                model-viewer="gltfModel: #tree;"
                embedded
                vr-mode-ui="enabled: false"
                
            >
                <Entity 
                    id="tree"
                    src={machine}
                    response-type="arraybuffer"
                    crossorigin="anonymous"
                    animation="property: rotation;" 
                >
                </Entity>
                
            </Scene>
            {/* <div style={{position: 'absolute', top: 30, right: 30}}>
                <div style={{width: '100%', textAlign: 'left', fontWeight: 'bold', margin: 20}}>
                    <Button>
                        <p style={{ color: 'white'}}>General</p>
                    </Button>
                </div>
                <div style={{width: '100%', textAlign: 'left', fontWeight: 'bold', margin: 20}}>
                    <Button>
                        <p style={{ color: 'white'}}>Motor</p>
                    </Button>
                </div>
                <div style={{width: '100%', textAlign: 'left', fontWeight: 'bold', margin: 20}}>
                    <Button>
                        <p style={{ color: 'white'}}>Tolva</p>
                    </Button>
                </div>
                <div style={{width: '100%', textAlign: 'left', fontWeight: 'bold', margin: 20}}>
                    <Button>
                        <p style={{ color: 'white'}}>Cabina</p>
                    </Button>
                </div>
            </div> */}
        </Grid>
    )
}

export default VRAvatar