import { handpose } from '@tensorflow-models/handpose';
import '@tensorflow/tfjs';
import 'https://cdn.jsdelivr.net/npm/aframe@1.2.0/dist/aframe.min.js';

const screenshotButton = document.getElementById('screenshot-button');
let placed = false;
let handModel;

screenshotButton.addEventListener('click', takeScreenshot);

async function initHandGestureRecognition() {
    handModel = await handpose.load();
}

function placeObject() {
    if (!placed) {
        const arScene = document.querySelector('a-scene');
        const arObject = document.createElement('a-entity');
        arObject.setAttribute('gltf-model', 'path-to-your-3d-model.glb');
        arObject.setAttribute('scale', '0.1 0.1 0.1');
        arScene.appendChild(arObject);
        
        placed = true;
    }
}

async function detectHandGesture() {
    const video = document.querySelector('video');
    const predictions = await handModel.estimateHands(video);

    if (predictions.length > 0) {
        placeObject();
    }
}

function takeScreenshot() {
    const arCanvas = document.querySelector('canvas');
    const screenshotDataUrl = arCanvas.toDataURL('image/png');
    
    const a = document.createElement('a');
    a.href = screenshotDataUrl;
    a.download = 'screenshot.png';
    a.click();
}

initHandGestureRecognition();
setInterval(detectHandGesture, 1000);