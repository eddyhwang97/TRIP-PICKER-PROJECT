import React from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../stores/store.API";
import { Link } from "react-router-dom";
import smallLogo from "../assets/logo/small-logo.png";

import "./css/headerArea.scss";

function HeaderArea(props) {
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
          <Link to="/">main</Link>
          {/* <Link to="editTrip">editTrip</Link> */}
          <Link to="dashboard">dashboard</Link>
          {user ? (
            <>
              <a href="/" onClick={handleLogout}>
                Logout
              </a>
            </>
          ) : (
            <>
              <Link to="login">login</Link>
              <Link to="join">join</Link>
            </>
          )}
        </section>
      </div>
    </>
  );
}

export default HeaderArea;
