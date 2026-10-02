// GeoJSON sources and layers: polygons, points with a custom marker image, 3D terrain, hillshade and sky.
// Needs: <div id="map">

const map = new maplibregl.Map({
  container: 'map',
  style: basemaps['satellite'],
  center: [7.6869, 45.0703],
  zoom: 11,
  pitch: 50,
  maxPitch: 85
});
map.addControl(new maplibregl.NavigationControl());

//Load of GeoJSON source
function addSource() {
  map.addSource('area_geodata', {
    'type': 'geojson',
    'data': '../data/sample_areas.geojson'
  });
  map.addSource('point_geodata', {
    'type': 'geojson',
    'data': '../data/sample_points.geojson'
  });
  // One DEM source for the 3D terrain and one for the hillshade, as MapLibre recommends
  map.addSource('terrain-dem', demSource);
  map.addSource('hillshade-dem', demSource);
}

// List of added layers; rendering and symbology of GeoJSON data.
function addLayer() {
  map.addLayer({
    'id': 'hillshade',
    'type': 'hillshade',
    'source': 'hillshade-dem',
    'paint': {
      'hillshade-exaggeration': 0.4
    }
  });
  map.addLayer({
    'id': 'area_fill',
    'type': 'fill',
    'source': 'area_geodata', // reference the data source
    'paint': {
      // colour by the value of a text field
      'fill-color': [
        'match',
        ['get', 'zone'],
        'buffer',
        '#5ab4ac',
        'core',
        '#d8b365',
        /* other */ '#ccc'
      ],
      'fill-opacity': 0.3
    }
  });
  // Add an outline around the polygon.
  map.addLayer({
    'id': 'area_outline',
    'type': 'line',
    'source': 'area_geodata',
    'paint': {
      'line-color': '#000',
      'line-width': 1
    }
  });
  map.addLayer({
    'id': 'points',
    'type': 'symbol',
    'source': 'point_geodata',
    'layout': {
      'icon-image': 'point-marker',
      'icon-anchor': 'bottom'
    }
  });
  // Sky for the tilted view
  map.setSky({
    'sky-color': '#7fb2e5',
    'horizon-color': '#ffffff',
    'fog-color': '#ffffff',
    'sky-horizon-blend': 0.6,
    'horizon-fog-blend': 0.6,
    'fog-ground-blend': 0.4
  });
  // 3D properties of terrain source
  map.setTerrain({ 'source': 'terrain-dem', 'exaggeration': 1.2 });
}

// Custom marker image. loadImage returns a promise; a style change drops added images,
// so call this again from 'style.load' when switching basemaps (see styleswitch.js).
async function addMarkers() {
  if (map.hasImage('point-marker')) return;
  const image = await map.loadImage('../data/marker.png');
  if (!map.hasImage('point-marker')) map.addImage('point-marker', image.data);
}

map.on('style.load', function () {
  addMarkers();
  addSource();
  addLayer();
});
