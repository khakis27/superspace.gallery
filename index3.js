import * as THREE from "https://cdn.skypack.dev/three@0.133.1/build/three.module.js";

// Creazione della scena
const scene = new THREE.Scene();

// Creazione della camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const canvasContainer = document.getElementById('canvas-container');

// Creazione del renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
canvasContainer.appendChild(renderer.domElement);

// Creazione della texture di base per i cubi
const defaultTexture = new THREE.TextureLoader().load('texture-cubo3.png'); // Sostituisci con il percorso della tua immagine
defaultTexture.wrapS = THREE.RepeatWrapping;
defaultTexture.wrapT = THREE.RepeatWrapping;

// Creazione dei cubi in una griglia 3x3
const cubes = [];
const cubePositions = [
    {x: 1.5, y: 0.5, z: 1.5},
    {x: 0.5, y: -0.5, z: 0.5},
    {x: 0.5, y: 0.5, z: -0.5},
    {x: 1.5, y: 0.5, z: -1.5},
];

for (let i = 0; i < cubePositions.length; i++) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ map: defaultTexture });
    const cube = new THREE.Mesh(geometry, material);

    cube.position.set(cubePositions[i].x, cubePositions[i].y, cubePositions[i].z);

    cubes.push({ cube, material });
    scene.add(cube);
}

// Creazione di div in overlay con testo
const overlayDivs = [];
const overlayDivPositions = [
    { x: -50, y: 30 },
    { x: 50, y: -30 },
    { x: -30, y: -50 },
];

overlayDivPositions.forEach(({ x, y }) => {
    const overlayDiv = document.createElement('div');
    overlayDiv.className = 'overlay-text';
    overlayDiv.style.transform = `translate(${x}%, ${y}%)`;
    document.body.appendChild(overlayDiv);
    overlayDivs.push(overlayDiv);
});

// Aggiunta dell'evento di movimento del mouse per l'effetto parallasse
window.addEventListener('mousemove', (event) => {
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    overlayDivs.forEach((overlayDiv, index) => {
        const parallaxFactor = index + 1;
        const offsetX = mouseX * parallaxFactor;
        const offsetY = mouseY * parallaxFactor;
        overlayDiv.style.transform = `translate(${offsetX}%, ${offsetY}%)`;
    });
});

function animate() {

    scene.rotation.x += 0.002;
    scene.rotation.y += 0.002;
    
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// Ridimensionamento della finestra
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
