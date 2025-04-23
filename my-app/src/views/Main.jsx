import React, { useEffect, useState } from "react";

// assets
import picker from "../assets/logo/picker.png";
import searchButton from "../assets/images/search-button.png";

// css
import "./css/main.scss";
// data
import { citys } from "../contants";

function Main(props) {
  let city = Object.values(citys);
      city = city.map((city) => ({
        name: city.name,
        englishName: city.englishName,
        center: city.center,
        radiusKm: city.radiusKm,
      }));
  const [start, setStart] = useState(false);
  const [cityLIst, setCityList] = useState(false);

  const clickEvent = {
    showSearch: () => {
      setStart(true);
    },
    showCityList: () => {
      setCityList(true);
    },
  };
  
  return (
    <div className="container">
      <div className="introduction-box">
        <div className="introduction-text">
          <div className="introduction-title">
            <p>자유로운 여행을 하고싶어?</p>
          </div>
          <div className="introduction-title">
            <p>시작해봐</p>
            <span className="introduction-logo">
              TRIP
              <img src={picker} alt="picker" />
              PICKER
            </span>
          </div>
        </div>
      </div>
      {!start ? (
        <div className="start-button">
          <button className="button" onClick={clickEvent.showSearch}>
            시작하기
          </button>
        </div>
      ) : (
        <div className="travle-location-search-box">
          <div className="search-box" onClick={clickEvent.showCityList}>
            <input type="text" className="search-input" placeholder="여행지 검색하기" />
            <button className="search-button">
              <img src={searchButton} alt="검색버튼" />
            </button>
          </div>
          {!cityLIst ? null : (
            <div className="recommend-location-list">
              <ul>
                {city.slice(0, 5).map((city, idx) => (
                  <li className="city-list" key={idx}>
                    <div className="location-image"></div>
                    <div className="location-name">
                      <span className="city-name-kr">{city.name}</span>
                      <span className="city-name-en">{city.englishName}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Main;
