var info, renderer, scene, camera, controls, stats;

var nodes = []
var raycaster;
var mouse = new THREE.Vector2();
var intersection;

init();
animate();

function init() {
	var geometry, material, node, helper;

	document.body.style.cssText = 'font: 600 12pt monospace; margin: 0; overflow: hidden' ;

	info = document.body.appendChild( document.createElement( 'div' ) );
	info.style.cssText = 'left: 20px; position: absolute; top: 0px; width: 100% ';
	info.innerHTML = '<div id=msg>Move the cursor to ID the cubes...</div>' + '';

	stats = new Stats();
	stats.domElement.style.cssText = 'position: absolute; right: 0; top: 0; z-index: 100; ';
	document.body.appendChild( stats.domElement );

	renderer = new THREE.WebGLRenderer( { alpha: 1, antialias: true, clearColor: 0xffffff }  );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.shadowMap.enabled = true;
	renderer.shadowMapSoft = true;
	document.body.appendChild( renderer.domElement );

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 5000 );
	camera.position.set( 100, 100, 100 );
	scene.add( camera ); // for light to follow

	var domEvents	= new THREEx.DomEvents(camera, renderer.domElement)
  // controls
	controls = new THREE.OrbitControls( camera );
	controls.minDistance = 10;
	controls.maxDistance = 1000;

  geometry = new THREE.BoxGeometry( 10, 10, 10 );

	var node = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: 0x00ff00 } ) );
	node.position.set(0, 0, 0);
	node.castShadow = true;
	node.receiveShadow = true;
	scene.add( node );
	nodes.push( node );
	var node2 = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: 0x00ff00 } ) );
	node.position.set(0, 20, 0);
	node.castShadow = true;
	node.receiveShadow = true;
	scene.add( node2 );
	nodes.push( node2 );

  raycaster = new THREE.Raycaster();


  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	// domEvents.addEventListener(scene, 'click', function(event) {
	// 	console.log('you clicked on the mesh')
	// }, false)
  document.addEventListener( 'click', clickOnNode, false );
}

function clickOnNode() {
	if (findIntersections() !== null) {
		console.log(intersection.id); //REMEMBER TO GRAB BY NAME WHICH WILL BE OUR ID
	}
}

function onDocumentMouseMove( event ) {

	event.preventDefault();

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function findIntersections() {

		raycaster.setFromCamera( mouse, camera );

		var intersections = raycaster.intersectObjects( nodes );

		if ( intersections.length > 0 ) {

			if ( intersection != intersections[ 0 ].object ) {

				intersection = intersections[ 0 ].object;

				msg.innerHTML = 'Selected cube ID: ' + intersection.id ;

				if (nodes.find( (node) => node.id === intersection.id)) {
					let found = nodes.find( (node) => node.id === intersection.id)
					console.log(found);
					found.material.color.setHex(0xffff000)
					return intersection.id
				}

			}

		} else {

			intersection = null;
			msg.innerHTML = 'No cube selected' ;
			nodes.forEach((node) => node.material.color.setHex(0x00ff00))
			return intersection
		}

}


function animate( timestamp ) {
	renderer.render( scene, camera );
	findIntersections();
	controls.update();
	stats.update();
	requestAnimationFrame( animate );

}
