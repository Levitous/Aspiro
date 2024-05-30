'use client';
import React from "react";
import { useLoadScript, GoogleMap } from '@react-google-maps/api';
import {useState} from "react";
import { useMemo } from 'react';
import './css/map.css';

export default function Map () {
  const [address, setAddress] = useState("");
  const libraries = useMemo(() => ['places'], []);
  const mapCenter = useMemo(
    () => ({ lat: 39, lng: -97 }),
    []
  );

  const mapOptions = useMemo(
    () => ({
      clickableIcons: true,
      scrollwheel: true,
      streetViewControl: false,
      fullscreenControl: false,
    }),
    []
  );

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
    libraries: libraries,
  });
  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  const geocoder = new google.maps.Geocoder();
  const getAddress = (e) => {
    geocoder.geocode({
      'latLng': e.latLng
    }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          setAddress(results[0].formatted_address);
        }
      }
    });
  }

  return (
    <GoogleMap id="map"
      options={mapOptions}
      zoom={4}
      center={mapCenter}
      mapTypeId={google.maps.MapTypeId.ROADMAP}
      mapTypeControl={true}
      mapContainerStyle={{width: '100%', height: '60vh'}}
      onLoad={() => console.log('Map Component Loaded...')}
      onClick={getAddress}
    />
  );
};

// divider

