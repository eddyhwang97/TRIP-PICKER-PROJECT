import React, { useState, useRef } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Autocomplete,
  Marker,
} from "@react-google-maps/api";
import DatePicker from "react-datepicker"; // 캘린더 컴포넌트
import "react-datepicker/dist/react-datepicker.css"; // 스타일 임포트

import "./css/editTripSidebar.scss";
import { useLocation, useNavigate } from "react-router-dom";

const containerStyle = {
  width: "100vw",
  height: "100vh",
};

function EditTrip(props) {
  const location = useLocation();
  const cityLocation =
    location.state && location.state.cityLocation
      ? location.state.cityLocation
      : {
          center: { lat: 37.5665, lng: 126.978 }, // 기본값 설정
        };
  console.log(cityLocation);
  const [mapCenter, setMapCenter] = useState(cityLocation.center);
  const [zoom, setZoom] = useState(12); // 초기 줌 레벨 설정
  const [autocomplete, setAutocomplete] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null); // 초기값을 null로 설정
  const inputRef = useRef(null);
  // 사이드바 관련 변수 //
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showList, setShowList] = useState(true); // 리스트 애니메이션을 위한 상태

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

  // 사이드바 관련 변수 //
  const sampleList = [
    { id: 1, name: "장소이름", address: "장소주소", category: "숙소" },
    { id: 2, name: "장소이름", address: "장소주소", category: "음식점" },
    { id: 3, name: "장소이름", address: "장소주소", category: "카페" },
    { id: 4, name: "장소이름", address: "장소주소", category: "관광" },
    { id: 5, name: "장소이름", address: "장소주소", category: "관광" },
  ];

  const categoryColors = {
    숙소: "category-red",
    음식점: "category-blue",
    카페: "category-yellow",
    관광: "category-green",
  };

  // 캘린더
  const handleDatePickerClick = () => {
    setShowList(false); // 리스트 사라지기 시작
    setTimeout(() => setShowDatePicker(true), 300); // 애니메이션 끝난 후 날짜 선택 UI 표시
  };

  return (
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
            onClick={onMapClick} // 지도 클릭 이벤트 추가
          >
            {/* 마커 조건부 렌더링 */}
            {markerPosition && <Marker position={markerPosition} />}
          </GoogleMap>
        </>
      ) : (
        <div>Loading Map...</div>
      )}

      <div className="sidebar">
        <div className="sidebar-header">
          <h2 className={showDatePicker ? "date-title" : ""}>
            {showDatePicker ? "날짜 선택하기" : "리스트"}
          </h2>
          <button className="dashboard-button">Dash Board</button>
        </div>

        <ul className={`place-list ${showList ? "" : "list-hide"}`}>
          {sampleList.map((item) => (
            <li key={item.id} className="place-item">
              <img
                src="https://via.placeholder.com/50"
                alt="장소"
                className="place-image"
              />
              <div className="place-info">
                <div className="place-name-category">
                  <span className="place-name">{item.name}</span>
                  <span
                    className={`place-category ${
                      categoryColors[item.category]
                    }`}
                  >
                    {item.category}
                  </span>
                </div>
                <p className="place-address">{item.address}</p>
              </div>
              <button className="delete-button">삭제</button>
            </li>
          ))}
        </ul>

          
        <button className="date-button" >
          날짜 선택하기
        </button>

        {/* {날짜 선택 UI
        {showDatePicker && (
          <div
            className={`date-picker-container ${showDatePicker ? "show" : ""}`}
          >
            <h3>날짜를 선택해주세요</h3>
            <DatePicker
              selected={new Date()}
              onChange={(date) => console.log(date)}
            />
          </div>
        )}} */}
      </div>
    </div>
  );
}

export default EditTrip;
