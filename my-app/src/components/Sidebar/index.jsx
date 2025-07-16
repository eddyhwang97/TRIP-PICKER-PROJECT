import React, { useMemo, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import DateSelection from "./DateSelection";
import TimeSelection from "./TimeSelection";
import ScheduleCreation from "./ScheduleCreation";
import PlaceList from "./PlaceList";

import "./style.scss";
import { useNavigate } from "react-router-dom";

function Sidebar({
  saveTrip,
  checkInDate,
  setCheckInDate,
  checkOutDate,
  setCheckOutDate,
  placesInfo,
  setPlacesInfo,
  placeType,
  tripDates,
  setTripDates,
  dailyTimeSlots,
  setDailyTimeSlots,
  schedule,
  setSchedule,
  handelClusterization,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // 카테고리 색상 useMemo로 최적화
  const categoryColors = useMemo(
    () => ({
      accommodation: "category-red",
      restaurant: "category-blue",
      cafe: "category-yellow",
      attraction: "category-green",
    }),
    []
  );

  return (
    <>
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <button
          className="sidebar-toggle"
          onClick={() => setSidebarOpen((prev) => !prev)}
        >
          {sidebarOpen ? "«" : "»"}
        </button>
        <div className="sidebar-header">
          <h2>
            {step === 1 && "날짜 선택"}
            {step === 2 && "활동 시간 선택"}
            {step === 3 && "리스트 생성하기"}
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
        {step === 1 && (
          <DateSelection
            tripDates={tripDates}
            setTripDates={setTripDates}
            step={step}
            setStep={setStep}
          />
        )}
        {step === 2 && (
          <TimeSelection
            tripDates={tripDates}
            dailyTimeSlots={dailyTimeSlots}
            setDailyTimeSlots={setDailyTimeSlots}
            step={step}
            setStep={setStep}
          />
        )}
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
        {(step === 4 || step === 5) && (
          <ScheduleCreation
            saveTrip={saveTrip}
            placesInfo={placesInfo}
            setPlacesInfo={setPlacesInfo}
            categoryColors={categoryColors}
            schedule={schedule}
            setSchedule={setSchedule}
            step={step}
            setStep={setStep}
          />
        )}
      </div>
    </>
  );
}

export default Sidebar;
