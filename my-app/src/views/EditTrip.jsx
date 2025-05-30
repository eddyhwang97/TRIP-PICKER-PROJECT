import { useCallback, useState, useEffect } from "react";

import { useLocation } from "react-router-dom";
import { kmeans } from "ml-kmeans";
import polyline from "@mapbox/polyline";
// css
import "./css/editTrip.scss";

// components
import Sidebar from "../components/Sidebar";

import GoogleMaps from "../components/GoogleMaps";
import { set } from "date-fns";

function EditTrip(props) {
  const location = useLocation();
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
    console.log("temp", temp);
    setSchedule(temp);
    fetchRoute(temp)
  }, []);

  const [route, setRoute] = useState([]); // 경로 데이터
  // 경로 데이터를 OpenRouteService에서 가져오는 함수
  const fetchRoute = useCallback(async (schedule) => {
    console.log("schedule", schedule);
    if (!schedule || schedule.length < 2) {
      alert("경로를 생성하려면 두 개 이상의 장소가 필요합니다.");
      return;
    }

    const coordinates = Object.entries(schedule).flatMap(([type, places]) => places.map((place) => [place.location.lng, place.location.lat]));
    console.log(coordinates);
    try {
      // 프록시 서버로 POST 요청
      const response = await fetch("/api/directions", {
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
      console.log("응답 데이터:", data); // 이 줄로 확인!
      const encodedPolyline = data.routes[0].geometry;
      const decodedCoordinates = polyline.decode(encodedPolyline);

      const routeCoordinates = decodedCoordinates.map(([lat, lng]) => ({
        lat,
        lng,
      }));
      console.log("Decoded Route Coordinates:", routeCoordinates);

      setMapCenter(routeCoordinates[0]);
      setRoute(routeCoordinates);
    } catch (error) {
      console.error("경로 데이터를 가져오는 중 오류 발생:", error);
    }
  }, [schedule, route]);

  //           Effect : 트립정보 세션 저장          //
  useEffect(() => {
    sessionStorage.setItem("trip", JSON.stringify(tripData));
  }, [tripData]);

  //          render : EditTrip 컴포넌트          //
  return (
    <>
      <div className="container">
        <GoogleMaps
          props={{
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
            mapCenter,
            setMapCenter,
          }}
        />
        <button onClick={fetchRoute} style={{ position: "absolute", top: "50%", right: "50%" }}>
          패치루트
        </button>
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
