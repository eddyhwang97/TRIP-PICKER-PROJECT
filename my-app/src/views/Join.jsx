// join 컴포넌트 - join.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import smallLogo from "../assets/logo/small-logo.png";

import "./css/join.scss";

function Join(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [isPasswordMatch, setIsPasswordMatch] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 이메일, 비밀번호 정규식 검사
    if (emailRegex.test(username) && passwordRegex.test(password) && password===passwordCheck) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [username, password, passwordCheck]);

  useEffect(() => {
    if (password === passwordCheck && password.length > 0) {
      setIsPasswordMatch(true);
    } else {
      setIsPasswordMatch(false);
    }
  }, [password, passwordCheck]);

  const handleJoin = (e) => {
    e.preventDefault();
    if (isValid) {
      alert(`트립피커에 오신 것을 환영합니다 :)`);
      navigate("/Login");
    } else {
      alert("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  // 이메일 - @, 도메인 포함
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // 비밀번호 - 영문+숫자+특수문자 2개이상 + 8자 이상
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=(?:.*[!@#$%^&*()\-_=+[\]{};:'",.<>/?\\|`~]){2,}).{8,}$/;

  return (
    <div className="join-container">
      <div className="join-box">
        <h2 className="join-title">
          <span className="logo-box">
            <img src={smallLogo} alt="logo" />
          </span>
        </h2>
        <form onSubmit={handleJoin}>
          <div className="inputText">이메일</div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="join-input"
            required
          />
          <div className="passwordBox">
            <div className="inputText">비밀번호</div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="join-input"
              required
            />
          </div>
          <div className="passwordBox">
            <div className="inputText">비밀번호확인</div>
            <input
              type="password"
              value={passwordCheck}
              onChange={(e) => setPasswordCheck(e.target.value)}
              className="join-input"
              required
            />
            {passwordCheck && !isPasswordMatch && (
              <div className="error">비밀번호가 일치하지 않습니다.</div>
            )}
          </div>
          <button
            type="submit"
            className={`join-button ${isValid ? "active" : "inactive"}`}
          >
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
}

export default Join;
