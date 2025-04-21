import React from "react";

import "./css/main.scss";
import picker from "../assets/logo/picker.png";

function Main(props) {
  return (
    <div className="container">
      <div className="introduction">
        <div>
          <p>자유로운 여행을 하고싶어?</p>
        </div>
        <div>
          <p>시작해봐</p>
          <span className="logo">
            TRIP
            <img src={picker} alt="picker" />
            PICKER
          </span>
        </div>
      </div>
      <div className="start-button">
        <button className="button">시작하기</button>
      </div>
    </div>
  );
}

export default Main;
