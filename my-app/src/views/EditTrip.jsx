import React, { useState, useRef } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Autocomplete,
  Marker,
} from "@react-google-maps/api";

import "./css/editTrip.scss";

const containerStyle = {
  width: "100vw",
  height: "100vh",
};

const center = {
  lat: 37.5665, // 서울 중심
  lng: 126.978,
};

function EditTrip(props) {
  const [mapCenter, setMapCenter] = useState(center);
  const [zoom, setZoom] = useState(12); // 초기 줌 레벨 설정
  const [autocomplete, setAutocomplete] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null); // 초기값을 null로 설정
  const inputRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const onLoadAutocomplete = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place && place.geometry) {
        const newCenter = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setMapCenter(newCenter); // 지도 중심 업데이트
        setMarkerPosition(newCenter); // 마커 위치 업데이트
        setZoom(15); // 검색된 위치로 확대
      } else {
        alert("위치 정보를 가져올 수 없습니다.");
      }
    }
  };

  return (
    <>
      <div className="container">
        {isLoaded ? (
          <>
            <div className="map-group">
              <Autocomplete
                onLoad={onLoadAutocomplete}
                onPlaceChanged={onPlaceChanged}
              >
                <input
                  className="map-control"
                  type="text"
                  placeholder="주소 검색"
                  ref={inputRef}
                />
              </Autocomplete>
            </div>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={mapCenter}
              zoom={zoom}
            >
              {/* 마커 조건부 렌더링 */}
              {markerPosition && <Marker position={markerPosition} />}
            </GoogleMap>
          </>
        ) : (
          <div>Loading Map...</div>
        )}
      </div>
    </>
  );
}

export default EditTrip;
