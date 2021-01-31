"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
////////////////////////////////////////////////////////////////////////////////
// Make a textured square
////////////////////////////////////////////////////////////////////////////////
/*global THREE, Coordinates, $, document, window*/

let path = "";	// STUDENT: set to "" to run on your computer, "/" for submitting code to Udacity

let camera, scene, renderer;
let cameraControls;
let clock = new THREE.Clock();

function fillScene() {
	scene = new THREE.Scene();

	let myPolygon = new SquareGeometry();
	let myTexture = THREE.ImageUtils.loadTexture( path + 'media/img/cs291/textures/ash_uvgrid01.jpg' );
	let myPolygonMaterial = new THREE.MeshBasicMaterial( { map: myTexture } );
	let polygonObject = new THREE.Mesh( myPolygon, myPolygonMaterial );
	scene.add(polygonObject);
}

function SquareGeometry() {
	let geo = new THREE.Geometry();

	// student should add code within this method

	// generate vertices
	geo.vertices.push( new THREE.Vector3( 0.0, 0.0, 0.0 ) );
	geo.vertices.push( new THREE.Vector3( 1.0, 0.0, 0.0 ) );
	geo.vertices.push( new THREE.Vector3( 1.0, 1.0, 0.0 ) );
	let uvs = [];
	uvs.push( new THREE.Vector2( 0.0, 0.0 ) );
	uvs.push( new THREE.Vector2( 1.0, 0.0 ) );
	uvs.push( new THREE.Vector2( 1.0, 1.0 ) );
	// generate faces
	geo.faces.push( new THREE.Face3( 0, 1, 2 ) );
	geo.faceVertexUvs[ 0 ].push( [ uvs[0], uvs[1], uvs[2] ] );

	// done: return it.
	return geo;
}

function drawHelpers() {
	// Background grid and axes. Grid step size is 1, axes cross at 0, 0
	Coordinates.drawGrid({size:100,scale:1,orientation:"z",offset:-0.01});
	Coordinates.drawAxes({axisLength:2.1,axisOrientation:"x",axisRadius:0.004,offset:-0.01});
	Coordinates.drawAxes({axisLength:2.1,axisOrientation:"y",axisRadius:0.004,offset:-0.01});
}

function addToDOM() {
	let container = document.getElementById('container');
	let canvas = container.getElementsByTagName('canvas');
	if (canvas.length>0) {
		container.removeChild(canvas[0]);
	}
	container.appendChild( renderer.domElement );
}

function init() {
	document.body.style.margin = "0";
	document.body.style.padding = "0";
	document.body.style.overflow = "hidden";

	let canvasWidth = document.documentElement.clientWidth;
	let canvasHeight = document.documentElement.clientHeight;

	let canvasRatio = canvasWidth / canvasHeight;

	// RENDERER
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setSize(canvasWidth, canvasHeight);
	renderer.setClearColorHex( 0xFFFFFF, 1.0 );

	// Camera: Y up, X right, Z up
	camera = new THREE.PerspectiveCamera( 1, canvasRatio, 50, 150 );
	camera.position.set( 0.5, 0.5, 100 );

	// CONTROLS
	cameraControls = new THREE.OrbitAndPanControls(camera, renderer.domElement);
	cameraControls.target.set(0.5,0.5,0);

}

function animate() {
	window.requestAnimationFrame(animate);
	render();
}
function render() {
	let delta = clock.getDelta();
	cameraControls.update(delta);
	renderer.render(scene, camera);
}

try {
	init();
	fillScene();
	drawHelpers();
	addToDOM();
	animate();
} catch(e) {
	let errorReport = "Your program encountered an unrecoverable error, can not draw on canvas. Error was:<br/><br/>";
	$('#container').append(errorReport+e);
}
