import React, { useEffect, useRef, useState } from "react";

// assets
import picker from "../assets/logo/picker.png";
import searchButton from "../assets/images/search-button.png";

// css
import "./css/main.scss";
// data

function Main(props) {
  const city = JSON.parse(localStorage.getItem("citys"));
  const [start, setStart] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [cityList, setCityList] = useState(city);
  const cityInfo = useRef(null);

  const clickEvent = {
    showSearch: () => {
      setStart(true);
    },
  };
  // 실시간 검색 함수
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    // 입력값에 따라 cityList 필터링
    const filteredCities = city.filter((item) => item.name.includes(value) || item.englishName.toLowerCase().includes(value.toLowerCase()));
    setCityList(filteredCities);
    console.log(filteredCities);
  };

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
            <input type="text" className="main-intro-search-input" placeholder="여행지 검색하기" value={inputValue} onChange={handleInputChange} />
            {/* <button className="main-intro-search-button">
              <img src={searchButton} alt="검색버튼" />
            </button> */}
          </div>

          <div className="main-intro-recommend-location-list">
            <ul>
              {cityList.length > 0 ? (
                cityList.map((city, idx) => (
                  <li className="main-intro-city-list" key={idx} onClick={()=>{cityInfo.current=city; console.log(cityInfo.current)}}>
                    <div className="main-intro-location-image"></div>
                    <div className="main-intro-location-name">
                      <span className="main-intro-city-name-kr">{city.name}</span>
                      <span className="main-intro-city-name-en">{city.englishName}</span>
                    </div>
                  </li>
                ))
              ) : (
                <li className="main-intro-city-list no-result">검색 결과가 없습니다.</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Main;
