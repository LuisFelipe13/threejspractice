var camera, scence, renderer, cube, cube2, cube3, cub34, controls, ray
var projector, mouse = { x: 0, y: 0 }, INTERSECTED; //mouse

init()
animate()

function init() {
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
  camera.position.set(0, 0, 100);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  scene = new THREE.Scene();

  var material = new THREE.LineBasicMaterial({ color: 0x0000ff });
  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3(-20, 0, 20));
  geometry.vertices.push(new THREE.Vector3(0, 20, 0));
  geometry.vertices.push(new THREE.Vector3(0, 0, 0));
  geometry.vertices.push(new THREE.Vector3(0, 20, 0));
  geometry.vertices.push(new THREE.Vector3(20, 0, 0));

  var line = new THREE.Line(geometry, material);

  var geometry = new THREE.BoxGeometry( 3, 3, 3 );
  var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  cube = new THREE.Mesh( geometry, material );
  cube.position.x = -20
  cube.position.y = 0
  cube.position.z = 20
  cube.updateMatrix()

  cube2 = new THREE.Mesh( geometry, material );
  cube2.position.x = 0
  cube2.position.y = 0
  cube2.updateMatrix()

  cube3 = new THREE.Mesh( geometry, material );
  cube3.position.x = 0
  cube3.position.y = 20
  cube3.updateMatrix()

  cube34 = new THREE.Mesh( geometry, material );
  cube34.position.x = 20
  cube34.position.y = 0
  cube34.updateMatrix()


  scene.add(line, cube, cube2, cube3, cube34);

  // initialize object to perform world/screen calculations
	projector = new THREE.Projector();

	// when the mouse moves, call the given function
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );

  function onDocumentMouseMove( event )
  {
  	// the following line would stop any other event handler from firing
  	// (such as the mouse's TrackballControls)
  	// event.preventDefault();

  	// update the mouse variable
  	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  }

  //this is the users controller
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  camera.position.set(0, 0, 100); //position is the angle in which you look at something... z is how far and close you are
  camera.up.set(0, 1, 0);
  controls.update();

}

function animate() {
  requestAnimationFrame( animate );

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  cube2.rotation.x += 0.01;
  cube2.rotation.y += 0.01;
  cube3.rotation.x += 0.01;
  cube3.rotation.y += 0.01;
  cube34.rotation.x += 0.01;
  cube34.rotation.y += 0.01;

  renderer.render(scene, camera);
  update();
}
//sce
function update()
{
	// find intersections

	// create a Ray with origin at the mouse position
	//   and direction into the scene (camera direction)
	var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
	projector.unprojectVector( vector, camera );
	ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

	// create an array containing all objects in the scene with which the ray intersects
	var intersects = ray.intersectObjects( scene.children );

	// INTERSECTED = the object in the scene currently closest to the camera
	//		and intersected by the Ray projected from the mouse position

	// if there is one (or more) intersections
	if ( intersects.length > 0 )
	{
		// if the closest object intersected is not the currently stored intersection object
		if ( intersects[ 0 ].object != INTERSECTED )
		{
		    // restore previous intersection object (if it exists) to its original color
			if ( INTERSECTED )
				INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
			// store reference to closest object as current intersection object
			INTERSECTED = intersects[ 0 ].object;
			// store color of closest object (for later restoration)
			INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
			// set a new color for closest object
			INTERSECTED.material.color.setHex( 0xffff00 );
		}
	}
	else // there are no intersections
	{
		// restore previous intersection object (if it exists) to its original color
		if ( INTERSECTED )
			INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
		// remove previous intersection object reference
		//     by setting current intersection object to "nothing"
		INTERSECTED = null;
	}

	controls.update();

}
