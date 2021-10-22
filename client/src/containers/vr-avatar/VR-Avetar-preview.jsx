import React from 'react'
import { useStylesTheme } from '../../config'
import { Box, Card, Grid } from '@material-ui/core'

import 'aframe';
//import AFRAME from 'aframe';
import 'aframe-environment-component';
//import 'aframe-extras';
//import 'aframe-core';
import './model-viewer-preview';
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

const VRAvatarPreview = ({machine}) => {
    const classes = useStylesTheme();
    
    loadSprite()

    let newMachine;
    console.log(machine);

    if(machine.type === 'Camión') {
        newMachine = '../../../assets/camion/' + machine.brand + '_' + machine.model + '_' + 'Preview.glb'
    }else{
        newMachine = "../../../assets/camion/camion.glb"
    }
    
    return(
        <Grid container style={{ padding: 5, height: '100%' }} alignItems='center' justifyContent='center'>
            <Scene
                model-viewer-preview="gltfModel: #tree;"
                embedded
                vr-mode-ui="enabled: false"
                
            >
                <Entity 
                    id="tree"
                    src={newMachine}
                    response-type="arraybuffer"
                    crossorigin="anonymous"
                    animation="property: rotation;" 
                >
                </Entity>
                
            </Scene>
        </Grid>
    )
}

export default VRAvatarPreview