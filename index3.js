import * as THREE from "https://cdn.skypack.dev/three@0.133.1/build/three.module.js";
// Creazione della scena
const scene = new THREE.Scene();

// Creazione della camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-2, 0, 5);

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
    {x: 1.5, y: 0.5, z: 1.5},
    {x: 0.5, y: -0.5, z: 0.5},
    {x: 0.5, y: 0.5, z: -0.5},
    {x: 1.5, y: 0.5, z: -1.5},
];

const cubeInfo = [
    { imageSrc: '/assets/LinkedCubes/gif1.gif', caption: 'MACHINE & DESIGN AI' },
    { imageSrc: '/assets/LinkedCubes/gif2.gif', caption: 'IL SALOTTO DI MILANO' },
    { imageSrc: '/assets/LinkedCubes/gif3.gif', caption: 'CITY SPEAK' },
    { imageSrc: '/assets/LinkedCubes/gif4.gif', caption: 'THE CROSSROADS MARKET' },
];

const hoverImageSources = [
    '/assets/LinkedCubes/img1.png',
    '/assets/LinkedCubes/img2.png',
    '/assets/LinkedCubes/img3.png',
    '/assets/LinkedCubes/img4.png',
];

// Url
const cubeUrls = [
    'design&ai.html',
    'IlSalottoDiMilano.html',
    'cityspeak.html',
    'thecrossroadsmarket.html',
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
    window.location.href = newPageUrl;
  }

// Gestione dell'evento di clic sulla finestra
function onDocumentClick(event) {
 // Verifica se il clic è avvenuto all'interno del renderer
 const rect = renderer.domElement.getBoundingClientRect();
 const withinRenderer =
     event.clientX >= rect.left &&
     event.clientX <= rect.right &&
     event.clientY >= rect.top &&
     event.clientY <= rect.bottom;

 // Esegui l'azione desiderata solo se il clic è avvenuto all'interno del renderer
 if (withinRenderer) {
     // Trova gli oggetti intersecati
     const intersects = raycaster.intersectObjects(cubes.map(({ cube }) => cube));

     if (intersects.length > 0) {
         const cubeIndex = intersects[0].object.userData.index;
         const newPageUrl = cubeUrls[cubeIndex];
         window.location.href = newPageUrl;
     }
 }
}

// Aggiunta dell'evento di movimento del mouse
window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    onMouseMove(event);
});

// Avvia l'animazione
animate();

function animate() {

    scene.rotation.x += 0.002;
    scene.rotation.y += 0.002;
    scene.rotation.z += 0.002;

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// Ridimensionamento della finestra
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});