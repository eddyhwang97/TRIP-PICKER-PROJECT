import React, { useState, useEffect } from "react";
import { SidebarButton } from "../../assets";

export default function TimeSelection(props) {
  const { tripDates, dailyTimeSlots, setDailyTimeSlots } = props;
  const [activities, setActivities] = useState({});

  //           function : dailyTimeSlots날짜 셋팅하기           //
  const setDailyTimeSlotsWithTripDates = () => {
    const dailyTimeSlotsLength = Object.keys(dailyTimeSlots).length;

    // 1. 기존 dailyTimeSlots 데이터 없을 경우
    if (dailyTimeSlotsLength === 0) {
      // 1) 날짜 배열 생성
      const generateDateRange = (startDate, endDate) => {
        const dateArray = [];
        const currentDate = new Date(startDate);
        const endDateObj = new Date(endDate);

        const daysKor = ["일", "월", "화", "수", "목", "금", "토"];

        while (currentDate <= endDateObj) {
          const month = currentDate.getMonth() + 1; // 0-indexed
          const day = currentDate.getDate();
          const dayOfWeek = daysKor[currentDate.getDay()]; // 요일

          const formatted = `${month}/${day} ${dayOfWeek}`;
          dateArray.push(formatted);

          currentDate.setDate(currentDate.getDate() + 1);
        }
        return dateArray;
      };
      const dateArray = generateDateRange(tripDates[0], tripDates[1]);

      // 2) 날짜에 대해 시간 셋팅
      const dailyTimeSlots = dateArray.reduce((acc, date) => {
        acc[date] = { start: "00:00", end: "00:00" };
        return acc;
      }, {});
      setDailyTimeSlots(dailyTimeSlots);
    }
    // 2. 기존 dailyTimeSlots 데이터 있을 경우
    else if(dailyTimeSlotsLength !== 0){
      setDailyTimeSlots(dailyTimeSlots);
    }
    
  };
  useEffect(() => {
    setDailyTimeSlotsWithTripDates();
  }, []);

  //           function : 시간 변경 핸들러          //
  const handleTimeChange = (date, type, part, value) => {
    setDailyTimeSlots((prev) => {
      const prevTime = prev[date][type];
      const [hour, minute] = prevTime.split(":");
      const newTime = part === "hour" ? `${value}:${minute}` : `${hour}:${value}`;
      return {
        ...prev,
        [date]: {
          ...prev[date],
          [type]: newTime,
        },
      };
    });
  };

  return (
    <>
      <div className="contents-container time-selection-container">
        {Object.entries(dailyTimeSlots).map(([date, time]) => (
          <div key={date} className="date-time-box">
            <div className="date-box">
              <div className="date-title">일자</div>
              <div className="date">{date}</div>
            </div>
            <div>
              <label htmlFor={`start-time-${date}`}>시작 시간</label>
              <div className="time-input">
                <select value={time?.start?.split(":")[0] || "00"} onChange={(e) => handleTimeChange(date, "start", "hour", e.target.value)}>
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={String(i).padStart(2, "0")}>
                      {String(i).padStart(2, "0")}
                    </option>
                  ))}
                </select>
                <span>:</span>
                <select value={time?.start?.split(":")[1] || "00"} onChange={(e) => handleTimeChange(date, "start", "minute", e.target.value)}>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={String(i * 5).padStart(2, "0")}>
                      {String(i * 5).padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <span>~</span>
            <div>
              <label htmlFor={`end-time-${date}`}>종료 시간</label>
              <div className="time-input">
                <select value={time?.end?.split(":")[0] || "00"} onChange={(e) => handleTimeChange(date, "end", "hour", e.target.value)}>
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={String(i).padStart(2, "0")}>
                      {String(i).padStart(2, "0")}
                    </option>
                  ))}
                </select>
                <span>:</span>
                <select value={time?.end?.split(":")[1] || "00"} onChange={(e) => handleTimeChange(date, "end", "minute", e.target.value)}>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={String(i * 5).padStart(2, "0")}>
                      {String(i * 5).padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
      <SidebarButton step={3} setStep={props.setStep} />
    </>
  );
}
