
// {/* The <div> element has a child <button> element that allows keyboard interaction */}
// {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
import React, { useEffect, useRef, useState } from 'react';

import mapboxgl from 'mapbox-gl';


import css from './SearchMapNew.module.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxDraw from "@mapbox/mapbox-gl-draw";

// import * as turf from '@turf/turf';

// import 'mapbox-gl/dist/mapbox-gl.css';
// import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';



const SearchMapNew = (props) => {

  const {listings} = props;

  //console.log(listings);

  const mapContainerRef = useRef();

  const mapRef = useRef();

  const [start, setStart] = useState(false);

  const [currentPosition, setCurrentPosition] = useState(false);



  useEffect(() => {
    
   

    const geoData = [];
    const generateGeoJsonData = (listings)=>{
      if(listings !== undefined && listings.length >0){
            listings.map((itm,key)=>{
            const message = itm.attributes.title;
            const imageId = itm.images[0].attributes.variants["landscape-crop"].url;
            const latitude = itm.attributes.geolocation.lat;
            const longitude = itm.attributes.geolocation.lng;


            geoData.push(
              {
                type: 'Feature',
                properties: {
                  message: message,
                  imageId: imageId,
                  iconSize: [60, 60]
                },
                geometry: {
                  type: 'Point',
                  coordinates: [longitude, latitude]
                }
              }
            )
          })
      }
     
    };
    
    if(listings.length > 0){
      generateGeoJsonData(listings);
    }

    const geojson2 = {
      type:'FeatureCollection',
      features:geoData
    };

    console.log("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz");
    console.log(geojson2);

    const geojson = {
      type: 'FeatureCollection',
      features: geoData
    };

    const firstListing = geojson?.features[0]?.geometry?.coordinates;
    console.log("Coordinate "+firstListing);
    //Create the map
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: firstListing,
      minZoom: 2,
      zoom: 8
    });

    if(listings.length === 0 || listings === undefined){
      return;
    }

    
    













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


















    
    let popup = null;

    for (const marker of geojson.features) {

      popup = new mapboxgl.Popup({ offset: 25,className: css.popup })
      .setLngLat(marker.geometry.coordinates)
      .setText(
        marker.properties.message
      );

      const el = document.createElement('div');
      const width = marker.properties.iconSize[0];
      const height = marker.properties.iconSize[1];
      el.className = 'marker';
      el.style.backgroundImage = `url(${marker.properties.imageId})`;
      el.style.width = `${width}px`;
      el.style.height = `${height}px`;
      el.style.backgroundSize = '100%';
      el.style.display = 'block';
      el.style.border = 'none';
      el.style.borderRadius = '50%';
      el.style.cursor = 'pointer';
      el.style.padding = 0;
      el.addEventListener('click', () => {
        //window.alert(marker.properties.message);
      });

      new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates)
        .setPopup(popup)
        .addTo(mapRef.current);
    }



   // mapRef.current.boxZoom.disable();
    // const popup = new mapboxgl.Popup({
    //   closeButton: false
    // });

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

    


    mapRef.current.on('load', () => {

      mapRef.current.on('mouseenter', 'places', (e) => {
        mapRef.current.getCanvas().style.cursor = 'pointer';

        const coordinates = e.features[0].geometry.coordinates.slice();
        const description = e.features[0].properties.description;

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

       // popup.setLngLat(coordinates).setHTML(description).addTo(mapRef.current);
      });

      mapRef.current.on('mouseleave', 'places', () => {
        mapRef.current.getCanvas().style.cursor = '';
        popup.remove();
      });
    



     

    });

  }, [listings]);



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

          background: 'rgba(56, 135, 190, 0.1)',

          border: '2px solid #3887be',

          position: 'absolute',
          color:'white',

          top: 0,

          left: 0,

          zIndex: 99999,

          transform,

          width:'600px',

          height:'100%',

          pointerEvents: 'none'

        }}

      />

      <div

        ref={mapContainerRef}

        style={{width:'600px', height: '100%' }}

        onMouseDown={handleMouseDown}

        onMouseMove={handleMouseMove}

        onMouseUp={handleMouseUp}

        onKeyDown={handleKeyDown}

      />

    </>

  );

};




export default SearchMapNew;
