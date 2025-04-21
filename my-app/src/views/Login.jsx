// Login 컴포넌트 - Login.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import smallLogo from "../assets/logo/small-logo.png";

// scss
import "./css/login.scss";
function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    alert(`로그인 시도: ${username}`);
  };

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
          <button type="submit" className="login-button">
            로그인
          </button>
          <div className="joinBox">
            <div>아직 회원이 아니신가요?</div>
            <a href="#" className="registerButton">
              이메일로 회원가입하기
            </a>
          </div>
          <div className="divider">
            <span>or</span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
