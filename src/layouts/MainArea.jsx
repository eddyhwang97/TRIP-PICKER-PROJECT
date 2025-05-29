import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";

import { initAllData } from "../contants/index";

function MainArea(props) {
  useEffect(() => {
    initAllData();
  }, []);
  return (
    <>
      <Outlet />
    </>
  );
}

export default MainArea;
