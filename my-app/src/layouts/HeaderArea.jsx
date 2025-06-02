import React from "react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../stores/store.API";
import { Link, useLocation } from "react-router-dom";
import smallLogo from "../assets/logo/small-logo.png";

import "./css/headerArea.scss";

function HeaderArea(props) {
  const [menuOpen, setMenuOpen] = useState(false);
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

  // Effect : 바깥 클릭 시 메뉴 닫기 //
  useEffect(() => {
    function handleClickOutside(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Effect : 페이지 이동시 메뉴 닫기 //
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <>
      <div className="header">
        <section className="logo-box">
          <Link to={"/"}>
            <img src={smallLogo} />
          </Link>
        </section>
        <section className="nav-box" ref={navRef}>
          {/* 햄버거 아이콘 (모바일용) */}
          <div
            className="hamburger"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>

          {/* 네비게이션 메뉴 */}
          <nav className={`nav-menu ${menuOpen ? "open" : ""}`}>
            <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
              DASHBOARD
            </Link>
            {user ? (
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  handleLogout();
                  setMenuOpen(false);
                }}
              >
                LOGOUT
              </a>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)}>
                  LOGIN
                </Link>
                <Link to="/join" onClick={() => setMenuOpen(false)}>
                  JOIN
                </Link>
              </>
            )}
          </nav>
        </section>
      </div>
    </>
  );
}

export default HeaderArea;
