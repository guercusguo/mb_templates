// Timeline: a year slider and month buttons filter one layer by two text fields.
// Needs: <div id="map">, <input id="slider" type="range">, <span id="active-year">, <div id="filters"> with one button per month (data-month="1" ...)

const map = new maplibregl.Map({
  container: 'map',
  style: basemaps['light'],
  center: [7.6869, 45.0703],
  zoom: 10
});
map.addControl(new maplibregl.NavigationControl());

// Current selection; the fields hold text, so the values are strings
let year = document.getElementById('slider').value;
let month = '1';
// One filter for both fields. For large datasets, split the data into one file per period
// and switch it with map.getSource('timeline').setData(url) instead of filtering.
const timeFilter = () => ['all',
  ['==', ['get', 'year'], year],
  ['==', ['get', 'month'], month]
];

function updateUI() {
  document.getElementById('active-year').innerText = year;
  document.querySelectorAll('#filters input').forEach((button) => {
    button.classList.toggle('active', button.dataset.month === month);
  });
}
updateUI();

map.on('load', () => {
  map.addSource('timeline', {
    'type': 'geojson',
    'data': '../data/sample_points.geojson'
  });
  map.addLayer({
    'id': 'timeline',
    'type': 'circle',
    'source': 'timeline',
    'paint': {
      'circle-color': '#dd3497',
      'circle-radius': 6,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff'
    },
    'filter': timeFilter()
  });

  // update the year when the slider is dragged
  document.getElementById('slider').addEventListener('input', (event) => {
    year = event.target.value;
    map.setFilter('timeline', timeFilter());
    updateUI();
  });
  // update the month when a button is clicked
  document.getElementById('filters').addEventListener('click', (event) => {
    if (!event.target.dataset.month) return;
    month = event.target.dataset.month;
    map.setFilter('timeline', timeFilter());
    updateUI();
  });
});
