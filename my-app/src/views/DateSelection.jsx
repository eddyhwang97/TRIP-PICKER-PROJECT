import React from "react";
import editTripSidebar from "./css/editTripSidebar.scss";

export default function DateSelection({ onNext, onPrev }) {
  return (
    
    <div className="date-selection">
      <p>날짜를 선택해주세요.</p>
      <div className="button-group">
        <button className="prev-button" onClick={onPrev}>
          이전
        </button>
        <button className="next-button" onClick={onNext}>
          활동 시간 설정하기 
        </button>
      </div>
    </div>
  );
}