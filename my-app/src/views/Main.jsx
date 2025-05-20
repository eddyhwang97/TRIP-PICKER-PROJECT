import React, { useEffect, useRef, useState } from "react";
import { useStore } from "../stores/store.API";

// assets
import picker from "../assets/logo/picker.png";
import searchButton from "../assets/images/search-button.png";

// css
import "./css/main.scss";
import { useNavigate } from "react-router-dom";
// data

function Main(props) {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const citys = JSON.parse(localStorage.getItem("citys"));
  const [start, setStart] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [cityList, setCityList] = useState(citys);
  const cityInfo = useRef(null);

  const clickEvent = {
    showSearch: () => {
      setStart(true);
    },
    makeTrip: (city) => {
      const usersTrip = user ? user.trips : null;
      const createTripId = usersTrip !== null ? (usersTrip.length < 10 ? `trip00${usersTrip.length + 1}` : usersTrip.length > 10 ? `trip0${usersTrip.length + 1}` : `trip${usersTrip.length + 1}`) : "trip001";
      const today = new Date();
      const todayDate = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, "0"), String(today.getDate()).padStart(2, "0")].join("-");
      let tripData;
      // 1. 로그인 상태일 경우
      if (user !== null) {
        // (1) 사용자 trips가 있을경우
        if (usersTrip.length > 0) {
          tripData = {
            id: createTripId,
            userId: user.id,
            title: "Untitled Trip",
            startDate: todayDate,
            endDate: todayDate,
            city: city.id,
            accommodation: [],
            attraction: [],
            restaurant: [],
            cafe: [],
            groupedByDate: {},
            dailyTimeSlots: {},
          };
        }
        // (2) 사용자 trips가 없을경우
        else if (usersTrip.length === 0) {
          tripData = {
            id: createTripId,
            userId: user.id,
            title: "Untitled Trip",
            startDate: todayDate,
            endDate: todayDate,
            city: city.id,
            accommodation: [],
            attraction: [],
            restaurant: [],
            cafe: [],
            groupedByDate: {},
            dailyTimeSlots: {},
          };
        }
      }
      // 2. 로그인 상태 아닐 경우(대쉬보드 또는 메인에서 넘어옴 => 무조건 새로운 생성)
      if (user === null) {
        tripData = {
          id: createTripId,
          userId: "unknown-host",
          title: "Untitled Trip",
          startDate: todayDate,
          endDate: todayDate,
          city: city.id,
          accommodation: [],
          attraction: [],
          restaurant: [],
          cafe: [],
          groupedByDate: {},
          dailyTimeSlots: {},
        };
      }
      console.log(tripData);
      navigate("/edittrip", { state: { tripData: tripData } });
    },
  };
  // 실시간 검색 함수
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    // 입력값에 따라 cityList 필터링
    const filteredCities = citys.filter((item) => item.name.includes(value) || item.englishName.toLowerCase().includes(value.toLowerCase()));
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
                  <li className="main-intro-city-list" key={idx} onClick={() => ((cityInfo.current = city), clickEvent.makeTrip(city))}>
                    <div className="main-intro-location-image">
                      <img src={city.image} alt={city.name} />
                    </div>
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
