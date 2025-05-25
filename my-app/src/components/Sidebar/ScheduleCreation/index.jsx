import React, { useCallback, useEffect } from "react";
import { SidebarButton } from "../../../assets";
import "./style.scss";

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
  // 카테고리 색상
  const RenderCategory = (placeId) => {
    let categoryInfo;
    if (placeId.includes("accom")) {
      categoryInfo = ["숙소", "category-red"];
    } else if (placeId.includes("attr")) {
      categoryInfo = ["관광지", "category-green"];
    } else if (placeId.includes("rest")) {
      categoryInfo = ["식당", "category-blue"];
    } else if (placeId.includes("cafe")) {
      categoryInfo = ["카페", "category-yellow"];
    }

    return <span className={`place-category ${categoryInfo[1]}`}>{categoryInfo[0]}</span>;
  };

  return (
    <>
      <div className="contents-container schedule-creation">
        <div className="schedule-summary">
          {Object.entries(schedule).map(([day, dateInfo], index) => (
            <div className="day-group" key={day}>
              <h3 className="day-title">{`${index + 1}일차(${changeDateFormat(day)})`}</h3>
              <ul className="place-list">
                {[...(dateInfo.accommodation && dateInfo.accommodation[1] ? [dateInfo.accommodation[1]] : []), ...(dateInfo.places || []), ...(dateInfo.accommodation && dateInfo.accommodation[0] ? [dateInfo.accommodation[0]] : [])].map((place) => (
                  <li className="place-item" key={place.id}>
                    <div className="place-info">
                      <div className="place-name-category">
                        <span className="place-name">{place.name}</span>
                        {place.id && RenderCategory(place.id)}
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
