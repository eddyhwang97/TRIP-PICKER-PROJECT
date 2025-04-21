import React from "react";
import { Outlet } from "react-router-dom";

function MainArea(props) {
  return (
    <>
      <Outlet />
    </>
  );
}

export default MainArea;
