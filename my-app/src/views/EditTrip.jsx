import React, { useState, useRef } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Autocomplete,
  Marker,
} from "@react-google-maps/api";

import "./css/editTrip.scss";
import { useLocation } from "react-router-dom";

import accommodationIcon from "../assets/images/accommodation_pin.png";
import restaurantIcon from "../assets/images/restaurant_pin.png";
import placeIcon from "../assets/images/place_pin.png";

const containerStyle = {
  width: "100vw",
  height: "100vh",
};

function EditTrip(props) {
  const location = useLocation();
  const cityLocation = location.state.cityLocation;
  const [mapCenter, setMapCenter] = useState(cityLocation.center);
  const [zoom, setZoom] = useState(12); // 초기 줌 레벨 설정
  const [autocomplete, setAutocomplete] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null); // 초기값을 null로 설정
  const [placeType, setPlaceType] = useState(""); // 장소 유형 상태 추가
  const [markers, setMarkers] = useState([]); // 모든 마커 저장
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

  const onMapClick = (event) => {
    const clickedPosition = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };

    setMarkerPosition(clickedPosition); // 마커 위치 업데이트
  };

  const savePlace = () => {
    if (!markerPosition || !placeType) {
      alert("장소와 유형을 선택해주세요.");
      return;
    }

    const newMarker = {
      position: markerPosition,
      type: placeType,
    };

    setMarkers((prevMarkers) => [...prevMarkers, newMarker]); // 마커 추가
    setMarkerPosition(null); // 마커 위치 초기화
    setPlaceType(""); // 장소 유형 초기화

    // 로컬스토리지에 저장
    const savedPlaces = JSON.parse(localStorage.getItem("places")) || [];
    savedPlaces.push(newMarker);
    localStorage.setItem("places", JSON.stringify(savedPlaces));
    alert("장소가 저장되었습니다!");
  };

  const getMarkerIcon = (type) => {
    switch (type) {
      case "accommodation":
        return {
          url: accommodationIcon,
          scaledSize: new window.google.maps.Size(40, 40),
        };
      case "restaurant":
        return {
          url: restaurantIcon,
          scaledSize: new window.google.maps.Size(40, 40),
        };
      case "attraction":
        return {
          url: placeIcon,
          scaledSize: new window.google.maps.Size(40, 40),
        };
      default:
        return {
          url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
          scaledSize: new window.google.maps.Size(40, 40),
        };
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
            <div className="controls">
              <select
                value={placeType}
                onChange={(e) => setPlaceType(e.target.value)}
              >
                <option value="">장소 유형 선택</option>
                <option value="accommodation">숙소</option>
                <option value="restaurant">식당</option>
                <option value="attraction">관광지</option>
              </select>
              <button onClick={savePlace}>저장</button>
            </div>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={mapCenter}
              zoom={zoom}
              onClick={onMapClick} // 지도 클릭 이벤트 추가
            >
              {/* 저장된 마커 렌더링 */}
              {markers.map((marker, index) => (
                <Marker
                  key={index}
                  position={marker.position}
                  icon={getMarkerIcon(marker.type)} // 커스텀 마커 아이콘
                />
              ))}
              {/* 현재 선택된 마커 */}
              {markerPosition && (
                <Marker
                  position={markerPosition}
                  icon="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                />
              )}
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