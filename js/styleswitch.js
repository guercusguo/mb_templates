// Basemap switch: changing style removes every source and layer added at runtime, so they are added again on 'style.load'.
// Needs: <div id="map">, <div id="menu"> with one radio input per basemap, each id being a key of `basemaps`

const map = new maplibregl.Map({
  container: 'map',
  style: basemaps['streets'],
  center: [7.6869, 45.0703],
  zoom: 11
});
map.addControl(new maplibregl.NavigationControl());

function addSource() {
  map.addSource('area_geodata', {
    'type': 'geojson',
    'data': '../data/sample_areas.geojson'
  });
}
function addLayer() {
  map.addLayer({
    'id': 'area_outline',
    'type': 'line',
    'source': 'area_geodata',
    'paint': {
      'line-color': '#dd3497',
      'line-width': 3
    }
  });
}

// Fires for the first style and after every switch
map.on('style.load', function() {
  addSource();
  addLayer();
});
function switchLayer(layer) {
  var layerId = layer.target.id;
  // diff: false forces a full reload, so that 'style.load' fires again
  map.setStyle(basemaps[layerId], { diff: false });
};
var inputs = document.getElementById('menu').getElementsByTagName('input');
for (var i = 0; i < inputs.length; i++) {
  inputs[i].onclick = switchLayer; }
// End of Basemap switch
