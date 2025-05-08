import React, { useEffect, useRef, useState } from "react";

export default function PlaceList(props) {
  const { categoryColors, placesInfo, setPlacesInfo } = props;

  // 수정 중인 장소의 ID를 저장하는 state 추가
  const [editingPlaceId, setEditingPlaceId] = useState(null);
  const placeRef = useRef(null);
  const inputRef = useRef(null);

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

  // 수정 버튼 클릭 시 해당 장소의 ID만 저장
  const handleModified = (id) => {
    setEditingPlaceId(id);
  };

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

  return (
    <div className="contents-container place-list-container">
      {Object.entries(placesInfo).map(([category, places]) => (
        <div key={category}>{renderPlaceComponent(category, places)}</div>
      ))}
    </div>
  );
}
