import React, { useEffect } from "react";
import $ from "jquery";
import "./style.scss";

export default function PlaceInfo(props) {
  const { savePlace, markerPosition, setMarkerPosition, setPlaceType, setCheckInDate, setCheckOutDate, placeType, checkInDate, checkOutDate, dailyTimeSlots } = props;

  return (
    <div className="info-window position-info-container" style={{ padding: "5px" }}>
      <div className="place-control">
        <select value={placeType} onChange={(e) => setPlaceType(e.target.value)}>
          <option value="">장소 유형</option>
          <option value="accommodation">숙소</option>
          <option value="attraction">관광지</option>
          <option value="restaurant">식당</option>
          <option value="cafe">카페</option>
        </select>
        <button onClick={savePlace}>저장</button>
      </div>
      {/* 숙소 선택 시 표시되는 체크인/체크아웃 입력 */}
      {placeType === "accommodation" && (
        <div className="accommodation-dates">
          <label>
            <span>체크인:</span>
            <select value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} name="checkInDate" id="checkInDate">
              {Object.keys(dailyTimeSlots)
                .slice(0, -1)
                .map((date) => (
                  <option key={date} value={date}>
                    {date}
                  </option>
                ))}
            </select>
          </label>
          <label>
            <span>체크아웃:</span>
            <select value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)}  name="checkOutDate" id="checkOutDate">
              {Object.keys(dailyTimeSlots)
                .slice(1)
                .map((date) => (
                  <option key={date} value={date}>
                    {date}
                  </option>
                ))}
            </select>
          </label>
        </div>
      )}
      <div className="position-info">
        <span className="position-name">{markerPosition.name || "선택된 위치"}</span>
        <span className="position-address">{markerPosition.address || ""}</span>
      </div>
    </div>
  );
}
