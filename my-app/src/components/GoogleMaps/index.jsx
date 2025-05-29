import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Polyline } from "@react-google-maps/api";
import polyline from "@mapbox/polyline";

import PlaceInfo from "../PlaceInfo";
import accommodationIcon from "../../assets/images/accommodation_pin.png";
import restaurantIcon from "../../assets/images/restaurant_pin.png";
import placeIcon from "../../assets/images/place_pin.png";
import cafeIcon from "../../assets/images/cafe_pin.png";
import addIcon from "../../assets/images/add_pin.png";
const containerStyle = {
  width: "100vw",
  height: "100vh",
};
const libraries = ["places", "geometry"];
function GoogleMaps(props) {
  const { tripData, placesInfo, setPlacesInfo, checkInDate, setCheckInDate, checkOutDate, setCheckOutDate, placeType, setPlaceType, tripDates, setTripDates, dailyTimeSlots, setDailyTimeSlots, schedule, setSchedule } = props.props;
  const [markerPosition, setMarkerPosition] = useState(null); // 마커 위치
  const [markers, setMarkers] = useState([]); // 저장된 마커
  const [mapCenter, setMapCenter] = useState(null); // 지도 중심
  const [zoom, setZoom] = useState(12); // 지도 줌
  //           state : 검색어 관련           //
  const [query, setQuery] = useState(""); // 검색어
  const [suggestions, setSuggestions] = useState([]); // 자동완성 결과
  const [isApiLoaded, setIsApiLoaded] = useState(false);

  //           function : 구글맵 API 로드         //
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
    language: "ko",
  });

  //          function : savePlace - 장소 저장         //
  // 장소 저장 핸들러
  const savePlace = useCallback(() => {
    if (!markerPosition || !placeType) {
      alert("장소와 유형을 선택해주세요.");
      return;
    }

    // 현재 일정의 총 일수 계산
    const tripDays = Object.keys(dailyTimeSlots).length;
    const accommodationLength = Object.values(placesInfo.accommodation);
    const nights = accommodationLength.map((place) => {
      if (!place.checkIn || !place.checkOut) return 0;

      const checkIn = new Date(place.checkIn);
      const checkOut = new Date(place.checkOut);
      const diffTime = Math.abs(checkOut - checkIn);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return diffDays;
    });

    const totalNights = nights.reduce((acc, curr) => acc + curr, 0);

    // 숙소 박수가 일정 일수를 초과하는지 확인
    if (placeType === "accommodation" && totalNights >= tripDays - 1) {
      alert(`숙소일정은 ${totalNights}일을 초과할 수 없습니다.`);
      return;
    }

    // 체크인 날짜와 체크아웃 날짜 비교
    if (placeType === "accommodation" && checkInDate > checkOutDate) {
      alert("체크인 날짜은 체크아웃 날짜보다 작은 날짜을 선택해주세요.");
      return;
    }
    // 체크인 날짜와 체크아웃 날짜 비교(같은날짜)
    if (placeType === "accommodation" && checkInDate === checkOutDate) {
      alert("체크인 날짜은 체크아웃 날짜보다 작은 날짜을 선택해주세요.");
      return;
    }
    // 체크인 날짜와 체크아웃 날짜 비교(겹치는 날짜)

    // 새로운 장소 데이터 생성
    const newPlace = {
      id: `${placeType}_${Date.now()}`,
      location: { lat: markerPosition.lat, lng: markerPosition.lng },
      name: markerPosition.name || "",
      address: markerPosition.address || "",
    };

    // 숙소 유형일 경우 체크인/체크아웃 데이터 추가
    if (placeType === "accommodation") {
      newPlace.checkIn = checkInDate;
      newPlace.checkOut = checkOutDate;
    }

    // 장소 데이터 업데이트
    setPlacesInfo((prevInfo) => ({
      ...prevInfo,
      [placeType]: [...(prevInfo[placeType] || []), newPlace],
    }));

    // 상태 초기화
    setMarkerPosition(null); // 마커 위치 초기화
    setPlaceType(""); // 장소 유형 초기화
    setCheckInDate(""); // 체크인 날짜 초기화
    setCheckOutDate(""); // 체크아웃 날짜 초기화

    alert("장소가 저장되었습니다!");
  }, [markerPosition, placeType, checkInDate, checkOutDate, setPlacesInfo]);

  //           function : fetchPlaceOnClick          //
  // 지도 클릭 시 위치 정보 불러오기
  const fetchPlaceOnClicknDrag = useCallback(async (event) => {
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${event.latLng.lat()},${event.latLng.lng()}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`);
      const data = await response.json();

      const { Place } = await window.google.maps.importLibrary("places");

      if (data.status === "OK" && data.results.length > 0) {
        const locationInfo = data.results[0];

        const place = new Place({
          id: data.results[0].place_id,
          requestedLanguage: "ko", // optional
        });

        // Call fetchFields, passing the desired data fields.
        await place.fetchFields({
          fields: ["displayName"],
        });
        const clickedPosition = {
          name: place.displayName,
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
          address: locationInfo.formatted_address,
        };
        return setMarkerPosition(clickedPosition);
        // 위치 정보에 따라 필요한 동작 수행
      } else {
        console.error("위치 정보를 불러오지 못했습니다.");
      }
    } catch (error) {
      console.error("에러 발생:", error);
    }
  }, []);

  //           function : fetchSuggestions - 검색어를 이용한 자동완성         //
  const fetchSuggestions = useCallback(() => {
    if (!query || !isApiLoaded) {
      setSuggestions([]);
      return;
    }

    const autocompleteService = new window.google.maps.places.AutocompleteService();

    autocompleteService.getPlacePredictions({ input: query, location: new window.google.maps.LatLng(mapCenter.lat, mapCenter.lng), radius: 5000 }, (predictions, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setSuggestions(predictions);
      } else {
        setSuggestions([]);
      }
    });
  });

  //           function : handlePlaceSelect - 자동완성 결과를 이용한 장소 선택         //
  const handlePlaceSelect = useCallback((place) => {
    setQuery(place.description);
    setSuggestions([]);
    fetchPlaceOnSearch(place.place_id);
  });

  //           function : fetchPlaceOnSearch- 장소 정보 가져오기         //
  const fetchPlaceOnSearch = useCallback((placeId) => {
    if (!placeId) {
      console.error("장소 id정보가 없습니다");
      return;
    }

    const service = new window.google.maps.places.PlacesService(document.createElement("div"));

    const request = {
      placeId: placeId,
      fields: ["name", "formatted_address", "geometry.location"],
    };

    service.getDetails(request, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const newCenter = {
          name: place.name,
          address: place.formatted_address,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        console.log("장소 정보:", newCenter);
        setMapCenter(newCenter); // 지도 중심 업데이트
        setMarkerPosition(newCenter); // 마커 위치 업데이트
        setZoom(15); // 검색된 위치로 확대
      } else {
        console.error("장소 정보를 가져오는 데 실패했습니다:", status);
      }
    });
  });

  //           function : 마커 아이콘 설정          //
  const getMarkerIcon = useCallback((type) => {
    if (type === "accommodation" || type.includes("accom")) {
      return { url: accommodationIcon, scaledSize: new window.google.maps.Size(40, 40) };
    }
    if (type === "restaurant" || type.includes("rest")) {
      return { url: restaurantIcon, scaledSize: new window.google.maps.Size(40, 40) };
    }
    if (type === "attraction" || type.includes("attr")) {
      return { url: placeIcon, scaledSize: new window.google.maps.Size(40, 40) };
    }
    if (type === "cafe" || type.includes("cafe")) {
      return { url: cafeIcon, scaledSize: new window.google.maps.Size(40, 40) };
    }
    return { url: addIcon, scaledSize: new window.google.maps.Size(40, 40) };
  });

  const [route, setRoute] = useState([]); // 경로 데이터
  // 경로 데이터를 OpenRouteService에서 가져오는 함수
  const fetchRoute = useCallback(async () => {
    if (!schedule || schedule.length < 2) {
      alert("경로를 생성하려면 두 개 이상의 장소가 필요합니다.");
      return;
    }

    try {
      const apiKey = "5b3ce3597851110001cf6248631846b4c63c4b48a00a1b942d468684"; // 여기에 OpenRouteService API 키를 입력하세요.

      const coordinates = Object.entries(schedule).flatMap(([type, places]) => places.map((place) => [place.location.lng, place.location.lat]));

      const response = await fetch("https://api.openrouteservice.org/v2/directions/driving-car", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ coordinates }),
      });

      if (!response.ok) {
        throw new Error("경로 데이터를 가져오는 데 실패했습니다.");
      }

      const data = await response.json();
      console.log("Response Data:", data.routes[0]);
      // Encoded polyline 데이터
      const encodedPolyline = data.routes[0].geometry;

      // Polyline 디코딩
      const decodedCoordinates = polyline.decode(encodedPolyline);

      // 'routes[0].segments[0].steps'를 통해 경로를 얻음
      const routeCoordinates = decodedCoordinates.map(([lat, lng]) => ({
        lat,
        lng,
      }));
      console.log("Decoded Route Coordinates:", routeCoordinates);

      // 지도 중심 이동 (예: Leaflet.js)
      setMapCenter(routeCoordinates[0]);
      setRoute(routeCoordinates);
    } catch (error) {
      console.error("경로 데이터를 가져오는 중 오류 발생:", error);
    }
  }, [schedule, route]);

  //          Effect : 지도 센터위치 조정         //
  // Match the map center with the trip's city
  useLayoutEffect(() => {
    const citys = JSON.parse(localStorage.getItem("citys")) || [];
    const cityCenter = citys.find((city) => city.id === tripData.city)?.center;
    if (cityCenter) setMapCenter(cityCenter);
  }, [tripData.city]);

  //           effect : google map api로드 확인          //
  useEffect(() => {
    // Google Maps API 로드 확인
    if (window.google && window.google.maps && window.google.maps.places) {
      setIsApiLoaded(true);
    } else {
      const interval = setInterval(() => {
        if (window.google && window.google.maps && window.google.maps.places) {
          setIsApiLoaded(true);
          clearInterval(interval);
        }
      }, 100); // 100ms 간격으로 확인
    }
  }, []);

  //           Effect : placesInfo가 변경될 때마다 마커 업데이트           //
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

  //           effect : 검색어를 이용한 자동완성          //
  useEffect(() => {
    const timeoutId = setTimeout(fetchSuggestions, 300); // 디바운싱
    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <>
      {isLoaded ? (
        <>
          <div className="map-group">
            <div className="search-container">
              <input type="text" value={query} placeholder="장소를 검색하세요..." onChange={(e) => setQuery(e.target.value)} className="search-input map-control" />
              {/* 자동완성 결과 */}
              {suggestions.length > 0 && (
                <ul className="search-results">
                  {suggestions.map((place) => (
                    <li key={place.place_id} onClick={() => handlePlaceSelect(place)} className="result">
                      {place.description}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={zoom}
            onClick={fetchPlaceOnClicknDrag}
            options={{
              disableDefaultUI: true,
              zoomControl: false,
            }}
          >
            {/* 저장된 마커들 */}
            {markers.map((marker, index) => (
              <Marker key={marker.id} position={marker.location} icon={getMarkerIcon(marker.id)} title={marker.name || marker.address} />
            ))}
            {/* 임시 마커(아직 저장 안 된 위치) */}
            {markerPosition && (
              <>
                <Marker clickable={false} draggable={true} onDragEnd={fetchPlaceOnClicknDrag} position={markerPosition} icon={getMarkerIcon(addIcon)} title="새 장소">
                  <InfoWindow
                    position={markerPosition}
                    options={{
                      pixelOffset: new window.google.maps.Size(0, -40),
                      disableAutoPan: true,
                    }}
                  >
                    <PlaceInfo
                      markerPosition={markerPosition}
                      setMarkerPosition={setMarkerPosition}
                      setPlaceType={setPlaceType}
                      setCheckInDate={setCheckInDate}
                      setCheckOutDate={setCheckOutDate}
                      placeType={placeType}
                      checkInDate={checkInDate}
                      checkOutDate={checkOutDate}
                      dailyTimeSlots={dailyTimeSlots}
                      setDailyTimeSlots={setDailyTimeSlots}
                      savePlace={savePlace}
                    />
                  </InfoWindow>
                </Marker>
              </>
            )}
            {/* 경로 표시 */}
            {route.length > 0 && (
              <Polyline
                path={route}
                options={{
                  strokeColor: "#FF0000",
                  strokeOpacity: 0.8,
                  strokeWeight: 4,
                }}
              />
            )}
          </GoogleMap>
          <button
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1,
            }}
            onClick={fetchRoute}
          >
            루트 생성
          </button>
        </>
      ) : (
        <div>Loading Map...</div>
      )}
    </>
  );
}

export default GoogleMaps;
