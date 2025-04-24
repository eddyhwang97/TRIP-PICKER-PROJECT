import React, { useState } from "react";
import "./style.scss";

function DashBoardItem(props) {
  const { trip, mode,onCheck } = props;
  const [isChecked, setIsChecked] = useState(false);

  const handleCheck = (e) => {
    const checked = e.target.checked;
    setIsChecked(checked);
    onCheck(trip.id, checked);
  };
  return (
    <div className="dashboard-right-trip-item">
      {mode === "E" && <input type="checkbox" checked={isChecked} onChange={handleCheck} />}
      <div className="dashboard-right-trip-item-thumb-box">
        <div className="dashboard-right-trip-item-thumb-image"></div>
        <p className="dashboard-right-trip-item-thumb-title">{trip.title}</p>
      </div>
    </div>
  );
}

export default DashBoardItem;
