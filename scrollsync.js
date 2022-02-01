var chapters = {
	'first-chapter': {
		bearing: 0,
		center: [7.943968, 44.611059],
		zoom: 13,
		speed: 0.3,
		pitch: 20
	}
// , ...
}
var layerList = document.getElementById('menu');
var inputs = layerList.getElementsByTagName('input');
var fallbackImageUrl = '/../path/to/marker.png';
// Chapter-scrolling: On every scroll event, check which element is on screen
window.onscroll = function () {
	var chapterNames = Object.keys(chapters);
	for (var i = 0; i < chapterNames.length; i++) {
		var chapterName = chapterNames[i];
		if (isElementOnScreen(chapterName)) {
			setActiveChapter(chapterName);
			break;
		}
	}
};

var activeChapterName = 'first-chapter';
function setActiveChapter(chapterName) {
	if (chapterName === activeChapterName) return;

	map.flyTo(chapters[chapterName]);

	document.getElementById(chapterName).setAttribute('class', 'active');
	document.getElementById(activeChapterName).setAttribute('class', '');

	activeChapterName = chapterName;
}

function isElementOnScreen(id) {
	var element = document.getElementById(id);
	var bounds = element.getBoundingClientRect();
	return bounds.top < window.innerHeight && bounds.bottom > 0;
}
