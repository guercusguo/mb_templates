// Simple popup on click for pointal features based on text attribute and custom HTML
map.on('load', function () {
  map.on('click', 'layer_name', function (e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    var description = e.features[0].properties.layer_field;

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    new mapboxgl.Popup()
    .setLngLat(coordinates)
    .setHTML(description)
    .addTo(map);
  });

  // Change the cursor to a pointer when the mouse is over the places layer.
  map.on('mouseenter', 'layer_name', function () {
    map.getCanvas().style.cursor = 'pointer';
  });

  // Change it back to a pointer when it leaves.
  map.on('mouseleave', 'layer_name', function () {
    map.getCanvas().style.cursor = '';
  });
});
// END of popup on click for pointal features

// cluster click for zoom in on next level
// inspect a cluster on click
map1.on('click', 'clusters', (e) => {
  const features = map1.queryRenderedFeatures(e.point, {
    layers: ['clusters']
  });
  const clusterId = features[0].properties.cluster_id;
  map1.getSource('layer').getClusterExpansionZoom(
    clusterId,
    (err, zoom) => {
      if (err) return;

      map1.easeTo({
        center: features[0].geometry.coordinates,
        zoom: zoom
      });
    }
  );
});

map1.on('click', 'unclustered-point', (e) => {
  const coordinates = e.features[0].geometry.coordinates.slice();
  const chosenfield1 = e.features[0].properties.field1;
  const chosenfield2 = e.features[0].properties.field2;

  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
  }

  new mapboxgl.Popup()
  .setLngLat(coordinates)
  .setHTML(
    `Listing an attribute: ${chosenfield1}<br>:Classified as ${chosenfield2}`
  )
  .addTo(map1);
});

map1.on('mouseenter', 'layer_circle', () => {
  map1.getCanvas().style.cursor = 'pointer';
});
map1.on('mouseleave', 'layer_circle', () => {
  map1.getCanvas().style.cursor = '';
});
