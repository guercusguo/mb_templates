
//Load of GeoJSON source
var geojson;
function addSource() {
	map.addSource('area_geodata', {
		'type': 'geojson',
		'data': '/../path/to/areas.geojson'
	});
	map.addSource('point_geodata', {
		'type': 'geojson',
		'data': '/../path/to/point_geodata.geojson'
	});
	// Mapbox default DEM source
	map.addSource('mapbox-dem', {
		'type': 'raster-dem',
		'url': 'mapbox://mapbox.mapbox-terrain-dem-v2',
		'tileSize': 256,
		'maxzoom': 14
	});
}
// Add a raster non-georeferenced source
beforeMap.addSource('image_layer', {
	'type': 'image',
	'url': 'path/to/image_layer.gif',
	'coordinates': [
		[-175.407, -21.056], //NW
		[-175.283, -21.056], //SW
		[-175.283, -21.118], //SE
		[-175.407, -21.118] //NE
		//-175.407 W,-21.118 S,-175.283 E,-21.056 N
	]
});
//END of addSource

// List of added layers; rendering and symbology of GeoJSON data.
//Area with differential colouring based on data properties
function addLayer() {
	map.addLayer({
		'id': 'area_layer',
		'type': 'fill',
		'source': 'area_layer', // reference the data source
		'layout': {
			// Make the layer visible by default.
			'visibility': 'visible'
		},
		'paint': {
			'fill-color': [
				'match',
				['get', 'TIPO'],
				'Buffer zone',
				'#feebe2',
				'Core zone',
				'#f768a1',
				'#ccc'
			],
			//'fill-color': '#0080ff', // blue color fill
			'fill-opacity': 0.3
		}
	});
	// Outline
	map.addLayer({
		'id': 'outline_area',
		'type': 'line',
		'source': 'area_layer',
		'layout': {
			// Make the layer visible by default.
			'visibility': 'visible'
		},
		'paint': {
			'line-color': '#000',
			'line-width': 1
		}
	});
	// Point geometry with svg/png marker
	map.addLayer({
		'id': 'point_layer',
		'type': 'symbol',
		'layout': {
			// Make the layer visible by default.
			'icon-image': 'point-marker',
			'visibility': 'visible'
		},
		'source': 'ciabot',
	});
	// Add georeferenced layer
	beforeMap.addLayer({
		id: 'image_layer',
		'type': 'raster',
		'source': 'image_layer'
	});
});
// Sky layer for 3D terrain
map.addLayer({
	'id': 'sky',
	'type': 'sky',
	'paint': {
		'sky-type': 'atmosphere',
		'sky-atmosphere-sun': [0.0, 0.0],
		'sky-atmosphere-sun-intensity': 15
	}
});
// 3D properties of terrain source
map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.2 });
// END of 3D properties
}
//END of addLayer

// Markers load and render + Fallback for sprites / markers not loading when changing styles (in case of style switch)
function addMarkers () {
	map.on('load', function () {
		// Add an image to use as a custom marker
		map.loadImage(
			'/../assets/markers/point-marker.png',
			function (error, image) {
				if (error) throw error;
				map.addImage('point-marker', image);
			}
		);
	});
	// loadImage is async -> images are not rendered when style changes, hence custom markers.
	// Still has problems with certain zooms
	map.on('styleimagemissing', function (e) {
		map.loadImage(fallbackImageUrl, function(err, data) {
			if (!err) {
				if (!map.hasImage(e.id)) {
					map.addImage(e.id, data);
				}
			}
		});
	});
}

</script>
