import React, { use, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import "./css/dashboard.scss";
import DashBoardItem from "../components/DashBoardItem";
import noticeIcon from "../assets/icon/notice.png";
import { useStore } from "../stores/store.API";
import { useNavigate } from "react-router-dom";

const citys = JSON.parse(localStorage.getItem("citys"));

function DashBoard(props) {
  const user = useStore((state) => state.user);
  const navigate = useNavigate();
  //           state          //
  const [tripList, setTripList] = useState([]);
  const [mode, setMode] = useState("V");
  const [checkedItems, setCheckedItems] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [cityList, setCityList] = useState(citys);
  const cityInfo = useRef(null);
  const tripRef = useRef(null);

  //           function : 여행목록 체크박스          //
  // 여행목록 체크박스 클릭 감지
  const handleCheck = (id, isChecked) => {
    setCheckedItems((prev) => (isChecked ? [...prev, id] : prev.filter((item) => item !== id)));
    // console.log(checkedItems);
  };
  const handleDeleteTripList = () => {
    setTripList((prev) => prev.filter((item) => !checkedItems.includes(item.id)));
  };

  //           function : 사용자 여행목록 가져오기          //
  const getTripList = () => {
    const userTirpList = user !== null ? JSON.parse(localStorage.getItem("trips")).filter((trip) => trip.userId === user.id) : [];
    setTripList(userTirpList);
    // console.log(userTirpList);
  };
  //          function : 클릭한 여행데이터 수집          //
  const getCurrentTripData = useCallback((trip) => {
    console.log(trip);
    tripRef.current = trip;
    const tripData = tripRef.current;
    navigateEditTrip(tripData);
  });

  //           function : navigation          //
  const navigateEditTrip = useCallback((tripData) => {
    navigate("/edittrip", { state: { tripData: tripData } });
  });

  //           function : 여행 생성          //
  const [newTrip, setNewTrip] = useState(false);

  const clickEvent = {
    showSearch: () => {
      setNewTrip(true);
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
      getCurrentTripData(tripData);
    },
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    // 입력값에 따라 cityList 필터링
    const filteredCities = citys.filter((item) => item.name.includes(value) || item.englishName.toLowerCase().includes(value.toLowerCase()));
    setCityList(filteredCities);
    console.log(filteredCities);
  };

  //           useLayoutEffect          //
  // 첫 랜더링시 여행 리스트 가져오기
  useLayoutEffect(() => {
    getTripList();
  }, []);

  //           render          //
  return (
    <div className="container">
      <div className="dashboard-box">
        <div className="dashboard-left">
          <section className="dashboard-left-top">
            <div className="dashboard-left-profile">
              <div className="dashboard-left-profile-image" style={{ backgroundImage: `url()` }}></div>
              <div className="dashboard-left-profile-user-info">
                <div className="dashboard-left-profile-user-info-name">
                  <span>{"이름"}</span>
                  <div className="dashboard-left-notice">
                    <button className="dashboard-left-notice-button">
                      <img src={noticeIcon} alt="알림" />
                    </button>
                  </div>
                </div>
                <span className="dashboard-left-profile-user-info-email">{"trippicker@email.com"}</span>
              </div>
            </div>
          </section>
          <section className="dashBoard-left-bottom">
            <div className="dashboard-left-bottom-trip-list">
              <p className="dashboard-left-bottom-trip-list-title">TRIP LIST</p>
              <div className="dashboard-left-bottom-trip-list-folder">
                <p className="dashboard-left-bottom-trip-list-folder-title">하와이 여행 일정</p>
                {/* <ul>
                  <li className="dashboard-left-bottom-trip-list-folder-item">ㄴ호놀룰루</li>
                  <li className="dashboard-left-bottom-trip-list-folder-item">ㄴ와이키키</li>
                </ul> */}
              </div>
              <div className="dashboard-left-bottom-trip-list-folder">
                <p className="dashboard-left-bottom-trip-list-folder-title">일본 여행 일정</p>
                {/* <ul>
                  <li className="dashboard-left-bottom-trip-list-folder-item">ㄴ이와테</li>
                  <li className="dashboard-left-bottom-trip-list-folder-item">ㄴ미야기</li>
                  <li className="dashboard-left-bottom-trip-list-folder-item">ㄴ후쿠시마</li>
                </ul> */}
              </div>
            </div>
          </section>
        </div>
        <div className="dashboard-right">
          <section className="dashboard-right-top">
            <div className="dashboard-right-top-title">Dash board</div>
            <div className="dashboard-right-top-edit">
              {mode === "V" && (
                <span className="dashboard-right-top-edit-button" onClick={() => setMode("E")}>
                  편집
                </span>
              )}
              {mode === "E" && (
                <>
                  <span className="dashboard-right-top-save-button" onClick={() => setMode("V")}>
                    저장
                  </span>
                  <span className="dashboard-right-top-delete-button" onClick={handleDeleteTripList}>
                    삭제
                  </span>
                </>
              )}
            </div>
          </section>
          <section className="dashboard-right-bottom">
            <div className="dashboard-right-trip-item-box">
              <div className="dashboard-right-trip-item-list">
                <div className="dashboard-right-trip-create-new-item" onClick={setNewTrip}>
                  <div className="dashboard-right-trip-item-thumb-box">
                    <div className="dashboard-right-trip-item-thumb-image">
                      {newTrip ? (
                        <div className="main-intro-travle-location-search-box">
                          <div className="main-intro-search-box" onClick={clickEvent.showCityList}>
                            <input type="text" className="main-intro-search-input" placeholder="여행지 검색하기" value={inputValue} onChange={handleInputChange} />
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
                      ) : (
                        <div className="plus-box">
                          <span></span>
                          <span></span>
                        </div>
                      )}
                    </div>
                    <p className="dashboard-right-trip-item-thumb-title">{"새로운 여행"}</p>
                  </div>
                </div>
                {tripList.map((trip) => (
                  <DashBoardItem getCurrentTripData={getCurrentTripData} key={trip.id} trip={trip} mode={mode} onCheck={handleCheck} />
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
