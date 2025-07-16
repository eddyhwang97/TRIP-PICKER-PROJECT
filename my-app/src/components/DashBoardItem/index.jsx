import React, { useRef, useState } from "react";
import "./style.scss";

function DashBoardItem(props) {
  const { trip, mode, getCurrentTripData,setCheckedItems } = props;
  const [isChecked, setIsChecked] = useState(false);
  const checkRef = useRef();

  const handleCheck = () => {
    setIsChecked((prev) => !prev);
    setCheckedItems((prev) => [...prev, trip.id])
  };

  return (
    <div
      className="dashboard-right-trip-item"
      onClick={() => {
        if (mode === "E") {
          handleCheck();
        } else if (mode === "V") {
          getCurrentTripData(trip);
        }
      }}
    >
      <div className="dashboard-right-trip-item-thumb-box">
        <div className="dashboard-right-trip-item-thumb-image">
          {mode === "E" && (
            <input
              type="checkbox"
              ref={checkRef}
              checked={isChecked}
              onChange={handleCheck}
            />
          )}
        </div>
        <p className="dashboard-right-trip-item-thumb-title">{trip.title}</p>
      </div>
    </div>
  );
}

export default DashBoardItem;
