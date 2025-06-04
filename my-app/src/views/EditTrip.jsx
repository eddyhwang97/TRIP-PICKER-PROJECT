import { useCallback, useState, useEffect } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import { kmeans } from "ml-kmeans";
import polyline from "@mapbox/polyline";
// css
import "./css/editTrip.scss";

// components
import Sidebar from "../components/Sidebar";
import GoogleMapsWrapper from "../components/GoogleMaps/GoogleMapsWrapper";

function EditTrip(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mapCenter, setMapCenter] = useState(null); // 지도 중심
  //           state : 여행정보 셋팅 및 저장 상태 변수 //
  const tripData = location.state.tripData;
  // PlaceList
  const [placesInfo, setPlacesInfo] = useState({ accommodation: tripData.accommodation, attraction: tripData.attraction, restaurant: tripData.restaurant, cafe: tripData.cafe });
  // DateSelection
  const [tripDates, setTripDates] = useState([tripData.startDate, tripData.endDate]);
  // TimeSelection
  const [dailyTimeSlots, setDailyTimeSlots] = useState(tripData.dailyTimeSlots);
  // ScheduleCreation
  const [schedule, setSchedule] = useState(null);
  // 장소 유형
  const [placeType, setPlaceType] = useState("attraction");
  // 체크인
  const [checkInDate, setCheckInDate] = useState(Object.keys(dailyTimeSlots)[0]);
  // 체크아웃
  const [checkOutDate, setCheckOutDate] = useState(Object.keys(dailyTimeSlots)[1]);

  //          function : 클러스터링 및 일정 생성          //
  const handelClusterization = useCallback(async () => {
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

    // 6. 일정 생성

    matchClustersWithAccommodations();
    makeSchedule(groupedByDate);
  });
  const makeSchedule = useCallback((groupedByDate) => {
    const temp = {};
    Object.keys(groupedByDate).forEach((date) => {
      temp[date] = groupedByDate[date].places;
      if (groupedByDate[date].accommodation[1] !== null) {
        temp[date].unshift(groupedByDate[date].accommodation[1]);
      }
      if (groupedByDate[date].accommodation[0] !== null) {
        temp[date].push(groupedByDate[date].accommodation[0]);
      }
    });
    /*************  ✨ Windsurf Command ⭐  *************/
    const newtemp = Object.keys(groupedByDate).map((date) => {
      return groupedByDate[date].places.map((place) => [place.location.lng, place.location.lat]);
    });

    console.log("newtemp", newtemp);

    /*******  79cc65ab-fdd8-41a1-b8f3-ef25c9d89bbb  *******/
    setSchedule(temp);

    fetchRoute(newtemp);
  }, []);

  //           function : fetchRoute - 경로 생성          //
  const [route, setRoute] = useState([]); // 루트 1개 데이터
  const [routes, setRoutes] = useState([]); // 루트 여러개 데이터
  // 경로 데이터를 OpenRouteService에서 가져오는 함수
  const fetchRoute = useCallback(
    async (schedule) => {
      // 루트 1개인지 여러개인지 판별
      // 루트 1개: schedule = [[lng,lat],[lng,lat],...]
      // 루트 여러개: schedule = [ [[lng,lat],[lng,lat],...], [[lng,lat],[lng,lat],...], ... ]
      const isSingleRoute = Array.isArray(schedule) && schedule.length > 0 && Array.isArray(schedule[0]) && typeof schedule[0][0] === "number";

      const isMultiRoute = Array.isArray(schedule) && schedule.length > 0 && Array.isArray(schedule[0]) && Array.isArray(schedule[0][0]) && typeof schedule[0][0][0] === "number";

      try {
        const API_URL = process.env.REACT_APP_API_SERVER || "http://localhost:3001";
        if (isSingleRoute) {
          // 루트 1개일 때
          const coordinates = schedule;
          const response = await fetch(`${API_URL}/api/directions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ coordinates }),
          });

          if (!response.ok) {
            throw new Error("경로 데이터를 가져오는 데 실패했습니다.");
          }

          const data = await response.json();
          // polyline 혹은 geojson 분기
          let routeCoordinates = [];
          if (data.routes && data.routes[0].geometry) {
            try {
              const encodedPolyline = data.routes[0].geometry;
              const decodedCoordinates = polyline.decode(encodedPolyline);
              routeCoordinates = decodedCoordinates.map(([lat, lng]) => ({ lat, lng }));
            } catch (e) {
              console.error("Polyline decode error:", e);
            }
          } else if (data.features && data.features[0].geometry.coordinates) {
            routeCoordinates = data.features[0].geometry.coordinates.map(([lng, lat]) => ({ lat, lng }));
          }
          setRoute(routeCoordinates);
          if (routeCoordinates.length > 0) setMapCenter(routeCoordinates[0]);
        } else if (isMultiRoute) {
          // 루트 여러개일 때
          const responses = await Promise.all(
            schedule.map((coordinates, idx) =>
              fetch(`${API_URL}/api/directions`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ coordinates }),
              }).then(async (res) => {
                if (!res.ok) throw new Error(`경로 ${idx + 1} 데이터를 가져오는 데 실패했습니다.`);
                const data = await res.json();
                let routeCoordinates = [];
                if (data.routes && data.routes[0].geometry) {
                  try {
                    const encodedPolyline = data.routes[0].geometry;
                    const decodedCoordinates = polyline.decode(encodedPolyline);
                    routeCoordinates = decodedCoordinates.map(([lat, lng]) => ({ lat, lng }));
                  } catch (e) {
                    console.error("Polyline decode error (multi):", e);
                  }
                } else if (data.features && data.features[0].geometry.coordinates) {
                  routeCoordinates = data.features[0].geometry.coordinates.map(([lng, lat]) => ({ lat, lng }));
                }
                return routeCoordinates;
              })
            )
          );
          setRoutes(responses); // 여러 경로 모두 저장
          if (responses.length > 0 && responses[0].length > 0) setMapCenter(responses[0][0]);
        } else {
          alert("입력 데이터 구조가 올바르지 않습니다.");
        }
      } catch (error) {
        console.error("경로 데이터를 가져오는 중 오류 발생:", error);
      }
    },
    [setRoute, setRoutes, setMapCenter]
  );

  //           function : saveTrip -모든 트립 정보 저장하기
  const saveTrip = useCallback(() => {
    const trip = {
      id: tripData.id,
      userId: tripData.userId,
      title: tripData.title,
      startDate: tripDates[0],
      endDate: tripDates[1],
      city: tripData.city,
      accommodation: placesInfo.accommodation,
      attraction: placesInfo.attraction,
      restaurant: placesInfo.restaurant,
      cafe: placesInfo.cafe,
      groupedByDate: tripData.schedule,
      dailyTimeSlots: tripData.dailyTimeSlots,
    };

    // 1. 기존 트립리스트 가져오기
    let trips = JSON.parse(localStorage.getItem("trips")) || [];

    // 2. 트립 업데이트 (id가 같으면 교체)
    const updatedTrips = trips.map((t) => (t.id === trip.id ? trip : t));

    // 만약 새로 추가하는 trip이면 push
    const exists = trips.some((t) => t.id === trip.id);
    if (!exists) updatedTrips.push(trip);

    // 3. 저장
    localStorage.setItem("trips", JSON.stringify(updatedTrips));

  });

  //           Effect : 트립정보 세션 저장          //
  useEffect(() => {
    sessionStorage.setItem("trip", JSON.stringify(tripData));
  }, [tripData]);

  //          render : EditTrip 컴포넌트          //
  return (
    <>
      <div className="container">
        <GoogleMapsWrapper
          tripData={tripData}
          placesInfo={placesInfo}
          setPlacesInfo={setPlacesInfo}
          checkInDate={checkInDate}
          setCheckInDate={setCheckInDate}
          checkOutDate={checkOutDate}
          setCheckOutDate={setCheckOutDate}
          placeType={placeType}
          setPlaceType={setPlaceType}
          tripDates={tripDates}
          setTripDates={setTripDates}
          dailyTimeSlots={dailyTimeSlots}
          setDailyTimeSlots={setDailyTimeSlots}
          schedule={schedule}
          setSchedule={setSchedule}
          route={route}
          setRoute={setRoute}
          routes={routes}
          mapCenter={mapCenter}
          setMapCenter={setMapCenter}
          // ...필요한 추가 props
        />
        <Sidebar
          placesInfo={placesInfo}
          setPlacesInfo={setPlacesInfo}
          checkInDate={checkInDate}
          setCheckInDate={setCheckInDate}
          checkOutDate={checkOutDate}
          setCheckOutDate={setCheckOutDate}
          placeType={placeType}
          tripDates={tripDates}
          setTripDates={setTripDates}
          dailyTimeSlots={dailyTimeSlots}
          setDailyTimeSlots={setDailyTimeSlots}
          schedule={schedule}
          setSchedule={setSchedule}
          handelClusterization={handelClusterization}
          saveTrip={saveTrip}
        />
      </div>
    </>
  );
}

export default EditTrip;
