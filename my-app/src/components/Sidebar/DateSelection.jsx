import React, { useEffect, useState } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { format, set, setDate } from "date-fns";
import { useStore } from "../../stores/store.API";
import $ from "jquery";
// 캘린더

// scss
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
    <div className="contents-container date-select-container">
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
      </div>
     
    </div>
  );
}
