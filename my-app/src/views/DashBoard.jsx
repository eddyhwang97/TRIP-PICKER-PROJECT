import React, { useEffect, useState } from "react";
import "./css/dashboard.scss";
import DashBoardItem from "../components/DashBoardItem";
import noticeIcon from "../assets/icon/notice.png";

function DashBoard(props) {
  const [tripList, setTripList] = useState([]);
  const [mode, setMode] = useState("V");
  const [checkedItems, setCheckedItems] = useState([]);

  //           fucnction          //
  const getTripList = () => {
    const tripLists = trips.map((trip) => ({
      id: trip.id,
      userId: trip.userId,
      title: trip.title,
    }));
    setTripList(tripLists);
    console.log(tripLists);
  };

  const handleCheck = (id,isChecked) => {
    setCheckedItems((prev) =>
      isChecked ? [...prev, id] : prev.filter((item) => item !== id)
    );
    console.log(checkedItems);
  }
  const deleteTripList = () => {
    setTripList((prev) => prev.filter((item) => !checkedItems.includes(item.id)));
  }
  const saveTripList = () => {}

  //           useEffect          //
  // 첫 랜더링시 여행 리스트 가져오기
  useEffect(() => {
    getTripList();
  }, []);
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
                  <span className="dashboard-right-top-delete-button" onClick={deleteTripList}>삭제</span>
                </>
              )}
            </div>
          </section>
          <section className="dashboard-right-bottom">
            <div className="dashboard-right-trip-item-box">
              <div className="dashboard-right-trip-item-list">
                <div className="dashboard-right-trip-create-new-item">
                  <div className="dashboard-right-trip-item-thumb-box">
                    <div className="dashboard-right-trip-item-thumb-image">
                      <span></span>
                      <span></span>
                    </div>
                    <p className="dashboard-right-trip-item-thumb-title">{"새로운 여행"}</p>
                  </div>
                </div>
                {tripList.map((trip) => (
                  <DashBoardItem key={trip.id} trip={trip} mode={mode} onCheck={handleCheck} />
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
