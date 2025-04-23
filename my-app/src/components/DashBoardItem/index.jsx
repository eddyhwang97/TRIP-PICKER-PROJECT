import React from "react";
import "./style.scss";

function DashBoardItem(props) {
    const { trip } = props;
    console.log(trip)
  return (
  
        <div className="dashboard-right-trip-item">
          <div className="dashboard-right-trip-item-thumb-box">
          <div className="dashboard-right-trip-item-thumb-image" style={{ backgroundImage: `url()` }}></div>
            <p className="dashboard-right-trip-item-thumb-title">{trip.title}</p>
          </div>
        </div>
    
  );
}

export default DashBoardItem;
