import React, { useCallback, useRef, useState } from "react";
import { SidebarButton } from "../../../assets";
import "./style.scss";
export default function PlaceList(props) {
  const { placesInfo = {}, setPlacesInfo, placeType, checkInDate, setCheckInDate, checkOutDate, setCheckOutDate, dailyTimeSlots, handelClusterization, setStep } = props;
  // 수정 중인 장소의 ID를 저장하는 state 추가
  const [editingPlaceId, setEditingPlaceId] = useState(null);
  const inputRefs = useRef({});

  //           function : handleDelete          //
  // 장소 삭제
  const handleDelete = useCallback(
    (id) => {
      if (window.confirm("삭제하시겠습니까?")) {
        setPlacesInfo((prev) => {
          const updated = { ...prev };
          Object.keys(updated).forEach((category) => (updated[category] = updated[category].filter((place) => place.id !== id)));
          return updated;
        });
      }
    },
    [setPlacesInfo]
  );

  //           function : handleModified          //
  // 수정 버튼 클릭
  const handleModified = useCallback((id) => setEditingPlaceId(id), []);
  //           function : handleSaved          //
  // 저장 버튼 클릭
  const handleSaved = useCallback(
    (id) => {
      const newName = inputRefs.current[id]?.value || "";
      setPlacesInfo((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((category) => (updated[category] = updated[category].map((place) => (place.id === id ? { ...place, name: newName } : place))));
        return updated;
      });
      setEditingPlaceId(null);
    },
    [setPlacesInfo]
  );

  //           function : onHandelCheckInDate         //
  // 체크인 날짜 변경
  const onHandelCheckInDate = useCallback(
    (e, placeId) => {
      const selectedDate = e.target.value;
      setCheckInDate(selectedDate);
      setPlacesInfo((prev) => {
        const updated = { ...prev };
        updated.accommodation = updated.accommodation.map((place) => (place.id === placeId ? { ...place, checkIn: selectedDate } : place));
        return updated;
      });
    },
    [setCheckInDate, setPlacesInfo]
  );

  // 체크아웃 날짜 변경
  const onHandelCheckOutDate = useCallback(
    (e, placeId) => {
      const selectedDate = e.target.value;
      setCheckOutDate(selectedDate);
      setPlacesInfo((prev) => {
        const updated = { ...prev };
        updated.accommodation = updated.accommodation.map((place) => (place.id === placeId ? { ...place, checkOut: selectedDate } : place));
        return updated;
      });
    },
    [setCheckOutDate, setPlacesInfo]
  );
  //          function : 장소 카테고리별 렌더링          //
  // 카테고리별 렌더링
  const RenderPlaceComponent = useCallback(
    (category, places) => {
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
                    {editingPlaceId === place.id && <input ref={(el) => (inputRefs.current[place.id] = el)} defaultValue={place.name} />}
                  </div>
                  <p className="place-address">{place.adress}</p>
                </div>
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
    },
    [checkInDate, checkOutDate, dailyTimeSlots, editingPlaceId, handleDelete, handleModified, handleSaved, onHandelCheckInDate, onHandelCheckOutDate]
  );

  return (
    <>
      <div className="contents-container place-list-container">
        {Object.entries(placesInfo).map(([category, places]) => (
          <div key={category}>{RenderPlaceComponent(category, places)}</div>
        ))}
      </div>
      <SidebarButton step={3} setStep={setStep} handelClusterization={handelClusterization} />
    </>
  );
}
