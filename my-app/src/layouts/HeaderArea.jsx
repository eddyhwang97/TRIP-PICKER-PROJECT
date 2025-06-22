import React from "react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../stores/store.API";
import { Link, useLocation } from "react-router-dom";
import smallLogo from "../assets/logo/small-logo.png";

import "./css/headerArea.scss";

function HeaderArea(props) {
  const navRef = useRef(null);
  const location = useLocation();
  const user = useStore((state) => state.user);
  const clearUser = useStore((state) => state.clearUser);
  const navigate = useNavigate();
  const handleLogout = (e) => {
    const confirmed = window.confirm("로그아웃 하시겠습니까?");
    if (confirmed) {
      clearUser();
      sessionStorage.clear();
      navigate("/");
    }
  };

  return (
    <>
      <div className="header">
        <section className="logo-box">
          <Link to={"/"}>
            <img src={smallLogo} />
          </Link>
        </section>
        <section className="nav-box" ref={navRef}>
          {/* 네비게이션 메뉴 */}
          <nav className="nav-menu">
            {user ? <Link to="/dashboard">DASHBOARD</Link> : null}
            {user ? (
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  handleLogout();
                }}
              >
                LOGOUT
              </a>
            ) : (
              <>
                <Link to="/login">LOGIN</Link>
                <Link to="/join">JOIN</Link>
              </>
            )}
          </nav>
        </section>
      </div>
    </>
  );
}

export default HeaderArea;
