import React, { useState, useRef } from "react";
import { GoogleMap, useJsApiLoader, Autocomplete, Marker } from "@react-google-maps/api";
import { useStore } from "../../stores/store.API";
import "react-datepicker/dist/react-datepicker.css"; // 스타일 임포트
import DateSelection from "./DateSelection";
import TimeSelection from "./TimeSelection";
import ScheduleCreation from "./ScheduleCreation";
import PlaceList from "./PlaceList";
import Viewer from "./Viewer";

import "./sidebar.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { SidebarButton } from "../../assets";

const containerStyle = {
  width: "100vw",
  height: "100vh",
};

function Sidebar(props) {
  const user = useStore((state) => state.user);
  const navigate = useNavigate();
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
  const [step, setStep] = useState(1); // 1=리스트, 2=날짜, 3=시간, 4=일정

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
  const [sampleList, setSampleList] = useState([
    { id: 1, name: "장소이름", address: "장소주소", category: "숙소" },
    { id: 2, name: "장소이름", address: "장소주소", category: "음식점" },
    { id: 3, name: "장소이름", address: "장소주소", category: "카페" },
    { id: 4, name: "장소이름", address: "장소주소", category: "관광" },
    { id: 5, name: "장소이름", address: "장소주소", category: "관광" },
    { id: 5, name: "장소이름", address: "장소주소", category: "관광" },
    { id: 5, name: "장소이름", address: "장소주소", category: "관광" },
    { id: 5, name: "장소이름", address: "장소주소", category: "관광" },
    { id: 5, name: "장소이름", address: "장소주소", category: "관광" },
    { id: 5, name: "장소이름", address: "장소주소", category: "관광" },
  ]);

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

  // 리스트 삭제 함수
  const handleDelete = (id) => {
    const confirmDelete = window.confirm("삭제하시겠습니까?");
    if (confirmDelete) {
      setSampleList((prevList) => prevList.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>
          {step === 1 && "리스트"}
          {step === 2 && "날짜 선택"}
          {step === 3 && "활동 시간 선택"}
          {step === 4 && "일정 생성"}
          {step === 5 && "일정 뷰어"}
        </h2>
        <button
          className="dashboard-button"
          onClick={(e) => {
            e.preventDefault();
            navigate("/Dashboard");
          }}
        >
          Dash Board
        </button>
      </div>
      {/* 단계별로 컴포넌트 보여주기 */}
      {step === 1 && <PlaceList sampleList={sampleList} setSampleList={setSampleList} categoryColors={categoryColors} onNext={() => setStep(2)} />}
      {step === 2 && <DateSelection onNext={() => setStep(3)} onPrev={() => setStep(1)} user={user} />}
      {step === 3 && <TimeSelection onNext={() => setStep(4)} onPrev={() => setStep(2)} />}
      {step === 4 && <ScheduleCreation onNext={() => setStep(5)} onPrev={() => setStep(3)} />}
      {step === 5 && <Viewer onNext={() => setStep(5)} onPrev={() => setStep(4)} />}

<SidebarButton step={step} setStep={setStep}/>
    
    </div>
  );
}

export default Sidebar;
