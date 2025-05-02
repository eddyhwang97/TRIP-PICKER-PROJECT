import React, { useEffect, useState } from "react";

export default function PlaceList(props) {
  const { categoryColors, placesInfo } = props;

  //           function          //

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("삭제하시겠습니까?");
    if (confirmDelete) {
    }
  };

  return (
    <div className="contents-container place-list-container">
      {Object.values(placesInfo).map((type, index) => (
        <ul className="place-list" key={index}>
          {type.map(
            (item) => (
              console.log(item),
              (
                <li key={item.id} className="place-item">
                  <img src={item.image} alt="장소" className="place-image" />
                  <div className="place-info">
                    <div className="place-name-category">
                      <span className="place-name">{item.name}</span>
                      <span className={`place-category ${categoryColors[item.category]}`}>{item.category}</span>
                    </div>
                    <p className="place-address"></p>
                  </div>
                  <button className="delete-button" onClick={() => handleDelete(item.id)}>
                    삭제
                  </button>
                </li>
              )
            )
          )}
        </ul>
      ))}
    </div>
  );
}
