import React, { useEffect, useState } from "react";
import "./css/dashboard.scss";
import DashBoardItem from "../components/DashBoardItem";
import { trips } from "../contants";

function DashBoard(props) {
  const [tripList, setTripList] = useState([])

  // 사용자 여행 리스트 가져오기
  const getTripList = () => {
    const tripLists = trips.map((trip) => ({
      id: trip.id,
      userId: trip.userId,
      title: trip.title,
    }))
    setTripList(tripLists)
    console.log(tripLists)
  }

  useEffect(()=>{
    getTripList()
  },[])
  return (
    <div className="container">
      <div className="dashboard-box">
        <div className="dashboard-left">
          <section className="dashboard-left-top">
            <div className="dashboard-left-profile">
              <div className="dashboard-left-profile-image" style={{ backgroundImage: `url()` }}></div>
              <div className="dashboard-left-profile-user-info">
                <span className="dashboard-left-profile-user-info-name">{"이름"}</span>
                <span className="dashboard-left-profile-user-info-email">{"trippicker@email.com"}</span>
              </div>
            </div>
            <div className="dashboard-left-notice">
              <button className="dashboard-left-notice-button">종</button>
            </div>
          </section>
          <section className="dashBoard-left-middel">
            <div className="dashboard-left-middel-trip-list">
              <p className="dashboard-left-middel-trip-list-title">TRIP LIST</p>
              <div className="dashboard-left-middel-trip-list-folder">
                <p className="dashboard-left-middel-trip-list-folder-title">하와이 여행 일정</p>
                {/* <ul>
                  <li className="dashboard-left-middel-trip-list-folder-item">ㄴ호놀룰루</li>
                  <li className="dashboard-left-middel-trip-list-folder-item">ㄴ와이키키</li>
                </ul> */}
              </div>
              <div className="dashboard-left-middel-trip-list-folder">
              <p className="dashboard-left-middel-trip-list-folder-title">일본 여행 일정</p>
                {/* <ul>
                  <li className="dashboard-left-middel-trip-list-folder-item">ㄴ이와테</li>
                  <li className="dashboard-left-middel-trip-list-folder-item">ㄴ미야기</li>
                  <li className="dashboard-left-middel-trip-list-folder-item">ㄴ후쿠시마</li>
                </ul> */}
              </div>
            </div>
          </section>
        </div>
        <div className="dashboard-right">
          <section className="dashboard-right-top">
            <div className="dashboard-right-top-title">Dash board</div>
          </section>
          <section className="dashboard-right-middle">
            <div className="dashboard-right-trip-item-box">
              <div className="dashboard-right-trip-item-list">
                {tripList.map((trip) => <DashBoardItem key={trip.id} trip={trip} />)}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
