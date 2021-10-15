import React from 'react'
import { useStylesTheme } from '../../config'
//import { Box, Card, Grid } from '@material-ui/core'

import 'aframe';
//import AFRAME from 'aframe';
import 'aframe-environment-component';
//import 'aframe-extras';
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
import {Scene} from 'aframe-react';



const loadSprite = () => {
    let state = true;
    let bee = document.getElementById('beeContent');
    if(bee) {
        if(state) {
            state = false
            
        }
    }
}

const Vista3D = () => {
    const classes = useStylesTheme();
    
    loadSprite()
    
    return(
        <Scene
            model-viewer="gltfModel: #tree;"
        >
            <a-assets>
                <a-asset-item 
                    id="tree"
                    src="./assets/camion/camion.glb"
                    response-type="arraybuffer"
                    crossorigin="anonymous"
                ></a-asset-item>
            </a-assets>
        </Scene>
    )
}

export default Vista3D