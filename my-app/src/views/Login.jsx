// Login 컴포넌트 - Login.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../stores/store.API";

// 이미지 import
import smallLogo from "../assets/logo/small-logo.png";
import google from "../assets/logo/google-logo.png";
import kakao from "../assets/logo/kakao-logo.png";
import naver from "../assets/logo/naver-logo.ico";

// scss
import "./css/login.scss";

function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isValid, setIsValid] = useState(false);
  const navigate = useNavigate();
  const setUser = useStore((state) => state.setUser); // Zustand 전역 상태에 저장하는 함수

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

    const matchedUser = storedUsers.find(
      (user) => user.email === username && user.password === password
    );

    if (matchedUser) {
      setIsValid(true); // 로그인 조건 통과
    } else {
      setIsValid(false); // 일치하는 사용자 없음
    }
  }, [username, password]);

  const handleLogin = (e) => {
    e.preventDefault();

    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

    const matchedUser = storedUsers.find(
      (user) => user.email === username && user.password === password
    );

    if (matchedUser) {
      sessionStorage.setItem("users", JSON.stringify(matchedUser)); // 세션 스토리지 저장
      setUser(matchedUser); // Zustand 전역 상태에 저장
      alert(`즐거운 여행 되세요!`);
      navigate("/");
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
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">
          <span className="logo-box">
            <img src={smallLogo} alt="logo" />
          </span>
        </h2>
        <form onSubmit={handleLogin}>
          <div className="inputText">이메일</div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
            required
          />
          <div className="passwordBox">
            <div className="inputText">비밀번호</div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              required
            />
            <div className="forgetPassword">비밀번호를 잊으셨나요?</div>
          </div>
          <button
            type="submit"
            className={`login-button ${isValid ? "active" : "inactive"}`}
          >
            로그인
          </button>
          <div className="joinBox">
            <div>아직 회원이 아니신가요?</div>
            <a
              href="#"
              className="registerButton"
              onClick={(e) => {
                e.preventDefault();
                navigate("/Join");
              }}
            >
              이메일로 회원가입하기
            </a>
          </div>
          <div className="divider">
            <span>or</span>
          </div>
          <div className="iconLoginBox">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert("소셜 로그인은 추후 업데이트 됩니다.");
              }}
            >
              <img className="iconLogo" src={google} alt="google logo" />
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert("소셜 로그인은 추후 업데이트 됩니다.");
              }}
            >
              <img className="iconLogo" src={kakao} alt="kakao logo" />
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert("소셜 로그인은 추후 업데이트 됩니다.");
              }}
            >
              <img className="iconLogo" src={naver} alt="naver logo" />
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
