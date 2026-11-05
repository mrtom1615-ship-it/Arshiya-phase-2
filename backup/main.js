
import * as THREE from 'three';

const scene = new THREE.Scene();
scene.background = new THREE.Color('#fce7f3');

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

document.getElementById('scene').appendChild(renderer.domElement);

const geometry = new THREE.IcosahedronGeometry(1, 1);
const material = new THREE.MeshStandardMaterial({
    color: '#ed9ac5',
    roughness: 0.4
});

const heartWorld = new THREE.Mesh(geometry, material);
scene.add(heartWorld);

scene.add(new THREE.AmbientLight(0xffffff, 2));

const light = new THREE.PointLight(0xffffff, 30);
light.position.set(3, 3, 5);
scene.add(light);

function animate() {
    requestAnimationFrame(animate);

    heartWorld.rotation.x += 0.003;
    heartWorld.rotation.y += 0.006;

    renderer.render(scene, camera);
}

animate();

document.getElementById('enter').addEventListener('click', () => {
    document.getElementById('welcome').style.display = 'none';
    document.getElementById('scene').style.display = 'block';
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
