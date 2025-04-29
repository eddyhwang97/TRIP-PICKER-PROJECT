import React, { useEffect, useState } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { format, set, setDate } from "date-fns";
import $ from "jquery";
// 캘린더

// scss
// import editTripSidebar from "../../../views/css/editTripSidebar.scss";
export default function DateSelection({ onNext, onPrev, user }) {
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);

  const handleDateChange = () => {
    const setDate = dateRange.map((date) => format(date, "yyyy-MM-dd"));
    console.log(setDate);
    setTripsDate(setDate);
  };
  const setTripsDate = (setDate) => {
    let trips = JSON.parse(localStorage.getItem("trips"));
    const startDate = setDate[0];
    const endDate = setDate[1];
    console.log(startDate, endDate);
    trips = trips.map((trip) => {
      return { ...trip, startDate, endDate };
    });
    localStorage.setItem("trips", JSON.stringify(trips));
  };
  useEffect(() => {
    $(".flatpickr-input").css({ display: "none" });
    handleDateChange();
  });
  return (
    <div className="date-select-container">
      <div className="p-6">
        <div>
          <Flatpickr
            options={{
              mode: "range",
              dateFormat: "Y-m-d",
              inline: true, // Display calendar inline
              static: true, // Prevents input field from being added
            }}
            value={dateRange}
            onChange={(dates) => setDateRange(dates)}
          />
        </div>
        <p>
          <strong>Start Date:</strong> {dateRange[0] ? format(dateRange[0], "yyyy-MM-dd") : "Not selected"}
        </p>
        <p>
          <strong>End Date:</strong> {dateRange[1] ? format(dateRange[1], "yyyy-MM-dd") : "Not selected"}
        </p>
      </div>
      <div className="button-group">
        <button
          className="prev-button"
          onClick={() => {
            onPrev();
          }}
        >
          이전
        </button>
        <button className="next-button" onClick={onNext}>
          활동 시간 선택하기
        </button>
      </div>
    </div>
  );
}
