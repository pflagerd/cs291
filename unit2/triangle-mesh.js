"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
////////////////////////////////////////////////////////////////////////////////
// Draw a Square Exercise
// Your task is to complete the function square (at line 28).
// The function takes 4 arguments - coordinates x1, y1, x2, y2
// for the square and returns a geometry object (THREE.Geometry())
// that defines a square at the provided coordinates.
////////////////////////////////////////////////////////////////////////////////
/*global THREE, Coordinates, document*/

let camera, scene, renderer;
let windowScale;

function exampleTriangle() {
	// This code demonstrates how to draw a triangle
	let triangle = new THREE.Geometry();
	triangle.vertices.push( new THREE.Vector3( 1, 1, 0 ) );
	triangle.vertices.push( new THREE.Vector3( 3, 1, 0 ) );
	triangle.vertices.push( new THREE.Vector3( 3, 3, 0 ) );

	triangle.faces.push( new THREE.Face3( 0, 1, 2 ) );

	return triangle;
}

function drawSquare(x1, y1, x2, y2) {

	let square = new THREE.Geometry();
	// Your code goes here

	// don't forget to return the geometry!	The following line is required!
	return square;
}

function init() {
	// Set up some parameters
	let canvasWidth = 846;
	let canvasHeight = 494;
	// For grading the window is fixed in size; here's general code:
	//let canvasWidth = window.innerWidth;
	//let canvasHeight = window.innerHeight;
	let canvasRatio = canvasWidth / canvasHeight;
	// scene
	scene = new THREE.Scene();

	// Camera: Y up, X right, Z up
	windowScale = 12;
	let windowWidth = windowScale * canvasRatio;
	let windowHeight = windowScale;

	camera = new THREE.OrthographicCamera(windowWidth/-2, windowWidth/2, windowHeight/2, windowHeight/-2, 0, 40);

	let focus = new THREE.Vector3( 5,5,0 );
	camera.position.x = focus.x;
	camera.position.y = focus.y;
	camera.position.z = 20;
	camera.lookAt(focus);

	renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true});
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setSize( canvasWidth, canvasHeight );
	renderer.setClearColorHex( 0xFFFFFF, 1.0 );
}

function addToDOM() {
	let container = document.getElementById('container');
	let canvas = container.getElementsByTagName('canvas');
	if (canvas.length>0) {
		container.removeChild(canvas[0]);
	}
	container.appendChild( renderer.domElement );
}

function render() {
	renderer.render( scene, camera );
}

function showGrids() {
	// Background grid and axes. Grid step size is 1, axes cross at 0, 0
	Coordinates.drawGrid({size:100,scale:1,orientation:"z"});
	Coordinates.drawAxes({axisLength:11,axisOrientation:"x",axisRadius:0.04});
	Coordinates.drawAxes({axisLength:11,axisOrientation:"y",axisRadius:0.04});
}

try {
	init();
	showGrids();
	// creating and adding the triangle to the scene
	let triangleMaterial = new THREE.MeshBasicMaterial( { color: 0x2685AA, side: THREE.DoubleSide } );
	let triangleGeometry = exampleTriangle();
	let triangleMesh = new THREE.Mesh( triangleGeometry, triangleMaterial );
	scene.add(triangleMesh);
	// creating and adding your square to the scene !
	let square_material = new THREE.MeshBasicMaterial( { color: 0xF6831E, side: THREE.DoubleSide } );
	let square_geometry = drawSquare(3,5,7,9);
	let square_mesh = new THREE.Mesh(square_geometry, square_material);
	scene.add(square_mesh);
	addToDOM();
	render();
} catch(e) {
	let errorReport = "Your program encountered an unrecoverable error, can not draw on canvas. Error was:<br/><br/>";
	$('#container').append(errorReport+e);
}


