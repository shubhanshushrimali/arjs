import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.module.js';

let scene, camera, renderer, cube;

init();

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    // Screenshot Button
    const screenshotButton = document.getElementById('screenshot-button');
    screenshotButton.addEventListener('click', takeScreenshot);

    animate();
}

function animate() {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
}

function takeScreenshot() {
    const screenshotDataUrl = renderer.domElement.toDataURL('image/png');
    
    // Create a new tab to display the screenshot
    const screenshotWindow = window.open();
    screenshotWindow.document.write('<img src="' + screenshotDataUrl + '" />');
}