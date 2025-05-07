import React, { useEffect, useState } from "react";

export default function PlaceList(props) {
  const { categoryColors, placesInfo } = props;

  //           function          //

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("삭제하시겠습니까?");
    if (confirmDelete) {
    }
  };
  const renderPlaceComponent = (category, places) => {
    // 카테고리별 설정
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
                  <span className="place-name">{place.name}</span>
                </div>
                <p className="place-address">{place.adress}</p>
              </div>
              <button className="delete-button" onClick={() => handleDelete(place.id)}>
                삭제
              </button>
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
