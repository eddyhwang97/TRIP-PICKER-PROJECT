import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
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

// 컴포넌트 외부에 상수로 선언
const libraries = ["places"];

function EditTrip(props) {
  // 여행 정보
  //           hooks          //
  const location = useLocation();
  const [mapCenter, setMapCenter] = useState(null);
  const [zoom, setZoom] = useState(12); // 초기 줌 레벨 설정
  const [autocomplete, setAutocomplete] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null); // 초기값을 null로 설정
  const [placeType, setPlaceType] = useState(""); // 장소 유형 상태 추가
  const [markers, setMarkers] = useState([]); // 모든 마커 저장
  const inputRef = useRef(null);

  //           variables : 여행정보 셋팅 및 저장 상태 변수 //
  const tripData = location.state.tripData;
  // PlaceList
  const [placesInfo, setPlacesInfo] = useState({ accommodation: tripData.accommodation, attraction: tripData.attraction, restaurant: tripData.restaurant, cafe: tripData.cafe });
  // DateSelection
  const [tripDates, setTripDates] = useState([tripData.startDate, tripData.endDate]);
  // TimeSelection
  const [dailyTimeSlots, setDailyTimeSlots] = useState(tripData.dailyTimeSlots);
  // ScheduleCreation
  const [schedule, setSchedule] = useState(tripData.schedule);

  //           function           //
  // 구글맵 API 로드
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
    language: "ko",
  });
  //         센터 정보 셋팅          //
  const matchMapCenter = () => {
    const tripDataCity = tripData.city;
    const citys = JSON.parse(localStorage.getItem("citys"));
    const cityCenter = citys.find((city) => city.id === tripDataCity).center;
    setMapCenter(cityCenter);
  };
  //           trip 정보 세션에 저장          //
  const setTripInfoInSessionStorage = () => {
    sessionStorage.setItem("trip", JSON.stringify(tripData));
  };
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

    const newPlace = {
      id: `${placeType}_${Date.now()}`,
      location: markerPosition,
      name: markerPosition.name || "",
      address: markerPosition.address || "",
    };

    setPlacesInfo((prevInfo) => ({
      ...prevInfo,
      [placeType]: [...(prevInfo[placeType] || []), newPlace],
    }));

    setMarkerPosition(null); // 마커 위치 초기화
    setPlaceType(""); // 장소 유형 초기화

    alert("장소가 저장되었습니다!");
  };

  //           useEffect : placesInfo가 변경될 때마다 마커 업데이트          //
  useEffect(() => {
    const newMarkers = [];

    // 각 장소 유형별로 마커 생성
    Object.entries(placesInfo).forEach(([type, places]) => {
      places.map((place) => {
        newMarkers.push(place);
      });
    });
    setMarkers(newMarkers);
  }, [placesInfo]);

  //           function : 마커 아이콘 설정          //
  const getMarkerIcon = (type) => {
    if (type === "accommodation" || type.includes("accom")) {
      return {
        url: accommodationIcon,
        scaledSize: new window.google.maps.Size(40, 40),
      };
    }
    if (type === "restaurant" || type.includes("rest")) {
      return {
        url: restaurantIcon,
        scaledSize: new window.google.maps.Size(40, 40),
      };
    }
    if (type === "attraction" || type.includes("attr")) {
      return {
        url: placeIcon,
        scaledSize: new window.google.maps.Size(40, 40),
      };
    }
    if (type === "cafe" || type.includes("cafe")) {
      return {
        url: cafeIcon,
        scaledSize: new window.google.maps.Size(40, 40),
      };
    }
    return {
      url: addIcon,
      scaledSize: new window.google.maps.Size(40, 40),
    };
  };

  //           useLayoutEffect          //
  useLayoutEffect(() => {
    // 지역 센터 정보 저장
    matchMapCenter();
    // 트립정보 세션에 저장
    setTripInfoInSessionStorage();
  }, []);
  //           useEffect           //
  useEffect(() => {
    console.log("placesInfo", placesInfo, "tripDates", tripDates, "dailyTimeSlots", dailyTimeSlots, "schedule", schedule);
  }, [placesInfo, tripDates, dailyTimeSlots, schedule]);

  //           전달할 props           //
  const sidebarProps = {
    placesInfo,
    setPlacesInfo,
    tripDates,
    setTripDates,
    dailyTimeSlots,
    setDailyTimeSlots,
    schedule,
    setSchedule,
  };

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
                <Marker
                  key={marker.id}
                  position={marker.location}
                  icon={getMarkerIcon(marker.id)}
                  title={marker.name || marker.address} // 마커에 마우스를 올리면 이름 또는 주소 표시
                />
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
        <Sidebar sidebarProps={sidebarProps} />
      </div>
    </>
  );
}

export default EditTrip;
