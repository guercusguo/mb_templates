document.getElementById('slider').addEventListener('input', (event) => {
  map.addLayer({
    'id': 'sky',
    'type': 'sky',
    'paint': {
      'sky-opacity': [
        'interpolate',
        ['linear'],
        ['zoom'],
        0,
        0,
        5,
        0.3,
        8,
        1
      ],
      'sky-type': 'atmosphere',
      'sky-atmosphere-sun': [262.51, 17],
      'sky-atmosphere-sun-intensity': 5
    }
  });
  const year = event.target.value;
  // update the map
  filterYear = ['==', ['string', ['get', 'year_s']], year];
  map.setFilter('snow', ['all', filterMonth, filterYear]);

  // update text in the UI
  document.getElementById('active-year').innerText = year;
});

document.getElementById('filters').addEventListener('change', (event) => {
  const month = event.target.value;
  // update the map filter
  if (month === 'Oct') {
    filterMonth = [
      'match',
      ['get', 'month_s'],
      ['10'],
      true,
      false
    ];
  }
  else if (month === 'Nov') {
    filterMonth = [
      'match',
      ['get', 'month_s'],
      ['11'],
      true,
      false
    ];
  }
  else if (month === 'Dec') {
    filterMonth = [
      'match',
      ['get', 'month_s'],
      ['12'],
      true,
      false
    ];
  }
  else if (month === 'Jan') {
    filterMonth = [
      'match',
      ['get', 'month_s'],
      ['1'],
      true,
      false
    ];
  }
  else if (month === 'Feb') {
    filterMonth = [
      'match',
      ['get', 'month_s'],
      ['2'],
      true,
      false
    ];
  }
  else if (month === 'Mar') {
    filterMonth = [
      'match',
      ['get', 'month_s'],
      ['3'],
      true,
      false
    ];
  }
  else {
    console.error('error');
  }
  map.setFilter('snow', ['all', filterMonth, filterYear]);
});
});
