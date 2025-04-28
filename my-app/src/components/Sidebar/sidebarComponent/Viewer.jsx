import React from "react";
import editTripSidebar from "../../../views/css/editTripSidebar.scss";


export default function Viewer({ onNext, onPrev }) {
  return (
    <div className="schedule-creation">
      <p>일정을 생성해주세요.</p>
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
