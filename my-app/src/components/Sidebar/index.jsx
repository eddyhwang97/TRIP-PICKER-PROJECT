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

function Sidebar(props) {
  const { placesInfo, setPlacesInfo } = props.sidebarProps;
  const { tripDates, setTripDates } = props.sidebarProps;
  const { dailyTimeSlots, setDailyTimeSlots } = props.sidebarProps;
  const navigate = useNavigate();
  // 사이드바 관련 변수 //
  const [step, setStep] = useState(1); // 1=리스트, 2=날짜, 3=시간, 4=일정

  const categoryColors = {
    accommodation: "category-red",
    restaurant: "category-blue",
    cafe: "category-yellow",
    attraction: "category-green",
  };

  const handleContainer = () => {
    const placeList = $(".place-list-container");
    const dateSelection = $(".date-selection-container");
    const timeSelection = $(".time-selection-container");
  };
  useEffect(() => {
    console.log();
  });

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
      {step === 1 && <PlaceList placesInfo={placesInfo} categoryColors={categoryColors}/>}
      {step === 2 && <DateSelection tripDates={tripDates} setTripDates={setTripDates} />}
      {step === 3 && <TimeSelection tripDates={tripDates} dailyTimeSlots={dailyTimeSlots} setDailyTimeSlots={setDailyTimeSlots} />}
      {step === 4 && <ScheduleCreation />}
      {step === 5 && <Viewer />}

      <SidebarButton step={step} setStep={setStep} />
    </div>
  );
}

export default Sidebar;
