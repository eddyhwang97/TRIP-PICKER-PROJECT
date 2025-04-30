import React from "react";
import editTripSidebar from "../../../views/css/editTripSidebar.scss";


export default function ScheduleCreation({ onNext, onPrev }) {
  return (
    <div className="schedule-creation">
      
      <div className="button-group">
        <button className="prev-button" onClick={onPrev}>
          이전
        </button>
        <button className="next-button" onClick={onNext}>
          저장하기
        </button>
      </div>
    </div>
  );
}
