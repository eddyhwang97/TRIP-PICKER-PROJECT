import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
  Polyline,
} from "@react-google-maps/api";
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
const colors = [
  "#FF0000",
  "#0000FF",
  "#00FF00",
  "#FFA500",
  "#800080",
  "#00FFFF",
  "#FFC0CB",
];
function GoogleMaps({
  apiKey,
  tripData,
  placesInfo,
  setPlacesInfo,
  checkInDate,
  setCheckInDate,
  checkOutDate,
  setCheckOutDate,
  placeType,
  setPlaceType,
  tripDates,
  setTripDates,
  dailyTimeSlots,
  setDailyTimeSlots,
  schedule,
  setSchedule,
  route,
  setRoute,
  routes,
  mapCenter,
  setMapCenter,
  // ...필요한 추가 props
}) {
  const [markerPosition, setMarkerPosition] = useState(null); // 마커 위치
  const [markers, setMarkers] = useState([]); // 저장된 마커

  const [zoom, setZoom] = useState(12); // 지도 줌
  //           state : 검색어 관련           //
  const [query, setQuery] = useState(""); // 검색어
  const [suggestions, setSuggestions] = useState([]); // 자동완성 결과

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
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
    if (placeType === "accommodation" && checkInDate >= checkOutDate) {
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

  //           function : fetchPlaceOnClicknDrag          //
  // 지도 클릭 시 위치 정보 불러오기
  const fetchPlaceOnClicknDrag = useCallback(async (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    try {
      // const API_URL = process.env.REACT_APP_API_SERVER || "http://localhost:3001";
      const response = await fetch(`/api/geocode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lat, lng }),
      });

      const data = await response.json();
      console.log(data);
      if (data.status === "OK" && data.results.length > 0) {
        const locationInfo = data.results[0];

        // 필요에 따라 추가적으로 Google Maps JS SDK로 상세 정보 얻기
        const service = new window.google.maps.places.PlacesService(
          document.createElement("div")
        );
        service.getDetails(
          {
            placeId: locationInfo.place_id,
            fields: ["name", "formatted_address", "geometry.location"],
          },
          (place, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              const clickedPosition = {
                name: place.name,
                lat,
                lng,
                address: place.formatted_address,
              };
              setMarkerPosition(clickedPosition);
            } else {
              // fallback: Geocode 결과만 사용
              setMarkerPosition({
                name: "",
                lat,
                lng,
                address: locationInfo.formatted_address,
              });
            }
          }
        );
      } else {
        console.error("위치 정보를 불러오지 못했습니다.");
      }
    } catch (error) {
      console.error("에러 발생:", error);
    }
  }, []);

  //           function : fetchSuggestions - 검색어를 이용한 자동완성         //
  const fetchSuggestions = useCallback(() => {
    if (!query || !isLoaded) {
      setSuggestions([]);
      return;
    }

    const autocompleteService =
      new window.google.maps.places.AutocompleteService();

    autocompleteService.getPlacePredictions(
      {
        input: query,
        location: new window.google.maps.LatLng(mapCenter.lat, mapCenter.lng),
        radius: 5000,
      },
      (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setSuggestions(predictions);
        } else {
          setSuggestions([]);
        }
      }
    );
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

    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );

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
      return { url: cafeIcon, scaledSize: new window.google.maps.Size(40, 40) };
    }
    return { url: addIcon, scaledSize: new window.google.maps.Size(40, 40) };
  });

  //          Effect : 지도 센터위치 조정         //
  // Match the map center with the trip's city
  useLayoutEffect(() => {
    const citys = JSON.parse(localStorage.getItem("citys")) || [];
    const cityCenter = citys.find((city) => city.id === tripData.city)?.center;
    if (cityCenter) setMapCenter(cityCenter);
  }, [tripData.city]);

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

  if (!isLoaded) return <div>지도 로딩중...</div>;

  return (
    <>
      <div className="map-group">
        <div className="search-container">
          <input
            type="text"
            value={query}
            placeholder="장소를 검색하세요..."
            onChange={(e) => setQuery(e.target.value)}
            className="search-input map-control"
          />
          {suggestions.length > 0 && (
            <ul className="search-results">
              {suggestions.map((place) => (
                <li
                  key={place.place_id}
                  onClick={() => handlePlaceSelect(place)}
                  className="result"
                >
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
        {markers.map((marker, index) => (
          <Marker
            key={marker.id}
            position={marker.location}
            icon={getMarkerIcon(marker.id)}
            title={marker.name || marker.address}
          />
        ))}
        {markerPosition && (
          <>
            <Marker
              clickable={false}
              draggable={true}
              onDragEnd={fetchPlaceOnClicknDrag}
              position={markerPosition}
              icon={getMarkerIcon(addIcon)}
              title="새 장소"
            >
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
        {Array.isArray(route) &&
        route.length > 0 &&
        !Array.isArray(route[0]) ? (
          <Polyline
            path={route}
            options={{
              strokeColor: "#FF0000",
              strokeOpacity: 0.8,
              strokeWeight: 4,
            }}
          />
        ) : (
          routes &&
          routes.map((r, idx) => (
            <Polyline
              key={idx}
              path={r}
              options={{
                strokeColor: colors[idx % colors.length],
                strokeOpacity: 0.8,
                strokeWeight: 4,
              }}
            />
          ))
        )}
      </GoogleMap>
    </>
  );
}

export default GoogleMaps;
