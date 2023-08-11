const placeButton = document.getElementById('place-button');
const screenshotButton = document.getElementById('screenshot-button');
let scene, camera, renderer, cube;

placeButton.addEventListener('click', startAR);

async function startAR() {
    placeButton.style.display = 'none'; // Hide the "Place 3D Model" button
    screenshotButton.style.display = 'block'; // Show the "Take Screenshot" button

    const session = await navigator.xr.requestSession('immersive-ar');
    const referenceSpace = await session.requestReferenceSpace('local-floor');

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

    session.addEventListener('end', endAR);
    session.updateRenderState({ baseLayer: new XRWebGLLayer(session, renderer) });
    session.requestAnimationFrame(onARFrame);

    async function onARFrame(time, frame) {
        const pose = frame.getViewerPose(referenceSpace);

        if (pose) {
            const view = pose.views[0];
            const viewport = session.renderState.baseLayer.getViewport(view);
            camera.matrix.fromArray(view.transform.matrix);
            camera.projectionMatrix.fromArray(view.projectionMatrix);
            camera.updateMatrixWorld(true);

            cube.position.set(0, 0, -1).applyMatrix4(camera.matrixWorld);
            cube.rotation.setFromRotationMatrix(camera.matrixWorld);
        }

        renderer.setSize(viewport.width, viewport.height);
        renderer.setViewport(viewport.x, viewport.y, viewport.width, viewport.height);

        renderer.render(scene, camera);
        session.requestAnimationFrame(onARFrame);
    }

    screenshotButton.addEventListener('click', takeScreenshot);

    function takeScreenshot() {
        const screenshotDataUrl = renderer.domElement.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = screenshotDataUrl;
        a.download = 'screenshot.png';
        a.click();
    }

    function endAR() {
        session.removeEventListener('end', endAR);
        renderer.dispose();
        placeButton.style.display = 'block';
        screenshotButton.style.display = 'none';
    }
}
}
