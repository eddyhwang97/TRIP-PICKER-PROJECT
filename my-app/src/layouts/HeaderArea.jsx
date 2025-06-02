import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../stores/store.API";
import { Link } from "react-router-dom";
import smallLogo from "../assets/logo/small-logo.png";

import "./css/headerArea.scss";

function HeaderArea(props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useStore((state) => state.user);
  const clearUser = useStore((state) => state.clearUser);
  const navigate = useNavigate();
  const handleLogout = (e) => {
    e.preventDefault();
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
            <section className="nav-box">
      {/* 햄버거 아이콘 (모바일용) */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* 메뉴 목록 */}
      <nav className={`nav-menu ${menuOpen ? "open" : ""}`}>
        <Link to="dashboard">DASHBOARD</Link>
        {user ? (
          <a href="/" onClick={handleLogout}>
            LOGOUT
          </a>
        ) : (
          <>
            <Link to="login">LOGIN</Link>
            <Link to="join">JOIN</Link>
          </>
        )}
      </nav>
    </section>
      </div>
    </>
  );
}

export default HeaderArea;
