"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
////////////////////////////////////////////////////////////////////////////////
// Add a reflection map
////////////////////////////////////////////////////////////////////////////////
/*global THREE, requestAnimationFrame, $ */

let txrpath = "";	// STUDENT: set to "" to run on your computer, "/" for submitting code to Udacity

let camera, scene, renderer;
let cameraControls;
let clock = new THREE.Clock();
let teapotSize = 400;

function fillScene() {
	scene = new THREE.Scene();

	// LIGHTS
	scene.add( new THREE.AmbientLight( 0x333333 ) );

	let light = new THREE.DirectionalLight( 0xFFFFFF, 0.9 );
	light.position.set( -1300, 700, 1240 );

	scene.add( light );

	light = new THREE.DirectionalLight( 0xFFFFFF, 0.7 );
	light.position.set( 1000, -500, -1200 );

	scene.add( light );

	// MATERIALS
	let path = txrpath + "media/img/cs291/textures/skybox/";
	let urls = [path + "px.jpg", path + "nx.jpg",
				path + "py.jpg", path + "ny.jpg",
				path + "pz.jpg", path + "nz.jpg" ];

	let textureCube = THREE.ImageUtils.loadTextureCube( urls );
	textureCube.format = THREE.RGBFormat;

	let teapotMaterial = new THREE.MeshPhongMaterial(
		{ color: 0x770000, specular:0xffaaaa } );

	let teapot = new THREE.Mesh(
		new THREE.TeapotGeometry( teapotSize,
			8, true, true, true, true, true ),
		teapotMaterial );

	scene.add( teapot );


	let shader = THREE.ShaderLib.cube;
	shader.uniforms.tCube.value = textureCube;

	let skyMaterial = new THREE.ShaderMaterial( {
		fragmentShader: shader.fragmentShader,
		vertexShader: shader.vertexShader,
		uniforms: shader.uniforms,
		depthWrite: false,
		side: THREE.BackSide
	} );

	let sky = new THREE.Mesh( new THREE.CubeGeometry( 5000, 5000, 5000 ), skyMaterial );
	scene.add( sky );
}

function init() {
	document.body.style.margin = "0";
	document.body.style.padding = "0";
	document.body.style.overflow = "hidden";

	let canvasWidth = document.documentElement.clientWidth;
	let canvasHeight = document.documentElement.clientHeight;

	// CAMERA
	camera = new THREE.PerspectiveCamera( 45, canvasWidth/ canvasHeight, 100, 20000 );
	camera.position.set( -222, 494, 1746 );

	// RENDERER
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( canvasWidth, canvasHeight );
	renderer.setClearColorHex( 0xAAAAAA, 1.0 );
	renderer.gammaInput = true;
	renderer.gammaOutput = true;

	// CONTROLS

	cameraControls = new THREE.OrbitAndPanControls( camera, renderer.domElement );
	cameraControls.target.set(0, -160, 0);

}

// EVENT HANDLERS

function addToDOM() {
	let container = document.getElementById('container');
	let canvas = container.getElementsByTagName('canvas');
	if (canvas.length>0) {
		container.removeChild(canvas[0]);
	}
	container.appendChild( renderer.domElement );
}

function animate() {
	requestAnimationFrame( animate );
	render();
}

function render() {
	let delta = clock.getDelta();
	cameraControls.update( delta );

	renderer.render( scene, camera );
}

try {
	init();
	fillScene();
	addToDOM();
	animate();
} catch(e) {
	let errorReport = "Your program encountered an unrecoverable error, can not draw on canvas. Error was:<br/><br/>";
	$('#container').append(errorReport+e);
}
