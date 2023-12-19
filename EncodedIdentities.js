import * as THREE from "https://cdn.skypack.dev/three@0.133.1/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.133.1/examples/jsm/controls/OrbitControls.js";

// Creazione della scena
const scene = new THREE.Scene();

// Creazione della camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Creazione del renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Creazione del div per l'immagine e la didascalia
const infoDiv = document.createElement('div');
infoDiv.id = 'infoDiv';

// Immagine
const imageElement = document.createElement('img');
imageElement.id = 'infoImage';
infoDiv.appendChild(imageElement);

// Didascalia
const captionElement = document.createElement('p');
captionElement.id = 'infoCaption';
infoDiv.appendChild(captionElement);
document.body.appendChild(infoDiv);

scene.background = new THREE.Color(0x000000); // Colore nero

// Texture base cubi
const defaultTexture = new THREE.TextureLoader().load('texture-cubo3.png'); // Sostituisci con il percorso della tua immagine
defaultTexture.wrapS = THREE.RepeatWrapping;
defaultTexture.wrapT = THREE.RepeatWrapping;


// Creazione dei cubi in una griglia 3x3
const cubes = [];
const cubePositions = [
    {x: 0.5, y: 0.5, z: 0.5},
    {x: 0.5, y: -1.5, z: 0.5},
    {x: 0.5, y: 1.5, z: -0.5},
    {x: 1.5, y: 0.5, z: -0.5},
    {x: 0.5, y: 0.5, z: 1.5},
    {x: 0.5, y: -0.5, z: 1.5},
    {x: 0.5, y: -0.5, z: -1.5},
    {x: -0.5, y: 0.5, z: -1.5},
];

const cubeInfo = [
    { imageSrc: '/assets/EncodedIdentities/gif1.gif', caption: 'DR. HEATHER DEWEY-HAGBORGs' },
    { imageSrc: '/assets/EncodedIdentities/gif2.gif', caption: 'MIMI ONUHA' },
    { imageSrc: '/assets/EncodedIdentities/gif3.gif', caption: 'JAKE ELVES' },
    { imageSrc: '/assets/EncodedIdentities/gif4.gif', caption: 'CROSSLUCID' },
    { imageSrc: '/assets/EncodedIdentities/gif5.gif', caption: 'MELTEM SAHIM' },
    { imageSrc: '/assets/EncodedIdentities/gif6.gif', caption: 'descrizione 6' },
    { imageSrc: '/assets/EncodedIdentities/gif7.gif', caption: 'descrizione 7' },
    { imageSrc: '/assets/EncodedIdentities/gif8.gif', caption: 'descrizione 8' },
];

const hoverImageSources = [
    '/assets/EncodedIdentities/img1.png',
    '/assets/EncodedIdentities/img2.png',
    '/assets/EncodedIdentities/img3.png',
    '/assets/EncodedIdentities/img4.png',
    '/assets/EncodedIdentities/img8.png',
    '/assets/EncodedIdentities/img6.png',
    '/assets/EncodedIdentities/img7.png',
    '/assets/EncodedIdentities/img8.png'
];

// Url
const cubeUrls = [
    'https://www.example1.com',
    'https://www.example2.com',
    'https://www.example3.com',
    'https://www.example4.com',
    'https://www.example5.com',
    'https://www.example6.com',
    'https://www.example7.com',
    'https://www.example8.com',

  ];

for (let i = 0; i < cubePositions.length; i++) {
    const hoverImage = new Image();
    hoverImage.src = hoverImageSources[i % hoverImageSources.length];

    const hoverTexture = new THREE.Texture(hoverImage);
    hoverTexture.needsUpdate = true;

    const defaultMaterial = new THREE.MeshBasicMaterial({ map: defaultTexture });
    const hoverMaterial = new THREE.MeshBasicMaterial({ map: hoverTexture });

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const cube = new THREE.Mesh(geometry, defaultMaterial);

    cube.userData.index = i;

    cube.position.set(cubePositions[i].x, cubePositions[i].y, cubePositions[i].z);

    cube.onmouseover = function () {
        this.material = hoverMaterial;
    };

    cube.onmouseout = function () {
        this.material = defaultMaterial;
    };

    cubes.push({ cube, defaultMaterial, hoverMaterial });
    scene.add(cube);
}

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 4;
controls.maxDistance = 20;

