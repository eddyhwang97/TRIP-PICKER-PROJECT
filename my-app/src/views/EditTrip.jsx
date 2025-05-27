import React, { useCallback, useState, useRef, useEffect, useLayoutEffect } from "react";
import { Loader, GoogleMap, useJsApiLoader, Autocomplete, Marker, computeDistanceBetween, DirectionsRenderer, InfoWindow } from "@react-google-maps/api";
import { useLocation } from "react-router-dom";
import { kmeans } from "ml-kmeans";
// css
import "./css/editTrip.scss";

// components
import Sidebar from "../components/Sidebar";
import accommodationIcon from "../assets/images/accommodation_pin.png";
import restaurantIcon from "../assets/images/restaurant_pin.png";
import placeIcon from "../assets/images/place_pin.png";
import cafeIcon from "../assets/images/cafe_pin.png";
import addIcon from "../assets/images/add_pin.png";
import PlaceInfo from "../components/PlaceInfo";

const containerStyle = {
  width: "100vw",
  height: "100vh",
};
const libraries = ["places", "geometry"];

function EditTrip(props) {
  //           state : 여행정보 셋팅 및 저장 상태 변수 //
  const location = useLocation();
  const [mapCenter, setMapCenter] = useState(null);
  const [zoom, setZoom] = useState(12);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [placeType, setPlaceType] = useState("attraction");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [markers, setMarkers] = useState([]);
  const [directions, setDirections] = useState(null);

  //           state : 여행정보 셋팅 및 저장 상태 변수 //
  const tripData = location.state.tripData;
  // PlaceList
  const [placesInfo, setPlacesInfo] = useState({ accommodation: tripData.accommodation, attraction: tripData.attraction, restaurant: tripData.restaurant, cafe: tripData.cafe });
  // DateSelection
  const [tripDates, setTripDates] = useState([tripData.startDate, tripData.endDate]);
  // TimeSelection
  const [dailyTimeSlots, setDailyTimeSlots] = useState(tripData.dailyTimeSlots);
  // ScheduleCreation
  const [schedule, setSchedule] = useState(tripData.groupedByDate);
  useEffect(() => {
    setCheckInDate(Object.keys(dailyTimeSlots)[0]);
    setCheckOutDate(Object.keys(dailyTimeSlots)[1]);
  }, [dailyTimeSlots]);

  //           function : 구글맵 API 로드         //
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
    language: "ko",
  });
  //          function : matchMapCenter          //
  // 지역 센터 정보 저장
  const matchMapCenter = () => {
    const tripDataCity = tripData.city;
    const citys = JSON.parse(localStorage.getItem("citys"));
    const cityCenter = citys.find((city) => city.id === tripDataCity).center;
    setMapCenter(cityCenter);
  };

  //          function : 세션 스토리지에 여행정보 저장          //
  // 여행정보 세션에 저장
  const setTripInfoInSessionStorage = () => {
    const trip = tripData;
    sessionStorage.setItem("trip", JSON.stringify(trip));
  };

  //          function : savePlace          //
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

    // 숙소 유형일 때 체크인/체크아웃이 입력되지 않으면 경고
    if (placeType === "accommodation" && (!checkInDate || !checkOutDate)) {
      alert("숙소의 체크인 및 체크아웃 날짜를 입력해주세요.");
      return;
    }

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
  }, [markerPosition, placeType, checkInDate, checkOutDate, dailyTimeSlots, placesInfo, setPlacesInfo, setMarkerPosition, setPlaceType, setCheckInDate, setCheckOutDate]);
  useEffect(() => {}, [placesInfo]);

  //           function : useEffect           //
  // placesInfo가 변경될 때마다 마커 업데이트          //
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

  //           function : fetchLocationInfoOnMapClick          //
  // 지도 클릭 시 위치 정보 불러오기
  const fetchLocationInfoOnMapClick = useCallback(async (event, setLocationInfo) => {
    const clickedPosition = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };

    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${clickedPosition.lat},${clickedPosition.lng}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`);
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

        setLocationInfo(locationInfo, place.displayName);
        // 위치 정보에 따라 필요한 동작 수행
      } else {
        console.error("위치 정보를 불러오지 못했습니다.");
      }
    } catch (error) {
      console.error("에러 발생:", error);
    }
  }, []);

  //           function : onMapClick          //
  // 지도 클릭 핸들러에 추가
  const getPlaceInfo = useCallback(
    (event) => {
      const setLocationInfo = (locationInfo, displayName) => {
        if (locationInfo) {
          const clickedPosition = {
            name: displayName,
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
            address: locationInfo.formatted_address,
          };

          setMarkerPosition(clickedPosition);
        }
        return;
      };
      fetchLocationInfoOnMapClick(event, setLocationInfo);
    },
    [markerPosition]
  );

  //           function : 마커 아이콘 설정          //
  const getMarkerIcon = (type) => {
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
  };

  //          function : 클러스터링 및 일정 생성          //
  const handelClusterization = async () => {
    // 1. k-means 클러스터링 변수
    // 1.1 클러스터링에 사용할 장소 배열
    const places = Object.entries(placesInfo)
      .map(([type, places]) => (type !== "accommodation" ? places : []))
      .flat();
    // 1.2 클러스터링에 사용할 장소 데이터
    const locations = places.map((place) => [place.location.lat, place.location.lng, place.checkInDate || 0]);
    // 1.3 클러스터링에 사용할 일정 데이터 - k값
    const numberOfDays = Object.keys(dailyTimeSlots).length;
    // 1.3 클러스터링에 사용할 장소 데이터 - 숙소데이터
    const accommodationPlaces = placesInfo.accommodation || [];

    // 2. kmeans 클러스터링
    const clusters = kmeans(locations, numberOfDays);
    console.log("K-means 클러스터링 결과:", clusters);

    // 3. 클러스터링 결과 데이터로 중심값과 장소 정보 매핑
    // 클러스터링 결과에서 중심점과 해당 클러스터에 속하는 장소들을 매핑
    const clusterData = clusters.centroids.map((centroid, clusterIndex) => {
      console.log("centroid", centroid, "clusterIndex", clusterIndex);
      const clusterPlaces = places.filter((_, index) => clusters.clusters[index] === clusterIndex);

      return {
        centroid: {
          lat: centroid[0],
          lng: centroid[1],
        },
        places: clusterPlaces,
      };
    });

    console.log("Cluster Data:", clusterData);

    // 4. 일정 기반으로 배열 생성후 일정에 맞는 숙소 넣기
    const groupedByDate = {};
    for (let i = 0; i < numberOfDays; i++) {
      const date = Object.keys(dailyTimeSlots)[i];
      groupedByDate[date] = {
        accommodation: [null, null],
        places: [],
      };
    }
    accommodationPlaces.forEach((place) => {
      const checkInDate = place.checkIn;
      const checkOutDate = place.checkOut;

      // 체크인 날짜 accommodation[0]에 저장
      if (groupedByDate[checkInDate]) {
        groupedByDate[checkInDate].accommodation[0] = place || null;
      }
      // 체크아웃 날짜 accommodation[1]에 저장
      if (groupedByDate[checkOutDate]) {
        groupedByDate[checkOutDate].accommodation[1] = place || null;
      }
    });

    // 5. 클러스터링 중심과 숙소 위치 정보를 비교하여 일정 생성
    const matchClustersWithAccommodations = () => {
      // 사용된 클러스터를 추적하기 위한 Set
      const usedClusters = new Set();

      // 각 날짜별로 처리
      Object.keys(groupedByDate).forEach((date) => {
        // 체크인 숙소
        const accommodation = groupedByDate[date].accommodation[0];
        if (!accommodation) return;

        // 체크인 숙소 위치와 각 클러스터의 중심점 거리 계산
        const distances = clusterData.map((cluster, index) => {
          const distance = window.google.maps.geometry.spherical.computeDistanceBetween(new window.google.maps.LatLng(accommodation.location.lat, accommodation.location.lng), new window.google.maps.LatLng(cluster.centroid.lat, cluster.centroid.lng));
          return { index, distance };
        });

        // 거리순으로 정렬
        distances.sort((a, b) => a.distance - b.distance);

        // 아직 사용되지 않은 가장 가까운 클러스터 찾기
        let selectedCluster = null;
        for (const { index } of distances) {
          if (!usedClusters.has(index)) {
            selectedCluster = index;
            usedClusters.add(index);
            break;
          }
        }

        // 만약 모든 클러스터가 사용되었다면, 가장 가까운 클러스터 사용
        if (selectedCluster === null) {
          selectedCluster = distances[0].index;
        }

        // 해당 클러스터의 장소들을 해당 날짜의 places에 할당
        groupedByDate[date].places = clusterData[selectedCluster].places;
      });

      // 사용되지 않은 클러스터 찾기
      const unusedClusters = clusterData.filter((_, index) => !usedClusters.has(index));

      // places가 비어있는 날짜 찾기
      const emptyDates = Object.keys(groupedByDate).filter((date) => !groupedByDate[date].places || groupedByDate[date].places.length === 0);

      // 사용되지 않은 클러스터를 빈 날짜에 할당
      unusedClusters.forEach((cluster, index) => {
        if (index < emptyDates.length) {
          const date = emptyDates[index];
          groupedByDate[date].places = cluster.places;
        }
      });
    };

    matchClustersWithAccommodations();
    setSchedule(groupedByDate);
    console.log("groupedByDate", groupedByDate);
  };

  //           effect : useLayoutEffect          //
  useLayoutEffect(() => {
    // 지역 센터 정보 저장
    matchMapCenter();
    // 트립정보 세션에 저장
    setTripInfoInSessionStorage();
  }, []);

  //           state : 검색어 관련           //
  const [query, setQuery] = useState(""); // 검색어
  const [suggestions, setSuggestions] = useState([]); // 자동완성 결과
  const [isApiLoaded, setIsApiLoaded] = useState(false);

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
  //           function : fetchSuggestions - 검색어를 이용한 자동완성         //
  const fetchSuggestions = () => {
    if (!query || !isApiLoaded) {
      setSuggestions([]);
      return;
    }

    const autocompleteService = new window.google.maps.places.AutocompleteService();

    autocompleteService.getPlacePredictions({ input: query, location: new window.google.maps.LatLng(37.5665, 126.978), radius: 5000 }, (predictions, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setSuggestions(predictions);
      } else {
        setSuggestions([]);
      }
    });
  };
  //           effect :
  useEffect(() => {
    const timeoutId = setTimeout(fetchSuggestions, 300); // 디바운싱
    return () => clearTimeout(timeoutId);
  }, [query, isApiLoaded]);

  //           function : handlePlaceSelect - 자동완성 결과를 이용한 장소 선택         //
  const handlePlaceSelect = (place) => {
    setQuery(place.description);
    setSuggestions([]);
    fetchPlaceDetails(place.place_id);
  };

  //

  //           function : fetchPlaceDetails - 장소 정보 가져오기         //
  const fetchPlaceDetails = (placeId) => {
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
  };

  //          render : EditTrip 컴포넌트          //
  return (
    <>
      <div className="container">
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
              onClick={getPlaceInfo}
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
                  <Marker clickable={false} draggable={true} onDragEnd={getPlaceInfo} position={markerPosition} icon={getMarkerIcon(addIcon)} title="새 장소">
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
            </GoogleMap>
          </>
        ) : (
          <div>Loading Map...</div>
        )}
        <Sidebar
          sidebarProps={{
            placesInfo,
            setPlacesInfo,
            checkInDate,
            setCheckInDate,
            checkOutDate,
            setCheckOutDate,
            placeType,
            tripDates,
            setTripDates,
            dailyTimeSlots,
            setDailyTimeSlots,
            schedule,
            setSchedule,
            handelClusterization,
          }}
        />
      </div>
    </>
  );
}

export default EditTrip;
