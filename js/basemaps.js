// Shared by every template: basemaps and elevation that need no account or access token.
// Load this file before the template script.

const basemaps = {
  // Vector styles from OpenFreeMap (OpenStreetMap data)
  'streets': 'https://tiles.openfreemap.org/styles/liberty',
  'light': 'https://tiles.openfreemap.org/styles/positron',
  'dark': 'https://tiles.openfreemap.org/styles/dark',
  // Raster imagery: a minimal style with one raster source and one layer
  'satellite': {
    'version': 8,
    'sources': {
      'satellite': {
        'type': 'raster',
        'tiles': ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
        'tileSize': 256,
        'maxzoom': 19,
        'attribution': 'Imagery &copy; Esri, Maxar, Earthstar Geographics'
      }
    },
    'layers': [{ 'id': 'satellite', 'type': 'raster', 'source': 'satellite' }]
  }
};

// Open DEM source (Terrain Tiles on AWS, terrarium encoding).
// Add it twice when using both terrain and hillshade: map.addSource('terrain-dem', demSource); map.addSource('hillshade-dem', demSource);
const demSource = {
  'type': 'raster-dem',
  'tiles': ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
  'encoding': 'terrarium',
  'tileSize': 256,
  'maxzoom': 15,
  'attribution': 'Elevation: <a href="https://github.com/tilezen/joerd/blob/master/docs/attribution.md">Tilezen Joerd</a>'
};