// Raycaster per interazione del mouse
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Funzione per mostrare il div con l'immagine e la didascalia
function showInfoDiv(imageSrc, caption) {
    imageElement.src = imageSrc;
    captionElement.textContent = caption;
    infoDiv.style.display = 'block';
}

// Funzione per nascondere il div
function hideInfoDiv() {
    infoDiv.style.display = 'none';
}

// Gestione dell'evento del mouse
function onMouseMove(event) {
    // Normalizza le coordinate del mouse
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Aggiorna il raycaster
    raycaster.setFromCamera(mouse, camera);

    // Trova gli oggetti intersecati
    const intersects = raycaster.intersectObjects(cubes.map(({ cube }) => cube));

    // Flag per verificare se il mouse è sopra un cubo
    let isMouseOverCube = false;

    cubes.forEach(({ cube, hoverMaterial, defaultMaterial }) => {
        if (intersects.length > 0 && intersects[0].object === cube) {
            cube.material = hoverMaterial;
            isMouseOverCube = true;

            const cubeIndex = intersects[0].object.userData.index;
            const currentCubeInfo = cubeInfo[cubeIndex % cubeInfo.length];
            showInfoDiv(currentCubeInfo.imageSrc, currentCubeInfo.caption);
        } else {
            cube.material = defaultMaterial;
        }
    });

    // Nascondi il div se il mouse non è sopra un cubo
    if (!isMouseOverCube) {
        hideInfoDiv();
    }
}

window.addEventListener('click', onDocumentClick);

// Durata minima (in millisecondi) per considerare un clic come prolungato
const longClickDuration = 100;

let isMousePressedInsideRenderer = false;
let clickStartTime;

// Funzione per gestire il click breve sul cubo
function handleShortClick(cubeIndex) {
    const newPageUrl = cubeUrls[cubeIndex];
    window.open(newPageUrl, '_blank');
  }

// Gestione dell'evento di clic sulla finestra
function onDocumentClick(event) {
    const clickDuration = Date.now() - clickStartTime;

    // Verifica se il clic è avvenuto all'interno del renderer
    const rect = renderer.domElement.getBoundingClientRect();
    const withinRenderer =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

    // Esegui l'azione desiderata solo se il clic è avvenuto all'interno del renderer
    if (withinRenderer) {
        // Se il clic è breve, gestisci il clic breve sul cubo
        if (clickDuration < longClickDuration) {
            const intersects = raycaster.intersectObjects(cubes.map(({ cube }) => cube));
      
            if (intersects.length > 0) {
              const cubeIndex = intersects[0].object.userData.index;
              handleShortClick(cubeIndex);
            }
        }
    }
}

// Aggiunta dell'evento di movimento del mouse
window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    onMouseMove(event);
});

// Aggiunta dell'evento di pressione del mouse
window.addEventListener('mousedown', (event) => {
    isMousePressedInsideRenderer = true;
    clickStartTime = Date.now();

    // Imposta un timer per gestire il clic prolungato
    setTimeout(() => {
        if (isMousePressedInsideRenderer) {
            // Se il mouse è ancora premuto, gestisci il clic prolungato
            const mouse = new THREE.Vector2();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            // Aggiorna il raycaster
            raycaster.setFromCamera(mouse, camera);

            // Trova gli oggetti intersecati
            const intersects = raycaster.intersectObjects(cubes.map(({ cube }) => cube));

            if (intersects.length > 0) {
                controls.enabled = true;
            }
        }
    }, longClickDuration);
});

// Aggiunta dell'evento di rilascio del mouse
window.addEventListener('mouseup', () => {
    isMousePressedInsideRenderer = false;

    // Reimposta le Orbit Controls solo se il clic breve non è stato gestito
    if (Date.now() - clickStartTime >= longClickDuration) {
        controls.enabled = true;
    }
});

// Avvia l'animazione
animate();

function animate() {

    scene.rotation.x += 0.002;
    scene.rotation.y += 0.002;

    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// Ridimensionamento della finestra
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});





