
// {/* The <div> element has a child <button> element that allows keyboard interaction */}
// {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
import React, { useEffect, useRef, useState } from 'react';

import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

// import * as turf from '@turf/turf';

// import 'mapbox-gl/dist/mapbox-gl.css';
// import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

const SearchMapNew = (props) => {



const paragraphStyle = {
  fontFamily: 'Open Sans',
  margin: 0,
  fontSize: 13
};


  const {serviceAreas,setServiceAreas} = props;
   const [roundedArea, setRoundedArea] = useState();

  //console.log(listings);

  const mapContainerRef = useRef();

  const mapRef = useRef();

  const [start, setStart] = useState(false);

  const [currentPosition, setCurrentPosition] = useState(false);
  const [currentCoord, setCurrentCoord] = useState("");



  useEffect(() => {
    
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      //center: firstListing,
      minZoom: 2,
      zoom: 3,
    });

    let popup = null;
    mapRef.current.addControl(
     // new mapboxgl.FullscreenControl(),
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      })
    );

    let geocoder = {};

     mapRef.current.addControl(
     geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        //flipCoordinates:true,
        reverseGeocode:true,
      })
    );
    
    geocoder.on('results', function(results) {
      console.log(results);
      console.log("Calling here");
    });

    geocoder.on('result', (selected) => {
        setServiceAreas(selected);
        console.log("Calling here");
      })

//  const draw = new MapboxDraw({
//       displayControlsDefault: false,
//       controls: {
//         polygon: true,
//         trash: true
//       },
//       defaultMode: 'draw_polygon'
//     });
//     mapRef.current.addControl(draw,"top-left");

//     mapRef.current.on('draw.create', updateArea);
//     mapRef.current.on('draw.delete', updateArea);
//     mapRef.current.on('draw.update', updateArea);

//     function updateArea(e) {
//       console.log("Updatiing")
//       const data = draw.getAll();
//       if (data.features.length > 0) {
//         const area = turf.area(data);
//         setRoundedArea(Math.round(area * 100) / 100);
//       } else {
//         setRoundedArea();
//         if (e.type !== 'draw.delete') alert('Click the map to draw a polygon.');
//       }
//     }



    mapRef.current.on('load', () => {

      mapRef.current.on('mouseenter', 'places', (e) => {
        mapRef.current.getCanvas().style.cursor = 'pointer';

        const coordinates = e.features[0].geometry.coordinates.slice();
        const description = e.features[0].properties.description;

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
      });

      mapRef.current.on('mouseleave', 'places', () => {
        mapRef.current.getCanvas().style.cursor = '';
        popup.remove();
      });

      mapRef.current.on('click', (e) => {
        setCurrentCoord(`${e.lngLat.lat},${e.lngLat.lng}`);
      });
    
    });

    if(currentCoord){
      geocoder.query(currentCoord);
    }

  }, [currentCoord]);



  const mousePos = (e) => {

    const canvas = mapRef.current.getCanvasContainer();

    const rect = canvas.getBoundingClientRect();

    return new mapboxgl.Point(

      e.clientX - rect.left - canvas.clientLeft,

      e.clientY - rect.top - canvas.clientTop

    );

  };

  const finish = (bbox) => {
    setStart();
    if (bbox) {
      const features = mapRef.current.queryRenderedFeatures(bbox, {
        layers: ['counties']
      });
      if (features.length >= 1000) {
        return window.alert('Select a smaller number of features');
      }
      const fips = features.map((feature) => feature.properties.FIPS);
      mapRef.current.setFilter('counties-highlighted', ['in', 'FIPS', ...fips]);
    }
    mapRef.current.dragPan.enable();
  };

  const handleMouseDown = (e) => {
    if (!(e.shiftKey && e.button === 0)) return;
    mapRef.current.dragPan.disable();
    setStart(mousePos(e));
  };

  const handleMouseMove = (e) => {
    setCurrentPosition(mousePos(e));
  };

  const handleMouseUp = (e) => {
    if (start) {
      finish([start, mousePos(e)]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 27) finish();
  };

  let width;
  let height;
  let transform;

  if (start) {
      const minX = Math.min(start.x, currentPosition.x),
      maxX = Math.max(start.x, currentPosition.x),
      minY = Math.min(start.y, currentPosition.y),
      maxY = Math.max(start.y, currentPosition.y);
      transform = `translate(${minX}px, ${minY}px)`;
      width = maxX - minX;
      height = maxY - minY;
  }

  return (
    <>
      <div
        className="boxdraw"
        style={{
          position: 'absolute',
          color:'white',
          top: 0,
          left: 0,
          zIndex: 999999999,
          transform,
          width:'500px',
          height:'100%',
          pointerEvents: 'none'
        }}
      />

      <div
        ref={mapContainerRef}
        style={{width:'500px', height: '100%' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onKeyDown={handleKeyDown}
      />

      {/* <div
        className="calculation-box"
        style={{
          height: 75,
          width: 150,
          position: 'absolute',
          bottom: 40,
          left: 10,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: 15,
          textAlign: 'center',
          top:100,
          cursor:'pen'
        }}
      >
        <p style={paragraphStyle}>Click the map to draw a polygon.</p>
        <div id="calculated-area">
          {roundedArea && (
            <>
              <p style={paragraphStyle}>
                <strong>{roundedArea}</strong>
              </p>
              <p style={paragraphStyle}>square meters</p>
            </>
          )}
        </div>
      </div> */}

    </>
  );

};

export default SearchMapNew;
