// Chapter scrolling: the map flies to the camera position of the section in the middle of the screen.
// Needs: <div id="map">, one <section id="..."> per chapter (the first with class "active")

const map = new maplibregl.Map({
  container: 'map',
  style: basemaps['streets'],
  center: [7.6869, 45.0703],
  zoom: 11,
  maxPitch: 85
});

// Camera position for each section of the page, keyed by section id
var chapters = {
  'first-chapter': {
    bearing: 0,
    center: [7.6869, 45.0703],
    zoom: 11,
    speed: 0.6,
    pitch: 0
  },
  'second-chapter': {
    bearing: 30,
    center: [7.6932, 45.0690],
    zoom: 15,
    speed: 0.6,
    pitch: 60
  },
  'third-chapter': {
    bearing: -40,
    center: [7.7670, 45.0810],
    zoom: 13,
    speed: 0.6,
    pitch: 70
  }
  // , ...
};

var activeChapterName = Object.keys(chapters)[0];
function setActiveChapter(chapterName) {
  if (chapterName === activeChapterName) return;

  map.flyTo(chapters[chapterName]);

  // classList keeps the other classes of the section
  document.getElementById(chapterName).classList.add('active');
  document.getElementById(activeChapterName).classList.remove('active');

  activeChapterName = chapterName;
}

// The root margin shrinks the viewport to its middle line: a section is active while it crosses that line
var chapterObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) setActiveChapter(entry.target.id);
  });
}, { rootMargin: '-50% 0px -50% 0px' });
Object.keys(chapters).forEach(function (chapterName) {
  chapterObserver.observe(document.getElementById(chapterName));
});
