import React from "react";
import editTripSidebar from "../../../views/css/editTripSidebar.scss";

const tempSchedule = [
  {
    date: "5/1 (목)",
    place: "서울타워",
    startTime: "10:00",
    endTime: "12:00",
  },
  {
    date: "5/2 (금)",
    place: "남산 한옥마을",
    startTime: "13:00",
    endTime: "15:00",
  },
  {
    date: "5/3 (토_",
    place: "경복궁",
    startTime: "09:00",
    endTime: "11:00",
  },
];

export default function ScheduleCreation({ onNext, onPrev }) {
  // 날짜별로 그룹화
  const grouped = tempSchedule.reduce((acc, curr) => {
    acc[curr.date] = acc[curr.date] || [];
    acc[curr.date].push(curr);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort();

  return (
    <div className="schedule-creation">
      <div className="schedule-summary">
        {sortedDates.map((date, idx) => (
          <div key={date} className="day-group">
            <h3>
              {idx + 1}일차 ({date})
            </h3>
            <ul>
              {grouped[date].map((item, i) => (
                <li key={i}>
                  <span className="place">{item.place}</span>{" "}
                  <span className="time">
                    ({item.startTime} ~ {item.endTime})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="button-group">
        <button className="prev-button" onClick={onPrev}>
          이전
        </button>
        <button className="next-button" onClick={onNext}>
          저장하기
        </button>
      </div>
    </div>
  );
}
