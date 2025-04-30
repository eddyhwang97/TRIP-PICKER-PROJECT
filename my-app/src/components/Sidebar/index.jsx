import React, { useState, useRef, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css"; // 스타일 임포트
import DateSelection from "./DateSelection";
import TimeSelection from "./TimeSelection";
import ScheduleCreation from "./ScheduleCreation";
import PlaceList from "./PlaceList";
import Viewer from "./Viewer";

import "./sidebar.scss";
import { SidebarButton } from "../../assets";
import { useNavigate } from "react-router-dom";
import $ from "jquery";

const containerStyle = {
  width: "100vw",
  height: "100vh",
};

function Sidebar(props) {
  const {places} = props
  const navigate = useNavigate();
  // 사이드바 관련 변수 //
  const [step, setStep] = useState(1); // 1=리스트, 2=날짜, 3=시간, 4=일정

  

  // 사이드바 관련 변수 //
  const [sampleList, setSampleList] = useState([
    { id: 1, name: "장소이름", address: "장소주소", category: "숙소" },
    { id: 2, name: "장소이름", address: "장소주소", category: "음식점" },
    { id: 3, name: "장소이름", address: "장소주소", category: "카페" },
    { id: 4, name: "장소이름", address: "장소주소", category: "관광" },
    { id: 5, name: "장소이름", address: "장소주소", category: "관광" },
    { id: 6, name: "장소이름", address: "장소주소", category: "관광" },
    { id: 7, name: "장소이름", address: "장소주소", category: "관광" },
    { id: 8, name: "장소이름", address: "장소주소", category: "관광" },
    { id: 9, name: "장소이름", address: "장소주소", category: "관광" },
    { id: 10, name: "장소이름", address: "장소주소", category: "관광" },
  ]);

  const categoryColors = {
    숙소: "category-red",
    음식점: "category-blue",
    카페: "category-yellow",
    관광: "category-green",
  };

  // // 캘린더
  // const handleDatePickerClick = () => {
  //   setShowList(false); // 리스트 사라지기 시작
  //   setTimeout(() => setShowDatePicker(true), 300); // 애니메이션 끝난 후 날짜 선택 UI 표시
  // };

  // // 리스트 삭제 함수
  // const handleDelete = (id) => {
  //   const confirmDelete = window.confirm("삭제하시겠습니까?");
  //   if (confirmDelete) {
  //     setSampleList((prevList) => prevList.filter((item) => item.id !== id));
  //   }
  // };
  const handleContainer = ()=>{
    const placeList = $('.place-list-container')
    const dateSelection = $('.date-selection-container')
    const timeSelection = $('.time-selection-container')
  }
  useEffect(()=>{
    
    console.log()
    
  })

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
            navigate("/dashboard");
          }}
        >
          Dash Board
        </button>
      </div>
      {/* 단계별로 컴포넌트 보여주기 */}
      {step === 1 && <PlaceList places={places} sampleList={sampleList} setSampleList={setSampleList} categoryColors={categoryColors} onNext={() => setStep(2)} />}
      {step === 2 && <DateSelection />}
      {step === 3 && <TimeSelection />}
      {step === 4 && <ScheduleCreation />}
      {step === 5 && <Viewer  />}

<SidebarButton step={step} setStep={setStep}/>
    
    </div>
  );
}

export default Sidebar;
