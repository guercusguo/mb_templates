// Map comparison: two maps side by side with a draggable swipe handle.
// Needs: the maplibre-gl-compare plugin (JS + CSS) and
// <div id="comparison-container"><div id="before" class="comparemap"></div><div id="after" class="comparemap"></div></div>
// with the container positioned (relative) and both maps absolutely positioned at full size.

const beforeMap = new maplibregl.Map({
  container: 'before',
  style: basemaps['streets'],
  center: [7.6869, 45.0703],
  zoom: 12
});
const afterMap = new maplibregl.Map({
  container: 'after',
  style: basemaps['satellite'],
  center: [7.6869, 45.0703],
  zoom: 12
});

const comparemap = new maplibregl.Compare(beforeMap, afterMap, '#comparison-container', {
  // mousemove: true, // move the handle with the mouse instead of dragging
  // orientation: 'horizontal'
});

// Add a non-georeferenced image to one side: list its corners as NW, NE, SE, SW
// beforeMap.on('load', () => {
//   beforeMap.addSource('image_layer', {
//     'type': 'image',
//     'url': 'path/to/image.webp',
//     'coordinates': [[west, north], [east, north], [east, south], [west, south]]
//   });
//   beforeMap.addLayer({ 'id': 'image_layer', 'type': 'raster', 'source': 'image_layer' });
// });
