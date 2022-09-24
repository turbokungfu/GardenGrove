

mapboxgl.accessToken =
  'pk.eyJ1IjoibWlrZXJhbmRhenpvIiwiYSI6ImNsODlkZ3Y0ZzA1d3UzcWxramVmOWxleHMifQ.PCEB7uIAsMtiw9rkigHPug';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  zoom: 2,
  center: [-97.40194, 38.452625]
});

// Fetch farms from API
async function getFarms() {
  const res = await fetch('/api/v1/farms');
  const data = await res.json();
  const farms = data.data.map(farm => {
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [
          farm.location.coordinates[0],
          farm.location.coordinates[1]
        ]
      },
      properties: {
        farmId: farm.farmId,
        icon: 'shop',
      }
    };
  });
  

  loadMap(farms);
}

// Load map with farms
function loadMap(farms) {
  map.on('load', function() {
    map.addLayer({
      id: 'points',
      type: 'symbol',
      source: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: farms
        }
      },
      layout: {
        'icon-image': '{icon}-15',
        'icon-size': 1.5,
        'text-field': '{farmId}',
        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
        'text-offset': [0, 0.9],
        'text-anchor': 'top'
      }
    });
  });
}

getFarms();