"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
////////////////////////////////////////////////////////////////////////////////
// Clock hand rotation: rotate the hand into the proper orientation
////////////////////////////////////////////////////////////////////////////////
/*global THREE, Coordinates, document, window, dat, $*/

let camera, scene, renderer;
let cameraControls, effectController;
let clock = new THREE.Clock();
let gridX = false;
let gridY = false;
let gridZ = false;
let axes = true;
let ground = true;

function fillScene() {
	scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0x808080, 2000, 4000 );

	// LIGHTS
	let ambientLight = new THREE.AmbientLight( 0x222222 );

	let light = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
	light.position.set( 200, 400, 500 );

	let light2 = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
	light2.position.set( -500, 250, -200 );

	scene.add(ambientLight);
	scene.add(light);
	scene.add(light2);

	let faceMaterial = new THREE.MeshLambertMaterial( { color: 0xFFECA9 } );
	let markMaterial = new THREE.MeshLambertMaterial( { color: 0x89581F } );
	let mark12Material = new THREE.MeshLambertMaterial( { color: 0xE6880E } );
	let handMaterial = new THREE.MeshLambertMaterial( { color: 0x226894 } );

	// clock
	let clock = new THREE.Mesh(
		new THREE.CylinderGeometry( 75, 75, 10, 32 ), faceMaterial );
		//new THREE.CubeGeometry( 150, 5, 150 ), faceMaterial );
	clock.position.y = 5;
	scene.add( clock );

	// marks
	let cube = new THREE.Mesh(
		new THREE.CubeGeometry( 20, 4, 15 ), mark12Material );
	cube.position.x = 60;
	cube.position.y = 9;
	scene.add( cube );

	cube = new THREE.Mesh(
		new THREE.CubeGeometry( 10, 4, 10 ), markMaterial );
	cube.position.x = -60;
	cube.position.y = 9;
	scene.add( cube );

	cube = new THREE.Mesh(
		new THREE.CubeGeometry( 10, 4, 10 ), markMaterial );
	cube.position.z = 60;
	cube.position.y = 9;
	scene.add( cube );

	cube = new THREE.Mesh(
		new THREE.CubeGeometry( 10, 4, 10 ), markMaterial );
	cube.position.z = -60;
	cube.position.y = 9;
	scene.add( cube );

	// CODE FOR THE CLOCK HAND
	cube = new THREE.Mesh(
		new THREE.CubeGeometry( 110, 4, 4 ), handMaterial );
	cube.position.y = 14;

	// YOUR CODE HERE

	scene.add( cube );
}

function drawHelpers() {
	if (ground) {
		Coordinates.drawGround({size:10000});
	}
	if (gridX) {
		Coordinates.drawGrid({size:10000,scale:0.01});
	}
	if (gridY) {
		Coordinates.drawGrid({size:10000,scale:0.01, orientation:"y"});
	}
	if (gridZ) {
		Coordinates.drawGrid({size:10000,scale:0.01, orientation:"z"});
	}
	if (axes) {
		Coordinates.drawAllAxes({axisLength:200,axisRadius:1,axisTess:50});
	}
}


function init() {
	let canvasWidth = 846;
	let canvasHeight = 494;
	// For grading the window is fixed in size; here's general code:
	//let canvasWidth = window.innerWidth;
	//let canvasHeight = window.innerHeight;
	let canvasRatio = canvasWidth / canvasHeight;

	// RENDERER
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setSize(canvasWidth, canvasHeight);
	renderer.setClearColorHex( 0xAAAAAA, 1.0 );

	// CAMERA
	camera = new THREE.PerspectiveCamera( 30, canvasRatio, 1, 10000 );
	camera.position.set( -370, 420, 190 );
	// CONTROLS
	cameraControls = new THREE.OrbitAndPanControls(camera, renderer.domElement);
	cameraControls.target.set(0,0,0);

	fillScene();

}

function addToDOM() {
	let container = document.getElementById('container');
	let canvas = container.getElementsByTagName('canvas');
	if (canvas.length>0) {
		container.removeChild(canvas[0]);
	}
	container.appendChild( renderer.domElement );
}

function animate() {
	window.requestAnimationFrame(animate);
	render();
}

function render() {
	let delta = clock.getDelta();
	cameraControls.update(delta);

	if ( effectController.newGridX !== gridX || effectController.newGridY !== gridY || effectController.newGridZ !== gridZ || effectController.newGround !== ground || effectController.newAxes !== axes)
	{
		gridX = effectController.newGridX;
		gridY = effectController.newGridY;
		gridZ = effectController.newGridZ;
		ground = effectController.newGround;
		axes = effectController.newAxes;

		fillScene();
		drawHelpers();
	}
	renderer.render(scene, camera);
}

function setupGui() {

	effectController = {

		newGridX: gridX,
		newGridY: gridY,
		newGridZ: gridZ,
		newGround: ground,
		newAxes: axes
	};

	let gui = new dat.GUI();
	gui.add( effectController, "newGridX").name("Show XZ grid");
	gui.add( effectController, "newGridY" ).name("Show YZ grid");
	gui.add( effectController, "newGridZ" ).name("Show XY grid");
	gui.add( effectController, "newGround" ).name("Show ground");
	gui.add( effectController, "newAxes" ).name("Show axes");
}


try {
	init();
	setupGui();
	drawHelpers();
	addToDOM();
	animate();
} catch(e) {
	let errorReport = "Your program encountered an unrecoverable error, can not draw on canvas. Error was:<br/><br/>";
	$('#container').append(errorReport+e);
}

