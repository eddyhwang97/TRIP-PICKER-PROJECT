import React, { useEffect, useState } from "react";
import Flatpickr from "react-flatpickr";
import { format } from "date-fns";
import "flatpickr/dist/flatpickr.min.css";
import $ from "jquery";
import { SidebarButton } from "../../assets";

export default function DateSelection(props) {
  const { tripDates, setTripDates } = props;
  const [dateRange, setDateRange] = useState(tripDates);

  //           function : 날짜 선택 감지            //
  const handleDateChange = () => {
    const setDate = dateRange.map((date) => format(date, "yyyy-MM-dd"));
    setTripDates(setDate);
  };

  //           function : 날짜 선택 유효성 검사            //
  const validateDateRange = () => {
    const today = new Date();
    const todayDate = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, "0"), String(today.getDate()).padStart(2, "0")].join("-");
    // 1. 오늘보다 전날은 선택 불가
    if (dateRange !== null && dateRange[0] < new Date()) {
      setTripDates([todayDate, todayDate]);
      setDateRange([todayDate, todayDate]);
      return alert("시작날이 오늘보다 빠를수는 없습니다.");
    }
  };
  //           useEffect :  tripDates null값일때 오늘날짜로 설정            //

  //           useEffect :  dateRange 감지            //
  useEffect(() => {
    handleDateChange();
    validateDateRange();
  }, [dateRange]);
  return (
    <>
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
      <SidebarButton step={2} setStep={props.setStep} />
    </>
  );
}
