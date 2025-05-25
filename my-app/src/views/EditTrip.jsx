import React, { useCallback, useState, useRef, useEffect, useLayoutEffect } from "react";
import { Loader, GoogleMap, useJsApiLoader, Autocomplete, Marker, computeDistanceBetween, DirectionsRenderer } from "@react-google-maps/api";
import { useLocation } from "react-router-dom";
import { useStore } from "../stores/store.API";
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
import { set } from "date-fns";

const containerStyle = {
  width: "100vw",
  height: "100vh",
};

function EditTrip(props) {
  //           state : 여행정보 셋팅 및 저장 상태 변수 //
  const location = useLocation();
  const [mapCenter, setMapCenter] = useState(null);
  const [zoom, setZoom] = useState(12);
  const [autocomplete, setAutocomplete] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [placeType, setPlaceType] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [markers, setMarkers] = useState([]);
  const [directions, setDirections] = useState(null);
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
  const [schedule, setSchedule] = useState(tripData.groupedByDate);
  //           function : 구글맵 API 로드         //
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places", "geometry"],
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
    localStorage.setItem("trip", JSON.stringify(trip));
  };

  //          function : onLoadAutocomplete          //
  // Autocomplete 인스턴스 저장
  const onLoadAutocomplete = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };

  //         function : onPlaceChanged         //
  // 장소 검색 후 마커 위치 업데이트
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

  //         function : onMapClick         //
  // 지도 클릭 핸들러 useCallback 적용
  const onMapClick = useCallback(
    (event) => {
      const clickedPosition = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      setMarkerPosition(clickedPosition);
    },
    [setMarkerPosition]
  );

  //          function : 장소 저장          //
  // 장소 저장 핸들러
  const savePlace = useCallback(() => {
    if (!markerPosition || !placeType) {
      alert("장소와 유형을 선택해주세요.");
      return;
    }

    // 현재 일정의 총 일수 계산
    const tripDays = Object.keys(dailyTimeSlots).length;

    // 숙소 개수가 일정 일수를 초과하는지 확인
    if (placeType === "accommodation" && placesInfo.accommodation.length >= tripDays - 1) {
      alert(`숙소는 총 ${tripDays}개를 초과할 수 없습니다.`);
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
      location: markerPosition,
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
    // 전체 places 정보에서 장소리스트 가져와서 배열만들기
    const places = Object.entries(placesInfo)
      .map(([type, places]) => (type !== "accommodation" ? places : []))
      .flat();

    console.log("places");

    const accommodation = placesInfo.accommodation || [];

    const locations = places.map((place) => [place.location.lat, place.location.lng, place.checkInDate || 0]);

    const numberOfDays = Object.keys(dailyTimeSlots).length;

    const accommodationPlaces = placesInfo.accommodation || [];

    // 2. kmeans 클러스터링
    const clusters = kmeans(locations, numberOfDays);
    console.log("K-means 클러스터링 결과:", clusters, accommodationPlaces);

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
    // 4. 클러스터링 중심과 숙소 위치 정보를 비교하여 일정 생성
    const matchClustersWithAccommodations = () => {
      // 사용된 클러스터를 추적하기 위한 Set
      const usedClusters = new Set();
      
      // 각 날짜별로 처리
      Object.keys(groupedByDate).forEach((date) => {
        const accommodation = groupedByDate[date].accommodation[0];
        if (!accommodation) return;

        // 각 클러스터와의 거리 계산
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
      const emptyDates = Object.keys(groupedByDate).filter(date => 
        !groupedByDate[date].places || groupedByDate[date].places.length === 0
      );

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

  useEffect(() => {
    console.log("placesInfo", placesInfo, "tripDates", tripDates, "dailyTimeSlots", dailyTimeSlots, "schedule", schedule);
  }, [placesInfo, tripDates, dailyTimeSlots, schedule]);

  //          render : EditTrip 컴포넌트          //
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
              {/* 숙소 선택 시 표시되는 체크인/체크아웃 입력 */}
              {placeType === "accommodation" && (
                <div className="accommodation-dates">
                  <label>
                    <span>체크인:</span>
                    <select value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} defaultValue={Object.keys(dailyTimeSlots)[0]} name="checkInDate" id="checkInDate">
                      {Object.keys(dailyTimeSlots)
                        .slice(0, -1)
                        .map((date) => (
                          <option key={date} value={date}>
                            {date}
                          </option>
                        ))}
                    </select>
                  </label>
                  <label>
                    <span>체크아웃:</span>
                    <select value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} defaultValue={Object.keys(dailyTimeSlots)[1]} name="checkOutDate" id="checkOutDate">
                      {Object.keys(dailyTimeSlots)
                        .slice(1)
                        .map((date) => (
                          <option key={date} value={date}>
                            {date}
                          </option>
                        ))}
                    </select>
                  </label>
                </div>
              )}

              <button onClick={savePlace}>저장</button>
              <button onClick={handelClusterization}>일정 생성하기</button>
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
              {/* 저장된 마커들 */}
              {markers.map((marker, index) => (
                <Marker key={marker.id} position={marker.location} icon={getMarkerIcon(marker.id)} title={marker.name || marker.address} />
              ))}
              {/* 임시 마커(아직 저장 안 된 위치) */}
              {markerPosition && <Marker position={markerPosition} icon={addIcon} title="새 장소" />}
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
