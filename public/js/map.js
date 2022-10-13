mapboxgl.accessToken =
  'pk.eyJ1IjoibWlrZXJhbmRhenpvIiwiYSI6ImNsODlkZ3Y0ZzA1d3UzcWxramVmOWxleHMifQ.PCEB7uIAsMtiw9rkigHPug';
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    zoom: 2,
    center: [-97.402171, 47.707741]
  });
  
  // Fetch stores from API
  async function getStores() {
    const res = await fetch('/api/v1/stores');
    const data = await res.json();
  
    const stores = data.data.map(store => {
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [
            store.location.coordinates[0],
            store.location.coordinates[1]
          ]
        },
        properties: {
          storeId: store.storeId,
          icon: 'shop',
          storeName: store.title
        }
      };
    });
  
    loadMap(stores);
  }
  
  // Load map with stores
  function loadMap(stores) {
    map.on('load', function() {
      map.addLayer({
        id: 'points',
        type: 'symbol',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: stores
          }
        },
        
        layout: {
          'icon-image': 'garden-15',
          'icon-allow-overlap': true,
          'icon-size': 1.5,
          'text-field': '{storeId}',
          'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
          'text-offset': [0, 0.9],
          'text-anchor': 'top'
        }
      });
    });
  }

  map.on('click', 'points', (e) => {
    // Copy coordinates array.
    const coordinates = e.features[0].geometry.coordinates.slice();
    const description = e.features[0].properties.storeName
    console.log(e.features[0].geometry)
     
    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
     
    new mapboxgl.Popup()
    .setLngLat(coordinates)
    .setHTML(description)
    .addTo(map);
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
map.on('mouseenter', 'points', () => {
  map.getCanvas().style.cursor = 'pointer';
  });
   
  // Change it back to a pointer when it leaves.
  map.on('mouseleave', 'points', () => {
  map.getCanvas().style.cursor = '';
  });
  
  getStores();

