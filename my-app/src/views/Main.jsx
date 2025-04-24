import React, { useEffect, useState } from "react";

// assets
import picker from "../assets/logo/picker.png";
import searchButton from "../assets/images/search-button.png";

// css
import "./css/main.scss";
// data

function Main(props) {
  
  const [start, setStart] = useState(false);

  const clickEvent = {
    showSearch: () => {
      setStart(true);
    },
    showCityList: () => {
    },
  };
  const searchPlace =()=>{
   
  }
  
  return (
    <div className="container">
      <div className="main-intro-box">
        <div className="main-intro-text">
          <div className="main-intro-title">
            <p>자유로운 여행을 하고싶어?</p>
          </div>
          <div className="main-intro-title">
            <p>시작해봐</p>
            <span className="main-intro-logo">
              TRIP
              <img src={picker} alt="picker" />
              PICKER
            </span>
          </div>
        </div>
      </div>
      {!start ? (
        <div className="main-intro-start-button">
          <button className="main-intro-button" onClick={clickEvent.showSearch}>
            시작하기
          </button>
        </div>
      ) : (
        <div className="main-intro-travle-location-search-box">
          <div className="main-intro-search-box" onClick={clickEvent.showCityList}>
            <input type="text" className="main-intro-search-input" placeholder="여행지 검색하기" />
            <button className="main-intro-search-button">
              <img src={searchButton} alt="검색버튼" />
            </button>
          </div>
          {/* {!cityLIst ? null : (
            <div className="main-intro-recommend-location-list">
              <ul>
                {city.slice(0, 5).map((city, idx) => (
                  <li className="main-intro-city-list" key={idx}>
                    <div className="main-intro-location-image"></div>
                    <div className="main-intro-location-name">
                      <span className="main-intro-city-name-kr">{city.name}</span>
                      <span className="main-intro-city-name-en">{city.englishName}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )} */}
        </div>
      )}
    </div>
  );
}

export default Main;
