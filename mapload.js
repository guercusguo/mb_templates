// bounds to be declared for each extent
const bounds1 = [
  [-175.40291,-21.30190], // [west, south]
  [-174.97059,-21.04082]  // [east, north]
];
// bounds require map to be declared as const, not var.
mapboxgl.accessToken = '';
const map1 = new mapboxgl.Map({
  container: 'map1', // container id
  style: '', // stylesheet location
  center: [-175.20119,-21.16875], // starting position [lng, lat]
  zoom: 10, // starting zoom
  // pitch: 85,
  // bearing: 80,
  maxBounds: bounds1
});

// map comparison: needs mapbox compare CSS + JS
// needs enclosing classed div
const container = '#comparison-container';

const comparemap = new mapboxgl.Compare(beforeMap, afterMap, container, {
});

// Return to map extent
document.getElementById('fit').addEventListener('click', function () {
  map.fitBounds([
    [7.798595, 44.523151], // southwestern corner of the bounds
    [8.571995, 45.121761] // northeastern corner of the bounds
  ]);
});
