import React, { useEffect, useState } from "react";
import Flatpickr from "react-flatpickr";
import { format } from "date-fns";
import "flatpickr/dist/flatpickr.min.css";
import $ from "jquery";

export default function DateSelection(props) {
  const { tripDates, setTripDates } = props;
  const [dateRange, setDateRange] = useState(tripDates.length>0?tripDates:[new Date(), new Date()]);

  //           function          //
  //          날짜 선택 감지        //
  const handleDateChange = () => {
    const setDate = dateRange.map((date) => format(date, "yyyy-MM-dd"));
    setTripDates(setDate);
  };
  //           useEffect          //
  useEffect(() => {
    $(".flatpickr-input").css({ display: "none" });
    handleDateChange();
  },[dateRange]);
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
