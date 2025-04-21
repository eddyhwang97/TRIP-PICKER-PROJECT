import React from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

import "./css/editTrip.scss";

const containerStyle = {
  width: '100vw',
  height: '100vh'
};

const center = {
  lat: 37.5665, // 서울 중심
  lng: 126.9780
};

function EditTrip(props) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyCxy20L2MbSAveA8dvQsaxCngzcmOLmS8s'
  });

  return (
    <>
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={12}
        >
        </GoogleMap>
      ) : (
        <div>Loading Map...</div>
      )}
    </>
  );
}

export default EditTrip;
