import React, { useState, useEffect } from "react";

export default function TimeSelection(props) {
  const { tripDates, dailyTimeSlots, setDailyTimeSlots } = props;
  const [activities, setActivities] = useState({});

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

  // tripDates가 변경될 때 dailyTimeSlots 업데이트
  useEffect(() => {
    if (tripDates && tripDates.length === 2) {
      const newDailyTimeSlots = {};
      const currentDate = new Date(tripDates[0]);
      const endDate = new Date(tripDates[1]);

      while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split("T")[0];
        // 기존 dailyTimeSlots에서 해당 날짜의 데이터가 있으면 유지, 없으면 초기값 설정
        newDailyTimeSlots[dateStr] = dailyTimeSlots?.[dateStr] || {
          start: "00:00",
          end: "00:00",
        };
        currentDate.setDate(currentDate.getDate() + 1);
      }
      setDailyTimeSlots(newDailyTimeSlots);
    }
  }, [tripDates]);

  useEffect(() => {
    // dailyTimeSlots가 있을 경우 해당 데이터로 초기화
    if (dailyTimeSlots && Object.keys(dailyTimeSlots).length > 0) {
      const formattedActivities = {};
      Object.entries(dailyTimeSlots).forEach(([date, times]) => {
        const formattedDate = new Date(date);
        const month = formattedDate.getMonth() + 1;
        const day = formattedDate.getDate();
        const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][formattedDate.getDay()];
        const formattedDateStr = `${month}/${day} ${dayOfWeek}`;
        formattedActivities[formattedDateStr] = {
          start: times.start,
          end: times.end,
        };
      });
      setActivities(formattedActivities);
    } else {
      // dailyTimeSlots가 없을 경우 빈 데이터로 초기화
      const dateRange = generateDateRange(tripDates[0], tripDates[1]);
      const emptyActivities = dateRange.reduce((acc, date) => {
        acc[date] = { start: "00:00", end: "00:00" };
        return acc;
      }, {});
      setActivities(emptyActivities);
    }
  }, [tripDates, dailyTimeSlots]);

  // 유효성 검사
  const isEndTimeValid = (date) => {
    const { start, end } = activities[date];
    return end && start && end > start;
  };

  // 입력값 변경 함수
  const handleStartTimeChange = (date, time) => {
    setActivities((prev) => ({
      ...prev,
      [date]: {
        ...prev[date],
        start: time,
      },
    }));
  };

  const handleEndTimeChange = (date, time) => {
    setActivities((prev) => ({
      ...prev,
      [date]: {
        ...prev[date],
        end: time,
      },
    }));
  };

  useEffect(() => {
    console.log(activities);
    console.log(dailyTimeSlots);
  }, [activities]);

  const formatTime = (hours, minutes) => {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };

  // 폼 제출 시 처리 함수
  const handleSubmit = () => {
    const isValid = Object.keys(activities).every((date) => isEndTimeValid(date));
    if (!isValid) {
      alert("모든 날짜에 대해 종료 시간이 시작 시간보다 빠를 수 없습니다.");
      return;
    }

    // activities 데이터를 dailyTimeSlots 형식으로 변환
    const newDailyTimeSlots = {};
    Object.entries(activities).forEach(([dateStr, times]) => {
      const [month, day] = dateStr.split("/")[0].split(" ");
      const year = new Date().getFullYear();
      const date = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      newDailyTimeSlots[date] = {
        start: times.start,
        end: times.end,
      };
    });

    setDailyTimeSlots(newDailyTimeSlots);
    alert("활동 시간이 설정되었습니다!");
  };

  return (
    <div className="contents-container time-selection-container">
      {Object.keys(activities).map((date) => (
        <div key={date} className="date-time-box">
          <div className="date-box">
            <div className="date-title">일자</div>
            <div className="date">{date}</div>
          </div>
          <div>
            <label htmlFor={`start-time-${date}`}>시작 시간</label>
            <div className="time-input">
              <select value={activities[date]?.start?.split(":")[0] || "00"} onChange={(e) => handleStartTimeChange(date, formatTime(e.target.value, activities[date]?.startTime?.split(":")[1] || "00"))}>
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={String(i).padStart(2, "0")}>
                    {String(i).padStart(2, "0")}
                  </option>
                ))}
              </select>
              <span>:</span>
              <select value={activities[date]?.start?.split(":")[1] || "00"} onChange={(e) => handleStartTimeChange(date, formatTime(activities[date]?.startTime?.split(":")[0] || "00", e.target.value))}>
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
              <select value={activities[date]?.end?.split(":")[0] || "00"} onChange={(e) => handleEndTimeChange(date, formatTime(e.target.value, activities[date]?.endTime?.split(":")[1] || "00"))}>
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={String(i).padStart(2, "0")}>
                    {String(i).padStart(2, "0")}
                  </option>
                ))}
              </select>
              <span>:</span>
              <select value={activities[date]?.end?.split(":")[1] || "00"} onChange={(e) => handleEndTimeChange(date, formatTime(activities[date]?.endTime?.split(":")[0] || "00", e.target.value))}>
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
  );
}
