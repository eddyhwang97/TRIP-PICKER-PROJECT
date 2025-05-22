import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css"; // 스타일 임포트
import DateSelection from "./DateSelection";
import TimeSelection from "./TimeSelection";
import ScheduleCreation from "./ScheduleCreation";
import PlaceList from "./PlaceList";
import Viewer from "./Viewer";

import "./style.scss";
import { SidebarButton } from "../../assets";
import { useNavigate } from "react-router-dom";
import $ from "jquery";

function Sidebar(props) {
  // sidebarProps가 undefined일 때를 대비해 기본값을 {}로 설정
  const { checkInDate, setCheckInDate, checkOutDate, setCheckOutDate, placesInfo, setPlacesInfo, placeType, tripDates, setTripDates, dailyTimeSlots, setDailyTimeSlots, schedule, setSchedule, handelClusterization } = props.sidebarProps;

  const navigate = useNavigate();
  // 사이드바 관련 변수 //
  const [step, setStep] = useState(1); // 1=리스트, 2=날짜, 3=시간, 4=일정

  const categoryColors = {
    accommodation: "category-red",
    restaurant: "category-blue",
    cafe: "category-yellow",
    attraction: "category-green",
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
            navigate("/dashboard");
          }}
        >
          Dash Board
        </button>
      </div>
      {/* 단계별로 컴포넌트 보여주기 */}
      {step === 1 && <DateSelection tripDates={tripDates} setTripDates={setTripDates} step={step} setStep={setStep} />}
      {step === 2 && <TimeSelection tripDates={tripDates} dailyTimeSlots={dailyTimeSlots} setDailyTimeSlots={setDailyTimeSlots} step={step} setStep={setStep} />}
      {step === 3 && (
        <PlaceList
          checkOutDate={checkOutDate}
          setCheckOutDate={setCheckOutDate}
          dailyTimeSlots={dailyTimeSlots}
          checkInDate={checkInDate}
          setCheckInDate={setCheckInDate}
          placeType={placeType}
          placesInfo={placesInfo}
          setPlacesInfo={setPlacesInfo}
          categoryColors={categoryColors}
          step={step}
          setStep={setStep}
          handelClusterization={handelClusterization}
        />
      )}
      {step === 4 && <ScheduleCreation placesInfo={placesInfo} setPlacesInfo={setPlacesInfo} categoryColors={categoryColors} dailyTimeSlots={dailyTimeSlots} schedule={schedule} setSchedule={setSchedule} step={step} setStep={setStep} />}
      {step === 5 && <Viewer step={step} setStep={setStep} />}
    </div>
  );
}

export default Sidebar;
