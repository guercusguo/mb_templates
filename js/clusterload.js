// Clustered points drawn as donut charts, one segment per category; click a chart to zoom into the cluster.
// Needs: <div id="map">

const map = new maplibregl.Map({
  container: 'map',
  style: basemaps['dark'],
  center: [7.6869, 45.0703],
  zoom: 10
});
map.addControl(new maplibregl.NavigationControl());

// Categories of the text field, in the order of the donut segments, and their colours
const field = 'category';
const categories = ['value1', 'value2', 'value3', 'value4'];
const colors = ['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20'];
const isCategory = (category) => ['==', ['get', field], category];
const categoryColor = [
  'match',
  ['get', field],
  categories[0], colors[0],
  categories[1], colors[1],
  categories[2], colors[2],
  categories[3], colors[3],
  /* other */ '#ccc'
];

map.on('load', () => {
  map.addSource('geodata', {
    type: 'geojson',
    data: '../data/sample_points.geojson',
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50,
    'clusterProperties': {
      // keep separate counts for each category in a cluster
      'cat1': ['+', ['case', isCategory(categories[0]), 1, 0]],
      'cat2': ['+', ['case', isCategory(categories[1]), 1, 0]],
      'cat3': ['+', ['case', isCategory(categories[2]), 1, 0]],
      'cat4': ['+', ['case', isCategory(categories[3]), 1, 0]]
    }
  });
  // Points that are not part of a cluster
  map.addLayer({
    id: 'unclustered-point',
    type: 'circle',
    source: 'geodata',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-color': categoryColor,
      'circle-radius': 4,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff'
    }
  });

  // Clusters are HTML markers, one per cluster, kept in sync with what is on screen
  const markers = {};
  let markersOnScreen = {};

  function updateMarkers() {
    const newMarkers = {};
    const features = map.querySourceFeatures('geodata');

    for (const feature of features) {
      const coords = feature.geometry.coordinates;
      const props = feature.properties;
      if (!props.cluster) continue;
      const id = props.cluster_id;

      let marker = markers[id];
      if (!marker) {
        const el = createDonutChart(props);
        // zoom into the cluster on click: getClusterExpansionZoom returns a promise
        el.addEventListener('click', async () => {
          const zoom = await map.getSource('geodata').getClusterExpansionZoom(id);
          map.easeTo({ center: coords, zoom: zoom });
        });
        marker = markers[id] = new maplibregl.Marker({
          element: el
        }).setLngLat(coords);
      }
      newMarkers[id] = marker;

      if (!markersOnScreen[id]) marker.addTo(map);
    }
    // for every marker we've added previously, remove those that are no longer visible
    for (const id in markersOnScreen) {
      if (!newMarkers[id]) markersOnScreen[id].remove();
    }
    markersOnScreen = newMarkers;
  }

  // after the GeoJSON data is loaded, update markers on the screen on every frame
  map.on('render', () => {
    if (!map.isSourceLoaded('geodata')) return;
    updateMarkers();
  });
});

// code for creating an SVG donut chart from feature properties
function createDonutChart(props) {
  const offsets = [];
  const counts = [
    props.cat1,
    props.cat2,
    props.cat3,
    props.cat4,
  ];
  let total = 0;
  for (const count of counts) {
    offsets.push(total);
    total += count;
  }
  const fontSize =
  total >= 1000 ? 22 : total >= 100 ? 20 : total >= 10 ? 18 : 16;
  const r =
  total >= 1000 ? 50 : total >= 100 ? 32 : total >= 10 ? 24 : 18;
  const r0 = Math.round(r * 0.6);
  const w = r * 2;

  let html = `<div style="cursor: pointer">
  <svg width="${w}" height="${w}" viewbox="0 0 ${w} ${w}" text-anchor="middle" style="font: ${fontSize}px sans-serif; display: block">`;

  for (let i = 0; i < counts.length; i++) {
    html += donutSegment(
      offsets[i] / total,
      (offsets[i] + counts[i]) / total,
      r,
      r0,
      colors[i]
    );
  }
  html += `<circle cx="${r}" cy="${r}" r="${r0}" fill="white" />
  <text dominant-baseline="central" transform="translate(${r}, ${r})">
  ${total.toLocaleString()}
  </text>
  </svg>
  </div>`;

  const el = document.createElement('div');
  el.innerHTML = html;
  return el.firstChild;
}

function donutSegment(start, end, r, r0, color) {
  if (end - start === 1) end -= 0.00001;
  const a0 = 2 * Math.PI * (start - 0.25);
  const a1 = 2 * Math.PI * (end - 0.25);
  const x0 = Math.cos(a0),
  y0 = Math.sin(a0);
  const x1 = Math.cos(a1),
  y1 = Math.sin(a1);
  const largeArc = end - start > 0.5 ? 1 : 0;

  // draw an SVG path
  return `<path d="M ${r + r0 * x0} ${r + r0 * y0} L ${r + r * x0} ${
    r + r * y0
  } A ${r} ${r} 0 ${largeArc} 1 ${r + r * x1} ${r + r * y1} L ${
    r + r0 * x1
  } ${r + r0 * y1} A ${r0} ${r0} 0 ${largeArc} 0 ${r + r0 * x0} ${
    r + r0 * y0
  }" fill="${color}" />`;
}
