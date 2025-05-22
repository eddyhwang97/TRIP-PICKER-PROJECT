import React, { useEffect, useRef, useState } from "react";
import { SidebarButton } from "../../../assets";
import "./style.scss";
export default function PlaceList(props) {
  const { placesInfo = {}, setPlacesInfo, placeType, checkInDate, setCheckInDate, checkOutDate, setCheckOutDate, dailyTimeSlots,handelClusterization } = props;
  // 수정 중인 장소의 ID를 저장하는 state 추가
  const [editingPlaceId, setEditingPlaceId] = useState(null);
  const placeRef = useRef(null);
  const inputRef = useRef(null);

  //           function : 장소 삭제          //
  const handleDelete = (id) => {
    const confirmDelete = window.confirm("삭제하시겠습니까?");
    if (confirmDelete) {
      setPlacesInfo((prevPlacesInfo) => {
        const updatedPlacesInfo = { ...prevPlacesInfo };
        Object.keys(updatedPlacesInfo).forEach((category) => {
          updatedPlacesInfo[category] = updatedPlacesInfo[category].filter((place) => place.id !== id);
        });
        return updatedPlacesInfo;
      });
    }
  };

  //           function : 장소 수정          //
  // 수정 버튼 클릭 시 해당 장소의 ID만 저장
  const handleModified = (id) => {
    setEditingPlaceId(id);
  };
  //           function : 장소 수정 후 저장          //
  // 저장 버튼 클릭 시 수정 모드 종료
  const handleSaved = (id) => {
    const newName = inputRef.current.value;
    setPlacesInfo((prevPlacesInfo) => {
      const updatedPlacesInfo = { ...prevPlacesInfo };
      Object.keys(updatedPlacesInfo).forEach((category) => {
        updatedPlacesInfo[category] = updatedPlacesInfo[category].map((place) => (place.id === id ? { ...place, name: newName } : place));
      });
      return updatedPlacesInfo;
    });
    setEditingPlaceId(null);
  };
  //           function : 숙소 날짜 변경 핸들러          //
  // 체크인 날짜 변경 시 저장 함수
  const onHandelCheckInDate = (e, placeId) => {
    const selectedDate = e.target.value;
    setCheckInDate(selectedDate);

    setPlacesInfo((prevPlacesInfo) => {
      const updatedPlacesInfo = { ...prevPlacesInfo };
      updatedPlacesInfo.accommodation = updatedPlacesInfo.accommodation.map((place) => (place.id === placeId ? { ...place, checkIn: selectedDate } : place));
      return updatedPlacesInfo;
    });
  };

  // 체크아웃 날짜 변경 시 저장 함수
  const onHandelCheckOutDate = (e, placeId) => {
    const selectedDate = e.target.value;
    setCheckOutDate(selectedDate);

    setPlacesInfo((prevPlacesInfo) => {
      const updatedPlacesInfo = { ...prevPlacesInfo };
      updatedPlacesInfo.accommodation = updatedPlacesInfo.accommodation.map((place) => (place.id === placeId ? { ...place, checkOut: selectedDate } : place));
      return updatedPlacesInfo;
    });
  };
  //          function : 장소 카테고리별 렌더링          //
  const renderPlaceComponent = (category, places) => {
    const categoryConfig = {
      accommodation: { title: "숙소", color: "category-red" },
      attraction: { title: "관광지", color: "category-green" },
      restaurant: { title: "식당", color: "category-blue" },
      cafe: { title: "카페", color: "category-yellow" },
    };

    const config = categoryConfig[category];
    if (!config) return null;

    return (
      <div className="place-category-container">
        <span className={`place-category ${config.color}`}>{config.title}</span>
        <ul className="place-list">
          {places.map((place) => (
            <li key={place.id} className="place-item">
              <div className="place-info">
                <div className="place-name-category">
                  {editingPlaceId !== place.id && <span className="place-name">{place.name}</span>}
                  {editingPlaceId === place.id && <input ref={inputRef} defaultValue={place.name} />}
                </div>
                <p className="place-address">{place.adress}</p>
              </div>
              {/* 숙소 선택 시 표시되는 체크인/체크아웃 입력 */}
              {category === "accommodation" && (
                <div className="accommodation-dates">
                  <label>
                    <span>체크인:</span>
                    <select value={place.checkIn || checkInDate} onChange={(e) => onHandelCheckInDate(e, place.id)} name="checkInDate" id="checkInDate">
                      {Object.keys(dailyTimeSlots)
                        .slice(0, -1)
                        .map((date) => (
                          <option key={date} value={date}>
                            {date}
                          </option>
                        ))}
                    </select>
                  </label>
                  <label>
                    <span>체크아웃:</span>
                    <select value={place.checkOut || checkOutDate} onChange={(e) => onHandelCheckOutDate(e, place.id)} name="checkOutDate" id="checkOutDate">
                      {Object.keys(dailyTimeSlots)
                        .slice(1)
                        .map((date) => (
                          <option key={date} value={date}>
                            {date}
                          </option>
                        ))}
                    </select>
                  </label>
                </div>
              )}
              <div className="button-box">
                {editingPlaceId !== place.id && (
                  <button className="modified-button" onClick={() => handleModified(place.id)}>
                    수정
                  </button>
                )}
                {editingPlaceId === place.id && (
                  <button className="modified-button" onClick={() => handleSaved(place.id)}>
                    저장
                  </button>
                )}
                <button className="delete-button" onClick={() => handleDelete(place.id)}>
                  삭제
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  //           render : 장소 리스트          //
  return (
    <>
      <div className="contents-container place-list-container">
        {Object.entries(placesInfo).map(([category, places]) => (
          <div key={category}>{renderPlaceComponent(category, places)}</div>
        ))}
      </div>
      <SidebarButton step={3} setStep={props.setStep} handelClusterization={handelClusterization} />
    </>
  );
}
