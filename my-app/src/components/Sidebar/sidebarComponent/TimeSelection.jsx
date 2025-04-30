import React, { useState } from "react";
import editTripSidebar from "../../../views/css/editTripSidebar.scss";

// 날짜 범위 샘플 생성 함수
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

export default function TimeSelection({ onNext, onPrev }) {
  // 날짜, 시작시간, 종료 시간을 상태로 관리
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // 날짜 범위 샘플 생성: 2025-05-01부터 2025-05-05까지
  const dateRange = generateDateRange("2025-05-01", "2025-05-05");

  const [activities, setActivities] = useState(
    dateRange.reduce((acc, date) => {
      acc[date] = { startTime: "", endTime: "" };
      return acc;
    }, {})
  );

  // 유효성 검사
  const isEndTimeValid = (date) => {
    const { startTime, endTime } = activities[date];
    return endTime && startTime && endTime > startTime;
  };

  // 입력값 변경 함수
  const handleDateChange = (e) => setDate(e.target.value);
  const handleStartTimeChange = (date, time) => {
    setActivities((prev) => ({
      ...prev,
      [date]: {
        ...prev[date],
        startTime: time,
      },
    }));
  };

  const handleEndTimeChange = (date, time) => {
    setActivities((prev) => ({
      ...prev,
      [date]: {
        ...prev[date],
        endTime: time,
      },
    }));
  };

  const formatTime = (hours, minutes) => {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}`;
  };

  // 폼 제출 시 처리 함수
  const handleSubmit = () => {
    const isValid = Object.keys(activities).every((date) =>
      isEndTimeValid(date)
    );
    if (!isValid) {
      alert("모든 날짜에 대해 종료 시간이 시작 시간보다 빠를 수 없습니다.");
      return;
    }
    alert("활동 시간이 설정되었습니다!");
    console.log(activities);
  };

  return (
    <div className="time-selection">
      <p>활동 시간을 선택해주세요.</p>
      {dateRange.map((date) => (
        <div key={date} className="date-time-box">
          <div className="date-box">
          <h4>일자</h4>
          <div>{date}</div>
          </div>
          <div>
            <label htmlFor={`start-time-${date}`}>시작 시간</label>
            <div className="time-input">
              <select
                value={activities[date]?.startTime?.split(":")[0] || "00"}
                onChange={(e) =>
                  handleStartTimeChange(
                    date,
                    formatTime(
                      e.target.value,
                      activities[date]?.startTime?.split(":")[1] || "00"
                    )
                  )
                }
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={String(i).padStart(2, "0")}>
                    {String(i).padStart(2, "0")}
                  </option>
                ))}
              </select>
              <span>:</span>
              <select
                value={activities[date]?.startTime?.split(":")[1] || "00"}
                onChange={(e) =>
                  handleStartTimeChange(
                    date,
                    formatTime(
                      activities[date]?.startTime?.split(":")[0] || "00",
                      e.target.value
                    )
                  )
                }
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={String(i * 5).padStart(2, "0")}>
                    {String(i * 5).padStart(2, "0")}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor={`end-time-${date}`}>종료 시간</label>
            <div className="time-input">
              <select
                value={activities[date]?.endTime?.split(":")[0] || "00"}
                onChange={(e) =>
                  handleEndTimeChange(
                    date,
                    formatTime(
                      e.target.value,
                      activities[date]?.endTime?.split(":")[1] || "00"
                    )
                  )
                }
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={String(i).padStart(2, "0")}>
                    {String(i).padStart(2, "0")}
                  </option>
                ))}
              </select>
              <span>:</span>
              <select
                value={activities[date]?.endTime?.split(":")[1] || "00"}
                onChange={(e) =>
                  handleEndTimeChange(
                    date,
                    formatTime(
                      activities[date]?.endTime?.split(":")[0] || "00",
                      e.target.value
                    )
                  )
                }
              >
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
