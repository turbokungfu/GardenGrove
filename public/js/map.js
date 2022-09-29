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

  const res = await fetch('/post');
  console.log(res, 'hi')
  const data = await res.json();

  const posts = data.data.map(post => {
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [
          post.location.coordinates[0],
          post.location.coordinates[1]
        ]
      },
      properties: {
        farmid: post.farmid,
        icon: 'shop'
      }
    };
  });

  loadMap(posts);
}

// Load map with stores
function loadMap(posts) {
  map.on('load', function() {
    map.addLayer({
      id: 'points',
      type: 'symbol',
      source: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: posts
        }
      },
      layout: {
        'icon-image': '{icon}-15',
        'icon-size': 1.5,
        'text-field': '{storeId}',
        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
        'text-offset': [0, 0.9],
        'text-anchor': 'top'
      }
    });
  });
}

getFarms();