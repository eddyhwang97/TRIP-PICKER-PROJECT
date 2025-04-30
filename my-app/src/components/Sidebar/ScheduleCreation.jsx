import React, {useState} from "react";

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
    date: "5/3 (토)",
    place: "경복궁",
    startTime: "09:00",
    endTime: "11:00",
  },
];

export default function ScheduleCreation({ onNext, onPrev }) {
  const [expandedDates, setExpandedDates] = useState([]);
  
  // 날짜별로 그룹화
  const grouped = tempSchedule.reduce((acc, curr) => {
    acc[curr.date] = acc[curr.date] || [];
    acc[curr.date].push(curr);
    return acc;
  }, {});

  const toggleDate = (date) => {
    setExpandedDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
    );
  };

  const sortedDates = Object.keys(grouped).sort();


  return (
    <div className="schedule-creation">
      <div className="schedule-summary">
        {sortedDates.map((date, idx) => (
         <div key={date} className="day-group">
         <h3 onClick={() => toggleDate(date)} className="day-title">
           📅 {idx + 1}일차 ({date})
         </h3>
         {expandedDates.includes(date) && (
           <ul className="place-list">
             {grouped[date].map((item, i) => (
               <li key={i} className="place-item">
                 <div className="place-name">{item.place}</div>
                 <div className="time-range">
                   {item.startTime} ~ {item.endTime}
                 </div>
               </li>
             ))}
           </ul>
         )}
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
