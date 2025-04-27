import React from "react";
import editTripSidebar from "../css/editTripSidebar.scss";


export default function PlaceList({ sampleList, setSampleList, categoryColors, onNext, onPrev }) {
  const handleDelete = (id) => {
    const confirmDelete = window.confirm("삭제하시겠습니까?");
    if (confirmDelete) {
      setSampleList((prevList) => prevList.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="place-list-container">
      <ul className="place-list">
        {sampleList.map((item) => (
          <li key={item.id} className="place-item">
            <img
              src="https://via.placeholder.com/50"
              alt="장소"
              className="place-image"
            />
            <div className="place-info">
              <div className="place-name-category">
                <span className="place-name">{item.name}</span>
                <span className={`place-category ${categoryColors[item.category]}`}>
                  {item.category}
                </span>
              </div>
              <p className="place-address">{item.address}</p>
            </div>
            <button
              className="delete-button"
              onClick={() => handleDelete(item.id)}
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
      <div className="button-group">
        <button className="next-button" onClick={onNext}>
          날짜 선택하기 
        </button>
      </div>
    </div>
  );
}