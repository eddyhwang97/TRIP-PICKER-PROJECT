import React, { useState, useEffect } from "react";
import { SidebarButton } from "../../../assets";
import "./style.scss";

export default function TimeSelection(props) {
  const { tripDates, dailyTimeSlots, setDailyTimeSlots } = props;
  const [activities, setActivities] = useState({});

  //           function : dailyTimeSlots날짜 셋팅하기           //
  const setDailyTimeSlotsWithTripDates = () => {
    // 날짜 배열 생성 함수
    const generateDateRange = (startDate, endDate) => {
      const result = [];
      let current = new Date(startDate);
      const end = new Date(endDate);

      while (current <= end) {
        // yyyy-mm-dd 형식으로 포맷
        const formatted = [current.getFullYear(), String(current.getMonth() + 1).padStart(2, "0"), String(current.getDate()).padStart(2, "0")].join("-");
        result.push(formatted);
        current.setDate(current.getDate() + 1);
      }
      return result;
    };

    const dateArray = generateDateRange(tripDates[0], tripDates[1]);

    // 기존 dailyTimeSlots에서 날짜가 겹치는 값은 유지, 새로운 날짜는 기본값으로 추가
    const newDailyTimeSlots = dateArray.reduce((acc, date) => {
      acc[date] = dailyTimeSlots[date] || { start: "00:00", end: "00:00" };
      return acc;
    }, {});

    setDailyTimeSlots(newDailyTimeSlots);
  };
  const changeDateFormat = (dateStr) => {
    const daysKor = ["일", "월", "화", "수", "목", "금", "토"];
    const date = new Date(dateStr);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dayOfWeek = daysKor[date.getDay()];
    return `${month}/${day} ${dayOfWeek}`;
  };

  //           useEffect : tripDates 감지           //
  // tripDates가 변경될 때마다 실행
  useEffect(() => {
    setDailyTimeSlotsWithTripDates();
  }, [tripDates]);

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
              <div className="date">{changeDateFormat(date)}</div>
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
      <SidebarButton step={2} setStep={props.setStep} />
    </>
  );
}
