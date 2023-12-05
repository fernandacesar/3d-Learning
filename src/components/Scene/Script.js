import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"; 
//Global variables
let currentRef = null;

//Scene, camera, renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(25, 100 / 100, 0.1, 100);
scene.add(camera);
camera.position.set(5, 5, 5);
camera.lookAt(new THREE.Vector3());

const renderer = new THREE.WebGLRenderer();
renderer.setSize(100, 100);

//OrbitControls
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;

//Resize canvas
const resize = () => {
  renderer.setSize(currentRef.clientWidth, currentRef.clientHeight);
  camera.aspect = currentRef.clientWidth / currentRef.clientHeight;
  camera.updateProjectionMatrix();
};
window.addEventListener("resize", resize);

//Animate the scene
const animate = () => {
  orbitControls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};
animate();


//LOAD 3D
const loadingManager = new THREE.LoadingManager(
  () => {
    console.log("Tudo carregado")
  },
  (
    itemUrl, 
    itensToLoad, 
    itensLoaded
  ) => {
    console.log((itensToLoad/itensLoaded)*100)
  }, 
  ( ) => {}  
)

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('./draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)
gltfLoader.load('./draco/helmet.gltf',
   
  (gltf) => {
    while (gltf.scene.children.length){
      console.log(gltf.scene.children[0]) 
      scene.add(gltf.scene.children[0])
    }},
    () => {
      console.log("Progress")
    },
    () => {
      console.log("Error")
    }
  )

//lights
const light1 = new THREE.DirectionalLight(0xffffff, 1)
light1.position.set(6,6,6);
scene.add(light1)

const al = new THREE.AmbientLight(0xffffff, 1)
scene.add(al); 
//Init and mount the scene
export const initScene = (mountRef) => {
  currentRef = mountRef.current;
  resize();
  currentRef.appendChild(renderer.domElement);
};

//Dismount and clena up the buffer from the scene
export const cleanUpScene = () => {
  scene.dispose();
  currentRef.removeChild(renderer.domElement);
};
