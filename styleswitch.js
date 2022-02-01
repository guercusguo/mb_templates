map.on('style.load', function() {
	addMarkers();
	addSource();
	addLayer();
});
function switchLayer(layer) {
	var layerId = layer.target.id;
	map.setStyle('mapbox://styles/user/' + layerId);
};
for (var i = 0; i < inputs.length; i++) {
	inputs[i].onclick = switchLayer; }
	// End of Basemap switch
	map.addControl(new mapboxgl.NavigationControl());
