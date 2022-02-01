// simple clustering of point features
map1.addLayer({
  id: 'layer_circle',
  type: 'circle',
  source: 'layer_circle',
  filter: ['has', 'point_count'],
  paint: {
    // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
    'circle-color': [
      'case',
      cat1,
      colors[0],
      cat2,
      colors[1],
      cat3,
      colors[2],
      cat4,
      colors[3]
    ],
    'circle-radius': 12
  }
});
map1.addLayer({
  id: 'unclustered-point',
  type: 'circle',
  source: 'layer_circle',
  filter: ['!', ['has', 'point_count']],
  paint: {
    'circle-color': [
      'match',
      ['get', 'catage_gra'],
      'Attribute 1',
      '#ffffb2',
      'Attribute 2',
      '#fecc5c',
      'Attribute 3',
      '#fd8d3c',
      'Attribute 4',
      '#f03b20',
      /* other */ '#ccc'
    ],
    'circle-radius': 4,
    'circle-stroke-width': 1,
    'circle-stroke-color': '#fff'
  }
});

//---------------------------------------------------------

// HTML based quantitative clustering of point features
// Functional const declarations for text fields

const cat1 = ['in', ['get', 'field'], 'value1'];
const cat2 = ['in', ['get', 'field'], 'value2'];
const cat3 = ['in', ['get', 'field'], 'value3'];
const cat4 = ['in', ['get', 'field'], 'value4'];

const colors = ['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20'];

map1.addSource('geodata', {
  type: 'geojson',
  data: 'assets/geodata.geojson',
  cluster: true,
  clusterMaxZoom: 14,
  clusterRadius: 50,
  'clusterProperties': {
    // keep separate counts for each category in a cluster
    'cat1': ['+', ['case', cat1, 1, 0]],
    'cat2': ['+', ['case', cat2, 1, 0]],
    'cat3': ['+', ['case', cat3, 1, 0]],
    'cat4': ['+', ['case', cat4, 1, 0]]
  }
});

const markers = {};
let markersOnScreen = {};

function updateMarkers() {
  const newMarkers = {};
  const features = map1.querySourceFeatures('layer');

  for (const feature of features) {
    const coords = feature.geometry.coordinates;
    const props = feature.properties;
    if (!props.cluster) continue;
    const id = props.cluster_id;

    let marker = markers[id];
    if (!marker) {
      const el = createDonutChart(props);
      marker = markers[id] = new mapboxgl.Marker({
        element: el
      }).setLngLat(coords);
    }
    newMarkers[id] = marker;

    if (!markersOnScreen[id]) marker.addTo(map1);
  }
  // for every marker we've added previously, remove those that are no longer visible
  for (const id in markersOnScreen) {
    if (!newMarkers[id]) markersOnScreen[id].remove();
  }
  markersOnScreen = newMarkers;
}

// after the GeoJSON data is loaded, update markers on the screen on every frame
map1.on('render', () => {
  if (!map1.isSourceLoaded('layer')) return;
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

  let html = `<div>
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
