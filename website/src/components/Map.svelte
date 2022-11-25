<script>
    import * as L from 'leaflet';
    import 'leaflet/dist/leaflet.css';
    import { tourStepsPromise } from '../utils.js'
    let map;

    let markerLocations = [];

    tourStepsPromise.subscribe( async ($tourStepsPromise) =>{
      markerLocations = (await $tourStepsPromise).filter(marker => marker[2] !== null && marker[3] !== null)
    })


    let lastMarkers = null
    $: {
      if(map){
        if(lastMarkers !== null){
          lastMarkers.forEach( marker => marker.remove())
        }
        lastMarkers = markerLocations
          .map( marker => L.marker([marker[2], marker[3]]))
        lastMarkers.forEach( (marker, index) => {
          marker.addTo(map)
          marker.bindPopup(`<b>${markerLocations[index][0]}</b>. ${markerLocations[index][1]}`)
          marker.bindTooltip(`<b>${markerLocations[index][0]}</b>`, 
            {
                permanent: true, 
                direction: 'top'
            })


        })
      }
    }
    
  
    function createMap(container) {
      let m = L.map(container).setView([45.405027777777775, 11.8839], 14);
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          maxZoom: 16,
        }
      ).addTo(m);
  
      return m;
    }
  
    function mapAction(container) {
      map = createMap(container);
      return {
        destroy: () => {
          map.remove();
        },
      };
    }

    function resizeMap() {
      if(map) { map.invalidateSize(); }
    }

  </script>
  
  <svelte:window on:resize={resizeMap} />


  <div style="height:400px;width:100%" use:mapAction />
  