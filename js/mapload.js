// Basic map: bounded extent, navigation control and a "return to extent" button.
// Needs: <div id="map">, <button id="fit">

// bounds to be declared for each extent
const bounds = [
  [7.45, 44.95], // [west, south]
  [7.95, 45.20]  // [east, north]
];
const map = new maplibregl.Map({
  container: 'map', // container id
  style: basemaps['streets'], // stylesheet location
  center: [7.6869, 45.0703], // starting position [lng, lat]
  zoom: 11, // starting zoom
  // pitch: 60,
  // bearing: 80,
  // maxPitch: 85, // the default maximum is 60
  maxBounds: bounds
});

// Add zoom and rotation controls to the map.
map.addControl(new maplibregl.NavigationControl());

// Return to map extent
document.getElementById('fit').addEventListener('click', function () {
  map.fitBounds([
    [7.60, 45.03], // southwestern corner of the bounds
    [7.77, 45.11] // northeastern corner of the bounds
  ], { pitch: 0, bearing: 0 });
});
