import React from "react";
import { Link } from "react-router-dom";
import smallLogo from "../assets/logo/small-logo.png";

import "./css/headerArea.scss";

function HeaderArea(props) {
  
  return (
    <>
      <div className="header">
        <section className="logo-box">
          <Link to={"/"}>
            <img src={smallLogo} />
          </Link>
        </section>
        <section className="nav-box" >
          <Link to="/">main</Link>
          <Link to="editTrip">editTrip</Link>
          <Link to="dashboard">dashboard</Link>
          <Link to="login">login</Link>
          <Link to="join">join</Link>
        </section>
      </div>
    </>
  );
}

export default HeaderArea;
