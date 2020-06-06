import * as THREE from "three";

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let geo = new THREE.PlaneGeometry(1, 1);
let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
let cube = new THREE.Mesh(geo, material);
cube.position.setX(-20);
console.log(cube.position.x);
scene.add(cube);

camera.position.z = 30;
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
