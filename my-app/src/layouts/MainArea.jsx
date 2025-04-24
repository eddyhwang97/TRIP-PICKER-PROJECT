import React from "react";
import { Outlet } from "react-router-dom";

import { initAllData } from "../contants/index";


function MainArea(props) {
  initAllData();
  return (
    <>
      <Outlet />
    </>
  );
}

export default MainArea;
