import React from "react";
// 캘린더
import DatePicker from "react-datepicker";

// scss
import editTripSidebar from "../../../views/css/editTripSidebar.scss";
import "react-datepicker/dist/react-datepicker.css";

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