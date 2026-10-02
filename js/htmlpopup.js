// Popup on click for point features, built from their attributes.
// Needs: <div id="map">

const map = new maplibregl.Map({
  container: 'map',
  style: basemaps['light'],
  center: [7.6869, 45.0703],
  zoom: 11
});
map.addControl(new maplibregl.NavigationControl());

map.on('load', function () {
  map.addSource('point_geodata', {
    'type': 'geojson',
    'data': '../data/sample_points.geojson'
  });
  map.addLayer({
    'id': 'points',
    'type': 'circle',
    'source': 'point_geodata',
    'paint': {
      'circle-color': '#dd3497',
      'circle-radius': 5,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff'
    }
  });
});

// The layer id (not the source id) is what click and hover events are bound to
map.on('click', 'points', function (e) {
  var coordinates = e.features[0].geometry.coordinates.slice();
  var properties = e.features[0].properties;

  // Ensure that if the map is zoomed out such that multiple
  // copies of the feature are visible, the popup appears
  // over the copy being pointed to.
  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
  }

  // Build the content as elements: attribute values are never parsed as HTML.
  // For a single line of text, .setText(properties.name) is enough.
  var content = document.createElement('div');
  var title = document.createElement('strong');
  title.textContent = properties.name;
  var detail = document.createElement('div');
  detail.textContent = 'Classified as ' + properties.category;
  content.append(title, detail);

  new maplibregl.Popup()
  .setLngLat(coordinates)
  .setDOMContent(content)
  .addTo(map);
});
// For polygons or lines use e.lngLat as the popup position instead of the geometry coordinates.

// Change the cursor to a pointer when the mouse is over the layer.
map.on('mouseenter', 'points', function () {
  map.getCanvas().style.cursor = 'pointer';
});

// Change it back when it leaves.
map.on('mouseleave', 'points', function () {
  map.getCanvas().style.cursor = '';
});
