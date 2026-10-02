# mb_templates
Frequently used [MapLibre GL JS](https://maplibre.org/) templates. No account or access token is needed.

Each template is one script in `js/` with a runnable page in `examples/`.

| Template | What it does | Needs |
|---|---|---|
| `js/basemaps.js` | Token-free basemaps and elevation source, shared by all templates | - |
| `js/mapload.js` | Bounded map, navigation control, return-to-extent button | - |
| `js/layerload.js` | GeoJSON polygons and points, custom marker image, 3D terrain, hillshade, sky | - |
| `js/styleswitch.js` | Basemap switch that adds sources and layers again | - |
| `js/scrollsync.js` | Map camera following the sections of a scrolling page | - |
| `js/htmlpopup.js` | Popup on click built from feature attributes | - |
| `js/clusterload.js` | Clusters drawn as donut charts by category, click to zoom | - |
| `js/timeline.js` | Year slider and month buttons filtering a layer | - |
| `js/compare.js` | Two maps with a swipe handle | [maplibre-gl-compare](https://github.com/maplibre/maplibre-gl-compare) |

## Run locally
```
python -m http.server 8000
```
then open http://localhost:8000/

## Data and services
- `data/` holds small generated sample data around Turin, only there to make the examples run.
- Vector basemaps: [OpenFreeMap](https://openfreemap.org/) (OpenStreetMap data)
- Satellite imagery: Esri World Imagery
- Elevation: [Terrain Tiles](https://registry.opendata.aws/terrain-tiles/) on AWS
