import React, { useState, useRef, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Autocomplete, Marker } from "@react-google-maps/api";
import { useLocation } from "react-router-dom";
import { useStore } from "../stores/store.API";

// css
import "./css/editTrip.scss";

// components
import Sidebar from "../components/Sidebar";
import accommodationIcon from "../assets/images/accommodation_pin.png";
import restaurantIcon from "../assets/images/restaurant_pin.png";
import placeIcon from "../assets/images/place_pin.png";
import cafeIcon from "../assets/images/cafe_pin.png";
import addIcon from "../assets/images/add_pin.png";

const containerStyle = {
  width: "100vw",
  height: "100vh",
};

function EditTrip(props) {
  const location = useLocation();
  // 유저 정보
  const user = useStore((state) => state.user);
  // 시티 정보 (메인, 대시보드 에서 넘어옴)
  const cityLocation = location.state.cityLocation;
  // 여행 정보 (대시보드에서 넘어옴)
  const tripData = location.state.tripData === undefined ? null : location.state.tripData;
  // 시티 센터 값 설정
  const [mapCenter, setMapCenter] = useState(cityLocation.center);
  const [zoom, setZoom] = useState(12); // 초기 줌 레벨 설정
  const [autocomplete, setAutocomplete] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null); // 초기값을 null로 설정
  const [placeType, setPlaceType] = useState(""); // 장소 유형 상태 추가
  const [markers, setMarkers] = useState([]); // 모든 마커 저장
  const inputRef = useRef(null);

  // 장소
  const [places, setPlaces] = useState([]);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const onLoadAutocomplete = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };
  //           trip 정보 세션에 저장          //
  const setTripInStorage = () => {
    const trips = JSON.parse(localStorage.getItem("trips"));
    const tripId = trips.length < 10 ? `trip00${trips.length + 1}` : trips.length > 10 ? `trip0${trips.length + 1}` : `trip${trips.length + 1}`;

    // 1. 로그인 상태일 경우
    if (user !== null) {
      // (1) 대시보드에서 넘어올 경우

      // (2) 메인에서 넘어올 경우
      if (tripData !== null) {
        const newTrip = {
          id: tripData.id,
          userId: user.id,
          title: tripData.title,
          startDate: tripData.startDate,
          endDate: tripData.endDate,
          city: tripData.city,
          accommodation: tripData.accommodation,
          attraction: tripData.attraction,
          restaurant: tripData.restaurant,
          cafe: tripData.cafe,
          groupedByDate: tripData.groupedByDate,
          dailyTimeSlots: tripData.dailyTimeSlots,
        };
        sessionStorage.setItem("newtrip", JSON.stringify(newTrip));
      } else if (tripData === null) {
        const newTrip = {
          id: tripId,
          userId: user.id,
          title: null,
          startDate: null,
          endDate: null,
          city: cityLocation.id,
          accommodation: [],
          attraction: [],
          restaurant: [],
          cafe: [],
          groupedByDate: {},
          dailyTimeSlots: {},
        };
        sessionStorage.setItem("newtrip", JSON.stringify(newTrip));
      }
    }
    // 2. 로그인 상태 아닐 경우
    if (user === null) {
      const newTrip = {
        id: "trip001",
        userId: "unknown-host",
        title: null,
        startDate: null,
        endDate: null,
        city: cityLocation.id,
        accommodation: [],
        attraction: [],
        restaurant: [],
        cafe: [],
        groupedByDate: {},
        dailyTimeSlots: {},
      };
      sessionStorage.setItem("newtrip", JSON.stringify(newTrip));
    }

    // 2. 대쉬보드에서 들어왔을 때
  };

  // 대쉬보드에서 들어왔을 때

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
      case "cafe":
        return {
          url: cafeIcon,
          scaledSize: new window.google.maps.Size(40, 40),
        };
      default:
        return {
          url: addIcon,
          scaledSize: new window.google.maps.Size(40, 40),
        };
    }
  };

  useEffect(() => {
    // 세션 유저 정보
    setTripInStorage();
    //
  }, []);

  return (
    <>
      <div className="container">
        {isLoaded ? (
          <>
            <div className="map-group">
              <Autocomplete onLoad={onLoadAutocomplete} onPlaceChanged={onPlaceChanged}>
                <input className="map-control" type="text" placeholder="주소 검색" ref={inputRef} />
              </Autocomplete>
            </div>
            <div className="place-control">
              <select value={placeType} onChange={(e) => setPlaceType(e.target.value)}>
                <option value="">장소 유형</option>
                <option value="accommodation">숙소</option>
                <option value="attraction">관광지</option>
                <option value="restaurant">식당</option>
                <option value="cafe">카페</option>
              </select>
              <button onClick={savePlace}>저장</button>
            </div>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={mapCenter}
              zoom={zoom}
              onClick={onMapClick}
              options={{
                disableDefaultUI: true,
                zoomControl: false,
              }}
            >
              {markers.map((marker, index) => (
                <Marker key={index} position={marker.position} icon={getMarkerIcon(marker.type)} />
              ))}
              {markerPosition && (
                <Marker
                  position={markerPosition}
                  icon={{
                    url: addIcon,
                    scaledSize: new window.google.maps.Size(40, 40),
                  }}
                />
              )}
            </GoogleMap>
          </>
        ) : (
          <div>Loading Map...</div>
        )}
        <Sidebar places={places} />
      </div>
    </>
  );
}

export default EditTrip;
