import React from "react";
import editTripSidebar from "./css/editTripSidebar.scss";


export default function TimeSelection({ onNext, onPrev }) {
  return (
    <div className="time-selection">
      <p>활동 시간을 선택해주세요.</p>
      <div className="button-group">
        <button className="prev-button" onClick={onPrev}>
          이전
        </button>
        <button className="next-button" onClick={onNext}>
          일정 생성하기 
        </button>
      </div>
    </div>
  );
}