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

// Numero di cubi
const numberOfCubes = 20;

// Creazione dei cubi posizionati casualmente nello spazio
const cubes = [];
for (let i = 0; i < numberOfCubes; i++) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ map: defaultTexture });
    const cube = new THREE.Mesh(geometry, material);

    // Posizioni casuali
    cube.position.set(
        Math.random() * 10 - 5, // Posizione x tra -5 e 5
        Math.random() * 10 - 5, // Posizione y tra -5 e 5
        Math.random() * 10 - 5  // Posizione z tra -5 e 5
    );

    cubes.push({ cube, material });
    scene.add(cube);
}

// ... il resto del tuo codice rimane invariato

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