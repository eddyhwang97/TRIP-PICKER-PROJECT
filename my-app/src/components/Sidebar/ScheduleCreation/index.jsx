import React, { useCallback } from "react";
import { SidebarButton } from "../../../assets";
import "./style.scss";

// 카테고리 색상
const categoryColors = {
  accommodation: { title: "숙소", color: "category-red" },
  attraction: { title: "관광지", color: "category-green" },
  restaurant: { title: "식당", color: "category-blue" },
  cafe: { title: "카페", color: "category-yellow" },
};

export default function ScheduleCreation(props) {
  const { placesInfo, setPlacesInfo, dailyTimeSlots, schedule, setSchedule, handelClusterization } = props;

  // 날짜 변환
  const changeDateFormat = useCallback((dateStr) => {
    const daysKor = ["일", "월", "화", "수", "목", "금", "토"];
    const date = new Date(dateStr);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dayOfWeek = daysKor[date.getDay()];
    return `${month}/${day} ${dayOfWeek}`;
  }, []);

  // 리스트 삭제
  const handleDelete = useCallback(
    (placeId) => {
      if (window.confirm("삭제하시겠습니까?")) {
        setPlacesInfo((prevPlacesInfo) => {
          const updatedPlacesInfo = { ...prevPlacesInfo };
          Object.keys(updatedPlacesInfo).forEach((category) => {
            updatedPlacesInfo[category] = updatedPlacesInfo[category].filter((place) => place.id !== placeId);
          });
          return updatedPlacesInfo;
        });
      }
    },
    [setPlacesInfo]
  );

  return (
    <>
      <div className="contents-container schedule-creation">
        <div className="schedule-summary">
          {Object.entries(schedule).map(([day, places], index) => (
            <div className="day-group" key={day}>
              <h3 className="day-title">{`${index + 1}일차(${changeDateFormat(day)})`}</h3>
              <ul className="place-list">
                {places.map((place) => (
                  <li className="place-item" key={place.id}>
                    <div className="place-info">
                      <div className="place-name-category">
                        <span className="place-name">{place.name}</span>
                        <span className={`place-category ${categoryColors[place.type]?.color || ""}`}></span>
                      </div>
                      <div className="place-address">{place.adress}</div>
                    </div>
                    <button className="delete-button" onClick={() => handleDelete(place.id)}>
                      삭제
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <SidebarButton step={4} setStep={props.setStep} handelClusterization={handelClusterization} />
    </>
  );
}